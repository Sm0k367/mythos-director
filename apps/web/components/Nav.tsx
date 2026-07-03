import Link from 'next/link';

export function Nav() {
  return (
    <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          Mythos Director
        </Link>
        <div className="flex items-center gap-6 text-sm text-white/70">
          <Link href="/campaigns/new" className="hover:text-white transition">
            New Campaign
          </Link>
          <Link href="/campaigns" className="hover:text-white transition">
            Campaigns
          </Link>
          <Link href="/workflows" className="hover:text-white transition">
            Pipeline
          </Link>
        </div>
      </div>
    </nav>
  );
}