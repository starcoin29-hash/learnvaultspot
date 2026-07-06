import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getBookById } from '../../../../actions/books';
import { Stars } from '../../../../components/Stars';
import { Badge } from '../../../../components/Badge';
import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { CheckoutForm } from '../../../../components/CheckoutForm';
import { BookGallery } from '../../../../components/BookGallery';
import { generateSEOMetadata, generateBookSchema } from '../../../../lib/seo';
import { formatDate } from '../../../../utils/date';
import { FileText, Globe, Calendar, FolderOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

function getPurchaseDisplay(book: any) {
  if (book.purchaseCountOverride !== null && book.purchaseCountOverride !== undefined) {
    return `Purchased by ${book.purchaseCountOverride.toLocaleString()} readers`;
  }
  const completedCount = book.orders?.filter((o: any) => o.status === 'completed').length || 0;
  return `Purchased by ${completedCount.toLocaleString()} readers`;
}

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return {
      title: 'Book Not Found | Learn Vault',
    };
  }

  return generateSEOMetadata({
    title: book.title,
    description: book.description.substring(0, 155) + '...',
    image: book.coverImage,
    slug: `/books/${book.id}`,
    type: 'book',
  });
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const finalPrice = book.discountPrice ? parseFloat(book.discountPrice) : parseFloat(book.price);
  
  // Construct Book JSON-LD Schema
  const schemaData = generateBookSchema({
    title: book.title,
    subtitle: book.subtitle,
    author: book.author,
    description: book.description,
    price: finalPrice.toString(),
    image: book.coverImage,
    pages: book.pages,
    ratingValue: book.rating,
    reviewCount: book.reviewCount || 1,
  });

  return (
    <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Books', href: '/books' },
            { label: book.title, href: `/books/${book.id}` },
          ]}
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          
          {/* Left Column: Images */}
          <div className="lg:col-span-5">
            <BookGallery coverImage={book.coverImage} images={book.images} />
          </div>

          {/* Right Column: Title, pricing & checkout form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{book.category?.name}</Badge>
              {book.isBestseller && <Badge variant="accent">Best Seller</Badge>}
              {book.isFeatured && <Badge variant="default">Featured</Badge>}
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="text-xl text-zinc-500 font-light italic">{book.subtitle}</p>
              )}
            </div>

            {/* Author */}
            <p className="text-sm text-zinc-500">
              By <span className="font-semibold text-zinc-800">{book.author}</span>
            </p>

            {/* Rating Stars & Purchase count */}
            <div className="flex items-center gap-4">
              <Stars rating={parseFloat(book.rating)} count={book.reviewCount} />
              <span className="text-xs text-zinc-400">•</span>
              <span className="text-xs font-semibold text-zinc-600 bg-[#F5F2EB] px-2.5 py-0.5 rounded-full">
                {getPurchaseDisplay(book)}
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 pt-2">
              {book.discountPrice ? (
                <>
                  <span className="text-3xl font-extrabold text-zinc-900">
                    ₦{finalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-zinc-400 line-through">
                    ₦{parseFloat(book.price).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-zinc-900">
                  ₦{parseFloat(book.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-zinc dark:prose-invert font-sans text-sm sm:text-base leading-relaxed text-zinc-600 space-y-4 pt-2 border-t border-zinc-100">
              <h3 className="font-serif text-base font-bold text-zinc-900">Book Description</h3>
              <p className="whitespace-pre-line leading-relaxed">{book.description}</p>
            </div>

            {/* Ebook Tech Specs */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-zinc-100 py-4 font-sans text-xs">
              <div className="flex items-center gap-2 text-zinc-600">
                <FileText className="h-4 w-4 text-zinc-400" />
                <span>Pages: <strong className="text-zinc-800">{book.pages} pages</strong></span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <FolderOpen className="h-4 w-4 text-zinc-400" />
                <span>File Size: <strong className="text-zinc-800">{book.fileSize}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <Globe className="h-4 w-4 text-zinc-400" />
                <span>Language: <strong className="text-zinc-800">{book.language}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <span>Published: <strong className="text-zinc-800">{formatDate(book.publicationDate)}</strong></span>
              </div>
            </div>

            {/* Guest Checkout Form */}
            <CheckoutForm
              bookId={book.id}
              bookTitle={book.title}
              price={book.price}
              discountPrice={book.discountPrice}
            />

          </div>
        </div>

      </div>
    </div>
  );
}
