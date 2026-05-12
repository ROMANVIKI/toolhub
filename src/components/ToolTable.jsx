import { CAT } from "../data";
import { CatBadge, CondBadge, TrayBadge } from "./Badges";

const HEADERS = ["SERIAL", "NAME", "CATEGORY", "TYPE", "SIZE", "TRAY", "CONDITION"];

export default function ToolTable({ tools }) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
        <div className="text-4xl">⊘</div>
        <div className="text-xs tracking-widest font-semibold">
          NO TOOLS MATCH THE CURRENT FILTER
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <table className="w-full border-collapse">
        {/* Sticky header */}
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            {HEADERS.map((h) => (
              <th
                key={h}
                className="px-4 py-2 text-left text-xs font-semibold text-slate-600 tracking-widest uppercase whitespace-nowrap border-r border-slate-100 last:border-r-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tools.map((t, i) => {
            const catColor = CAT[t.category]?.c ?? "#888";
            const isEven = i % 2 === 0;

            return (
              <tr
                key={t.id}
                className={`tool-row border-b border-slate-100 ${isEven ? "bg-white" : "bg-slate-50"
                  } hover:bg-blue-50 transition-colors duration-100`}
              >
                {/* Serial + accent bar */}
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1 h-6 rounded-sm flex-shrink-0 opacity-70"
                      style={{ background: catColor }}
                    />
                    <span className="text-xs text-slate-500 tracking-wide">
                      {t.serial}
                    </span>
                  </div>
                </td>

                {/* Name */}
                <td className="px-4 py-2 text-sm text-slate-900 font-medium whitespace-nowrap">
                  {t.name}
                </td>

                {/* Category */}
                <td className="px-4 py-2 whitespace-nowrap">
                  <CatBadge cat={t.category} />
                </td>

                {/* Type */}
                <td className="px-4 py-2 text-xs text-slate-600 whitespace-nowrap">
                  {t.type}
                </td>

                {/* Size */}
                <td className="px-4 py-2 text-xs text-slate-600 whitespace-nowrap">
                  {t.size}
                </td>

                {/* Tray */}
                <td className="px-4 py-2 whitespace-nowrap">
                  <TrayBadge tray={t.tray} />
                </td>

                {/* Condition */}
                <td className="px-4 py-2 whitespace-nowrap">
                  <CondBadge cond={t.condition} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
