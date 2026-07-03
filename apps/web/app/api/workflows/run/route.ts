import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, nodes } = await request.json();

  // In production this would call the real WorkflowExecutor
  return NextResponse.json({
    workflow: name,
    status: "started",
    nodes: nodes.length,
    stream_url: `/api/workflows/stream?id=${name}`
  });
}
