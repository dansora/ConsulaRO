import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials as fallback since import.meta.env might not be available in all environments
const SUPABASE_URL = 'https://czxrwjuzploildvpadyh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6eHJ3anV6cGxvaWxkdnBhZHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjAxMzksImV4cCI6MjA4MDE5NjEzOX0.8FFrkZAJKMClUjMLx9wQgqeB9xqkDnR6JM-sDmSqiHU';

// Attempt to use environment variables, fall back to hardcoded strings
const supabaseUrl = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_URL) 
  ? (import.meta as any).env.VITE_SUPABASE_URL 
  : SUPABASE_URL;

const supabaseAnonKey = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_ANON_KEY) 
  ? (import.meta as any).env.VITE_SUPABASE_ANON_KEY 
  : SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Check your .env file or lib/supabaseClient.ts');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);