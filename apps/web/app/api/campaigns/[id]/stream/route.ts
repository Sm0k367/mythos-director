import { NextRequest } from 'next/server';
import { getCampaign } from '@/lib/store';
import { runCampaignPipeline } from '@/lib/campaign-director';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campaign = getCampaign(id);

  if (!campaign) {
    return new Response(JSON.stringify({ error: 'Campaign not found' }), {
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

      send({ type: 'pipeline_start', campaignId: id });

      try {
        await runCampaignPipeline(id, (event, updated) => {
          send({ type: 'pipeline_event', event, campaign: updated });
        });

        const final = getCampaign(id);
        send({ type: 'pipeline_complete', campaign: final });
      } catch (error) {
        send({
          type: 'pipeline_error',
          message: error instanceof Error ? error.message : 'Pipeline failed',
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