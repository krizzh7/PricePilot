'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-center px-5 py-20 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
              <span className="h-px w-8 bg-emerald-600" aria-hidden="true" />
              Price research, made simple
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-8xl">
              Find the right offer.<br />
              <span className="text-emerald-700">Keep more money.</span>
            </h1>
            <p className="mt-10 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Search a product once. Compare prices from trusted retailers side by side, then choose where to buy.
            </p>

            <div className="mt-10 max-w-2xl">
              <SearchBar onSearch={handleSearch} />
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Search suggestions come from a small local catalog. Price results are fetched on search; sample results are labeled when live data is unavailable.
              </p>
            </div>

            <div className="mt-6">
              <a href="/search" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                Or browse all comparisons
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200 pt-5 text-xs font-medium text-slate-500">
              <span>Electronics</span>
              <span>Computing</span>
              <span>Home</span>
              <span>Audio</span>
              <span>And more</span>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 text-xs text-slate-500 sm:flex-row">
          <span>PricePilot · Compare before you buy.</span>
          <span>Prices and availability can change at the retailer.</span>
        </div>
      </footer>
    </div>
  );
}
