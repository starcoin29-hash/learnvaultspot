import fs from 'fs';
import path from 'path';

// Manual .env loader for standalone script execution
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of envLines) {
      if (line.trim().startsWith('#') || !line.includes('=')) continue;
      
      const parts = line.split('=');
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      
      process.env[key] = val;
    }
  }
} catch (error) {
  console.error('Failed to parse .env file:', error);
}

import slugify from 'slugify';

async function fixSlugs() {
  console.log('Loading database...');
  const { db } = await import('../lib/db');
  const { blogPosts } = await import('../db/schema');
  const { eq } = await import('drizzle-orm');

  try {
    const posts = await db.query.blogPosts.findMany();
    console.log(`Checking ${posts.length} posts for URL-unsafe slugs...`);

    let fixedCount = 0;
    for (const post of posts) {
      const cleanSlug = slugify(post.slug, { lower: true, strict: true });
      if (post.slug !== cleanSlug) {
        console.log(`Fixing slug for post: "${post.title}"`);
        console.log(`  Old: "${post.slug}"`);
        console.log(`  New: "${cleanSlug}"`);

        await db
          .update(blogPosts)
          .set({ slug: cleanSlug })
          .where(eq(blogPosts.id, post.id));
        
        fixedCount++;
      }
    }

    console.log(`Done! Fixed ${fixedCount} blog post slug(s).`);
  } catch (err) {
    console.error('Error fixing slugs:', err);
  }
}

fixSlugs();
