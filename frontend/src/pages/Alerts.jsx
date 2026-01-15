import React, { useEffect, useState } from "react";
import { apiGet } from "../lib/api";
import AlertTable from "../components/AlertTable";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiGet("/api/alerts?limit=50")
      .then((data) => setAlerts(data.items ?? []))
      .catch((e) => setErr(String(e)));
  }, []);

  if (err) return <div className="text-red-400 p-4">{err}</div>;
  return <AlertTable alerts={alerts} />;
}
