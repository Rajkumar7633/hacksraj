import type { Response } from "express"
import { query } from "../database/db"
import type { AuthRequest } from "../middleware/auth"

export const getSystemStats = async (req: AuthRequest, res: Response) => {
  try {
    const usersResult = await query("SELECT COUNT(*) as total FROM users")
    const projectsResult = await query("SELECT COUNT(*) as total FROM projects")
    const creativesResult = await query("SELECT COUNT(*) as total FROM creatives")
    const logsResult = await query(
      "SELECT COUNT(*) as total FROM usage_logs WHERE created_at > NOW() - INTERVAL '1 day'",
    )

    res.json({
      totalUsers: usersResult.rows[0]?.total || 0,
      totalProjects: projectsResult.rows[0]?.total || 0,
      totalCreatives: creativesResult.rows[0]?.total || 0,
      apiCallsToday: logsResult.rows[0]?.total || 0,
      avgResponseTime: Math.random() * 400 + 100, // Placeholder
      queueLength: Math.floor(Math.random() * 8),
      activeConnections: Math.floor(Math.random() * 30),
      cacheHitRate: Math.floor(Math.random() * 20) + 80,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT u.id, u.email, u.subscription_plan, u.credits_remaining, u.created_at, 
              COUNT(p.id) as total_projects
       FROM users u
       LEFT JOIN projects p ON u.id = p.user_id
       GROUP BY u.id
       ORDER BY u.created_at DESC
       LIMIT 100`,
    )

    res.json({
      users: result.rows.map((row) => ({
        ...row,
        totalProjects: Number.parseInt(row.total_projects),
      })),
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const addUserCredits = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params
    const { amount } = req.body

    await query("UPDATE users SET credits_remaining = credits_remaining + $1 WHERE id = $2", [amount, userId])

    res.json({ success: true, message: `Added ${amount} credits to user` })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getUsageLogs = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT * FROM usage_logs 
       ORDER BY created_at DESC 
       LIMIT 50`,
    )

    res.json({
      logs: result.rows.map((log) => ({
        id: log.id,
        userId: log.user_id,
        action: log.action,
        creditsUsed: log.credits_used,
        createdAt: log.created_at,
        status: log.action.includes("error") ? "failed" : "success",
      })),
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
