'use client';

import React from 'react';
import { X, ArrowRight, Store, Plus } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { Button } from '@/components/ui/Button';
import { CompareModal } from './CompareModal';

export function CompareDock() {
  const { compareItems, removeFromCompare, clearCompare, setIsModalOpen } = useCompare();

  if (compareItems.length === 0) {
    return <CompareModal />;
  }

  const emptySlotsCount = Math.max(0, 3 - compareItems.length);

  return (
    <>
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] w-[calc(100%-2rem)] max-w-2xl transition-all duration-300 animate-slide-in"
        role="region"
        aria-label="Product comparison dock"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 rounded-2xl border border-border/80 bg-card/95 p-3.5 sm:p-4 shadow-saas-lg backdrop-blur-xl ring-1 ring-emerald-500/20">
          {/* Selected Products List */}
          <div className="flex items-center gap-2.5 overflow-x-auto w-full sm:w-auto py-0.5">
            {compareItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex items-center gap-2 rounded-xl border border-border bg-muted/40 py-1.5 pl-2 pr-2.5 text-xs font-medium text-foreground transition-all hover:border-emerald-500/40 hover:bg-muted/70 shrink-0"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border/80 bg-card p-0.5">
                  {item.faviconUrl ? (
                    <img src={item.faviconUrl} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <Store className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <div className="max-w-[90px] sm:max-w-[110px] truncate">
                  <span className="block truncate font-semibold text-[11px]">{item.retailer}</span>
                  <span className="block font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                    {item.price}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCompare(item.id);
                  }}
                  className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                  aria-label={`Remove ${item.retailer} offer`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Empty Slot Placeholders */}
            {Array.from({ length: emptySlotsCount }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="hidden md:flex items-center gap-1.5 rounded-xl border border-dashed border-border/70 px-3 py-2 text-[11px] text-muted-foreground/60 select-none shrink-0"
              >
                <Plus className="h-3 w-3" />
                <span>Add item</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors underline-offset-4 hover:underline"
            >
              Clear all
            </button>

            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              size="sm"
              className="btn-tactile inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              <span>Compare Side-by-Side</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-extrabold">
                {compareItems.length}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <CompareModal />
    </>
  );
}
