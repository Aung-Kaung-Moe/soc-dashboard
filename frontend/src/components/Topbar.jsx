// frontend/src/components/Topbar.jsx
import React from "react";
import { Bell, Shield, Search } from "lucide-react";

export default function Topbar({ analyst }) {
  // ✅ Safe fallback so UI never crashes
  const safeAnalyst = analyst ?? { name: "SOC Analyst", role: "L1 Analyst" };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-900/60 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        {/* Left: title + search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-100">
            <Shield className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-semibold">SOC Dashboard</span>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-950/30 px-3 py-2 ring-1 ring-slate-800/70">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              className="w-64 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              placeholder="Search alerts, IPs, users..."
            />
          </div>
        </div>

        {/* Right: analyst + notifications */}
        <div className="flex items-center gap-3">
          <button
            className="relative rounded-xl bg-slate-950/30 p-2 ring-1 ring-slate-800/70 hover:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
            aria-label="Notifications"
            type="button"
          >
            <Bell className="h-5 w-5 text-blue-500" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-slate-900" />
          </button>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-100">
              {safeAnalyst.name}
            </span>
            <span className="text-xs text-slate-400">{safeAnalyst.role}</span>
          </div>

          <div className="h-9 w-9 rounded-full bg-slate-800 ring-1 ring-slate-700 grid place-items-center text-xs font-semibold text-slate-100">
            {initials(safeAnalyst.name)}
          </div>
        </div>
      </div>
    </header>
  );
}

function initials(name) {
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "SA";
}
