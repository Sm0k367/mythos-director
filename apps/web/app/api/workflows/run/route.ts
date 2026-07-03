import { NextResponse } from 'next/server';
import { saveCampaign } from '@/lib/store';
import type { Campaign } from '@/lib/types';

export async function POST(request: Request) {
  const { name, brief } = await request.json();

  if (!brief?.product) {
    return NextResponse.json({ error: 'Workflow requires a campaign brief with product' }, { status: 400 });
  }

  const id = `camp_${Date.now()}`;
  const timestamp = new Date().toISOString();

  const campaign: Campaign = {
    id,
    name: name || `Campaign ${new Date().toLocaleDateString()}`,
    brief: {
      product: brief.product,
      audience: brief.audience || 'General consumers',
      goal: brief.goal || 'Increase brand awareness',
      tone: brief.tone || 'Professional',
      channels: brief.channels ?? ['instagram', 'linkedin', 'web'],
    },
    status: 'draft',
    events: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  saveCampaign(campaign);

  return NextResponse.json({
    workflow: campaign.id,
    status: 'started',
    stream_url: `/api/campaigns/${campaign.id}/stream`,
    campaign,
  });
}