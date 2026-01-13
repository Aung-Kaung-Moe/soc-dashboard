import React from "react";
import { cls } from "../lib/ui.js";
import { Shield } from "lucide-react";

export default function Sidebar({ active, onNavigate }) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "alerts", label: "Alerts" },
    { key: "logs", label: "Logs" },
    { key: "threat", label: "Threat Intelligence" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800/60 bg-slate-900/50 backdrop-blur-xl p-4 md:block">
      <div className="flex items-center gap-3 rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 p-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950/30 ring-1 ring-slate-800/70">
          <Shield className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-100">SOC Console</div>
          <div className="text-xs text-slate-400">Modern Obsidian UI</div>
        </div>
      </div>

      <nav className="mt-4 space-y-1">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onNavigate(it.key)}
              className={cls(
                "w-full rounded-xl px-3 py-2 text-left text-sm ring-1 transition",
                isActive
                  ? "bg-blue-500/10 text-blue-300 ring-blue-500/20"
                  : "bg-transparent text-slate-200 ring-transparent hover:bg-slate-800/50 hover:ring-slate-800/70"
              )}
            >
              {it.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 p-3">
        <div className="text-xs text-slate-400">Tip</div>
        <div className="mt-1 text-sm text-slate-200">
          Prioritize <span className="text-rose-400">Critical</span> alerts first.
        </div>
      </div>
    </aside>
  );
}
