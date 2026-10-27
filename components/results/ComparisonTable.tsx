'use client';

import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ComparisonCard } from '@/components/results/ComparisonCard';
import { ResultRow } from '@/components/results/ResultRow';
import { SortableHeader } from '@/components/results/SortableHeader';
import { getLowestPrice } from '@/lib/utils';
import type { ParsedResult, SortConfig, SortField } from '@/types/search';

interface ComparisonTableProps {
  results: ParsedResult[];
  sort: SortConfig;
  onSort: (field: SortField) => void;
  loading?: boolean;
}

export function ComparisonTable({ results, sort, onSort, loading = false }: ComparisonTableProps) {
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const firstSort = useRef(true);
  const lowestPrice = useMemo(() => getLowestPrice(results), [results]);

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
                  onSort={onSort}
                />
                <SortableHeader
                  field="price"
                  label="Price"
                  activeField={sort.field}
                  activeDirection={sort.direction}
                  onSort={onSort}
                />
                <SortableHeader
                  field="rating"
                  label="Rating"
                  activeField={sort.field}
                  activeDirection={sort.direction}
                  onSort={onSort}
                />
                <SortableHeader
                  field="shipping"
                  label="Shipping"
                  activeField={sort.field}
                  activeDirection={sort.direction}
                  onSort={onSort}
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
                {results.map((result, index) => (
                  <ResultRow
                    key={`${result.productUrl}-${index}`}
                    result={result}
                    isLowest={result.price === lowestPrice}
                  />
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
          : results.map((result, index) => (
              <ComparisonCard
                key={`${result.productUrl}-${index}`}
                result={result}
                isLowest={result.price === lowestPrice}
              />
            ))}
      </div>
    </>
  );
}
