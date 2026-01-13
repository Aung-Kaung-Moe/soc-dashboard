import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import MetricCard from "../components/MetricCard.jsx";
import ChartPanel from "../components/ChartPanel.jsx";
import AlertTable from "../components/AlertTable.jsx";
import LogViewer from "../components/LogViewer.jsx";

import { Shield, Flame } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  ANALYST,
  ALERTS_OVER_TIME,
  SEVERITY_DISTRIBUTION,
  ATTACK_TYPES,
  ALERTS,
  LOG_LINES,
} from "../data/mockData.js";
import { PIE_COLORS } from "../lib/ui.js";

const tooltipStyle = {
  background: "rgba(2, 6, 23, 0.95)", // slate-950-ish
  border: "1px solid rgba(148, 163, 184, 0.18)", // slate-400-ish
  borderRadius: 12,
  color: "white",
};

export default function SocDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const metrics = useMemo(() => {
    const total = ALERTS.length;
    const critical = ALERTS.filter((a) => a.severity === "Critical").length;
    const medium = ALERTS.filter((a) => a.severity === "Medium").length;
    const low = ALERTS.filter((a) => a.severity === "Low").length;
    return { total, critical, medium, low };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar active={activePage} onNavigate={setActivePage} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar analyst={ANALYST} />

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-100">
                  SOC Analyst Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Monitor alerts, severity trends, and suspicious activity (mock data)
                </p>
              </div>

              <div className="text-xs text-slate-400">
                Theme: <span className="text-slate-200">Modern Obsidian</span> • Active:{" "}
                <span className="text-blue-400">Cyber Blue</span>
              </div>
            </div>

            {activePage === "dashboard" ? (
              <DashboardHome metrics={metrics} />
            ) : activePage === "alerts" ? (
              <AlertTable alerts={ALERTS} />
            ) : activePage === "logs" ? (
              <LogViewer logs={LOG_LINES} />
            ) : activePage === "threat" ? (
              <Placeholder title="Threat Intelligence" text="Add IOC feeds, CVEs, and campaigns here." />
            ) : (
              <Placeholder title="Settings" text="Add theme, refresh, routing, and notification preferences." />
            )}
          </main>

          <footer className="border-t border-slate-800/60 bg-slate-950 px-4 py-4 text-center text-xs text-slate-400">
            SOC Dashboard • Tailwind + React + Recharts • Mock JSON
          </footer>
        </div>
      </div>
    </div>
  );
}

function DashboardHome({ metrics }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Alerts Today"
          value={metrics.total}
          severity="Medium"
          icon={<Shield className="h-5 w-5 text-blue-400" />}
        />
        <MetricCard
          title="Critical Alerts"
          value={metrics.critical}
          severity="Critical"
          icon={<Flame className="h-5 w-5 text-rose-400" />}
        />
        <MetricCard
          title="Medium Alerts"
          value={metrics.medium}
          severity="Medium"
          icon={<Shield className="h-5 w-5 text-amber-400" />}
        />
        <MetricCard
          title="Low Alerts"
          value={metrics.low}
          severity="Low"
          icon={<Shield className="h-5 w-5 text-emerald-400" />}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ChartPanel title="Alerts Over Time" subtitle="Line chart of alert volume">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ALERTS_OVER_TIME} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.10)" />
              <XAxis dataKey="time" stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 12 }} />
              <YAxis stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="alerts" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Severity Distribution" subtitle="Bar chart by severity">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SEVERITY_DISTRIBUTION} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.10)" />
              <XAxis dataKey="severity" stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 12 }} />
              <YAxis stroke="rgba(148,163,184,0.55)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[10, 10, 4, 4]}>
                {SEVERITY_DISTRIBUTION.map((row) => {
                  const color =
                    row.severity === "Critical" ? "#F43F5E" : row.severity === "Medium" ? "#F59E0B" : "#10B981";
                  return <Cell key={row.severity} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Attack Types" subtitle="Pie chart of top categories">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: "rgba(226,232,240,0.75)", fontSize: 12 }} />
              <Pie data={ATTACK_TYPES} dataKey="value" nameKey="type" innerRadius={45} outerRadius={80} paddingAngle={2}>
                {ATTACK_TYPES.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertTable alerts={ALERTS} />
        </div>
        <div className="lg:col-span-1">
          <LogViewer logs={LOG_LINES} />
        </div>
      </section>
    </div>
  );
}

function Placeholder({ title, text }) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6 ring-1 ring-slate-800/70 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
    </div>
  );
}
