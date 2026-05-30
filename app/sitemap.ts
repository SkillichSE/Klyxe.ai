import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://klyxe.ai';
  const staticPages = [
    { path: '/', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/about', priority: 0.5, changeFreq: 'monthly' as const },
    { path: '/playground', priority: 0.7, changeFreq: 'weekly' as const },
    { path: '/chat', priority: 0.6, changeFreq: 'weekly' as const },
    { path: '/rankings', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/providers', priority: 0.8, changeFreq: 'daily' as const },
    { path: '/news', priority: 0.6, changeFreq: 'daily' as const },
    { path: '/trends', priority: 0.7, changeFreq: 'daily' as const },
    { path: '/search', priority: 0.4, changeFreq: 'weekly' as const },
    { path: '/lab', priority: 0.3, changeFreq: 'monthly' as const },
    { path: '/articles', priority: 0.5, changeFreq: 'weekly' as const },
    { path: '/landing', priority: 0.4, changeFreq: 'monthly' as const },
    { path: '/auth', priority: 0.2, changeFreq: 'monthly' as const },
  ];
  return staticPages.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }));
}
