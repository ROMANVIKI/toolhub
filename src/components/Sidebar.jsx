import { TOOLS, USERS, ALL_TRAYS } from "../data";

export default function Sidebar({
  mode, setMode,
  search, setSearch,
  tray, setTray,
  toolType, setToolType,
  onReset, user, onLogout,
}) {
  const toolTypes = ["All", ...new Set(TOOLS.map((t) => t.type))];
  const hasFilter = search || tray !== "All" || toolType !== "All";

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      {/* Mode toggle */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex gap-1">
          {["key", "filter"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded text-xs font-semibold tracking-widest transition-all duration-150 ${mode === m
                ? "bg-blue-100 text-blue-600 border border-blue-300"
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3">
        {mode === "key" ? (
          <>
            <div className="text-xs font-semibold text-slate-500 tracking-widest mb-2 uppercase">
              Search
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, serial, size…"
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
          </>
        ) : (
          <>
            <div className="text-xs font-semibold text-slate-500 tracking-widest mb-2 uppercase">
              Tray
            </div>
            {["All", ...ALL_TRAYS].map((opt) => (
              <button
                key={opt}
                onClick={() => setTray(opt)}
                className={`block w-full text-left px-2 py-1.5 mb-1 rounded text-sm transition-all duration-100 ${tray === opt
                  ? "bg-blue-100 text-blue-600 border border-blue-200 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 border border-transparent"
                  }`}
              >
                {opt === "All" ? "All Trays" : `Tray: ${opt}`}
              </button>
            ))}

            <div className="h-px bg-slate-200 my-3" />

            <div className="text-xs font-semibold text-slate-500 tracking-widest mb-2 uppercase">
              Tool Type
            </div>
            <select
              value={toolType}
              onChange={(e) => setToolType(e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 cursor-pointer"
            >
              {toolTypes.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Types" : t}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-200 space-y-2">
        <button
          onClick={onReset}
          disabled={!hasFilter}
          className={`w-full py-1.5 rounded text-xs font-semibold tracking-widest border transition-all ${hasFilter
            ? "bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
            : "bg-slate-50 text-slate-400 border-slate-200 cursor-default"
            }`}
        >
          {hasFilter ? "CLEAR FILTERS" : "NO ACTIVE FILTERS"}
        </button>

        <div className="text-xs text-slate-600 tracking-wide px-1">
          {USERS[user]?.name ?? user}
        </div>

        <button
          onClick={onLogout}
          className="w-full py-1.5 rounded text-xs font-semibold tracking-widest border border-red-300 text-red-600 hover:bg-red-50 transition-all"
        >
          LOG OUT
        </button>
      </div>
    </aside>
  );
}

// import { useMemo } from "react";
// import { TOOLS, USERS, TOOL_TYPES, ALL_TRAYS } from "../data";
//
// export default function Sidebar({
//   mode,
//   setMode,
//   selectedTypes,
//   setSelectedTypes,
//   search,
//   setSearch,
//   tray,
//   setTray,
//   onReset,
//   user,
//   onLogout,
// }) {
//   // Count tools per type for the key panel
//   const typeCounts = useMemo(() => {
//     const c = {};
//     TOOL_TYPES.forEach((t) => {
//       c[t] = TOOLS.filter((x) => x.type === t).length;
//     });
//     return c;
//   }, []);
//
//   function toggleType(t) {
//     const next = new Set(selectedTypes);
//     next.has(t) ? next.delete(t) : next.add(t);
//     setSelectedTypes(next);
//   }
//
//   const hasFilter = selectedTypes.size > 0 || search || tray !== "All";
//
//   return (
//     <aside className="animate-slide-in w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
//       {/* Mode toggle */}
//       <div className="px-4 py-3 border-b border-slate-200">
//         <div className="flex gap-1">
//           {["filter", "key"].map((m) => (
//             <button
//               key={m}
//               onClick={() => setMode(m)}
//               className={`flex-1 py-2 rounded text-xs font-semibold tracking-widest transition-all duration-150 ${mode === m
//                 ? "bg-blue-100 text-blue-600 border border-blue-300"
//                 : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
//                 }`}
//             >
//               {m.toUpperCase()}
//             </button>
//           ))}
//         </div>
//       </div>
//
//       {/* Scrollable body */}
//       <div className="flex-1 overflow-y-auto p-3">
//         {mode === "key" ? (
//           /* ── KEY mode: filter by tool type ── */
//           <>
//             <div className="text-xs font-semibold text-slate-500 tracking-widest mb-3 uppercase">
//               Tool Type
//             </div>
//             {TOOL_TYPES.map((t) => {
//               const checked = selectedTypes.has(t);
//               return (
//                 <label
//                   key={t}
//                   className={`flex items-center gap-2 px-2 py-1.5 mb-1 rounded cursor-pointer transition-all duration-100 ${checked
//                     ? "bg-blue-50 border border-blue-200"
//                     : "hover:bg-slate-50 border border-transparent"
//                     }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={checked}
//                     onChange={() => toggleType(t)}
//                     className="w-3 h-3 accent-blue-500 cursor-pointer"
//                   />
//                   <span
//                     className={`flex-1 text-sm ${checked ? "text-slate-900 font-medium" : "text-slate-600"
//                       }`}
//                   >
//                     {t}
//                   </span>
//                   <span className="text-xs text-slate-400 text-right min-w-4">
//                     {typeCounts[t]}
//                   </span>
//                 </label>
//               );
//             })}
//           </>
//         ) : (
//           /* ── FILTER mode: search + tray ── */
//           <>
//             <div className="text-xs font-semibold text-slate-500 tracking-widest mb-2 uppercase">
//               Search
//             </div>
//             <div className="relative mb-4">
//               <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
//                 ⌕
//               </span>
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Name, serial, size…"
//                 className="input-base w-full pl-7 placeholder:text-slate-400"
//               />
//             </div>
//
//             <div className="h-px bg-slate-200 mb-4" />
//
//             <div className="text-xs font-semibold text-slate-500 tracking-widest mb-2 uppercase">
//               Tray
//             </div>
//             {["All", ...ALL_TRAYS].map((opt) => (
//               <button
//                 key={opt}
//                 onClick={() => setTray(opt)}
//                 className={`block w-full text-left px-2 py-1.5 mb-1 rounded text-sm transition-all duration-100 ${tray === opt
//                   ? "bg-blue-100 text-blue-600 border border-blue-200 font-semibold tracking-wide"
//                   : "text-slate-600 hover:bg-slate-50 border border-transparent"
//                   }`}
//               >
//                 {opt}
//               </button>
//             ))}
//           </>
//         )}
//       </div>
//
//       {/* Footer */}
//       <div className="px-3 py-3 border-t border-slate-200 space-y-2">
//         <button
//           onClick={onReset}
//           disabled={!hasFilter}
//           className={`btn w-full text-xs uppercase ${hasFilter
//             ? "bg-red-50 text-red-600 border border-red-300 hover:bg-red-100"
//             : "bg-slate-50 text-slate-400 border border-slate-200 cursor-default"
//             }`}
//         >
//           {hasFilter ? "CLEAR FILTERS" : "NO ACTIVE FILTERS"}
//         </button>
//
//         <div className="text-xs text-slate-600 tracking-wide px-1">
//           {USERS[user]?.name ?? user}
//         </div>
//
//         <button
//           onClick={onLogout}
//           className="btn btn-danger w-full text-xs uppercase"
//         >
//           LOG OUT
//         </button>
//       </div>
//     </aside>
//   );
// }
