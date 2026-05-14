import { useState } from "react";
import { saveConfig } from "../config";
import { open } from "@tauri-apps/plugin-dialog";

export default function SettingsScreen({ config, onBack, onSaved }) {
  const [form, setForm] = useState({
    app: { ...(config?.app ?? {}) },
    auth: { ...(config?.auth ?? {}) },
    theme: { ...(config?.theme ?? {}) },
  });
  const [status, setStatus] = useState(null); // null | "saving" | "saved" | "error"

  function set(section, key, val) {
    setForm((f) => ({ ...f, [section]: { ...f[section], [key]: val } }));
  }

  async function pickLogo() {
    try {
      const path = await open({
        multiple: false,
        filters: [{ name: "Image", extensions: ["png", "jpg", "jpeg", "svg", "ico", "webp"] }],
      });
      if (typeof path === "string") set("app", "logoPath", path);
    } catch (e) {
      console.error("File pick failed:", e);
    }
  }

  async function handleSave() {
    setStatus("saving");
    try {
      await saveConfig(form);
      setStatus("saved");
      onSaved?.();
      setTimeout(() => setStatus(null), 2500);
    } catch (e) {
      console.error("Save failed:", e);
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
    }
  }

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden"
      style={{ background: "#080d14", fontFamily: config?.theme?.fontFamily }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Top bar ── */}
      <header
        data-tauri-drag-region
        className="relative z-20 flex items-center gap-4 px-6 shrink-0"
        style={{
          height: 52,
          borderBottom: "1px solid rgba(59,130,246,0.1)",
          background: "rgba(8,13,20,0.8)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: "4px 12px",
            border: "1px solid rgba(59,130,246,0.22)",
            borderRadius: 4,
            color: "rgba(148,163,184,0.65)",
            background: "transparent",
            fontSize: "0.68rem",
            letterSpacing: "0.15em",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
            e.currentTarget.style.color = "#3b82f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(59,130,246,0.22)";
            e.currentTarget.style.color = "rgba(148,163,184,0.65)";
          }}
        >
          ← BACK
        </button>

        <div style={{ width: 1, height: 22, background: "rgba(59,130,246,0.15)" }} />

        <div>
          <div
            style={{
              color: "#e2e8f0",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
            }}
          >
            SETTINGS
          </div>
          <div
            style={{
              color: "rgba(59,130,246,0.5)",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              marginTop: 1,
            }}
          >
            APP CONFIGURATION
          </div>
        </div>
      </header>

      {/* ── Scrollable body ── */}
      <div
        className="flex-1 overflow-y-auto relative z-10"
        style={{ padding: "2rem 2rem" }}
      >
        <div style={{ maxWidth: 620, margin: "0 auto" }}>

          {/* APPLICATION */}
          <Section label="Application">
            <Field label="App Name">
              <CyberInput
                value={form.app?.name ?? ""}
                onChange={(v) => set("app", "name", v)}
                placeholder="TOOLHUB"
              />
            </Field>
            <Field label="Tagline">
              <CyberInput
                value={form.app?.tagline ?? ""}
                onChange={(v) => set("app", "tagline", v)}
                placeholder="Hardware Inventory Management"
              />
            </Field>
            <Field label="Company">
              <CyberInput
                value={form.app?.company ?? ""}
                onChange={(v) => set("app", "company", v)}
                placeholder="Your Company"
              />
            </Field>
            <Field label="Version">
              <CyberInput
                value={form.app?.version ?? ""}
                onChange={(v) => set("app", "version", v)}
                placeholder="1.0.0"
              />
            </Field>
            <Field label="Logo Path">
              <div style={{ display: "flex", gap: 8 }}>
                <CyberInput
                  value={form.app?.logoPath ?? ""}
                  onChange={(v) => set("app", "logoPath", v)}
                  placeholder="Absolute path to image, or leave empty"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={pickLogo}
                  style={{
                    padding: "0.5rem 1rem",
                    border: "1px solid rgba(59,130,246,0.35)",
                    borderRadius: 5,
                    background: "rgba(59,130,246,0.08)",
                    color: "#3b82f6",
                    fontSize: "0.63rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.15)";
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.08)";
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)";
                  }}
                >
                  BROWSE
                </button>
              </div>
              {form.app?.logoPath && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: "0.6rem",
                    color: "rgba(100,116,139,0.55)",
                    letterSpacing: "0.08em",
                    wordBreak: "break-all",
                  }}
                >
                  {form.app.logoPath}
                </div>
              )}
            </Field>
          </Section>

          {/* AUTHENTICATION */}
          <Section label="Authentication Labels">
            {[
              ["loginButtonLabel", "Login Button Label"],
              ["logoutButtonLabel", "Logout Button Label"],
              ["rfidLabel", "RFID Section Label"],
              ["rfidScanLabel", "RFID Scan Button"],
              ["credentialsLabel", "Credentials Divider"],
            ].map(([key, label]) => (
              <Field key={key} label={label}>
                <CyberInput
                  value={form.auth?.[key] ?? ""}
                  onChange={(v) => set("auth", key, v)}
                />
              </Field>
            ))}
          </Section>

          {/* THEME */}
          <Section label="Theme">
            <Field label="Accent Color">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="color"
                  value={form.theme?.accentColor ?? "#3b82f6"}
                  onChange={(e) => set("theme", "accentColor", e.target.value)}
                  style={{
                    width: 38,
                    height: 32,
                    border: "1px solid rgba(59,130,246,0.3)",
                    borderRadius: 4,
                    background: "transparent",
                    cursor: "pointer",
                    padding: 2,
                    flexShrink: 0,
                  }}
                />
                <CyberInput
                  value={form.theme?.accentColor ?? ""}
                  onChange={(v) => set("theme", "accentColor", v)}
                  placeholder="#3b82f6"
                  style={{ flex: 1 }}
                />
              </div>
            </Field>
            <Field label="Font Family">
              <CyberInput
                value={form.theme?.fontFamily ?? ""}
                onChange={(v) => set("theme", "fontFamily", v)}
                placeholder="JetBrains Mono, Fira Code, Consolas, monospace"
              />
            </Field>
          </Section>

        </div>
      </div>

      {/* ── Footer / Save ── */}
      <footer
        className="relative z-20 flex items-center justify-between px-8 shrink-0"
        style={{
          height: 60,
          borderTop: "1px solid rgba(59,130,246,0.1)",
          background: "rgba(8,13,20,0.95)",
        }}
      >
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em" }}>
          {status === "saved" && <span style={{ color: "#22c55e" }}>✓ SAVED — CHANGES APPLIED ON RELOAD</span>}
          {status === "error" && <span style={{ color: "#ef4444" }}>✕ SAVE FAILED — CHECK PERMISSIONS</span>}
          {status === "saving" && <span style={{ color: "rgba(59,130,246,0.7)" }}>SAVING…</span>}
          {!status && (
            <span style={{ color: "rgba(100,116,139,0.4)" }}>
              CONFIG IS STORED IN APPDATA · EDITABLE JSON OR VIA THIS SCREEN
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          style={{
            padding: "0.6rem 2rem",
            border: `1px solid ${status === "saved" ? "rgba(34,197,94,0.5)" : "rgba(59,130,246,0.45)"
              }`,
            borderRadius: 5,
            background:
              status === "saved" ? "rgba(34,197,94,0.08)" : "rgba(59,130,246,0.1)",
            color: status === "saved" ? "#22c55e" : "#3b82f6",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            cursor: status === "saving" ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (status === "saving") return;
            e.currentTarget.style.background =
              status === "saved" ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              status === "saved" ? "rgba(34,197,94,0.08)" : "rgba(59,130,246,0.1)";
          }}
        >
          {status === "saving" ? "SAVING…" : status === "saved" ? "✓ SAVED" : "SAVE SETTINGS"}
        </button>
      </footer>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: "2.2rem" }}>
      <div
        style={{
          color: "rgba(59,130,246,0.55)",
          fontSize: "0.58rem",
          fontWeight: 700,
          letterSpacing: "0.28em",
          marginBottom: "1rem",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        {label.toUpperCase()}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div
        style={{
          color: "rgba(100,116,139,0.7)",
          fontSize: "0.58rem",
          fontWeight: 600,
          letterSpacing: "0.2em",
          marginBottom: "0.4rem",
        }}
      >
        {label.toUpperCase()}
      </div>
      {children}
    </div>
  );
}

function CyberInput({ value, onChange, placeholder, style, ...rest }) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "0.5rem 0.75rem",
        background: "rgba(15,23,42,0.8)",
        border: "1px solid rgba(59,130,246,0.18)",
        borderRadius: 5,
        color: "#e2e8f0",
        fontSize: "0.72rem",
        outline: "none",
        fontFamily: "inherit",
        letterSpacing: "0.05em",
        transition: "border-color 0.15s, box-shadow 0.15s",
        boxSizing: "border-box",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.07)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.18)";
        e.currentTarget.style.boxShadow = "none";
      }}
      {...rest}
    />
  );
}
