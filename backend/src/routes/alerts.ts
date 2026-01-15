import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma";
import { AlertStatus, Severity, Prisma } from "@prisma/client";

export const alertsRouter = Router();

type AuthedRequest = Request & { actorUserId?: string };

function tagsContain(tags: unknown, wanted: string): boolean {
  if (!tags) return false;
  if (Array.isArray(tags)) return tags.includes(wanted);
  if (typeof tags === "string") return tags.includes(wanted);
  return false;
}

function isSeverity(x: unknown): x is Severity {
  return typeof x === "string" && (Object.values(Severity) as string[]).includes(x);
}

function isAlertStatus(x: unknown): x is AlertStatus {
  return typeof x === "string" && (Object.values(AlertStatus) as string[]).includes(x);
}

/**
 * GET /api/alerts
 * Query:
 *  - severity, status, search, assignedToId, tag, from, to, limit, offset
 */
alertsRouter.get("/", async (req: Request, res: Response) => {
  const q = req.query as Record<string, string | undefined>;

  const take = Math.min(Math.max(parseInt(q.limit ?? "50", 10) || 50, 1), 200);
  const skip = Math.max(parseInt(q.offset ?? "0", 10) || 0, 0);

  const where: Prisma.AlertWhereInput = {};

  if (isSeverity(q.severity)) where.severity = q.severity;
  if (isAlertStatus(q.status)) where.status = q.status;
  if (q.assignedToId) where.assignedToId = q.assignedToId;

  if (q.from || q.to) {
    where.timestamp = {};
    if (q.from) where.timestamp.gte = new Date(q.from);
    if (q.to) where.timestamp.lte = new Date(q.to);
  }

  if (q.search && q.search.trim()) {
    const s = q.search.trim();
    where.OR = [
      { sourceIp: { contains: s } },
      { destinationIp: { contains: s } },
      { title: { contains: s } },
      { alertType: { contains: s } },
      { ruleName: { contains: s } },
      { hostname: { contains: s } },
      { user: { contains: s } },
      { correlationId: { contains: s } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.alert.count({ where }),
    prisma.alert.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take,
      skip,
      include: { assignedTo: { select: { id: true, name: true, email: true, role: true } } },
    }),
  ]);

  // tag filter in-memory (SQLite JSON)
  const filteredItems = q.tag ? items.filter((a) => tagsContain(a.tags as unknown, q.tag!)) : items;

  res.json({
    total: q.tag ? filteredItems.length : total,
    items: filteredItems,
    limit: take,
    offset: skip,
  });
});

/**
 * PATCH /api/alerts/:id/status
 */
alertsRouter.patch("/:id/status", async (req: AuthedRequest, res: Response) => {
  const id = String(req.params.id);
  const actorUserId = req.actorUserId;

  if (!actorUserId) {
    return res.status(401).json({
      error: "Missing actor. Provide x-user-id header or set DEFAULT_ACTOR_USER_ID in .env",
    });
  }

  const body = req.body as { status?: AlertStatus; assignedToId?: string | null };

  if (!isAlertStatus(body.status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  const before = await prisma.alert.findUnique({ where: { id } });
  if (!before) return res.status(404).json({ error: "Alert not found." });

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.alert.update({
      where: { id },
      data: {
        status: body.status,
        ...(body.assignedToId !== undefined ? { assignedToId: body.assignedToId } : {}),
      },
    });

    await tx.auditLog.create({
      data: {
        actorUserId,
        action: "ALERT_STATUS_UPDATED",
        entityType: "Alert",
        entityId: id, // ✅ always string
        before: before as any,
        after: next as any,
      },
    });

    return next;
  });

  res.json(updated);
});

/**
 * PATCH /api/alerts/:id
 */
alertsRouter.patch("/:id", async (req: AuthedRequest, res: Response) => {
  const id = String(req.params.id);
  const actorUserId = req.actorUserId;

  if (!actorUserId) {
    return res.status(401).json({
      error: "Missing actor. Provide x-user-id header or set DEFAULT_ACTOR_USER_ID in .env",
    });
  }

  const before = await prisma.alert.findUnique({ where: { id } });
  if (!before) return res.status(404).json({ error: "Alert not found." });

  const body = req.body as Partial<{
    title: string;
    description: string | null;
    tags: unknown; // JSON array
    assignedToId: string | null;
    eventCount: number;
    correlationId: string | null;
    ruleName: string | null;
    hostname: string | null;
    user: string | null;
    destinationIp: string | null;
    source: string | null;
  }>;

  const next = await prisma.alert.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.tags !== undefined ? { tags: body.tags as any } : {}),
      ...(body.assignedToId !== undefined ? { assignedToId: body.assignedToId } : {}),
      ...(body.eventCount !== undefined ? { eventCount: body.eventCount } : {}),
      ...(body.correlationId !== undefined ? { correlationId: body.correlationId } : {}),
      ...(body.ruleName !== undefined ? { ruleName: body.ruleName } : {}),
      ...(body.hostname !== undefined ? { hostname: body.hostname } : {}),
      ...(body.user !== undefined ? { user: body.user } : {}),
      ...(body.destinationIp !== undefined ? { destinationIp: body.destinationIp } : {}),
      ...(body.source !== undefined ? { source: body.source } : {}),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId,
      action: "ALERT_UPDATED",
      entityType: "Alert",
      entityId: id, // ✅ always string
      before: before as any,
      after: next as any,
    },
  });

  res.json(next);
});
