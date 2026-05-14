import { useState, useEffect } from "react";
import { appDataDir, join } from "@tauri-apps/api/path";
import { readTextFile, writeTextFile, exists, mkdir } from "@tauri-apps/plugin-fs";

export const DEFAULT_CONFIG = {
  app: {
    name: "TOOLHUB",
    tagline: "Hardware Inventory Management",
    version: "1.0.0",
    company: "Your Company",
    logoPath: "",
  },
  auth: {
    loginButtonLabel: "Sign In",
    logoutButtonLabel: "Log Out",
    rfidLabel: "RFID Authentication",
    rfidScanLabel: "Scan RFID Card",
    credentialsLabel: "OR CREDENTIALS",
  },
  menu: {
    centerLabel: "CORE",
    items: [
      { id: "tools", label: "TOOLS", icon: "⬡", position: "top" },
      { id: "service", label: "SERVICE", icon: "⚙", position: "right" },
      { id: "reports", label: "REPORTS", icon: "▤", position: "bottom-right" },
      { id: "settings", label: "SETTINGS", icon: "◈", position: "bottom-left" },
      { id: "users", label: "USERS", icon: "◎", position: "left" },
    ],
  },
  theme: {
    accentColor: "#3b82f6",
    fontFamily: "JetBrains Mono, Fira Code, Cascadia Code, Consolas, ui-monospace, monospace",
  },
};

export type AppConfig = typeof DEFAULT_CONFIG;

// Deep merge: recursively merges `override` into `base`
function deepMerge<T extends object>(base: T, override: Partial<T>): T {
  const result = { ...base };
  for (const key in override) {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (
      overrideVal &&
      typeof overrideVal === "object" &&
      !Array.isArray(overrideVal) &&
      typeof baseVal === "object"
    ) {
      result[key] = deepMerge(baseVal as object, overrideVal as object) as T[typeof key];
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal as T[typeof key];
    }
  }
  return result;
}

// Ensures the $APPDATA/com.toolhub.app/ directory exists, then returns the config path
async function getConfigPath(): Promise<string> {
  const dir = await appDataDir(); // e.g. C:\Users\<user>\AppData\Roaming\com.toolhub.app\
  const dirExists = await exists(dir);
  if (!dirExists) {
    await mkdir(dir, { recursive: true });
    console.info("Created app data directory:", dir);
  }
  return join(dir, "app.config.json");
}

let _cached: AppConfig | null = null;

// Load config from $APPDATA — creates the file with defaults if missing
export async function loadConfig(bustCache = false): Promise<AppConfig> {
  if (_cached && !bustCache) return _cached;

  try {
    const configPath = await getConfigPath();
    const fileExists = await exists(configPath);

    if (!fileExists) {
      // First run: write defaults so the user has a file to edit
      await writeTextFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
      console.info("Created default config at:", configPath);
      _cached = DEFAULT_CONFIG;
      return _cached;
    }

    const raw = await readTextFile(configPath);
    const parsed = JSON.parse(raw);
    _cached = deepMerge(DEFAULT_CONFIG, parsed); // safe deep merge
    return _cached;

  } catch (e) {
    console.error("Failed to load config:", e);
    _cached = DEFAULT_CONFIG;
    return _cached;
  }
}

// Save updated config back to $APPDATA
export async function saveConfig(updated: Partial<AppConfig>): Promise<void> {
  try {
    const merged = deepMerge(_cached ?? DEFAULT_CONFIG, updated);
    const configPath = await getConfigPath();
    await writeTextFile(configPath, JSON.stringify(merged, null, 2));
    _cached = merged; // update cache
  } catch (e) {
    console.error("Failed to save config:", e);
    throw e;
  }
}

// React hook
export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig()
      .then(setConfig)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const reload = () => {
    setLoading(true);
    setError(null);
    loadConfig(true)
      .then(setConfig)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return { config, loading, error, reload };
}


