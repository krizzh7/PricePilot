'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, Menu, ShoppingBag, X } from 'lucide-react';

export function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Main navigation">
        <Link href="/" className="inline-flex items-center gap-2.5" aria-label="PricePilot home">
          <ShoppingBag className="h-5 w-5 text-emerald-800" strokeWidth={1.8} aria-hidden="true" />
          <span className="text-base font-semibold tracking-tight text-slate-950">PricePilot</span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          <Link href="/search" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950">Compare prices</Link>
          {status === 'authenticated' ? (
            <>
              <span className="max-w-48 truncate text-sm text-slate-500">{session.user?.email}</span>
              <button onClick={() => void signOut({ callbackUrl: '/' })} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950">
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
              </button>
            </>
          ) : (
            <Link href="/auth" className="text-sm font-semibold text-emerald-900 transition-colors hover:text-emerald-700">Sign in / Sign up</Link>
          )}
        </div>

        <button className="p-2 text-slate-700 sm:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 sm:hidden">
          <Link href="/search" className="block py-2 text-sm font-medium text-slate-700" onClick={() => setMenuOpen(false)}>Compare prices</Link>
          {status === 'authenticated' ? (
            <button onClick={() => void signOut({ callbackUrl: '/' })} className="flex w-full items-center gap-2 py-2 text-left text-sm font-medium text-slate-700"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button>
          ) : (
            <Link href="/auth" className="block py-2 text-sm font-semibold text-emerald-900" onClick={() => setMenuOpen(false)}>Sign in / Sign up</Link>
          )}
        </div>
      )}
    </header>
  );
}
