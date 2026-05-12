import { useState, useEffect } from "react";
import { resolveResource } from "@tauri-apps/plugin-path";
import { convertFileSrc } from "@tauri-apps/api/core";

// ── Position offsets from center (px) ───────────────────────────────────────
const POSITION_MAP = {
  top: [0, -170],
  right: [185, 0],
  "bottom-right": [140, 158],
  "bottom-left": [-140, 158],
  left: [-185, 0],
};

// ── Single satellite node ────────────────────────────────────────────────────
function OrbitalNode({ item, index, onClick, active }) {
  const [hovered, setHovered] = useState(false);
  const pos = POSITION_MAP[item.position] ?? [0, 0];

  const angle = Math.atan2(-pos[1], -pos[0]);
  const length = Math.sqrt(pos[0] ** 2 + pos[1] ** 2);

  const isLit = active || hovered;

  return (
    <div
      className="absolute"
      style={{
        left: `calc(50% + ${pos[0]}px)`,
        top: `calc(50% + ${pos[1]}px)`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Dashed connector line */}
      <svg
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          width: length,
          height: 2,
          transformOrigin: "0 50%",
          transform: `rotate(${angle}rad)`,
          overflow: "visible",
        }}
      >
        <line
          x1="0"
          y1="0"
          x2={length}
          y2="0"
          stroke={isLit ? "rgba(59,130,246,0.35)" : "rgba(59,130,246,0.12)"}
          strokeWidth="1"
          strokeDasharray="5 4"
          style={{ transition: "stroke 0.2s" }}
        />
      </svg>

      {/* Node button */}
      <button
        onClick={() => onClick(item)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 100,
          height: 100,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          background: isLit
            ? "rgba(59,130,246,0.08)"
            : "rgba(10,16,27,0.7)",
          border: `1px solid ${active
            ? "rgba(59,130,246,0.7)"
            : hovered
              ? "rgba(59,130,246,0.45)"
              : "rgba(59,130,246,0.22)"
            }`,
          borderRadius: 10,
          cursor: "pointer",
          transition: "all 0.18s ease",
          boxShadow: active
            ? "0 0 16px rgba(59,130,246,0.15), inset 0 0 12px rgba(59,130,246,0.05)"
            : hovered
              ? "0 0 10px rgba(59,130,246,0.08)"
              : "none",
        }}
      >
        {/* Corner tick marks */}
        {[
          { top: 5, left: 5, borderTop: "1px solid", borderLeft: "1px solid" },
          { top: 5, right: 5, borderTop: "1px solid", borderRight: "1px solid" },
          { bottom: 5, left: 5, borderBottom: "1px solid", borderLeft: "1px solid" },
          { bottom: 5, right: 5, borderBottom: "1px solid", borderRight: "1px solid" },
        ].map((style, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              borderColor: isLit
                ? "rgba(59,130,246,0.5)"
                : "rgba(59,130,246,0.18)",
              transition: "border-color 0.18s",
              ...style,
            }}
          />
        ))}

        {/* Icon */}
        <span
          style={{
            fontSize: "1.2rem",
            color: isLit ? "#3b82f6" : "rgba(59,130,246,0.45)",
            transition: "color 0.18s",
            lineHeight: 1,
          }}
        >
          {item.icon}
        </span>

        {/* Label */}
        <span
          style={{
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: isLit ? "#93c5fd" : "rgba(148,163,184,0.6)",
            transition: "color 0.18s",
          }}
        >
          {item.label}
        </span>
      </button>
    </div>
  );
}

