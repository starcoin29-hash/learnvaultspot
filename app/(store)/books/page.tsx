import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBooks, getBookCategories } from '../../../actions/books';
import { Stars } from '../../../components/Stars';
import { Badge } from '../../../components/Badge';
import { Breadcrumbs } from '../../../components/Breadcrumbs';

export const dynamic = 'force-dynamic';

function getPurchaseDisplay(book: any) {
  if (book.purchaseCountOverride !== null && book.purchaseCountOverride !== undefined) {
    return `Purchased by ${book.purchaseCountOverride.toLocaleString()} readers`;
  }
  const completedCount = book.orders?.filter((o: any) => o.status === 'completed').length || 0;
  return `Purchased by ${completedCount.toLocaleString()} readers`;
}

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function BooksPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeCategorySlug = params.category || '';
  const searchQuery = params.search || '';

  const allBooks = await getBooks();
  const categories = await getBookCategories();

  // Filter books on the server based on params
  const filteredBooks = allBooks.filter((book) => {
    // 1. Filter by category slug
    if (activeCategorySlug && book.category?.slug !== activeCategorySlug) {
      return false;
    }
    // 2. Filter by search term
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = book.title.toLowerCase().includes(query);
      const matchSubtitle = book.subtitle?.toLowerCase().includes(query);
      const matchAuthor = book.author.toLowerCase().includes(query);
      if (!matchTitle && !matchSubtitle && !matchAuthor) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Navigation breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Digital Library', href: '/books' }]} />

        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900">
              The Digital Library
            </h1>
            <p className="text-zinc-500 font-sans text-sm sm:text-base leading-relaxed">
              Curated collection of guidebooks for wealth acquisition, health optimization, and relationships.
            </p>
          </div>

          {/* Text Search Input (Submits as GET request) */}
          <form action="/books" method="GET" className="flex max-w-sm items-center gap-2">
            {activeCategorySlug && (
              <input type="hidden" name="category" value={activeCategorySlug} />
            )}
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search by title or author..."
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
            href="/books"
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              !activeCategorySlug
                ? 'bg-zinc-900 text-zinc-50'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            All Subjects
          </Link>
          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/books?category=${cat.slug}${searchQuery ? `&search=${searchQuery}` : ''}`}
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
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-zinc-100 p-8">
            <h3 className="font-serif text-lg font-bold text-zinc-900">No books found</h3>
            <p className="text-sm text-zinc-500 font-sans mt-1">
              Try adjusting your search query or subject filters.
            </p>
            <Link
              href="/books"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-5 text-xs font-semibold text-zinc-50 transition-all hover:bg-zinc-800"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          /* Book Grid */
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
            {filteredBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`} className="group flex flex-col">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-100 shadow-sm transition-all duration-300 hover:shadow-md group-hover:scale-[1.01] border border-zinc-100">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {book.isBestseller && <Badge variant="accent">Bestseller</Badge>}
                    {book.isFeatured && <Badge variant="default">Featured</Badge>}
                  </div>
                </div>

                <div className="mt-4 flex flex-col flex-grow">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400">{book.category?.name}</span>
                  <h3 className="mt-1 font-serif text-sm font-bold text-zinc-900 group-hover:text-zinc-700 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">By {book.author}</p>
                  
                  <div className="mt-2 flex items-center gap-1.5">
                    <Stars rating={parseFloat(book.rating)} showText={false} />
                    <span className="text-[10px] text-zinc-400 font-sans">{getPurchaseDisplay(book)}</span>
                  </div>

                  <div className="mt-auto pt-3 flex items-baseline gap-2">
                    {book.discountPrice ? (
                      <>
                        <span className="text-sm font-bold text-zinc-900">₦{parseFloat(book.discountPrice).toLocaleString()}</span>
                        <span className="text-xs text-zinc-400 line-through">₦{parseFloat(book.price).toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-zinc-900">₦{parseFloat(book.price).toLocaleString()}</span>
                    )}
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
