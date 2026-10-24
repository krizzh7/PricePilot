import { SearchExperience } from '@/components/results/SearchExperience';

export const dynamic = 'force-dynamic';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return <SearchExperience initialQuery={searchParams.q?.slice(0, 200) ?? ''} />;
}
