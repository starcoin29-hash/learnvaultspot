import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { orders, payments } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { verifyFlutterwaveTransaction } from '../../../../lib/flutterwave';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const txRef = searchParams.get('tx_ref');
  const transactionId = searchParams.get('transaction_id');

  console.log(`Payment callback received: status=${status}, txRef=${txRef}, transactionId=${transactionId}`);

  // 1. Check if the payment was cancelled or missing variables
  if (status !== 'successful' || !transactionId || !txRef) {
    console.warn('Payment failed or was cancelled by the user.');
    return NextResponse.redirect(new URL(`/books?payment=cancelled`, request.url));
  }

  try {
    // 2. Fetch the corresponding order from our database
    const order = await db.query.orders.findFirst({
      where: eq(orders.paymentReference, txRef),
      with: {
        book: true,
      },
    });

    if (!order) {
      console.error(`Order not found for txRef: ${txRef}`);
      return NextResponse.redirect(new URL(`/books?payment=notfound`, request.url));
    }

    // 3. If order is already completed, redirect to download success page directly
    if (order.status === 'completed' && order.downloadToken) {
      console.log('Order already completed, redirecting to download success page.');
      return NextResponse.redirect(
        new URL(`/checkout/success?token=${order.downloadToken}`, request.url)
      );
    }

    // 4. Verify transaction with Flutterwave API
    const verifiedData = await verifyFlutterwaveTransaction(transactionId);
    
    // 5. Match payment details
    const orderAmount = parseFloat(order.amount);
    const chargedAmount = verifiedData.amount;

    // Verify amount matches within a small tolerance (e.g. 0.01) to prevent tampering
    if (verifiedData.status !== 'successful' || Math.abs(chargedAmount - orderAmount) > 0.05) {
      console.error(
        `Verification mismatch: status=${verifiedData.status}, chargedAmount=${chargedAmount}, expected=${orderAmount}`
      );
      
      // Update order status to failed
      await db.update(orders).set({
        status: 'failed',
        updatedAt: new Date(),
      }).where(eq(orders.id, order.id));

      return NextResponse.redirect(
        new URL(`/books/${order.bookId}?payment=failed&reason=verification_mismatch`, request.url)
      );
    }

    // 6. Complete Order & Payment insertion in transaction
    const downloadToken = uuidv4();
    
    await db.transaction(async (tx) => {
      // Update order status
      await tx.update(orders).set({
        status: 'completed',
        downloadToken: downloadToken,
        updatedAt: new Date(),
      }).where(eq(orders.id, order.id));

      // Log payment record
      await tx.insert(payments).values({
        orderId: order.id,
        transactionId: transactionId,
        provider: 'flutterwave',
        amount: chargedAmount.toString(),
        status: verifiedData.status,
        payload: verifiedData,
      });
    });

    console.log(`Payment verified successfully for Order ${order.id}. Redirecting to download page.`);
    
    // 7. Redirect to dynamic download page
    return NextResponse.redirect(
      new URL(`/checkout/success?token=${downloadToken}`, request.url)
    );
  } catch (error) {
    console.error('Callback API route error during payment verification:', error);
    // If order bookId is known, redirect there, otherwise books list
    return NextResponse.redirect(new URL(`/books?payment=error`, request.url));
  }
}
