import React from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostById, getBlogCategories, updateBlogPost } from '../../../../../../actions/blog';
import { BlogPostForm } from '../../_components/BlogPostForm';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  const categories = await getBlogCategories();

  if (!post) {
    notFound();
  }

  // Bind the post ID to the Server Action so the form can call it with only data
  const updateBlogPostWithId = updateBlogPost.bind(null, id);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">Edit Published Article</h1>
        <p className="text-xs text-zinc-400">Modify content, category, reading times, or SEO configurations.</p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-150 p-6 md:p-8 shadow-sm">
        <BlogPostForm
          initialData={post}
          categories={categories}
          onSubmitAction={updateBlogPostWithId}
        />
      </div>
    </div>
  );
}
