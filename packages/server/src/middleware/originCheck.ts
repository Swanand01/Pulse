import type { Request, Response, NextFunction } from "express";

const allowedOrigin = process.env.WEB_APP_URL ?? "http://localhost:5173";

export function originCheck(req: Request, res: Response, next: NextFunction) {
  if (req.headers.origin !== allowedOrigin) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}
