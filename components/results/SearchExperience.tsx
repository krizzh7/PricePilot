'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Clock3, Info, RotateCw, Search as SearchIcon } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { ComparisonCard } from '@/components/results/ComparisonCard';
import { ComparisonTable } from '@/components/results/ComparisonTable';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import type { ParsedResult, SearchResponse } from '@/types/search';

type SearchError = { message: string; retryAfter?: string } | null;

interface SearchExperienceProps {
  initialQuery: string;
}

export function SearchExperience({ initialQuery }: SearchExperienceProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ParsedResult[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(initialQuery));
  const [error, setError] = useState<SearchError>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const loadedQueryRef = useRef('');

  const loadResults = useCallback(async (value: string) => {
    const nextQuery = value.trim().slice(0, 200);
    if (!nextQuery) return;

    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setQuery(nextQuery);
    loadedQueryRef.current = nextQuery;
    setIsLoading(true);
    setError(null);
    setTruncated(value.trim().length > 200);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(nextQuery)}`, {
        signal: controller.signal,
        cache: 'no-store',
      });
      const payload = await response.json();

      if (!response.ok) {
        setResults([]);
        setError({
          message: payload.error || 'Unable to fetch prices. Please try again in a moment.',
          retryAfter: payload.retryAfter ? String(payload.retryAfter) : undefined,
        });
        return;
      }

      const data = payload as SearchResponse;
      setResults(data.results);
      setIsDemo(data.demo);
      setTruncated((current) => current || Boolean(data.truncated));
    } catch (cause) {
      if (cause instanceof Error && cause.name === 'AbortError') return;
      setResults([]);
      setError({ message: 'Unable to fetch prices. Please check your connection and try again.' });
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery && loadedQueryRef.current !== initialQuery) void loadResults(initialQuery);
    return () => requestRef.current?.abort();
  }, [initialQuery, loadResults]);

  const handleSearch = (value: string) => {
    const nextQuery = value.trim().slice(0, 200);
    if (!nextQuery) return;
    router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
    void loadResults(value);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <a href="/" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Home
            </a>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Compare offers</h1>
            <p className="mt-2 text-sm text-slate-600">Prices and seller details from Google Shopping results.</p>
          </div>
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Offers may change at the retailer
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <SearchBar key={query} initialQuery={query} onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {truncated && (
          <p className="mb-4 text-sm text-amber-700" role="status">Search shortened to 200 characters.</p>
        )}

        {isDemo && !isLoading && !error && (
          <div className="mb-5 flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="status">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p><span className="font-semibold">Sample data, not live prices.</span> Add a SerpApi key in `.env.local` to search Google Shopping.</p>
          </div>
        )}

        {isLoading && (
          <section aria-label="Loading price comparisons" aria-live="polite">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-4 w-44 rounded bg-slate-200 shimmer" />
              <div className="h-4 w-24 rounded bg-slate-200 shimmer" />
            </div>
            <div className="hidden md:block">
              <ComparisonTable results={[]} loading />
            </div>
            <div className="space-y-3 md:hidden">
              <Skeleton variant="card" count={4} />
            </div>
          </section>
        )}

        {!isLoading && error && (
          <section className="mx-auto mt-14 max-w-lg border border-slate-200 bg-white p-8 text-center" role="alert">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <AlertCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-slate-950">Prices are unavailable right now</h2>
            <p className="mt-2 text-sm text-slate-600">{error.message}</p>
            {error.retryAfter && <p className="mt-1 text-xs text-slate-500">Try again in {error.retryAfter} seconds.</p>}
            <Button className="mt-6" onClick={() => void loadResults(query)}>
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
          </section>
        )}

        {!isLoading && !error && query && results.length === 0 && (
          <section className="mx-auto mt-14 max-w-lg border border-slate-200 bg-white p-8 text-center">
            <SearchIcon className="mx-auto mb-4 h-8 w-8 text-slate-400" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-slate-950">No offers found</h2>
            <p className="mt-2 text-sm text-slate-600">No trusted retailer offers were returned for “{query}”. Try another product name.</p>
          </section>
        )}

        {!isLoading && !error && results.length > 0 && (
          <section aria-label={`Price offers for ${query}`}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-950">{results.length}</span> offers for <span className="font-semibold text-slate-950">{query}</span>
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">Lowest price first</p>
            </div>
            <div className="hidden md:block">
              <ComparisonTable results={results} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
              {[...results].sort((a, b) => a.price - b.price).map((result, index) => (
                <ComparisonCard key={`${result.productUrl}-${index}`} result={result} index={index} />
              ))}
            </div>
          </section>
        )}

        {!initialQuery && !query && !isLoading && (
          <section className="mt-16 text-center">
            <p className="text-sm font-medium text-slate-500">Start with a product name</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Find an offer worth a closer look.</h2>
          </section>
        )}
      </main>
    </div>
  );
}
