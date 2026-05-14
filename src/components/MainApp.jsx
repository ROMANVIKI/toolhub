import { useState, useMemo } from "react";
import { TOOLS, USERS } from "../data";
import StatBar from "./StatBar";
import ToolTable from "./ToolTable";

export default function MainApp({ user, config, onLogout, onBack }) {
  const [search, setSearch] = useState("");
  const [tray, setTray] = useState("All");
  const [toolType, setToolType] = useState("All");
  const appName = config?.app?.name ?? "TOOLHUB";

  // Get unique values for dropdowns
  const trays = ["All", ...new Set(TOOLS.map((t) => t.tray))];
  const toolTypes = ["All", ...new Set(TOOLS.map((t) => t.type))];

  function reset() {
    setSearch("");
    setTray("All");
    setToolType("All");
  }

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      if (tray !== "All" && t.tray !== tray) return false;
      if (toolType !== "All" && t.type !== toolType) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = (t.name + t.category + t.type + t.tray + t.size + t.serial).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [search, tray, toolType]);

  const hasFilter = search || tray !== "All" || toolType !== "All";

  return (
    <div className="w-screen h-screen flex flex-col bg-white overflow-hidden">
      {/* Topbar */}
      <header
        data-tauri-drag-region
        className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-3 shrink-0"
      >
        {/* Back to menu */}
        <button
          onClick={onBack}
          title="Back to menu"
          className="px-2 py-1 rounded border text-xs transition-all duration-150 border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700"
        >
          ←
        </button>

        <div className="w-px h-6 bg-slate-200" />

        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            {appName}
          </span>
          <span className="text-xs text-slate-500 tracking-widest">
            TOOLS
          </span>
        </div>

        {/* Filters section */}
        <div className="flex items-center gap-2 ml-4">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search key..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 rounded border border-slate-300 text-xs bg-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
          />

          {/* Tray dropdown */}
          <select
            value={tray}
            onChange={(e) => setTray(e.target.value)}
            className="px-3 py-1 rounded border border-slate-300 text-xs bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 cursor-pointer"
          >
            {trays.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All Trays" : `Tray: ${t}`}
              </option>
            ))}
          </select>

          {/* Tools dropdown */}
          <select
            value={toolType}
            onChange={(e) => setToolType(e.target.value)}
            className="px-3 py-1 rounded border border-slate-300 text-xs bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 cursor-pointer"
          >
            {toolTypes.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All Tools" : `Type: ${t}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1" />

        {/* Filter status */}
        {hasFilter && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded text-xs">
            <span className="text-slate-600 tracking-widest font-semibold">FILTERED</span>
            <span className="font-bold text-blue-600">
              {filtered.length}/{TOOLS.length}
            </span>
            <button
              onClick={reset}
              title="Clear filters"
              className="text-slate-400 hover:text-slate-600 ml-1 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* User info */}
        <div className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 tracking-widest font-semibold">
          {USERS[user]?.name ?? user}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="px-2 py-1 rounded border text-xs transition-all duration-150 border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50"
        >
          Logout
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <StatBar tools={filtered} />
        <ToolTable tools={filtered} />
      </div>
    </div>
  );
}

// import { useState, useMemo } from "react";
// import { TOOLS, USERS } from "../data";
// import Sidebar from "./Sidebar";
// import StatBar from "./StatBar";
// import ToolTable from "./ToolTable";
//
// export default function MainApp({ user, config, onLogout, onBack }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mode, setMode] = useState("key");
//   const [selectedTypes, setSelectedTypes] = useState(new Set());
//   const [search, setSearch] = useState("");
//   const [tray, setTray] = useState("All");
//
//   const appName = config?.app?.name ?? "TOOLHUB";
//
//   function reset() {
//     setSelectedTypes(new Set());
//     setSearch("");
//     setTray("All");
//   }
//
//   const filtered = useMemo(() => {
//     return TOOLS.filter((t) => {
//       if (selectedTypes.size > 0 && !selectedTypes.has(t.type)) return false;
//       if (tray !== "All" && t.tray !== tray) return false;
//       if (search) {
//         const q = search.toLowerCase();
//         const hay = (t.name + t.category + t.type + t.tray + t.size + t.serial).toLowerCase();
//         if (!hay.includes(q)) return false;
//       }
//       return true;
//     });
//   }, [selectedTypes, search, tray]);
//
//   const hasFilter = selectedTypes.size > 0 || search || tray !== "All";
//
//   return (
//     <div className="w-screen h-screen flex flex-col bg-white overflow-hidden">
//       {/* Topbar */}
//       <header
//         data-tauri-drag-region
//         className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-3 shrink-0"
//       >
//         {/* Back to menu */}
//         <button
//           onClick={onBack}
//           title="Back to menu"
//           className="px-2 py-1 rounded border text-xs transition-all duration-150 border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700"
//         >
//           ←
//         </button>
//
//         {/* Hamburger */}
//         <button
//           onClick={() => setSidebarOpen((x) => !x)}
//           title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
//           className={`px-2 py-1 rounded border text-sm transition-all duration-150 ${sidebarOpen
//             ? "bg-blue-100 border-blue-300 text-blue-600"
//             : "bg-transparent border-slate-300 text-slate-500 hover:border-slate-400"
//             }`}
//         >
//           ☰
//         </button>
//
//         <div className="w-px h-6 bg-slate-200" />
//
//         <div className="flex items-baseline gap-2">
//           <span className="text-sm font-bold text-slate-900 tracking-tight">
//             {appName}
//           </span>
//           <span className="text-xs text-slate-500 tracking-widest">
//             TOOLS
//           </span>
//         </div>
//
//         <div className="flex-1" />
//
//         {hasFilter && (
//           <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded text-xs">
//             <span className="text-slate-600 tracking-widest font-semibold">FILTERED</span>
//             <span className="font-bold text-blue-600">{filtered.length}/{TOOLS.length}</span>
//             <button
//               onClick={reset}
//               title="Clear filters"
//               className="text-slate-400 hover:text-slate-600 ml-1 font-bold"
//             >
//               ✕
//             </button>
//           </div>
//         )}
//
//         <div className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 tracking-widest font-semibold">
//           {USERS[user]?.name ?? user}
//         </div>
//       </header>
//
//       {/* Body */}
//       <div className="flex-1 flex overflow-hidden">
//         {sidebarOpen && (
//           <Sidebar
//             mode={mode}
//             setMode={setMode}
//             selectedTypes={selectedTypes}
//             setSelectedTypes={setSelectedTypes}
//             search={search}
//             setSearch={setSearch}
//             tray={tray}
//             setTray={setTray}
//             onReset={reset}
//             user={user}
//             onLogout={onLogout}
//           />
//         )}
//         <div className="flex-1 flex flex-col overflow-hidden min-w-0">
//           <StatBar tools={filtered} />
//           <ToolTable tools={filtered} />
//         </div>
//       </div>
//     </div>
//   );
// }
