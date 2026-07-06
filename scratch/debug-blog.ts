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

// Now import db and schema
import { db } from '../lib/db';
import { blogPosts } from '../db/schema';
import { isNull } from 'drizzle-orm';

async function debugBlogs() {
  console.log('Querying all active blog posts from database...');
  try {
    const posts = await db.query.blogPosts.findMany({
      where: isNull(blogPosts.deletedAt),
      with: {
        category: true,
      }
    });

    console.log(`\nFound ${posts.length} active blog post(s):`);
    posts.forEach((post, i) => {
      console.log(`\n--- Post #${i + 1} ---`);
      console.log(`ID:        ${post.id}`);
      console.log(`Title:     "${post.title}"`);
      console.log(`Slug:      "${post.slug}"`);
      console.log(`Category:  ${post.category?.name} (${post.category?.slug})`);
      console.log(`Author:    ${post.author}`);
      console.log(`Published: ${post.publishedDate}`);
      console.log(`DeletedAt: ${post.deletedAt}`);
    });
  } catch (error) {
    console.error('Failed to query database:', error);
  }
}

debugBlogs();
