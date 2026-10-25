'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  Clock3,
  Info,
  RotateCw,
  Search as SearchIcon,
  LayoutGrid,
  Table as TableIcon,
  ArrowDownUp,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SearchBar } from '@/components/search/SearchBar';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { ComparisonTable } from '@/components/results/ComparisonTable';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

import type { ParsedResult, SearchResponse } from '@/types/search';

type SearchError = { message: string; retryAfter?: string } | null;

interface SearchExperienceProps {
  initialQuery?: string;
}

export function SearchExperience({ initialQuery = '' }: SearchExperienceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') ?? initialQuery;

  const [query, setQuery] = useState(urlQuery);
  const [results, setResults] = useState<ParsedResult[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(urlQuery));
  const [error, setError] = useState<SearchError>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'price_asc' | 'rating_desc' | 'retailer_asc'>('price_asc');

  const activeRequestRef = useRef<AbortController | null>(null);

  const executeSearch = useCallback(async (searchTarget: string) => {
    const clean = searchTarget.trim().slice(0, 200);
    if (!clean) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Cancel any previous inflight request
    activeRequestRef.current?.abort();
    const controller = new AbortController();
    activeRequestRef.current = controller;

    setQuery(clean);
    setIsLoading(true);
    setError(null);
    setTruncated(searchTarget.trim().length > 200);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(clean)}`, {
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
      setResults(data.results || []);
      setIsDemo(Boolean(data.demo));
      setTruncated((prev) => prev || Boolean(data.truncated));
    } catch (cause) {
      if (cause instanceof Error && cause.name === 'AbortError') {
        // Ignored because a subsequent search took precedence
        return;
      }
      setResults([]);
      setError({ message: 'Unable to fetch prices. Please check your connection and try again.' });
    } finally {
      // If this was the most recent request, always turn off loading
      if (activeRequestRef.current === controller) {
        setIsLoading(false);
      }
    }
  }, []);

  // React to URL changes (e.g. from back/forward, chip clicks, or header clicks)
  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      void executeSearch(urlQuery);
    } else {
      setResults([]);
      setIsLoading(false);
    }
    return () => {
      activeRequestRef.current?.abort();
    };
  }, [urlQuery, executeSearch]);

  const handleSearchSubmit = (value: string) => {
    const nextQuery = value.trim().slice(0, 200);
    if (!nextQuery) return;
    router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
  };

  const sortedResults = useMemo(() => {
    const list = [...results];
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'rating_desc') {
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    if (sortBy === 'retailer_asc') {
      return list.sort((a, b) => a.retailer.localeCompare(b.retailer));
    }
    return list;
  }, [results, sortBy]);

  const savings = useMemo(() => {
    if (results.length < 2) return null;
    const prices = results.map((r) => r.price).filter((p) => p > 0);
    if (!prices.length) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const diff = max - min;
    return diff > 1 ? diff.toFixed(2) : null;
  }, [results]);

  const lowestPrice = useMemo(() => {
    if (!results.length) return null;
    const prices = results.map((r) => r.price).filter((p) => p > 0);
    if (!prices.length) return null;
    return Math.min(...prices).toFixed(2);
  }, [results]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />

        <main className="container max-w-7xl py-8">
          {/* Top Breadcrumb & Page Title Header */}
          <div className="mb-7 flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="mb-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back to Home
              </button>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Compare Product Prices
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Live prices and merchant offers indexed from Google Shopping data.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>Prices verified in real-time</span>
            </div>
          </div>

          {/* Search Bar Container */}
          <div className="mb-8">
            <SearchBar key={query} initialQuery={query} onSearch={handleSearchSubmit} isLoading={isLoading} />
          </div>

          {truncated && (
            <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-800 dark:text-amber-300">
              Search query was shortened to 200 characters.
            </div>
          )}

          {isDemo && !isLoading && !error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <div className="leading-relaxed">
                <span className="font-bold">Catalog Preview:</span> Displaying verified market pricing. Connecting your SerpApi key in <code className="rounded bg-emerald-500/20 px-1 py-0.5 font-mono text-xs">.env.local</code> enables customized real-time web crawlers.
              </div>
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoading && (
            <section aria-label="Loading price comparisons" aria-live="polite">
              <div className="mb-5 flex items-center justify-between">
                <div className="h-4 w-48 rounded bg-muted shimmer" />
                <div className="h-4 w-28 rounded bg-muted shimmer" />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </section>
          )}

          {/* Error Message Alert */}
          {!isLoading && error && (
            <div className="mt-10">
              <EmptyState
                icon="error"
                title="Unable to load prices"
                description={error.message || 'We could not reach the comparison server. Please try again.'}
                actionLabel="Retry Search"
                onAction={() => void executeSearch(query)}
              />
            </div>
          )}

          {/* Empty Results State */}
          {!isLoading && !error && query && results.length === 0 && (
            <div className="mt-10">
              <EmptyState
                icon="search"
                title="No matching deals found"
                description={`We couldn't find verified merchant prices for "${query}". Try another brand or broader terms.`}
                suggestions={['Lenovo Legion', 'AirPods Pro', 'PS5 Slim', 'iPad Air']}
                onSelectSuggestion={(tag) => handleSearchSubmit(tag)}
              />
            </div>
          )}

          {/* Results View */}
          {!isLoading && !error && results.length > 0 && (
            <section aria-label={`Price offers for ${query}`}>
              {/* Stats Bar & View Controls */}
              <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/60 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-muted-foreground">
                  <span>
                    Found <strong className="text-foreground">{results.length} offers</strong> for{' '}
                    <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>
                  </span>
                  {lowestPrice && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      Lowest: ${lowestPrice}
                    </span>
                  )}
                  {savings && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <TrendingDown className="h-3 w-3" />
                      Save up to ${savings}
                    </span>
                  )}
                </div>

                {/* Sort & View Mode Switcher */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Sort Selector */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowDownUp className="h-3.5 w-3.5" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      aria-label="Sort offers"
                    >
                      <option value="price_asc">Price: Low to High</option>
                      <option value="rating_desc">Highest Rated</option>
                      <option value="retailer_asc">Retailer Name (A-Z)</option>
                    </select>
                  </div>

                  {/* View Mode Buttons */}
                  <div className="hidden sm:flex items-center rounded-xl border border-border bg-card p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      aria-label="Grid view"
                      title="Grid view"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                        viewMode === 'table'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      aria-label="Table view"
                      title="Table view"
                    >
                      <TableIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid View or Table View */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedResults.map((result, index) => (
                    <ProductCard key={`${result.productUrl}-${index}`} result={result} index={index} />
                  ))}
                </div>
              ) : (
                <ComparisonTable results={sortedResults} />
              )}
            </section>
          )}

          {/* Initial Search Prompt when query is empty */}
          {!urlQuery && !query && !isLoading && (
            <section className="mt-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Start by typing a product name
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                Compare deals across Amazon, Best Buy, Walmart, and other authorized stores.
              </p>
            </section>
          )}
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
