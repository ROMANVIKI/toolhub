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
# toolhub
# toolhub
# toolhub
