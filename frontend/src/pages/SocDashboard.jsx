import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import AlertTable from "../components/AlertTable.jsx";
import LogViewer from "../components/LogViewer.jsx";
// import ChartPanel from "../components/ChartPanel.jsx"; // if you have it

export default function SocDashboard() {
  const [activePage, setActivePage] = useState("Dashboard"); // Dashboard | Alerts | Logs | Threat Intelligence | Settings

  // Example: analyst object (prevents Topbar crash)
  const analyst = useMemo(() => ({ name: "Mr.Aung Thar", role: "L1 Analyst" }), []);

  // Backend data states (optional, if you already fetch)
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);

  // Example fetches (change URL/ports if needed)
  useEffect(() => {
    // Only fetch when the page needs the data
    if (activePage === "Alerts") {
      fetch("http://localhost:4000/api/alerts")
        .then((r) => r.json())
        .then((data) => setAlerts(data.items ?? []))
        .catch(() => setAlerts([]));
    }

    if (activePage === "Logs") {
      fetch("http://localhost:4000/api/logs?limit=200")
        .then((r) => r.json())
        .then((data) => setLogs(data.items ?? []))
        .catch(() => setLogs([]));
    }
  }, [activePage]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        <Sidebar active={activePage} onChange={setActivePage} />

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar analyst={analyst} />

          <main className="p-4 md:p-6">
            {activePage === "Dashboard" && (
              <div className="space-y-4">
                {/* Put your metrics + charts here */}
                <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 p-4">
                  <div className="text-sm font-semibold">Dashboard</div>
                  <div className="mt-1 text-xs text-slate-400">
                    Click Alerts/Logs in the sidebar to switch views.
                  </div>
                </div>

                {/* Example: show Alerts preview */}
                {/* <ChartPanel ... /> */}
              </div>
            )}

            {activePage === "Alerts" && <AlertTable alerts={alerts} />}

            {activePage === "Logs" && <LogViewer logs={logs} />}

            {activePage === "Threat Intelligence" && (
              <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 p-4">
                <div className="text-sm font-semibold">Threat Intelligence</div>
                <div className="mt-1 text-xs text-slate-400">Coming soon…</div>
              </div>
            )}

            {activePage === "Settings" && (
              <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 p-4">
                <div className="text-sm font-semibold">Settings</div>
                <div className="mt-1 text-xs text-slate-400">Coming soon…</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
