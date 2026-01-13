import React from "react";
import { cls } from "../lib/ui.js";

export default function LogViewer({ logs }) {
  return (
    <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 shadow-sm">
      <div className="border-b border-slate-800/70 p-4">
        <h3 className="text-sm font-semibold text-slate-100">Log Viewer</h3>
        <p className="mt-1 text-xs text-slate-400">Streaming events (mock). Suspicious lines highlighted.</p>
      </div>

      <div className="max-h-[360px] overflow-auto p-4">
        <div className="space-y-2 font-mono text-xs">
          {logs.map((l, idx) => {
            const isSuspicious = l.level === "ALERT" || /suspicious|malware|brute|threshold/i.test(l.msg);
            return (
              <div
                key={`${l.ts}-${idx}`}
                className={cls(
                  "rounded-xl px-3 py-2 ring-1",
                  isSuspicious
                    ? "bg-rose-500/10 text-rose-200 ring-rose-500/20 shadow-[0_0_18px_rgba(244,63,94,0.10)]"
                    : "bg-slate-950/30 text-slate-200 ring-slate-800/70"
                )}
              >
                <span className="text-slate-500">{l.ts}</span>{" "}
                <span className={cls("font-semibold", isSuspicious ? "text-rose-200" : "text-slate-100")}>
                  [{l.level}]
                </span>{" "}
                <span className={isSuspicious ? "text-rose-200" : "text-slate-200"}>{l.msg}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
