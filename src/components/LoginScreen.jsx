import { useState, useEffect } from "react";
import { USERS } from "../data";
// ✅ Replace with this
import { resolveResource } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";

export default function LoginScreen({ onLogin, config }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [rfidMsg, setRfidMsg] = useState("");
  const [rfidState, setRfidState] = useState("idle");
  const [logoSrc, setLogoSrc] = useState(null);

  const appName = config?.app?.name ?? "TOOLHUB";
  const tagline = config?.app?.tagline ?? "Hardware Inventory Management";
  const auth = config?.auth ?? {};

  // ── Load logo from beside the .exe ──────────────────────────────────────
  useEffect(() => {
    const logoPath = config?.app?.logoPath;
    if (!logoPath) return;

    resolveResource(logoPath)
      .then((p) => setLogoSrc(convertFileSrc(p)))
      .catch(() => setLogoSrc(null));
  }, [config?.app?.logoPath]);

  // ── Credential login ─────────────────────────────────────────────────────
  function handleSubmit() {
    const u = USERS[username.trim()];
    if (u && u.password === password) {
      setError("");
      onLogin(username.trim());
    } else {
      setError("Invalid username or password.");
    }
  }

  // ── Simulated RFID ───────────────────────────────────────────────────────
  function handleRfid() {
    if (scanning) return;
    setScanning(true);
    setRfidState("scanning");
    setRfidMsg("Hold card near reader…");

    setTimeout(() => {
      const matched = Object.entries(USERS).find(([, v]) => v.rfid === "RFID-002");
      setScanning(false);
      if (matched) {
        const [uid, info] = matched;
        setRfidState("ok");
        setRfidMsg(`Card recognised: ${info.name}`);
        setTimeout(() => onLogin(uid), 600);
      } else {
        setRfidState("err");
        setRfidMsg("RFID not recognised. Try again.");
      }
    }, 1800);
  }

  const rfidColor =
    rfidState === "ok" ? "#22c55e"
      : rfidState === "err" ? "#ef4444"
        : rfidState === "scanning" ? "#f59e0b"
          : "rgba(148,163,184,0.5)";

  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#080d14", fontFamily: config?.theme?.fontFamily }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner accent — top left */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle at 0% 0%, rgba(59,130,246,0.07), transparent 70%)",
        }}
      />
      {/* Corner accent — bottom right */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle at 100% 100%, rgba(59,130,246,0.05), transparent 70%)",
        }}
      />

      {/* Panel */}
      <div
        className="animate-fade-up relative z-10 w-full"
        style={{
          maxWidth: 400,
          background: "rgba(10,16,27,0.97)",
          border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: 8,
          padding: "2.5rem",
          boxShadow:
            "0 0 0 1px rgba(59,130,246,0.04), 0 32px 64px rgba(0,0,0,0.7)",
        }}
      >
        {/* ── Logo / Wordmark ── */}
        <div
          className="mb-8 flex items-center gap-4"
          style={{ borderLeft: "2px solid #3b82f6", paddingLeft: "0.85rem" }}
        >
          {logoSrc && (
            <img
              src={logoSrc}
              alt={appName}
              style={{
                height: 40,
                maxWidth: 120,
                objectFit: "contain",
                opacity: 0.92,
              }}
            />
          )}
          <div>
            <div
              className="font-bold tracking-widest"
              style={{
                color: "#e2e8f0",
                fontSize: "1.05rem",
                letterSpacing: "0.25em",
              }}
            >
              {appName}
            </div>
            <div
              className="mt-0.5 tracking-widest"
              style={{
                color: "rgba(59,130,246,0.55)",
                fontSize: "0.58rem",
                letterSpacing: "0.22em",
              }}
            >
              {tagline.toUpperCase()}
            </div>
          </div>
        </div>

        {/* ── RFID ── */}
        <div className="mb-6">
          <FieldLabel>{auth.rfidLabel ?? "RFID Authentication"}</FieldLabel>
          <button
            onClick={handleRfid}
            disabled={scanning}
            className="w-full flex items-center justify-center gap-2 py-3 font-bold tracking-widest transition-all duration-200"
            style={{
              border: `1px solid ${scanning ? "rgba(245,158,11,0.45)" : "rgba(59,130,246,0.28)"
                }`,
              borderRadius: 5,
              background: scanning
                ? "rgba(245,158,11,0.05)"
                : "rgba(59,130,246,0.05)",
              color: scanning ? "#f59e0b" : "rgba(59,130,246,0.75)",
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              cursor: scanning ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (scanning) return;
              e.currentTarget.style.background = "rgba(59,130,246,0.1)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.45)";
            }}
            onMouseLeave={(e) => {
              if (scanning) return;
              e.currentTarget.style.background = "rgba(59,130,246,0.05)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.28)";
            }}
          >
            <span className={scanning ? "animate-pulse-slow" : ""}>⬡</span>
            <span>
              {scanning
                ? "SCANNING…"
                : (auth.rfidScanLabel ?? "Scan RFID Card").toUpperCase()}
            </span>
          </button>

          {rfidMsg && (
            <div
              className="mt-2 tracking-wide transition-colors duration-300"
              style={{
                color: rfidColor,
                fontSize: "0.63rem",
                letterSpacing: "0.1em",
              }}
            >
              {rfidMsg}
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 my-5">
          <div
            style={{ flex: 1, height: 1, background: "rgba(59,130,246,0.1)" }}
          />
          <span
            style={{
              color: "rgba(100,116,139,0.5)",
              fontSize: "0.58rem",
              letterSpacing: "0.22em",
            }}
          >
            {(auth.credentialsLabel ?? "OR CREDENTIALS").toUpperCase()}
          </span>
          <div
            style={{ flex: 1, height: 1, background: "rgba(59,130,246,0.1)" }}
          />
        </div>

        {/* ── Username ── */}
        <div className="mb-3">
          <FieldLabel>Username</FieldLabel>
          <DarkInput
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            autoComplete="username"
          />
        </div>

        {/* ── Password ── */}
        <div className="mb-5">
          <FieldLabel>Password</FieldLabel>
          <DarkInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {/* ── Error ── */}
        {error && (
          <div
            className="mb-3 tracking-wide"
            style={{
              color: "#ef4444",
              fontSize: "0.63rem",
              letterSpacing: "0.1em",
            }}
          >
            {error}
          </div>
        )}

        {/* ── Submit ── */}
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 font-bold tracking-widest transition-all duration-150 mb-5"
          style={{
            border: "1px solid rgba(59,130,246,0.38)",
            borderRadius: 5,
            background: "rgba(59,130,246,0.08)",
            color: "#3b82f6",
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59,130,246,0.15)";
            e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(59,130,246,0.08)";
            e.currentTarget.style.borderColor = "rgba(59,130,246,0.38)";
          }}
        >
          {(auth.loginButtonLabel ?? "Sign In").toUpperCase()}
        </button>

        {/* ── Demo hint ── */}
        <div
          style={{
            background: "rgba(59,130,246,0.03)",
            border: "1px solid rgba(59,130,246,0.09)",
            borderRadius: 5,
            padding: "0.75rem 1rem",
          }}
        >
          <div
            className="font-semibold tracking-widest mb-2"
            style={{
              color: "rgba(100,116,139,0.6)",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
            }}
          >
            DEMO ACCOUNTS
          </div>
          <div
            style={{
              color: "rgba(148,163,184,0.6)",
              fontSize: "0.63rem",
              lineHeight: 1.9,
            }}
          >
            admin / admin123
            <br />
            tech01 / tech2024
            <br />
            engineer / eng@hub
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function FieldLabel({ children }) {
  return (
    <div
      className="font-semibold tracking-widest mb-2"
      style={{
        color: "rgba(100,116,139,0.75)",
        fontSize: "0.58rem",
        letterSpacing: "0.2em",
      }}
    >
      {typeof children === "string" ? children.toUpperCase() : children}
    </div>
  );
}

function DarkInput(props) {
  return (
    <input
      {...props}
      className="w-full"
      style={{
        padding: "0.55rem 0.75rem",
        background: "rgba(15,23,42,0.8)",
        border: "1px solid rgba(59,130,246,0.18)",
        borderRadius: 5,
        color: "#e2e8f0",
        fontSize: "0.72rem",
        outline: "none",
        fontFamily: "inherit",
        letterSpacing: "0.05em",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.07)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.18)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}
