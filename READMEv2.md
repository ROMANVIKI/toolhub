# ToolHub

> Hardware Tool Inventory Management System  
> Built with **Tauri v2** · **React 18** · **Tailwind CSS v4**

---

## What is Tauri?

Tauri is a framework for building **native desktop applications** using web technologies
(HTML, CSS, JavaScript) for the UI and **Rust** for the backend/system layer.

Think of it as an alternative to Electron — but much lighter:

| | Tauri | Electron |
|---|---|---|
| Binary size | ~4–8 MB | ~80–120 MB |
| RAM usage | ~50–80 MB | ~150–300 MB |
| Startup time | < 200ms | 1–3s |
| Web engine | OS native (WebKit / WebView2) | Bundled Chromium |
| Backend language | Rust | Node.js |
| Frontend | Any (React, Vue, Svelte…) | Any |

**How it works:**

```
┌─────────────────────────────────────────┐
│           Native Window (OS)            │
│  ┌───────────────────────────────────┐  │
│  │     WebView (WebKit / WebView2)   │  │
│  │   React + Tailwind CSS frontend   │  │
│  └────────────────┬──────────────────┘  │
│                   │ invoke()            │
│  ┌────────────────▼──────────────────┐  │
│  │         Rust backend core         │  │
│  │   (file system, OS APIs, SQLite)  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

The frontend calls Rust functions via `invoke()` — no HTTP server, no ports, no extra
processes. Everything ships as a **single native binary**.

---

## Project Structure

```
toolhub/
│
├── index.html                       # Tauri webview entry point
├── vite.config.js                   # Vite + React + Tailwind plugins
├── package.json                     # JS dependencies and npm scripts
├── README.md
│
├── src/                             # React frontend
│   ├── main.jsx                     # Mounts React into #root
│   ├── App.jsx                      # Login ↔ MainApp state router
│   ├── data.js                      # All static data (tools, users, colors)
│   ├── index.css                    # Tailwind import + global base styles
│   │
│   └── components/
│       ├── LoginScreen.jsx          # RFID simulation + credential login form
│       ├── MainApp.jsx              # Topbar + sidebar toggle + layout shell
│       ├── Sidebar.jsx              # KEY mode (type filter) / FILTER mode (search + tray)
│       ├── StatBar.jsx              # Live summary counts (shown / good / worn / service)
│       ├── ToolTable.jsx            # Scrollable inventory table with sticky header
│       └── Badges.jsx               # CatBadge, CondBadge, TrayBadge reusable components
│
└── src-tauri/                       # Rust / Tauri backend
    ├── tauri.conf.json              # Window size, app ID, bundle targets
    ├── Cargo.toml                   # Rust crate dependencies
    ├── build.rs                     # Required tauri-build entry
    └── src/
        ├── main.rs                  # Binary entry (hides console on Windows release)
        └── lib.rs                   # App setup + Tauri commands (add yours here)
```

---

## Prerequisites

### Rust (required on all platforms)

```bash
# Linux / macOS
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Windows — download and run from:
# https://rustup.rs
```

Verify:
```bash
rustc --version    # should print rustc 1.75+ 
cargo --version
```

### Node.js (required on all platforms)

Download LTS from https://nodejs.org — version 18 or higher.

Verify:
```bash
node --version     # should print v18+
npm --version
```

---

## Setup on Linux (Ubuntu / Debian)

### Step 1 — Install system libraries

Tauri on Linux uses **WebKit2GTK** as the webview engine. It must be installed via apt:

```bash
sudo apt update && sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf \
  libssl-dev \
  libsoup-3.0-dev \
  libjavascriptcoregtk-4.1-dev
```

For **Fedora / RHEL**:
```bash
sudo dnf install webkit2gtk4.1-devel openssl-devel gtk3-devel \
  librsvg2-devel libappindicator-gtk3-devel
```

For **Arch Linux**:
```bash
sudo pacman -S webkit2gtk-4.1 gtk3 librsvg openssl
```

### Step 2 — Set up the project files

If you unzipped the files flat (all in one folder), run this to fix the structure:

```bash
cd ~/Projects/toolhub

mkdir -p src-tauri/src
mkdir -p src/components

# Rust files
mv Cargo.toml       src-tauri/
mv build.rs         src-tauri/
mv tauri.conf.json  src-tauri/
mv lib.rs           src-tauri/src/
mv main.rs          src-tauri/src/

# React component files
mv LoginScreen.jsx  src/components/
mv MainApp.jsx      src/components/
mv Sidebar.jsx      src/components/
mv ToolTable.jsx    src/components/
mv Badges.jsx       src/components/
mv StatBar.jsx      src/components/

# Root src/ files
mv App.jsx    src/
mv main.jsx   src/
mv index.css  src/
mv data.js    src/
```

### Step 3 — Install JS dependencies

```bash
npm install
```

### Step 4 — Run in development mode

```bash
npm run tauri dev
```

This opens a native window with **hot reload** — edit any `.jsx` or `.css` file and the
window updates instantly without restarting.

### Step 5 — Build for production

```bash
npm run tauri build
```

Output files:
```
src-tauri/target/release/bundle/
  ├── deb/toolhub_1.0.0_amd64.deb     ← Debian/Ubuntu installer
  ├── rpm/toolhub-1.0.0.x86_64.rpm    ← Fedora/RHEL installer
  └── appimage/toolhub_1.0.0.AppImage ← Portable, runs anywhere
