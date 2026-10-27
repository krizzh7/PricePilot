'use client';

import { NumberTicker } from '@/components/ui/NumberTicker';

const STATS = [
  { value: 40, prefix: '', suffix: '+', decimals: 0, label: 'Retailers monitored live' },
  { value: 1200, prefix: '', suffix: '+', decimals: 0, label: 'Popular products tracked' },
  { value: 2.3, prefix: '$', suffix: 'M+', decimals: 1, label: 'Shopper savings surfaced' },
  { value: 24, prefix: '', suffix: '/7', decimals: 0, label: 'Automated price coverage' },
] as const;

export function StatsBand() {
  return (
    <section className="container py-14 md:py-16" aria-label="PricePilot by the numbers">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:divide-x md:divide-border/70">
        {STATS.map(({ value, prefix, suffix, decimals, label }) => (
          <div key={label} className="flex flex-col-reverse text-center md:px-8">
            <dt className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-[13px] sm:normal-case sm:tracking-normal">
              {label}
            </dt>
            <dd className="tnum text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              <NumberTicker
                value={value}
                prefix={prefix}
                suffix={suffix}
                decimalPlaces={decimals}
                duration={900}
              />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
