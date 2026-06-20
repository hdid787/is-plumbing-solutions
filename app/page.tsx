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
// HOMEPAGE COMPONENT
// ============================================
export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      {/* ===== HERO SECTION WITH PLUMBING SERVICE CARD ===== */}
      <section className="relative bg-[#1A2E3F] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center" />
        
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* LEFT COLUMN - Text */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#C9A96E] text-[#1A2E3F] text-xs font-bold px-3 py-1 rounded-full">
                  🛠️ LONDON'S TRUSTED
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your Pipework <br />
                <span className="text-[#C9A96E]">Emergency Solved.</span>
              </h1>
              <p className="text-gray-300 text-lg mt-6 max-w-lg">
                {BRAND.name} provides rapid, reliable plumbing and heating services across London. 
                We show you the proof with our <strong className="text-white">Before & After</strong> gallery.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link 
                  href="/quote" 
                  className="bg-[#C9A96E] text-[#1A2E3F] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#B89A5E] transition shadow-xl shadow-[#C9A96E]/30"
                >
                  Get Free Quote
                </Link>
                <Link 
                  href="/gallery" 
                  className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition backdrop-blur-sm"
                >
                  View Our Work
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10 text-sm text-gray-400">
                <span>✅ 10+ Years Experience</span>
                <span>✅ Fully Insured</span>
                <span>✅ 24/7 Call-out</span>
              </div>
            </div>

            {/* RIGHT COLUMN - Plumbing Services Card (Recovery Vault style) */}
            <div className="relative hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-2xl">
                
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-300 uppercase tracking-wider">Available Services</p>
                    <h3 className="text-white text-xl font-bold">Plumbing & Heating</h3>
                  </div>
                  <div className="bg-[#C9A96E]/20 p-2 rounded-lg">
                    <span className="text-[#C9A96E] text-sm font-bold">24/7</span>
                  </div>
                </div>

                {/* Service Icons Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Burst Pipes', icon: '💧' },
                    { name: 'Boiler Repair', icon: '🔥' },
                    { name: 'Drainage', icon: '🚽' },
                    { name: 'Installations', icon: '🔧' },
                    { name: 'Emergency', icon: '🚨' },
                    { name: 'Heating', icon: '🌡️' },
                  ].map((service) => (
                    <div 
                      key={service.name}
                      className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition border border-white/5 hover:border-[#C9A96E]/30 group cursor-pointer"
                    >
                      <div className="text-2xl mb-1">{service.icon}</div>
                      <p className="text-white text-xs font-medium group-hover:text-[#C9A96E] transition">
                        {service.name}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
                  <a 
                    href={`tel:${BRAND.emergencyPhone}`}
                    className="bg-[#C9A96E] text-[#1A2E3F] py-2 rounded-xl font-bold text-sm hover:bg-[#B89A5E] transition text-center"
                  >
                    📞 Call Now
                  </a>
                  <Link 
                    href="/quote"
                    className="bg-white/10 text-white py-2 rounded-xl font-bold text-sm hover:bg-white/20 transition border border-white/10 text-center"
                  >
                    📝 Get Quote
                  </Link>
                </div>

                {/* Trust Badge */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</span>
                    <span className="text-gray-300 text-xs">4.9/5 (127 reviews)</span>
                  </div>
                  <span className="text-[#C9A96E] text-xs font-bold">London's Best</span>
                </div>

              </div>

              {/* Floating decorative element */}
              <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-[#C9A96E]/10 rounded-full blur-2xl" />
            </div>

          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION (DYNAMIC) ===== */}
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