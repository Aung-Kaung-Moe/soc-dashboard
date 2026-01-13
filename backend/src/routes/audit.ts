import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

export const auditRouter = Router();

type AuthedRequest = Request & { actorUserId?: string };

auditRouter.get("/", async (req: Request, res: Response) => {
  const q = req.query as Record<string, string | undefined>;

  const take = Math.min(Math.max(parseInt(q.limit ?? "50", 10) || 50, 1), 200);
  const skip = Math.max(parseInt(q.offset ?? "0", 10) || 0, 0);

  const where: Prisma.AuditLogWhereInput = {};

  if (q.entityType) where.entityType = q.entityType;
  if (q.entityId) where.entityId = q.entityId;
  if (q.actorUserId) where.actorUserId = q.actorUserId;
  if (q.action) where.action = q.action;

  if (q.from || q.to) {
    where.timestamp = {};
    if (q.from) where.timestamp.gte = new Date(q.from);
    if (q.to) where.timestamp.lte = new Date(q.to);
  }

  const [total, items] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take,
      skip,
      include: { actor: { select: { id: true, name: true, email: true, role: true } } },
    }),
  ]);

  res.json({ total, items, limit: take, offset: skip });
});

auditRouter.get("/latest", async (req: Request, res: Response) => {
  const q = req.query as Record<string, string | undefined>;
  const take = Math.min(Math.max(parseInt(q.limit ?? "50", 10) || 50, 1), 200);

  const items = await prisma.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take,
    include: { actor: { select: { id: true, name: true, email: true, role: true } } },
  });

  res.json({ items, limit: take });
});

auditRouter.post("/", async (req: AuthedRequest, res: Response) => {
  const actorUserId = req.actorUserId;

  if (!actorUserId) {
    return res.status(401).json({
      error: "Missing actor. Provide x-user-id header or set DEFAULT_ACTOR_USER_ID in .env",
    });
  }

  const body = req.body as Partial<{
    action: string;
    entityType: string;
    entityId: string;
    before: unknown;
    after: unknown;
  }>;

  if (!body.action || !body.entityType || !body.entityId) {
    return res.status(400).json({ error: "action, entityType, entityId are required" });
  }

  // ✅ Prisma JSON typing fix:
  // - if undefined => store null
  // - otherwise cast to InputJsonValue
  const beforeJson =
    body.before === undefined ? Prisma.JsonNull : (body.before as Prisma.InputJsonValue);
  const afterJson =
    body.after === undefined ? Prisma.JsonNull : (body.after as Prisma.InputJsonValue);

  const created = await prisma.auditLog.create({
    data: {
      actorUserId,
      action: body.action,
      entityType: body.entityType,
      entityId: body.entityId,
      before: beforeJson,
      after: afterJson,
    },
  });

  res.status(201).json(created);
});
