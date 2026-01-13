// backend/src/routes/logs.ts
import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma";
import { LogLevel, Prisma } from "@prisma/client";

export const logsRouter = Router();

function isLogLevel(x: unknown): x is LogLevel {
  return typeof x === "string" && (Object.values(LogLevel) as string[]).includes(x);
}

// Prisma JSON helper (SQLite Json column)
function toJson(v: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  return v === undefined ? Prisma.JsonNull : (v as Prisma.InputJsonValue);
}

/**
 * GET /api/logs/latest?limit=200&level=INFO&source=waf&host=web-01&search=ssh
 * High-performance "latest N logs"
 */
logsRouter.get("/latest", async (req: Request, res: Response) => {
  const q = req.query as Record<string, string | undefined>;
  const take = Math.min(Math.max(parseInt(q.limit ?? "200", 10) || 200, 1), 2000);

  const where: Prisma.LogEntryWhereInput = {};

  if (isLogLevel(q.level)) where.level = q.level;
  if (q.source?.trim()) where.source = { contains: q.source.trim() };
  if (q.host?.trim()) where.host = { contains: q.host.trim() };

  if (q.search?.trim()) {
    const s = q.search.trim();
    where.OR = [{ message: { contains: s } }, { source: { contains: s } }, { host: { contains: s } }];
  }

  const items = await prisma.logEntry.findMany({
    where,
    orderBy: { timestamp: "desc" },
    take,
  });

  res.json({ items, limit: take });
});

/**
 * GET /api/logs
 * Paginated logs
 */
logsRouter.get("/", async (req: Request, res: Response) => {
  const q = req.query as Record<string, string | undefined>;

  const take = Math.min(Math.max(parseInt(q.limit ?? "200", 10) || 200, 1), 2000);
  const skip = Math.max(parseInt(q.offset ?? "0", 10) || 0, 0);

  const where: Prisma.LogEntryWhereInput = {};

  if (isLogLevel(q.level)) where.level = q.level;
  if (q.source?.trim()) where.source = { contains: q.source.trim() };
  if (q.host?.trim()) where.host = { contains: q.host.trim() };

  if (q.from || q.to) {
    where.timestamp = {};
    if (q.from) where.timestamp.gte = new Date(q.from);
    if (q.to) where.timestamp.lte = new Date(q.to);
  }

  if (q.search?.trim()) {
    const s = q.search.trim();
    where.OR = [{ message: { contains: s } }, { source: { contains: s } }, { host: { contains: s } }];
  }

  const [total, items] = await Promise.all([
    prisma.logEntry.count({ where }),
    prisma.logEntry.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take,
      skip,
    }),
  ]);

  res.json({ total, items, limit: take, offset: skip });
});

/**
 * POST /api/logs
 * Optional ingest endpoint
 * Body: { level, message, source?, host?, raw? }
 */
logsRouter.post("/", async (req: Request, res: Response) => {
  const body = req.body as Partial<{
    timestamp: string;
    level: LogLevel;
    message: string;
    source: string;
    host: string;
    raw: unknown;
  }>;

  if (!body.message) return res.status(400).json({ error: "message is required" });
  if (!isLogLevel(body.level)) return res.status(400).json({ error: "level must be INFO/WARN/ERROR" });

  const created = await prisma.logEntry.create({
    data: {
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
      level: body.level,
      message: body.message,
      source: body.source ?? null,
      host: body.host ?? null,
      raw: body.raw === undefined ? Prisma.JsonNull : (body.raw as Prisma.InputJsonValue), // ✅ FIX
    },
  });

  res.status(201).json(created);
});
