// Environment variables bound to the Cloudflare Worker.
// Secrets set via `npx wrangler secret put`:
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
//   KEYGEN_ACCOUNT_ID, KEYGEN_ADMIN_TOKEN,
//   RESEND_API_KEY
// Vars set in wrangler.jsonc:
//   STRIPE_PRICE_ID_SINGLE_MONTHLY, STRIPE_PRICE_ID_SINGLE_ANNUAL
//   STRIPE_PRICE_ID_MULTI_MONTHLY, STRIPE_PRICE_ID_MULTI_ANNUAL
//   STRIPE_PRICE_ID_ENTERPRISE_MONTHLY, STRIPE_PRICE_ID_ENTERPRISE_ANNUAL
//   KEYGEN_POLICY_ID_SINGLE, KEYGEN_POLICY_ID_MULTI, KEYGEN_POLICY_ID_ENTERPRISE, KEYGEN_POLICY_ID_TRIAL
//
// LICENSE_SECRET was removed per ADR-007 — license keys are now validated
// online via Keygen's public validate-key endpoint (no shared secret needed).
interface Env {
  ASSETS: Fetcher;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PRICE_ID_SINGLE_MONTHLY: string;
  STRIPE_PRICE_ID_SINGLE_ANNUAL: string;
  STRIPE_PRICE_ID_MULTI_MONTHLY: string;
  STRIPE_PRICE_ID_MULTI_ANNUAL: string;
  STRIPE_PRICE_ID_ENTERPRISE_MONTHLY: string;
  STRIPE_PRICE_ID_ENTERPRISE_ANNUAL: string;
  KEYGEN_ACCOUNT_ID: string;
  KEYGEN_ADMIN_TOKEN: string;
  RESEND_API_KEY: string;
  KEYGEN_POLICY_ID_SINGLE: string;
  KEYGEN_POLICY_ID_MULTI: string;
  KEYGEN_POLICY_ID_ENTERPRISE: string;
  KEYGEN_POLICY_ID_TRIAL: string;
  // KV namespace for deduplicating renewal reminder emails
  RENEWAL_REMINDER_KV: KVNamespace;
}
