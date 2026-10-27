import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ParsedResult, SerpApiShoppingResult, SortConfig } from '@/types/search';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TRUSTED_RETAILERS: Record<string, string> = {
  amazon: 'Amazon',
  bestbuy: 'Best Buy',
  walmart: 'Walmart',
  newegg: 'Newegg',
  bhphotovideo: 'B&H Photo',
  ebay: 'eBay',
  target: 'Target',
  microcenter: 'Micro Center',
  adorama: 'Adorama',
  costco: 'Costco',
  lenovo: 'Lenovo',
  google: 'Google Store',
  apple: 'Apple',
  samsung: 'Samsung',
  microsoft: 'Microsoft Store',
  dell: 'Dell',
  hp: 'HP',
  gamestop: 'GameStop',
  staples: 'Staples',
  officedepot: 'Office Depot',
};

function getRetailerInfo(source: string): { key: string; name: string } {
  if (!source) return { key: 'store', name: 'Retailer' };
  // Normalise before matching so names such as "B&H Photo Video" still match "bhphotovideo".
  const normalized = source.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Match longer keys first so short ones (e.g. "hp") cannot shadow a specific retailer.
  const retailersBySpecificity = Object.entries(TRUSTED_RETAILERS).sort((a, b) => b[0].length - a[0].length);
  for (const [key, name] of retailersBySpecificity) {
    // Accept both "Amazon.com Marketplace" (source contains key) and short
    // source names such as "B&H Photo" (key contains source).
    if (normalized.includes(key) || (normalized.length >= 4 && key.includes(normalized))) {
      return { key, name };
    }
  }

  // Clean generic retailer name (e.g. "B&H Photo Video - Electronics" -> "B&H Photo Video")
  const clean = source.split(/[-–|]/)[0].trim().replace(/\.com$/i, '');
  return {
    key: clean.toLowerCase().replace(/[^a-z0-9]/g, '') || 'store',
    name: clean || source,
  };
}

function getFaviconUrl(retailerKey: string): string {
  const domainMap: Record<string, string> = {
    amazon: 'amazon.com',
    bestbuy: 'bestbuy.com',
    walmart: 'walmart.com',
    newegg: 'newegg.com',
    bhphotovideo: 'bhphotovideo.com',
    ebay: 'ebay.com',
    target: 'target.com',
    microcenter: 'microcenter.com',
    adorama: 'adorama.com',
    costco: 'costco.com',
    lenovo: 'lenovo.com',
    google: 'store.google.com',
    apple: 'apple.com',
    samsung: 'samsung.com',
    microsoft: 'microsoft.com',
    dell: 'dell.com',
    hp: 'hp.com',
    gamestop: 'gamestop.com',
    staples: 'staples.com',
  };

  const domain = domainMap[retailerKey] || `${retailerKey}.com`;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/**
 * Only http(s) destinations are rendered as links. SerpApi results are external
 * input, so a `javascript:` or `data:` URL must never reach an anchor's href.
 */
function sanitizeUrl(url: unknown, fallback: string): string {
  if (typeof url !== 'string' || !url.trim()) return fallback;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.toString();
  } catch {
    // Not an absolute URL; fall through to the safe fallback.
  }
  return fallback;
}

