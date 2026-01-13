import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";

import { actorMiddleware } from "./middleware/actor";
import { alertsRouter } from "./routes/alerts";
import { logsRouter } from "./routes/logs";
import { auditRouter } from "./routes/audit";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ actor id middleware must be before routes
app.use(actorMiddleware);

app.use("/api/alerts", alertsRouter);
app.use("/api/logs", logsRouter);
app.use("/api/audit", auditRouter);

// Health check (typed)
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
