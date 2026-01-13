import React from "react";
import { cls, SEVERITY_META } from "../lib/ui.js";

export default function MetricCard({ title, value, severity = "Low", icon }) {
  const meta = SEVERITY_META[severity] ?? SEVERITY_META.Low;

  return (
    <div className={cls("rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 p-4 shadow-sm", meta.card)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">{value}</p>
        </div>

        <div className="rounded-xl bg-slate-950/30 p-2 ring-1 ring-slate-800/70 text-blue-400">
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <span className={cls("h-2 w-2 rounded-full", meta.dot)} />
        <span>{severity} priority</span>
      </div>
    </div>
  );
}
