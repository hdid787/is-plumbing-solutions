// app/components/Footer.tsx
import { BRAND } from '@/lib/config';
import { sanityClient } from '@/lib/sanity';
import Link from 'next/link';

async function getSocialLinks() {
  const query = `*[_type == "siteSettings"][0]{
    facebook, instagram, twitter, linkedin, youtube
  }`;
  return await sanityClient.fetch(query).catch(() => null);
}

export default async function Footer() {
  const social = await getSocialLinks();

  return (
    <footer className="bg-[#1A2E3F] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1 – Company Info */}
        <div>
          <h3 className="text-[#C9A96E] font-bold text-lg">{BRAND.name}</h3>
          <p className="text-gray-400 text-sm mt-2">{BRAND.address}</p>
          <p className="text-gray-400 text-sm">{BRAND.phone}</p>
        </div>

        {/* Column 2 – Quick Links */}
        <div>
          <h4 className="font-bold text-[#C9A96E]">Quick Links</h4>
          <ul className="text-sm space-y-2 mt-2 text-gray-300">
            <li><Link href="/services" className="hover:text-[#C9A96E]">Services</Link></li>
            <li><Link href="/gallery" className="hover:text-[#C9A96E]">Gallery</Link></li>
            <li><Link href="/blog" className="hover:text-[#C9A96E]">Blog</Link></li>
            <li><Link href="/quote" className="hover:text-[#C9A96E]">Quote</Link></li>
            <li><Link href="/appointment" className="hover:text-[#C9A96E]">Appointment</Link></li>
          </ul>
        </div>

        {/* Column 3 – Social Media */}
        <div>
          <h4 className="font-bold text-[#C9A96E]">Follow Us</h4>
          <div className="flex flex-wrap gap-3 mt-2">
            {social?.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-2xl">📸</a>}
            {social?.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-2xl">👍</a>}
            {social?.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-2xl">🐦</a>}
            {social?.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-2xl">💼</a>}
            {social?.youtube && <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-2xl">▶️</a>}
          </div>
          <p className="text-xs text-gray-500 mt-2">Update these in Sanity → Site Settings</p>
        </div>

        {/* Column 4 – Work Hours */}
        <div>
          <h4 className="font-bold text-[#C9A96E]">Work Hours</h4>
          <p className="text-sm text-gray-300 mt-2">Mon - Fri: 7am - 10pm</p>
          <p className="text-sm text-gray-300">Sat - Sun: 8am - 8pm</p>
          <p className="text-sm text-[#C9A96E] font-bold mt-2">24/7 Emergency</p>
        </div>
      </div>

      {/* ===== LEGAL ROW – Company Registration & Copyright ===== */}
      <div className="border-t border-white/10 max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
        <p>
          {BRAND.name} – Company No. {BRAND.companyRegistration}
          {BRAND.vatNumber && ` | VAT: ${BRAND.vatNumber}`}
        </p>
        <p className="mt-1">
          &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}