# luci-theme-desktop

🖥️ **A stunning desktop-class theme for OpenWrt LuCI, inspired by fnOS (飞牛OS)**

Transform your OpenWrt router's web interface into a modern desktop-like operating system experience with window management, dock navigation, taskbar, and beautiful glassmorphism effects.

## ✨ Features

- **Desktop-style UI** — Full desktop environment with top bar, dock, window management, and taskbar
- **fnOS-inspired design** — Beautiful glassmorphism, gradients, and modern aesthetics
- **Window chrome** — macOS-style window title bar with traffic light buttons
- **Application dock** — Left sidebar with icon-based navigation and submenu support
- **Start menu** — Application grid launcher with search functionality
- **System tray** — Real-time CPU, memory, and network status in the taskbar
- **Live clock** — Current date and time in top bar and taskbar
- **Stunning login page** — Particle animations, glassmorphism cards, live clock
- **Dark mode first** — Beautiful deep purple-blue dark palette
- **Responsive** — Gracefully adapts to mobile and tablet screens
- **Font Awesome icons** — Rich icon set throughout the interface

## 📸 Design Highlights

| Component | Description |
|-----------|-------------|
| Top Bar | System hostname, page breadcrumb, clock, user menu |
| Left Dock | Collapsible sidebar with icon navigation |
| Main Window | Glass-morphism window with titlebar |
| Taskbar | Start menu, active apps, system tray, clock |
| Login | Full-screen animated login with particles |

## 🚀 Installation

### Build from source
```bash
cd openwrt/package
git clone https://github.com/your-repo/luci-theme-desktop.git
make menuconfig  # Choose LuCI -> Themes -> luci-theme-desktop
make -j$(nproc) V=s
```

### Install pre-built .ipk
```bash
opkg install luci-theme-desktop_*.ipk
```

### Set as default theme
The theme automatically sets itself as default on installation. You can also change it manually:

**System → System → Language and Style → Design → desktop**

## 📂 Project Structure

```
luci-theme-desktop/
├── Makefile                              # OpenWrt build package
├── LICENSE                               # Apache 2.0
├── README.md
├── htdocs/
│   └── luci-static/
│       ├── desktop/
│       │   ├── css/
│       │   │   └── cascade.css           # Main stylesheet
│       │   └── favicon.ico
│       └── resources/
│           └── menu-desktop.js           # Menu rendering module
├── ucode/
│   └── template/
│       └── themes/
│           └── desktop/
│               ├── header.ut             # Header template
│               ├── footer.ut             # Footer template
│               └── sysauth.ut            # Login page template
└── root/
    └── etc/
        └── uci-defaults/
            └── 99_luci-theme-desktop     # Post-install default theme
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0f1123` | Main background |
| Surface | `#1e2142` | Cards & panels |
| Accent Primary | `#7c4dff` | Primary actions |
| Accent Secondary | `#536dfe` | Secondary actions |
| Success | `#69f0ae` | Success states |
| Warning | `#ffd740` | Warning states |
| Error | `#ff5252` | Error states |
| Text Primary | `#e8eaf6` | Main text |
| Text Secondary | `#9fa8da` | Secondary text |

## 🔧 Requirements

- OpenWrt 23.05+ (ucode template support)
- Modern browser (Chrome, Firefox, Safari, Edge)

## 📄 License

Apache License 2.0

## 🙏 Credits

- Inspired by [fnOS (飞牛OS)](https://www.fnnas.com/) desktop interface
- Referenced [luci-theme-argon](https://github.com/jerrykuku/luci-theme-argon) for LuCI integration patterns
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter) for typography
