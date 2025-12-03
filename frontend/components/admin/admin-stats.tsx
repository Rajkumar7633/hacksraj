"use client"

interface AdminStatsProps {
  stats: any
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: "👥",
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "Total Projects",
      value: stats?.totalProjects || 0,
      icon: "📁",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Creatives Generated",
      value: stats?.totalCreatives || 0,
      icon: "🎨",
      color: "from-orange-500 to-red-500",
    },
    {
      label: "API Calls Today",
      value: stats?.apiCallsToday || 0,
      icon: "⚡",
      color: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.color} p-6 rounded-lg text-white shadow-lg transform hover:scale-105 transition`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">{card.icon}</span>
            <span className="text-sm bg-black/20 px-3 py-1 rounded-full">Today</span>
          </div>
          <p className="text-slate-200 text-sm mb-1">{card.label}</p>
          <p className="text-4xl font-bold">{card.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
