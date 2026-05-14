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

async function getConfigPath(): Promise<string> {
  try {
    const dir = await appDataDir();
    console.info("[config] appDataDir resolved to:", dir);

    const dirExists = await exists(dir);
    console.info("[config] dir exists:", dirExists);

    if (!dirExists) {
      await mkdir(dir, { recursive: true });
      console.info("[config] created directory:", dir);
    }

    const path = await join(dir, "app.config.json");
    console.info("[config] config path:", path);
    return path;
  } catch (e) {
    console.error("[config] getConfigPath failed:", e);
    throw e;
  }
}

let _cached: AppConfig | null = null;

export async function loadConfig(bustCache = false): Promise<AppConfig> {
  if (_cached && !bustCache) return _cached;

  try {
    const configPath = await getConfigPath();
    const fileExists = await exists(configPath);
    console.info("[config] config file exists:", fileExists);

    if (!fileExists) {
      await writeTextFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
      console.info("[config] wrote default config");
      _cached = DEFAULT_CONFIG;
      return _cached;
    }

    const raw = await readTextFile(configPath);
    const parsed = JSON.parse(raw);
    _cached = deepMerge(DEFAULT_CONFIG, parsed);
    return _cached;

  } catch (e) {
    console.error("[config] loadConfig failed:", e);
    _cached = DEFAULT_CONFIG;
    return _cached;
  }
}

export async function saveConfig(updated: Partial<AppConfig>): Promise<void> {
  try {
    const merged = deepMerge(_cached ?? DEFAULT_CONFIG, updated);
    const configPath = await getConfigPath();
    console.info("[config] saving to:", configPath);
    await writeTextFile(configPath, JSON.stringify(merged, null, 2));
    _cached = merged;
    console.info("[config] saved successfully");
  } catch (e) {
    console.error("[config] saveConfig failed:", e);
    throw e;
  }
}

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
