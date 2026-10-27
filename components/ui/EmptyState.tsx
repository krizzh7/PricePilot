'use client';

import React from 'react';
import { PackageSearch, AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'error' | 'sparkles';
  actionLabel?: string;
  onAction?: () => void;
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
  className?: string;
}

export function EmptyState({
  title = 'No matching deals found',
  description = 'We couldn\'t find any verified merchant prices matching your criteria. Try adjusting your search or explore trending categories.',
  icon = 'search',
  actionLabel,
  onAction,
  suggestions = ['Lenovo Legion', 'AirPods Pro', 'PS5 Slim', 'iPad Air'],
  onSelectSuggestion,
  className,
}: EmptyStateProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'error':
        return (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
            <AlertCircle className="h-7 w-7" aria-hidden="true" />
          </div>
        );
      case 'sparkles':
        return (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
            <Sparkles className="h-7 w-7" aria-hidden="true" />
          </div>
        );
      case 'search':
      default:
        return (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/70 text-muted-foreground ring-1 ring-border">
            <PackageSearch className="h-7 w-7" aria-hidden="true" />
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-lg rounded-2xl border border-border/80 bg-card/95 p-8 sm:p-10 text-center shadow-saas',
        className
      )}
    >
      <div className="mx-auto flex justify-center mb-5">{renderIcon()}</div>

      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {/* Action CTA */}
      {actionLabel && onAction && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onAction}
            variant="primary"
            size="md"
            className="btn-tactile inline-flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {actionLabel}
          </Button>
        </div>
      )}

      {/* Quick Suggestions / Trending Pills */}
      {suggestions && suggestions.length > 0 && onSelectSuggestion && (
        <div className="mt-8 border-t border-border/60 pt-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
            Popular Searches
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSelectSuggestion(item)}
                className="pill-tactile rounded-full border border-border bg-muted/50 px-3.5 py-1 text-xs font-medium text-foreground hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                &ldquo;{item}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
