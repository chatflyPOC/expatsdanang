#!/usr/bin/env node

/**
 * Convert markdown guides to Supabase format
 * Usage: npx ts-node scripts/convert-markdown-to-guides.ts
 * Output: supabase/import-data/guides.json (ready for Supabase bulk insert)
 */

import fs from 'fs';
import path from 'path';

interface GuideMetadata {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  updated: string;
  published?: string;
  author?: { name: string; title?: string; bio?: string };
  sources?: Array<{ title: string; url: string }>;
}

interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content_html: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  og_image_url: string;
  read_time: string;
  status: 'published' | 'draft';
  published_at: string | null;
  updated_at: string;
  created_at: string;
  author_name: string | null;
  author_title: string | null;
  author_bio: string | null;
  author_avatar_url: string | null;
  reviewed_at: string | null;
  key_takeaways: string[];
  faqs: Array<{ q: string; a: string }>;
  sources: Array<{ title: string; url: string }>;
}

// Map of markdown filenames to category + author metadata
const GUIDE_METADATA: Record<string, GuideMetadata> = {
  // Motorcycle rentals (Transport)
  'motorcycle-first-timer-checklist.md': {
    slug: 'motorcycle-first-timer-checklist',
    title: 'Motorcycle Rental Checklist for First-Timers',
    excerpt: 'Essential pre-rental inspection, paperwork checklist, and safety protocol.',
    category: 'Transport',
    readTime: '6 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist', bio: 'Nam helps expats navigate transportation and relocation.' },
  },
  'solo-female-rider-itineraries.md': {
    slug: 'solo-female-rider-itineraries',
    title: 'Solo Female Rider Itineraries: 3-Day Routes Through Central Vietnam',
    excerpt: 'Three proven itineraries for women riders with safety considerations.',
    category: 'Transport',
    readTime: '7 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist' },
  },
  'motorcycle-vs-guided-tours.md': {
    slug: 'motorcycle-vs-guided-tours',
    title: 'Motorcycle Rental vs Guided Tours: Which Is Right for Your Trip?',
    excerpt: 'Cost, flexibility, safety, and experience comparison.',
    category: 'Transport',
    readTime: '7 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist' },
  },
  'monsoon-motorcycle-safety.md': {
    slug: 'monsoon-motorcycle-safety',
    title: 'Monsoon Motorcycle Riding: Safety Guide for June–August',
    excerpt: 'Rain, wind, flooding — how to stay safe during monsoon season.',
    category: 'Transport',
    readTime: '6 min read',
    updated: 'September 2026',
    author: { name: 'Minh Pham', title: 'Transport Expert' },
  },
  'international-driving-permit-2026.md': {
    slug: 'international-driving-permit-2026',
    title: 'International Driving Permit (IDP) for Motorcycle Rentals: 2026 Guide',
    excerpt: 'Which IDP format is valid, how to obtain it, police checkpoints.',
    category: 'Transport',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist' },
  },
  'best-motorcycle-seasons-vietnam.md': {
    slug: 'best-motorcycle-seasons-vietnam',
    title: 'Best Motorcycle Riding Seasons in Vietnam',
    excerpt: 'Month-by-month weather, traffic, and tourism season breakdown.',
    category: 'Transport',
    readTime: '6 min read',
    updated: 'September 2026',
    author: { name: 'Minh Pham', title: 'Transport Expert' },
  },
  'southeast-asia-motorcycle-tour.md': {
    slug: 'southeast-asia-motorcycle-tour',
    title: 'Multi-Country Motorcycle Tour: Vietnam–Thailand–Laos Guide',
    excerpt: '2,000+ km across three countries, border crossings, documentation.',
    category: 'Transport',
    readTime: '8 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist' },
  },
  'motorcycle-camping-overland.md': {
    slug: 'motorcycle-camping-overland',
    title: 'Motorcycle Camping & Overland Travel',
    excerpt: 'Luggage solutions, camping routes, budget breakdown.',
    category: 'Transport',
    readTime: '6 min read',
    updated: 'September 2026',
    author: { name: 'Nam Tran', title: 'Relocation Specialist' },
  },

  // Housing rentals (Housing)
  'temporary-residence-registration-guide.md': {
    slug: 'temporary-residence-registration-guide',
    title: 'Temporary Residence Registration (TRR) Guide',
    excerpt: '24-hour police filing requirement, paperwork, costs, and renewal.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  'long-term-apartment-negotiation.md': {
    slug: 'long-term-apartment-negotiation',
    title: 'Long-Term Apartment Rental Negotiation',
    excerpt: 'Leverage points, negotiation scripts, and red flags.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  'best-neighborhoods-expats-da-nang.md': {
    slug: 'best-neighborhoods-expats-da-nang',
    title: 'Best Neighborhoods for Expats in Da Nang',
    excerpt: 'My Khe, An Thuong, Ngu Hanh Son — cost, lifestyle, community.',
    category: 'Housing',
    readTime: '7 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  'unfurnished-apartment-guide.md': {
    slug: 'unfurnished-apartment-guide',
    title: 'Unfurnished Apartment Rental: What\'s Included & What You Buy',
    excerpt: 'Furniture costs, setup timeline, hidden expenses.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  'digital-nomad-housing-monthly.md': {
    slug: 'digital-nomad-housing-monthly',
    title: 'Digital Nomad Housing: Monthly Flexibility',
    excerpt: 'Co-living, Airbnb, month-to-month rental options.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  'apartment-utilities-guide.md': {
    slug: 'apartment-utilities-guide',
    title: 'Apartment Utilities Explained: Electricity, Water & Backup Power',
    excerpt: 'Tropical costs, billing, power cuts, backup solutions.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  'short-term-vs-long-term-rental.md': {
    slug: 'short-term-vs-long-term-rental',
    title: 'Short-Term vs Long-Term Apartment Rental',
    excerpt: 'Cost analysis, seasonal pricing, when to choose each.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  'finding-roommates-expats.md': {
    slug: 'finding-roommates-expats',
    title: 'Finding Roommates in Da Nang: Expat Edition',
    excerpt: 'Save 40-50% on rent, vetting, house rules, expense splitting.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  'apartment-rental-scams-avoid.md': {
    slug: 'apartment-rental-scams-avoid',
    title: 'Apartment Rental Scams: How to Avoid Common Fraud',
    excerpt: '8 common scams, red flags, and recovery steps.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  'renovating-rental-landlord-permission.md': {
    slug: 'renovating-rental-landlord-permission',
    title: 'Renovating Your Rental: What You Can Change',
    excerpt: 'What requires permission, what you can\'t touch, paint restoration.',
    category: 'Housing',
    readTime: '4 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
  'air-conditioning-humidity-tropical-tips.md': {
    slug: 'air-conditioning-humidity-tropical-tips',
    title: 'Air Conditioning & Humidity: Tropical Rental Living Tips',
    excerpt: 'AC maintenance, mold prevention, electricity cost management.',
    category: 'Housing',
    readTime: '5 min read',
    updated: 'September 2026',
    author: { name: 'Linh Nguyen', title: 'Housing Expert' },
  },
};

