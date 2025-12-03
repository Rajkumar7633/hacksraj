import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

interface User {
  id: string
  email: string
  password: string
  createdAt: Date
}

// In-memory user storage (replace with database in production)
const users: User[] = []

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    // Check if user exists
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    }

    users.push(newUser)

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    })

    res.json({ success: true, token, userId: newUser.id })
  } catch (error: any) {
    console.error("[Backend Error] Signup:", error)
    res.status(500).json({ error: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const user = users.find((u) => u.email === email)
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    })

    res.json({ success: true, token, userId: user.id })
  } catch (error: any) {
    console.error("[Backend Error] Login:", error)
    res.status(500).json({ error: error.message })
  }
}

export const logout = (req: Request, res: Response) => {
  res.json({ success: true, message: "Logged out" })
}

export const getProfile = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
