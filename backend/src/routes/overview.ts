import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma.js";

export const overviewRouter = Router();

/**
 * GET /api/overview/top10?hours=24
 * Returns beginner-friendly “Top 10” lists.
 */
overviewRouter.get("/top10", async (req: Request, res: Response) => {
  const hours = Math.min(Math.max(parseInt(String(req.query.hours ?? "24"), 10) || 24, 1), 168);
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const alerts = await prisma.alert.findMany({
    where: { timestamp: { gte: since } },
    select: { sourceIp: true, hostname: true, user: true, eventCount: true },
    take: 5000 // dev-safe cap
  });

  const countBy = (keyFn: (a: any) => string | null | undefined) => {
    const map = new Map<string, number>();
    for (const a of alerts) {
      const k = keyFn(a);
      if (!k) continue;
      map.set(k, (map.get(k) ?? 0) + (a.eventCount ?? 1));
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key, count]) => ({ key, count }));
  };

  res.json({
    timeRangeHours: hours,
    topAttackedAssets: countBy((a) => a.hostname),
    topMaliciousSourceIps: countBy((a) => a.sourceIp),
    topUsersFailedLogins: countBy((a) => a.user)
  });
});
