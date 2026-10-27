'use client';

import { useState } from 'react';
import { ExternalLink, Star, Truck, Store, Check } from 'lucide-react';
import type { ParsedResult } from '@/types/search';
import { isInStock } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ResultRowProps {
  result: ParsedResult;
  isLowest?: boolean;
}

export function ResultRow({ result, isLowest = false }: ResultRowProps) {
  const [imgError, setImgError] = useState(false);
  const rating =
    result.rating === null
      ? 'No rating'
      : `${result.rating.toFixed(1)}${result.reviewCount === null ? '' : ` (${result.reviewCount.toLocaleString()})`}`;
  const inStock = isInStock(result.availability);

  return (
    <tr
      data-offer-row
      className={`border-t border-border/70 transition-colors hover:bg-muted/40 ${
        isLowest ? 'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05]' : ''
      }`}
    >
      {/* Retailer & Title */}
      <td className="max-w-[320px] px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 p-1">
            {!imgError && result.faviconUrl ? (
              <img
                src={result.faviconUrl}
                alt={result.retailer}
                className="h-full w-full object-contain"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <Store className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold text-foreground text-sm">{result.retailer}</span>
              {isLowest && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                  Lowest
                </span>
              )}
            </div>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground" title={result.title}>
              {result.title}
            </p>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="whitespace-nowrap px-5 py-4 text-base font-bold tabular-nums text-foreground font-mono">
        <span className={isLowest ? 'text-emerald-600 dark:text-emerald-400' : ''}>
          {result.priceFormatted}
        </span>
      </td>

      {/* Rating */}
      <td className="whitespace-nowrap px-5 py-4">
        {result.rating === null ? (
          <span className="text-xs text-muted-foreground">Not rated</span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-foreground font-medium">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span>{rating}</span>
          </span>
        )}
      </td>

      {/* Shipping */}
      <td className="max-w-[200px] px-5 py-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Truck className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span className="truncate">{result.shippingText || 'Shipping info at retailer'}</span>
        </span>
      </td>

      {/* Availability */}
      <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          {result.availability || 'In Stock'}
        </span>
      </td>

      {/* Action CTA */}
      <td className="whitespace-nowrap px-5 py-4 text-right">
        <Button
          asChild
          variant={isLowest ? 'primary' : 'secondary'}
          size="sm"
          className="rounded-lg shadow-xs"
        >
          <a
            href={result.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View deal at ${result.retailer}`}
            className="inline-flex items-center gap-1.5"
          >
            <span>View Deal</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </Button>
      </td>
    </tr>
  );
}
