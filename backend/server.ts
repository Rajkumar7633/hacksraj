import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import path from "path"
import fs from "fs"

dotenv.config()

const app = express()
const PORT = process.env.BACKEND_PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("uploads"))

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads")
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/png", "image/jpeg", "image/webp"]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only PNG, JPEG, and WebP allowed."))
    }
  },
})

// Routes
import generateRouter from "./routes/generate"
import downloadRouter from "./routes/download"
import projectsRouter from "./routes/projects"
import authRouter from "./routes/auth"

app.use("/api/auth", authRouter)
app.use("/api/generate", generateRouter)
app.use("/api/download", downloadRouter)
app.use("/api/projects", projectsRouter)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend server running", timestamp: new Date() })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Backend Error]", err)
  res.status(500).json({
    error: err.message || "Internal server error",
    timestamp: new Date(),
  })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})

export default app
