import React from "react";

export default function ChartPanel({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl bg-slate-900 p-4 ring-1 ring-slate-800/70 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
        </div>
        <div className="text-xs text-slate-400">Last 24h</div>
      </div>
      <div className="h-64 w-full">{children}</div>
    </div>
  );
}
