import React, { useEffect, useMemo, useState } from "react";
import { apiGet } from "../api/client.js";

const SEV_META = {
  Critical: { badge: "text-rose-400 bg-rose-500/10 ring-1 ring-rose-500/20", dot: "bg-rose-400" },
  Medium: { badge: "text-amber-400 bg-amber-500/10 ring-1 ring-amber-500/20", dot: "bg-amber-400" },
  Low: { badge: "text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20", dot: "bg-emerald-400" }
};

const STATUS_META = {
  Open: "text-slate-200 bg-slate-800/40 ring-1 ring-slate-700/40",
  Investigating: "text-blue-300 bg-blue-500/10 ring-1 ring-blue-500/20",
  Closed: "text-slate-400 bg-slate-900/40 ring-1 ring-slate-800/40"
};

function cls(...a) {
  return a.filter(Boolean).join(" ");
}

function fmt(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

export default function AlertTable() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      if (severity !== "All") params.set("severity", severity);
      if (status !== "All") params.set("status", status);
      params.set("limit", "50");

      const data = await apiGet(`/api/alerts?${params.toString()}`);
      setAlerts(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // debounce for beginners
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, severity, status]);

  const rows = useMemo(() => alerts, [alerts]);

  return (
    <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-800/70 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Alerts</h3>
          <p className="mt-1 text-xs text-slate-400">
            Beginner tip: start with <span className="text-slate-200">Critical</span> +{" "}
            <span className="text-slate-200">Open</span>.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search (IP, type, hostname, user...)"
            className="w-full rounded-xl bg-slate-950/30 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-800/70 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/35 md:w-80"
          />

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="rounded-xl bg-slate-950/30 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-800/70 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl bg-slate-950/30 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-800/70 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Investigating">Investigating</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs text-slate-400">
            <tr className="border-b border-slate-800/70">
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Source IP</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/40">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  No alerts match your filters.
                </td>
              </tr>
            ) : (
              rows.map((a) => {
                const sev = SEV_META[a.severity] ?? SEV_META.Low;
                const statusClass = STATUS_META[a.status] ?? STATUS_META.Open;

                return (
                  <tr key={a.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-400">{fmt(a.timestamp)}</td>
                    <td className="px-4 py-3 font-mono text-slate-200">{a.sourceIp}</td>
                    <td className="px-4 py-3 text-slate-200">{a.title || a.alertType}</td>

                    <td className="px-4 py-3">
                      <span className={cls("inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs", sev.badge)}>
                        <span className={cls("h-1.5 w-1.5 rounded-full", sev.dot)} />
                        {a.severity}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={cls("rounded-full px-2.5 py-1 text-xs", statusClass)}>{a.status}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
