import type { Campaign } from './types';

const campaigns = new Map<string, Campaign>();

export function saveCampaign(campaign: Campaign): Campaign {
  campaigns.set(campaign.id, campaign);
  return campaign;
}

export function getCampaign(id: string): Campaign | undefined {
  return campaigns.get(id);
}

export function listCampaigns(): Campaign[] {
  return Array.from(campaigns.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function deleteCampaign(id: string): boolean {
  return campaigns.delete(id);
}