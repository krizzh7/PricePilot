'use client';

import { useEffect, useRef, useState } from 'react';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  duration = 800,
  decimalPlaces = 2,
  prefix = '$',
  suffix = '',
  className = '',
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<string>(
    `${prefix}${(direction === 'down' ? value : 0).toFixed(decimalPlaces)}${suffix}`
  );
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check prefers-reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplayValue(`${prefix}${value.toFixed(decimalPlaces)}${suffix}`);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();

          const timeout = setTimeout(() => {
            const startTimestamp = performance.now();
            const startVal = direction === 'down' ? value : 0;
            const endVal = direction === 'down' ? 0 : value;

            const step = (now: number) => {
              const elapsed = now - startTimestamp;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic: 1 - pow(1 - progress, 3)
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const current = startVal + (endVal - startVal) * easeOut;

              setDisplayValue(`${prefix}${current.toFixed(decimalPlaces)}${suffix}`);

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                setDisplayValue(`${prefix}${value.toFixed(decimalPlaces)}${suffix}`);
              }
            };

            requestAnimationFrame(step);
          }, delay);

          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value, direction, delay, duration, decimalPlaces, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
