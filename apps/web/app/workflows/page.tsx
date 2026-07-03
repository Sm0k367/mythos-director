'use client';

import { useState } from 'react';
import Link from 'next/link';

const PIPELINE_NODES = [
  { id: 1, type: 'brief_analysis', label: 'Brief Analysis' },
  { id: 2, type: 'creative_direction', label: 'Creative Direction' },
  { id: 3, type: 'storyboard', label: 'Storyboard + Script' },
  { id: 4, type: 'hero_image', label: 'Hero Image' },
  { id: 5, type: 'social_copy', label: 'Social Copy' },
  { id: 6, type: 'review', label: 'Human Review' },
];

export default function WorkflowCanvas() {
  const [brief, setBrief] = useState({
    product: 'NovaPay — contactless payments for street vendors',
    audience: 'Small business owners in urban markets',
    goal: 'Drive app downloads in first 30 days',
    tone: 'Energetic and trustworthy',
  });
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  const runWorkflow = async () => {
    setLoading(true);
    setResults([]);
    setCampaignId(null);

    try {
      const startRes = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Pipeline demo', brief }),
      });
      const startData = await startRes.json();
      setCampaignId(startData.workflow);

      const streamRes = await fetch(`/api/workflows/stream?id=${startData.workflow}`);
      const reader = streamRes.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          for (const line of chunk.split('\n\n')) {
            if (!line.startsWith('data: ')) continue;
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              setResults((prev) => [...prev, data]);
            } catch {
              // partial chunk
            }
          }
        }
      }
    } catch {
      setResults([{ type: 'error', message: 'Workflow failed' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Production pipeline</h1>
      <p className="text-white/50 text-sm mb-10">
        Live campaign workflow — each node runs real generation steps.
      </p>

      <div className="border border-white/10 rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {PIPELINE_NODES.map((node) => (
            <div
              key={node.id}
              className="bg-zinc-950 border border-white/10 rounded-xl p-5 text-center"
            >
              <div className="text-xs tracking-widest text-white/40 mb-2">
                {node.type.replace(/_/g, ' ').toUpperCase()}
              </div>
              <div className="font-medium text-sm">{node.label}</div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <input
            value={brief.product}
            onChange={(e) => setBrief({ ...brief, product: e.target.value })}
            className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm"
            placeholder="Product"
          />
          <input
            value={brief.audience}
            onChange={(e) => setBrief({ ...brief, audience: e.target.value })}
            className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm"
            placeholder="Audience"
          />
          <input
            value={brief.goal}
            onChange={(e) => setBrief({ ...brief, goal: e.target.value })}
            className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm"
            placeholder="Goal"
          />
          <input
            value={brief.tone}
            onChange={(e) => setBrief({ ...brief, tone: e.target.value })}
            className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm"
            placeholder="Tone"
          />
        </div>

        <button
          onClick={runWorkflow}
          disabled={loading}
          className="px-8 py-4 rounded-full bg-white text-black font-medium disabled:opacity-50"
        >
          {loading ? 'Running pipeline...' : 'Run pipeline'}
        </button>

        {campaignId && !loading && (
          <Link
            href={`/campaigns/${campaignId}`}
            className="ml-4 text-sm text-white/60 hover:text-white underline underline-offset-4"
          >
            View full campaign →
          </Link>
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8">
          <div className="text-xs tracking-widest text-white/40 mb-4">LIVE STREAM</div>
          <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono max-h-96 overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}