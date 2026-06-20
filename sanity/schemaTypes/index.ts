// sanity/schemaTypes/index.ts
// Full schema for Is Plumbing Solution website

import { defineType, defineField, defineArrayMember } from 'sanity';

// ============================================
// 1. BLOG POST SCHEMA
// ============================================
export const blogPostSchema = defineType({
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Post Title', 
      type: 'string', 
      validation: Rule => Rule.required() 
    }),
    defineField({ 
      name: 'slug', 
      title: 'URL Slug (e.g., "how-to-fix-a-leak")', 
      type: 'slug', 
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required() 
    }),
    defineField({ 
      name: 'excerpt', 
      title: 'Short Summary', 
      type: 'text', 
      rows: 3 
    }),
    defineField({ 
      name: 'featuredImage', 
      title: 'Main Image', 
      type: 'image', 
      options: { hotspot: true } 
    }),
    defineField({ 
      name: 'content', 
      title: 'Full Article', 
      type: 'array', 
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({ type: 'image', options: { hotspot: true } })
      ] 
    }),
    defineField({ 
      name: 'tags', 
      title: 'Tags (e.g., "Boiler", "Emergency")', 
      type: 'array', 
      of: [{ type: 'string' }],
      options: { layout: 'tags' } 
    }),
    defineField({ 
      name: 'publishDate', 
      title: 'Publish Date', 
      type: 'datetime', 
      initialValue: () => new Date().toISOString() 
    }),
  ],
  orderings: [
    { 
      title: 'Newest First', 
      name: 'publishDateDesc', 
      by: [{ field: 'publishDate', direction: 'desc' }] 
    }
  ]
});

// ============================================
// 2. HYPER-LOCAL LANDING PAGES SCHEMA
// ============================================
export const pageSchema = defineType({
  name: 'page',
  title: 'Landing Pages (Boroughs)',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Page Title (e.g., Plumber in Kensington)', 
      type: 'string', 
      validation: Rule => Rule.required() 
    }),
    defineField({ 
      name: 'slug', 
      title: 'URL Slug (e.g., "kensington")', 
      type: 'slug', 
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required() 
    }),
    defineField({ 
      name: 'content', 
      title: 'Page Content', 
      type: 'array', 
      of: [defineArrayMember({ type: 'block' })] 
    }),
    defineField({ 
      name: 'seoTitle', 
      title: 'SEO Title (for Google)', 
      type: 'string' 
    }),
    defineField({ 
      name: 'seoDescription', 
      title: 'SEO Description (for Google)', 
      type: 'text', 
      rows: 2 
    }),
  ]
});

// ============================================
// 3. SITE SETTINGS (SOCIAL MEDIA) SCHEMA
// ============================================
export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings (Social Media)',
  type: 'document',
  fields: [
    defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'twitter', title: 'Twitter / X URL', type: 'url' }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
  ]
});

// ============================================
// 4. BEFORE & AFTER PROJECTS SCHEMA (with Status)
// ============================================
export const projectSchema = defineType({
  name: 'project',
  title: 'Before & After Projects (Work Gallery)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Project Title', type: 'string' }),
    defineField({ 
      name: 'status', 
      title: 'Current Status', 
      type: 'string', 
      options: { 
        list: [
          { title: '✅ Completed', value: 'completed' },
          { title: '🔄 In Progress', value: 'in-progress' }
        ] 
      },
      initialValue: 'completed'
    }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ 
      name: 'beforeImage', 
      title: 'Before Image', 
      type: 'image', 
      options: { hotspot: true } 
    }),
    defineField({ 
      name: 'afterImage', 
      title: 'After Image', 
      type: 'image', 
      options: { hotspot: true } 
    }),
  ],
  orderings: [
    { 
      title: 'Newest First', 
      name: 'createdAtDesc', 
      by: [{ field: '_createdAt', direction: 'desc' }] 
    }
  ]
});

// ============================================
// 5. SERVICES SCHEMA (NEW - What We Fix)
// ============================================
export const serviceSchema = defineType({
  name: 'service',
  title: 'Services (What We Fix)',
  type: 'document',
  fields: [
    defineField({ 
      name: 'name', 
      title: 'Service Name (e.g., Boiler Repair)', 
      type: 'string', 
      validation: Rule => Rule.required() 
    }),
    defineField({ 
      name: 'slug', 
      title: 'URL Slug (e.g., "boiler-repair")', 
      type: 'slug', 
      options: { source: 'name', maxLength: 96 } 
    }),
    defineField({ 
      name: 'description', 
      title: 'Short Description', 
      type: 'text', 
      rows: 3 
    }),
    defineField({ 
      name: 'icon', 
      title: 'Icon (emoji, e.g., 🔥)', 
      type: 'string' 
    }),
    defineField({ 
      name: 'order', 
      title: 'Display Order (1, 2, 3...)', 
      type: 'number', 
      initialValue: 0 
    }),
  ],
  orderings: [{ 
    title: 'Order', 
    name: 'orderAsc', 
    by: [{ field: 'order', direction: 'asc' }] 
  }]
});

// ============================================
// 6. EXPORT ALL SCHEMAS
// ============================================
export const schemaTypes = [
  blogPostSchema, 
  pageSchema, 
  siteSettingsSchema, 
  projectSchema, 
  serviceSchema  // <-- NEW ONE ADDED
];
