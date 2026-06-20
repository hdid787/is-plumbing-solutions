import { sanityClient } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { BRAND } from '@/lib/config';

// ============================================
// DYNAMIC SEO METADATA (per post)
// ============================================
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
  return {
    title: `${post.title} – ${BRAND.name} Blog`,
    description: post.excerpt || `Read expert plumbing advice from ${BRAND.name}.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Expert plumbing tips from ${BRAND.name}.`,
      images: post.featuredImage ? [post.featuredImage.asset.url] : [],
    },
  };
}

// ============================================
// GENERATE STATIC PATHS
// ============================================
export async function generateStaticParams() {
  const query = `*[_type == "blogPost"]{ "slug": slug.current }`;
  const posts = await sanityClient.fetch(query);
  return posts.map((post: any) => ({ slug: post.slug }));
}

// ============================================
// FETCH BLOG POST
// ============================================
async function getBlogPost(slug: string) {
  const query = `*[_type == "blogPost" && slug.current == $slug][0]{
    title,
    content,
    featuredImage,
    publishDate,
    excerpt,
    tags,
    "estimatedReadingTime": round(length(pt::text(content)) / 200)
  }`;
  return await sanityClient.fetch(query, { slug });
}

// ============================================
// BLOG DETAIL PAGE
// ============================================
export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  if (!post) return notFound();

  // Build the share URL for social media
  const shareUrl = `https://your-vercel-url.vercel.app/blog/${params.slug}`;
  const shareText = `Check out this article: ${post.title}`;

  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      
      {/* ===== BACK BUTTON ===== */}
      <div className="mb-8">
        <Link href="/blog" className="text-[#C9A96E] hover:underline text-sm font-bold inline-flex items-center gap-2">
          ← Back to Blog
        </Link>
      </div>

      {/* ===== HEADER ===== */}
      <header>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A2E3F]">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
          <span>
            📅 {post.publishDate ? format(new Date(post.publishDate), 'dd MMMM yyyy') : 'Draft'}
          </span>
          {post.estimatedReadingTime && (
            <span>⏱️ {post.estimatedReadingTime} min read</span>
          )}
        </div>
      </header>

      {/* ===== FEATURED IMAGE ===== */}
      {post.featuredImage && (
        <div className="relative h-96 w-full rounded-2xl overflow-hidden mb-10 mt-6">
          <Image 
            src={post.featuredImage.asset.url} 
            alt={post.title} 
            fill 
            className="object-cover"
            priority // Loads faster since it's above the fold
          />
        </div>
      )}

      {/* ===== ARTICLE CONTENT ===== */}
      <div className="prose prose-lg prose-headings:text-[#1A2E3F] prose-a:text-[#C9A96E] max-w-none">
        {post.content ? <PortableText value={post.content} /> : <p>No content yet.</p>}
      </div>

      {/* ===== TAGS ===== */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-10 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-500 mr-2">Tags:</span>
          {post.tags.map((tag: string) => (
            <span key={tag} className="bg-gray-100 text-[#1A2E3F] px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ===== SOCIAL SHARING ===== */}
      <div className="mt-10 pt-10 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-500 mb-3">Share this article:</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded-full text-sm font-medium transition"
          >
            🐦 Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-4 py-2 rounded-full text-sm font-medium transition"
          >
            👍 Facebook
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0A66C2] hover:bg-[#0957a8] text-white px-4 py-2 rounded-full text-sm font-medium transition"
          >
            💼 LinkedIn
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert('Link copied to clipboard!');
            }}
            className="bg-gray-200 hover:bg-gray-300 text-[#1A2E3F] px-4 py-2 rounded-full text-sm font-medium transition"
          >
            📋 Copy Link
          </button>
        </div>
      </div>

      {/* ===== CALL-TO-ACTION: GET A QUOTE ===== */}
      <div className="mt-12 bg-[#1A2E3F] rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Need plumbing help?</h2>
        <p className="text-gray-300 mt-2">
          Get a free quote from {BRAND.name} – expert plumbers across London.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link 
            href="/quote" 
            className="bg-[#C9A96E] text-[#1A2E3F] px-6 py-3 rounded-full font-bold hover:bg-[#B89A5E] transition"
          >
            📝 Get a Free Quote
          </Link>
          <Link 
            href="/appointment" 
            className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-full font-bold hover:bg-white/20 transition"
          >
            📅 Book Appointment
          </Link>
        </div>
      </div>

      {/* ===== SUBSCRIBE NEWSLETTER ===== */}
      <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
        <h3 className="text-xl font-bold text-[#1A2E3F]">📬 Stay Updated</h3>
        <p className="text-gray-600 text-sm mt-1">
          Subscribe to our newsletter for expert plumbing tips and exclusive offers.
        </p>
        <form className="max-w-md mx-auto mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A96E] focus:border-transparent outline-none"
            required
          />
          <button
            type="submit"
            className="bg-[#1A2E3F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2A4055] transition whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">No spam. Unsubscribe anytime.</p>
      </div>
    </article>
  );
}