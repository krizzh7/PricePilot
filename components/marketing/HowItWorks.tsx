'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Search, ArrowDownWideNarrow, ExternalLink, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Search any product',
    detail: 'Type a gadget, appliance, or accessory to scan the live Google Shopping catalog.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Compare transparently',
    detail: 'Sort every offer by lowest price, customer rating, or shipping speed — all on one page.',
    icon: ArrowDownWideNarrow,
  },
  {
    number: '03',
    title: 'Checkout at the retailer',
    detail: 'Go straight to the official Amazon, Best Buy, or Walmart listing at verified pricing.',
    icon: ExternalLink,
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('[data-step]') ?? [],
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative scroll-mt-20 border-t border-border py-20 md:py-28"
      aria-labelledby="how-title"
    >
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Sticky narrative column */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              How it works
            </p>
            <h2
              id="how-title"
              className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              From search to checkout in three steps
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              No comparison tables to decode, no eleven open tabs. PricePilot gathers verified
              retailer offers into one clean, honest interface — and gets out of your way.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-500 btn-tactile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2"
              >
                Try it now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <span className="text-xs font-medium text-muted-foreground">
                No account required
              </span>
            </div>
          </div>

          {/* Process timeline */}
          <ol className="relative space-y-10 before:absolute before:bottom-8 before:left-[27px] before:top-8 before:w-px before:bg-border sm:before:left-[31px]">
            {steps.map(({ number, title, detail, icon: Icon }, index) => (
              <li
                key={number}
                data-step
                className="group relative flex gap-5 sm:gap-6"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {/* Marker */}
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card text-emerald-600 shadow-card transition-all duration-200 group-hover:border-emerald-500/40 group-hover:text-emerald-700 dark:text-emerald-400 dark:group-hover:border-emerald-500/40">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span
                    aria-hidden="true"
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white"
                  >
                    {index + 1}
                  </span>
                </div>

                <div className="pt-0.5">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
