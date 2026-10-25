'use client';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-muted shimmer" />
            <div className="h-4 w-20 rounded bg-muted shimmer" />
          </div>
          <div className="h-4 w-14 rounded-full bg-muted shimmer" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-4 w-5/6 rounded bg-muted shimmer" />
          <div className="h-4 w-3/4 rounded bg-muted shimmer" />
        </div>
        <div className="h-3 w-1/3 rounded bg-muted shimmer" />
      </div>

      <div className="pt-4 border-t border-border/50 space-y-3">
        <div className="h-7 w-28 rounded bg-muted shimmer" />
        <div className="h-3 w-40 rounded bg-muted shimmer" />
        <div className="h-10 w-full rounded-xl bg-muted shimmer" />
      </div>
    </div>
  );
}
