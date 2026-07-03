import type { CampaignStatus } from '@/lib/types';

const styles: Record<CampaignStatus, string> = {
  draft: 'bg-white/10 text-white/70',
  planning: 'bg-blue-500/20 text-blue-300',
  generating_media: 'bg-purple-500/20 text-purple-300',
  review: 'bg-amber-500/20 text-amber-300',
  completed: 'bg-emerald-500/20 text-emerald-300',
  failed: 'bg-red-500/20 text-red-300',
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}