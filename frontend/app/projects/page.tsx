"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Link from "next/link"

interface Project {
  id: string
  name: string
  style: string
  createdAt: string
  creativesCount: number
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Your Projects</h1>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center">
            <p className="text-slate-400 mb-4">No projects yet</p>
            <Link href="/" className="text-cyan-500 hover:text-cyan-400">
              Create your first creative
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 transition"
              >
                <h3 className="text-white font-semibold text-lg mb-2">{project.name}</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Style: <span className="text-cyan-400">{project.style}</span>
                </p>
                <p className="text-slate-400 text-sm mb-4">{project.creativesCount} variations</p>
                <p className="text-slate-500 text-sm">{new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
