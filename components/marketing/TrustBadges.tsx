import { Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';

const benefits = [
  { label: '100% Free & Independent', icon: ShieldCheck },
  { label: 'Real-time Retailer Prices', icon: Zap },
  { label: 'Ad-free Experience', icon: Sparkles },
];

export function TrustBadges() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-muted-foreground" aria-label="PricePilot benefits">
        {benefits.map(({ label, icon: Icon }) => (
          <li key={label} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 shadow-xs">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Icon className="h-2.5 w-2.5" aria-hidden="true" />
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
