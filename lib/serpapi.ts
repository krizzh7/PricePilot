import type { SearchResponse, SerpApiShoppingResult } from '@/types/search';
import { getMockResults, parseSerpApiResults } from '@/lib/utils';

const SERPAPI_URL = 'https://serpapi.com/search.json';
const REQUEST_TIMEOUT_MS = 12_000;

export async function searchProducts(query: string): Promise<SearchResponse> {
  const apiKey = process.env.SERPAPI_KEY;
  const timestamp = new Date().toISOString();

  // If query is specifically looking for "deals" or "top deals", search for popular electronics deals
  const isDealsQuery = /^(top\s*)?deals$/i.test(query.trim());
  const effectiveQuery = isDealsQuery ? 'electronics deals' : query;

  if (!apiKey) {
    return { results: getMockResults(query), query, timestamp, demo: true };
  }

  const params = new URLSearchParams({
    engine: 'google_shopping',
    q: effectiveQuery,
    gl: 'us',
    hl: 'en',
    api_key: apiKey,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${SERPAPI_URL}?${params.toString()}`, {
      signal: controller.signal,
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      throw new SearchProviderError('RATE_LIMITED', retryAfter || '60');
    }

    if (!response.ok) {
      // Fallback to sample data instead of breaking user flow
      return { results: getMockResults(query), query, timestamp, demo: true };
    }

    const payload: { error?: string; shopping_results?: SerpApiShoppingResult[] } = await response.json();

    if (payload.error) {
      // Google Shopping returning no results for this query is a normal zero-result condition, NOT a server error!
      const errorMsg = String(payload.error).toLowerCase();
      if (errorMsg.includes("hasn't returned any results") || errorMsg.includes("no results") || errorMsg.includes("not found")) {
        // If it was a generic deals query, return curated deals
        if (isDealsQuery) {
          return { results: getMockResults('Featured Trending Deals'), query, timestamp, demo: true };
        }
        return { results: [], query, timestamp, demo: false };
      }
      // For any other unexpected error, fallback gracefully to mock results so the UI never displays "Unable to load prices"
      return { results: getMockResults(query), query, timestamp, demo: true };
    }

    const rawShopping = Array.isArray(payload.shopping_results) ? payload.shopping_results : [];
    const parsed = parseSerpApiResults(rawShopping);

    // If Google Shopping returned results but none could be parsed or was empty, provide friendly fallback
    if (parsed.length === 0 && isDealsQuery) {
      return { results: getMockResults('Featured Tech Deals'), query, timestamp, demo: true };
    }

    return {
      results: parsed,
      query,
      timestamp,
      demo: false,
    };
  } catch (error) {
    if (error instanceof SearchProviderError && error.code === 'RATE_LIMITED') {
      throw error;
    }
    // Graceful fallback on network timeout or abort
    return { results: getMockResults(query), query, timestamp, demo: true };
  } finally {
    clearTimeout(timeout);
  }
}

export class SearchProviderError extends Error {
  constructor(
    public readonly code: 'RATE_LIMITED' | 'UPSTREAM_ERROR' | 'TIMEOUT' | 'NETWORK_ERROR',
    public readonly detail?: string,
  ) {
    super(code);
    this.name = 'SearchProviderError';
  }
}
