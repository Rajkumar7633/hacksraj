"use client"

import { useState } from "react"
import JSZip from "jszip"

interface Creative {
  id: string
  imageUrl: string
  caption: string
}

interface ExportOptionsProps {
  creatives: Creative[]
}

export default function ExportOptions({ creatives }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportAsZip = async () => {
    setIsExporting(true)
    try {
      const zip = new JSZip()

      await Promise.all(
        creatives.map(async (creative, index) => {
          const filename = `creative-${index + 1}.png`

          if (creative.imageUrl.startsWith("data:")) {
            const base64 = creative.imageUrl.split(",")[1]
            if (base64) {
              zip.file(filename, base64, { base64: true })
            }
          } else {
            const response = await fetch(creative.imageUrl)
            const blob = await response.blob()
            const arrayBuffer = await blob.arrayBuffer()
            zip.file(filename, arrayBuffer)
          }
        }),
      )

      const zipBlob = await zip.generateAsync({ type: "blob" })
      const url = window.URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = "creatives.zip"
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export creatives")
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsJson = () => {
    const data = {
      totalCreatives: creatives.length,
      creatives: creatives.map((c, i) => ({
        variation: i + 1,
        caption: c.caption,
        imageUrl: c.imageUrl,
      })),
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "creatives-metadata.json"
    a.click()
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-white font-semibold mb-4">Export Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={exportAsZip}
          disabled={isExporting}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
        >
          {isExporting ? "Exporting..." : "Download ZIP"}
        </button>

        <button
          onClick={exportAsJson}
          className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition"
        >
          Export Metadata
        </button>

        <button className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition">
          Share Gallery
        </button>
      </div>
    </div>
  )
}
