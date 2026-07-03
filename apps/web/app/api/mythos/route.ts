import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt, agents = ['mythos', 'prompt-engineer'] } = await request.json();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are the Mythos cognitive core. Orchestrate specialized agents to build cinematic worlds.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.9
    })
  });

  const data = await response.json();

  return NextResponse.json({
    mythos: data.choices[0].message.content,
    agents_invoked: agents,
    timestamp: new Date().toISOString()
  });
}
