import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MetricCard from "../components/MetricCard";
import ChartPanel from "../components/ChartPanel";
import AlertTable from "../components/AlertTable";
import LogViewer from "../components/LogViewer";
import { api } from "../lib/api";

export default function SocDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [error, setError] = useState("");

  // Table controls
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All"); // All | Critical | Medium | Low

  // Fetch alerts (with server-side filters)
  useEffect(() => {
    let alive = true;

    async function load() {
      setLoadingAlerts(true);
      setError("");

      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (severityFilter !== "All") params.severity = severityFilter;

        const data = await api.getAlerts(params);
        if (!alive) return;
        setAlerts(data.items ?? []);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Failed to load alerts");
      } finally {
        if (alive) setLoadingAlerts(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [search, severityFilter]);

  // Fetch logs (polling)
  useEffect(() => {
    let alive = true;
    let timer;

    async function loadLogs() {
      try {
        setLoadingLogs(true);
        const data = await api.getLatestLogs(200);
        if (!alive) return;
        // if your endpoint returns {items:[...]} then use data.items
        setLogs(data.items ?? data ?? []);
      } catch (e) {
        if (!alive) return;
        setError((prev) => prev || (e.message || "Failed to load logs"));
      } finally {
        if (alive) setLoadingLogs(false);
      }
    }

    loadLogs();
    timer = setInterval(loadLogs, 5000); // refresh logs every 5s
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  // Metrics
  const metrics = useMemo(() => {
    const total = alerts.length;
    const critical = alerts.filter((a) => a.severity === "Critical").length;
    const medium = alerts.filter((a) => a.severity === "Medium").length;
    const low = alerts.filter((a) => a.severity === "Low").length;

    return { total, critical, medium, low };
  }, [alerts]);

  // Charts data (shape these to what your ChartPanel expects)
  const severityDistribution = useMemo(() => {
    return [
      { name: "Critical", value: metrics.critical },
      { name: "Medium", value: metrics.medium },
      { name: "Low", value: metrics.low },
    ];
  }, [metrics]);

  const attackTypePie = useMemo(() => {
    const map = new Map();
    for (const a of alerts) {
      const key = a.alertType || "Unknown";
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [alerts]);

  const alertsOverTime = useMemo(() => {
    // Group by hour (last 12h)
    const buckets = new Map();
    const now = Date.now();
    for (let i = 11; i >= 0; i--) {
      const t = new Date(now - i * 60 * 60 * 1000);
      const key = `${t.getHours().toString().padStart(2, "0")}:00`;
      buckets.set(key, 0);
    }

    for (const a of alerts) {
      const t = new Date(a.timestamp);
      const key = `${t.getHours().toString().padStart(2, "0")}:00`;
      if (buckets.has(key)) buckets.set(key, buckets.get(key) + 1);
    }

    return Array.from(buckets.entries()).map(([time, count]) => ({
      time,
      alerts: count,
    }));
  }, [alerts]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6 space-y-6">
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-200">
              {error}
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard title="Total Alerts Today" value={metrics.total} variant="info" />
            <MetricCard title="Critical Alerts" value={metrics.critical} variant="critical" />
            <MetricCard title="Medium Alerts" value={metrics.medium} variant="medium" />
            <MetricCard title="Low Alerts" value={metrics.low} variant="low" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <ChartPanel
              title="Alerts Over Time"
              type="line"
              data={alertsOverTime}
              loading={loadingAlerts}
            />
            <ChartPanel
              title="Severity Distribution"
              type="bar"
              data={severityDistribution}
              loading={loadingAlerts}
            />
            <ChartPanel
              title="Attack Types"
              type="pie"
              data={attackTypePie}
              loading={loadingAlerts}
            />
          </div>

          {/* Alerts Table */}
          <AlertTable
            alerts={alerts}
            loading={loadingAlerts}
            search={search}
            onSearchChange={setSearch}
            severityFilter={severityFilter}
            onSeverityFilterChange={setSeverityFilter}
          />

          {/* Logs */}
          <LogViewer logs={logs} loading={loadingLogs} />
        </main>
      </div>
    </div>
  );
}
