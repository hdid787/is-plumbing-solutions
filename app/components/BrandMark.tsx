import { BRAND } from '@/lib/config';

export default function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-[#1A2E3F] flex items-center justify-center border-2 border-[#C9A96E]">
        <span className="text-[#C9A96E] font-bold text-sm">LF</span>
      </div>
      <div className="leading-tight">
        <span className="block font-bold text-[#1A2E3F] text-lg tracking-tight">{BRAND.name}</span>
        <span className="block text-[10px] uppercase tracking-widest text-[#C9A96E] font-semibold">Plumbing & Heating</span>
      </div>
    </div>
  );
}