'use client';

import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Route order to determine forward vs backward slide direction
const ROUTE_HIERARCHY: Record<string, number> = {
  '/': 0,
  '/search': 1,
  '/auth': 2,
};

const variants: Variants = {
  initial: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 24 : -24,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.26,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -20 : 20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1] as const,
    },
  }),
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const prevPathnameRef = useRef(pathname);
  const [direction, setDirection] = useState<number>(1);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const prevRank = ROUTE_HIERARCHY[prevPathnameRef.current] ?? 0;
    const currentRank = ROUTE_HIERARCHY[pathname] ?? 1;

    setDirection(currentRank >= prevRank ? 1 : -1);
    prevPathnameRef.current = pathname;

    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 280);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (prefersReducedMotion) {
    return <div className="w-full flex-1">{children}</div>;
  }

  return (
    <>
      {/* Snappy Top Accent Progress Line */}
      <div
        className={`fixed top-0 left-0 right-0 z-[100] h-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 transition-all duration-300 pointer-events-none origin-left ${
          isNavigating ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`}
      />

      {/* Smooth Directional Route Transition */}
      <div className="relative w-full flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={pathname}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
