'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { ArrowRight, ShoppingBag, Check, Star, Shield } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onAuthClick={() => setIsAuthOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjMwLDI0MiwyNDEsMC4wNSkiLz48L3N2Zz4=')] bg-repeat pointer-events-none" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 mb-6">
                <Star className="h-3.5 w-3.5 fill-emerald-600" />
                <span>Compare prices instantly</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Find the best deals <br />
                <span className="text-emerald-600">without the hassle</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-lg">
                Search any product and compare prices from top retailers like Amazon, Walmart, Best Buy, and more. All in one place.
              </p>
              
              <div className="mt-8 max-w-xl">
                <SearchBar onSearch={handleSearch} />
                <p className="mt-3 text-xs text-slate-500">
                  Real prices from trusted retailers. No sign-up required to search.
                </p>
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Real-time prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>No ads</span>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-blue-50 rounded-2xl transform rotate-2" />
              <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">PricePilot</p>
                    <p className="text-xs text-slate-500">Your price comparison companion</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-slate-200" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Lenovo Legion Pro</p>
                        <p className="text-xs text-slate-500">Amazon</p>
                      </div>
                    </div>
                    <p className="font-semibold text-emerald-600">$1,299</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-slate-200" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Lenovo Legion Pro</p>
                        <p className="text-xs text-slate-500">Best Buy</p>
                      </div>
                    </div>
                    <p className="font-semibold text-emerald-600">$1,349</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-slate-200" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Lenovo Legion Pro</p>
                        <p className="text-xs text-slate-500">Walmart</p>
                      </div>
                    </div>
                    <p className="font-semibold text-emerald-600">$1,379</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <p className="text-sm font-medium text-slate-900">Cheapest: $1,299</p>
                  <p className="text-xs text-slate-500">Save up to $80</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-950 mb-4">Why PricePilot?</h2>
            <p className="text-slate-600">We help you find the best prices without the hassle of checking multiple sites.</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950 mb-2">Trusted Retailers</h3>
              <p className="text-slate-600 text-sm">Compare prices from top retailers like Amazon, Walmart, Best Buy, and more.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950 mb-2">Real-time Prices</h3>
              <p className="text-slate-600 text-sm">Get the latest prices directly from Google Shopping results.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950 mb-2">Best Deal First</h3>
              <p className="text-slate-600 text-sm">Results are automatically sorted to show you the cheapest options first.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to find your next deal?</h2>
          <p className="text-emerald-100 text-lg mb-8">Join thousands of shoppers who save money with PricePilot every day.</p>
          <button onClick={() => setIsAuthOpen(true)} className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
            Get Started for Free
          </button>
        </div>
      </section>
      
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-slate-950">PricePilot</span>
              </div>
              <p className="text-sm text-slate-500">Compare prices across top retailers and find the best deals instantly.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-950 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-emerald-600">Features</a></li>
                <li><a href="#" className="hover:text-emerald-600">Retailers</a></li>
                <li><a href="#" className="hover:text-emerald-600">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-950 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-emerald-600">About</a></li>
                <li><a href="#" className="hover:text-emerald-600">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-600">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-950 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-emerald-600">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-600">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            <p>© 2026 PricePilot. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal (simplified - would normally be a separate component) */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={() => setIsAuthOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-950 mb-2">Welcome to PricePilot</h2>
              <p className="text-slate-600">Sign in to save your favorite deals and get personalized recommendations.</p>
            </div>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 px-4 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300" /></div>
                <div className="relative text-center"><span className="bg-white px-2 text-sm text-slate-500">Or continue with</span></div>
              </div>
              <button onClick={() => window.location.href = '/auth'} className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                Email / Password
              </button>
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
            <button onClick={() => setIsAuthOpen(false)} className="mt-4 w-full text-sm text-slate-500 hover:text-slate-700">
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
