'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'I had three tabs open comparing laptop prices. PricePilot answered the same question in one search — and found the Legion 5 for $70 less than my usual store.',
    name: 'Daniel R.',
    context: 'Gaming laptop upgrade',
    initial: 'D',
  },
  {
    quote:
      'It caught a price dip on AirPods Pro before Amazon even updated the listing. Saved $40 in about ninety seconds.',
    name: 'Priya S.',
    context: 'Audio deal hunter',
    initial: 'P',
  },
  {
    quote:
      'No sponsored results, no "best pick" nonsense. It just shows every verified offer side-by-side. The only shopping tool I trust.',
    name: 'Marcus T.',
    context: 'Daily PricePilot user',
    initial: 'M',
  },
];

export function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('[data-quote]') ?? [],
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out' }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative scroll-mt-20 border-t border-border bg-card/40 py-20 md:py-28"
      aria-labelledby="testimonials-title"
    >
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Early adopters
          </p>
          <h2
            id="testimonials-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Shoppers who stopped overpaying
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Unpolished feedback from people who use PricePilot before every purchase.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map(({ quote, name, context, initial }) => (
            <figure
              key={name}
              data-quote
              className="card-tactile flex flex-col rounded-2xl border border-border/70 bg-card p-6 sm:p-7"
            >
              <div
                className="flex gap-1 text-amber-400"
                role="img"
                aria-label="Rated 5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 grow text-sm leading-relaxed text-foreground/90">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground/80"
                >
                  {initial}
                </span>
                <span className="text-sm">
                  <span className="font-semibold text-foreground">{name}</span>
                  <span className="block text-xs text-muted-foreground">{context}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
