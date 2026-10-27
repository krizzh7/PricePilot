'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck, Zap, TrendingDown } from 'lucide-react';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { useCompare } from '@/context/CompareContext';

// 30-day mock price history for Lenovo Legion Pro 5
const PRICE_HISTORY = [
  { day: 'Day 1', date: 'Sep 25', price: 1019.99 },
  { day: 'Day 4', date: 'Sep 28', price: 1019.99 },
  { day: 'Day 7', date: 'Oct 01', price: 999.00 },
  { day: 'Day 10', date: 'Oct 04', price: 989.99 },
  { day: 'Day 13', date: 'Oct 07', price: 999.00 },
  { day: 'Day 16', date: 'Oct 10', price: 979.99 },
  { day: 'Day 19', date: 'Oct 13', price: 969.50 },
  { day: 'Day 22', date: 'Oct 16', price: 959.00 },
  { day: 'Day 25', date: 'Oct 19', price: 969.00 },
  { day: 'Day 28', date: 'Oct 22', price: 959.00 },
  { day: 'Day 30', date: 'Today', price: 949.99 },
];

export function LiveComparisonPreview() {
  const { toggleCompare, isComparing } = useCompare();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // SVG chart dimensions
  const width = 600;
  const height = 110;
  const paddingX = 24;
  const paddingY = 16;

  const minPrice = 930;
  const maxPrice = 1030;

  // Compute SVG coordinates
  const points = PRICE_HISTORY.map((pt, i) => {
    const x = paddingX + (i / (PRICE_HISTORY.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((pt.price - minPrice) / (maxPrice - minPrice)) * (height - paddingY * 2);
    return { x, y, ...pt };
  });

  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  // Deal Meter Calculation: $949.99 between $929.99 (Low) and $1,019.99 (High)
  const low90 = 929.99;
  const high90 = 1019.99;
  const currentPrice = 949.99;
  const meterPercentage = Math.round(((currentPrice - low90) / (high90 - low90)) * 100);

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;

    // Find nearest point
    let closestIndex = 0;
    let closestDist = Infinity;
    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - mouseX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = idx;
      }
    });
    setHoverIndex(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className="mx-auto mt-16 max-w-4xl rounded-3xl border border-border/70 bg-card/90 p-6 sm:p-8 shadow-saas-lg backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/5 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/60 gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Live Comparison Example
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Live Data
              </span>
            </div>
            <h3 className="mt-0.5 text-base sm:text-xl font-bold text-foreground">
              Lenovo Legion Pro 5 Gen 8 Gaming Laptop
            </h3>
          </div>
        </div>

        {/* Highlighted Emerald Savings Pill with Animated Ticker */}
        <div className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#ecfdf5] px-4 py-1.5 text-xs sm:text-sm font-bold text-[#059669] shadow-xs dark:bg-emerald-950/50 dark:border-emerald-500/30 dark:text-emerald-300">
          <Check className="h-4 w-4 stroke-[3]" />
          <NumberTicker value={70} prefix="Save up to $" duration={800} />
        </div>
      </div>

      {/* Interactive Price Intelligence Row (Deal Meter & 30-Day Trend Sparkline) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-6 border-b border-border/50">
        {/* 1. Deal Meter */}
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Deal Meter
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[11px]">
              Great Deal (Bottom {meterPercentage}%)
            </span>
          </div>

          <div className="mt-4">
            {/* Visual Meter Bar */}
            <div className="relative h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 w-full" />
            </div>

            {/* Indicator Marker */}
            <div className="relative mt-1.5">
              <div
                className="absolute -top-3.5 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                style={{ left: `${meterPercentage}%` }}
              >
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-600 shadow-md ring-2 ring-emerald-500/40" />
                <span className="mt-1 text-[10px] font-bold font-mono text-emerald-700 dark:text-emerald-300">
                  $949.99
                </span>
              </div>
            </div>

            {/* 90-Day Range labels */}
            <div className="mt-5 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <div>
                <span className="text-[10px] text-muted-foreground/80 uppercase block font-sans">90d Low</span>
                <strong className="text-foreground">${low90}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground/80 uppercase block font-sans">90d High</span>
                <strong className="text-foreground">${high90}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Responsive SVG Sparkline (30-Day Price Trend) */}
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 relative">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              30-Day Price History
            </span>
            <span className="text-muted-foreground text-[11px]">
              {hoverIndex !== null ? `${activePoint.date}: ` : 'Current: '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                ${activePoint.price.toFixed(2)}
              </strong>
            </span>
          </div>

          <div className="relative h-[95px] w-full pt-1">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${width} ${height}`}
              className="h-full w-full overflow-visible cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path d={areaD} fill="url(#sparklineGrad)" />

              {/* Trend line */}
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover vertical crosshair */}
              {hoverIndex !== null && (
                <line
                  x1={activePoint.x}
                  y1={0}
                  x2={activePoint.x}
                  y2={height}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* Point circle */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                className="fill-emerald-600 stroke-white dark:stroke-slate-900 transition-all duration-150"
                strokeWidth="2"
              />
            </svg>

            {/* Hover Floating Tooltip */}
            {hoverIndex !== null && (
              <div
                className="pointer-events-none absolute -top-4 -translate-x-1/2 -translate-y-full rounded-md border border-border bg-popover px-2 py-1 text-[11px] font-semibold text-popover-foreground shadow-lg backdrop-blur-md transition-all duration-100"
                style={{
                  left: `${(activePoint.x / width) * 100}%`,
                }}
              >
                <span className="text-muted-foreground mr-1">{activePoint.date}:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  ${activePoint.price.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Retailer Comparison Rows with "+ Compare" */}
      <div className="divide-y divide-border/40 text-sm mt-2">
        {/* Amazon */}
        <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-muted/30 px-3 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-bold text-xs ring-1 ring-amber-500/20">
              A
            </span>
            <div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                Amazon
                <span className="inline-flex rounded-full bg-emerald-600/10 px-2 py-0.2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  Lowest Offer
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Free 2-day delivery • Authorized Seller</span>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">$949.99</span>
            <button
              type="button"
              onClick={() =>
                toggleCompare({
                  id: 'demo-amazon',
                  title: 'Lenovo Legion Pro 5 Gen 8 (Amazon)',
                  price: '$949.99',
                  retailer: 'Amazon',
                  productUrl: '/search?q=Lenovo+Legion',
                })
              }
              className={`pill-tactile rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                isComparing('demo-amazon')
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {isComparing('demo-amazon') ? '✓ Compared' : '+ Compare'}
            </button>
          </div>
        </div>

        {/* Walmart */}
        <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-muted/30 px-3 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 font-bold text-xs ring-1 ring-blue-500/20">
              W
            </span>
            <div>
              <div className="font-semibold text-foreground">Walmart</div>
              <span className="text-xs text-muted-foreground">Free 3-day shipping • Standard warranty</span>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-base font-semibold text-foreground font-mono">$959.00</span>
            <button
              type="button"
              onClick={() =>
                toggleCompare({
                  id: 'demo-walmart',
                  title: 'Lenovo Legion Pro 5 Gen 8 (Walmart)',
                  price: '$959.00',
                  retailer: 'Walmart',
                  productUrl: '/search?q=Lenovo+Legion',
                })
              }
              className={`pill-tactile rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                isComparing('demo-walmart')
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {isComparing('demo-walmart') ? '✓ Compared' : '+ Compare'}
            </button>
          </div>
        </div>

        {/* Best Buy */}
        <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-muted/30 px-3 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600 font-bold text-xs ring-1 ring-yellow-500/20">
              B
            </span>
            <div>
              <div className="font-semibold text-foreground">Best Buy</div>
              <span className="text-xs text-muted-foreground">Store pickup ready in 1 hr • Price match guarantee</span>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-base font-semibold text-foreground font-mono">$1,019.99</span>
            <button
              type="button"
              onClick={() =>
                toggleCompare({
                  id: 'demo-bestbuy',
                  title: 'Lenovo Legion Pro 5 Gen 8 (Best Buy)',
                  price: '$1,019.99',
                  retailer: 'Best Buy',
                  productUrl: '/search?q=Lenovo+Legion',
                })
              }
              className={`pill-tactile rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                isComparing('demo-bestbuy')
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {isComparing('demo-bestbuy') ? '✓ Compared' : '+ Compare'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-3">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Prices synced via Google Shopping API • Updated hourly
        </span>
        <Link
          href="/search?q=Lenovo+Legion"
          className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          <span>Explore all 40+ retailer offers</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
