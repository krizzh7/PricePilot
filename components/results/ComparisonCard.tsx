'use client';

import { useState } from 'react';
import { ExternalLink, Star, Truck, Check, Store } from 'lucide-react';
import type { ParsedResult } from '@/types/search';
import { Button } from '@/components/ui/Button';
import { useCompare } from '@/context/CompareContext';

interface ComparisonCardProps {
  result: ParsedResult;
  index?: number;
}

export function ComparisonCard({ result, index = 0 }: ComparisonCardProps) {
  const [imgError, setImgError] = useState(false);
  const { toggleCompare, isComparing } = useCompare();
  const itemId = result.productUrl || `${result.retailer}-${result.price}`;
  const comparing = isComparing(itemId);
  const isLowest = index === 0;
  const rating =
    result.rating === null
      ? 'No rating'
      : `${result.rating.toFixed(1)}${result.reviewCount === null ? '' : ` (${result.reviewCount.toLocaleString()})`}`;

  return (
    <article
      className={`rounded-2xl border p-5 transition-all ${
        isLowest
          ? 'border-emerald-500/50 bg-card shadow-md ring-1 ring-emerald-500/20'
          : 'border-border/80 bg-card shadow-xs'
      }`}
      aria-label={`${result.retailer} offer, ${result.priceFormatted}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 p-1">
            {!imgError && result.faviconUrl ? (
              <img
                src={result.faviconUrl}
                alt=""
                className="h-full w-full object-contain"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <Store className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-foreground text-sm">{result.retailer}</h4>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{result.title}</p>
          </div>
        </div>
        {isLowest && (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            <Check className="h-3 w-3 stroke-[3]" />
            Lowest
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
          {result.priceFormatted}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">{result.availability || 'In Stock'}</div>
          <button
            type="button"
            onClick={() =>
              toggleCompare({
                id: itemId,
                title: result.title,
                price: result.priceFormatted,
                retailer: result.retailer,
                faviconUrl: result.faviconUrl,
                productUrl: result.productUrl,
                availability: result.availability,
                shippingText: result.shippingText,
                rating: result.rating,
                reviewCount: result.reviewCount,
              })
            }
            className={`pill-tactile rounded-lg px-2 py-0.5 text-[11px] font-semibold border transition-all ${
              comparing
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {comparing ? '✓ Compared' : '+ Compare'}
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 border-t border-border/50 pt-3 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
          <span>{rating}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>{result.shippingText || 'Free standard shipping'}</span>
        </p>
      </div>

      <Button asChild variant={isLowest ? 'primary' : 'secondary'} size="md" className="mt-4 w-full justify-center">
        <a href={result.productUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
          <span>View Deal</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </Button>
    </article>
  );
}
