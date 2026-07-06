import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '../../../../lib/db';
import { orders } from '../../../../db/schema';
import { getBookById } from '../../../../actions/books';
import { initializeFlutterwavePayment } from '../../../../lib/flutterwave';
import { v4 as uuidv4 } from 'uuid';

const checkoutSchema = z.object({
  bookId: z.string().uuid('Invalid Book ID'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate body
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { bookId, email, name } = parsed.data;

    // 2. Fetch book details
    const book = await getBookById(bookId);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // 3. Compute final price (use discount price if present)
    const finalPrice = book.discountPrice ? parseFloat(book.discountPrice) : parseFloat(book.price);
    
    // 4. Generate transaction references
    const txRef = `LV-REF-${Date.now()}-${uuidv4().substring(0, 8)}`;
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/callback`;

    // 5. Create pending order record in database
    await db.insert(orders).values({
      bookId: book.id,
      customerEmail: email.trim().toLowerCase(),
      customerName: name.trim(),
      amount: finalPrice.toString(),
      currency: 'NGN', // Default currency
      status: 'pending',
      paymentReference: txRef,
    });

    // 6. Initialize payment on Flutterwave
    const checkoutLink = await initializeFlutterwavePayment({
      txRef,
      amount: finalPrice,
      currency: 'NGN',
      email: email.trim().toLowerCase(),
      name: name.trim(),
      bookTitle: book.title,
      redirectUrl,
    });

    return NextResponse.json({ url: checkoutLink });
  } catch (error: any) {
    console.error('Checkout initialization API error:', error);
    return NextResponse.json({ error: error.message || 'Payment system error. Please try again.' }, { status: 500 });
  }
}
