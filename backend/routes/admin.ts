import express from "express"
import { authMiddleware } from "../middleware/auth"
import { adminOnly } from "../middleware/admin"
import { getSystemStats, getAllUsers, addUserCredits, getUsageLogs } from "../controllers/adminController"

const router = express.Router()

router.use(authMiddleware, adminOnly)

router.get("/stats", getSystemStats)
router.get("/users", getAllUsers)
router.post("/users/:userId/credits", addUserCredits)
router.get("/logs", getUsageLogs)

export default router
