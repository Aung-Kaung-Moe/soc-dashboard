import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma";
import { LogLevel } from "@prisma/client";

export const logsRouter = Router();

function isLogLevel(x: unknown): x is LogLevel {
  return typeof x === "string" && (Object.values(LogLevel) as string[]).includes(x);
}

/**
 * GET /api/logs?level=INFO&source=Firewall&host=vpn01&search=text&take=100
 */
logsRouter.get("/", async (req: Request, res: Response) => {
  const q = req.query as Record<string, string | undefined>;
  const take = Math.min(Math.max(parseInt(q.take ?? "100", 10) || 100, 1), 500);

  const where: any = {};

  if (isLogLevel(q.level)) where.level = q.level;
  if (q.source) where.source = q.source;
  if (q.host) where.host = q.host;

  if (q.search && q.search.trim()) {
    where.message = { contains: q.search.trim() };
  }

  const items = await prisma.logEntry.findMany({
    where,
    orderBy: { timestamp: "desc" },
    take,
  });

  res.json({ items });
});

/**
 * POST /api/logs
 * body: { timestamp?, level, message, source?, host? }
 */
logsRouter.post("/", async (req: Request, res: Response) => {
  const body = req.body as {
    timestamp?: string;
    level?: LogLevel;
    message?: string;
    source?: string | null;
    host?: string | null;
  };

  if (!body.message) return res.status(400).json({ error: "message is required" });
  if (!isLogLevel(body.level)) return res.status(400).json({ error: "level must be INFO/WARN/ERROR" });

  const created = await prisma.logEntry.create({
    data: {
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
      level: body.level,
      message: body.message,
      source: body.source ?? null,
      host: body.host ?? null,
    },
  });

  res.status(201).json(created);
});
