#!/usr/bin/env bash

# ╔═════════════════════════════════════════════════════════════════╗
# ║ 🌟 UNIVERSAL CROOKMON SETUP SCRIPT (works online & offline)     ║
# ╚═════════════════════════════════════════════════════════════════╝
#
# What this does (in order):
#   1. Detect whether node_modules / Jest already exist
#   2. If node_modules is missing, attempts a silent npm ci / npm install
#      – If the network is offline, we continue without failing.
#   3. Runs the more sophisticated Node setup script (setup-for-codex.js)
#      if present, otherwise falls back to shell fix-permissions script.
#   4. Verifies Jest can run and (optionally) executes the full test suite.
#
#   Run this with:  ./setup.sh   (remember: chmod +x setup.sh) or
#                   bash setup.sh
#
#   Designed to be idempotent – safe to run multiple times.

set -euo pipefail

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

info()   { echo -e "${YELLOW}▶ $*${NC}"; }
pass()   { echo -e "${GREEN}✔ $*${NC}"; }
fail()   { echo -e "${RED}✖ $*${NC}"; }

########################################################################
# 1. Ensure we are at repo root
########################################################################
if [ ! -f package.json ]; then
  fail "Please run this script from the project root (where package.json lives)."
  exit 1
fi

########################################################################
# 2. Install dependencies if node_modules is missing
########################################################################
if [ ! -d node_modules ]; then
  info "node_modules not found – attempting to install dependencies (offline-safe)"
  # Use npm ci first (fast / reproducible). Fallback to npm install if that fails.
  if npm ci --prefer-offline --no-audit --no-fund 2>/dev/null; then
    pass "Dependencies installed via npm ci"
  elif npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund 2>/dev/null; then
    pass "Dependencies installed via npm install"
  else
    info "Could not reach the registry – continuing with committed dependencies (if any)"
  fi
else
  pass "node_modules already present – skipping install"
fi

########################################################################
# 3. Run the main setup script to fix permissions & validate Jest
########################################################################
if [ -f setup-for-codex.js ]; then
  info "Executing setup-for-codex.js (comprehensive checks)"
  node setup-for-codex.js || info "setup-for-codex.js reported issues – continuing"
elif [ -f fix-permissions.js ]; then
  info "Executing fix-permissions.js (permission fix only)"
  node fix-permissions.js || info "fix-permissions.js reported issues – continuing"
elif [ -f setup-codex.sh ]; then
  info "Executing setup-codex.sh (legacy script)"
  bash setup-codex.sh || info "setup-codex.sh reported issues – continuing"
else
  info "No dedicated setup scripts found – skipping permission fix step"
fi

########################################################################
# 3.5. Fix known Vite/esbuild mismatch in offline Linux environments
########################################################################
if [ "$(uname -s 2>/dev/null || echo Unknown)" = "Linux" ]; then
  if node -e "require.resolve ? console.log('') : 0" 2>/dev/null; then :; fi
  if [ ! -d "node_modules/@esbuild/linux-x64" ]; then
    if [ -f "vendor/esbuild-linux-x64-0.25.7.tgz" ]; then
      info "Extracting pre-packed esbuild-linux-x64 binary (offline)"
      tar -xzf vendor/esbuild-linux-x64-0.25.7.tgz -C node_modules
      pass "esbuild-linux-x64 unpacked"
    else
      info "No pre-packed esbuild binary found – Vite may fail on Linux."
    fi
  else
    pass "esbuild-linux-x64 already present"
  fi
fi

########################################################################
# 3.6. Ensure esbuild binary on Windows (offline)
########################################################################
if [[ "$(uname -s 2>/dev/null || echo Unknown)" =~ MINGW|MSYS|CYGWIN ]] || [ "$OS" = "Windows_NT" ]; then
  if [ ! -d "node_modules/@esbuild/win32-x64" ]; then
    if [ -f "vendor/esbuild-win32-x64-0.25.7.tgz" ]; then
      info "Extracting pre-packed esbuild-win32-x64 binary (offline)"
      tar -xzf vendor/esbuild-win32-x64-0.25.7.tgz -C node_modules
      pass "esbuild-win32-x64 unpacked"
    else
      info "No pre-packed Windows esbuild binary found – dev server may fail on Windows."
    fi
  else
    pass "esbuild-win32-x64 already present"
  fi
fi

########################################################################
# 4. Quick smoke test – is Jest runnable?
########################################################################
if [ -x "node_modules/.bin/jest" ]; then
  if ./node_modules/.bin/jest --version >/dev/null 2>&1; then
    pass "Jest binary executes correctly"
  else
    fail "Jest binary exists but failed to run – you may need to run fix-permissions.js"
  fi
else
  info "Jest binary not found – tests may not be runnable (offline registry?)"
fi

########################################################################
# 5. Vite dev server smoke test
########################################################################
if command -v npx >/dev/null 2>&1; then
  info "Running Vite preview smoke test (port 4321)"
  npx vite preview --port 4321 --strictPort &
  VITE_PID=$!
  sleep 8
  if curl -sf http://localhost:4321 >/dev/null 2>&1; then
    pass "Vite served index.html successfully"
  else
    fail "Vite preview failed to respond – dev server may not work"
    kill $VITE_PID 2>/dev/null || true
    exit 1
  fi
  kill $VITE_PID 2>/dev/null || true
fi

echo ""
pass "SETUP SCRIPT FINISHED"
echo "You can now run: npm test   (or)   node test-runner.js"
