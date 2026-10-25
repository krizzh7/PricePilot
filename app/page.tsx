'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { TrustBadges } from '@/components/marketing/TrustBadges';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { LiveComparisonPreview } from '@/components/marketing/LiveComparisonPreview';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Sparkles, ArrowRight, TrendingUp, UserCheck } from 'lucide-react';
import Link from 'next/link';

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
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const ctx = gsap.context(() => {
      const els = heroRef.current?.querySelectorAll('[data-hero]');
      if (els?.length) {
        gsap.fromTo(
          els,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
        );
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const handleQuickSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-emerald-500/20">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
          {/* Ambient Background Glows */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/15" />
          <div className="pointer-events-none absolute right-10 top-40 h-[350px] w-[350px] rounded-full bg-teal-500/10 blur-[100px] dark:bg-teal-500/10" />

          <div className="container relative z-10">
            <div ref={heroRef} className="mx-auto max-w-3xl text-center">
              {/* Sybiosme-style Status Pill */}
              <div data-hero className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Real-Time Google Shopping Comparison</span>
              </div>

              {/* Main Headline */}
              <h1
                data-hero
                className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl sm:leading-[1.12]"
              >
                Find the best deals, <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400">
                  never overpay again.
                </span>
              </h1>

              {/* Subheadline */}
              <p data-hero className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Scan Amazon, Best Buy, Walmart, and authorized retailers side-by-side in seconds. Transparent, fast, and completely free.
              </p>

              {/* Pill Search Bar */}
              <div data-hero className="mt-8 max-w-2xl mx-auto">
                <SearchBar onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)} />
              </div>

              {/* Trending Tags (Clickable Pills) */}
              <div data-hero className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  Trending:
                </span>
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleQuickSearch(item)}
                    className="pill-tactile rounded-full border border-border/80 bg-card/60 px-3.5 py-1 text-xs font-medium text-foreground/80 hover:bg-muted hover:text-foreground hover:border-emerald-500/40 transition-all shadow-2xs hover:scale-105 active:scale-95"
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Trust Badges */}
              <div data-hero className="mt-10">
                <TrustBadges />
              </div>
            </div>

            {/* Structured Live Comparison Card with Deal Meter & 30-Day Sparkline */}
            <ScrollReveal id="hero-live-comparison" delay={150}>
              <LiveComparisonPreview />
            </ScrollReveal>
          </div>
        </section>

        {/* Feature Grid ("How It Works") with Scroll Reveal */}
        <ScrollReveal id="how-it-works-section" delay={100}>
          <HowItWorks />
        </ScrollReveal>

        {/* Bottom Call to Action with Scroll Reveal */}
        <ScrollReveal id="bottom-cta-section" delay={100}>
          <section className="relative overflow-hidden py-20 md:py-28">
            <div className="container relative z-10">
              <div className="mx-auto max-w-3xl rounded-3xl border border-border/80 bg-gradient-to-b from-card to-card/60 p-8 sm:p-14 text-center shadow-xl">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Ready to find your best deal?
                </h2>
                <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
                  {isAuthenticated
                    ? `Welcome back! You are signed in as ${session?.user?.email}. Search any product to start comparing offers.`
                    : 'No sign-up required. Jump straight in, type any product name, and see who has the lowest price today.'}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                  <Link
                    href="/search"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    <span>Start Searching Prices</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {isAuthenticated ? (
                    <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      <UserCheck className="h-4 w-4 stroke-[2.5]" />
                      <span>Account Active ({session?.user?.email})</span>
                    </div>
                  ) : (
                    <Link
                      href="/auth"
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-border/80 bg-card px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
                    >
                      Create Free Account
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
