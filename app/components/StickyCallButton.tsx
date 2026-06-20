'use client';
import { BRAND } from '@/lib/config';

export default function StickyCallButton() {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4 md:hidden">
      <a
        href={`tel:${BRAND.emergencyPhone}`}
        className="block w-full bg-[#C9A96E] text-[#1A2E3F] text-center py-4 rounded-2xl font-bold text-xl shadow-2xl shadow-[#C9A96E]/50 animate-pulse hover:animate-none transition"
      >
        📞 CALL NOW - 24/7 EMERGENCY
      </a>
    </div>
  );
}