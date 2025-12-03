import express from "express"
import { generateCreatives } from "../controllers/creativesController"

const router = express.Router()

// Auth bypass for local development
router.post("/", generateCreatives)

export default router
