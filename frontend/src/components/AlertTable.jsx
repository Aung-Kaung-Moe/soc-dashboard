import React, { useMemo, useState } from "react";
import { cls, SEVERITY_META, STATUS_META } from "../lib/ui.js";

export default function AlertTable({ alerts }) {
  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alerts.filter((a) => {
      const matchesText =
        !q ||
        a.timestamp.toLowerCase().includes(q) ||
        a.sourceIp.toLowerCase().includes(q) ||
        a.alertType.toLowerCase().includes(q) ||
        a.severity.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q);

      const matchesSeverity = severityFilter === "All" ? true : a.severity === severityFilter;
      return matchesText && matchesSeverity;
    });
  }, [alerts, query, severityFilter]);

  return (
    <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 shadow-sm">
      {/* Header + controls */}
      <div className="flex flex-col gap-3 border-b border-slate-800/70 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Alerts</h3>
          <p className="mt-1 text-xs text-slate-400">Search and triage incoming detections</p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search alerts (IP, type, status...)"
            className="w-full rounded-xl bg-slate-950/30 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-800/70 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/35 md:w-80"
          />

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-xl bg-slate-950/30 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-800/70 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs text-slate-400">
            <tr className="border-b border-slate-800/70">
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Source IP</th>
              <th className="px-4 py-3 font-medium">Alert Type</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/40">
            {filtered.map((a) => {
              const sev = SEVERITY_META[a.severity] ?? SEVERITY_META.Low;
              const statusClass = STATUS_META[a.status] ?? STATUS_META.Open;

              return (
                <tr key={a.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 text-slate-400">{a.timestamp}</td>
                  <td className="px-4 py-3 font-mono text-slate-200">{a.sourceIp}</td>
                  <td className="px-4 py-3 text-slate-200">{a.alertType}</td>

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
            })}

            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  No alerts match your search/filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
