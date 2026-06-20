import { sanityClient } from '@/lib/sanity';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { BRAND } from '@/lib/config';

// ============================================
// SEO METADATA
// ============================================
export const metadata = {
  title: `Blog – ${BRAND.name}`,
  description: 'Expert plumbing tips, maintenance guides, and industry insights from the team at Is Plumbing Solution. Stay informed and save on repairs.',
};

// ============================================
// FETCH BLOG POSTS FROM SANITY
// ============================================
async function getBlogPosts() {
  const query = `*[_type == "blogPost"] | order(publishDate desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishDate,
    tags
  }`;
  return await sanityClient.fetch(query);
}

// ============================================
// BLOG PAGE COMPONENT
// ============================================
export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-5xl font-bold text-[#1A2E3F]">📰 Plumbing News & Tips</h1>
          <p className="text-gray-600 mt-2">
            Expert advice from the {BRAND.name} team. 
            {posts.length > 0 && ` ${posts.length} articles published.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Internal link to services (improves SEO) */}
          <Link 
            href="/services" 
            className="bg-gray-100 hover:bg-gray-200 text-[#1A2E3F] px-4 py-2 rounded-full text-sm font-medium transition"
          >
            🔧 Our Services
          </Link>
          {/* RSS Feed link (for news readers) */}
          <a 
            href="/blog/rss.xml" 
            className="bg-[#1A2E3F] hover:bg-[#2A4055] text-white px-4 py-2 rounded-full text-sm font-medium transition"
          >
            📡 RSS Feed
          </a>
        </div>
      </div>

      {/* POSTS GRID */}
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No blog posts yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Log into the <Link href="/studio" className="text-[#C9A96E] hover:underline">Admin Panel</Link> and write your first article!
          </p>
        </div>
      ) : (
        <>
          {/* Show categories / tags cloud (optional SEO boost) */}
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mr-2">Popular tags:</span>
            {posts
              .flatMap((post: any) => post.tags || [])
              .slice(0, 8)
              .map((tag: string) => (
                <span key={tag} className="bg-gray-100 text-[#1A2E3F] text-xs px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
          </div>

          {/* Blog posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link href={`/blog/${post.slug.current}`} key={post._id} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition border border-gray-100 h-full flex flex-col">
                  {post.featuredImage ? (
                    <div className="relative h-56 bg-gray-200 overflow-hidden">
                      <Image 
                        src={post.featuredImage.asset.url} 
                        alt={post.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-[#1A2E3F] to-[#2A4055] flex items-center justify-center">
                      <span className="text-4xl">🔧</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="bg-[#1A2E3F] text-white text-xs px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {post.tags?.length > 2 && (
                        <span className="text-gray-400 text-xs px-2 py-1">
                          +{post.tags.length - 2} more
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-[#1A2E3F] group-hover:text-[#C9A96E] transition line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2 flex-grow">
                      {post.excerpt || 'Read the full article for expert plumbing advice.'}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        {post.publishDate ? format(new Date(post.publishDate), 'dd MMM yyyy') : 'Draft'}
                      </p>
                      <span className="text-[#C9A96E] text-sm font-medium group-hover:underline">
                        Read more →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer note */}
          <div className="text-center mt-16 text-sm text-gray-400 border-t border-gray-100 pt-8">
            <p>
              Stay updated with the latest plumbing tips. <br className="sm:hidden" />
              Follow us on <Link href="#" className="text-[#C9A96E] hover:underline">social media</Link> for daily advice.
            </p>
          </div>
        </>
      )}
    </div>
  );
}