#!/usr/bin/env bash
set -euo pipefail

# meridian-os SAW refresh: build the LLM-disabled variant, sync it into the
# deploy repo, push. On the SAW server, `git pull` from the cloned repo
# picks up the change; IIS serves the new files immediately.

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

fail() { echo -e "${RED}ABORT:${NC} $1"; exit 1; }
ok()   { echo -e "${GREEN}OK:${NC} $1"; }

DEPLOY_REPO="${DEPLOY_REPO:-$HOME/GitHub_Repos/meridian-os-saw}"
SRC_DIST="dist-saw"

[ -d "$DEPLOY_REPO/.git" ] || fail "Deploy repo not found at $DEPLOY_REPO (set DEPLOY_REPO env var to override)."

echo "Running SAW build..."
npm run build:saw >/dev/null || fail "Build failed."
ok "Build succeeded ($SRC_DIST/)"

echo "Syncing $SRC_DIST/ → $DEPLOY_REPO/ ..."
# rsync with --delete so removed files in the build don't linger in the repo.
# Exclude .git so the deploy repo's history is preserved.
rsync -a --delete --exclude='.git' "$SRC_DIST/" "$DEPLOY_REPO/"
ok "Sync complete"

cd "$DEPLOY_REPO"
if git diff --quiet && git diff --cached --quiet; then
  ok "No changes — deploy repo already up to date"
  exit 0
fi

SRC_COMMIT="$(cd - >/dev/null && git rev-parse --short HEAD)"
git add -A
git commit -q -m "Refresh from meridian-os@$SRC_COMMIT."
ok "Committed: $(git log -1 --oneline)"

echo "Pushing to origin..."
git push -q origin main
ok "Pushed"

echo ""
echo -e "${GREEN}Deploy artifact updated.${NC} On SAW server:"
echo "  cd <iis-physical-path>"
echo "  git pull"
