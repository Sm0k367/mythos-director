import { NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/openai';
import type { CampaignBrief, CreativeDirection } from '@/lib/types';

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt, brief } = body as { prompt?: string; brief?: CampaignBrief };

  const input = brief ?? {
    product: prompt || 'Unknown product',
    audience: 'General consumers',
    goal: 'Increase brand awareness',
    tone: 'Professional',
  };

  try {
    const raw = await chatCompletion(
      [
        {
          role: 'system',
          content: `You are Mythos Director, a senior creative director.
Given a campaign brief, return valid JSON with: concept, taglines (3), messagingPillars (3), colorPalette (4 hex), moodKeywords (4).
No markdown.`,
        },
        { role: 'user', content: JSON.stringify(input) },
      ],
      { json: true }
    );

    const creative = JSON.parse(raw) as CreativeDirection;

    return NextResponse.json({
      creative,
      brief: input,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Generation failed';

    return NextResponse.json({
      creative: {
        concept: `Campaign for ${input.product} targeting ${input.audience}`,
        taglines: [`${input.product} — ${input.goal}`],
        messagingPillars: [input.goal],
        colorPalette: ['#0f0f0f', '#e94560', '#f5f5f5'],
        moodKeywords: [input.tone, 'modern'],
      },
      brief: input,
      note: message.includes('OPENAI_API_KEY') ? 'Demo mode — set OPENAI_API_KEY for live generation' : message,
      timestamp: new Date().toISOString(),
    });
  }
}