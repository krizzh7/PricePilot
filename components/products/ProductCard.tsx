'use client';

import { ExternalLink, Star, Truck, Check, Store } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ParsedResult } from '@/types/search';
import { useState } from 'react';
import { useCompare } from '@/context/CompareContext';
import { getOfferId, isInStock } from '@/lib/utils';

interface ProductCardProps {
  result: ParsedResult;
  isLowest?: boolean;
}

export function ProductCard({ result, isLowest = false }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const { toggleCompare, isComparing } = useCompare();
  const itemId = getOfferId(result);
  const comparing = isComparing(itemId);
  const ratingText = result.rating === null ? 'No rating' : `${result.rating.toFixed(1)}`;
  const inStock = isInStock(result.availability);

  return (
    <div className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
      isLowest
        ? 'border-emerald-500/50 bg-card shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20'
        : 'border-border/80 bg-card hover:border-border hover:shadow-xl hover:shadow-black/5'
    }`}>
      {/* Lowest Price Banner */}
      {isLowest && (
        <div className="absolute left-0 top-0 z-10">
          <div className="flex items-center gap-1 bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm rounded-br-xl">
            <Check className="h-3 w-3 stroke-[3]" />
            Lowest Price
          </div>
        </div>
      )}

      <div>
        {/* Retailer & Header Bar */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
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
              <span className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {result.retailer}
              </span>
            </div>

            <Badge variant={!inStock ? 'warning' : isLowest ? 'success' : 'secondary'} className="shrink-0 text-[10px]">
              {result.availability || 'In Stock'}
            </Badge>
          </div>

          {/* Product Title */}
          <h3
            className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
            title={result.title}
          >
            {result.title}
          </h3>

          {/* Ratings & Reviews */}
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            {result.rating !== null ? (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{ratingText}</span>
              </span>
            ) : (
              <span>No reviews</span>
            )}
            {result.reviewCount !== null ? (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span>{result.reviewCount.toLocaleString()} reviews</span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Footer Area: Price, Shipping & Action Button */}
      <div className="p-5 pt-3 border-t border-border/50 bg-muted/20">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase font-semibold text-muted-foreground">Price offer</div>
            <div className="text-2xl font-extrabold tracking-tight text-foreground font-mono">
              {result.priceFormatted}
            </div>
          </div>

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
            className={`pill-tactile rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
              comparing
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {comparing ? '✓ Compared' : '+ Compare'}
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Truck className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{result.shippingText || 'Shipping info at retailer'}</span>
        </div>

        <Button
          asChild
          variant={isLowest ? 'primary' : 'secondary'}
          size="md"
          className="w-full justify-center group/btn text-sm font-semibold shadow-xs"
        >
          <a
            href={result.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5"
          >
            <span>View Deal at {result.retailer}</span>
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
