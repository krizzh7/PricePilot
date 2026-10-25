'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ComparisonCard } from '@/components/results/ComparisonCard';
import { ResultRow } from '@/components/results/ResultRow';
import { SortableHeader } from '@/components/results/SortableHeader';
import type { ParsedResult, SortConfig, SortField } from '@/types/search';

interface ComparisonTableProps {
  results: ParsedResult[];
  loading?: boolean;
}

const DEFAULT_DIRECTION: Record<SortField, SortConfig['direction']> = {
  retailer: 'asc',
  price: 'asc',
  rating: 'desc',
  shipping: 'asc',
};

function compareKnownValues(a: number | null, b: number | null, direction: SortConfig['direction']) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return direction === 'asc' ? a - b : b - a;
}

export function ComparisonTable({ results, loading = false }: ComparisonTableProps) {
  const [sort, setSort] = useState<SortConfig>({ field: 'price', direction: 'asc' });
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const firstSort = useRef(true);

  const sorted = useMemo(() => {
    return [...results].sort((a, b) => {
      if (sort.field === 'retailer') {
        const order = a.retailer.localeCompare(b.retailer, undefined, { sensitivity: 'base' });
        return sort.direction === 'asc' ? order : -order;
      }

      const left =
        sort.field === 'price'
          ? a.price
          : sort.field === 'rating'
          ? a.rating
          : a.shippingDays;
      const right =
        sort.field === 'price'
          ? b.price
          : sort.field === 'rating'
          ? b.rating
          : b.shippingDays;
      return compareKnownValues(left, right, sort.direction);
    });
  }, [results, sort]);

  useEffect(() => {
    if (firstSort.current) {
      firstSort.current = false;
      return;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !bodyRef.current) return;
    gsap.fromTo(
      bodyRef.current.querySelectorAll('[data-offer-row]'),
      { y: 6, opacity: 0.65 },
      { y: 0, opacity: 1, duration: 0.18, stagger: 0.02, ease: 'power2.out', clearProps: 'all' }
    );
  }, [sort]);

  const handleSort = (field: SortField) => {
    setSort((current) => ({
      field,
      direction:
        current.field === field
          ? current.direction === 'asc'
            ? 'desc'
            : 'asc'
          : DEFAULT_DIRECTION[field],
    }));
  };

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <SortableHeader
                  field="retailer"
                  label="Retailer & Offer"
                  activeField={sort.field}
                  activeDirection={sort.direction}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="price"
                  label="Price"
                  activeField={sort.field}
                  activeDirection={sort.direction}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="rating"
                  label="Rating"
                  activeField={sort.field}
                  activeDirection={sort.direction}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="shipping"
                  label="Shipping"
                  activeField={sort.field}
                  activeDirection={sort.direction}
                  onSort={handleSort}
                />
                <th
                  scope="col"
                  className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Availability
                </th>
                <th
                  scope="col"
                  className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Direct Link
                </th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                {Array.from({ length: 5 }, (_, index) => (
                  <tr key={index} className="h-[72px] border-t border-border/60">
                    {Array.from({ length: 6 }, (_, cell) => (
                      <td key={cell} className="px-5 py-4">
                        <div className="h-4 w-full rounded bg-muted shimmer" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody ref={bodyRef} className="divide-y divide-border/60">
                {sorted.map((result, index) => (
                  <ResultRow key={`${result.productUrl}-${index}`} result={result} index={index} />
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Mobile Card Fallback */}
      <div className="space-y-3 md:hidden">
        {loading
          ? Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-44 rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="h-4 w-32 rounded bg-muted shimmer" />
                <div className="h-6 w-24 rounded bg-muted shimmer" />
                <div className="h-10 w-full rounded-xl bg-muted shimmer" />
              </div>
            ))
          : sorted.map((result, index) => (
              <ComparisonCard key={`${result.productUrl}-${index}`} result={result} index={index} />
            ))}
      </div>
    </>
  );
}