```

---

## Setup on Windows

Windows is actually **simpler** than Linux — no system libraries to install manually.
Windows 10/11 ships with **WebView2** (Edge engine) built in, which Tauri uses automatically.

### Step 1 — Install Rust

Download and run the installer from https://rustup.rs

During install, choose **option 1** (default installation).

### Step 2 — Install Microsoft C++ Build Tools

Rust needs the MSVC compiler on Windows.

```powershell
winget install Microsoft.VisualStudio.2022.BuildTools
```

Or download from:
https://visualstudio.microsoft.com/visual-cpp-build-tools

During install, check **"Desktop development with C++"** and click Install.

> If you already have Visual Studio 2019 or 2022 installed with C++ workload, you can skip this step.

### Step 3 — Set up project files (if unzipped flat)

Open **PowerShell** in your project folder:

```powershell
cd C:\Projects\toolhub

New-Item -ItemType Directory -Force -Path src-tauri\src
New-Item -ItemType Directory -Force -Path src\components

# Rust files
Move-Item Cargo.toml      src-tauri\
Move-Item build.rs        src-tauri\
Move-Item tauri.conf.json src-tauri\
Move-Item lib.rs          src-tauri\src\
Move-Item main.rs         src-tauri\src\

# React component files
Move-Item LoginScreen.jsx  src\components\
Move-Item MainApp.jsx      src\components\
Move-Item Sidebar.jsx      src\components\
Move-Item ToolTable.jsx    src\components\
Move-Item Badges.jsx       src\components\
Move-Item StatBar.jsx      src\components\

# Root src/ files
Move-Item App.jsx    src\
Move-Item main.jsx   src\
Move-Item index.css  src\
Move-Item data.js    src\
```

### Step 4 — Install JS dependencies

```powershell
npm install
```

### Step 5 — Run in development mode

```powershell
npm run tauri dev
```

### Step 6 — Build for production

```powershell
npm run tauri build
```

Output files:
```
src-tauri\target\release\bundle\
  ├── msi\ToolHub_1.0.0_x64_en-US.msi    ← Windows installer (MSI)
  └── nsis\ToolHub_1.0.0_x64-setup.exe   ← Standalone installer (NSIS)
```

Both installers work on Windows 10 and Windows 11. End users do **not** need
Node.js, Rust, or any other runtime installed — the `.exe` / `.msi` is fully self-contained.

---

## Demo Accounts

| Username | Password | RFID |
|----------|----------|------|
| admin | admin123 | RFID-001 |
| tech01 | tech2024 | RFID-002 |
| engineer | eng@hub | RFID-003 |

The **SCAN RFID CARD** button simulates an RFID-002 scan and logs in as **tech01** after 1.8 seconds.

---

## Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run only the Vite frontend (browser, no native window) |
| `npm run build` | Build the frontend to `dist/` |
| `npm run tauri dev` | Full dev mode — native window + hot reload |
| `npm run tauri build` | Production build — native binary + installer |

---

## Adding a Rust Backend Command

When you need to persist data, call OS APIs, or talk to hardware, add a Tauri command
in `src-tauri/src/lib.rs`:

```rust
#[tauri::command]
fn save_tool(id: u32, condition: String) -> Result<(), String> {
    println!("Saving tool {} → {}", id, condition);
    // write to SQLite, JSON file, serial port, etc.
    Ok(())
}
```

Register it in the same file:
```rust
.invoke_handler(tauri::generate_handler![save_tool])
```

Call it from any React component:
```js
import { invoke } from "@tauri-apps/api/core";

await invoke("save_tool", { id: tool.id, condition: "Worn" });
```

For a database, add to `src-tauri/Cargo.toml`:
```toml
[dependencies]
rusqlite = { version = "0.31", features = ["bundled"] }
```

No external database server needed — SQLite runs embedded inside the app binary.

---

## Troubleshooting

### `webkit2gtk-4.1` not found (Linux)
Run the apt install command in **Step 1** of the Linux setup above.

### `cargo metadata` failed / can't find library `toolhub_lib`
Your files are in the wrong folders. Run the **Step 2** file-move commands above.

### `MSVC not found` (Windows)
Install **Microsoft C++ Build Tools** with the "Desktop development with C++" workload
(Step 2 of Windows setup).

### `npm run tauri dev` opens a browser instead of a window
Make sure you ran `npm install` first — the `@tauri-apps/cli` package provides the
`tauri` command. If it still opens a browser, you are running `npm run dev` (Vite only)
instead of `npm run tauri dev`.

### Port 1420 already in use
Another process is using the dev port. Kill it:
```bash
# Linux / macOS
lsof -ti:1420 | xargs kill

# Windows
netstat -ano | findstr :1420
taskkill /PID <PID> /F
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Native shell | Tauri v2 | Window, OS APIs, bundling |
| Backend | Rust | System calls, future data layer |
| Frontend framework | React 18 | UI components and state |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Build tool | Vite 6 | Dev server + frontend bundler |
| Web engine (Linux) | WebKit2GTK 4.1 | Renders the frontend |
| Web engine (Windows) | WebView2 (Edge) | Renders the frontend |
