import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { orders } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { supabaseAdmin } from '../../../lib/supabase';
import { watermarkPdf } from '../../../lib/pdf';
import slugify from 'slugify';
import { formatDate } from '../../../utils/date';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse('Missing download token.', { status: 400 });
  }

  try {
    // 1. Verify token exists and is associated with a completed order
    const order = await db.query.orders.findFirst({
      where: eq(orders.downloadToken, token),
      with: {
        book: true,
      },
    });

    if (!order || order.status !== 'completed') {
      return new NextResponse('Invalid or expired download token.', { status: 403 });
    }

    const book = order.book;
    if (!book || !book.pdfFilePath) {
      return new NextResponse('Book file not found.', { status: 404 });
    }

    // 2. Fetch the raw PDF from the private Supabase Storage bucket
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from('books-private')
      .download(book.pdfFilePath);

    if (downloadError || !fileData) {
      console.error(`Supabase Storage download error for path ${book.pdfFilePath}:`, downloadError);
      return new NextResponse('Unable to retrieve file from storage.', { status: 500 });
    }

    // 3. Convert Blob to Buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const rawPdfBuffer = Buffer.from(arrayBuffer);

    // 4. Inject Watermark
    console.log(`Injecting watermark for Order #${order.id} (Customer: ${order.customerEmail})`);
    const watermarkedBuffer = await watermarkPdf(rawPdfBuffer, {
      name: order.customerName,
      email: order.customerEmail,
      orderId: order.id,
      date: formatDate(order.createdAt),
    });

    // 5. Increment download count in the database
    await db.update(orders).set({
      downloadCount: order.downloadCount + 1,
      updatedAt: new Date(),
    }).where(eq(orders.id, order.id));

    // 6. Generate a clean attachment filename
    const safeTitle = slugify(book.title, { lower: true, strict: true }) || 'book';
    const filename = `${safeTitle}-learn-vault.pdf`;

    // 7. Stream the watermarked file back as an attachment
    return new NextResponse(new Uint8Array(watermarkedBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': watermarkedBuffer.length.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Error during book download streaming:', error);
    return new NextResponse('An error occurred during file download. Please contact support.', { status: 500 });
  }
}
