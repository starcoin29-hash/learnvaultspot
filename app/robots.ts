import { MetadataRoute } from 'next';

const FALLBACK_URL = 'https://learnvaultspot.vercel.app';

function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/^['"]|['"]$/g, '').trim();
  if (!raw) return FALLBACK_URL;
  let url = raw;
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  url = url.replace(/\/+$/, '');
  try { new URL(url); return url; } catch { return FALLBACK_URL; }
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Protect admin dashboards and routes from crawling
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