function markdownToHtml(markdown: string): string {
  // Basic markdown to HTML conversion
  // For production, use a proper markdown parser like marked or remark
  let html = markdown;

  // Headings
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/__( ?.*? ?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // Code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Line breaks and paragraphs
  html = html.split('\n\n').map(para => {
    if (para.match(/^(<h|<ul|<ol|<table|<blockquote)/)) return para;
    if (para.trim()) return `<p>${para}</p>`;
    return '';
  }).join('\n');

  return html;
}

function extractFaqs(content: string): Array<{ q: string; a: string }> {
  const faqs: Array<{ q: string; a: string }> = [];
  const faqRegex = /\*\*Q: (.*?)\*\*\s*\n\s*A: (.*?)(?=\n\n|\*\*Q:|$)/gs;
  let match;
  while ((match = faqRegex.exec(content)) !== null) {
    faqs.push({ q: match[1].trim(), a: match[2].trim() });
  }
  return faqs;
}

function extractKeyTakeaways(title: string, content: string): string[] {
  // Simple heuristic: take first 3 bullet points or main claims
  const takeaways: string[] = [];
  const bullets = content.match(/^[-*] .+$/gm) || [];
  return bullets.slice(0, 3).map(b => b.replace(/^[-*]\s+/, ''));
}

function generateFocusKeyword(title: string, slug: string): string {
  // Extract primary keyword from slug
  return slug.split('-').slice(0, 3).join(' ');
}

function generateMetaTitle(title: string): string {
  const maxLen = 60;
  if (title.length <= maxLen) return title;
  return title.substring(0, maxLen - 3) + '...';
}

function generateMetaDescription(excerpt: string): string {
  const maxLen = 160;
  if (excerpt.length <= maxLen) return excerpt;
  return excerpt.substring(0, maxLen - 3) + '...';
}

function dateToISO(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  const months: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  };
  const match = dateStr.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return null;
  const month = months[match[1].toLowerCase()];
  if (!month) return null;
  return `${match[2]}-${String(month).padStart(2, '0')}-01T00:00:00Z`;
}

