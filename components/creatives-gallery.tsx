"use client"

import { useState } from "react"

interface CreativesGalleryProps {
  creatives: any[]
}

export default function CreativesGallery({ creatives }: CreativesGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = creatives[selectedIndex]

  return (
    <div className="space-y-6">
      {/* Main Preview */}
      <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
        {selected?.image && (
          <div className="relative w-full bg-slate-800 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: "16/9" }}>
            <img
              src={selected.image || "/placeholder.svg"}
              alt={`Creative ${selectedIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h3 className="text-xl font-bold text-white mb-2">Variation {selectedIndex + 1}</h3>
        <p className="text-slate-300 mb-4">{selected?.caption}</p>
        <div className="flex gap-2">
          <code className="bg-slate-800 text-cyan-400 px-3 py-1 rounded text-sm flex-1 truncate">
            {selected?.prompt}
          </code>
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div>
        <p className="text-sm text-slate-400 mb-3 font-semibold">Gallery</p>
        <div className="grid grid-cols-5 gap-3">
          {creatives.map((creative, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                i === selectedIndex
                  ? "border-cyan-500 shadow-lg shadow-cyan-500/50"
                  : "border-slate-600 hover:border-slate-500"
              }`}
              style={{ aspectRatio: "1" }}
            >
              {creative.image && (
                <img
                  src={creative.image || "/placeholder.svg"}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              <span className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Download Individual */}
      <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-colors">
        Download This Variation
      </button>
    </div>
  )
}
