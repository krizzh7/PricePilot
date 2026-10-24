import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PricePilot - Compare Prices Across Retailers',
  description: 'Compare prices across Amazon, Best Buy, Walmart, Newegg, and more. Find the best deals instantly.',
  keywords: ['price comparison', 'shopping', 'deals', 'e-commerce', 'retail'],
  openGraph: {
    title: 'PricePilot - Compare Prices Across Retailers',
    description: 'Compare prices across Amazon, Best Buy, Walmart, Newegg, and more.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}