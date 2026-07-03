import { NextRequest } from 'next/server';
import { getCampaign } from '@/lib/store';
import { runCampaignPipeline } from '@/lib/campaign-director';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get('id');

  if (!workflowId) {
    return new Response(JSON.stringify({ error: 'Missing workflow id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const campaign = getCampaign(workflowId);
  if (!campaign) {
    return new Response(JSON.stringify({ error: 'Workflow not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      try {
        await runCampaignPipeline(workflowId, (event) => {
          send({
            type: 'node_result',
            node: { type: event.step, label: event.step.replace(/_/g, ' ') },
            result: { status: event.status, message: event.message, data: event.data },
          });
        });

        send({ type: 'workflow_complete', campaign: getCampaign(workflowId) });
      } catch (error) {
        send({
          type: 'error',
          message: error instanceof Error ? error.message : 'Workflow failed',
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}