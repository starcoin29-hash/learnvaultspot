import sharp from 'sharp';

/**
 * Optimizes an image buffer using Sharp:
 * - Resizes to a maximum width (maintaining aspect ratio)
 * - Converts to WebP format
 * - Compresses to reduce file size
 * - Has a fallback to return the original buffer if Sharp fails
 */
export async function optimizeImage(
  buffer: Buffer,
  maxWidth = 1200,
  quality = 80
): Promise<{ buffer: Buffer; mimeType: string; extension: string }> {
  try {
    const optimizedBuffer = await sharp(buffer)
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();

    return {
      buffer: optimizedBuffer,
      mimeType: 'image/webp',
      extension: 'webp',
    };
  } catch (error) {
    console.error('Sharp optimization failed, falling back to original image:', error);
    // Determine fallback type or default to jpeg
    return {
      buffer,
      mimeType: 'image/jpeg',
      extension: 'jpg',
    };
  }
}
