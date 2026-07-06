'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookSchema, BookInput } from '../../../../../schemas/books';
import { Input } from '../../../../../components/ui/Input';
import { Textarea } from '../../../../../components/ui/Textarea';
import { Select } from '../../../../../components/ui/Select';
import { Button } from '../../../../../components/ui/Button';
import { Card } from '../../../../../components/ui/Card';
import { Loader2, Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface BookFormProps {
  initialData?: any;
  categories: { id: string; name: string }[];
  onSubmitAction: (data: BookInput) => Promise<{ success: boolean; error?: string; bookId?: string }>;
}

export function BookForm({ initialData, categories, onSubmitAction }: BookFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File uploading states
  const [uploadState, setUploadState] = useState<{
    cover: boolean;
    pdf: boolean;
    gallery: boolean;
    preview: boolean;
  }>({
    cover: false,
    pdf: false,
    gallery: false,
    preview: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookInput>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          subtitle: initialData.subtitle,
          author: initialData.author,
          description: initialData.description,
          price: parseFloat(initialData.price),
          discountPrice: initialData.discountPrice ? parseFloat(initialData.discountPrice) : null,
          categoryId: initialData.categoryId,
          language: initialData.language,
          fileSize: initialData.fileSize,
          pages: initialData.pages,
          coverImage: initialData.coverImage,
          pdfFilePath: initialData.pdfFilePath,
          isFeatured: initialData.isFeatured,
          isBestseller: initialData.isBestseller,
          rating: parseFloat(initialData.rating),
          reviewCount: initialData.reviewCount,
          purchaseCountOverride: initialData.purchaseCountOverride,
          galleryImages: initialData.images?.filter((i: any) => i.imageType === 'gallery').map((i: any) => i.imageUrl) || [],
          previewImages: initialData.images?.filter((i: any) => i.imageType === 'preview').map((i: any) => i.imageUrl) || [],
        }
      : {
          title: '',
          subtitle: '',
          author: '',
          description: '',
          price: 0,
          discountPrice: null,
          categoryId: categories[0]?.id || '',
          language: 'English',
          fileSize: '',
          pages: 0,
          coverImage: '',
          pdfFilePath: '',
          isFeatured: false,
          isBestseller: false,
          rating: 5.0,
          reviewCount: 0,
          purchaseCountOverride: null,
          galleryImages: [],
          previewImages: [],
        },
  });

  const watchedCoverImage = watch('coverImage');
  const watchedPdfFilePath = watch('pdfFilePath');
  const watchedGalleryImages = watch('galleryImages') || [];
  const watchedPreviewImages = watch('previewImages') || [];

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'pdf',
    fieldName: 'coverImage' | 'pdfFilePath' | 'galleryImages' | 'previewImages'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileTypeKey = fieldName === 'coverImage' ? 'cover' : fieldName === 'pdfFilePath' ? 'pdf' : fieldName === 'galleryImages' ? 'gallery' : 'preview';
    
    setUploadState((prev) => ({ ...prev, [fileTypeKey]: true }));
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed.');
      }

      if (fieldName === 'coverImage') {
        setValue('coverImage', result.url);
      } else if (fieldName === 'pdfFilePath') {
        setValue('pdfFilePath', result.path);
      } else if (fieldName === 'galleryImages') {
        setValue('galleryImages', [...watchedGalleryImages, result.url]);
      } else if (fieldName === 'previewImages') {
        setValue('previewImages', [...watchedPreviewImages, result.url]);
      }
    } catch (err: any) {
      console.error('File upload failed:', err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploadState((prev) => ({ ...prev, [fileTypeKey]: false }));
    }
  };

  const removeArrayImage = (index: number, fieldName: 'galleryImages' | 'previewImages') => {
    if (fieldName === 'galleryImages') {
      setValue(
        'galleryImages',
        watchedGalleryImages.filter((_, idx) => idx !== index)
      );
    } else {
      setValue(
        'previewImages',
        watchedPreviewImages.filter((_, idx) => idx !== index)
      );
    }
  };

  const onSubmit = async (data: BookInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await onSubmitAction(data);
      if (res.success) {
        router.push('/admin/dashboard/books');
        router.refresh();
      } else {
        setError(res.error || 'Failed to submit form.');
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
        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Left Column: Form Details */}
        <div className="md:col-span-8 space-y-6">
          <Card>
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold border-b border-zinc-100 pb-2">Ebook Details</h2>
              
              <Input
                {...register('title')}
                label="Book Title *"
                error={errors.title?.message}
                disabled={isSubmitting}
              />

              <Input
                {...register('subtitle')}
                label="Subtitle"
                error={errors.subtitle?.message}
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
                  placeholder="Select subject category"
                />
              </div>

              <Textarea
                {...register('description')}
                label="Description *"
                rows={6}
                error={errors.description?.message}
                disabled={isSubmitting}
              />
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold border-b border-zinc-100 pb-2">Ebook Files & Media</h2>
              
              {/* PDF Secure File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Digital PDF File * (Stored Privately)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex h-10 cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white px-4 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-700">
                    <Upload className="mr-2 h-4 w-4 text-zinc-400" />
                    <span>{uploadState.pdf ? 'Uploading PDF...' : 'Choose PDF File'}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'pdf', 'pdfFilePath')}
                      disabled={uploadState.pdf || isSubmitting}
                    />
                  </label>
                  {watchedPdfFilePath && (
                    <span className="text-xs text-emerald-600 flex items-center font-medium">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      PDF Uploaded ({watchedPdfFilePath.split('/').pop()})
                    </span>
                  )}
                </div>
                {errors.pdfFilePath && <p className="text-xs text-red-500 font-medium">{errors.pdfFilePath.message}</p>}
              </div>

              {/* Book Cover WebP Image Upload */}
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
                      onChange={(e) => handleFileUpload(e, 'image', 'coverImage')}
                      disabled={uploadState.cover || isSubmitting}
                    />
                  </label>
                  {watchedCoverImage && (
                    <div className="flex items-center gap-2">
                      <img src={watchedCoverImage} alt="Cover preview" className="h-10 w-8 object-cover rounded shadow" />
                      <span className="text-xs text-emerald-600 flex items-center font-medium">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Uploaded
                      </span>
                    </div>
                  )}
                </div>
                {errors.coverImage && <p className="text-xs text-red-500 font-medium">{errors.coverImage.message}</p>}
              </div>

              {/* Preview Images Upload */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Preview Pages / Images (Shown to customers)
                </label>
                <label className="flex h-10 w-fit cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white px-4 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-700">
                  <Plus className="mr-2 h-4 w-4 text-zinc-400" />
                  <span>{uploadState.preview ? 'Uploading...' : 'Add Preview Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'image', 'previewImages')}
                    disabled={uploadState.preview || isSubmitting}
                  />
                </label>

                {watchedPreviewImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {watchedPreviewImages.map((url, index) => (
                      <div key={url + index} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-zinc-200 shadow-sm group">
                        <img src={url} alt="Preview page" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => removeArrayImage(index, 'previewImages')}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Pricing & Social Proof */}
        <div className="md:col-span-4 space-y-6">
          <Card>
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold border-b border-zinc-100 pb-2">Pricing & Format</h2>

              <Input
                {...register('price')}
                label="Price (₦) *"
                type="number"
                step="0.01"
                error={errors.price?.message}
                disabled={isSubmitting}
              />

              <Input
                {...register('discountPrice')}
                label="Discount Price (₦)"
                type="number"
                step="0.01"
                error={errors.discountPrice?.message}
                disabled={isSubmitting}
              />

              <Input
                {...register('fileSize')}
                label="File Size (e.g. 15 MB) *"
                placeholder="15.4 MB"
                error={errors.fileSize?.message}
                disabled={isSubmitting}
              />

              <Input
                {...register('pages')}
                label="Number of Pages *"
                type="number"
                error={errors.pages?.message}
                disabled={isSubmitting}
              />

              <Input
                {...register('language')}
                label="Language *"
                error={errors.language?.message}
                disabled={isSubmitting}
              />
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold border-b border-zinc-100 pb-2">Social Proof & Badges</h2>

              {/* Rating slider (0.0 to 5.0) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Rating Rating Slider (0.0 - 5.0)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    className="flex-grow accent-zinc-800"
                    {...register('rating')}
                    disabled={isSubmitting}
                  />
                  <span className="text-sm font-bold text-zinc-800 bg-[#F5F2EB] px-2 py-1 rounded">
                    {Number(watch('rating') || 5).toFixed(1)}
                  </span>
                </div>
                {errors.rating && <p className="text-xs text-red-500 font-medium">{errors.rating.message}</p>}
              </div>

              {/* Review count */}
              <Input
                {...register('reviewCount')}
                label="Number of Star Reviews (Social Proof)"
                type="number"
                error={errors.reviewCount?.message}
                disabled={isSubmitting}
              />

              {/* Sales override */}
              <Input
                {...register('purchaseCountOverride')}
                label="Display Purchase Count (Override)"
                placeholder="e.g. 1250"
                type="number"
                error={errors.purchaseCountOverride?.message}
                disabled={isSubmitting}
              />

              {/* Featured & Bestseller Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
                    {...register('isFeatured')}
                    disabled={isSubmitting}
                  />
                  <span className="text-xs font-medium text-zinc-700">Pin as Featured Spotlight</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
                    {...register('isBestseller')}
                    disabled={isSubmitting}
                  />
                  <span className="text-xs font-medium text-zinc-700">Display Bestseller Badge</span>
                </label>
              </div>
            </div>
          </Card>

          <Button type="submit" className="w-full h-12" isLoading={isSubmitting}>
            Save Digital Ebook
          </Button>
        </div>
      </div>
    </form>
  );
}
