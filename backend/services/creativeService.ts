import { query } from "../database/db"

export const saveCreative = async (
  projectId: string,
  variationNumber: number,
  imageUrl: string,
  caption: string,
  aiPrompt: string,
  style: string,
) => {
  const result = await query(
    "INSERT INTO creatives (project_id, variation_number, image_url, caption, ai_prompt, style) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [projectId, variationNumber, imageUrl, caption, aiPrompt, style],
  )

  return result.rows[0]
}

export const getCreativesByProject = async (projectId: string) => {
  const result = await query("SELECT * FROM creatives WHERE project_id = $1 ORDER BY variation_number ASC", [projectId])

  return result.rows
}
