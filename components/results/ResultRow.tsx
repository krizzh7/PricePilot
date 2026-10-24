'use client';

import { ExternalLink, Star, Truck } from 'lucide-react';
import type { ParsedResult } from '@/types/search';

interface ResultRowProps {
  result: ParsedResult;
  index: number;
}

export function ResultRow({ result, index }: ResultRowProps) {
  const rating = result.rating === null ? 'Rating not listed' : `${result.rating.toFixed(1)}${result.reviewCount === null ? '' : ` (${result.reviewCount.toLocaleString()} reviews)`}`;

  return (
    <tr data-offer-row className="border-t border-slate-100 transition-colors hover:bg-slate-50/80">
      <td className="max-w-[320px] px-4 py-4">
        <div className="flex items-start gap-3">
          <img src={result.faviconUrl} alt="" className="mt-0.5 h-5 w-5 shrink-0 rounded-sm" loading="lazy" />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{result.retailer}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{result.title}</p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-base font-semibold tabular-nums text-slate-950">{result.priceFormatted}</td>
      <td className="whitespace-nowrap px-4 py-4">
        {result.rating === null ? (
          <span className="text-sm text-slate-500">Rating not listed</span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
            <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden="true" />
            <span>{rating}</span>
          </span>
        )}
      </td>
      <td className="max-w-[240px] px-4 py-4">
        <span className="inline-flex items-center gap-2 text-sm text-slate-600">
          <Truck className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span>{result.shippingText}</span>
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{result.availability}</td>
      <td className="whitespace-nowrap px-4 py-4 text-right">
        <a
          href={result.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${result.title} at ${result.retailer}`}
          className="inline-flex items-center gap-1.5 border border-emerald-800 px-3 py-2 text-sm font-semibold text-emerald-900 transition-colors hover:bg-emerald-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        >
          View deal
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </td>
    </tr>
  );
}
