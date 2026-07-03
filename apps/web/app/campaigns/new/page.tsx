'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    product: '',
    audience: '',
    goal: '',
    tone: 'Bold and modern',
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name || `${form.product} Campaign`,
        brief: {
          product: form.product,
          audience: form.audience,
          goal: form.goal,
          tone: form.tone,
        },
      }),
    });

    const data = await res.json();
    if (data.campaign?.id) {
      router.push(`/campaigns/${data.campaign.id}`);
    } else {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">New campaign brief</h1>
      <p className="text-white/50 text-sm mb-10">
        Tell the director what you are promoting. The pipeline handles the rest.
      </p>

      <form onSubmit={submit} className="space-y-6">
        <Field
          label="Campaign name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          placeholder="Q3 Product Launch"
        />
        <Field
          label="Product or service"
          required
          value={form.product}
          onChange={(v) => setForm({ ...form, product: v })}
          placeholder="AuraFlow — AI workflow automation for SMBs"
        />
        <Field
          label="Target audience"
          required
          value={form.audience}
          onChange={(v) => setForm({ ...form, audience: v })}
          placeholder="Operations managers at 50–200 person companies"
        />
        <Field
          label="Campaign goal"
          required
          value={form.goal}
          onChange={(v) => setForm({ ...form, goal: v })}
          placeholder="Drive free trial signups"
        />
        <Field
          label="Brand tone"
          value={form.tone}
          onChange={(v) => setForm({ ...form, tone: v })}
          placeholder="Bold, trustworthy, slightly playful"
        />

        <button
          type="submit"
          disabled={loading || !form.product}
          className="w-full py-4 rounded-full bg-white text-black font-medium disabled:opacity-40"
        >
          {loading ? 'Creating...' : 'Create and run pipeline'}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-white/60 mb-2 block">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 placeholder:text-white/25"
      />
    </label>
  );
}