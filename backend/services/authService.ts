import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "../database/db"

interface UserData {
  id: string
  email: string
  name?: string
  subscription_plan: string
  credits_remaining: number
  created_at: Date
}

export const createUser = async (email: string, password: string, name?: string): Promise<UserData> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await query(
      "INSERT INTO users (email, password, name, subscription_plan, credits_remaining) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, subscription_plan, credits_remaining, created_at",
      [email, hashedPassword, name || email, "free", 100],
    )

    return result.rows[0]
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Email already exists")
    }
    throw error
  }
}

export const getUserByEmail = async (email: string): Promise<UserData | null> => {
  const result = await query("SELECT * FROM users WHERE email = $1", [email])
  return result.rows[0] || null
}

export const getUserById = async (id: string): Promise<UserData | null> => {
  const result = await query(
    "SELECT id, email, name, subscription_plan, credits_remaining, created_at FROM users WHERE id = $1",
    [id],
  )
  return result.rows[0] || null
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  })
}

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secret") as { userId: string }
  } catch {
    return null
  }
}
