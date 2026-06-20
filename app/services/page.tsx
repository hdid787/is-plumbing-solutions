// app/services/page.tsx
import { sanityClient } from '@/lib/sanity';
import Link from 'next/link';
import { BRAND } from '@/lib/config';

// ============================================
// SEO METADATA
// ============================================
export const metadata = {
  title: `Our Services – ${BRAND.name}`,
  description: `Expert plumbing and heating services across London. From boiler repair to full installations – ${BRAND.name} has you covered.`,
};

// ============================================
// FETCH SERVICES FROM SANITY
// ============================================
async function getServices() {
  const query = `*[_type == "service"] | order(order asc) {
    _id,
    name,
    slug,
    description,
    icon
  }`;
  return await sanityClient.fetch(query);
}

// ============================================
// SERVICES PAGE COMPONENT
// ============================================
export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      
      {/* ===== BACK LINK ===== */}
      <div className="mb-6">
        <Link href="/" className="text-[#C9A96E] hover:underline text-sm font-bold inline-flex items-center gap-1">
          ← Back to Home
        </Link>
      </div>

      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-5xl font-bold text-[#1A2E3F]">🛠️ Our Services</h1>
          <p className="text-gray-600 mt-2">
            Expert plumbing and heating services across London.
            {services.length > 0 && ` ${services.length} services available.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/quote" 
            className="bg-[#C9A96E] text-[#1A2E3F] px-6 py-2 rounded-full font-bold text-sm hover:bg-[#B89A5E] transition"
          >
            📝 Get a Quote
          </Link>
          <Link 
            href="/appointment" 
            className="bg-[#1A2E3F] text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-[#2A4055] transition"
          >
            📅 Book Now
          </Link>
        </div>
      </div>

      {/* ===== SERVICES GRID ===== */}
      {services.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No services added yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Log into the <Link href="/studio" className="text-[#C9A96E] hover:underline">Admin Panel</Link> to add your first service!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <Link href={`/services/${service.slug.current}`} key={service._id} className="group">
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition border border-gray-100 hover:border-[#C9A96E] h-full flex flex-col">
                <div className="text-5xl mb-4">{service.icon || '🔧'}</div>
                <h2 className="text-2xl font-bold text-[#1A2E3F] group-hover:text-[#C9A96E] transition">
                  {service.name}
                </h2>
                {service.description && (
                  <p className="text-gray-600 text-sm mt-2 flex-grow">{service.description}</p>
                )}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-[#C9A96E] text-sm font-medium group-hover:underline">
                    Learn more →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ===== CTA SECTION ===== */}
      <div className="mt-16 bg-[#1A2E3F] rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Need a plumber you can trust?</h2>
        <p className="text-gray-300 mt-2">
          Get a free, no-obligation quote from {BRAND.name} – we're here to help.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link 
            href="/quote" 
            className="bg-[#C9A96E] text-[#1A2E3F] px-8 py-3 rounded-full font-bold hover:bg-[#B89A5E] transition"
          >
            📝 Get Free Quote
          </Link>
          <a 
            href={`tel:${BRAND.emergencyPhone}`}
            className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-full font-bold hover:bg-white/20 transition"
          >
            📞 Call Now
          </a>
        </div>
      </div>
    </div>
  );
}