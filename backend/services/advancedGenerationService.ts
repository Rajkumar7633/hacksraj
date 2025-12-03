interface GenerationOptions {
  style: "minimal" | "bold" | "playful" | "professional" | "modern"
  quantity: number
  variations: boolean
  aspectRatio?: string
}

const stylePrompts: { [key: string]: string } = {
  minimal: "Clean, minimalist design with lots of white space. Simple typography, subtle colors.",
  bold: "Bold, vibrant colors with strong contrast. Eye-catching typography and dynamic composition.",
  playful: "Fun, creative design with playful elements. Bright colors, animated feel, creative typography.",
  professional: "Corporate, professional business aesthetic. Elegant design, minimal colors, sophisticated typography.",
  modern: "Contemporary, trendy modern design. Clean lines, gradient elements, innovative composition.",
}

export const generateMultipleCreatives = async (
  logoUrl: string,
  productImageUrl: string,
  options: GenerationOptions,
): Promise<any[]> => {
  try {
    console.log("[Advanced Generation] Starting with options:", options)

    const creatives: any[] = []

    for (let i = 0; i < options.quantity; i++) {
      const creative = await generateSingleCreative(logoUrl, productImageUrl, options.style, i + 1, options.variations)

      creatives.push(creative)

      // Add delay between API calls to avoid rate limiting
      if (i < options.quantity - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return creatives
  } catch (error: any) {
    console.error("[Advanced Generation Error]:", error)
    throw error
  }
}

const generateSingleCreative = async (
  logoUrl: string,
  productImageUrl: string,
  style: string,
  variationNumber: number,
  addVariations: boolean,
): Promise<any> => {
  const styleDescription = stylePrompts[style] || stylePrompts.modern

  const prompt = `
    Create a professional marketing creative featuring:
    - Brand logo (provided as image reference)
    - Product image (provided as image reference)
    - Style: ${styleDescription}
    - Variation #${variationNumber}${addVariations ? ` (unique interpretation ${variationNumber})` : ""}
    - Resolution: High quality, 1200x628px
    - Format: Marketing social media post or advertisement
  `

  // Call image generation API (DALL-E, Stable Diffusion, etc.)
  const imageUrl = await callImageGenerationAPI(prompt)

  // Generate caption using LLM
  const caption = await generateSmartCaption(style, variationNumber)

  return {
    variation: variationNumber,
    imageUrl,
    prompt,
    caption,
    style,
    generatedAt: new Date(),
    metadata: {
      aspectRatio: "1200x628",
      format: "web",
      quality: "high",
    },
  }
}

const callImageGenerationAPI = async (prompt: string): Promise<string> => {
  const provider = process.env.IMAGE_GEN_PROVIDER || "dall-e"
  const apiKey = process.env.IMAGE_GEN_API_KEY

  console.log("[ImageGen] Calling", provider, "API")

  switch (provider) {
    case "dall-e":
      return generateWithDALLE(prompt, apiKey)
    case "stable-diffusion":
      return generateWithStableDiffusion(prompt, apiKey)
    case "midjourney":
      return generateWithMidjourney(prompt, apiKey)
    default:
      return generateWithDALLE(prompt, apiKey)
  }
}

const generateWithDALLE = async (prompt: string, apiKey?: string): Promise<string> => {
  try {
    // Placeholder - implement actual DALL-E API call
    console.log("[ImageGen] Using DALL-E with prompt:", prompt.substring(0, 100))
    return `https://placeholder-image.com/generated_dalle_${Date.now()}.png`
  } catch (error) {
    console.error("[ImageGen Error] DALL-E:", error)
    throw error
  }
}

const generateWithStableDiffusion = async (prompt: string, apiKey?: string): Promise<string> => {
  try {
    // Placeholder - implement actual Stable Diffusion API call
    console.log("[ImageGen] Using Stable Diffusion with prompt:", prompt.substring(0, 100))
    return `https://placeholder-image.com/generated_sd_${Date.now()}.png`
  } catch (error) {
    console.error("[ImageGen Error] Stable Diffusion:", error)
    throw error
  }
}

const generateWithMidjourney = async (prompt: string, apiKey?: string): Promise<string> => {
  try {
    // Placeholder - implement actual Midjourney API call
    console.log("[ImageGen] Using Midjourney with prompt:", prompt.substring(0, 100))
    return `https://placeholder-image.com/generated_mj_${Date.now()}.png`
  } catch (error) {
    console.error("[ImageGen Error] Midjourney:", error)
    throw error
  }
}

export const generateSmartCaption = async (style: string, variationNumber: number): Promise<string> => {
  const provider = process.env.LLM_PROVIDER || "openai"
  const apiKey = process.env.LLM_API_KEY

  const systemPrompt = `You are an expert marketing copywriter. Generate a short, punchy ad caption (max 15 words) for a creative marketing variation. 
  Be creative but professional. Focus on benefits and engagement.
  Current style: ${style}
  Variation: ${variationNumber}
  Only provide the caption text, nothing else.`

  try {
    const caption = await callLLMAPI(systemPrompt, provider, apiKey)
    return caption || getDefaultCaption(style, variationNumber)
  } catch (error) {
    console.error("[LLM Error]:", error)
    return getDefaultCaption(style, variationNumber)
  }
}

const callLLMAPI = async (systemPrompt: string, provider: string, apiKey?: string): Promise<string> => {
  // Placeholder implementations
  const captions: { [key: string]: string[] } = {
    minimal: [
      "Elevate your brand. Simple. Elegant. Timeless.",
      "Less is more. Design that speaks volumes.",
      "Pure simplicity meets premium quality.",
    ],
    bold: [
      "Bold moves. Bigger results. Join the revolution.",
      "Stand out. Be fearless. Make an impact.",
      "Turn heads. Change minds. Lead the future.",
    ],
    playful: [
      "Fun times ahead! Let's create magic together.",
      "Smile. Laugh. Love what you do.",
      "Play bigger. Dream bolder. Win together.",
    ],
    professional: [
      "Professional excellence. Trusted by leaders.",
      "Enterprise solutions. Delivered with precision.",
      "Innovation meets reliability. Every time.",
    ],
    modern: [
      "Next-gen innovation. Today's possibilities.",
      "Future-proof your brand. Starting now.",
      "Modern solutions for modern challenges.",
    ],
  }

  return (captions[provider] || captions.modern)[Math.floor(Math.random() * 3)]
}

const getDefaultCaption = (style: string, variation: number): string => {
  const defaultCaptions: { [key: string]: string } = {
    minimal: "Elegant simplicity. Premium quality.",
    bold: "Bold innovation. Unstoppable impact.",
    playful: "Creative excitement. Unlimited potential.",
    professional: "Business excellence. Trusted results.",
    modern: "Innovation delivered. Future ready.",
  }

  return defaultCaptions[style] || "Premium creative variation."
}

// Batch processing for multiple projects
export const generateBatchCreatives = async (
  projects: Array<{ logoUrl: string; productImageUrl: string; options: GenerationOptions }>,
): Promise<any[]> => {
  const results = []

  for (const project of projects) {
    const creatives = await generateMultipleCreatives(project.logoUrl, project.productImageUrl, project.options)
    results.push({
      projectId: project,
      creatives,
      totalGenerated: creatives.length,
      completedAt: new Date(),
    })
  }

  return results
}
