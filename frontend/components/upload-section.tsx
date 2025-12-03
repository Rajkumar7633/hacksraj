"use client"

import type React from "react"

import { useRef, useState } from "react"

interface UploadSectionProps {
  onUpload: (logo: File, product: File) => void
}

export default function UploadSection({ onUpload }: UploadSectionProps) {
  const logoRef = useRef<HTMLInputElement>(null)
  const productRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [productPreview, setProductPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [productFile, setProductFile] = useState<File | null>(null)

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void,
    setFile: (file: File) => void,
    type: "logo" | "product",
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setPreview(result)
        setFile(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    setPreview: (url: string) => void,
    setFile: (file: File) => void,
    ref: React.RefObject<HTMLInputElement>,
  ) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setPreview(result)
        setFile(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const isReady = logoFile && productFile

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Logo Upload */}
      <div
        onDrop={(e) => handleDrop(e, setLogoPreview, setLogoFile, logoRef)}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => logoRef.current?.click()}
        className="p-8 border-2 border-dashed border-cyan-500 rounded-lg hover:bg-slate-700 transition cursor-pointer bg-slate-800 flex flex-col items-center justify-center min-h-72"
      >
        <input
          ref={logoRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e, setLogoPreview, setLogoFile, "logo")}
          className="hidden"
        />
        {logoPreview ? (
          <img src={logoPreview || "/placeholder.svg"} alt="Logo" className="max-h-64 max-w-full rounded" />
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">🏷️</div>
            <p className="text-white font-semibold">Upload Brand Logo</p>
            <p className="text-slate-400 text-sm mt-1">Drag & drop or click to select</p>
          </div>
        )}
      </div>

      {/* Product Image Upload */}
      <div
        onDrop={(e) => handleDrop(e, setProductPreview, setProductFile, productRef)}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => productRef.current?.click()}
        className="p-8 border-2 border-dashed border-blue-500 rounded-lg hover:bg-slate-700 transition cursor-pointer bg-slate-800 flex flex-col items-center justify-center min-h-72"
      >
        <input
          ref={productRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e, setProductPreview, setProductFile, "product")}
          className="hidden"
        />
        {productPreview ? (
          <img src={productPreview || "/placeholder.svg"} alt="Product" className="max-h-64 max-w-full rounded" />
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-white font-semibold">Upload Product Image</p>
            <p className="text-slate-400 text-sm mt-1">Drag & drop or click to select</p>
          </div>
        )}
      </div>
    </div>
  )
}
