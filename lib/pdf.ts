import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

interface LicenseDetails {
  name: string;
  email: string;
  orderId: string;
  date: string;
}

/**
 * Injects a dynamic watermark onto every page of a PDF document:
 * - A diagonal semi-transparent licensing text across the center.
 * - A clean footer with licensing and order details at the bottom of the page.
 * - A clean header at the top of the page.
 */
export async function watermarkPdf(pdfBuffer: Buffer, license: LicenseDetails): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    const footerText = `Licensed to: ${license.name} (${license.email}) | Order: ${license.orderId} | Date: ${license.date} | Learn Vault - Unauthorized distribution is strictly prohibited.`;
    const headerText = `Licensed Copy - ${license.email} (Order #${license.orderId.substring(0, 8)})`;
    const diagonalText = `LICENSED TO: ${license.email.toUpperCase()}`;

    for (const page of pages) {
      const { width, height } = page.getSize();

      // 1. Draw Diagonal Watermark (Center)
      const diagonalSize = Math.max(12, Math.min(22, Math.floor(width / 30)));
      const textWidth = font.widthOfTextAtSize(diagonalText, diagonalSize);
      
      // Calculate rotation and center
      page.drawText(diagonalText, {
        x: (width - textWidth) / 2 + 50,
        y: height / 2 - 50,
        size: diagonalSize,
        font,
        color: rgb(0.65, 0.65, 0.65), // light gray
        opacity: 0.12, // extremely light so it does not interfere with content
        rotate: degrees(35),
      });

      // 2. Draw Header Watermark (Top)
      page.drawText(headerText, {
        x: 40,
        y: height - 30,
        size: 7,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.4,
      });

      // 3. Draw Footer Watermark (Bottom)
      page.drawText(footerText, {
        x: 40,
        y: 20,
        size: 7,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.5,
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    return Buffer.from(modifiedPdfBytes);
  } catch (error) {
    console.error('PDF Watermark injection failed:', error);
    // Return original PDF buffer if watermarking fails to ensure delivery
    return pdfBuffer;
  }
}
