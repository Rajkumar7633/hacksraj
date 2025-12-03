import { query } from "../database/db"

export const logUsage = async (
  userId: string,
  action: string,
  creditsUsed: number,
  projectId?: string,
  ipAddress?: string,
) => {
  await query(
    "INSERT INTO usage_logs (user_id, project_id, action, credits_used, ip_address) VALUES ($1, $2, $3, $4, $5)",
    [userId, projectId || null, action, creditsUsed, ipAddress || null],
  )
}

export const deductCredits = async (userId: string, amount: number) => {
  const result = await query(
    "UPDATE users SET credits_remaining = credits_remaining - $1 WHERE id = $2 RETURNING credits_remaining",
    [amount, userId],
  )

  return result.rows[0].credits_remaining
}

export const getUserStats = async (userId: string) => {
  const result = await query(
    "SELECT COUNT(*) as total_projects, SUM(credits_used) as total_credits_used FROM projects p LEFT JOIN usage_logs u ON p.id = u.project_id WHERE p.user_id = $1",
    [userId],
  )

  return result.rows[0]
}
