import type { Response } from "express"
import { generateMultipleCreatives } from "../services/advancedGenerationService"
import { createProject, updateProjectStatus } from "../services/projectService"
import { saveCreative } from "../services/creativeService"
import { deductCredits, logUsage } from "../services/usageService"
import type { AuthRequest } from "../middleware/auth"
import archiver from "archiver"
import fs from "fs"
import path from "path"

export const generateCreatives = async (req: AuthRequest, res: Response) => {
  try {
    const { logoUrl, productImageUrl, style, quantity } = req.body
    const userId = req.userId!

    if (!logoUrl || !productImageUrl) {
      return res.status(400).json({ error: "Logo and product image URLs required" })
    }

    console.log("[Controller] Starting creative generation for user:", userId)

    // Create project record
    const project = await createProject(userId, `Project - ${style}`, style, {
      logoUrl,
      productImageUrl,
      quantity,
    })

    // Update status to processing
    await updateProjectStatus(project.id, "processing", 0)

    // Generate creatives
    const creatives = await generateMultipleCreatives(logoUrl, productImageUrl, {
      style,
      quantity,
      variations: true,
    })

    // Save creatives to database
    for (const creative of creatives) {
      await saveCreative(project.id, creative.variation, creative.imageUrl, creative.caption, creative.prompt, style)
    }

    // Update project status
    await updateProjectStatus(project.id, "completed", creatives.length)

    // Deduct credits (10 credits per project)
    const creditsDeducted = 10
    await deductCredits(userId, creditsDeducted)
    await logUsage(userId, "creative_generation", creditsDeducted, project.id, req.ip)

    res.json({
      success: true,
      projectId: project.id,
      creatives,
      totalGenerated: creatives.length,
      creditsUsed: creditsDeducted,
      generatedAt: new Date(),
    })
  } catch (error: any) {
    console.error("[Controller Error] Generate creatives:", error)
    res.status(500).json({ error: error.message })
  }
}

export const downloadCreatives = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params

    // Create ZIP archive
    const archive = archiver("zip", { zlib: { level: 9 } })
    const fileName = `creatives_${projectId}.zip`
    const filePath = path.join(__dirname, "../../uploads", fileName)

    const output = fs.createWriteStream(filePath)
    archive.pipe(output)

    // Add metadata and images
    archive.append(JSON.stringify({ projectId, createdAt: new Date() }, null, 2), {
      name: "metadata.json",
    })

    archive.finalize()

    output.on("close", () => {
      res.download(filePath, fileName, (err) => {
        if (err) console.error("[Controller Error] Download:", err)
        fs.unlink(filePath, (err) => {
          if (err) console.error("[Controller Error] Cleanup:", err)
        })
      })
    })
  } catch (error: any) {
    console.error("[Controller Error] Download creatives:", error)
    res.status(500).json({ error: error.message })
  }
}
