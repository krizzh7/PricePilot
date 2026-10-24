import { SearchProviderError, searchProducts } from '@/lib/serpapi';
import { searchQuerySchema } from '@/lib/validations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawQuery = url.searchParams.get('q');

  let query: string;
  try {
    query = searchQuerySchema.parse(rawQuery);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Please enter a product name' },
      { status: 400 },
    );
  }

  try {
    const response = await searchProducts(query);
    return Response.json({ ...response, truncated: Boolean(rawQuery && rawQuery.trim().length > 200) }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (error instanceof SearchProviderError) {
      if (error.code === 'RATE_LIMITED') {
        const retryAfter = error.detail || '60';
        return Response.json(
          { error: 'SerpApi request limit reached.', retryAfter },
          { status: 429, headers: { 'Retry-After': retryAfter } },
        );
      }

      const status = error.code === 'TIMEOUT' ? 504 : 502;
      return Response.json(
        { error: 'Unable to fetch prices. Please try again in a moment.' },
        { status },
      );
    }

    return Response.json(
      { error: 'Unable to fetch prices. Please try again in a moment.' },
      { status: 500 },
    );
  }
}
