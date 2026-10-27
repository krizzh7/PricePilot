'use client';

import { useEffect } from 'react';
import { X, ExternalLink, Star, Store } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { Button } from '@/components/ui/Button';

// Tailwind cannot see interpolated class names, so keep the column counts as
// complete literal class strings.
const COLUMN_CLASSES: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
};

export function CompareModal() {
  const { compareItems, isModalOpen, setIsModalOpen, removeFromCompare, clearCompare } = useCompare();
  const isOpen = isModalOpen && compareItems.length > 0;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsModalOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, setIsModalOpen]);

  if (!isOpen) return null;

  const columnClass = COLUMN_CLASSES[Math.min(compareItems.length, 3)] ?? COLUMN_CLASSES[3];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-border/80 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/70">
          <div>
            <h3 id="compare-modal-title" className="text-xl font-bold tracking-tight text-foreground">
              Side-by-Side Product Comparison
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comparing {compareItems.length} selected offers in real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors mr-2 font-medium"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              aria-label="Close comparison"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Comparison Columns Grid */}
        <div className="mt-6 overflow-y-auto flex-1 pr-1">
          <div className={`grid grid-cols-1 ${columnClass} gap-4`}>
            {compareItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-muted/20 p-5 shadow-xs transition-all relative"
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCompare(item.id)}
                  className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Remove from comparison"
                  aria-label={`Remove ${item.retailer} from comparison`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div>
                  {/* Retailer badge */}
                  <div className="flex items-center gap-2 mb-2 pr-6">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-card p-1">
                      {item.faviconUrl ? (
                        <img src={item.faviconUrl} alt="" className="h-full w-full object-contain" />
                      ) : (
                        <Store className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {item.retailer}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-semibold text-foreground text-sm line-clamp-2 min-h-[40px]">
                    {item.title}
                  </h4>

                  {/* Price */}
                  <div className="mt-4 pb-3 border-b border-border/60">
                    <span className="text-xs uppercase font-semibold text-muted-foreground block">
                      Price Offer
                    </span>
                    <span className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
                      {item.price}
                    </span>
                  </div>

                  {/* Specs / Attributes List */}
                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Availability</span>
                      <span className="font-medium text-foreground">{item.availability || 'In Stock'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400 truncate max-w-[140px]">
                        {item.shippingText || 'Shipping info at retailer'}
                      </span>
                    </div>

                    {typeof item.rating === 'number' && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rating</span>
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* View deal button */}
                <div className="mt-6 pt-3 border-t border-border/50">
                  <Button asChild variant="primary" size="md" className="w-full justify-center btn-tactile">
                    <a
                      href={item.productUrl || `https://www.google.com/search?q=${encodeURIComponent(item.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      <span>View at {item.retailer}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
