import { NextResponse } from 'next/server';
import { getCampaign } from '@/lib/store';
import { runCampaignPipeline } from '@/lib/campaign-director';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campaign = getCampaign(id);

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }

  if (campaign.status !== 'draft' && campaign.status !== 'failed') {
    return NextResponse.json(
      { error: 'Campaign already running or completed' },
      { status: 409 }
    );
  }

  const result = await runCampaignPipeline(id);

  return NextResponse.json({ campaign: result });
}