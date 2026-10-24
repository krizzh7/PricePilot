'use client';

import { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { Modal } from '@/components/ui/Modal';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(modalRef.current!, {
        scale: 0.95,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out',
      });
    }, modalRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-emerald-600" aria-hidden="true" />
            <h1 id="auth-title" className="text-2xl font-bold text-slate-900">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close and go home"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSignUp ? (
          <SignUpForm onSwitchToLogin={() => setIsSignUp(false)} />
        ) : (
          <LoginForm onSwitchToSignup={() => setIsSignUp(true)} />
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}