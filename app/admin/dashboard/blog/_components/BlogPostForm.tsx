'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogPostSchema, BlogPostInput } from '../../../../../schemas/blog';
import { Input } from '../../../../../components/ui/Input';
import { Textarea } from '../../../../../components/ui/Textarea';
import { Select } from '../../../../../components/ui/Select';
import { Button } from '../../../../../components/ui/Button';
import { Card } from '../../../../../components/ui/Card';
import { Upload, CheckCircle2 } from 'lucide-react';

interface BlogPostFormProps {
  initialData?: any;
  categories: { id: string; name: string }[];
  onSubmitAction: (data: BlogPostInput) => Promise<{ success: boolean; error?: string; slug?: string }>;
}

export function BlogPostForm({ initialData, categories, onSubmitAction }: BlogPostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File uploading states
  const [uploadState, setUploadState] = useState<{
    cover: boolean;
    featured: boolean;
  }>({
    cover: false,
    featured: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          categoryId: initialData.categoryId,
          author: initialData.author,
          content: initialData.content,
          shortDescription: initialData.shortDescription,
          coverImage: initialData.coverImage,
          featuredImage: initialData.featuredImage,
          readingTime: initialData.readingTime,
          seoTitle: initialData.seoTitle,
          seoDescription: initialData.seoDescription,
        }
      : {
          title: '',
          slug: '',
          categoryId: categories[0]?.id || '',
          author: 'Admin',
          content: '',
          shortDescription: '',
          coverImage: '',
          featuredImage: '',
          readingTime: 5,
          seoTitle: '',
          seoDescription: '',
        },
  });

  const watchedCoverImage = watch('coverImage');
  const watchedFeaturedImage = watch('featuredImage');

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'coverImage' | 'featuredImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileTypeKey = fieldName === 'coverImage' ? 'cover' : 'featured';
    
    setUploadState((prev) => ({ ...prev, [fileTypeKey]: true }));
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed.');
      }

      setValue(fieldName, result.url);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setUploadState((prev) => ({ ...prev, [fileTypeKey]: false }));
    }
  };

  const onSubmit = async (data: BlogPostInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await onSubmitAction(data);
      if (res.success) {
        router.push('/admin/dashboard/blog');
        router.refresh();
      } else {
        setError(res.error || 'Failed to publish blog post.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  const selectOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 font-sans max-w-4xl">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-100 font-sans">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Left Column: Post Details */}
        <div className="md:col-span-8 space-y-6">
          <Card>
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold border-b border-zinc-100 pb-2">Article Details</h2>
              
              <Input
                {...register('title')}
                label="Article Title *"
                error={errors.title?.message}
                disabled={isSubmitting}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  {...register('author')}
                  label="Author *"
                  error={errors.author?.message}
                  disabled={isSubmitting}
                />
                
                <Select
                  {...register('categoryId')}
                  label="Category *"
                  options={selectOptions}
                  error={errors.categoryId?.message}
                  disabled={isSubmitting}
                  placeholder="Select blog category"
                />
              </div>

              <Textarea
                {...register('shortDescription')}
                label="Short Description *"
                rows={3}
                error={errors.shortDescription?.message}
                disabled={isSubmitting}
              />

              <Textarea
                {...register('content')}
                label="Content *"
                rows={12}
                placeholder="Write your article content here..."
                error={errors.content?.message}
                disabled={isSubmitting}
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Images & SEO */}
        <div className="md:col-span-4 space-y-6">
          <Card>
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold border-b border-zinc-100 pb-2">Media & Layout</h2>
              
              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Cover Image * (Optimized WebP)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex h-10 cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white px-4 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-700">
                    <Upload className="mr-2 h-4 w-4 text-zinc-400" />
                    <span>{uploadState.cover ? 'Uploading WebP...' : 'Choose Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'coverImage')}
                      disabled={uploadState.cover || isSubmitting}
                    />
                  </label>
                  {watchedCoverImage && (
                    <div className="flex items-center gap-2">
                      <img src={watchedCoverImage} alt="Cover preview" className="h-10 w-10 object-cover rounded shadow" />
                    </div>
                  )}
                </div>
                {errors.coverImage && <p className="text-xs text-red-500 font-medium">{errors.coverImage.message}</p>}
              </div>

              {/* Reading Time */}
              <Input
                {...register('readingTime')}
                label="Est. Reading Time (mins) *"
                type="number"
                error={errors.readingTime?.message}
                disabled={isSubmitting}
              />
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold border-b border-zinc-100 pb-2">SEO Optimizations</h2>
              
              <Input
                {...register('slug')}
                label="Custom URL Slug (Optional)"
                placeholder="e.g. how-to-build-wealth"
                error={errors.slug?.message}
                disabled={isSubmitting}
              />

              <Input
                {...register('seoTitle')}
                label="SEO Meta Title"
                placeholder="Keep under 70 characters"
                error={errors.seoTitle?.message}
                disabled={isSubmitting}
              />

              <Textarea
                {...register('seoDescription')}
                label="SEO Meta Description"
                placeholder="Keep under 160 characters"
                rows={3}
                error={errors.seoDescription?.message}
                disabled={isSubmitting}
              />
            </div>
          </Card>

          <Button type="submit" className="w-full h-12" isLoading={isSubmitting}>
            Publish Blog Article
          </Button>
        </div>
      </div>
    </form>
  );
}
