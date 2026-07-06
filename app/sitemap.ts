import { MetadataRoute } from 'next';
import { getBooks } from '../actions/books';
import { getBlogPosts } from '../actions/blog';

export const dynamic = 'force-dynamic';

function getCleanSiteUrl(): string {
  let url = process.env.NEXT_PUBLIC_APP_URL || '';
  
  // Strip surrounding quotes and whitespace
  url = url.replace(/^['"]|['"]$/g, '').trim();
  
  if (!url) {
    return 'https://learnvault.com'; // Default fallback
  }
  
  // Enforce protocol prefix
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  
  // Remove trailing slashes
  return url.replace(/\/+$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getCleanSiteUrl();
  
  // Static Routes
  const staticRoutes = [
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
