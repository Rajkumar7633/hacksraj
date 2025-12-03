export const generateCaptions = async (imagePrompt: string): Promise<string> => {
  try {
    console.log("[Service] Generating caption for:", imagePrompt.substring(0, 50) + "...")

    const apiKey = process.env.LLM_API_KEY || ""
    const provider = process.env.LLM_PROVIDER || "openai"

    // Strict context to prevent hallucinations
    const systemPrompt = `You are an expert marketing copywriter. Generate a short, punchy ad caption (max 15 words) for the creative variation based on the image context. Only use information provided. If unsure, respond with "Creative variation".`

    // Implement actual API call based on provider
    if (!apiKey) {
      return "Premium creative variation"
    }
    const caption = await callLLMAPI(imagePrompt, systemPrompt, provider, apiKey)

    return caption
  } catch (error: any) {
    console.error("[Service Error] Caption generation:", error)
    return "Premium creative variation"
  }
}

const callLLMAPI = async (
  prompt: string,
  systemPrompt: string,
  provider: string,
  apiKey: string,
): Promise<string> => {
  // Placeholder implementation
  console.log("[Service] Calling", provider, "LLM API")
  return "Discover innovation. Elevate your brand today."
}
