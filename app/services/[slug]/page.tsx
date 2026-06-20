// app/services/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BRAND } from '@/lib/config';

// ============================================
// DYNAMIC SEO METADATA (per service)
// ============================================
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }
  return {
    title: `${service.name} – ${BRAND.name}`,
    description: service.description || `Expert ${service.name} services in London. Call ${BRAND.phone} for fast, reliable service.`,
  };
}

// ============================================
// GENERATE STATIC PATHS
// ============================================
export async function generateStaticParams() {
  const query = `*[_type == "service"]{ "slug": slug.current }`;
  const services = await sanityClient.fetch(query);
  return services.map((service: any) => ({ slug: service.slug }));
}

// ============================================
// FETCH SERVICE FROM SANITY
// ============================================
async function getService(slug: string) {
  const query = `*[_type == "service" && slug.current == $slug][0]{
    name, 
    description, 
    icon
  }`;
  return await sanityClient.fetch(query, { slug });
}

// ============================================
// SERVICE DETAIL PAGE
// ============================================
export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  if (!service) return notFound();

  // Format the service name for display in breadcrumb
  const serviceName = service.name;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      
      {/* ===== BREADCRUMB NAVIGATION ===== */}
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
          <li className="text-[#1A2E3F] font-medium">{serviceName}</li>
        </ol>
      </nav>

      {/* ===== BACK LINK ===== */}
      <div className="mb-6">
        <Link href="/services" className="text-[#C9A96E] hover:underline text-sm font-bold inline-flex items-center gap-1">
          ← Back to Services
        </Link>
      </div>

      {/* ===== SERVICE DETAIL ===== */}
      <div className="mt-4">
        <div className="text-6xl mb-4">{service.icon || '🔧'}</div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A2E3F]">{service.name}</h1>
        <p className="text-gray-600 text-lg mt-4">
          {service.description || 'Contact us for expert plumbing services.'}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link 
            href="/quote" 
            className="bg-[#1A2E3F] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2A4055] transition"
          >
            📝 Get a Quote
          </Link>
          <Link 
            href="/appointment" 
            className="bg-[#C9A96E] text-[#1A2E3F] px-8 py-3 rounded-full font-bold hover:bg-[#B89A5E] transition"
          >
            📅 Book Appointment
          </Link>
          <a 
            href={`tel:${BRAND.emergencyPhone}`}
            className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition"
          >
            🚨 Call Emergency
          </a>
        </div>
      </div>

      {/* ===== URGENT CALLOUT ===== */}
      <div className="mt-12 bg-[#1A2E3F] rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">🚨 Urgent {service.name} help?</h2>
            <p className="text-gray-300 text-sm mt-1">
              Call our emergency line – we're available 24/7 across London.
            </p>
          </div>
          <a 
            href={`tel:${BRAND.emergencyPhone}`}
            className="bg-[#C9A96E] text-[#1A2E3F] px-6 py-3 rounded-full font-bold text-lg hover:bg-[#B89A5E] transition text-center whitespace-nowrap"
          >
            📞 {BRAND.emergencyPhone}
          </a>
        </div>
      </div>

      {/* ===== WHY CHOOSE US? (Optional additional section) ===== */}
      <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold text-[#1A2E3F]">Why choose {BRAND.name}?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-bold text-[#1A2E3F]">10+ Years Experience</p>
              <p className="text-sm text-gray-500">Trusted by hundreds of London homes</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-bold text-[#1A2E3F]">Fully Insured</p>
              <p className="text-sm text-gray-500">Peace of mind with every job</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-bold text-[#1A2E3F]">24/7 Emergency</p>
              <p className="text-sm text-gray-500">We're here when you need us</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CTA SECTION ===== */}
      <div className="mt-12 bg-[#1A2E3F] rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to book {service.name}?</h2>
        <p className="text-gray-300 mt-2">
          Get a free, no-obligation quote from {BRAND.name} today.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link 
            href="/quote" 
            className="bg-[#C9A96E] text-[#1A2E3F] px-8 py-3 rounded-full font-bold hover:bg-[#B89A5E] transition"
          >
            📝 Get Free Quote
          </Link>
          <Link 
            href="/appointment" 
            className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-full font-bold hover:bg-white/20 transition"
          >
            📅 Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}