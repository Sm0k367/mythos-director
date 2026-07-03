import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt, type, agents = ['omnimedia', 'prompt-engineer'] } = await request.json();

  return NextResponse.json({
    type,
    prompt,
    agents_invoked: agents,
    status: 'queued',
    job_id: `mythos-${Date.now()}`,
    estimated_seconds: type === 'video' ? 45 : 8
  });
}
