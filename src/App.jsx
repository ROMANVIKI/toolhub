import { useState } from "react";
import { useConfig } from "./config";
import LoginScreen from "./components/LoginScreen";
import MenuScreen from "./components/MenuScreen";
import SettingsScreen from "./components/SettingsScreen";
import MainApp from "./components/MainApp";

export default function App() {
  const { config, loading, reload } = useConfig();
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("menu"); // "menu" | "tools" | "settings"

  if (loading) {
    return (
      <div
        className="w-screen h-screen flex items-center justify-center"
        style={{ background: "#080d14" }}
      >
        <div
          className="text-xs tracking-widest animate-pulse-slow"
          style={{ color: "rgba(59,130,246,0.5)", fontFamily: "monospace", letterSpacing: "0.25em" }}
        >
          LOADING CONFIG…
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={(u) => setUser(u)} config={config} />;
  }

  if (page === "settings") {
    return (
      <SettingsScreen
        config={config}
        onBack={() => setPage("menu")}
        onSaved={() => {
          reload(); // Reload config after save
          setPage("menu");
        }}
      />
    );
  }

  if (page === "tools") {
    return (
      <MainApp
        user={user}
        config={config}
        onLogout={() => {
          setUser(null);
          setPage("menu");
        }}
        onBack={() => setPage("menu")}
      />
    );
  }

  return (
    <MenuScreen
      user={user}
      config={config}
      onNavigate={(id) => {
        if (id === "tools") setPage("tools");
        if (id === "settings") setPage("settings");
        // extend here for other pages as your app grows
      }}
      onLogout={() => {
        setUser(null);
        setPage("menu");
      }}
    />
  );
}

// import { useState } from "react";
// import { useConfig } from "./config";
// import LoginScreen from "./components/LoginScreen";
// import MenuScreen from "./components/MenuScreen";
// import MainApp from "./components/MainApp";
//
// export default function App() {
//   const { config, loading } = useConfig();
//   const [user, setUser] = useState(null);
//   const [page, setPage] = useState("menu"); // "menu" | "tools" | "service" | etc.
//
//   if (loading) {
//     return (
//       <div
//         className="w-screen h-screen flex items-center justify-center"
//         style={{ background: "#080d14" }}
//       >
//         <div
//           className="text-xs tracking-widest animate-pulse-slow"
//           style={{ color: "rgba(59,130,246,0.5)", fontFamily: "monospace", letterSpacing: "0.25em" }}
//         >
//           LOADING CONFIG…
//         </div>
//       </div>
//     );
//   }
//
//   if (!user) {
//     return <LoginScreen onLogin={(u) => setUser(u)} config={config} />;
//   }
//
//   if (page !== "tools") {
//     return (
//       <MenuScreen
//         user={user}
//         config={config}
//         onNavigate={(id) => {
//           if (id === "tools") setPage("tools");
//           // extend here for other pages as your app grows
//         }}
//         onLogout={() => { setUser(null); setPage("menu"); }}
//       />
//     );
//   }
//
//   return (
//     <MainApp
//       user={user}
//       config={config}
//       onLogout={() => { setUser(null); setPage("menu"); }}
//       onBack={() => setPage("menu")}
//     />
//   );
// }
