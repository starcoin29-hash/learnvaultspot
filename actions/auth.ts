'use server';

import { cookies } from 'next/headers';
import { db } from '../lib/db';
import { admins } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { loginSchema, LoginInput } from '../schemas/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'local-development-secret-for-jwt-signing'
);

/**
 * Log in the administrator and issue a secure HttpOnly JWT session cookie.
 */
export async function loginAdmin(data: LoginInput) {
  try {
    // 1. Validate inputs with Zod schema
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: 'Invalid username or password format.' };
    }

    const { username, password } = parsed.data;

    // 2. Query database for admin
    const adminUser = await db.query.admins.findFirst({
      where: eq(admins.username, username),
    });

    if (!adminUser) {
      return { success: false, error: 'Invalid username or password.' };
    }

    // 3. Compare password hash
    const passwordMatch = await bcrypt.compare(password, adminUser.passwordHash);
    if (!passwordMatch) {
      return { success: false, error: 'Invalid username or password.' };
    }

    // 4. Generate JWT
    const token = await new SignJWT({ id: adminUser.id, username: adminUser.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('12h') // 12-hour session
      .sign(JWT_SECRET);

    // 5. Set Cookie (await cookies() for Next.js 15)
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Login action error:', error);
    return { success: false, error: 'An unexpected authentication error occurred.' };
  }
}

/**
 * Log out the administrator by deleting the HttpOnly session cookie.
 */
export async function logoutAdmin() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('admin_token');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to clear session.' };
  }
}

/**
 * Check if there is a valid, unexpired administrator session.
 */
export async function checkAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;

    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}
