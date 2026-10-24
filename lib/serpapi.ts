import type { SearchResponse, SerpApiShoppingResult } from '@/types/search';
import { getMockResults, parseSerpApiResults } from '@/lib/utils';

const SERPAPI_URL = 'https://serpapi.com/search.json';
const REQUEST_TIMEOUT_MS = 10_000;

export async function searchProducts(query: string): Promise<SearchResponse> {
  const apiKey = process.env.SERPAPI_KEY;
  const timestamp = new Date().toISOString();

  if (!apiKey) {
    return { results: getMockResults(query), query, timestamp, demo: true };
  }

  const params = new URLSearchParams({
    engine: 'google_shopping',
    q: query,
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
      throw new SearchProviderError('UPSTREAM_ERROR', String(response.status));
    }

    const payload: { error?: string; shopping_results?: SerpApiShoppingResult[] } = await response.json();
    if (payload.error) {
      throw new SearchProviderError('UPSTREAM_ERROR', payload.error);
    }

    return {
      results: parseSerpApiResults(Array.isArray(payload.shopping_results) ? payload.shopping_results : []),
      query,
      timestamp: new Date().toISOString(),
      demo: false,
    };
  } catch (error) {
    if (error instanceof SearchProviderError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new SearchProviderError('TIMEOUT');
    }
    throw new SearchProviderError('NETWORK_ERROR');
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
