import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL environment variable is missing.');
}

// Public Supabase client for client-side or general server-side public storage access
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin Supabase client using the Service Role Key
// Required for accessing private buckets (e.g., retrieving PDFs for watermarking)
// This must NEVER be imported or used on the client-side.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
