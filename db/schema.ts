import { pgTable, uuid, text, numeric, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Admins Table
export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Book Categories Table
export const bookCategories = pgTable('book_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Books Table
export const books = pgTable('books', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  author: text('author').notNull(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  discountPrice: numeric('discount_price', { precision: 10, scale: 2 }),
  categoryId: uuid('category_id').references(() => bookCategories.id, { onDelete: 'restrict' }).notNull(),
  language: text('language').default('English').notNull(),
  fileSize: text('file_size').notNull(), // e.g. "12.4 MB"
  pages: integer('pages').notNull(),
  publicationDate: timestamp('publication_date').defaultNow().notNull(),
  coverImage: text('cover_image').notNull(),
  pdfFilePath: text('pdf_file_path').notNull(), // Private path in supabase storage
  isFeatured: boolean('is_featured').default(false).notNull(),
  isBestseller: boolean('is_bestseller').default(false).notNull(),
  rating: numeric('rating', { precision: 2, scale: 1 }).default('5.0').notNull(),
  reviewCount: integer('review_count').default(0).notNull(),
  purchaseCountOverride: integer('purchase_count_override'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete
});

// Book Images Table (Gallery & Preview Images)
export const bookImages = pgTable('book_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookId: uuid('book_id').references(() => books.id, { onDelete: 'cascade' }).notNull(),
  imageUrl: text('image_url').notNull(),
  imageType: text('image_type').default('preview').notNull(), // 'gallery' or 'preview'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Blog Categories Table
export const blogCategories = pgTable('blog_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Blog Posts Table
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  categoryId: uuid('category_id').references(() => blogCategories.id, { onDelete: 'restrict' }).notNull(),
  author: text('author').notNull(),
  content: text('content').notNull(),
  shortDescription: text('short_description').notNull(),
  coverImage: text('cover_image').notNull(),
  featuredImage: text('featured_image'),
  readingTime: integer('reading_time').default(5).notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  publishedDate: timestamp('published_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete
});

// Orders Table
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookId: uuid('book_id').references(() => books.id, { onDelete: 'restrict' }).notNull(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('NGN').notNull(),
  status: text('status').default('pending').notNull(), // 'pending', 'completed', 'failed'
  paymentReference: text('payment_reference').unique().notNull(), // Flutterwave tx_ref
  downloadToken: text('download_token').unique(),
  downloadCount: integer('download_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payments Table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  transactionId: text('transaction_id').unique().notNull(), // Flutterwave transaction_id
  provider: text('provider').default('flutterwave').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull(),
  payload: jsonb('payload'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Global Website Settings Table
export const websiteSettings = pgTable('website_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').unique().notNull(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations Definitions
export const booksRelations = relations(books, ({ one, many }) => ({
  category: one(bookCategories, {
    fields: [books.categoryId],
    references: [bookCategories.id],
  }),
  images: many(bookImages),
  orders: many(orders),
}));

export const bookImagesRelations = relations(bookImages, ({ one }) => ({
  book: one(books, {
    fields: [bookImages.bookId],
    references: [books.id],
  }),
}));

export const bookCategoriesRelations = relations(bookCategories, ({ many }) => ({
  books: many(books),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
}));

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  book: one(books, {
    fields: [orders.bookId],
    references: [books.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));
