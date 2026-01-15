import type { Request, Response, NextFunction } from "express";

/**
 * Adds req.actorUserId from:
 *  - x-user-id header (preferred for testing)
 *  - DEFAULT_ACTOR_USER_ID in .env (fallback)
 */
export function actorMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("x-user-id") || undefined;
  const fallback = process.env.DEFAULT_ACTOR_USER_ID || undefined;
  req.actorUserId = header ?? fallback;
  next();
}
