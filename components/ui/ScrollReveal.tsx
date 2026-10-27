'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  id?: string;
  delay?: number;
  staggerIndex?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  id,
  delay = 0,
  staggerIndex = 0,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 1. Accessibility: Check prefers-reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    // 2. Play once per session via sessionStorage if an ID is provided
    const sessionKey = id ? `scroll_reveal_${id}` : null;
    try {
      if (sessionKey && sessionStorage.getItem(sessionKey)) {
        setIsVisible(true);
        return;
      }
    } catch {
      // Storage can be unavailable (private mode); treat it as a fresh visit.
    }

    // 3. Native IntersectionObserver API (fall back to visible when unsupported)
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sessionKey) {
            try {
              sessionStorage.setItem(sessionKey, 'true');
            } catch {
              // Ignore storage failures; the reveal itself already happened.
            }
          }
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [id]);

  const totalDelay = delay + staggerIndex * 100;

  return (
    <div
      ref={ref}
      id={id}
      style={{
        transitionDuration: '550ms',
        transitionDelay: `${totalDelay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={cn(
        'transition-all will-change-[transform,opacity]',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[15px]',
        className
      )}
    >
      {children}
    </div>
  );
}
