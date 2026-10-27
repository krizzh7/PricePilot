import { Check } from 'lucide-react';

const benefits = [
  '100% free & independent',
  'Real-time retailer prices',
  'No ads, no sponsored bumps',
];

export function TrustBadges() {
  return (
    <ul
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs sm:text-[13px] font-medium text-muted-foreground"
      aria-label="PricePilot benefits"
    >
      {benefits.map((label) => (
        <li key={label} className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
          </span>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
