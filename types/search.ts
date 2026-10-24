export interface SerpApiShoppingResult {
  title?: string;
  source?: string;
  price?: string;
  extracted_price?: number;
  rating?: number;
  reviews?: number;
  reviews_count?: number;
  shipping?: string;
  delivery_days?: number;
  delivery?: string;
  link?: string;
  product_link?: string;
  thumbnail?: string;
  availability?: string;
}

export interface ParsedResult {
  title: string;
  retailer: string;
  price: number;
  priceFormatted: string;
  rating: number | null;
  reviewCount: number | null;
  shippingText: string;
  shippingDays: number | null;
  availability: string;
  productUrl: string;
  faviconUrl: string;
}

export interface SearchResponse {
  results: ParsedResult[];
  query: string;
  timestamp: string;
  demo: boolean;
  truncated?: boolean;
}

export type SortField = 'retailer' | 'price' | 'rating' | 'shipping';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
