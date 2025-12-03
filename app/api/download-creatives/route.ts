import { type NextRequest, NextResponse } from "next/server"
import { createWriteStream } from "fs"
import { join } from "path"
import { tmpdir } from "os"
import archiver from "archiver"

export async function POST(request: NextRequest) {
  try {
    const { creatives } = await request.json()

    if (!Array.isArray(creatives) || creatives.length === 0) {
      return NextResponse.json({ error: "No creatives to download" }, { status: 400 })
    }

    // Create a temporary directory for the zip file
    const tempDir = tmpdir()
    const zipPath = join(tempDir, `creatives-${Date.now()}.zip`)

    // Create archive
    const output = createWriteStream(zipPath)
    const archive = archiver("zip", { zlib: { level: 9 } })

    archive.pipe(output)

    // Add creatives metadata
    const metadata = {
      generated: new Date().toISOString(),
      totalVariations: creatives.length,
      creatives: creatives.map((c, i) => ({
        id: i + 1,
        caption: c.caption,
        prompt: c.prompt,
      })),
    }

    archive.append(JSON.stringify(metadata, null, 2), { name: "metadata.json" })

    // Add creative data
    creatives.forEach((creative, i) => {
      archive.append(creative.caption, { name: `creative-${i + 1}-caption.txt` })
    })

    await archive.finalize()

    // Read the zip file and return it
    const fs = await import("fs/promises")
    const buffer = await fs.readFile(zipPath)

    // Clean up temp file
    await fs.unlink(zipPath)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="creatives.zip"',
      },
    })
  } catch (error) {
    console.error("Error creating download:", error)
    return NextResponse.json({ error: "Failed to create download" }, { status: 500 })
  }
}
