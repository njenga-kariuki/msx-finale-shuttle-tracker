import { createClient } from '@supabase/supabase-js';

// These environment variables are expected to be set in your Replit secrets
// The names should be VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.warn("Supabase URL is not configured. Please ensure VITE_SUPABASE_URL is set in your Replit secrets.");
  // Provide a non-functional default to avoid crashing createClient if undefined
  // but log a prominent error.
  // throw new Error("Supabase URL is not configured. Please ensure VITE_SUPABASE_URL is set in your Replit secrets.");
}

if (!supabaseAnonKey) {
  console.warn("Supabase anon key is not configured. Please ensure VITE_SUPABASE_ANON_KEY is set in your Replit secrets.");
  // throw new Error("Supabase anon key is not configured. Please ensure VITE_SUPABASE_ANON_KEY is set in your Replit secrets.");
}

// Ensure createClient is called with strings, even if they are empty due to missing env vars (warnings above will have fired)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Test the connection
supabase
  .from('shuttles')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Supabase connected successfully!');
    }
  });
