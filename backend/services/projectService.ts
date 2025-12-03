import { query } from "../database/db"

export const createProject = async (userId: string, name: string, style: string, metadata: any = {}) => {
  const result = await query(
    "INSERT INTO projects (user_id, name, style, metadata) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, name, style, JSON.stringify(metadata)],
  )

  return result.rows[0]
}

export const getProjectsByUser = async (userId: string) => {
  const result = await query("SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC", [userId])

  return result.rows
}

export const getProjectById = async (projectId: string) => {
  const result = await query("SELECT * FROM projects WHERE id = $1", [projectId])
  return result.rows[0] || null
}

export const updateProjectStatus = async (projectId: string, status: string, totalCreatives: number) => {
  const result = await query(
    "UPDATE projects SET status = $1, total_creatives = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
    [status, totalCreatives, projectId],
  )

  return result.rows[0]
}

export const deleteProject = async (projectId: string) => {
  await query("DELETE FROM projects WHERE id = $1", [projectId])
}
