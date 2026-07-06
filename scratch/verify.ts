import { optimizeImage } from '../utils/image';
import { watermarkPdf } from '../lib/pdf';
import fs from 'fs';
import path from 'path';

async function runVerification() {
  console.log('--- STARTING VERIFICATION CHECKS ---');

  // 1. Verify Image Optimization Helper
  console.log('\n1. Verifying Sharp Image Optimization...');
  try {
    // Create a 1x1 mock red png buffer
    const mockPngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const result = await optimizeImage(mockPngBuffer);
    console.log(`✓ Sharp successfully loaded!`);
    console.log(`✓ Resulting Mime-Type: ${result.mimeType}`);
    console.log(`✓ Resulting Extension: ${result.extension}`);
    console.log(`✓ Result Buffer Size: ${result.buffer.length} bytes`);
  } catch (error: any) {
    console.error('✗ Image optimization verification failed:', error.message);
  }

  // 2. Verify PDF Watermarking Helper
  console.log('\n2. Verifying PDF Watermarking Helper...');
  try {
    // Generate a minimal blank PDF buffer programmatically or mock bytes
    // Since we want to ensure pdf-lib loads, we'll create a new PDF document, save it, and then apply watermark
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.create();
    doc.addPage([600, 800]);
    const mockPdfBytes = await doc.save();
    
    const watermarked = await watermarkPdf(Buffer.from(mockPdfBytes), {
      name: 'John Test',
      email: 'john@test.com',
      orderId: 'LV-TEST-12345',
      date: 'June 29, 2026',
    });

    console.log(`✓ pdf-lib successfully loaded!`);
    console.log(`✓ Watermark successfully applied to mock PDF!`);
    console.log(`✓ Watermarked PDF size: ${watermarked.length} bytes`);
  } catch (error: any) {
    console.error('✗ PDF watermarking verification failed:', error.message);
  }

  console.log('\n--- VERIFICATION CHECKS COMPLETE ---');
}

runVerification().catch((err) => {
  console.error('Verification crashed:', err);
});
