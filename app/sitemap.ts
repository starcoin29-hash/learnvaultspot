import { MetadataRoute } from 'next';
import { getBooks } from '../actions/books';
import { getBlogPosts } from '../actions/blog';

export const dynamic = 'force-dynamic';

const FALLBACK_URL = 'https://learnvaultspot.vercel.app';

function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/^['"]|['"]$/g, '').trim();

  if (!raw) return FALLBACK_URL;

  let url = raw;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  url = url.replace(/\/+$/, '');

  // Final validation — if new URL() throws, fall back
  try {
    new URL(url);
    return url;
  } catch {
    return FALLBACK_URL;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/books',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Book Routes
  let bookRoutes: MetadataRoute.Sitemap = [];
  try {
    const books = await getBooks();
    bookRoutes = books.map((book) => ({
      url: `${siteUrl}/books/${book.id}`,
      lastModified: new Date(book.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating sitemap book routes:', error);
  }

  // Dynamic Blog Routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogPosts();
    blogRoutes = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error generating sitemap blog routes:', error);
  }

  return [...staticRoutes, ...bookRoutes, ...blogRoutes];
}
