import React from "react";

export default function Topbar({ analyst }) {
  const name = analyst?.name ?? "SOC Analyst";
  const role = analyst?.role ?? "L1 Analyst";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/70 bg-slate-950/50 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4 md:p-6">
        <div>
          <div className="text-sm font-semibold text-slate-100">Overview</div>
          <div className="text-xs text-slate-400">Simple SIEM panels for quick learning</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-slate-100">{name}</div>
            <div className="text-xs text-slate-400">{role}</div>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-slate-900 ring-1 ring-slate-800/70" />
        </div>
      </div>
    </header>
  );
}
