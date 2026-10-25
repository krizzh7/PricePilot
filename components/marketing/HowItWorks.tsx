'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowDownWideNarrow, Search, ExternalLink, BadgePercent, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Search any product',
    detail: 'Type any tech item, gadget, or appliance to scan live Google Shopping catalog offers.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Compare transparently',
    detail: 'View offers side-by-side: sort by absolute lowest price, customer ratings, or shipping speed.',
    icon: ArrowDownWideNarrow,
  },
  {
    number: '03',
    title: 'Checkout directly',
    detail: 'Navigate straight to official retailers like Amazon, Best Buy, or Walmart with verified pricing.',
    icon: ExternalLink,
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    gsap.fromTo(
      sectionRef.current?.querySelectorAll('[data-step]') ?? [],
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative border-t border-border bg-card/40 py-20 md:py-28"
      aria-labelledby="how-title"
    >
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Simple &amp; Transparent
          </span>
          <h2 id="how-title" className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How PricePilot saves you money
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Eliminate endless browser tabs. We collect verified retailer prices into one clean, honest interface.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ number, title, detail, icon: Icon }) => (
            <div
              key={number}
              data-step
              className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-2xl font-black text-muted-foreground/30 font-mono">
                    {number}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground tracking-tight">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <BadgePercent className="h-3.5 w-3.5" />
                <span>Zero markup guarantee</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
