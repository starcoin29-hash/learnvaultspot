import React from 'react';
import { notFound } from 'next/navigation';
import { getBookById, getBookCategories, updateBook } from '../../../../../../actions/books';
import { BookForm } from '../../_components/BookForm';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: Props) {
  const { id } = await params;
  const book = await getBookById(id);
  const categories = await getBookCategories();

  if (!book) {
    notFound();
  }

  // Bind the book ID to the Server Action so the form can call it with only data
  const updateBookWithId = updateBook.bind(null, id);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">Edit Published Ebook</h1>
        <p className="text-xs text-zinc-400">Modify cover, pricing, ratings, or PDF file paths for this book.</p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-150 p-6 md:p-8 shadow-sm">
        <BookForm
          initialData={book}
          categories={categories}
          onSubmitAction={updateBookWithId}
        />
      </div>
    </div>
  );
}
