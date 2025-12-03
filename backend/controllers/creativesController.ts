import fetch from "node-fetch";


/* ---------------------------------------------------------
   1) Generate all images
----------------------------------------------------------*/
export const generateImages = async (
  logoUrl: string | null,
  productImageUrl: string | null,
  style: string,
  quantity: number,
) => {
  try {
    console.log("[Service] Generating images with style:", style);

    const prompts = generatePrompts(
      logoUrl || "",
      productImageUrl || "",
      style,
      quantity
    );

    const images = await Promise.all(
      prompts.map(async (prompt, idx) => {
        try {
          const imageUrl = await callImageGenerationAPI(prompt);
          return { url: imageUrl, prompt };
        } catch (e: any) {
          console.error(
            "[Service] Image API failed. Using fallback for creative #",
            idx + 1,
            e?.message || e
          );

          // SVG fallback
          const svg = `
            <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
              <defs>
                <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                  <stop offset='0%' stop-color='#ef4444'/>
                  <stop offset='100%' stop-color='#f59e0b'/>
                </linearGradient>
              </defs>
              <rect width='100%' height='100%' fill='url(#g)'/>
              <text x='50%' y='50%' dominant-baseline='middle' 
                    text-anchor='middle' font-family='sans-serif' 
                    font-size='56' fill='white'>
                Fallback creative ${idx + 1}
              </text>
            </svg>
          `;
          return { url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, prompt };
        }
      })
    );

    return images;
  } catch (error) {
    console.error("[Service Error] Image generation:", error);
    throw error;
  }
};

/* ---------------------------------------------------------
   2) Prompt Generator
----------------------------------------------------------*/
const generatePrompts = (
  logoUrl: string,
  productImageUrl: string,
  style: string,
  quantity: number
) => {
  const styleDescriptions: Record<string, string> = {
    minimal: "clean, minimalist layout with whitespace",
    bold: "bold vibrant color palette and striking shapes",
    playful: "fun, playful, colorful style",
    professional: "corporate business professional tone",
    modern: "sleek modern aesthetic with soft gradients",
  };

  const description = styleDescriptions[style] ?? styleDescriptions.modern;

  const prompts: string[] = [];

  for (let i = 0; i < quantity; i++) {
    prompts.push(
      `High quality marketing creative ${i + 1} in ${description}. 
       Include theme composition suitable for ads. 
       Do NOT include text or logos — only visual background.`
    );
  }

  return prompts;
};

/* ---------------------------------------------------------
   3) Stability AI Image Generation (LATEST API)
----------------------------------------------------------*/
/* ---------------------------------------------------------
   4) Download Creatives
----------------------------------------------------------*/
export const downloadCreatives = async (req: any, res: any) => {
  try {
    const { projectId } = req.params;

    // TODO: Replace this with actual database lookup for the project's creatives
    // For now, we'll return a 404 since we don't have database integration yet
    return res.status(404).json({
      error: 'Project not found or no creatives available',
      message: 'Download functionality requires database integration'
    });

    // Example of what the implementation might look like with a database:
    /*
    const project = await Project.findById(projectId).populate('creatives');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create a zip file with all creatives
    const zip = new JSZip();
    
    for (const creative of project.creatives) {
      // Add each creative to the zip file
      const response = await fetch(creative.url);
      const buffer = await response.buffer();
      zip.file(`creative-${creative._id}.png`, buffer);
    }

    // Generate the zip file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=creatives-${projectId}.zip`);
    res.setHeader('Content-Length', zipBuffer.length);
    
    // Send the zip file
    res.send(zipBuffer);
    */
  } catch (error) {
    console.error('[Download Error]', error);
    res.status(500).json({ error: 'Failed to download creatives' });
  }
};

/* ---------------------------------------------------------
   3) Stability AI Image Generation (LATEST API)
----------------------------------------------------------*/
const callImageGenerationAPI = async (prompt: string): Promise<string> => {
  const apiKey = process.env.IMAGE_GEN_API_KEY;
  const provider = process.env.IMAGE_GEN_PROVIDER || "stability";

  if (!apiKey) {
    throw new Error("IMAGE_GEN_API_KEY missing in .env");
  }

  /* ------------------------------
      Stability AI (Recommended)
  -------------------------------*/
  if (provider === "stability") {
    try {
      const apiUrl = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

      console.log("[Stability] Generating image with prompt:", prompt.substring(0, 50) + "...");

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Stability Error]", response.status, errorText);
        throw new Error(`Stability API failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.artifacts || !data.artifacts[0]?.base64) {
        console.error("Unexpected response format from Stability AI:", JSON.stringify(data, null, 2));
        throw new Error("Invalid response format from Stability AI");
      }

      return `data:image/png;base64,${data.artifacts[0].base64}`;
    } catch (err) {
      console.error("[Stability API Exception]", err);
      // Fallback to a placeholder image if the API call fails
      console.log("Falling back to placeholder image due to API error");
      return "https://via.placeholder.com/1024x1024.png?text=Image+Generation+Failed";
    }
  }

  /* ------------------------------------------------------
      Fallback (if provider == openai)
  ------------------------------------------------------*/
  throw new Error("OpenAI provider not supported in free mode");
};
