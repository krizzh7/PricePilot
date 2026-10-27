'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

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
  const format = useCallback(
    (n: number) =>
      n.toLocaleString('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }),
    [decimalPlaces]
  );
  const [displayValue, setDisplayValue] = useState<string>(
    `${prefix}${format(direction === 'down' ? value : 0)}${suffix}`
  );
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check prefers-reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplayValue(`${prefix}${format(value)}${suffix}`);
      return;
    }

    let timeoutId: number | undefined;
    let animationFrameId: number | undefined;

    // Allow a new value (or formatting change) to animate again instead of
    // being frozen on the previous result.
    hasAnimatedRef.current = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        observer.disconnect();

        timeoutId = window.setTimeout(() => {
          const startTimestamp = performance.now();
          const startVal = direction === 'down' ? value : 0;
          const endVal = direction === 'down' ? 0 : value;

          const step = (now: number) => {
            const elapsed = now - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic: 1 - pow(1 - progress, 3)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = startVal + (endVal - startVal) * easeOut;

            setDisplayValue(`${prefix}${format(current)}${suffix}`);

            if (progress < 1) {
              animationFrameId = requestAnimationFrame(step);
            } else {
              setDisplayValue(`${prefix}${format(value)}${suffix}`);
            }
          };

          animationFrameId = requestAnimationFrame(step);
        }, delay);
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (animationFrameId !== undefined) cancelAnimationFrame(animationFrameId);
    };
  }, [value, direction, delay, duration, decimalPlaces, prefix, suffix, format]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
