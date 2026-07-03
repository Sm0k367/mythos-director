'use client';

import { useState } from 'react';

export default function WorkflowCanvas() {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'trigger', label: 'New Session' },
    { id: 2, type: 'mythos', label: 'Mythos Core' },
    { id: 3, type: 'omnimedia', label: 'Omnimedia Swarm' },
    { id: 4, type: 'review', label: 'Human Review' }
  ]);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runWorkflow = async () => {
    setLoading(true);
    setResults([]);

    try {
      // Start the workflow
      const startRes = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'mythos-cinematic', nodes })
      });
      const startData = await startRes.json();

      // Stream results
      const streamRes = await fetch(`/api/workflows/stream?id=${startData.workflow}`);
      const reader = streamRes.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.replace('data: ', ''));
                setResults(prev => [...prev, data]);
              } catch (e) {
                // ignore parse errors on partial chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setResults([{ type: 'error', message: 'Workflow failed' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-semibold tracking-tighter mb-8">Workflow Canvas</h1>

      <div className="border border-white/10 rounded-3xl p-8 mb-8">
        <div className="grid grid-cols-4 gap-4">
          {nodes.map(node => (
            <div key={node.id} className="bg-zinc-950 border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-xs tracking-widest text-white/40 mb-2">{node.type.toUpperCase()}</div>
              <div className="font-medium">{node.label}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={runWorkflow}
        disabled={loading}
        className="px-8 py-4 rounded-full bg-white text-black font-medium disabled:opacity-50"
      >
        {loading ? 'Running...' : 'Run Workflow'}
      </button>

      {results.length > 0 && (
        <div className="mt-8 bg-zinc-950 border border-white/10 rounded-2xl p-8">
          <div className="text-xs tracking-widest text-white/40 mb-4">LIVE RESULTS</div>
          <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 text-xs text-white/40">
        Agents can create and edit these workflows at runtime. Every node is backed by the Supervisor.
      </div>
    </div>
  );
}
