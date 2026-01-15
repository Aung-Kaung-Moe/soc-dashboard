import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma.js";
import { AlertStatus } from "@prisma/client";

export const kpisRouter = Router();

/**
 * Beginner-friendly KPIs (simple + useful)
 * GET /api/kpis?hours=24
 */
kpisRouter.get("/", async (req: Request, res: Response) => {
  const hours = Math.min(Math.max(parseInt(String(req.query.hours ?? "24"), 10) || 24, 1), 168);
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const [totalAlerts, openAlerts, investigating, closed] = await Promise.all([
    prisma.alert.count({ where: { timestamp: { gte: since } } }),
    prisma.alert.count({ where: { timestamp: { gte: since }, status: AlertStatus.Open } }),
    prisma.alert.count({ where: { timestamp: { gte: since }, status: AlertStatus.Investigating } }),
    prisma.alert.count({ where: { timestamp: { gte: since }, status: AlertStatus.Closed } })
  ]);

  // Simple “MTTD/MTTR” placeholders (can be upgraded later with incident table)
  const mttdSeconds = 8 * 60 + 12;
  const mttrSeconds = 41 * 60 + 30;

  res.json({
    timeRangeHours: hours,
    kpis: {
      mttdSeconds,
      mttrSeconds,
      totalAlerts,
      queue: { open: openAlerts, investigating, closed }
    }
  });
});
