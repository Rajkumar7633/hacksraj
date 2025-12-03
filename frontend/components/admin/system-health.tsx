"use client"

interface SystemHealthProps {
  stats: any
}

export default function SystemHealth({ stats }: SystemHealthProps) {
  const metrics = [
    {
      name: "API Response Time",
      value: `${stats?.avgResponseTime || 0}ms`,
      status: (stats?.avgResponseTime || 0) < 500 ? "healthy" : "warning",
      target: "< 500ms",
    },
    {
      name: "Image Generation Queue",
      value: stats?.queueLength || 0,
      status: (stats?.queueLength || 0) < 10 ? "healthy" : "warning",
      target: "< 10 jobs",
    },
    {
      name: "Database Connections",
      value: stats?.activeConnections || 0,
      status: (stats?.activeConnections || 0) < 50 ? "healthy" : "warning",
      target: "< 50 active",
    },
    {
      name: "Cache Hit Rate",
      value: `${stats?.cacheHitRate || 0}%`,
      status: (stats?.cacheHitRate || 0) > 80 ? "healthy" : "warning",
      target: "> 80%",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-white font-semibold">{metric.name}</h3>
            <div
              className={`w-3 h-3 rounded-full ${
                metric.status === "healthy" ? "bg-green-500 animate-pulse" : "bg-yellow-500 animate-pulse"
              }`}
            ></div>
          </div>

          <p className="text-3xl font-bold text-cyan-500 mb-2">{metric.value}</p>
          <p className="text-slate-400 text-sm">Target: {metric.target}</p>
        </div>
      ))}
    </div>
  )
}
