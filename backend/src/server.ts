import "dotenv/config";
import express from "express";
import cors from "cors";

import { actorMiddleware } from "./middleware/actor";
import { alertsRouter } from "./routes/alerts";
import { logsRouter } from "./routes/logs";
import { auditRouter } from "./routes/audit";
import { kpisRouter } from "./routes/kpis";
import { overviewRouter } from "./routes/overview";

const app = express();

app.use(cors());
app.use(express.json());

// must be before routes
app.use(actorMiddleware);

app.use("/api/overview", overviewRouter);
app.use("/api/kpis", kpisRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/logs", logsRouter);
app.use("/api/audit", auditRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
