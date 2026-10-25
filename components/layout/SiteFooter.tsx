import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40 backdrop-blur-sm">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 font-bold tracking-tight text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-600/20">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-base font-bold">PricePilot</span>
            </Link>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              PricePilot empowers smart shoppers with instant, transparent price comparisons across America&apos;s leading retailers. No biased ads, no sponsored markups.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Independent, automated Google Shopping data verification</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Popular Searches</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/search?q=Lenovo+Legion" className="hover:text-emerald-600 transition-colors">Lenovo Legion Laptops</Link></li>
              <li><Link href="/search?q=AirPods+Pro" className="hover:text-emerald-600 transition-colors">Apple AirPods Pro</Link></li>
              <li><Link href="/search?q=PlayStation+5" className="hover:text-emerald-600 transition-colors">PlayStation 5 Consoles</Link></li>
              <li><Link href="/search?q=Sony+WH-1000XM5" className="hover:text-emerald-600 transition-colors">Sony Headphones</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Retailer Network</h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              We monitor prices in real-time from Amazon, Best Buy, Walmart, Newegg, B&amp;H Photo, Target, Micro Center, and Apple.
            </p>
            <p className="text-[11px] text-muted-foreground/80">
              * Retailer pricing and availability are subject to change without notice. All trademarks belong to their respective owners.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PricePilot. Built for smart consumer choices.</p>
          <div className="flex items-center gap-4">
            <Link href="/search" className="hover:text-foreground transition-colors">Search Engine</Link>
            <Link href="/auth" className="hover:text-foreground transition-colors">Account</Link>
            <Link href="/#how-it-works" className="hover:text-foreground transition-colors">Methodology</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
