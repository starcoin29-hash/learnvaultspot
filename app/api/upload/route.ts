import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '../../../actions/auth';
import { optimizeImage } from '../../../utils/image';
import { supabaseAdmin } from '../../../lib/supabase';

// Disable default body parser to handle file streams
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate that this is the admin
    const isAdmin = await checkAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; // "image" or "pdf"

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);
    const fileName = file.name;

    // 3. Process according to type
    if (type === 'pdf' || fileName.toLowerCase().endsWith('.pdf')) {
      // PDF Upload (goes to private bucket 'books-private')
      const path = `pdfs/${Date.now()}-${fileName}`;
      
      const { data, error } = await supabaseAdmin.storage
        .from('books-private')
        .upload(path, originalBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (error) {
        console.error('Supabase private PDF upload error:', error);
        return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
      }

      // Return the secure storage path (NOT a public URL)
      return NextResponse.json({ path: data.path });
    } else {
      // Image Upload (goes to public bucket 'media')
      // Optimize image first
      const { buffer: optimizedBuffer, mimeType, extension } = await optimizeImage(originalBuffer);

      const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-');
      const path = `images/${Date.now()}-${baseName}.${extension}`;

      const { data, error } = await supabaseAdmin.storage
        .from('media')
        .upload(path, optimizedBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.error('Supabase public image upload error:', error);
        return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
      }

      // Get public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('media')
        .getPublicUrl(data.path);

      return NextResponse.json({ url: publicUrlData.publicUrl });
    }
  } catch (error: any) {
    console.error('Upload API route error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
