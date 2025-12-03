import express from "express"
import { generateCreatives } from "../controllers/creativesController"
import { authMiddleware, checkCredits } from "../middleware/auth"

const router = express.Router()

router.post("/", authMiddleware, checkCredits(10), generateCreatives)

export default router
