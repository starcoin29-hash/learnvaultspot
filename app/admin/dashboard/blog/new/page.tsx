import React from 'react';
import { getBlogCategories, createBlogPost } from '../../../../../actions/blog';
import { BlogPostForm } from '../_components/BlogPostForm';

export const dynamic = 'force-dynamic';

export default async function NewBlogPostPage() {
  const categories = await getBlogCategories();

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">Write New Article</h1>
        <p className="text-xs text-zinc-400">Write informational blog essays, set WebP covers, slugs, and custom meta tags.</p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-150 p-6 md:p-8 shadow-sm">
        <BlogPostForm categories={categories} onSubmitAction={createBlogPost} />
      </div>
    </div>
  );
}