// ── Main menu screen ─────────────────────────────────────────────────────────
export default function MenuScreen({ user, config, onNavigate, onLogout }) {
  const [active, setActive] = useState(null);
  const [logoSrc, setLogoSrc] = useState(null);

  const items = config?.menu?.items ?? [];
  const appName = config?.app?.name ?? "APP";
  const centerLabel = config?.menu?.centerLabel ?? "CORE";

  // ── Load logo from beside the .exe ────────────────────────────────────────
  useEffect(() => {
    const logoPath = config?.app?.logoPath;
    if (!logoPath) return;

    resolveResource(logoPath)
      .then((p) => setLogoSrc(convertFileSrc(p)))
      .catch(() => setLogoSrc(null));
  }, [config?.app?.logoPath]);

  function handleClick(item) {
    setActive(item.id);
    setTimeout(() => {
      onNavigate(item.id);
      setActive(null);
    }, 200);
  }

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden"
      style={{ background: "#080d14", fontFamily: config?.theme?.fontFamily }}
    >
      {/* Grid */}
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
        className="relative z-20 flex items-center justify-between px-6 shrink-0"
        style={{
          height: 52,
          borderBottom: "1px solid rgba(59,130,246,0.1)",
          background: "rgba(8,13,20,0.8)",
        }}
      >
        {/* Left: accent + logo + name */}
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 2,
              height: 22,
              background: "#3b82f6",
              borderRadius: 2,
              opacity: 0.85,
            }}
          />

          {logoSrc && (
            <img
              src={logoSrc}
              alt={appName}
              style={{
                height: 28,
                maxWidth: 90,
                objectFit: "contain",
                opacity: 0.88,
              }}
            />
          )}

          <div>
            <div
              style={{
                color: "#e2e8f0",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
              }}
            >
              {appName}
            </div>
            <div
              style={{
                color: "rgba(59,130,246,0.5)",
                fontSize: "0.56rem",
                letterSpacing: "0.2em",
                marginTop: 1,
              }}
            >
              {(config?.app?.tagline ?? "").toUpperCase()}
            </div>
          </div>
        </div>

        {/* Right: user chip + logout */}
        <div className="flex items-center gap-3">
          <div
            style={{
              padding: "4px 12px",
              border: "1px solid rgba(59,130,246,0.18)",
              borderRadius: 4,
              color: "rgba(148,163,184,0.7)",
              background: "rgba(59,130,246,0.04)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
            }}
          >
            {user?.toUpperCase()}
          </div>

          <button
            onClick={onLogout}
            style={{
              padding: "4px 12px",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 4,
              color: "rgba(239,68,68,0.6)",
              background: "transparent",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.55)";
              e.currentTarget.style.color = "#ef4444";
              e.currentTarget.style.background = "rgba(239,68,68,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
              e.currentTarget.style.color = "rgba(239,68,68,0.6)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            {(config?.auth?.logoutButtonLabel ?? "Log Out").toUpperCase()}
          </button>
        </div>
      </header>

      {/* ── Orbital canvas ── */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* Decorative rings */}
        {[420, 300].map((size) => (
          <div
            key={size}
            className="absolute pointer-events-none"
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              border: "1px solid rgba(59,130,246,0.05)",
            }}
          />
        ))}

        {/* Satellite nodes */}
        {items.map((item, i) => (
          <OrbitalNode
            key={item.id}
            item={item}
            index={i}
            onClick={handleClick}
            active={active === item.id}
          />
        ))}

        {/* ── Center core node ── */}
        <div
          className="relative z-10 flex flex-col items-center justify-center"
          style={{ width: 138, height: 138 }}
        >
          {/* Pulse ring */}
          <div
            className="absolute animate-pulse-slow"
            style={{
              inset: -4,
              borderRadius: "50%",
              border: "1px solid rgba(59,130,246,0.18)",
            }}
          />

          {/* Core */}
          <div
            className="absolute flex flex-col items-center justify-center gap-1 text-center"
            style={{
              inset: 4,
              borderRadius: "50%",
              border: "1.5px solid rgba(59,130,246,0.45)",
              background:
                "radial-gradient(circle at 38% 32%, rgba(59,130,246,0.09), rgba(8,13,20,0.97))",
            }}
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={appName}
                style={{
                  width: 38,
                  height: 38,
                  objectFit: "contain",
                  opacity: 0.85,
                  marginBottom: 4,
                }}
              />
            ) : (
              <span
                style={{
                  color: "#3b82f6",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                }}
              >
                {appName}
              </span>
            )}
            <span
              style={{
                color: "rgba(59,130,246,0.55)",
                fontSize: "0.55rem",
                letterSpacing: "0.22em",
                fontWeight: 600,
              }}
            >
              {centerLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom status bar ── */}
      <footer
        className="relative z-20 flex items-center justify-between px-6 shrink-0"
        style={{
          height: 32,
          borderTop: "1px solid rgba(59,130,246,0.08)",
          background: "rgba(8,13,20,0.8)",
        }}
      >
        <div
          style={{
            color: "rgba(59,130,246,0.3)",
            fontSize: "0.56rem",
            letterSpacing: "0.2em",
          }}
        >
          {config?.app?.company ?? ""} · v{config?.app?.version ?? "1.0.0"}
        </div>

        <div
          className="flex items-center gap-2"
          style={{
            color: "rgba(34,197,94,0.55)",
            fontSize: "0.56rem",
            letterSpacing: "0.18em",
          }}
        >
          <span
            className="inline-block rounded-full animate-pulse-slow"
            style={{
              width: 6,
              height: 6,
              background: "#22c55e",
              opacity: 0.65,
            }}
          />
          SYSTEM ONLINE
        </div>
      </footer>
    </div>
  );
}
