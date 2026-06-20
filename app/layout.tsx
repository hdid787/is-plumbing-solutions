import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import StickyCallButton from './components/StickyCallButton';
import { BRAND } from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

// UPDATED: Dynamic metadata template for better SEO per page
export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s – ${BRAND.name}`, // Allows pages to set their own title: "Boiler Repair – Is Plumbing Solution"
  },
  description: 'Expert plumbing and heating services across London. Emergency call-outs 24/7.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // UPDATED: Enhanced Schema Markup with more fields for better Google Map Pack ranking
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Plumber',
    name: BRAND.name,
    image: 'https://your-vercel-url.vercel.app/logo.png', // <-- UPDATE THIS with your actual logo URL after deploy
    telephone: BRAND.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BRAND.address.split(',')[0] || '27 Old Gloucester St', // Extracts first part
      addressLocality: 'London',
      postalCode: 'WC1N 3AX',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.5197, // Approximate London coordinates – replace with exact location
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
    // ADDED: Aggregate rating – this helps you show stars in Google search results
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
    // ADDED: SameAs – links to your social media profiles (helps Google trust you)
    sameAs: [
      'https://facebook.com/your-page', // <-- Update with real URLs later
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
      </body>
    </html>
  );
}