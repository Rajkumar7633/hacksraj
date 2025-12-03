"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import UploadSection from "@/components/upload-section"
import CreativesGallery from "@/components/creatives-gallery"

export default function Home() {
  const [generatedCreatives, setGeneratedCreatives] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async (logo: File, productImage: File) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("logo", logo)
      formData.append("productImage", productImage)

      const response = await fetch("/api/generate-creatives", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Generation failed")

      const data = await response.json()
      setGeneratedCreatives(data.creatives)
    } catch (error) {
      console.error("Error generating creatives:", error)
      alert("Failed to generate creatives. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/download-creatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatives: generatedCreatives }),
      })

      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "creatives.zip"
      a.click()
    } catch (error) {
      console.error("Error downloading creatives:", error)
      alert("Failed to download creatives.")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">✨</span>
            </div>
            <h1 className="text-5xl font-bold text-white">AI Creative Studio</h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Transform your brand assets into 10+ unique marketing variations in seconds. Powered by advanced generative
            AI.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="bg-slate-800/50 border-slate-700 p-8 backdrop-blur">
            <UploadSection onGenerate={handleGenerate} isLoading={isLoading} />
          </Card>

          {/* Results Section */}
          <Card className="bg-slate-800/50 border-slate-700 p-8 backdrop-blur">
            {generatedCreatives.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Generated Creatives</h2>
                    <p className="text-slate-400">{generatedCreatives.length} variations created</p>
                  </div>
                </div>
                <CreativesGallery creatives={generatedCreatives} />
                <Button
                  onClick={handleDownload}
                  className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-6 rounded-lg transition-all"
                >
                  Download All as ZIP
                </Button>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <p className="text-slate-400 text-lg">
                  {isLoading
                    ? "Generating your creative variations..."
                    : "Upload your assets to see generated creatives here"}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: "🎨", title: "10+ Variations", desc: "Get multiple unique creative options" },
            { icon: "⚡", title: "AI-Generated Captions", desc: "Compelling ad copy for each variation" },
            { icon: "📥", title: "One-Click Download", desc: "Export all as ZIP with high resolution" },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 text-center hover:border-cyan-500/50 transition-colors"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
