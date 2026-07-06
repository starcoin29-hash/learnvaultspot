import React from 'react';
import Link from 'next/link';
import { getBlogPosts, getBlogCategories, deleteBlogPost, createBlogCategory } from '../../../../actions/blog';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/Badge';
import { Button } from '../../../../components/ui/Button';
import { Edit2, Plus, ListPlus, FileText } from 'lucide-react';
import { formatDate } from '../../../../utils/date';
import { DeleteButton } from '../../../../components/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const postsList = await getBlogPosts();
  const categories = await getBlogCategories();

  // Inline action for category creation
  const handleCreateCategory = async (formData: FormData) => {
    'use server';
    const name = formData.get('name') as string;
    await createBlogCategory(name);
  };

  // Inline action for blog post deletion
  const handleDeletePost = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    await deleteBlogPost(id);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">Blog Post Management</h1>
          <p className="text-xs text-zinc-400">Write, edit, and categorize informational essays across core pillars.</p>
        </div>
        <Link
          href="/admin/dashboard/blog/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-zinc-50 transition-colors hover:bg-zinc-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Write New Article
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-12 items-start">
        
        {/* Posts List Table (8 cols) */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-zinc-400" />
                Active Article Directory
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {postsList.length === 0 ? (
                <div className="text-center py-16 text-sm text-zinc-400">
                  No articles found in the database.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 font-semibold">
                        <th className="p-4">Cover</th>
                        <th className="p-4">Title & Author</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Read Time</th>
                        <th className="p-4">Published Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {postsList.map((post) => (
                        <tr key={post.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                          <td className="p-4">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="h-10 w-16 rounded object-cover shadow-sm border border-zinc-100"
                            />
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-zinc-850 dark:text-zinc-200">{post.title}</div>
                            <div className="text-[10px] text-zinc-450">By {post.author}</div>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary">{post.category?.name}</Badge>
                          </td>
                          <td className="p-4 font-medium">
                            {post.readingTime} mins
                          </td>
                          <td className="p-4 text-zinc-400">
                            {formatDate(post.publishedDate)}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <Link
                                href={`/admin/dashboard/blog/${post.id}/edit`}
                                className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Link>
                              <DeleteButton
                                id={post.id}
                                deleteAction={handleDeletePost}
                                confirmMessage="Are you sure you want to delete this blog post? This will soft-delete the record."
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
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
                Add Blog Category
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
                    placeholder="e.g. Health Hacks"
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
              <CardTitle className="text-base font-bold">Blog Categories</CardTitle>
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
