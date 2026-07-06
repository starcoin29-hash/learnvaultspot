import { createClient } from '@supabase/supabase-js';

function cleanEnvVar(val: string | undefined): string {
  if (!val) return '';
  return val.replace(/^['"]|['"]$/g, '').trim();
}

const supabaseUrlRaw = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL);
// Ensure we have a valid absolute URL format for createClient to avoid crash at module evaluation
const supabaseUrl = supabaseUrlRaw.startsWith('http') ? supabaseUrlRaw : 'https://placeholder.supabase.co';

const supabaseAnonKey = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const supabaseServiceKey = cleanEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseUrlRaw) {
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
