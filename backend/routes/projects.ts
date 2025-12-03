import express from "express"
import { getProjects, getProject, deleteProject } from "../controllers/projectsController"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

router.get("/", authMiddleware, getProjects)
router.get("/:projectId", authMiddleware, getProject)
router.delete("/:projectId", authMiddleware, deleteProject)

export default router
