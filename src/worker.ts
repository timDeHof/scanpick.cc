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

  // Annual license: expires 1 year from purchase date
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const policyId = resolvePolicyId(planName, env);
  if (!policyId) {
    return;
  }

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

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Keygen license creation failed: ${response.status} ${errorBody}`);
  }
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
