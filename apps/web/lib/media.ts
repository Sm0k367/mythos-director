import { HfInference } from '@huggingface/inference';

export async function generateHeroImage(prompt: string): Promise<{
  url?: string;
  note: string;
}> {
  const token = process.env.HF_TOKEN;

  if (!token) {
    return {
      note: 'Set HF_TOKEN to generate real images. Using placeholder.',
      url: `https://placehold.co/1200x675/1a1a2e/e94560?text=${encodeURIComponent('Campaign Hero')}`,
    };
  }

  try {
    const hf = new HfInference(token);
    const image = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt,
    });

    return {
      url: typeof image === 'string' ? image : undefined,
      note: 'Generated with Stable Diffusion XL',
    };
  } catch {
    return {
      note: 'Image generation failed. Using placeholder.',
      url: `https://placehold.co/1200x675/1a1a2e/e94560?text=${encodeURIComponent('Campaign Hero')}`,
    };
  }
}