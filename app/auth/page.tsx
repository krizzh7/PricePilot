'use client';

import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import Link from 'next/link';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.96, opacity: 0, y: 12 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between p-4 selection:bg-emerald-500/20">
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[550px] rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/15" />

      {/* Top Header Row with Back Button and Theme Toggle */}
      <div className="container flex items-center justify-between py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <ThemeToggle />
      </div>

      {/* Center Auth Card */}
      <div className="flex items-center justify-center py-8">
        <section
          ref={cardRef}
          className="w-full max-w-md rounded-3xl border border-border/80 bg-card/90 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/5"
          aria-labelledby="auth-title"
        >
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>
            <h1 id="auth-title" className="text-2xl font-extrabold tracking-tight text-foreground">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {isSignUp
                ? 'Save your searches and track price reductions'
                : 'Sign in to access your PricePilot preferences'}
            </p>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="mb-6 grid grid-cols-2 rounded-xl border border-border bg-muted/60 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`rounded-lg py-2 transition-all ${
                !isSignUp
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`rounded-lg py-2 transition-all ${
                isSignUp
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {isSignUp ? (
            <SignUpForm onSwitchToLogin={() => setIsSignUp(false)} />
          ) : (
            <LoginForm onSwitchToSignup={() => setIsSignUp(true)} />
          )}

          <p className="mt-6 text-center text-[11px] text-muted-foreground leading-relaxed">
            By continuing, you agree to PricePilot&apos;s Terms of Service and Privacy Policy. Account data is for demo purposes.
          </p>
        </section>
      </div>

      {/* Footer minimal info */}
      <div className="text-center py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} PricePilot · Ad-free price comparisons
      </div>
    </div>
  );
}
