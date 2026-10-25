'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { ToastProvider } from '@/components/ui/Toast';
import { CompareProvider } from '@/context/CompareContext';
import { CompareDock } from '@/components/compare/CompareDock';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <ToastProvider>
          <CompareProvider>
            <PageTransition>{children}</PageTransition>
            <CompareDock />
          </CompareProvider>
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
