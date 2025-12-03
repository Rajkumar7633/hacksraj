import express from "express"
import { downloadCreatives } from "../controllers/creativesController"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

router.get("/:projectId", authMiddleware, downloadCreatives)

export default router
