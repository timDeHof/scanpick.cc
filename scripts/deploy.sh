#!/usr/bin/env bash
set -eo pipefail

# ═════════════════════════════════════════════════════════════════════════
#  Deploy the ScanPick Worker
#
#  LICENSE_SECRET auto-sync was removed per ADR-007 — license keys are
#  now validated online via Keygen's public validate-key endpoint.
#
#  Usage:
#    ./scripts/deploy.sh
#
#  Requires:
#    - npx (for wrangler)
# ═════════════════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Deploying Worker..."
cd "$SITE_DIR"
npm run build
npx wrangler deploy

echo ""
echo "✅ Deploy complete"
