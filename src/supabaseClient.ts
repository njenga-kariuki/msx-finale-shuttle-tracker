import { createClient } from '@supabase/supabase-js';

// Replace with your project's URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.warn("Supabase URL is not configured. Please update src/supabaseClient.ts");
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn("Supabase anon key is not configured. Please update src/supabaseClient.ts");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 