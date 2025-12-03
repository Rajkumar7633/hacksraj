"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"

interface UploadSectionProps {
  onGenerate: (logo: File, productImage: File) => void
  isLoading: boolean
}

export default function UploadSection({ onGenerate, isLoading }: UploadSectionProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [productFile, setProductFile] = useState<File | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const productInputRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogoFile(e.target.files[0])
    }
  }

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProductFile(e.target.files[0])
    }
  }

  const handleGenerate = () => {
    if (logoFile && productFile) {
      onGenerate(logoFile, productFile)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Upload Your Assets</h2>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-3">Brand Logo</label>
        <button
          onClick={() => logoInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer group"
        >
          <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
          {logoFile ? (
            <div className="text-cyan-400">
              <p className="font-semibold">{logoFile.name}</p>
              <p className="text-sm text-slate-400">Click to change</p>
            </div>
          ) : (
            <div className="text-slate-400 group-hover:text-cyan-400 transition-colors">
              <p className="text-3xl mb-2">🖼️</p>
              <p className="font-semibold">Drop your logo here</p>
              <p className="text-sm mt-1">PNG, JPG, or WebP</p>
            </div>
          )}
        </button>
      </div>

      {/* Product Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-3">Product Image</label>
        <button
          onClick={() => productInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer group"
        >
          <input ref={productInputRef} type="file" accept="image/*" onChange={handleProductChange} className="hidden" />
          {productFile ? (
            <div className="text-blue-400">
              <p className="font-semibold">{productFile.name}</p>
              <p className="text-sm text-slate-400">Click to change</p>
            </div>
          ) : (
            <div className="text-slate-400 group-hover:text-blue-400 transition-colors">
              <p className="text-3xl mb-2">📦</p>
              <p className="font-semibold">Drop your product image here</p>
              <p className="text-sm mt-1">PNG, JPG, or WebP</p>
            </div>
          )}
        </button>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!logoFile || !productFile || isLoading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-6 rounded-lg transition-all text-lg"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block animate-spin">⚙️</span>
            Generating...
          </span>
        ) : (
          "Generate 10+ Variations"
        )}
      </Button>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-300">
          💡 <span className="font-semibold">Tip:</span> Upload both a logo and product image for best results.
          Processing typically takes 30-60 seconds.
        </p>
      </div>
    </div>
  )
}
