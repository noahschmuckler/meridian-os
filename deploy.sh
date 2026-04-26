#!/usr/bin/env bash
set -euo pipefail

# meridian-os deploy: build + Cloudflare Pages deploy

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

fail() { echo -e "${RED}ABORT:${NC} $1"; exit 1; }
ok()   { echo -e "${GREEN}OK:${NC} $1"; }

# 1. Build
echo "Running production build..."
npm run build || fail "Build failed."
ok "Build succeeded"

# 2. Tag the deploy
TAG="deploy-$(date +%Y-%m-%d-%H%M)"
git tag "$TAG" 2>/dev/null && ok "Tagged as $TAG" || ok "Tag $TAG already exists, skipping"

# 3. Deploy
echo "Deploying dist/ to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=meridian-os --branch=main --commit-dirty=true
ok "Deployed to production"

echo ""
echo -e "${GREEN}Deploy complete.${NC} Tag: $TAG"
