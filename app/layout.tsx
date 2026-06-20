import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import StickyCallButton from './components/StickyCallButton';
import { GoogleAnalytics } from '@next/third-parties/google'; // <-- ADDED
import { BRAND } from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s – ${BRAND.name}`,
  },
  description: 'Expert plumbing and heating services across London. Emergency call-outs 24/7.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Plumber',
    name: BRAND.name,
    image: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-vercel-url.vercel.app'}/logo.png`,
    telephone: BRAND.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BRAND.address.split(',')[0] || '27 Old Gloucester St',
      addressLocality: 'London',
      postalCode: 'WC1N 3AX',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.5197,
      longitude: -0.1270,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '08:00',
        closes: '20:00',
      },
    ],
    priceRange: '££',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
    sameAs: [
      'https://facebook.com/your-page',
      'https://instagram.com/your-page',
      'https://twitter.com/your-page',
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-white text-[#1A2E3F] min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <StickyCallButton />
        <Footer />
        {/* Google Analytics – replace G-XXXXXXXXXX with your actual Measurement ID */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'} />
      </body>
    </html>
  );
}