import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment or session storage (client-side only)
function getCredentials() {
  // Server-side: use environment variables
  if (typeof window === 'undefined') {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    };
  }

  // Client-side: check session storage first, then fall back to environment
  const sessionUrl = sessionStorage.getItem('SUPABASE_URL');
  const sessionKey = sessionStorage.getItem('SUPABASE_ANON_KEY');

  return {
    url: sessionUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    key: sessionKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  };
}

// Lazy initialization to avoid build-time validation errors
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance !== null) {
    return supabaseInstance;
  }

  const { url, key } = getCredentials();

  // Only create client if not using placeholder credentials
  if (!url.includes('placeholder') && !key.includes('placeholder-key')) {
    supabaseInstance = createClient(url, key);
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
