'use client';

import { ExternalLink, Star, Truck } from 'lucide-react';
import type { ParsedResult } from '@/types/search';

interface ComparisonCardProps {
  result: ParsedResult;
  index?: number;
}

export function ComparisonCard({ result, index = 0 }: ComparisonCardProps) {
  const rating = result.rating === null ? 'Rating not listed' : `${result.rating.toFixed(1)}${result.reviewCount === null ? '' : ` · ${result.reviewCount.toLocaleString()} reviews`}`;

  return (
    <article className="border border-slate-200 bg-white p-4" aria-label={`${result.retailer} offer, ${result.priceFormatted}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <img src={result.faviconUrl} alt="" className="mt-0.5 h-5 w-5 shrink-0 rounded-sm" loading="lazy" />
          <div className="min-w-0">
            <h2 className="font-semibold text-slate-950">{result.retailer}</h2>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{result.title}</p>
          </div>
        </div>
        {index === 0 && <span className="shrink-0 border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-900">Lowest</span>}
      </div>
      <p className="mt-5 text-2xl font-semibold tabular-nums tracking-tight text-slate-950">{result.priceFormatted}</p>
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
        <p className="flex items-center gap-2"><Star className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />{rating}</p>
        <p className="flex items-center gap-2"><Truck className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />{result.shippingText}</p>
        <p className="text-xs text-slate-500">Availability: {result.availability}</p>
      </div>
      <a href={result.productUrl} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-11 items-center justify-center gap-2 bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2">
        View deal <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </article>
  );
}
