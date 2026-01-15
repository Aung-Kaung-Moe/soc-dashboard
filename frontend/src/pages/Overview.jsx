import React, { useEffect, useState } from "react";
import MetricCard from "../components/MetricCard.jsx";
import { apiGet } from "../api/client.js";

export default function Overview() {
  const [kpis, setKpis] = useState(null);
  const [top, setTop] = useState(null);

  useEffect(() => {
    (async () => {
      const k = await apiGet("/api/kpis?hours=24");
      const t = await apiGet("/api/overview/top10?hours=24");
      setKpis(k);
      setTop(t);
    })();
  }, []);

  const fmtSeconds = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 p-4">
        <div className="text-sm font-semibold text-slate-100">What should I do next?</div>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-300">
          <li>Filter Alerts to <span className="text-slate-100">Critical + Open</span></li>
          <li>Check suspicious users with many failures</li>
          <li>Use Logs to confirm if it’s real or noise</li>
        </ol>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="MTTD" value={kpis ? fmtSeconds(kpis.kpis.mttdSeconds) : "—"} hint="Average time to detect" />
        <MetricCard title="MTTR" value={kpis ? fmtSeconds(kpis.kpis.mttrSeconds) : "—"} hint="Average time to respond" />
        <MetricCard title="Total Alerts (24h)" value={kpis ? kpis.kpis.totalAlerts : "—"} hint="All severities" />
        <MetricCard title="Open Queue" value={kpis ? kpis.kpis.queue.open : "—"} hint="Needs review" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Panel title="Top Attacked Assets" items={top?.topAttackedAssets} />
        <Panel title="Top Source IPs" items={top?.topMaliciousSourceIps} />
        <Panel title="Top Users (Fail Logins)" items={top?.topUsersFailedLogins} />
      </div>
    </div>
  );
}

function Panel({ title, items }) {
  return (
    <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800/70 p-4">
      <div className="text-sm font-semibold text-slate-100">{title}</div>
      <div className="mt-3 space-y-2">
        {(items || []).map((x) => (
          <div key={x.key} className="flex items-center justify-between text-sm">
            <span className="text-slate-200">{x.key}</span>
            <span className="rounded-full bg-slate-950/30 px-2 py-0.5 text-xs text-slate-400 ring-1 ring-slate-800/70">
              {x.count}
            </span>
          </div>
        ))}
        {!items ? <div className="text-sm text-slate-400">Loading…</div> : null}
      </div>
    </div>
  );
}
