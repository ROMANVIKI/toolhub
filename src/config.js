import { useState, useEffect } from "react";
import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile, exists } from "@tauri-apps/plugin-fs";

const DEFAULT_CONFIG = {
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

let _cached = null;

export async function loadConfig() {
  if (_cached) return _cached;
  try {
    const configPath = await resolveResource("app.config.json");
    const fileExists = await exists(configPath);
    if (!fileExists) {
      console.warn("app.config.json not found, using defaults");
      _cached = DEFAULT_CONFIG;
      return _cached;
    }
    const raw = await readTextFile(configPath);
    _cached = { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    return _cached;
  } catch (e) {
    console.error("Failed to load config:", e);
    _cached = DEFAULT_CONFIG;
    return _cached;
  }
}

export function useConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig()
      .then((cfg) => setConfig(cfg))
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
}
