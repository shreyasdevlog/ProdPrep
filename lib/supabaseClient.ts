import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Lazy initialization to avoid build-time validation errors
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance !== null) {
    return supabaseInstance;
  }

  // Only create client if not using placeholder credentials
  if (!supabaseUrl.includes('placeholder')) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
}

export const supabase = getSupabaseClient();

export interface Interview {
  id: string;
  user_id: string;
  cv_text: string;
  interview_type: 'Product Design' | 'RCA' | 'Strategy';
  status: 'pending' | 'completed';
  transcript: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}
