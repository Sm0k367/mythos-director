'use client';

import { useState } from 'react';

export default function MythosDirector() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'mythos' | 'media' | 'deploy'>('mythos');

  const callMythos = async () => {
    if (!prompt) return;
    setLoading(true);
    const res = await fetch('/api/mythos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const callOrchestrate = async (type: string) => {
    if (!prompt) return;
    setLoading(true);
    const res = await fetch('/api/orchestrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, type })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const callDeploy = async (plan: string) => {
    setLoading(true);
    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project: 'mythos-director', plan })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero */}
      <div className="relative h-[100vh] flex items-center justify-center border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[length:4px_4px]" />
        <div className="relative z-10 text-center px-6">
          <div className="inline-block px-4 py-1 rounded-full border border-white/20 text-xs tracking-[4px] mb-6">MYTHOS DIRECTOR</div>
          <h1 className="text-7xl font-semibold tracking-tighter mb-4">Cinematic worlds.<br />Built by agents.</h1>
          <p className="text-xl text-white/60 max-w-md mx-auto">The production platform that orchestrates cognitive cores, media swarms, and instant deployment.</p>
          <div className="flex gap-4 justify-center mt-10">
            <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 rounded-full bg-white text-black font-medium">Try the demo</button>
            <a href="#pricing" className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition">View pricing</a>
          </div>
        </div>
        <div className="absolute bottom-10 text-xs tracking-[3px] text-white/40">SCROLL TO BEGIN</div>
      </div>

      {/* Interactive Dashboard */}
      <div id="demo" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <div className="text-xs tracking-[4px] text-white/40 mb-2">PRODUCTION PLATFORM</div>
          <h2 className="text-5xl font-semibold tracking-tighter">Mythos Director Live</h2>
        </div>

        <div className="flex gap-2 mb-8 border-b border-white/10 pb-2">
          {(['mythos','media','deploy'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 text-sm rounded-full transition ${activeTab === tab ? 'bg-white text-black' : 'hover:bg-white/5'}`}>
              {tab === 'mythos' && 'Cognitive Core'}
              {tab === 'media' && 'Media Orchestrator'}
              {tab === 'deploy' && 'Deploy & Bill'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Input */}
          <div className="lg:col-span-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTab === 'mythos' ? "A cyberpunk city where memories are currency..." : activeTab === 'media' ? "Generate a 10-second cinematic trailer..." : "Deploy Mythos Director to production"}
              className="w-full h-48 bg-zinc-950 border border-white/10 rounded-2xl p-8 text-lg placeholder:text-white/30 focus:outline-none resize-none"
            />
            <div className="flex gap-3 mt-4">
              {activeTab === 'mythos' && <button onClick={callMythos} disabled={loading} className="flex-1 py-4 rounded-full bg-white text-black font-medium disabled:opacity-50">Invoke Mythos Core</button>}
              {activeTab === 'media' && (
                <>
                  <button onClick={() => callOrchestrate('video')} disabled={loading} className="flex-1 py-4 rounded-full border border-white/20 hover:bg-white/5 disabled:opacity-50">Generate Video</button>
                  <button onClick={() => callOrchestrate('image')} disabled={loading} className="flex-1 py-4 rounded-full border border-white/20 hover:bg-white/5 disabled:opacity-50">Generate Image</button>
                </>
              )}
              {activeTab === 'deploy' && (
                <>
                  <button onClick={() => callDeploy('starter')} disabled={loading} className="flex-1 py-4 rounded-full border border-white/20 hover:bg-white/5 disabled:opacity-50">Starter — $29</button>
                  <button onClick={() => callDeploy('pro')} disabled={loading} className="flex-1 py-4 rounded-full border border-white/20 hover:bg-white/5 disabled:opacity-50">Pro — $99</button>
                </>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="lg:col-span-2 bg-zinc-950 border border-white/10 rounded-2xl p-8 min-h-[280px]">
            {!result && !loading && <div className="h-full flex items-center justify-center text-white/30 text-sm tracking-widest">OUTPUT WILL APPEAR HERE</div>}
            {loading && <div className="h-full flex items-center justify-center">Orchestrating agents...</div>}
            {result && (
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">{JSON.stringify(result, null, 2)}</pre>
            )}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="border-t border-white/10 py-24 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-xs tracking-[4px] text-white/40 mb-3">PRODUCTION TIERS</div>
          <h3 className="text-6xl font-semibold tracking-tighter mb-16">Ship without limits.</h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: '29', desc: 'Perfect for experiments' },
              { name: 'Pro', price: '99', desc: 'Full production power' },
              { name: 'Scale', price: '299', desc: 'Enterprise swarm' }
            ].map((tier, i) => (
              <div key={i} className="border border-white/10 rounded-3xl p-10 text-left hover:border-white/30 transition">
                <div className="text-sm tracking-widest text-white/40">{tier.name.toUpperCase()}</div>
                <div className="text-7xl font-semibold tracking-tighter my-4">${tier.price}<span className="text-2xl align-super text-white/40">/mo</span></div>
                <div className="text-white/60 mb-10">{tier.desc}</div>
                <button onClick={() => { setActiveTab('deploy'); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full py-4 rounded-full bg-white text-black font-medium">Deploy now</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-12 text-center text-xs text-white/40 tracking-[2px]">MYTHOS DIRECTOR — BUILT BY AGENTS, FOR AGENTS</div>
    </div>
  );
}