// import { useState, useEffect } from "react";
// import { appDataDir, join } from "@tauri-apps/api/path";
// import { readTextFile, writeTextFile, exists } from "@tauri-apps/plugin-fs";
//
// export const DEFAULT_CONFIG = {
//   app: {
//     name: "TOOLHUB",
// {
//   "$schema": "https://schema.tauri.app/config/2",
//   "productName": "ToolHub",
//   "version": "1.0.0",
//   "identifier": "com.toolhub.app",
//   "build": {
//     "beforeDevCommand": "npm run dev",
//     "devUrl": "http://localhost:1420",
//     "beforeBuildCommand": "npm run build",
//     "frontendDist": "../dist"
//   },
//   "app": {
//     "windows": [
//       {
//         "title": "ToolHub",
//         "width": 1340,
//         "height": 840,
//         "minWidth": 960,
//         "minHeight": 640,
//         "resizable": true,
//         "decorations": true
//       }
//     ],
//     "security": {
//       "csp": null
//     }
//   },
//   "bundle": {
//     "active": true,
//     "targets": [
//       "deb",
//       "appimage",
//       "msi",
//       "nsis"
//     ],
//     "icon": [
//       "icons/32x32.png",
//       "icons/128x128.png",
//       "icons/128x128@2x.png",
//       "icons/icon.icns",
//       "icons/icon.ico"
//     ]
//   }
// }
//     tagline: "Hardware Inventory Management",
//     version: "1.0.0",
//     company: "Your Company",
//     logoPath: "",
//   },
//   auth: {
//     loginButtonLabel: "Sign In",
//     logoutButtonLabel: "Log Out",
//     rfidLabel: "RFID Authentication",
//     rfidScanLabel: "Scan RFID Card",
//     credentialsLabel: "OR CREDENTIALS",
//   },
//   menu: {
//     centerLabel: "CORE",
//     items: [
//       { id: "tools", label: "TOOLS", icon: "⬡", position: "top" },
//       { id: "service", label: "SERVICE", icon: "⚙", position: "right" },
//       { id: "reports", label: "REPORTS", icon: "▤", position: "bottom-right" },
//       { id: "settings", label: "SETTINGS", icon: "◈", position: "bottom-left" },
//       { id: "users", label: "USERS", icon: "◎", position: "left" },
//     ],
//   },
//   theme: {
//     accentColor: "#3b82f6",
//     fontFamily: "JetBrains Mono, Fira Code, Cascadia Code, Consolas, ui-monospace, monospace",
//   },
// };
//
// export type AppConfig = typeof DEFAULT_CONFIG;
//
// // Deep merge: recursively merges `override` into `base`
// function deepMerge<T extends object>(base: T, override: Partial<T>): T {
//   const result = { ...base };
//   for (const key in override) {
//     const baseVal = base[key];
//     const overrideVal = override[key];
//     if (
//       overrideVal &&
//       typeof overrideVal === "object" &&
//       !Array.isArray(overrideVal) &&
//       typeof baseVal === "object"
//     ) {
//       result[key] = deepMerge(baseVal as object, overrideVal as object) as T[typeof key];
//     } else if (overrideVal !== undefined) {
//       result[key] = overrideVal as T[typeof key];
//     }
//   }
//   return result;
// }
//
// async function getConfigPath(): Promise<string> {
//   const dir = await appDataDir();   // e.g. C:\Users\<user>\AppData\Roaming\com.toolhub.app\
//   return join(dir, "app.config.json");
// }
//
// // Load config from $APPDATA — creates the file with defaults if missing
// export async function loadConfig(bustCache = false): Promise<AppConfig> {
//   if (_cached && !bustCache) return _cached;
//
//   try {
//     const configPath = await getConfigPath();
//     const fileExists = await exists(configPath);
//
//     if (!fileExists) {
//       // First run: write defaults so the user has a file to edit
//       await writeTextFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
//       console.info("Created default config at:", configPath);
//       _cached = DEFAULT_CONFIG;
//       return _cached;
//     }
//
//     const raw = await readTextFile(configPath);
//     const parsed = JSON.parse(raw);
//     _cached = deepMerge(DEFAULT_CONFIG, parsed); // safe deep merge
//     return _cached;
//
//   } catch (e) {
//     console.error("Failed to load config:", e);
//     _cached = DEFAULT_CONFIG;
//     return _cached;
//   }
// }
//
// // Save updated config back to $APPDATA
// export async function saveConfig(updated: Partial<AppConfig>): Promise<void> {
//   const merged = deepMerge(_cached ?? DEFAULT_CONFIG, updated);
//   const configPath = await getConfigPath();
//   await writeTextFile(configPath, JSON.stringify(merged, null, 2));
//   _cached = merged; // update cache
// }
//
// let _cached: AppConfig | null = null;
//
// // React hook
// export function useConfig() {
//   const [config, setConfig] = useState < AppConfig | null > (null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState < string | null > (null);
//
//   useEffect(() => {
//     loadConfig()
//       .then(setConfig)
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, []);
//
//   const reload = () => {
//     setLoading(true);
//     loadConfig(true).then(setConfig).finally(() => setLoading(false));
//   };
//
//   return { config, loading, error, reload };
// }
//
// // import { useState, useEffect } from "react";
// // import { resolveResource } from "@tauri-apps/api/path";
// // import { readTextFile, exists } from "@tauri-apps/plugin-fs";
// //
// // const DEFAULT_CONFIG = {
// //   app: {
// //     name: "TOOLHUB",
// //     tagline: "Hardware Inventory Management",
// //     version: "1.0.0",
// //     company: "Your Company",
// //     logoPath: "",
// //   },
// //   auth: {
// //     loginButtonLabel: "Sign In",
// //     logoutButtonLabel: "Log Out",
// //     rfidLabel: "RFID Authentication",
// //     rfidScanLabel: "Scan RFID Card",
// //     credentialsLabel: "OR CREDENTIALS",
// //   },
// //   menu: {
// //     centerLabel: "CORE",
// //     items: [
// //       { id: "tools", label: "TOOLS", icon: "⬡", position: "top" },
// //       { id: "service", label: "SERVICE", icon: "⚙", position: "right" },
// //       { id: "reports", label: "REPORTS", icon: "▤", position: "bottom-right" },
// //       { id: "settings", label: "SETTINGS", icon: "◈", position: "bottom-left" },
// //       { id: "users", label: "USERS", icon: "◎", position: "left" },
// //     ],
// //   },
// //   theme: {
// //     accentColor: "#3b82f6",
// //     fontFamily: "JetBrains Mono, Fira Code, Cascadia Code, Consolas, ui-monospace, monospace",
// //   },
// // };
// //
// // let _cached = null;
// //
// // export async function loadConfig() {
// //   if (_cached) return _cached;
// //   try {
// //     const configPath = await resolveResource("app.config.json");
// //     const fileExists = await exists(configPath);
// //     if (!fileExists) {
// //       console.warn("app.config.json not found, using defaults");
// //       _cached = DEFAULT_CONFIG;
// //       return _cached;
// //     }
// //     const raw = await readTextFile(configPath);
// //     _cached = { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
// //     return _cached;
// //   } catch (e) {
// //     console.error("Failed to load config:", e);
// //     _cached = DEFAULT_CONFIG;
// //     return _cached;
// //   }
// // }
// //
// // export function useConfig() {
// //   const [config, setConfig] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //
// //   useEffect(() => {
// //     loadConfig()
// //       .then((cfg) => setConfig(cfg))
// //       .finally(() => setLoading(false));
// //   }, []);
// //
// //   return { config, loading };
// // }
