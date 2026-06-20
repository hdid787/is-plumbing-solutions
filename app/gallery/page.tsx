import { sanityClient } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/config';

// ============================================
// SEO METADATA
// ============================================
export const metadata = {
  title: `Before & After Gallery – ${BRAND.name}`,
  description: 'See real plumbing projects completed by our team. Before and after photos of boiler repairs, pipework, and full installations across London.',
};

// ============================================
// FETCH PROJECTS FROM SANITY
// ============================================
export const revalidate = 10;

async function getProjects() {
  const query = `*[_type == "project"] | order(_createdAt desc) {
    _id, title, description, status,
    "beforeImage": beforeImage.asset->url,
    "afterImage": afterImage.asset->url
  }`;
  return await sanityClient.fetch(query);
}

// ============================================
// GALLERY PAGE COMPONENT
// ============================================
export default async function GalleryPage() {
  const projects = await getProjects();

  // Count projects by status for the filter buttons
  const completedCount = projects.filter((p: any) => p.status === 'completed').length;
  const inProgressCount = projects.filter((p: any) => p.status === 'in-progress').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#1A2E3F]">Before & After</h1>
          <p className="text-gray-600 mt-2">See the difference {BRAND.name} makes to London homes.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/services" 
            className="bg-gray-100 hover:bg-gray-200 text-[#1A2E3F] px-4 py-2 rounded-full text-sm font-medium transition"
          >
            🔧 View Our Services
          </Link>
        </div>
      </div>

      {/* FILTER BUTTONS - ALWAYS VISIBLE EVEN WITH NO PROJECTS */}
      <div className="flex flex-wrap gap-3 mb-10">
        <a 
          href="#all" 
          className="bg-[#1A2E3F] text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-[#2A4055] transition"
        >
          All Projects ({projects.length})
        </a>
        <a 
          href="#completed" 
          className="bg-green-100 text-green-800 px-6 py-2 rounded-full font-bold text-sm hover:bg-green-200 transition"
        >
          ✅ Completed ({completedCount})
        </a>
        <a 
          href="#in-progress" 
          className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-200 transition"
        >
          🔄 In Progress ({inProgressCount})
        </a>
      </div>

      {/* PROJECTS GRID */}
      {projects.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No projects uploaded yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Log into the <Link href="/studio" className="text-[#C9A96E] hover:underline">Admin Panel</Link> to add your first Before & After!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project: any, index: number) => (
            <div 
              key={project._id} 
              id={project.status === 'completed' ? 'completed' : 'in-progress'} // Anchor for hash links
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition scroll-mt-20"
            >
              <div className="grid grid-cols-2 gap-1">
                <div className="relative h-64 bg-gray-100">
                  {project.beforeImage ? (
                    <Image 
                      src={project.beforeImage} 
                      alt={`Before – ${project.title || 'Project'}`} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 2}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEFORE
                  </span>
                </div>
                <div className="relative h-64 bg-gray-100">
                  {project.afterImage ? (
                    <Image 
                      src={project.afterImage} 
                      alt={`After – ${project.title || 'Project'}`} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                  <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    AFTER
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#1A2E3F]">{project.title || 'Project'}</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    project.status === 'in-progress' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {project.status === 'in-progress' ? '🔄 In Progress' : '✅ Completed'}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}