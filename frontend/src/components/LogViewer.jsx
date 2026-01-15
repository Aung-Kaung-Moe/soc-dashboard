import React from "react";

export default function LogViewer({ logs }) {
  return (
    <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 p-4">
      <div className="mb-2 text-sm font-semibold text-slate-100">Live Logs</div>
      <div className="h-[420px] overflow-auto rounded-xl bg-slate-950/30 p-3 font-mono text-xs ring-1 ring-slate-800/70">
        {logs.map((l) => {
          const c =
            l.level === "ERROR"
              ? "text-rose-300"
              : l.level === "WARN"
                ? "text-amber-300"
                : "text-slate-300";
          return (
            <div key={l.id} className="py-0.5">
              <span className="text-slate-500">{new Date(l.timestamp).toLocaleTimeString()}</span>{" "}
              <span className={c}>[{l.level}]</span>{" "}
              <span className="text-slate-200">{l.message}</span>{" "}
              <span className="text-slate-500">({l.host || "host"} / {l.source || "source"})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
