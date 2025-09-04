// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anonymous key are required and must be defined as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or Netlify environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);