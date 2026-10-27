'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { TrustBadges } from '@/components/marketing/TrustBadges';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { StatsBand } from '@/components/marketing/StatsBand';
import { SocialProof } from '@/components/marketing/SocialProof';
import { LiveComparisonPreview } from '@/components/marketing/LiveComparisonPreview';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const POPULAR_SEARCHES = [
  'Lenovo Legion',
  'AirPods Pro 2',
  'PlayStation 5 Slim',
  'Sony WH-1000XM5',
  'MacBook Air M3',
  'Nintendo Switch OLED',
];

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const els = heroRef.current?.querySelectorAll('[data-hero]');
      if (els?.length) {
        gsap.fromTo(
          els,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: 'power3.out', clearProps: 'transform' }
        );
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const searchRoute = (q: string) => `/search?q=${encodeURIComponent(q)}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-14 pb-16 md:pt-24 md:pb-24">
          {/* Background: engineered dot texture + single soft accent glow */}
          <div aria-hidden="true" className="absolute inset-0 bg-dots" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[-140px] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[110px] dark:bg-emerald-500/[0.1]"
          />

          <div className="container relative z-10">
            <div ref={heroRef} className="mx-auto max-w-3xl text-center">
              {/* Eyebrow */}
              <div data-hero className="flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-3.5 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live Google Shopping price intelligence
                </span>
              </div>

              {/* Display headline */}
              <h1
                data-hero
                className="mt-7 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl"
              >
                The fastest way to pay
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400">
                  the lowest price.
                </span>
              </h1>

              {/* Subheadline */}
              <p
                data-hero
                className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                PricePilot scans Amazon, Best Buy, Walmart, and 40+ authorized retailers in
                real time — so you see every offer side-by-side before you buy.
              </p>

              {/* Search — the primary action, front and center */}
              <div data-hero className="mx-auto mt-9 max-w-2xl">
                <SearchBar onSearch={(q) => router.push(searchRoute(q))} />
              </div>

              {/* Trending queries */}
              <div data-hero className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 pr-1 text-xs font-medium text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  Trending:
                </span>
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => router.push(searchRoute(item))}
                    className="pill-tactile rounded-full border border-border/80 bg-card/70 px-3.5 py-1 text-xs font-medium text-foreground/80 hover:border-emerald-500/40 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Trust row */}
              <div data-hero className="mt-11">
                <TrustBadges />
              </div>
            </div>

            {/* Live product preview — proof, not promise */}
            <ScrollReveal id="hero-live-comparison" delay={120}>
              <LiveComparisonPreview />
            </ScrollReveal>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────── */}
        <ScrollReveal id="stats-band" delay={60}>
          <StatsBand />
        </ScrollReveal>

        {/* ── How it works ─────────────────────────────────────── */}
        <ScrollReveal id="how-it-works-section" delay={80}>
          <HowItWorks />
        </ScrollReveal>

        {/* ── Testimonials ─────────────────────────────────────── */}
        <SocialProof />

        {/* ── Final CTA ────────────────────────────────────────── */}
        <ScrollReveal id="bottom-cta-section" delay={80}>
          <section className="relative overflow-hidden py-20 md:py-24">
            <div aria-hidden="true" className="absolute inset-0 bg-dots-b" />
            <div className="container relative z-10">
              <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border/80 bg-card p-8 text-center shadow-card sm:p-14">
                {/* Emerald hairline accent */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
                />

                <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Ready to find your best deal?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {isAuthenticated
                    ? `You're signed in as ${session?.user?.email}. Search any product to start comparing offers.`
                    : 'No sign-up required. Type any product name and see who has the lowest price today.'}
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/search"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-500 active:scale-[0.98] btn-tactile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 sm:w-auto"
                  >
                    Start comparing prices
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>

                  {isAuthenticated ? (
                    <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-xs font-semibold text-emerald-700 sm:text-sm dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Account active
                    </span>
                  ) : (
                    <Link
                      href="/auth"
                      className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-transparent px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 sm:w-auto"
                    >
                      Create free account
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <SiteFooter />
    </div>
  );
}
