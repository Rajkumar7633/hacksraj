"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"></div>
          <span className="font-bold text-white">AI Creative Studio</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/projects" className="text-slate-300 hover:text-white transition">
            Projects
          </Link>
          <Link href="/profile" className="text-slate-300 hover:text-white transition">
            Profile
          </Link>
          {user && (
            <>
              <span className="text-slate-400">{user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
