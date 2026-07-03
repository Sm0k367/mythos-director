import Link from 'next/link';

const steps = [
  {
    title: 'Submit your brief',
    desc: 'Product, audience, goal, and tone — the inputs every agency needs on day one.',
  },
  {
    title: 'Director plans the campaign',
    desc: 'Creative concept, messaging pillars, storyboard, and 15-second script generated automatically.',
  },
  {
    title: 'Assets are produced',
    desc: 'Hero image and platform-specific copy for Instagram, LinkedIn, and X — ready to review.',
  },
  {
    title: 'Export and ship',
    desc: 'Download the full campaign package as JSON and hand off to your design or media team.',
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative min-h-[85vh] flex items-center justify-center border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[length:4px_4px]" />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <p className="text-xs tracking-[0.3em] text-white/40 mb-6 uppercase">
            AI Campaign Production Studio
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter mb-6 leading-tight">
            From brief to campaign package in minutes
          </h1>
          <p className="text-lg text-white/60 mb-10 leading-relaxed">
            Mythos Director is built for marketing teams, agencies, and founders who need
            creative direction, storyboards, visuals, and social copy — without waiting on a
            full production cycle.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/campaigns/new"
              className="px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-white/90 transition"
            >
              Start a campaign
            </Link>
            <Link
              href="/workflows"
              className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition"
            >
              View live pipeline
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-semibold tracking-tight mb-4 text-center">
          How it works
        </h2>
        <p className="text-white/50 text-center mb-16 max-w-xl mx-auto">
          A real production workflow — not a demo chatbot. Every step streams live so your
          team can review as assets are created.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="border border-white/10 rounded-2xl p-8 hover:border-white/20 transition"
            >
              <div className="text-xs text-white/40 mb-3">Step {i + 1}</div>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-zinc-950 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-semibold tracking-tight mb-12 text-center">
            What you get
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { label: 'Creative direction', detail: 'Concept, taglines, messaging pillars' },
              { label: 'Storyboard + script', detail: '4-shot board with 15s voiceover' },
              { label: 'Ready-to-ship assets', detail: 'Hero image + social copy' },
            ].map((item) => (
              <div key={item.label} className="border border-white/10 rounded-2xl p-8">
                <div className="font-medium mb-2">{item.label}</div>
                <div className="text-sm text-white/50">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 text-center text-xs text-white/40">
        Mythos Director — AI campaign production for real marketing teams
      </footer>
    </main>
  );
}