function convertGuide(filename: string, content: string): Guide | null {
  const meta = GUIDE_METADATA[filename];
  if (!meta) {
    console.warn(`⚠️  No metadata for ${filename} — skipping`);
    return null;
  }

  const publishedAt = dateToISO(meta.published || meta.updated);
  const updatedAt = dateToISO(meta.updated) || new Date().toISOString();

  return {
    slug: meta.slug,
    title: meta.title,
    excerpt: meta.excerpt,
    category: meta.category,
    content_html: markdownToHtml(content),
    meta_title: generateMetaTitle(meta.title),
    meta_description: generateMetaDescription(meta.excerpt),
    focus_keyword: generateFocusKeyword(meta.title, meta.slug),
    og_image_url: `/og-${meta.slug}.png`, // Placeholder for image generation
    read_time: meta.readTime,
    status: 'published',
    published_at: publishedAt,
    updated_at: updatedAt,
    created_at: updatedAt,
    author_name: meta.author?.name || null,
    author_title: meta.author?.title || null,
    author_bio: meta.author?.bio || null,
    author_avatar_url: meta.author ? `/authors/${meta.slug.split('-')[0]}.png` : null,
    reviewed_at: dateToISO(meta.updated),
    key_takeaways: extractKeyTakeaways(meta.title, content),
    faqs: extractFaqs(content),
    sources: meta.sources || [],
  };
}

async function main() {
  const contentDir = path.join(process.cwd(), 'content');
  const guides: Guide[] = [];

  if (!fs.existsSync(contentDir)) {
    console.error(`❌ Content directory not found: ${contentDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  console.log(`📖 Found ${files.length} markdown files\n`);

  for (const file of files) {
    const filepath = path.join(contentDir, file);
    const content = fs.readFileSync(filepath, 'utf-8');
    const guide = convertGuide(file, content);
    if (guide) {
      guides.push(guide);
      console.log(`✓ ${guide.slug}`);
    }
  }

  // Create output directory
  const outputDir = path.join(process.cwd(), 'supabase/import-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write JSON file
  const outputFile = path.join(outputDir, 'guides.json');
  fs.writeFileSync(outputFile, JSON.stringify(guides, null, 2));

  console.log(`\n✅ Converted ${guides.length} guides`);
  console.log(`📁 Output: ${outputFile}`);
  console.log('\n📋 Next steps:');
  console.log('1. Run migration: supabase/migrations/002_guides_table.sql');
  console.log('2. Import data via Supabase Dashboard → SQL Editor');
  console.log('   INSERT INTO guides (...) VALUES (...)');
}

main().catch(console.error);
