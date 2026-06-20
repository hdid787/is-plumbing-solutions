import Link from 'next/link';
import { BRAND } from '@/lib/config';
import { sanityClient } from '@/lib/sanity';

// ============================================
// SEO METADATA (for Google)
// ============================================
export const metadata = {
  title: BRAND.name, // "Is Plumbing Solution"
  description: 'Expert plumbing and heating services across London. Emergency call-outs 24/7. Free quotes and guaranteed work.',
};

// ============================================
// FETCH SERVICES FROM SANITY
// ============================================
async function getServices() {
  const query = `*[_type == "service"] | order(order asc) {
    _id,
    name,
    slug,
    icon
  }`;
  const services = await sanityClient.fetch(query);
  return services;
}

// ============================================
// HOMEPAGE COMPONENT (Now async!)
// ============================================
export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-[#1A2E3F] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center" />
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#C9A96E] text-[#1A2E3F] text-xs font-bold px-3 py-1 rounded-full">🛠️ LONDON'S TRUSTED</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Your Pipework <br />
              <span className="text-[#C9A96E]">Emergency Solved.</span>
            </h1>
            <p className="text-gray-300 text-lg mt-6 max-w-lg">
              {BRAND.name} provides rapid, reliable plumbing and heating services across London. We show you the proof with our <strong className="text-white">Before & After</strong> gallery.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/quote" className="bg-[#C9A96E] text-[#1A2E3F] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#B89A5E] transition shadow-xl shadow-[#C9A96E]/30">
                Get Free Quote
              </Link>
              <Link href="/gallery" className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition backdrop-blur-sm">
                View Our Work
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-gray-400">
              <span>✅ 10+ Years Experience</span>
              <span>✅ Fully Insured</span>
              <span>✅ 24/7 Call-out</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION (NOW DYNAMIC!) ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#1A2E3F]">What We Fix</h2>
          <div className="h-1 w-20 bg-[#C9A96E] mx-auto mt-2 mb-10" />

          {services.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">No services added yet. <br />
                <span className="text-sm">Log into the <Link href="/studio" className="text-[#C9A96E] hover:underline">Admin Panel</Link> and add your first service!</span>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {services.map((service: any) => (
                <Link 
                  href={`/services/${service.slug.current}`} 
                  key={service._id} 
                  className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#C9A96E] transition hover:shadow-lg group"
                >
                  <div className="text-3xl mb-2">{service.icon || '🔧'}</div>
                  <p className="font-bold text-[#1A2E3F] group-hover:text-[#C9A96E] transition text-sm md:text-base">
                    {service.name}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="bg-[#1A2E3F] py-12 border-t-4 border-[#C9A96E]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Don't Wait Until It's Too Late</h2>
          <p className="text-gray-300 mt-2">Call our emergency line right now.</p>
          <a href={`tel:${BRAND.emergencyPhone}`} className="inline-block mt-4 bg-[#C9A96E] text-[#1A2E3F] px-10 py-4 rounded-full font-bold text-2xl hover:scale-105 transition">
            {BRAND.emergencyPhone}
          </a>
        </div>
      </section>
    </>
  );
}