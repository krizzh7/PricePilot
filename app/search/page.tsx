import { SearchExperience } from '@/components/results/SearchExperience';

export const dynamic = 'force-dynamic';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string | string[] };
}) {
  // `?q=a&q=b` yields an array; always pass a single bounded string.
  const rawQuery = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;

  return <SearchExperience initialQuery={rawQuery?.slice(0, 200) ?? ''} />;
}
