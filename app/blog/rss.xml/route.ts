// app/blog/rss.xml/route.ts
import { sanityClient } from '@/lib/sanity';
import { BRAND } from '@/lib/config';

export async function GET() {
  const query = `*[_type == "blogPost"] | order(publishDate desc) [0...20] {
    title,
    slug,
    excerpt,
    publishDate,
    "image": featuredImage.asset->url
  }`;
  const posts = await sanityClient.fetch(query);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BRAND.name} Blog</title>
    <link>https://your-vercel-url.vercel.app/blog</link>
    <description>Expert plumbing tips and industry insights.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.map((post: any) => `
      <item>
        <title>${post.title}</title>
        <link>https://your-vercel-url.vercel.app/blog/${post.slug.current}</link>
        <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
        <description>${post.excerpt || ''}</description>
      </item>
    `).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { 'Content-Type': 'application/rss+xml' },
  });
}