// Environment variables bound to the Cloudflare Worker.
// Secrets set via `npx wrangler secret put`:
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
//   KEYGEN_ACCOUNT_ID, KEYGEN_ADMIN_TOKEN,
//   RESEND_API_KEY
// Vars set in wrangler.jsonc:
//   STRIPE_PRICE_ID_SINGLE, STRIPE_PRICE_ID_MULTI, STRIPE_PRICE_ID_ENTERPRISE
//   KEYGEN_POLICY_ID_SINGLE, KEYGEN_POLICY_ID_MULTI, KEYGEN_POLICY_ID_ENTERPRISE
//
// LICENSE_SECRET was removed per ADR-007 — license keys are now validated
// online via Keygen's public validate-key endpoint (no shared secret needed).
interface Env {
  ASSETS: Fetcher;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PRICE_ID_SINGLE: string;
  STRIPE_PRICE_ID_MULTI: string;
  STRIPE_PRICE_ID_ENTERPRISE: string;
  KEYGEN_ACCOUNT_ID: string;
  KEYGEN_ADMIN_TOKEN: string;
  RESEND_API_KEY: string;
  KEYGEN_POLICY_ID_SINGLE: string;
  KEYGEN_POLICY_ID_MULTI: string;
  KEYGEN_POLICY_ID_ENTERPRISE: string;
}
