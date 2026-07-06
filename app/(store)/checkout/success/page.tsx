import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { db } from '../../../../lib/db';
import { orders } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { Badge } from '../../../../components/Badge';
import { CheckCircle2, Download, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../../../utils/date';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    redirect('/books');
  }

  // 1. Fetch order details from database using token
  const order = await db.query.orders.findFirst({
    where: eq(orders.downloadToken, token),
    with: {
      book: {
        with: {
          category: true,
        },
      },
    },
  });

  // 2. Return invalid state if order is not completed
  if (!order || order.status !== 'completed') {
    return (
      <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="mx-auto max-w-md text-center bg-white border border-zinc-100 p-8 rounded-3xl shadow-sm space-y-6 font-sans">
          <div className="flex justify-center text-red-500">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-zinc-900">Download Token Invalid</h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            The link you followed is missing a valid authorization token or has expired. If you made a successful payment, please contact support.
          </p>
          <Link
            href="/books"
            className="w-full inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-xs font-semibold text-zinc-50 transition-colors hover:bg-zinc-800"
          >
            Return to Bookstore
          </Link>
        </div>
      </div>
    );
  }

  const book = order.book;

  return (
    <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl bg-white border border-zinc-100 p-8 sm:p-12 rounded-3xl shadow-sm space-y-8 font-sans">
        
        {/* Animated Check Icon */}
        <div className="text-center space-y-4">
          <div className="flex justify-center text-emerald-500">
            <CheckCircle2 className="h-16 w-16 fill-emerald-50" />
          </div>
          <Badge variant="success">Payment Completed Successfully</Badge>
          <h1 className="font-serif text-3xl font-extrabold text-zinc-950">Thank You for Your Order!</h1>
          <p className="text-xs text-zinc-400">Order Ref: {order.paymentReference} | Date: {formatDate(order.createdAt)}</p>
        </div>

        {/* Ebook Details Card */}
        <div className="rounded-2xl border border-zinc-100 bg-[#FAF7F0]/40 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative aspect-[3/4] w-24 flex-shrink-0 shadow-lg rounded-lg overflow-hidden border border-zinc-100">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="space-y-1.5 text-center sm:text-left flex-grow">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{book.category?.name}</span>
            <h2 className="font-serif text-lg font-bold text-zinc-900">{book.title}</h2>
            <p className="text-xs text-zinc-500">By {book.author}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-2 text-[10px] text-zinc-400 font-medium">
              <span>Size: {book.fileSize}</span>
              <span>•</span>
              <span>Pages: {book.pages} pages</span>
            </div>
          </div>
        </div>

        {/* Dynamic Watermark Notification */}
        <div className="rounded-xl border border-zinc-200/50 bg-[#FAF7F0] p-4 flex gap-3 text-xs leading-relaxed text-zinc-600">
          <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-zinc-800">Dynamic License Watermarked:</strong>
            <p className="mt-1">
              To secure copyrights, your download copy has been stamped with a visible licensing text containing your name (<strong className="text-zinc-800">{order.customerName}</strong>) and email (<strong className="text-zinc-800">{order.customerEmail}</strong>). Sharing or distributing this file will violate licensing policies.
            </p>
          </div>
        </div>

        {/* Secure Download Trigger */}
        <div className="space-y-4 pt-4 border-t border-zinc-100">
          <div className="flex flex-col gap-2">
            <a
              href={`/api/download?token=${token}`}
              className="w-full inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-6 font-semibold text-zinc-50 shadow-md transition-all hover:bg-zinc-800 hover:scale-[1.01]"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Your Ebook (PDF)
            </a>
            <p className="text-[10px] text-center text-zinc-400">
              * The download will start immediately. This link allows up to 10 download attempts.
            </p>
          </div>

          <div className="pt-4 flex justify-between items-center text-xs">
            <Link href="/" className="text-zinc-400 hover:text-zinc-700">
              Go back home
            </Link>
            <Link href="/blog" className="inline-flex items-center font-semibold text-zinc-900 hover:text-zinc-700">
              Read our latest articles <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
