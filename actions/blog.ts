'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../lib/db';
import { blogPosts, blogCategories } from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { checkAdminSession } from './auth';
import { blogPostSchema, BlogPostInput } from '../schemas/blog';
import slugify from 'slugify';

/**
 * Fetch all active blog posts.
 */
export async function getBlogPosts() {
  try {
    return await db.query.blogPosts.findMany({
      where: isNull(blogPosts.deletedAt),
      with: {
        category: true,
      },
      orderBy: (p, { desc }) => [desc(p.publishedDate)],
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug.
 */
export async function getBlogPostBySlug(slug: string) {
  try {
    return await db.query.blogPosts.findFirst({
      where: and(eq(blogPosts.slug, slug), isNull(blogPosts.deletedAt)),
      with: {
        category: true,
      },
    });
  } catch (error) {
    console.error(`Error fetching blog post by slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch a single blog post by ID.
 */
export async function getBlogPostById(id: string) {
  try {
    return await db.query.blogPosts.findFirst({
      where: and(eq(blogPosts.id, id), isNull(blogPosts.deletedAt)),
      with: {
        category: true,
      },
    });
  } catch (error) {
    console.error(`Error fetching blog post by ID "${id}":`, error);
    return null;
  }
}


/**
 * Fetch all blog categories.
 */
export async function getBlogCategories() {
  try {
    return await db.query.blogCategories.findMany({
      orderBy: (c, { asc }) => [asc(c.name)],
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

/**
 * Create a new blog category.
 */
export async function createBlogCategory(name: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized.' };

  if (!name || name.trim() === '') {
    return { success: false, error: 'Category name is required.' };
  }

  try {
    const slug = slugify(name, { lower: true });
    
    // Check if category already exists
    const existing = await db.query.blogCategories.findFirst({
      where: eq(blogCategories.slug, slug),
    });
    if (existing) {
      return { success: false, error: 'Category already exists.' };
    }

    await db.insert(blogCategories).values({
      name: name.trim(),
      slug,
    });

    revalidatePath('/admin/dashboard/blog');
    return { success: true };
  } catch (error) {
    console.error('Error creating blog category:', error);
    return { success: false, error: 'Failed to create category.' };
  }
}

/**
 * Create a new blog post.
 */
export async function createBlogPost(data: BlogPostInput) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized.' };

  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  try {
    const postDetails = parsed.data;
    
    // Generate slug from title if not explicitly provided, and always slugify to ensure URL-safety
    const rawSlug = postDetails.slug?.trim() || postDetails.title;
    const baseSlug = slugify(rawSlug, { lower: true, strict: true });
    
    // Ensure slug uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, slug),
      });
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    // Estimate reading time if not explicitly valid
    const wordsPerMinute = 200;
    const cleanContent = postDetails.content.replace(/<[^>]*>/g, ''); // strip HTML
    const wordCount = cleanContent.split(/\s+/).length;
    const readingTime = postDetails.readingTime || Math.max(1, Math.ceil(wordCount / wordsPerMinute));

    const [newPost] = await db.insert(blogPosts).values({
      title: postDetails.title,
      slug,
      categoryId: postDetails.categoryId,
      author: postDetails.author,
      content: postDetails.content,
      shortDescription: postDetails.shortDescription,
      coverImage: postDetails.coverImage,
      featuredImage: postDetails.featuredImage,
      readingTime,
      seoTitle: postDetails.seoTitle || postDetails.title,
      seoDescription: postDetails.seoDescription || postDetails.shortDescription.substring(0, 155),
      publishedDate: postDetails.publishedDate ? new Date(postDetails.publishedDate) : new Date(),
    }).returning();

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/admin/dashboard/blog');

    return { success: true, slug: newPost.slug };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { success: false, error: 'Failed to save blog post to database.' };
  }
}

/**
 * Update an existing blog post.
 */
export async function updateBlogPost(id: string, data: BlogPostInput) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized.' };

  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  try {
    const postDetails = parsed.data;

    // Check if post exists
    const existing = await db.query.blogPosts.findFirst({
      where: and(eq(blogPosts.id, id), isNull(blogPosts.deletedAt)),
    });
    if (!existing) {
      return { success: false, error: 'Blog post not found.' };
    }

    // Generate slug from title if title changed and slug is empty, and always slugify to ensure URL-safety
    let slug = slugify(postDetails.slug?.trim() || existing.slug, { lower: true, strict: true });
    if (postDetails.title !== existing.title && !postDetails.slug) {
      const baseSlug = slugify(postDetails.title, { lower: true, strict: true });
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const check = await db.query.blogPosts.findFirst({
          where: and(eq(blogPosts.slug, slug), eq(blogPosts.deletedAt, isNull as any)), // exclude soft deleted
        });
        // If slug matches existing item itself, that's fine
        if (!check || check.id === id) break;
        slug = `${baseSlug}-${counter++}`;
      }
    }

    // Estimate reading time
    const wordsPerMinute = 200;
    const cleanContent = postDetails.content.replace(/<[^>]*>/g, '');
    const wordCount = cleanContent.split(/\s+/).length;
    const readingTime = postDetails.readingTime || Math.max(1, Math.ceil(wordCount / wordsPerMinute));

    await db.update(blogPosts).set({
      title: postDetails.title,
      slug,
      categoryId: postDetails.categoryId,
      author: postDetails.author,
      content: postDetails.content,
      shortDescription: postDetails.shortDescription,
      coverImage: postDetails.coverImage,
      featuredImage: postDetails.featuredImage,
      readingTime,
      seoTitle: postDetails.seoTitle || postDetails.title,
      seoDescription: postDetails.seoDescription || postDetails.shortDescription.substring(0, 155),
      publishedDate: postDetails.publishedDate ? new Date(postDetails.publishedDate) : new Date(existing.publishedDate),
      updatedAt: new Date(),
    }).where(eq(blogPosts.id, id));

    // Revalidate affected routes
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${existing.slug}`);
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/admin/dashboard/blog');

    return { success: true };
  } catch (error) {
    console.error(`Error updating blog post ${id}:`, error);
    return { success: false, error: 'Failed to update blog post.' };
  }
}

/**
 * Soft-delete an existing blog post.
 */
export async function deleteBlogPost(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized.' };

  try {
    const existing = await db.query.blogPosts.findFirst({
      where: and(eq(blogPosts.id, id), isNull(blogPosts.deletedAt)),
    });
    if (!existing) {
      return { success: false, error: 'Blog post not found.' };
    }

    await db.update(blogPosts).set({
      deletedAt: new Date(),
    }).where(eq(blogPosts.id, id));

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${existing.slug}`);
    revalidatePath('/admin/dashboard/blog');

    return { success: true };
  } catch (error) {
    console.error(`Error deleting blog post ${id}:`, error);
    return { success: false, error: 'Failed to delete blog post.' };
  }
}
