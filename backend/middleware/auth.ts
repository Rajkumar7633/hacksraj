import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../services/authService"
import { getUserById } from "../services/authService"

export interface AuthRequest extends Request {
  userId?: string
  user?: any
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" })
    }

    const user = await getUserById(decoded.userId)
    if (!user) {
      return res.status(401).json({ error: "User not found" })
    }

    req.userId = decoded.userId
    req.user = user
    next()
  } catch (error: any) {
    console.error("[Auth Middleware Error]", error)
    res.status(500).json({ error: "Authentication failed" })
  }
}

export const checkCredits = (requiredCredits = 10) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.credits_remaining < requiredCredits) {
      return res.status(402).json({
        error: "Insufficient credits",
        creditsNeeded: requiredCredits,
        creditsRemaining: req.user?.credits_remaining || 0,
      })
    }
    next()
  }
}
