import express, { Request, Response } from "express"
import { generateImages } from "../controllers/creativesController"

const router = express.Router()

// Generate creatives route
router.post("/", async (req: Request, res: Response) => {
    try {
        const { logoUrl, productImageUrl, style, quantity } = req.body

        if (!style || !quantity) {
            return res.status(400).json({ error: "Style and quantity are required" })
        }

        // Service currently returns: [{ url, prompt }]
        const images = await generateImages(logoUrl || null, productImageUrl || null, style, Number(quantity))

        // Normalize to the shape the frontend expects
        const creatives = images.map((img: { url: string; prompt: string }, index: number) => ({
            id: `creative-${index + 1}`,
            imageUrl: img.url,
            caption: `(${style}) Premium creative variation ${index + 1}`,
            style,
            prompt: img.prompt,
        }))

        console.log("[API] Generated creatives sample:", creatives[0])
        res.json({ creatives })
    } catch (error) {
        console.error("Error generating images:", error)
        res.status(500).json({ error: "Failed to generate images" })
    }
})

export default router
