import React from "react";
import { Bell, Shield } from "lucide-react";

export default function Topbar({ analyst }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900/70 ring-1 ring-slate-800/70 md:hidden">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100">{analyst.name}</div>
            <div className="text-xs text-slate-400">{analyst.role}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative rounded-xl bg-slate-900/70 p-2 ring-1 ring-slate-800/70 hover:bg-slate-800/70 hover:ring-blue-500/25">
            <Bell className="h-5 w-5 text-blue-400" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </button>

          <div className="hidden rounded-xl bg-slate-900/70 px-3 py-2 text-xs text-slate-200 ring-1 ring-slate-800/70 sm:block">
            Shift: <span className="text-slate-100">Night</span>
          </div>
        </div>
      </div>
    </header>
  );
}
