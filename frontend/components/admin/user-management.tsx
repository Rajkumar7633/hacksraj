"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  subscription_plan: string
  credits_remaining: number
  created_at: string
  totalProjects: number
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addCredits = async (userId: string, amount: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/credits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount }),
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Error adding credits:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-white font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-white font-semibold">Plan</th>
              <th className="px-6 py-3 text-left text-white font-semibold">Credits</th>
              <th className="px-6 py-3 text-left text-white font-semibold">Projects</th>
              <th className="px-6 py-3 text-left text-white font-semibold">Joined</th>
              <th className="px-6 py-3 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-700/50 transition">
                <td className="px-6 py-4 text-slate-300">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.subscription_plan === "premium"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-slate-600 text-slate-300"
                    }`}
                  >
                    {user.subscription_plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300">{user.credits_remaining}</td>
                <td className="px-6 py-4 text-slate-300">{user.totalProjects}</td>
                <td className="px-6 py-4 text-slate-300 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => addCredits(user.id, 50)}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded hover:bg-cyan-500/30 transition"
                  >
                    +50 Credits
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
