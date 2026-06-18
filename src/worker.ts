import Stripe from 'stripe';

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
    return;
  }

  const successBody = await response.json() as any;
  const licenseId = successBody?.data?.id || 'unknown';
  const licenseKey = successBody?.data?.attributes?.key || '';
  const expiry = successBody?.data?.attributes?.expiry || '';

  console.log(`Keygen: License created successfully! id=${licenseId}, key=${licenseKey}`);

  // Fire-and-forget email delivery — log failures but don't throw
  // Send the raw Keygen license key; the API validates it via online Keygen API (see ADR-007)
  await sendLicenseEmail(env, {
    to: customerEmail,
    planName,
    licenseKey,
    licenseId,
    expiry,
  });
}

interface LicenseEmailParams {
  to: string;
  planName: string;
  licenseKey: string;
  licenseId: string;
  expiry: string;
}

async function sendLicenseEmail(env: Env, params: LicenseEmailParams): Promise<void> {
  const { to, planName, licenseKey, licenseId, expiry } = params;

  if (!to) {
    console.warn('Email: No customer email address available — skipping send');
    return;
  }

  const expiryDate = new Date(expiry);
  const expiryFormatted = expiryDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    <tr>
      <td style="padding:32px 40px 0">
        <h1 style="font-size:24px;font-weight:700;color:#1a1a2e;margin:0">Your ScanPick license is ready</h1>
        <p style="font-size:15px;color:#475569;line-height:1.6;margin:12px 0 0">Thanks for purchasing <strong>${planName}</strong>! Your license key is below.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;text-align:center">
          <p style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px">License Key</p>
          <code style="font-size:18px;font-weight:600;color:#2563eb;word-break:break-all;font-family:'SF Mono',Consolas,monospace">${licenseKey}</code>
          <p style="font-size:13px;color:#64748b;margin:12px 0 0">Expires: ${expiryFormatted}</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:0 40px">
        <h2 style="font-size:16px;font-weight:600;color:#1a1a2e;margin:0 0 12px">Activation</h2>
        <p style="font-size:14px;color:#475569;line-height:1.6;margin:0">
          Log in to your <a href="https://scanpick.cc" style="color:#2563eb;text-decoration:underline">ScanPick Dashboard</a>,
          go to <strong>License Settings</strong>, and paste the license key from above to activate.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px 32px;border-top:1px solid #e2e8f0">
        <p style="font-size:13px;color:#94a3b8;margin:0 0 4px">
          Need help? Contact <a href="mailto:support@scanpick.cc" style="color:#2563eb;text-decoration:none">support@scanpick.cc</a>
        </p>
        <p style="font-size:13px;color:#94a3b8;margin:0">
          ScanPick &mdash; Warehouse wave-picking simplified.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Your ScanPick license is ready
===========================
Plan: ${planName}
License Key: ${licenseKey}
Expires: ${expiryFormatted}

Activation:
  Log in to your ScanPick Dashboard (https://scanpick.cc),
  go to License Settings, and paste your license key to activate.

Dashboard: https://scanpick.cc
Support: support@scanpick.cc`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ScanPick <noreply@deliveries.scanpick.cc>',
        to: [to],
        subject: `Your ScanPick ${planName} license is ready`,
        html,
        text,
      }),
    });

    if (res.ok) {
      const data = await res.json() as { id: string };
      console.log(`Email: Sent to ${to} — id=${data.id}`);
    } else {
      const errBody = await res.text();
      console.error(`Email: Resend returned ${res.status} — ${errBody}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Email: Failed to send to ${to} — ${message}`);
    // Do not rethrow — failing to send email should not block the webhook
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

// ── Scheduled (Cron) ──────────────────────────────────────────────────────────
// Daily cron trigger for renewal reminder emails at 30/14/7 days before expiry.
// The cron schedule "0 0 * * *" runs daily at midnight UTC (configured in wrangler.jsonc).

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

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(handleScheduledReminders(env));
  },
};

// ── Renewal Reminder Intervals ────────────────────────────────────────────────
// We send renewal reminder emails at three intervals before a license expires.
const RENEWAL_REMINDER_DAYS = [30, 14, 7];

interface RenewalReminderEmailParams {
  to: string;
  planName: string;
  licenseKey: string;
  expiry: string;
  daysRemaining: number;
}

/**
 * Daily cron handler: queries Keygen for licenses expiring within the next 31
 * days, calculates days-remaining for each, and sends a tiered reminder email
 * at the 30-, 14-, and 7-day marks. KV-backed dedup prevents duplicate sends
 * per license per interval, even across cron restarts or redeploys.
 *
 * Dedup key format: `reminder:{licenseId}:{days}` value = expiry ISO date.
 * If a license is renewed (expiry changes), a new key is effectively used
 * because the stored value won't match the new expiry.
 */
async function handleScheduledReminders(env: Env): Promise<void> {
  const now = new Date();

  // Fetch all non-expired licenses with an expiry in the next 31 days.
  // The extra day beyond the 30-day reminder window ensures we don't miss
  // licenses right at the boundary due to time-of-day differences.
  const upperBound = new Date(now);
  upperBound.setDate(upperBound.getDate() + 31);

  console.log(`Cron: Checking for licenses expiring between ${now.toISOString()} and ${upperBound.toISOString()}`);

  let licenses: any[] = [];
  let pageUrl: string | null =
    `https://api.keygen.sh/v1/accounts/${env.KEYGEN_ACCOUNT_ID}/licenses?` +
    `filter[expiry][gte]=${encodeURIComponent(now.toISOString())}&` +
    `filter[expiry][lte]=${encodeURIComponent(upperBound.toISOString())}&` +
    `limit=100`;

  // Paginate through all matching licenses
  while (pageUrl) {
    const response = await fetch(pageUrl, {
      headers: {
        Authorization: `Bearer ${env.KEYGEN_ADMIN_TOKEN}`,
        Accept: 'application/vnd.api+json',
      },
    });

    if (!response.ok) {
      console.error(`Cron: Failed to list licenses — ${response.status} ${await response.text()}`);
      return;
    }

    const data = await response.json() as { data?: any[]; links?: { next?: string } };
    const batch = data?.data || [];
    licenses.push(...batch);

    // Follow pagination link if present
    pageUrl = data?.links?.next || null;
  }

  console.log(`Cron: Found ${licenses.length} license(s) expiring within 31 days`);

  for (const license of licenses) {
    const expiry = license?.attributes?.expiry;
    if (!expiry) {
      continue;
    }

    const expiryDate = new Date(expiry);
    const msRemaining = expiryDate.getTime() - now.getTime();
    const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));

    for (const targetDay of RENEWAL_REMINDER_DAYS) {
      // ±1 day tolerance accounts for the daily cron cadence and time-of-day variation
      if (Math.abs(daysRemaining - targetDay) > 1) {
        continue;
      }

      const dedupKey = `reminder:${license.id}:${targetDay}`;

      // KV dedup check: if the stored expiry matches the current expiry, we've
      // already sent this reminder for this license at this interval.
      // If the value differs (e.g. license was renewed), we send again.
      try {
        const stored = await env.RENEWAL_REMINDER_KV.get(dedupKey);
        if (stored === expiry) {
          // Already sent this reminder for this expiry — skip
          continue;
        }
      } catch (kvError) {
        console.error(`Cron: KV read error for key "${dedupKey}" — ${kvError}`);
        // Continue to send on KV failure (fail-open: better to send a duplicate
        // than to miss a renewal reminder)
      }

      const customerEmail = license?.attributes?.metadata?.customerEmail || '';
      const planName =
        license?.attributes?.metadata?.planName ||
        license?.attributes?.name?.replace(/ — .*$/, '') ||
        'ScanPick';

      if (!customerEmail) {
        console.warn(`Cron: No customerEmail for license ${license.id} — skipping reminder`);
        continue;
      }

      const licenseKey = license?.attributes?.key || '';

      try {
        await sendRenewalReminderEmail(env, {
          to: customerEmail,
          planName,
          licenseKey,
          expiry,
          daysRemaining,
        });

        // Record that we sent this reminder. Use the expiry date as the value
        // so that if the license is renewed (expiry changes), a new KV entry
        // is effectively created (key is the same, but the stored value differs).
        await env.RENEWAL_REMINDER_KV.put(dedupKey, expiry, {
          expirationTtl: 90 * 24 * 60 * 60, // 90 days — well past any reminder window
        });

        console.log(`Cron: Sent ${targetDay}-day reminder for license ${license.id} → ${customerEmail}`);
      } catch (err) {
        console.error(`Cron: Failed to send ${targetDay}-day reminder for license ${license.id} — ${err}`);
        // Continue processing remaining licenses
      }
    }
  }

  console.log('Cron: Renewal reminder check complete');
}

