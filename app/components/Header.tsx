// app/components/Header.tsx
'use client';

import Link from 'next/link';
import BrandMark from './BrandMark';
import { useState } from 'react';
import { BRAND } from '@/lib/config';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-[#E5E0D8] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href="/">
          <BrandMark />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1A2E3F]">
          <Link href="/" className="hover:text-[#C9A96E] transition">Home</Link>
          <Link href="/services" className="hover:text-[#C9A96E] transition">Services</Link> {/* NEW */}
          <Link href="/gallery" className="hover:text-[#C9A96E] transition">Before & After</Link>
          <Link href="/blog" className="hover:text-[#C9A96E] transition">Blog</Link>
          <Link href="/quote" className="hover:text-[#C9A96E] transition">Get a Quote</Link>
          <Link href="/appointment" className="hover:text-[#C9A96E] transition">Book Now</Link>
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${BRAND.emergencyPhone}`} className="bg-[#C9A96E] text-[#1A2E3F] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#B89A5E] transition shadow-lg shadow-[#C9A96E]/30 hidden md:inline-block">
            📞 Emergency
          </a>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
          <Link href="/" className="block text-[#1A2E3F] font-medium hover:text-[#C9A96E]" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/services" className="block text-[#1A2E3F] font-medium hover:text-[#C9A96E]" onClick={() => setIsOpen(false)}>Services</Link> {/* NEW */}
          <Link href="/gallery" className="block text-[#1A2E3F] font-medium hover:text-[#C9A96E]" onClick={() => setIsOpen(false)}>Before & After</Link>
          <Link href="/blog" className="block text-[#1A2E3F] font-medium hover:text-[#C9A96E]" onClick={() => setIsOpen(false)}>Blog</Link>
          <Link href="/quote" className="block text-[#1A2E3F] font-medium hover:text-[#C9A96E]" onClick={() => setIsOpen(false)}>Get a Quote</Link>
          <Link href="/appointment" className="block text-[#1A2E3F] font-medium hover:text-[#C9A96E]" onClick={() => setIsOpen(false)}>Book Now</Link>
          <a href={`tel:${BRAND.emergencyPhone}`} className="block bg-[#C9A96E] text-[#1A2E3F] px-4 py-2 rounded-full text-center font-bold">
            📞 Emergency Call
          </a>
        </div>
      )}
    </header>
  );
}