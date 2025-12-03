"use client"

import { useState } from "react"

interface Creative {
  id: string
  imageUrl: string
  caption: string
  style: string
}

interface CreativesGalleryProps {
  creatives: Creative[]
}

export default function CreativesGallery({ creatives }: CreativesGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="space-y-6">
      {/* Main Preview */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          <img
            src={creatives[selectedIndex]?.imageUrl || "/placeholder.svg"}
            alt="Creative preview"
            className="max-h-full max-w-full rounded"
          />
        </div>

        <div className="mt-4">
          <p className="text-white font-semibold mb-2">Caption</p>
          <p className="text-slate-300">{creatives[selectedIndex]?.caption}</p>
        </div>
      </div>

      {/* Thumbnails */}
      <div>
        <h3 className="text-white font-semibold mb-3">All Variations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {creatives.map((creative, index) => (
            <button
              key={creative.id}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                selectedIndex === index ? "border-cyan-500 scale-95" : "border-slate-600 hover:border-slate-500"
              }`}
            >
              <img
                src={creative.imageUrl || "/placeholder.svg"}
                alt={`Variation ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