async function sendRenewalReminderEmail(
  env: Env,
  params: RenewalReminderEmailParams,
): Promise<void> {
  const { to, planName, licenseKey, expiry, daysRemaining } = params;

  if (!to) {
    console.warn('Renewal email: No recipient address');
    return;
  }

  const expiryDate = new Date(expiry);
  const expiryFormatted = expiryDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const dayLabel = daysRemaining === 1 ? 'day' : 'days';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    <tr>
      <td style="padding:32px 40px 0">
        <h1 style="font-size:24px;font-weight:700;color:#1a1a2e;margin:0">Your license is expiring soon</h1>
        <p style="font-size:15px;color:#475569;line-height:1.6;margin:12px 0 0">
          Your <strong>${planName}</strong> license will expire in <strong>${daysRemaining} ${dayLabel}</strong> on <strong>${expiryFormatted}</strong>.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px">
        <div style="background:#fef9c3;border:1px solid #facc15;border-radius:8px;padding:16px;text-align:left">
          <p style="font-size:14px;color:#854d0e;margin:0;line-height:1.6">
            <strong>⏳ Act soon</strong> — after your license expires, the product will stop functioning
            and your team will lose access. Renew now to keep everything running.
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:0 40px">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;text-align:center">
          <p style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px">Your License Key</p>
          <code style="font-size:16px;font-weight:600;color:#2563eb;word-break:break-all;font-family:'SF Mono',Consolas,monospace">${licenseKey}</code>
          <p style="font-size:13px;color:#64748b;margin:12px 0 0">Plan: ${planName} — Expires: ${expiryFormatted}</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px">
        <table style="width:100%">
          <tr>
            <td style="text-align:center">
              <a href="https://scanpick.cc/#pricing" style="display:inline-block;padding:12px 32px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600">Renew Now</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px 32px;border-top:1px solid #e2e8f0">
        <p style="font-size:13px;color:#94a3b8;margin:0 0 4px">
          Need help? Contact <a href="mailto:support@scanpick.cc" style="color:#2563eb;text-decoration:none">support@scanpick.cc</a>
        </p>
        <p style="font-size:13px;color:#94a3b8;margin:0">
          ScanPick &mdash; Warehouse wave-picking simplified.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Your ScanPick license is expiring soon
=================================
Plan: ${planName}
License Key: ${licenseKey}
Expires: ${expiryFormatted}
Days remaining: ${daysRemaining}

Your license will expire in ${daysRemaining} ${dayLabel}. After expiry,
the product will stop working and your team will lose access. Renew now to keep everything running.

Renew here: https://scanpick.cc/#pricing

Need help? Contact support@scanpick.cc`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ScanPick <noreply@deliveries.scanpick.cc>',
      to: [to],
      subject: `Your ScanPick ${planName} license expires in ${daysRemaining} ${dayLabel}`,
      html,
      text,
    }),
  });

  if (res.ok) {
    const data = await res.json() as { id: string };
    console.log(`Renewal email: Sent to ${to} — id=${data.id}`);
  } else {
    const errBody = await res.text();
    console.error(`Renewal email: Resend returned ${res.status} — ${errBody}`);
  }
}

// encodeOfflineLicenseToken removed per ADR-007:
// License keys are sent raw (Keygen-issued) and validated
// online by the API via Keygen's validate-key endpoint.
