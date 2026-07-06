'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../lib/db';
import { websiteSettings, orders } from '../db/schema';
import { eq } from 'drizzle-orm';
import { checkAdminSession } from './auth';

/**
 * Fetch a website setting by its key.
 */
export async function getWebsiteSetting(key: string) {
  try {
    const setting = await db.query.websiteSettings.findFirst({
      where: eq(websiteSettings.key, key),
    });
    return setting ? (setting.value as any) : null;
  } catch (error) {
    console.error(`Error fetching website setting "${key}":`, error);
    return null;
  }
}

/**
 * Update website settings. Only accessible by authorized administrators.
 */
export async function updateWebsiteSetting(key: string, value: any) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: 'Unauthorized.' };

  try {
    // Check if the setting key exists
    const existing = await db.query.websiteSettings.findFirst({
      where: eq(websiteSettings.key, key),
    });

    if (existing) {
      await db.update(websiteSettings).set({
        value,
        updatedAt: new Date(),
      }).where(eq(websiteSettings.key, key));
    } else {
      await db.insert(websiteSettings).values({
        key,
        value,
      });
    }

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/privacy');
    revalidatePath('/terms');
    revalidatePath('/admin/dashboard/settings');

    return { success: true };
  } catch (error) {
    console.error(`Error updating website setting "${key}":`, error);
    return { success: false, error: 'Failed to update settings.' };
  }
}

/**
 * Fetch overview analytics for the administrator dashboard:
 * - Total successful orders
 * - Total gross revenue
 * - Total digital downloads
 * - Sales logs grouped by months
 */
export async function getDashboardOverview() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error('Unauthorized.');

  try {
    const allOrders = await db.query.orders.findMany({
      orderBy: (o, { desc }) => [desc(o.createdAt)],
      with: {
        book: true,
      },
    });

    const completedOrders = allOrders.filter(o => o.status === 'completed');
    const totalSales = completedOrders.length;
    const totalDownloads = completedOrders.reduce((sum, o) => sum + o.downloadCount, 0);

    const totalRevenue = completedOrders.reduce((sum, o) => {
      return sum + parseFloat(o.amount);
    }, 0);

    return {
      totalSales,
      totalRevenue: totalRevenue.toFixed(2),
      totalDownloads,
      orders: allOrders.slice(0, 10), // return last 10 transactions
    };
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return {
      totalSales: 0,
      totalRevenue: '0.00',
      totalDownloads: 0,
      orders: [],
    };
  }
}

/**
 * Fetch all transaction records for the admin panel.
 */
export async function getAdminOrders() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) throw new Error('Unauthorized.');

  try {
    return await db.query.orders.findMany({
      orderBy: (o, { desc }) => [desc(o.createdAt)],
      with: {
        book: true,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}
