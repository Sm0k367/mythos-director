'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/StatusBadge';
import type { Campaign } from '@/lib/types';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campaigns')
      .then((r) => r.json())
      .then((data) => setCampaigns(data.campaigns ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-white/50 mt-2 text-sm">All production runs for this session</p>
        </div>
        <Link
          href="/campaigns/new"
          className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium"
        >
          New campaign
        </Link>
      </div>

      {loading && <p className="text-white/50">Loading...</p>}

      {!loading && campaigns.length === 0 && (
        <div className="border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-white/50 mb-6">No campaigns yet. Create your first brief.</p>
          <Link href="/campaigns/new" className="text-white underline underline-offset-4">
            Start a campaign →
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {campaigns.map((c) => (
          <Link
            key={c.id}
            href={`/campaigns/${c.id}`}
            className="block border border-white/10 rounded-2xl p-6 hover:border-white/25 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-medium text-lg">{c.name}</h2>
                <p className="text-white/50 text-sm mt-1">
                  {c.brief.product} · {c.brief.audience}
                </p>
              </div>
              <StatusBadge status={c.status} />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}