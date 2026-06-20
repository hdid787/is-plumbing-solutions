'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteSchema, QuoteFormData } from '@/lib/validations';
import { CldUploadWidget } from 'next-cloudinary';
import Link from 'next/link';
import { BRAND } from '@/lib/config';

export default function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setError('');
    try {
      const payload = { ...data, imageUrl };
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to send quote');
      }
      setSuccess(true);
      reset();
      setImageUrl('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/services" className="text-[#C9A96E] hover:underline text-sm font-bold inline-flex items-center gap-1">
          ← Back to Services
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-[#1A2E3F]">📝 Request a Quote</h1>
      <p className="text-gray-600 mt-2 mb-8">
        Fill in the details below and upload a photo of the issue for a faster quote.
      </p>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-800">Quote Request Sent!</h2>
          <p className="text-green-700">We will review your request and call you shortly.</p>
          <p className="text-sm text-gray-500 mt-4">
            Need immediate help? Call us: <a href={`tel:${BRAND.emergencyPhone}`} className="text-[#1A2E3F] font-bold">{BRAND.emergencyPhone}</a>
          </p>
        </div>
      ) : (
        <>
          {/* Urgent callout */}
          <div className="bg-[#1A2E3F] text-white rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">🚨 Urgent?</span>
              <span className="text-gray-300 text-sm ml-2">Call our emergency line for immediate help.</span>
            </div>
            <a 
              href={`tel:${BRAND.emergencyPhone}`}
              className="bg-[#C9A96E] text-[#1A2E3F] px-4 py-2 rounded-full font-bold text-sm hover:bg-[#B89A5E] transition text-center whitespace-nowrap"
            >
              📞 {BRAND.emergencyPhone}
            </a>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <label className="block text-sm font-bold text-[#1A2E3F]">Full Name *</label>
              <input {...register('name')} className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9A96E] focus:border-transparent outline-none" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2E3F]">Email Address *</label>
              <input {...register('email')} type="email" className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9A96E] focus:border-transparent outline-none" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2E3F]">Phone Number</label>
              <input {...register('phone')} type="tel" className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9A96E] focus:border-transparent outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2E3F]">Describe the Issue *</label>
              <textarea {...register('description')} rows={4} className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C9A96E] focus:border-transparent outline-none" />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A2E3F]">Upload a Photo (Optional)</label>
              <div className="mt-2 flex items-center gap-4 flex-wrap">
                <CldUploadWidget 
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={(result: any) => {
                    setImageUrl(result.info.secure_url);
                  }}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="bg-gray-100 hover:bg-gray-200 text-[#1A2E3F] px-4 py-2 rounded-xl text-sm font-medium transition border border-gray-300">
                      📷 Upload Photo
                    </button>
                  )}
                </CldUploadWidget>
                {imageUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-sm font-bold">✅ Photo Uploaded!</span>
                    <button type="button" onClick={() => setImageUrl('')} className="text-red-500 text-sm hover:underline">Remove</button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Upload a clear photo of the leak or issue.</p>
            </div>

            {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">{error}</div>}

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#1A2E3F] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2A4055] transition disabled:opacity-50">
              {isSubmitting ? 'Sending...' : '📨 Send Quote Request'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}