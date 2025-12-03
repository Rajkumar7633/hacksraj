import type { Request, Response } from "express"

// Mock data - replace with database in production
const projects: any[] = []

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const userProjects = projects.filter((p) => p.userId === userId)
    res.json({ projects: userProjects })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const project = projects.find((p) => p.id === projectId)

    if (!project) {
      return res.status(404).json({ error: "Project not found" })
    }

    res.json({ project })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const index = projects.findIndex((p) => p.id === projectId)

    if (index === -1) {
      return res.status(404).json({ error: "Project not found" })
    }

    projects.splice(index, 1)
    res.json({ success: true, message: "Project deleted" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
