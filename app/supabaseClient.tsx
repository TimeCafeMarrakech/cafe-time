import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize the secure, authenticated cloud channel tunnel
export const supabase = createClient(supabaseUrl, supabaseAnonKey);// Force update token log:  2:26:08.49 
