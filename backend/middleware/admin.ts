import type { Response, NextFunction } from "express"
import type { AuthRequest } from "./auth"

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  const adminEmails = (process.env.ADMIN_EMAILS || "admin@example.com").split(",")

  if (!req.user || !adminEmails.includes(req.user.email)) {
    return res.status(403).json({ error: "Admin access required" })
  }

  next()
}
