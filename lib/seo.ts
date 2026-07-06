import { Metadata } from 'next';

interface SEOOptions {
  title: string;
  description: string;
  image?: string;
  slug?: string;
  type?: 'website' | 'article' | 'book';
  publishedTime?: string;
  author?: string;
  keywords?: string[];
}

/**
 * Generates standard Next.js Metadata objects for App Router pages.
 * Integrates openGraph, twitter, canonical URLs, and schema requirements.
 */
export function generateSEOMetadata(options: SEOOptions): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://learnvault.com';
  const cleanSlug = options.slug?.startsWith('/') ? options.slug : `/${options.slug || ''}`;
  const canonicalUrl = `${siteUrl}${cleanSlug}`;
  
  const siteTitle = `${options.title} | Learn Vault`;
  const siteDescription = options.description;
  const ogImageUrl = options.image || `${siteUrl}/og-image.webp`;

  return {
    title: siteTitle,
    description: siteDescription,
    keywords: options.keywords || ['education', 'wealth', 'health', 'relationship', 'ebooks', 'blog'],
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: canonicalUrl,
      siteName: 'Learn Vault',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
      type: options.type || 'website',
      ...(options.type === 'article' && options.publishedTime
        ? {
            publishedTime: options.publishedTime,
            authors: options.author ? [options.author] : undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [ogImageUrl],
      creator: '@learnvault',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Returns structured JSON-LD data for product search results (e.g. for Google Rich Snippets / Google Books schema).
 */
export function generateBookSchema(book: {
  title: string;
  subtitle?: string | null;
  author: string;
  description: string;
  price: string;
  image: string;
  pages: number;
  isbn?: string;
  ratingValue: string;
  reviewCount: number;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://learnvault.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    'name': book.title,
    'alternativeHeadline': book.subtitle || undefined,
    'author': {
      '@type': 'Person',
      'name': book.author,
    },
    'description': book.description,
    'image': book.image,
    'numberOfPages': book.pages,
    'offers': {
      '@type': 'Offer',
      'price': book.price,
      'priceCurrency': 'NGN',
      'availability': 'https://schema.org/InStock',
      'url': siteUrl,
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': book.ratingValue,
      'reviewCount': book.reviewCount || 1,
      'bestRating': '5',
      'worstRating': '1',
    },
  };
}

/**
 * Returns structured JSON-LD data for a Blog Article schema.
 */
export function generateArticleSchema(post: {
  title: string;
  description: string;
  image: string;
  author: string;
  publishedDate: string;
  slug: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://learnvault.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.description,
    'image': post.image,
    'author': {
      '@type': 'Person',
      'name': post.author,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Learn Vault',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/logo.png`,
      },
    },
    'datePublished': post.publishedDate,
    'url': `${siteUrl}/blog/${post.slug}`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
  };
}
