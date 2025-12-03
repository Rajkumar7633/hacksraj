"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import UploadSection from "@/components/upload-section"
import StyleSelector from "@/components/style-selector"
import CreativesGallery from "@/components/creatives-gallery"
import ExportOptions from "@/components/export-options"

export default function Home() {
  // Bypass auth by default for local usage. Set NEXT_PUBLIC_BYPASS_AUTH="false" to re-enable auth checks.
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH !== "false"
  const apiBase = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? window.location.origin : "")
  const [step, setStep] = useState<"upload" | "generate" | "results">("upload")
  const [formData, setFormData] = useState({
    logo: null as File | null,
    product: null as File | null,
    style: "modern",
    quantity: 10,
  })
  const [creatives, setCreatives] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleGenerate = async () => {
    if (!formData.logo || !formData.product) return

    setIsGenerating(true)
    setProgress(0)
    setStep("generate")

    try {
      const formDataObj = new FormData()
      formDataObj.append("logo", formData.logo)
      formDataObj.append("productImage", formData.product)
      formDataObj.append("style", formData.style)
      formDataObj.append("quantity", formData.quantity.toString())

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 300)

      const headers: Record<string, string> = {}
      if (!bypassAuth) {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        if (token) headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`/api/generate-creatives`, {
        method: "POST",
        body: formDataObj,
        headers,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (response.ok) {
        const data = await response.json()
        setCreatives(data.creatives)
        setStep("results")
      }
    } catch (error) {
      console.error("Generation error:", error)
      alert("Failed to generate creatives")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        {step === "upload" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4">AI Creative Studio</h1>
              <p className="text-xl text-slate-300">Generate 10+ unique marketing variations in seconds</p>
            </div>

            <UploadSection
              onUpload={(logo, product) => {
                setFormData({ ...formData, logo, product })
              }}
            />

            {formData.logo && formData.product && (
              <div className="space-y-6">
                <StyleSelector
                  selectedStyle={formData.style}
                  onStyleChange={(style) => setFormData({ ...formData, style })}
                  quantity={formData.quantity}
                  onQuantityChange={(quantity) => setFormData({ ...formData, quantity })}
                />

                <div className="flex justify-center">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? "Generating..." : "Generate Creatives"}
                  </button>
                </div>

                {/* Floating Continue button (always visible) */}
                <div className="fixed bottom-6 right-6 z-40">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="shadow-lg px-5 py-3 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold disabled:opacity-60"
                    aria-label="Continue and generate"
                  >
                    {isGenerating ? "Generating..." : "Continue →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === "generate" && (
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-cyan-500">{progress}%</span>
              </div>
            </div>
            <p className="text-xl text-white">Generating your creative variations...</p>
            <p className="text-slate-400">This usually takes 30-60 seconds</p>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-2">Your Creatives</h2>
              <p className="text-slate-300">{creatives.length} variations generated</p>
            </div>

            <CreativesGallery creatives={creatives} />

            <ExportOptions creatives={creatives} />

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setStep("upload")
                  setCreatives([])
                  setFormData({ logo: null, product: null, style: "modern", quantity: 10 })
                }}
                className="px-6 py-2 border border-slate-500 text-white rounded-lg hover:bg-slate-700 transition"
              >
                Generate New
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
