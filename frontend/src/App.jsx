import React from "react";
import { Routes, Route, NavLink, useSearchParams } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage.jsx";
import AlertsPage from "./pages/AlertsPage.jsx";
import LogsPage from "./pages/LogsPage.jsx";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-xl px-3 py-2 text-sm ring-1 ring-siem-border/70 hover:bg-white/5 ${
          isActive ? "bg-white/5 text-siem-text" : "text-siem-muted"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function App() {
  // This is the key: we store drilldown in URL like ?ip=1.2.3.4
  const [params] = useSearchParams();
  const ip = params.get("ip") || "";

  return (
    <div className="min-h-screen bg-siem-bg">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">SOC / SIEM Dashboard</div>
            <div className="text-xs text-siem-muted">Splunk-style triage + streaming logs</div>
          </div>

          <div className="flex gap-2">
            <NavItem to="/">Overview</NavItem>
            <NavItem to="/alerts">Alerts</NavItem>
            <NavItem to={`/logs${ip ? `?ip=${encodeURIComponent(ip)}` : ""}`}>Logs</NavItem>
          </div>
        </div>

        <div className="mt-5">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/logs" element={<LogsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
