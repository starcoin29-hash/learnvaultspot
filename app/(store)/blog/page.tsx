import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, getBlogCategories } from '../../../actions/blog';
import { Badge } from '../../../components/Badge';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { formatDate } from '../../../utils/date';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeCategorySlug = params.category || '';
  const searchQuery = params.search || '';

  const allPosts = await getBlogPosts();
  const categories = await getBlogCategories();

  // Filter posts on the server
  const filteredPosts = allPosts.filter((post) => {
    // 1. Category filter
    if (activeCategorySlug && post.category?.slug !== activeCategorySlug) {
      return false;
    }
    // 2. Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(query);
      const matchDesc = post.shortDescription.toLowerCase().includes(query);
      const matchAuthor = post.author.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchAuthor) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Vault Blog', href: '/blog' }]} />

        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900">
              The Vault Blog
            </h1>
            <p className="text-zinc-500 font-sans text-sm sm:text-base leading-relaxed">
              In-depth analysis and expert perspectives on Education, Wealth, Health, and Relationships.
            </p>
          </div>

          {/* Search bar */}
          <form action="/blog" method="GET" className="flex max-w-sm items-center gap-2">
            {activeCategorySlug && (
              <input type="hidden" name="category" value={activeCategorySlug} />
            )}
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search articles..."
              className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:border-transparent dark:border-zinc-800 dark:bg-zinc-950"
            />
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-zinc-50 shadow-sm transition-colors hover:bg-zinc-800"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-100 pb-4">
          <Link
            href="/blog"
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              !activeCategorySlug
                ? 'bg-zinc-900 text-zinc-50'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            All Categories
          </Link>
          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}${searchQuery ? `&search=${searchQuery}` : ''}`}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-50'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-zinc-100 p-8 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-zinc-900">No articles found</h3>
            <p className="text-sm text-zinc-500 font-sans mt-1">
              Try adjusting your search terms or selecting another category.
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-5 text-xs font-semibold text-zinc-50 transition-all hover:bg-zinc-800"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          /* Blog Grid */
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 border-b border-zinc-50">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">{post.category?.name}</Badge>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
                    <span>{formatDate(post.publishedDate)}</span>
                    <span>•</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                  
                  <h3 className="mt-2 font-serif text-base font-bold text-zinc-900 leading-tight group-hover:text-zinc-700">
                    {post.title}
                  </h3>
                  
                  <p className="mt-2 text-xs text-zinc-500 font-sans leading-relaxed line-clamp-3">
                    {post.shortDescription}
                  </p>
                  
                  <div className="mt-auto pt-4 flex items-center text-xs font-semibold text-zinc-900 group-hover:text-zinc-600">
                    Read Article <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
