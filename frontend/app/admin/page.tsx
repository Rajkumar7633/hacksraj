"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import AdminStats from "@/components/admin/admin-stats"
import UserManagement from "@/components/admin/user-management"
import GenerationLogs from "@/components/admin/generation-logs"
import SystemHealth from "@/components/admin/system-health"

type Tab = "overview" | "users" | "logs" | "health"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">System monitoring and user management</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-semibold transition border-b-2 ${
              activeTab === "overview"
                ? "text-cyan-500 border-cyan-500"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-semibold transition border-b-2 ${
              activeTab === "users"
                ? "text-cyan-500 border-cyan-500"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 font-semibold transition border-b-2 ${
              activeTab === "logs"
                ? "text-cyan-500 border-cyan-500"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            Logs
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`px-4 py-2 font-semibold transition border-b-2 ${
              activeTab === "health"
                ? "text-cyan-500 border-cyan-500"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            System Health
          </button>
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div>
            {activeTab === "overview" && <AdminStats stats={stats} />}
            {activeTab === "users" && <UserManagement />}
            {activeTab === "logs" && <GenerationLogs />}
            {activeTab === "health" && <SystemHealth stats={stats} />}
          </div>
        )}
      </main>
    </div>
  )
}
