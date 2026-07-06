import React from 'react';
import Link from 'next/link';
import { ShieldQuestion, Home, ArrowLeft } from 'lucide-react';
import { Badge } from '../components/Badge';

export default function NotFound() {
  return (
    <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-md text-center bg-white border border-zinc-100 p-8 sm:p-12 rounded-3xl shadow-sm space-y-6">
        
        {/* Warning Icon */}
        <div className="flex justify-center text-zinc-400">
          <ShieldQuestion className="h-14 w-14" />
        </div>

        <Badge variant="secondary">Error 404</Badge>
        
        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-zinc-900">Vault Location Empty</h1>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
            The page you are looking for does not exist, has been moved, or resides in an encrypted directory.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-2">
          <Link
            href="/books"
            className="w-full inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-xs font-semibold text-zinc-50 transition-colors hover:bg-zinc-800"
          >
            Browse Books
          </Link>
          <Link
            href="/"
            className="w-full inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Go to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