function parsePrice(item: SerpApiShoppingResult): number | null {
  if (typeof item.extracted_price === 'number' && Number.isFinite(item.extracted_price) && item.extracted_price > 0) {
    return item.extracted_price;
  }
  if (!item.price) return null;
  // Take the first price in strings such as "From $1,299.99" or "$1,299.99 - $1,399.99".
  const match = String(item.price).match(/\d[\d,]*(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0].replace(/,/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseShipping(item: SerpApiShoppingResult): { text: string; days: number | null } {
  const delivery = typeof item.delivery === 'string' ? item.delivery.trim() : '';
  const explicitDays =
    typeof item.delivery_days === 'number' && Number.isFinite(item.delivery_days)
      ? Math.max(1, Math.round(item.delivery_days))
      : null;

  if (!delivery) return { text: 'Shipping info at retailer', days: explicitDays };
  if (explicitDays !== null) return { text: delivery, days: explicitDays };

  const match = delivery.match(/(\d+)(?:\s*(?:-|–|to)\s*(\d+))?\s*days?/i);
  if (!match) return { text: delivery, days: null };
  const first = Number(match[1]);
  const last = match[2] ? Number(match[2]) : first;
  return { text: delivery, days: Math.ceil((first + last) / 2) };
}

/** Retailer availability strings are free-form; treat anything decisively
 * negative as out of stock so the UI does not show a green "available" dot. */
export function isInStock(availability: string | null | undefined): boolean {
  if (!availability) return true;
  return !/out of stock|sold out|unavailable|discontinued|check availability/i.test(availability);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function parseSerpApiResults(results: SerpApiShoppingResult[]): ParsedResult[] {
  return results.flatMap((item): ParsedResult[] => {
    if (!item.title) return [];

    const price = parsePrice(item);
    if (price === null) return [];

    const { key, name } = getRetailerInfo(item.source || '');
    const shipping = parseShipping(item);
    const rating = typeof item.rating === 'number' && Number.isFinite(item.rating) ? item.rating : null;
    const reviewCount =
      typeof item.reviews === 'number'
        ? item.reviews
        : typeof item.reviews_count === 'number'
          ? item.reviews_count
          : null;

    const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(item.title)}`;
    const productUrl = sanitizeUrl(item.product_link, fallbackUrl);
    const availability = item.availability?.trim() || 'Check availability';

    return [{
      title: item.title,
      retailer: name,
      price,
      priceFormatted: formatPrice(price),
      rating,
      reviewCount,
      shippingText: shipping.text,
      shippingDays: shipping.days,
      availability,
      productUrl,
      faviconUrl: getFaviconUrl(key),
    }];
  });
}

/**
 * Stable identity for an offer. Multiple offers for the same Google Shopping
 * product often share a `product_link`, so the URL alone is not unique.
 */
export function getOfferId(result: Pick<ParsedResult, 'retailer' | 'title' | 'price'>): string {
  return `${result.retailer}::${result.title}::${result.price}`;
}

const compareNullableNumbers = (a: number | null, b: number | null, direction: SortConfig['direction']) => {
  if (a === null && b === null) return 0;
  // Missing values always sort last, regardless of direction.
  if (a === null) return 1;
  if (b === null) return -1;
  return direction === 'asc' ? a - b : b - a;
};

export function sortResults(results: ParsedResult[], sort: SortConfig): ParsedResult[] {
  return [...results].sort((a, b) => {
    if (sort.field === 'retailer') {
      const order = a.retailer.localeCompare(b.retailer, undefined, { sensitivity: 'base' });
      return sort.direction === 'asc' ? order : -order;
    }

    const left = sort.field === 'price' ? a.price : sort.field === 'rating' ? a.rating : a.shippingDays;
    const right = sort.field === 'price' ? b.price : sort.field === 'rating' ? b.rating : b.shippingDays;
    return compareNullableNumbers(left, right, sort.direction);
  });
}

export function getLowestPrice(results: ParsedResult[]): number | null {
  const prices = results.map((result) => result.price).filter((price) => Number.isFinite(price) && price > 0);
  return prices.length ? Math.min(...prices) : null;
}

export function getMockResults(query: string): ParsedResult[] {
  const cleanQ = query && query.trim() ? query.trim() : 'Apple MacBook Air M3 (13-inch)';

  const sampleOffers = [
    { retailer: 'Amazon', key: 'amazon', price: 949.00, rating: 4.8, reviewCount: 4210, shipping: 'Free Prime 2-day delivery', shippingDays: 2 },
    { retailer: 'Best Buy', key: 'bestbuy', price: 969.99, rating: 4.7, reviewCount: 2150, shipping: 'Free next-day shipping or pickup', shippingDays: 1 },
    { retailer: 'Walmart', key: 'walmart', price: 979.00, rating: 4.6, reviewCount: 1340, shipping: 'Free 2-day delivery', shippingDays: 2 },
    { retailer: 'B&H Photo', key: 'bhphotovideo', price: 989.00, rating: 4.9, reviewCount: 890, shipping: 'Free 1-day expedited', shippingDays: 1 },
    { retailer: 'Target', key: 'target', price: 999.00, rating: 4.5, reviewCount: 610, shipping: 'Free delivery with RedCard', shippingDays: 3 },
    { retailer: 'Newegg', key: 'newegg', price: 1019.99, rating: 4.4, reviewCount: 480, shipping: 'Free standard shipping', shippingDays: 4 },
  ];

  return sampleOffers.map((offer) => ({
    title: cleanQ,
    retailer: offer.retailer,
    price: offer.price,
    priceFormatted: formatPrice(offer.price),
    rating: offer.rating,
    reviewCount: offer.reviewCount,
    shippingText: offer.shipping,
    shippingDays: offer.shippingDays,
    availability: 'In Stock',
    productUrl: `https://${offer.key}.com/s?k=${encodeURIComponent(cleanQ)}`,
    faviconUrl: getFaviconUrl(offer.key),
  }));
}
