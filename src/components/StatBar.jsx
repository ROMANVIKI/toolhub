import { TOOLS } from "../data";

export default function StatBar({ tools }) {
  const total = tools.length;
  const good = tools.filter((t) => t.condition === "Good").length;
  const worn = tools.filter((t) => t.condition === "Worn").length;
  const svc = tools.filter((t) => t.condition === "Needs Service").length;

  const stats = [
    { label: "SHOWN", val: total, color: "text-slate-600" },
    { label: "GOOD", val: good, color: "text-green-600 font-bold" },
    { label: "WORN", val: worn, color: "text-amber-600 font-bold" },
    { label: "SERVICE", val: svc, color: "text-red-600 font-bold" },
    { label: "TOTAL", val: TOOLS.length, color: "text-slate-500" },
  ];

  return (
    <div className="flex items-center border-b border-slate-200 bg-slate-50 flex-shrink-0 p-1">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex items-center gap-2 px-4 py-2 ${i < stats.length - 1 ? "border-r border-slate-200" : ""
            }`}
        >
          <span className="text-xs text-slate-500 font-semibold tracking-widest">
            {s.label}
          </span>
          <span className={`text-sm font-bold ${s.color}`}>
            {s.val}
          </span>
        </div>
      ))}
    </div>
  );
}
