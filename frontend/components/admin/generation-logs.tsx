"use client"

import { useState, useEffect } from "react"

interface Log {
  id: string
  userId: string
  action: string
  creditsUsed: number
  createdAt: string
  status: "success" | "failed" | "pending"
}

export default function GenerationLogs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/logs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs)
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">Generation Logs (Real-time)</h3>
          <button
            onClick={fetchLogs}
            className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded hover:bg-slate-600 transition"
          >
            Refresh
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="px-6 py-4 border-t border-slate-700 flex justify-between items-center hover:bg-slate-700/30 transition"
            >
              <div>
                <p className="text-white font-semibold text-sm">{log.action}</p>
                <p className="text-slate-400 text-xs">{log.userId}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    log.status === "success"
                      ? "bg-green-500/20 text-green-400"
                      : log.status === "failed"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {log.status}
                </span>
                <span className="text-slate-400 text-sm">{log.creditsUsed} credits</span>
                <span className="text-slate-500 text-xs">{new Date(log.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
