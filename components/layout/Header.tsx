'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, Menu, ShoppingBag, X, ChevronDown, Compass, Sparkles, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const handleSignOut = async () => {
    setUserOpen(false);
    try {
      await signOut({ redirect: false });
      router.push('/');
      router.refresh();
    } catch {
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition-transform active:scale-95">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20 group-hover:shadow-emerald-600/40 transition-all duration-300">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            PricePilot
          </span>
        </Link>

        {/* Navigation Links with Smooth Hover Pills */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          <Link
            href="/search"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
          >
            <Compass className="h-4 w-4" />
            Compare
          </Link>
          <Link
            href="/#how-it-works"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/search?q=deals"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
          >
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Top Deals
          </Link>
        </nav>

        {/* User Account & Theme Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {status === 'authenticated' ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-border bg-card pl-1.5 pr-3 py-1 text-sm font-medium hover:bg-muted transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                aria-haspopup="menu"
                aria-expanded={userOpen}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 font-semibold text-xs">
                  {session.user?.email?.charAt(0).toUpperCase() ?? 'U'}
                </span>
                <span className="hidden sm:block max-w-36 truncate text-xs font-medium text-foreground">
                  {session.user?.email}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              {userOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-card shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  role="menu"
                >
                  <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border/60 mb-1">
                    Signed in as <br />
                    <span className="font-semibold text-foreground truncate block">{session.user?.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-all shadow-sm active:scale-95"
            >
              <User className="h-3.5 w-3.5" />
              Sign in
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card hover:bg-muted transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-t border-border bg-card/95 backdrop-blur-xl md:hidden">
          <nav className="container py-3 flex flex-col gap-1">
            <Link
              href="/search"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              <Compass className="h-4 w-4 text-emerald-600" />
              Compare Products
            </Link>
            <Link
              href="/#how-it-works"
              className="px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              How it works
            </Link>
            <Link
              href="/search?q=deals"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Top Deals
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
