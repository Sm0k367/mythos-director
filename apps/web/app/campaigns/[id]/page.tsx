'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { StatusBadge } from '@/components/StatusBadge';
import type { Campaign, PipelineEvent } from '@/lib/types';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [running, setRunning] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/campaigns/${id}`);
    const data = await res.json();
    if (data.campaign) setCampaign(data.campaign);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const runPipeline = async () => {
    setRunning(true);
    setEvents([]);

    const res = await fetch(`/api/campaigns/${id}/stream`);
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      setRunning(false);
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      for (const line of chunk.split('\n\n')) {
        if (!line.startsWith('data: ')) continue;
        try {
          const data = JSON.parse(line.replace('data: ', ''));
          if (data.type === 'pipeline_event') {
            setEvents((prev) => [...prev, data.event]);
            setCampaign(data.campaign);
          }
          if (data.type === 'pipeline_complete') {
            setCampaign(data.campaign);
          }
        } catch {
          // partial chunk
        }
      }
    }

    setRunning(false);
    await load();
  };

  useEffect(() => {
    if (campaign?.status === 'draft') {
      runPipeline();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?.id, campaign?.status]);

  if (!campaign) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-white/50">Loading campaign...</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-semibold tracking-tight">{campaign.name}</h1>
            <StatusBadge status={campaign.status} />
          </div>
          <p className="text-white/50 text-sm">
            {campaign.brief.product} · {campaign.brief.goal}
          </p>
        </div>
        <div className="flex gap-3">
          {campaign.status === 'failed' && (
            <button
              onClick={runPipeline}
              disabled={running}
              className="px-5 py-2 rounded-full border border-white/20 text-sm disabled:opacity-40"
            >
              Retry
            </button>
          )}
          {campaign.status === 'completed' && (
            <a
              href={`/api/campaigns/${id}/export`}
              className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium"
            >
              Export package
            </a>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Brief">
            <dl className="space-y-3 text-sm">
              <BriefRow label="Product" value={campaign.brief.product} />
              <BriefRow label="Audience" value={campaign.brief.audience} />
              <BriefRow label="Goal" value={campaign.brief.goal} />
              <BriefRow label="Tone" value={campaign.brief.tone} />
            </dl>
          </Card>

          <Card title="Pipeline">
            {running && events.length === 0 && (
              <p className="text-sm text-white/50">Starting production...</p>
            )}
            <ul className="space-y-2">
              {(events.length ? events : campaign.events).map((e, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span
                    className={
                      e.status === 'completed'
                        ? 'text-emerald-400'
                        : e.status === 'failed'
                          ? 'text-red-400'
                          : 'text-white/40'
                    }
                  >
                    {e.status === 'completed' ? '✓' : e.status === 'failed' ? '✗' : '…'}
                  </span>
                  <span className="text-white/70">{e.message}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {campaign.creative && (
            <Card title="Creative direction">
              <p className="text-white/80 mb-4 leading-relaxed">{campaign.creative.concept}</p>
              <div className="mb-4">
                <div className="text-xs text-white/40 mb-2">Taglines</div>
                <ul className="space-y-1 text-sm">
                  {campaign.creative.taglines.map((t) => (
                    <li key={t} className="text-white/70">
                      "{t}"
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 flex-wrap">
                {campaign.creative.colorPalette.map((c) => (
                  <div key={c} className="flex items-center gap-2 text-xs text-white/50">
                    <span
                      className="w-5 h-5 rounded border border-white/20"
                      style={{ backgroundColor: c }}
                    />
                    {c}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {campaign.storyboard && (
            <Card title="Storyboard">
              <div className="space-y-4">
                {campaign.storyboard.map((frame) => (
                  <div key={frame.shot} className="border border-white/5 rounded-xl p-4">
                    <div className="text-xs text-white/40 mb-1">
                      Shot {frame.shot} · {frame.duration}
                    </div>
                    <p className="text-sm text-white/80">{frame.description}</p>
                  </div>
                ))}
              </div>
              {campaign.script && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="text-xs text-white/40 mb-2">Voiceover script</div>
                  <pre className="text-sm text-white/70 whitespace-pre-wrap font-mono">
                    {campaign.script}
                  </pre>
                </div>
              )}
            </Card>
          )}

          {campaign.assets?.heroImageUrl && (
            <Card title="Hero image">
              <img
                src={campaign.assets.heroImageUrl}
                alt="Campaign hero"
                className="w-full rounded-xl border border-white/10"
              />
              {campaign.assets.heroImageNote && (
                <p className="text-xs text-white/40 mt-2">{campaign.assets.heroImageNote}</p>
              )}
            </Card>
          )}

          {campaign.socialCopy && (
            <Card title="Social copy">
              <div className="space-y-4 text-sm">
                <CopyBlock label="Headline" text={campaign.socialCopy.headline} />
                <CopyBlock label="Instagram" text={campaign.socialCopy.instagram} />
                <CopyBlock label="LinkedIn" text={campaign.socialCopy.linkedin} />
                <CopyBlock label="X / Twitter" text={campaign.socialCopy.twitter} />
                <CopyBlock label="CTA" text={campaign.socialCopy.cta} />
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-white/10 rounded-2xl p-6">
      <h2 className="text-xs tracking-widest text-white/40 uppercase mb-4">{title}</h2>
      {children}
    </section>
  );
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-white/40">{label}</dt>
      <dd className="text-white/80">{value}</dd>
    </div>
  );
}

function CopyBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="text-white/40 text-xs mb-1">{label}</div>
      <p className="text-white/80 whitespace-pre-wrap">{text}</p>
    </div>
  );
}