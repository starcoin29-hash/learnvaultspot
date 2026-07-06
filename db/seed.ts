import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

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

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";

async function main() {
  console.log('Seeding database...');
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  // 1. Seed Blog Categories
  const blogCats = ['Education', 'Wealth', 'Health', 'Relationship'];
  console.log('Seeding blog categories...');
  for (const cat of blogCats) {
    const slug = slugify(cat, { lower: true });
    // Check if category already exists
    const existing = await db.query.blogCategories.findFirst({
      where: (bc, { eq }) => eq(bc.slug, slug),
    });
    if (!existing) {
      await db.insert(schema.blogCategories).values({
        name: cat,
        slug: slug,
      });
      console.log(`Created blog category: ${cat}`);
    }
  }

  // 2. Seed Book Categories
  console.log('Seeding book categories...');
  const bookCats = ['Education', 'Wealth', 'Health', 'Relationship'];
  for (const cat of bookCats) {
    const slug = slugify(cat, { lower: true });
    const existing = await db.query.bookCategories.findFirst({
      where: (bc, { eq }) => eq(bc.slug, slug),
    });
    if (!existing) {
      await db.insert(schema.bookCategories).values({
        name: cat,
        slug: slug,
      });
      console.log(`Created book category: ${cat}`);
    }
  }

  // 3. Seed Default Admin
  console.log('Seeding admin...');
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin12345';

  const existingAdmin = await db.query.admins.findFirst({
    where: (a, { eq }) => eq(a.username, adminUsername),
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.insert(schema.admins).values({
      username: adminUsername,
      passwordHash: passwordHash,
    });
    console.log(`Created default admin with username: "${adminUsername}" and password: "${adminPassword}"`);
    console.log('IMPORTANT: Please change this password or set the environment variables in production!');
  } else {
    console.log('Admin already exists, skipping.');
  }

  // 4. Seed default website settings
  console.log('Seeding default website settings...');
  const defaultSettings = [
    {
      key: 'seo_settings',
      value: {
        siteName: 'Learn Vault',
        defaultTitle: 'Learn Vault | Digital Bookstore & Blog',
        defaultDescription: 'Premium platform to purchase high-quality digital books and read articles on Education, Wealth, Health, and Relationships.',
        twitterHandle: '@learnvault',
        facebookPage: 'https://facebook.com/learnvault',
      },
    },
    {
      key: 'contact_settings',
      value: {
        email: 'info@learnvault.com',
        phone: '+234 800 000 0000',
        address: '123 Learn Vault Boulevard, Digital City',
        mapEmbed: '',
      },
    },
    {
      key: 'about_settings',
      value: {
        title: 'About Learn Vault',
        story: 'Learn Vault was founded to provide immediate access to structured, action-oriented knowledge. We specialize in four core pillars of human life: Education, Wealth, Health, and Relationships. Our carefully curated books and insightful blog posts are designed to help you build a better future, one page at a time.',
        mission: 'To empower readers with direct, uninhibited access to premium digital resources without accounts or clutter.',
      },
    },
  ];

  for (const setting of defaultSettings) {
    const existing = await db.query.websiteSettings.findFirst({
      where: (ws, { eq }) => eq(ws.key, setting.key),
    });
    if (!existing) {
      await db.insert(schema.websiteSettings).values({
        key: setting.key,
        value: setting.value,
      });
      console.log(`Seeded website setting: ${setting.key}`);
    }
  }

  console.log('Seeding completed successfully!');
  await client.end();
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
