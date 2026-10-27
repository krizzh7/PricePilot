import Link from 'next/link';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-600/20">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-[15px]">PricePilot</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Instant, transparent price comparisons across America&apos;s leading retailers.
              No biased ads, no sponsored markups.
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>Independent, automated Google Shopping data</span>
            </div>
          </div>

          {/* Links */}
          <nav className="md:col-span-3" aria-label="Popular searches">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Popular searches
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/search?q=Lenovo+Legion" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">Lenovo Legion laptops</Link></li>
              <li><Link href="/search?q=AirPods+Pro" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">Apple AirPods Pro</Link></li>
              <li><Link href="/search?q=PlayStation+5" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">PlayStation 5 consoles</Link></li>
              <li><Link href="/search?q=Sony+WH-1000XM5" className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">Sony headphones</Link></li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Retailer network
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We monitor prices in real time from Amazon, Best Buy, Walmart, Newegg,
              B&amp;H Photo, Target, Micro Center, and Apple.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} PricePilot. Built for smart consumer choices.</p>
          <div className="flex items-center gap-5">
            <Link href="/search" className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">Search</Link>
            <Link href="/auth" className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">Account</Link>
            <Link href="/#how-it-works" className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">Methodology</Link>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/70">
          * Retailer pricing and availability are subject to change without notice. All trademarks belong to their respective owners.
        </p>
      </div>
    </footer>
  );
}
