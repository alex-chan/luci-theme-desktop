#!/usr/bin/env bash
# Build luci-theme-desktop_*_all.ipk in ./dist/ (no OpenWrt SDK required).
set -euo pipefail
cd "$(dirname "$0")"
exec python3 scripts/make-ipk.py "$@"
