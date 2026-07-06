import React from 'react';
import { getBookCategories, createBook } from '../../../../../actions/books';
import { BookForm } from '../_components/BookForm';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../components/ui/Card';

export const dynamic = 'force-dynamic';

export default async function NewBookPage() {
  const categories = await getBookCategories();

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">Publish New Ebook</h1>
        <p className="text-xs text-zinc-400">Add ebook cover, PDF files, and custom star ratings details.</p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-150 p-6 md:p-8 shadow-sm">
        <BookForm categories={categories} onSubmitAction={createBook} />
      </div>
    </div>
  );
}
