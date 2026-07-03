import { NextResponse } from 'next/server';
import { getCampaign } from '@/lib/store';
import { createCampaignPackage } from '@/lib/campaign-director';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campaign = getCampaign(id);

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }

  const pkg = createCampaignPackage(campaign);

  return new NextResponse(JSON.stringify(pkg, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${campaign.name.replace(/\s+/g, '-').toLowerCase()}-campaign.json"`,
    },
  });
}