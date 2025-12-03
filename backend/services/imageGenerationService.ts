export const generateImages = async (
  logoUrl: string | null,
  productImageUrl: string | null,
  style: string,
  quantity: number,
) => {
  try {
    console.log("[Service] Generating images with style:", style)

    const prompts = generatePrompts(logoUrl || "", productImageUrl || "", style, quantity)

    const images = await Promise.all(
      prompts.map(async (prompt, idx) => {
        try {
          const imageUrl = await callImageGenerationAPI(prompt)
          return { url: imageUrl, prompt }
        } catch (e: any) {
          console.error("[Service] Image API failed, using fallback for #", idx + 1, e?.message || e)
          const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
            <defs>
              <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stop-color='#ef4444'/>
                <stop offset='100%' stop-color='#f59e0b'/>
              </linearGradient>
            </defs>
            <rect width='100%' height='100%' fill='url(#g)'/>
            <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='56' fill='white'>Fallback creative ${idx + 1}</text>
          </svg>`
          return { url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, prompt }
        }
      }),
    )

    return images
  } catch (error: any) {
    console.error("[Service Error] Image generation:", error)
    throw error
  }
}

const generatePrompts = (logoUrl: string, productImageUrl: string, style: string, quantity: number) => {
  const styleDescriptions: { [key: string]: string } = {
    minimal: "clean, minimalist design with white space",
    bold: "bold, vibrant colors with strong contrast",
    playful: "fun, playful design with creative elements",
    professional: "corporate, professional business style",
    modern: "contemporary, trendy modern aesthetic",
  }

  const description = styleDescriptions[style] || styleDescriptions.modern
  const prompts = []

  for (let i = 0; i < quantity; i++) {
    prompts.push(`Marketing creative variation ${i + 1}: ${description}, featuring brand logo and product image`)
  }

  return prompts
}

interface ImageGenerationResponse {
  data?: Array<{
    url: string;
  }>;
  artifacts?: Array<{
    base64: string;
  }>;
}

const callImageGenerationAPI = async (prompt: string): Promise<string> => {
  const apiKey = process.env.IMAGE_GEN_API_KEY;
  const provider = process.env.IMAGE_GEN_PROVIDER || "dall-e";

  if (!apiKey) {
    // Fallback to an SVG data URL if no key provided
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
        <rect width='100%' height='100%' fill='#f0f0f0'/>
        <text x='50%' y='50%' fill='#333' font-size='24' font-family='sans-serif' 
              dominant-baseline='middle' text-anchor='middle'>
          IMAGE GENERATION API KEY NOT CONFIGURED
        </text>
      </svg>
    `).toString('base64')}`;
  }

  try {
    if (provider === "stability") {
      const apiHost = process.env.STABILITY_API_HOST || 'api.stability.ai';
      const engineId = 'stable-diffusion-xl-1024-v1-0';
      const apiUrl = `https://${apiHost}/v1/generation/${engineId}/text-to-image`;

      try {
        console.log('Calling Stability AI API with URL:', apiUrl);
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [{ text: prompt }],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            steps: 30,
            samples: 1,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Stability AI API error:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            error: errorText
          });
          throw new Error(`Stability AI API error: ${response.status} - ${response.statusText}`);
        }

        const responseText = await response.text();
        console.log('Stability AI response:', responseText.substring(0, 200) + '...');
        const data = JSON.parse(responseText) as ImageGenerationResponse;

        if (data.artifacts?.[0]?.base64) {
          return `data:image/png;base64,${data.artifacts[0].base64}`;
        }
        throw new Error('No image data in Stability AI response');
      } catch (error) {
        console.error('Error calling Stability AI:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
      }
    }

    // Original DALL-E implementation
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "url"
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[Service Error] Image generation failed:", res.status, text);
      throw new Error(`Image generation failed: ${res.status}`);
    }

    const data = await res.json() as ImageGenerationResponse;
    const imageUrl = data?.data?.[0]?.url;
    if (!imageUrl) throw new Error("No image URL in response");

    return imageUrl;

  } catch (error) {
    console.error("Error in image generation:", error);
    throw error;
  }
};