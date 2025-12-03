import { NextResponse, type NextRequest } from "next/server"

// Create a simple SVG data URL with the variation index
function svgDataUrl(index: number) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#06b6d4'/>
        <stop offset='100%' stop-color='#3b82f6'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='72' fill='white'>Variation ${index}</text>
  </svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export async function POST(req: NextRequest) {
    try {
        // Ensure multipart/form-data exists (logo + productImage)
        const form = await req.formData()
        const logo = form.get("logo") as File | null
        const productImage = form.get("productImage") as File | null
        const style = (form.get("style") as string | null) || "modern"
        const qtyRaw = (form.get("quantity") as string | null) || "12"
        const quantity = Math.min(30, Math.max(1, parseInt(qtyRaw, 10) || 12))

        if (!logo || !productImage) {
            return NextResponse.json({ error: "Missing required files" }, { status: 400 })
        }

        // Simulate the same response format as the backend
        const creatives = Array.from({ length: quantity }, (_, i) => ({
            id: `creative-${i + 1}`,
            imageUrl: svgDataUrl(i + 1),
            caption: `(${style}) Compelling product description for variation ${i + 1}.`,
            style: style,
            prompt: `Style: ${style}. Professional ad creative with product-focused design - variation ${i + 1}`,
        }))
        return NextResponse.json({ creatives }, { status: 200 })
    } catch (e) {
        console.error("[frontend api] generate-creatives error:", e)
        return NextResponse.json({ error: "Failed to generate creatives" }, { status: 500 })
    }
}
