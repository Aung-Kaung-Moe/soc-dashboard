import type { Request, Response, NextFunction } from "express";

export function actorMiddleware(req: Request & { actorUserId?: string }, _res: Response, next: NextFunction) {
  const headerActor = req.header("x-user-id") || undefined;
  const envActor = process.env.DEFAULT_ACTOR_USER_ID || undefined;
  req.actorUserId = headerActor ?? envActor;
  next();
}
