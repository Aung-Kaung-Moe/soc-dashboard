import React from "react";
import { NavLink } from "react-router-dom";

const itemBase =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition";
const inactive = "text-slate-300 hover:bg-slate-900/60 hover:text-slate-100";
const active =
  "bg-slate-900/70 text-slate-100 ring-1 ring-slate-800/70";

function Item({ to, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => `${itemBase} ${isActive ? active : inactive}`}>
      <span className="h-2 w-2 rounded-full bg-blue-500/80" />
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-800/70 bg-slate-900/40 backdrop-blur-xl md:block">
      <div className="p-4">
        <div className="rounded-2xl bg-slate-950/30 p-4 ring-1 ring-slate-800/70">
          <div className="text-sm font-semibold text-slate-100">SOC Dashboard</div>
          <div className="mt-1 text-xs text-slate-400">Beginner-friendly SIEM</div>
        </div>

        <nav className="mt-4 space-y-1">
          <Item to="/overview" label="Overview" />
          <Item to="/alerts" label="Alerts" />
          <Item to="/logs" label="Logs" />
        </nav>

        <div className="mt-6 rounded-2xl bg-slate-950/30 p-4 ring-1 ring-slate-800/70">
          <div className="text-xs font-semibold text-slate-200">Tip</div>
          <p className="mt-1 text-xs text-slate-400">
            Start on <span className="text-slate-200">Overview</span>, then click an alert to investigate.
          </p>
        </div>
      </div>
    </aside>
  );
}
