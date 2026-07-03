import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get('id');

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Simulate live execution
      const nodes = [
        { id: 1, type: 'mythos', label: 'Mythos Core' },
        { id: 2, type: 'omnimedia', label: 'Omnimedia Swarm' },
        { id: 3, type: 'review', label: 'Human Review' }
      ];

      for (const node of nodes) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'node_start', node })}\n\n`));
        await new Promise(r => setTimeout(r, 800));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'node_result', node, result: { status: 'done' } })}\n\n`));
      }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'workflow_complete' })}\n\n`));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
