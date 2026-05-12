import { COND } from "../data";

// ─── Category badge ────────────────────────────────────────────────────────
export function CatBadge({ cat }) {
  const categoryColors = {
    "Power Tool": "bg-amber-100 text-amber-700 border-amber-300",
    "Hand Tool": "bg-blue-100 text-blue-700 border-blue-300",
    "Measuring": "bg-emerald-100 text-emerald-700 border-emerald-300",
    "Safety": "bg-red-100 text-red-700 border-red-300",
    "Electrical": "bg-purple-100 text-purple-700 border-purple-300",
    "Other": "bg-slate-100 text-slate-700 border-slate-300",
  };

  const colors = categoryColors[cat] || "bg-slate-100 text-slate-700 border-slate-300";

  return (
    <span className={`badge border ${colors}`}>
      {cat}
    </span>
  );
}

// ─── Condition badge ───────────────────────────────────────────────────────
export function CondBadge({ cond }) {
  const s = COND[cond] ?? {
    c: "#64748b",
    bg: "rgba(226, 232, 240, 0.5)",
  };

  const colorMap = {
    "Good": "text-green-600 bg-green-50 border-green-300",
    "Worn": "text-amber-600 bg-amber-50 border-amber-300",
    "Needs Service": "text-red-600 bg-red-50 border-red-300",
  };

  const colors = colorMap[cond] || "text-slate-600 bg-slate-50 border-slate-300";

  return (
    <span className={`badge border ${colors}`}>
      <span
        className="inline-block w-1 h-1 rounded-full shrink-0"
        style={{ background: s.c }}
      />
      {cond}
    </span>
  );
}

// ─── Tray badge ────────────────────────────────────────────────────────────
export function TrayBadge({ tray }) {
  return (
    <span className="badge bg-blue-100 text-blue-600 border border-blue-300">
      {tray}
    </span>
  );
}
