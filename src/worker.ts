import Stripe from 'stripe';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Route matching uses startsWith for robustness against
    // potential trailing slashes or query parameters.
    if (url.pathname.startsWith('/api/create-checkout-session') && request.method === 'POST') {
      return handleCreateCheckoutSession(request, env);
    }

    if (url.pathname.startsWith('/api/stripe-webhook') && request.method === 'POST') {
      return handleStripeWebhook(request, env, ctx);
    }

    if (url.pathname.startsWith('/api/verify-license') && request.method === 'GET') {
      return handleVerifyLicense(request, env);
    }

    // All other paths: serve the SPA static assets
    // SPA fallback handled by wrangler.jsonc not_found_handling: single-page-application
    return env.ASSETS.fetch(request);
  },
};

async function handleCreateCheckoutSession(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const { priceId, planName } = await request.json() as {
      priceId: string;
      planName: string;
    };

    if (!priceId || !planName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: priceId, planName' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: 'https://scanpick.cc/thank-you?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://scanpick.cc/#pricing',
      metadata: {
        planName,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleStripeWebhook(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  try {
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    const body = await request.text();

    const event = await stripe.webhooks.constructEventAsync(body, signature, env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // Fire-and-forget the Keygen license creation so Stripe gets a quick 200
      ctx.waitUntil(createKeygenLicense(session, env));
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Signature verification or other errors
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Webhook error: ${message}`);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function createKeygenLicense(
  session: Stripe.Checkout.Session,
  env: Env,
): Promise<void> {
  const customerEmail =
    session.customer_email || session.customer_details?.email || '';
  const planName = session.metadata?.planName || 'Unknown';

  console.log(`Keygen: Starting license creation for planName="${planName}", email="${customerEmail}"`);

  // Annual license: expires 1 year from purchase date
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const policyId = resolvePolicyId(planName, env);
  console.log(`Keygen: Resolved policyId="${policyId}" (planName="${planName}")`);
  if (!policyId) {
    console.error(`Keygen: No policy for planName "${planName}" — aborting`);
    return;
  }

  console.log(`Keygen: POSTing to accounts/${env.KEYGEN_ACCOUNT_ID}/licenses`);

  const response = await fetch(
    `https://api.keygen.sh/v1/accounts/${env.KEYGEN_ACCOUNT_ID}/licenses`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.KEYGEN_ADMIN_TOKEN}`,
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'licenses',
          attributes: {
            name: `${planName} — ${customerEmail}`,
            expiry: expiresAt.toISOString(),
            metadata: {
              planName,
              customerEmail,
              stripeSessionId: session.id,
              amountTotal: session.amount_total ?? null,
              currency: session.currency ?? null,
            },
          },
          relationships: {
            policy: {
              data: {
                type: 'policies',
                id: policyId,
              },
            },
          },
        },
      }),
    },
  );

  console.log(`Keygen: Response status=${response.status}`);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Keygen license creation failed: ${response.status} ${errorBody}`);
  } else {
    const successBody = await response.json();
    const licenseId = successBody?.data?.id || 'unknown';
    console.log(`Keygen: License created successfully! id=${licenseId}`);
  }
}

async function handleVerifyLicense(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  const licenseId = url.searchParams.get('license_id');

  if (!sessionId && !licenseId) {
    return new Response(
      JSON.stringify({ error: 'Provide session_id or license_id' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Fetch licenses from Keygen and find the one matching our session ID
  const response = await fetch(
    `https://api.keygen.sh/v1/accounts/${env.KEYGEN_ACCOUNT_ID}/licenses?limit=10`,
    {
      headers: {
        Authorization: `Bearer ${env.KEYGEN_ADMIN_TOKEN}`,
        Accept: 'application/vnd.api+json',
      },
    },
  );

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch licenses' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const data = await response.json();

  // If license_id given, find it directly
  if (licenseId) {
    const lic = data.data?.find((l: any) => l.id === licenseId);
    if (lic) {
      return new Response(JSON.stringify(lic, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'License not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Find by stripe session ID in metadata
  const matched = data.data?.filter((l: any) =>
    l.attributes?.metadata?.stripeSessionId === sessionId,
  );

  if (matched && matched.length > 0) {
    return new Response(JSON.stringify(matched, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ error: 'No license found for session', data: data.data?.map((l: any) => ({ id: l.id, name: l.attributes?.name, metadata: l.attributes?.metadata })) }),
    { status: 404, headers: { 'Content-Type': 'application/json' } },
  );
}

function resolvePolicyId(planName: string, env: Env): string | null {
  switch (planName) {
    case 'Single Site':
      return env.KEYGEN_POLICY_ID_SINGLE;
    case 'Multi Site':
      return env.KEYGEN_POLICY_ID_MULTI;
    case 'Enterprise':
      return env.KEYGEN_POLICY_ID_ENTERPRISE;
    default:
      return null;
  }
}
