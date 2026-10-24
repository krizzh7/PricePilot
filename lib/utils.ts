import type { ParsedResult, SerpApiShoppingResult } from '@/types/search';

const TRUSTED_RETAILERS: Record<string, string> = {
  amazon: 'Amazon',
  bestbuy: 'Best Buy',
  walmart: 'Walmart',
  newegg: 'Newegg',
  'bhphotovideo': 'B&H Photo',
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
};

function getRetailerKey(source: string): string | null {
  const normalized = source.toLowerCase().replace(/[^a-z0-9]/g, '');
  return TRUSTED_RETAILERS[normalized] ? normalized : null;
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
  };
  const domain = domainMap[retailerKey] || `${retailerKey}.com`;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
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
  if (!delivery) return { text: 'Shipping details not listed', days: null };

  const match = delivery.match(/(\d+)(?:\s*(?:-|–|to)\s*(\d+))?\s*days?/i);
  if (!match) return { text: delivery, days: null };
  const first = Number(match[1]);
  const last = match[2] ? Number(match[2]) : first;
  return { text: delivery, days: Math.ceil((first + last) / 2) };
}

function formatPrice(price: number): string {
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

    const retailerKey = getRetailerKey(item.source || '');
    if (!retailerKey) return [];

    const price = parsePrice(item);
    if (price === null) return [];

    const shipping = parseShipping(item);
    const rating = typeof item.rating === 'number' && Number.isFinite(item.rating) ? item.rating : null;
    const reviewCount = typeof item.reviews === 'number' ? item.reviews : null;

    const productUrl = item.product_link || `https://www.google.com/search?q=${encodeURIComponent(item.title)}`;

    return [{
      title: item.title,
      retailer: TRUSTED_RETAILERS[retailerKey],
      price,
      priceFormatted: formatPrice(price),
      rating,
      reviewCount,
      shippingText: shipping.text,
      shippingDays: shipping.days,
      availability: 'Availability not listed',
      productUrl,
      faviconUrl: getFaviconUrl(retailerKey),
    }];
  });
}

export function getMockResults(query: string): ParsedResult[] {
  const sampleOffers = [
    { retailer: 'Amazon', domain: 'amazon.com', price: 999, rating: 4.7, reviewCount: 2841 },
    { retailer: 'Best Buy', domain: 'bestbuy.com', price: 1019.99, rating: 4.6, reviewCount: 1234 },
    { retailer: 'Walmart', domain: 'walmart.com', price: 995, rating: 4.5, reviewCount: 892 },
    { retailer: 'Newegg', domain: 'newegg.com', price: 1049.99, rating: 4.4, reviewCount: 567 },
    { retailer: 'B&H Photo', domain: 'bhphotovideo.com', price: 999, rating: 4.8, reviewCount: 445 },
  ];

  return sampleOffers.map((offer) => ({
    title: query,
    retailer: offer.retailer,
    price: offer.price,
    priceFormatted: formatPrice(offer.price),
    rating: offer.rating,
    reviewCount: offer.reviewCount,
    shippingText: 'Sample only — not live',
    shippingDays: null,
    availability: 'Availability not listed',
    productUrl: `https://${offer.domain}/s?k=${encodeURIComponent(query)}`,
    faviconUrl: getFaviconUrl(offer.domain),
  }));
}
