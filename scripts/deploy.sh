#!/usr/bin/env bash
set -eo pipefail

# ═════════════════════════════════════════════════════════════════════════
#  Deploy the ScanPick Worker — sets LICENSE_SECRET automatically
#
#  Reads LICENSE_SECRET from the repo root .env and pushes it as a Worker
#  secret before deploying.  No more manual `wrangler secret put`.
#
#  Usage:
#    ./scripts/deploy.sh
#
#  Requires:
#    - npx (for wrangler)
#    - A .env file in the repo root with LICENSE_SECRET set
# ═════════════════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_DIR="$(cd "$SITE_DIR/.." && pwd)"

# ── Step 1: Read LICENSE_SECRET from repo root .env ────────────
ENV_FILE="$REPO_DIR/.env"
SECRET=""

if [[ -f "$ENV_FILE" ]]; then
  SECRET=$(grep -E '^LICENSE_SECRET=' "$ENV_FILE" | cut -d= -f2- || true)
fi

if [[ -z "$SECRET" ]]; then
  # Fall back to site/.env
  ENV_FILE="$SITE_DIR/.env"
  if [[ -f "$ENV_FILE" ]]; then
    SECRET=$(grep -E '^LICENSE_SECRET=' "$ENV_FILE" | cut -d= -f2- || true)
  fi
fi

if [[ -z "$SECRET" ]]; then
  echo "❌ LICENSE_SECRET not found in $REPO_DIR/.env or $SITE_DIR/.env"
  echo ""
  echo "   Generate one:"
  echo "     openssl rand -base64 32"
  echo ""
  echo "   Then add to .env:"
  echo "     LICENSE_SECRET=<your-secret>"
  exit 1
fi

echo "🔐 Setting LICENSE_SECRET..."
echo "$SECRET" | npx wrangler secret put LICENSE_SECRET

# ── Step 2: Deploy ─────────────────────────────────────────────
echo ""
echo "🚀 Deploying Worker..."
cd "$SITE_DIR"
npm run deploy

echo ""
echo "✅ Deploy complete — LICENSE_SECRET is in sync with your repo's .env"
