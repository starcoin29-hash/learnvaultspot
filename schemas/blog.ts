import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().optional(),
  categoryId: z.string().uuid('Please select a valid category'),
  author: z.string().min(2, 'Author name must be at least 2 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  coverImage: z.string().min(1, 'Cover image is required'),
  featuredImage: z.string().optional().nullable(),
  readingTime: z.preprocess(
    (val) => (val === '' || val === undefined ? 5 : Number(val)),
    z.number().int().positive('Reading time must be a positive number of minutes')
  ),
  seoTitle: z.string().max(70, 'SEO title should be under 70 characters').optional().nullable(),
  seoDescription: z.string().max(160, 'SEO description should be under 160 characters').optional().nullable(),
  publishedDate: z.string().optional().nullable(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
