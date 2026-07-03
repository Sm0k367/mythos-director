import { NextResponse } from 'next/server';
import { saveCampaign, listCampaigns } from '@/lib/store';
import type { Campaign, CreateCampaignInput } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ campaigns: listCampaigns() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateCampaignInput;

  if (!body.name?.trim() || !body.brief?.product?.trim()) {
    return NextResponse.json(
      { error: 'Campaign name and product are required' },
      { status: 400 }
    );
  }

  const id = `camp_${Date.now()}`;
  const timestamp = new Date().toISOString();

  const campaign: Campaign = {
    id,
    name: body.name.trim(),
    brief: {
      product: body.brief.product.trim(),
      audience: body.brief.audience?.trim() || 'General consumers',
      goal: body.brief.goal?.trim() || 'Increase brand awareness',
      tone: body.brief.tone?.trim() || 'Professional',
      budget: body.brief.budget,
      channels: body.brief.channels ?? ['instagram', 'linkedin', 'web'],
    },
    status: 'draft',
    events: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  saveCampaign(campaign);

  return NextResponse.json({ campaign }, { status: 201 });
}