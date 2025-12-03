"use client"

interface StyleSelectorProps {
  selectedStyle: string
  onStyleChange: (style: string) => void
  quantity: number
  onQuantityChange: (quantity: number) => void
}

const styles = [
  { id: "minimal", name: "Minimal", icon: "📐" },
  { id: "bold", name: "Bold", icon: "⚡" },
  { id: "playful", name: "Playful", icon: "🎨" },
  { id: "professional", name: "Professional", icon: "💼" },
  { id: "modern", name: "Modern", icon: "✨" },
]

export default function StyleSelector({
  selectedStyle,
  onStyleChange,
  quantity,
  onQuantityChange,
}: StyleSelectorProps) {
  return (
    <div className="space-y-6 bg-slate-800 p-8 rounded-lg border border-slate-700">
      <div>
        <h3 className="text-white font-semibold mb-4">Select Creative Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              className={`p-4 rounded-lg border-2 transition text-center ${
                selectedStyle === style.id ? "border-cyan-500 bg-slate-700" : "border-slate-600 hover:border-slate-500"
              }`}
            >
              <div className="text-2xl mb-2">{style.icon}</div>
              <p className="text-white text-sm font-medium">{style.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-white font-semibold block mb-3">Number of Variations: {quantity}</label>
        <input
          type="range"
          min="5"
          max="25"
          value={quantity}
          onChange={(e) => onQuantityChange(Number.parseInt(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-slate-400 text-sm mt-2">
          <span>5 variations</span>
          <span>25 variations</span>
        </div>
      </div>
    </div>
  )
}
