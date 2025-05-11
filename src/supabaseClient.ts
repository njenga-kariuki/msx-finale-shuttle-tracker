
import { createClient } from '@supabase/supabase-js';

// Get these from Project Settings -> API
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || supabaseUrl === '') {
  console.warn("Supabase URL is not configured");
}

if (!supabaseAnonKey || supabaseAnonKey === '') {
  console.warn("Supabase anon key is not configured");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
