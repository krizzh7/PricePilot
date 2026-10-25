import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ParsedResult, SerpApiShoppingResult } from '@/types/search';

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
  const lower = source.toLowerCase();

  for (const [key, name] of Object.entries(TRUSTED_RETAILERS)) {
    if (lower.includes(key)) {
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

function getFaviconUrl(retailerKey: string, retailerName: string): string {
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

function parsePrice(item: SerpApiShoppingResult): number | null {
  if (typeof item.extracted_price === 'number' && Number.isFinite(item.extracted_price) && item.extracted_price > 0) {
    return item.extracted_price;
  }
  if (!item.price) return null;
  const parsed = Number(item.price.replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseShipping(item: SerpApiShoppingResult): { text: string; days: number | null } {
  const delivery = (item.delivery as string | undefined)?.trim();
  if (!delivery) return { text: 'Free standard shipping', days: null };

  const match = delivery.match(/(\d+)(?:\s*(?:-|–|to)\s*(\d+))?\s*days?/i);
  if (!match) return { text: delivery, days: null };
  const first = Number(match[1]);
  const last = match[2] ? Number(match[2]) : first;
  return { text: delivery, days: Math.ceil((first + last) / 2) };
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
    const reviewCount = typeof item.reviews === 'number' ? item.reviews : null;

    const productUrl = item.product_link || `https://www.google.com/search?q=${encodeURIComponent(item.title)}`;

    return [{
      title: item.title,
      retailer: name,
      price,
      priceFormatted: formatPrice(price),
      rating,
      reviewCount,
      shippingText: shipping.text,
      shippingDays: shipping.days,
      availability: 'In Stock',
      productUrl,
      faviconUrl: getFaviconUrl(key, name),
    }];
  });
}

export function getMockResults(query: string): ParsedResult[] {
  const cleanQ = query && query.trim() ? query.trim() : 'Apple MacBook Air M3 (13-inch)';

  const sampleOffers = [
    { retailer: 'Amazon', key: 'amazon', price: 949.00, rating: 4.8, reviewCount: 4210, shipping: 'Free Prime 2-day delivery' },
    { retailer: 'Best Buy', key: 'bestbuy', price: 969.99, rating: 4.7, reviewCount: 2150, shipping: 'Free next-day shipping or pickup' },
    { retailer: 'Walmart', key: 'walmart', price: 979.00, rating: 4.6, reviewCount: 1340, shipping: 'Free 2-day delivery' },
    { retailer: 'B&H Photo', key: 'bhphotovideo', price: 989.00, rating: 4.9, reviewCount: 890, shipping: 'Free 1-day expedited' },
    { retailer: 'Target', key: 'target', price: 999.00, rating: 4.5, reviewCount: 610, shipping: 'Free delivery with RedCard' },
    { retailer: 'Newegg', key: 'newegg', price: 1019.99, rating: 4.4, reviewCount: 480, shipping: 'Free standard shipping' },
  ];

  return sampleOffers.map((offer) => ({
    title: cleanQ,
    retailer: offer.retailer,
    price: offer.price,
    priceFormatted: formatPrice(offer.price),
    rating: offer.rating,
    reviewCount: offer.reviewCount,
    shippingText: offer.shipping,
    shippingDays: 2,
    availability: 'In Stock',
    productUrl: `https://${offer.key}.com/s?k=${encodeURIComponent(cleanQ)}`,
    faviconUrl: getFaviconUrl(offer.key, offer.retailer),
  }));
}
