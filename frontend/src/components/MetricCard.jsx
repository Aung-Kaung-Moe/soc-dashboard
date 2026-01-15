import React from "react";

export default function MetricCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 p-4">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-100">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-400">{hint}</div> : null}
    </div>
  );
}
