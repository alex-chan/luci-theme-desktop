#
# Copyright (C) 2024-2026 LuCI Desktop Theme
#
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=Desktop Theme (fnOS-style)
LUCI_DEPENDS:=
PKG_VERSION:=1.0.0
PKG_RELEASE:=20260502

CONFIG_LUCI_CSSTIDY:=

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
