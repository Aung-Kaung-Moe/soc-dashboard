import React, { useEffect, useState } from "react";
import LogViewer from "../components/LogViewer.jsx";
import { apiGet } from "../api/client.js";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let alive = true;

    async function tick() {
      const data = await apiGet("/api/logs/latest?take=250");
      if (alive) setLogs(data.items || []);
    }

    tick();
    const i = setInterval(tick, 2500);
    return () => {
      alive = false;
      clearInterval(i);
    };
  }, []);

  return <LogViewer logs={logs} />;
}
