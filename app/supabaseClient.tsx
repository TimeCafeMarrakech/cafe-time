import { createClient } from '@supabase/supabase-js';

// Directly injected to bypass local dashboard environment environment layer parsing bugs
const supabaseUrl = "https://nsglaxexvwcywvxhcvvm.supabase.co";
const supabaseAnonKey = "sb_publishable_y-5Ec-CK2qVq-3gwv3lhww_Bl9wuV-E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
