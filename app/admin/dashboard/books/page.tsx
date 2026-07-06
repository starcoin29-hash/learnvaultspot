import React from 'react';
import Link from 'next/link';
import { getBooks, getBookCategories, deleteBook, createBookCategory } from '../../../../actions/books';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/Badge';
import { Stars } from '../../../../components/Stars';
import { Button } from '../../../../components/ui/Button';
import { Edit2, Plus, ListPlus, BookOpen } from 'lucide-react';
import { redirect } from 'next/navigation';
import { DeleteButton } from '../../../../components/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminBooksPage() {
  const booksList = await getBooks();
  const categories = await getBookCategories();

  // Inline action for category creation
  const handleCreateCategory = async (formData: FormData) => {
    'use server';
    const name = formData.get('name') as string;
    await createBookCategory(name);
  };

  // Inline action for book deletion
  const handleDeleteBook = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    await deleteBook(id);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">Ebook Management</h1>
          <p className="text-xs text-zinc-400">Publish, modify, delete guides and configure reviews metrics.</p>
        </div>
        <Link
          href="/admin/dashboard/books/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-zinc-50 transition-colors hover:bg-zinc-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Book
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-12 items-start">
        
        {/* Books List Table (8 cols) */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-zinc-400" />
                Active Ebook Directory
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {booksList.length === 0 ? (
                <div className="text-center py-16 text-sm text-zinc-400">
                  No ebooks found in the database.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 font-semibold">
                        <th className="p-4">Cover</th>
                        <th className="p-4">Title & Author</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Ratings (Stars)</th>
                        <th className="p-4">Override</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {booksList.map((book) => {
                        const hasDiscount = book.discountPrice !== null && book.discountPrice !== undefined;
                        return (
                          <tr key={book.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                            <td className="p-4">
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="h-12 w-9 rounded object-cover shadow-sm border border-zinc-100"
                              />
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-zinc-850 dark:text-zinc-200">{book.title}</div>
                              <div className="text-[10px] text-zinc-400">By {book.author}</div>
                            </td>
                            <td className="p-4">
                              <Badge variant="secondary">{book.category?.name}</Badge>
                            </td>
                            <td className="p-4 font-semibold">
                              {hasDiscount ? (
                                <div className="space-y-0.5">
                                  <div className="font-bold text-zinc-900">₦{parseFloat(book.discountPrice!).toLocaleString()}</div>
                                  <div className="text-[10px] text-zinc-450 line-through">₦{parseFloat(book.price).toLocaleString()}</div>
                                </div>
                              ) : (
                                <div className="font-bold text-zinc-900">₦{parseFloat(book.price).toLocaleString()}</div>
                              )}
                            </td>
                            <td className="p-4">
                              <Stars rating={parseFloat(book.rating)} count={book.reviewCount} showText={false} />
                              <div className="text-[10px] text-zinc-400 mt-1">{book.rating} ({book.reviewCount} reviews)</div>
                            </td>
                            <td className="p-4 text-center font-mono font-medium text-zinc-500">
                              {book.purchaseCountOverride !== null ? book.purchaseCountOverride : 'None'}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end items-center gap-2">
                                <Link
                                  href={`/admin/dashboard/books/${book.id}/edit`}
                                  className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Link>
                                <DeleteButton
                                  id={book.id}
                                  deleteAction={handleDeleteBook}
                                  confirmMessage="Are you sure you want to delete this book? This will soft-delete the record."
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Categories Sidebar (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Create Category Form */}
          <Card>
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ListPlus className="h-4 w-4 text-zinc-400" />
                Add Book Category
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form action={handleCreateCategory} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Category Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Wealth Expansion"
                    className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Category
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Categories List */}
          <Card>
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <CardTitle className="text-base font-bold">Subject Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                {categories.map((cat) => (
                  <li key={cat.id} className="p-4 flex items-center justify-between text-zinc-700 dark:text-zinc-300">
                    <span className="font-semibold">{cat.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400">{cat.slug}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
