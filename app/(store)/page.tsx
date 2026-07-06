import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBooks } from '../../actions/books';
import { getBlogPosts } from '../../actions/blog';
import { Stars } from '../../components/Stars';
import { Badge } from '../../components/Badge';
import { BookOpen, TrendingUp, Heart, DollarSign, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/date';

export const dynamic = 'force-dynamic';

function getPurchaseDisplay(book: any) {
  if (book.purchaseCountOverride !== null && book.purchaseCountOverride !== undefined) {
    return `Purchased by ${book.purchaseCountOverride.toLocaleString()} readers`;
  }
  // Count successful orders
  const completedCount = book.orders?.filter((o: any) => o.status === 'completed').length || 0;
  return `Purchased by ${completedCount.toLocaleString()} readers`;
}

export default async function HomePage() {
  const booksData = await getBooks();
  const blogPostsData = await getBlogPosts();

  // Filter books
  const featuredBook = booksData.find((b) => b.isFeatured) || booksData[0];
  const latestBooks = booksData.slice(0, 4);
  const popularBooks = booksData.filter((b) => b.isBestseller || parseFloat(b.rating) >= 4.7).slice(0, 4);

  // Filter posts
  const latestArticles = blogPostsData.slice(0, 3);
  
  // Categorized content previews
  const educationPosts = blogPostsData.filter((p) => p.category?.name === 'Education').slice(0, 2);
  const wealthPosts = blogPostsData.filter((p) => p.category?.name === 'Wealth').slice(0, 2);
  const healthPosts = blogPostsData.filter((p) => p.category?.name === 'Health').slice(0, 2);
  const relationshipPosts = blogPostsData.filter((p) => p.category?.name === 'Relationship').slice(0, 2);

  return (
    <div className="flex flex-col w-full bg-[#FCFBF9] text-zinc-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-4 pt-20 pb-24 sm:px-6 lg:px-8 lg:pt-28 lg:pb-32 bg-gradient-to-b from-[#FAF7F0] to-[#FCFBF9]">
        <div className="mx-auto max-w-5xl text-center">
          <Badge variant="secondary" className="mb-6">
            Immediate Knowledge Access • No Accounts Required
          </Badge>
          <h1 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-zinc-900 leading-tight">
            Knowledge is a vault.<br />
            <span className="text-zinc-500 font-light italic">Unlock yours immediately.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-zinc-600 leading-relaxed font-sans">
            Learn Vault provides direct, uninhibited access to premium digital books and expert articles on Education, Wealth, Health, and Relationships. No registration. No passwords.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/books"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-6 font-semibold text-zinc-50 shadow-sm transition-all hover:bg-zinc-800"
            >
              Explore Bookstore
            </Link>
            <Link
              href="/blog"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 font-semibold text-zinc-800 transition-all hover:bg-zinc-50"
            >
              Read the Blog
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURED BOOK SPOTLIGHT */}
      {featuredBook && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-white border border-zinc-100 p-8 shadow-sm lg:p-12">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
              
              {/* Cover Image */}
              <div className="lg:col-span-5 flex justify-center mb-8 lg:mb-0">
                <div className="relative aspect-[3/4] w-64 md:w-80 shadow-2xl rounded-2xl overflow-hidden border border-zinc-100 transition-transform duration-300 hover:scale-[1.01]">
                  <Image
                    src={featuredBook.coverImage}
                    alt={featuredBook.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">Featured Ebook</Badge>
                  {featuredBook.isBestseller && <Badge variant="default">Best Seller</Badge>}
                </div>
                
                <div className="space-y-2">
                  <h2 className="font-serif text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
                    {featuredBook.title}
                  </h2>
                  {featuredBook.subtitle && (
                    <p className="text-lg text-zinc-500 font-light italic">{featuredBook.subtitle}</p>
                  )}
                </div>

                <p className="text-sm text-zinc-500">By <span className="font-semibold text-zinc-800">{featuredBook.author}</span></p>

                <div className="flex items-center gap-4">
                  <Stars rating={parseFloat(featuredBook.rating)} count={featuredBook.reviewCount} />
                  <span className="text-xs text-zinc-400 font-sans">•</span>
                  <span className="text-xs font-semibold text-zinc-500 bg-[#F5F2EB] px-2 py-0.5 rounded">
                    {getPurchaseDisplay(featuredBook)}
                  </span>
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed font-sans line-clamp-4">
                  {featuredBook.description}
                </p>

                <div className="flex items-baseline gap-3 pt-2">
                  {featuredBook.discountPrice ? (
                    <>
                      <span className="text-3xl font-extrabold text-zinc-900">
                        ₦{parseFloat(featuredBook.discountPrice).toLocaleString()}
                      </span>
                      <span className="text-sm text-zinc-400 line-through">
                        ₦{parseFloat(featuredBook.price).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-extrabold text-zinc-900">
                      ₦{parseFloat(featuredBook.price).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="pt-4">
                  <Link
                    href={`/books/${featuredBook.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-6 text-xs font-semibold text-zinc-50 transition-all hover:bg-zinc-800"
                  >
                    View Details & Buy
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. LATEST BOOKS GRID */}
      {latestBooks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-900">Latest Ebook Publications</h2>
              <p className="text-xs text-zinc-400 font-sans">Acquire knowledge instantly</p>
            </div>
            <Link href="/books" className="flex items-center text-xs font-semibold text-zinc-800 hover:text-zinc-600">
              View All Books <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
            {latestBooks.map((book) => (
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
        </section>
      )}

      {/* 4. PILLARS OF LIFE CATEGORIES SECTION */}
      <section className="bg-[#FAF7F0] py-20 border-t border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold tracking-tight">The Four Pillars of Self-Mastery</h2>
            <p className="text-sm text-zinc-500 font-sans mt-2">
              Our articles and books cover the essential facets of human fulfillment.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Education Pillar */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                  <BookOpen className="h-5 w-5" />
                </div>
                <Badge variant="secondary">Education</Badge>
              </div>
              <h3 className="font-serif text-lg font-bold">Unlocking Intellect</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                Accelerate learning, memory retention, critical thinking, and structured academic self-development.
              </p>
              <div className="pt-2">
                <Link href="/blog?category=education" className="inline-flex items-center text-xs font-semibold text-zinc-900 hover:text-zinc-600">
                  Read Articles <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Wealth Pillar */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                  <DollarSign className="h-5 w-5" />
                </div>
                <Badge variant="secondary">Wealth</Badge>
              </div>
              <h3 className="font-serif text-lg font-bold">Acquiring Freedom</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                Master finance, digital businesses, passive assets, investment philosophies, and wealth-building leverage.
              </p>
              <div className="pt-2">
                <Link href="/blog?category=wealth" className="inline-flex items-center text-xs font-semibold text-zinc-900 hover:text-zinc-600">
                  Read Articles <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Health Pillar */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-rose-50 text-rose-800 rounded-xl">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <Badge variant="secondary">Health</Badge>
              </div>
              <h3 className="font-serif text-lg font-bold">Optimizing Biology</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                Actionable content on nutrition, stress reduction, bio-hacking, physical fitness, and mental stamina.
              </p>
              <div className="pt-2">
                <Link href="/blog?category=health" className="inline-flex items-center text-xs font-semibold text-zinc-900 hover:text-zinc-600">
                  Read Articles <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Relationship Pillar */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-50 text-amber-800 rounded-xl">
                  <Heart className="h-5 w-5" />
                </div>
                <Badge variant="secondary">Relationship</Badge>
              </div>
              <h3 className="font-serif text-lg font-bold">Forging Connections</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                Deepen human links, emotional intelligence, family dynamics, partnerships, and professional network leverage.
              </p>
              <div className="pt-2">
                <Link href="/blog?category=relationship" className="inline-flex items-center text-xs font-semibold text-zinc-900 hover:text-zinc-600">
                  Read Articles <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. LATEST BLOG POSTS SECTION */}
      {latestArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-900">Latest Insights & Articles</h2>
              <p className="text-xs text-zinc-400 font-sans">Empowering essays on life optimization</p>
            </div>
            <Link href="/blog" className="flex items-center text-xs font-semibold text-zinc-900 hover:text-zinc-600">
              Read More Articles <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {latestArticles.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
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
        </section>
      )}

      {/* 6. CALL TO ACTION SECTION */}
      <section className="relative bg-zinc-900 text-zinc-50 py-20 text-center overflow-hidden border-t border-zinc-800">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
        
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <Badge variant="outline" className="mb-4 text-zinc-300 border-zinc-700">
            No Account Signups required
          </Badge>
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Acquire Knowledge Instantly
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-400 leading-relaxed font-sans">
            Browse our catalog, complete guest checkout, and immediately download watermarked digital copies to kickstart your growth.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/books"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-100"
            >
              Browse Digital Library
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
