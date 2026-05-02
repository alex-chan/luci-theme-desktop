#!/bin/bash
# deploy.sh — 一键部署 luci-theme-desktop 到 OpenWrt 路由器
# Usage: ./deploy.sh [router_ip]

set -e

ROUTER=${1:-192.168.1.1}
SRC="$(cd "$(dirname "$0")" && pwd)"

echo "🖥️  luci-theme-desktop Deployer"
echo "================================"
echo "📡 Target: root@$ROUTER"
echo "📁 Source: $SRC"
echo ""

# Create remote directories
echo "📂 Creating directories..."
ssh root@$ROUTER "mkdir -p \
    /www/luci-static/desktop/css \
    /www/luci-static/resources \
    /usr/share/ucode/luci/template/themes/desktop"

# Deploy CSS
echo "🎨 Deploying CSS..."
scp -q "$SRC/htdocs/luci-static/desktop/css/cascade.css" root@$ROUTER:/www/luci-static/desktop/css/

# Deploy favicon
echo "🔷 Deploying favicon..."
scp -q "$SRC/htdocs/luci-static/desktop/favicon.ico" root@$ROUTER:/www/luci-static/desktop/

# Deploy JS
echo "⚡ Deploying JavaScript..."
scp -q "$SRC/htdocs/luci-static/resources/menu-desktop.js" root@$ROUTER:/www/luci-static/resources/

# Deploy templates
echo "📄 Deploying templates..."
scp -q "$SRC/ucode/template/themes/desktop/"*.ut root@$ROUTER:/usr/share/ucode/luci/template/themes/desktop/

# Set as default theme + restart services
echo "⚙️  Setting default theme..."
ssh root@$ROUTER "\
    uci set luci.main.mediaurlbase='/luci-static/desktop' && \
    uci commit luci && \
    /etc/init.d/rpcd restart 2>/dev/null; \
    /etc/init.d/uhttpd restart 2>/dev/null; \
    echo 'Theme activated!'"

echo ""
echo "✅ Deploy complete!"
echo "🌐 Open http://$ROUTER in your browser"
