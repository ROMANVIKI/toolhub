# ToolHub — Tauri + React + Tailwind CSS

Hardware Tool Inventory Management System.  
Rebuilt from DearPyGui (Python) → Tauri v2 + React 18 + Tailwind CSS v4.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | https://nodejs.org |
| Rust | stable | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| Tauri CLI | v2 | included in devDependencies |

**Linux only** — also install these system libs:
```bash
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

---

## Quick Start

```bash
# 1. Install JS dependencies
npm install

# 2. Dev mode — hot-reloads the React frontend, opens native window
npm run tauri dev

# 3. Production build — outputs to src-tauri/target/release/bundle/
npm run tauri build
```

---

## Project Structure

```
toolhub/
├── index.html                   # Tauri webview entry
├── vite.config.js               # Vite + Tailwind + React plugins
├── package.json
│
├── src/
│   ├── main.jsx                 # React root mount
│   ├── App.jsx                  # Login ↔ MainApp state router
│   ├── index.css                # Tailwind import + custom base styles
│   ├── data.js                  # TOOLS, USERS, CAT, COND — all static data
│   └── components/
│       ├── LoginScreen.jsx      # RFID + credential login
│       ├── MainApp.jsx          # Topbar + sidebar + content shell
│       ├── Sidebar.jsx          # KEY mode (type filter) / FILTER mode (search+tray)
│       ├── StatBar.jsx          # Summary counts bar
│       ├── ToolTable.jsx        # Scrollable inventory table
│       └── Badges.jsx           # CatBadge, CondBadge, TrayBadge
│
└── src-tauri/
    ├── tauri.conf.json          # Window size, bundle targets, app ID
    ├── Cargo.toml               # Rust dependencies
    ├── build.rs                 # tauri-build required file
    └── src/
        ├── main.rs              # Binary entry (windows_subsystem = windows)
        └── lib.rs               # App setup + Tauri commands (add yours here)
```

---

## Adding a Backend (Rust commands)

When you're ready to persist data, add a command in `src-tauri/src/lib.rs`:

```rust
#[tauri::command]
fn save_tool(id: u32, condition: String) -> Result<(), String> {
    // write to SQLite, a JSON file, etc.
    Ok(())
}
```

Register it:
```rust
.invoke_handler(tauri::generate_handler![save_tool])
```

Call it from React:
```js
import { invoke } from "@tauri-apps/api/core";
await invoke("save_tool", { id: t.id, condition: "Worn" });
```

For SQLite, add `tauri-plugin-sql` to Cargo.toml — no separate server needed.

---

## Demo Accounts

| Username | Password |
|----------|----------|
| admin | admin123 |
| tech01 | tech2024 |
| engineer | eng@hub |

RFID scan (simulated) logs in as **tech01** after 1.8s.



# TOOLHUB — Configuration Guide

## Overview

TOOLHUB stores its configuration as a plain JSON file on disk. You can edit it either through the **Settings screen** inside the app, or manually using any text editor. Changes take effect on the next app reload.

---

## Config File Location

The config file is stored in your operating system's **app data directory**, under a folder named `toolhub`.

| OS | Path |
|----|------|
| **Windows** | `C:\Users\<YourName>\AppData\Roaming\toolhub\config.json` |
| **macOS** | `/Users/<YourName>/Library/Application Support/toolhub/config.json` |
| **Linux** | `/home/<YourName>/.config/toolhub/config.json` |

> **Tip — Windows shortcut:** Press `Win + R`, type `%APPDATA%\toolhub` and hit Enter to jump straight to the folder.

> **Tip — macOS shortcut:** In Finder, press `Cmd + Shift + G` and paste `~/Library/Application Support/toolhub`.

---

## Config File Structure

```json
{
  "app": {
    "name": "TOOLHUB",
    "tagline": "Hardware Inventory Management",
    "company": "Your Company",
    "version": "1.0.0",
    "logoPath": ""
  },
  "auth": {
    "loginButtonLabel": "",
    "logoutButtonLabel": "",
    "rfidLabel": "",
    "rfidScanLabel": "",
    "credentialsLabel": ""
  },
  "theme": {
    "accentColor": "#3b82f6",
    "fontFamily": "JetBrains Mono, Fira Code, Consolas, monospace"
  }
}
```

---

## Section Reference

### `app` — Application Identity

| Key | Type | Description |
|-----|------|-------------|
| `name` | string | App title shown in the top bar and login screen |
| `tagline` | string | Subtitle shown on the login screen |
| `company` | string | Company name displayed in the UI |
| `version` | string | Version string (display only, does not affect updates) |
| `logoPath` | string | Absolute path to a logo image (`png`, `jpg`, `svg`, `ico`, `webp`). Leave empty to use the default. |

### `auth` — Authentication Labels

These override the default text shown on the login screen. Leave any field empty to use the built-in default label.

| Key | Description |
|-----|-------------|
| `loginButtonLabel` | Text on the login/submit button |
| `logoutButtonLabel` | Text on the logout button |
| `rfidLabel` | Heading for the RFID scan section |
| `rfidScanLabel` | Text on the RFID scan button |
| `credentialsLabel` | Text on the divider between RFID and manual login |

### `theme` — Visual Appearance

| Key | Type | Description |
|-----|------|-------------|
| `accentColor` | hex string | Primary accent color used for borders, highlights, and buttons (e.g. `#3b82f6`) |
| `fontFamily` | string | CSS font-family string applied app-wide |

---

## Editing the Config

### Option 1 — Settings Screen (Recommended)

1. Launch TOOLHUB
2. From the main menu, click **Settings**
3. Edit any field and click **SAVE SETTINGS**
4. Reload the app for changes to take effect

### Option 2 — Manual JSON Edit

1. Close the app
2. Navigate to the config path for your OS (see table above)
3. Open `config.json` in any text editor (Notepad, VS Code, nano, etc.)
4. Edit the values, save the file
5. Relaunch the app

> **Warning:** If the JSON is malformed (missing comma, unclosed bracket, etc.), the app will fall back to defaults on next launch. Use a JSON validator like [jsonlint.com](https://jsonlint.com) if unsure.

---

## Logo Setup

The `logoPath` must be an **absolute path** to an image file on the local machine.

**Examples:**

```
# Windows
C:\Users\John\Pictures\company-logo.png

# macOS / Linux
/home/john/pictures/company-logo.png
```

Supported formats: `png`, `jpg`, `jpeg`, `svg`, `ico`, `webp`

You can also use the **BROWSE** button in the Settings screen to pick a file using the system file picker — this fills in the path automatically.

---

## Resetting to Defaults

To reset all settings to their defaults, either:

- **Delete** `config.json` — the app will regenerate it with defaults on next launch, **or**
- **Clear** all fields in the Settings screen and save

---

## Permissions

The app only reads and writes files inside `$APPDATA/toolhub/`. It does not access any other directory on your system except when you explicitly pick a logo file via the file browser.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Settings not saving | Check that `$APPDATA/toolhub/` exists and is not read-only |
| Logo not showing | Ensure the path is absolute and the file still exists at that location |
| App shows defaults after edit | Validate your JSON — a syntax error causes the file to be ignored |
| Config folder missing | Launch the app at least once — it creates the folder on first run |

---

## File Permissions (Tauri Scope)

The app is granted read/write access only to:

```
$APPDATA/**
```

This is enforced by Tauri's capability system (`capabilities/default.json`) and cannot be overridden at runtime.
