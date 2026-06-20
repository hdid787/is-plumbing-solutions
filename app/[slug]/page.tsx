import { sanityClient } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { BRAND } from '@/lib/config';

// ============================================
// DYNAMIC SEO METADATA (per page)
// ============================================
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }
  return {
    title: page.seoTitle || `${page.title} – ${BRAND.name}`,
    description: page.seoDescription || `Expert plumbing services in ${page.title} – call ${BRAND.phone} for fast, reliable service.`,
  };
}

// ============================================
// GENERATE STATIC PATHS
// ============================================
export async function generateStaticParams() {
  const query = `*[_type == "page"]{ "slug": slug.current }`;
  const pages = await sanityClient.fetch(query);
  return pages.map((page: any) => ({ slug: page.slug }));
}

// ============================================
// FETCH PAGE FROM SANITY
// ============================================
async function getPage(slug: string) {
  const query = `*[_type == "page" && slug.current == $slug][0]{
    title, 
    content, 
    seoTitle, 
    seoDescription
  }`;
  return await sanityClient.fetch(query, { slug });
}

// ============================================
// DYNAMIC PAGE COMPONENT
// ============================================
export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  if (!page) return notFound();

  // Format the slug for display (e.g., "kensington" → "Kensington")
  const locationName = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      
      {/* ===== BREADCRUMB NAVIGATION (SEO boost) ===== */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[#C9A96E] transition">Home</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li>
            <Link href="/services" className="hover:text-[#C9A96E] transition">Services</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-[#1A2E3F] font-medium">{locationName}</li>
        </ol>
      </nav>

      {/* ===== PAGE HEADER ===== */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#C9A96E] text-[#1A2E3F] text-xs font-bold px-3 py-1 rounded-full">
            📍 Serving {locationName}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A2E3F]">{page.title}</h1>
      </div>

      {/* ===== PAGE CONTENT ===== */}
      <div className="prose prose-lg prose-headings:text-[#1A2E3F] prose-a:text-[#C9A96E] max-w-none">
        {page.content ? (
          <PortableText value={page.content} />
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-300">
            <p className="text-gray-500">This page is empty.</p>
            <p className="text-sm text-gray-400 mt-2">
              Log into the <Link href="/studio" className="text-[#C9A96E] hover:underline">Admin Panel</Link> to add content for {locationName}.
            </p>
          </div>
        )}
      </div>

      {/* ===== LOCAL SERVICE INFO BLOCK ===== */}
      <div className="mt-12 bg-[#1A2E3F] rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">📍 {BRAND.name} in {locationName}</h2>
            <p className="text-gray-300 text-sm mt-1">
              Fast, reliable plumbing services in your area. Call us for emergency repairs.
            </p>
          </div>
          <a 
            href={`tel:${BRAND.emergencyPhone}`}
            className="bg-[#C9A96E] text-[#1A2E3F] px-6 py-3 rounded-full font-bold text-lg hover:bg-[#B89A5E] transition whitespace-nowrap text-center"
          >
            📞 Call Now
          </a>
        </div>
      </div>

      {/* ===== CALL-TO-ACTION ===== */}
      <div className="mt-10 bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
        <h3 className="text-2xl font-bold text-[#1A2E3F]">Need a plumber in {locationName}?</h3>
        <p className="text-gray-600 mt-2">
          Get a free, no-obligation quote from {BRAND.name} today.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link 
            href="/quote" 
            className="bg-[#1A2E3F] text-white px-6 py-3 rounded-full font-bold hover:bg-[#2A4055] transition"
          >
            📝 Get Free Quote
          </Link>
          <Link 
            href="/appointment" 
            className="bg-[#C9A96E] text-[#1A2E3F] px-6 py-3 rounded-full font-bold hover:bg-[#B89A5E] transition"
          >
            📅 Book Appointment
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Or call us directly: <a href={`tel:${BRAND.phone}`} className="text-[#1A2E3F] font-bold">{BRAND.phone}</a>
        </p>
      </div>
    </div>
  );
}