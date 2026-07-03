'use client';

import { useState } from 'react';

export default function WorkflowCanvas() {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'trigger', label: 'New Session' },
    { id: 2, type: 'mythos', label: 'Mythos Core' },
    { id: 3, type: 'omnimedia', label: 'Omnimedia Swarm' },
    { id: 4, type: 'review', label: 'Human Review' }
  ]);

  const [connections, setConnections] = useState([
    [1, 2], [2, 3], [3, 4]
  ]);

  const runWorkflow = async () => {
    const res = await fetch('/api/workflows/run', {
      method: 'POST',
      body: JSON.stringify({ name: 'mythos-cinematic', nodes })
    });
    const data = await res.json();
    alert('Workflow executed: ' + JSON.stringify(data));
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
        className="px-8 py-4 rounded-full bg-white text-black font-medium"
      >
        Run Workflow
      </button>

      <div className="mt-8 text-xs text-white/40">
        Agents can create and edit these workflows at runtime. Every node is backed by the Supervisor.
      </div>
    </div>
  );
}
