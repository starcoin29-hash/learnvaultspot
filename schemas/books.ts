import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  subtitle: z.string().optional().nullable(),
  author: z.string().min(2, 'Author must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.preprocess((val) => Number(val), z.number().positive('Price must be greater than 0')),
  discountPrice: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? null : Number(val)),
    z.number().positive('Discount price must be greater than 0').nullable().optional()
  ),
  categoryId: z.string().uuid('Please select a valid category'),
  language: z.string().min(1, 'Language is required').default('English'),
  fileSize: z.string().min(1, 'File size is required (e.g., 12 MB)'),
  pages: z.preprocess((val) => Number(val), z.number().int().positive('Pages must be a positive integer')),
  coverImage: z.string().min(1, 'Cover image is required'),
  pdfFilePath: z.string().min(1, 'PDF file path is required'),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  rating: z.preprocess(
    (val) => (val === '' || val === undefined ? 5.0 : Number(val)),
    z.number().min(0.0).max(5.0, 'Rating must be between 0.0 and 5.0')
  ),
  reviewCount: z.preprocess(
    (val) => (val === '' || val === undefined ? 0 : Number(val)),
    z.number().int().nonnegative('Review count must be a non-negative integer')
  ),
  purchaseCountOverride: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? null : Number(val)),
    z.number().int().nonnegative('Purchase count override must be a non-negative integer').nullable().optional()
  ),
  galleryImages: z.array(z.string()).default([]),
  previewImages: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
  // Validate that discountPrice is less than price
  if (data.discountPrice !== null && data.discountPrice !== undefined) {
    if (data.discountPrice >= data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Discount price must be less than the regular price',
        path: ['discountPrice'],
      });
    }
  }
});

export type BookInput = z.infer<typeof bookSchema>;
