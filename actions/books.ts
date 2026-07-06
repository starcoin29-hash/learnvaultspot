'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../lib/db';
import { books, bookCategories, bookImages } from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { checkAdminSession } from './auth';
import { bookSchema, BookInput } from '../schemas/books';
import slugify from 'slugify';

/**
 * Get all active (non-soft-deleted) books.
 */
export async function getBooks() {
  try {
    return await db.query.books.findMany({
      where: isNull(books.deletedAt),
      with: {
        category: true,
        images: true,
      },
      orderBy: (b, { desc }) => [desc(b.createdAt)],
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

/**
 * Get a single book by ID.
 */
export async function getBookById(id: string) {
  try {
    return await db.query.books.findFirst({
      where: and(eq(books.id, id), isNull(books.deletedAt)),
      with: {
        category: true,
        images: true,
      },
    });
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    return null;
  }
}

/**
 * Get all book categories.
 */
export async function getBookCategories() {
  try {
    return await db.query.bookCategories.findMany({
      orderBy: (c, { asc }) => [asc(c.name)],
    });
  } catch (error) {
    console.error('Error fetching book categories:', error);
    return [];
  }
}

/**
 * Add a new book category.
 */
export async function createBookCategory(name: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized.' };

  if (!name || name.trim() === '') {
    return { success: false, error: 'Category name is required.' };
  }

  try {
    const slug = slugify(name, { lower: true });
    
    // Check if category already exists
    const existing = await db.query.bookCategories.findFirst({
      where: eq(bookCategories.slug, slug),
    });
    if (existing) {
      return { success: false, error: 'Category already exists.' };
    }

    await db.insert(bookCategories).values({
      name: name.trim(),
      slug,
    });

    revalidatePath('/admin/dashboard/books');
    return { success: true };
  } catch (error) {
    console.error('Error creating book category:', error);
    return { success: false, error: 'Failed to create category.' };
  }
}

/**
 * Create a new book.
 */
export async function createBook(data: BookInput) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized.' };

  const parsed = bookSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  try {
    const { galleryImages, previewImages, ...bookDetails } = parsed.data;

    // Start a transaction
    const newBook = await db.transaction(async (tx) => {
      // 1. Insert book details
      const [insertedBook] = await tx.insert(books).values({
        title: bookDetails.title,
        subtitle: bookDetails.subtitle,
        author: bookDetails.author,
        description: bookDetails.description,
        price: bookDetails.price.toString(),
        discountPrice: bookDetails.discountPrice ? bookDetails.discountPrice.toString() : null,
        categoryId: bookDetails.categoryId,
        language: bookDetails.language,
        fileSize: bookDetails.fileSize,
        pages: bookDetails.pages,
        coverImage: bookDetails.coverImage,
        pdfFilePath: bookDetails.pdfFilePath,
        isFeatured: bookDetails.isFeatured,
        isBestseller: bookDetails.isBestseller,
        rating: bookDetails.rating.toFixed(1),
        reviewCount: bookDetails.reviewCount,
        purchaseCountOverride: bookDetails.purchaseCountOverride,
      }).returning();

      // 2. Insert Gallery Images
      if (galleryImages && galleryImages.length > 0) {
        await tx.insert(bookImages).values(
          galleryImages.map((url) => ({
            bookId: insertedBook.id,
            imageUrl: url,
            imageType: 'gallery',
          }))
        );
      }

      // 3. Insert Preview Images
      if (previewImages && previewImages.length > 0) {
        await tx.insert(bookImages).values(
          previewImages.map((url) => ({
            bookId: insertedBook.id,
            imageUrl: url,
            imageType: 'preview',
          }))
        );
      }

      return insertedBook;
    });

    revalidatePath('/');
    revalidatePath('/books');
    revalidatePath(`/books/${newBook.id}`);
    revalidatePath('/admin/dashboard/books');

    return { success: true, bookId: newBook.id };
  } catch (error) {
    console.error('Error creating book:', error);
    return { success: false, error: 'Failed to save book to database.' };
  }
}

/**
 * Update an existing book.
 */
export async function updateBook(id: string, data: BookInput) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized.' };

  const parsed = bookSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  try {
    const { galleryImages, previewImages, ...bookDetails } = parsed.data;

    // Check if book exists
    const existing = await db.query.books.findFirst({
      where: and(eq(books.id, id), isNull(books.deletedAt)),
    });
    if (!existing) {
      return { success: false, error: 'Book not found.' };
    }

    await db.transaction(async (tx) => {
      // 1. Update book details
      await tx.update(books).set({
        title: bookDetails.title,
        subtitle: bookDetails.subtitle,
        author: bookDetails.author,
        description: bookDetails.description,
        price: bookDetails.price.toString(),
        discountPrice: bookDetails.discountPrice ? bookDetails.discountPrice.toString() : null,
        categoryId: bookDetails.categoryId,
        language: bookDetails.language,
        fileSize: bookDetails.fileSize,
        pages: bookDetails.pages,
        coverImage: bookDetails.coverImage,
        pdfFilePath: bookDetails.pdfFilePath,
        isFeatured: bookDetails.isFeatured,
        isBestseller: bookDetails.isBestseller,
        rating: bookDetails.rating.toFixed(1),
        reviewCount: bookDetails.reviewCount,
        purchaseCountOverride: bookDetails.purchaseCountOverride,
        updatedAt: new Date(),
      }).where(eq(books.id, id));

      // 2. Delete old secondary images
      await tx.delete(bookImages).where(eq(bookImages.bookId, id));

      // 3. Insert new Gallery Images
      if (galleryImages && galleryImages.length > 0) {
        await tx.insert(bookImages).values(
          galleryImages.map((url) => ({
            bookId: id,
            imageUrl: url,
            imageType: 'gallery',
          }))
        );
      }

      // 4. Insert new Preview Images
      if (previewImages && previewImages.length > 0) {
        await tx.insert(bookImages).values(
          previewImages.map((url) => ({
            bookId: id,
            imageUrl: url,
            imageType: 'preview',
          }))
        );
      }
    });

    revalidatePath('/');
    revalidatePath('/books');
    revalidatePath(`/books/${id}`);
    revalidatePath('/admin/dashboard/books');

    return { success: true };
  } catch (error) {
    console.error(`Error updating book ${id}:`, error);
    return { success: false, error: 'Failed to update book.' };
  }
}

/**
 * Soft-delete an existing book.
 */
export async function deleteBook(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized.' };

  try {
    // Check if book exists
    const existing = await db.query.books.findFirst({
      where: and(eq(books.id, id), isNull(books.deletedAt)),
    });
    if (!existing) {
      return { success: false, error: 'Book not found.' };
    }

    // Set deletedAt to soft delete
    await db.update(books).set({
      deletedAt: new Date(),
    }).where(eq(books.id, id));

    revalidatePath('/');
    revalidatePath('/books');
    revalidatePath(`/books/${id}`);
    revalidatePath('/admin/dashboard/books');

    return { success: true };
  } catch (error) {
    console.error(`Error deleting book ${id}:`, error);
    return { success: false, error: 'Failed to delete book.' };
  }
}
