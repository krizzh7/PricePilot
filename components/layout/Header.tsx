'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, Menu, ShoppingBag, X, ChevronDown, Compass, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { href: '/search', label: 'Compare', icon: Compass },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#testimonials', label: 'Reviews' },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const isAuthenticated = status === 'authenticated';

  // Reset transient UI on navigation
  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userOpen && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setUserOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [userOpen, menuOpen]);

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

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <div className="container flex h-16 items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          aria-label="PricePilot home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-600/25 transition-shadow duration-200 group-hover:shadow-md group-hover:shadow-emerald-600/35">
            <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-foreground">
            PricePilot
          </span>
        </Link>

        {/* Desktop navigation with active indicator */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary navigation">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                  active
                    ? 'font-semibold text-foreground'
                    : 'font-medium text-muted-foreground hover:text-foreground'
                }`}
              >
                {Icon && <Icon className={`h-4 w-4 ${active ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />}
                {label}
                {/* Active dot marker */}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-px left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-500 transition-opacity duration-200 ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen((o) => !o)}
                onBlur={(e) => {
                  if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
                    setUserOpen(false);
                  }
                }}
                className="flex items-center gap-2 rounded-full border border-border bg-card pl-1.5 pr-3 py-1 text-sm font-medium transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                aria-haspopup="menu"
                aria-expanded={userOpen}
                aria-label="Account menu"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/10 font-semibold text-xs text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  {session.user?.email?.charAt(0).toUpperCase() ?? 'U'}
                </span>
                <span className="hidden max-w-32 truncate text-xs font-medium text-foreground sm:block">
                  {session.user?.email}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${userOpen ? 'rotate-180' : ''}`} />
              </button>

              {userOpen && (
                <div
                  className="animate-drawer-in absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card p-1.5 z-50 shadow-lg"
                  role="menu"
                >
                  <div className="mb-1 border-b border-border/60 px-3 py-2 text-xs text-muted-foreground">
                    Signed in as
                    <span className="block truncate font-semibold text-foreground">{session.user?.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
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
              className="hidden rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-500 sm:inline-flex sm:items-center sm:gap-1.5 btn-tactile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2"
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              Sign in
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="animate-drawer-in border-t border-border bg-card/95 backdrop-blur-xl md:hidden"
        >
          <nav className="container flex flex-col gap-1 py-3" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-3 text-[15px] font-medium transition-colors ${
                  isActive(href)
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {Icon && <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                {label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                href="/auth"
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500 sm:hidden"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
