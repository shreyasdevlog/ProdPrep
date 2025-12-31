'use client';

import { useState, useCallback } from 'react';

export interface Keys {
  geminiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

const DEFAULT_KEYS: Keys = {
  geminiKey: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
};

const getStoredKeys = (): Keys => {
  if (typeof window === 'undefined') {
    return DEFAULT_KEYS;
  }

  return {
    geminiKey: sessionStorage.getItem('GEMINI_KEY') || '',
    supabaseUrl: sessionStorage.getItem('SUPABASE_URL') || '',
    supabaseAnonKey: sessionStorage.getItem('SUPABASE_ANON_KEY') || '',
  };
};

export function useKeys() {
  const [keys, setKeys] = useState<Keys>(getStoredKeys());

  const saveKeys = useCallback((newKeys: Partial<Keys>) => {
    const updatedKeys = { ...keys, ...newKeys };

    if (typeof window !== 'undefined') {
      if (newKeys.geminiKey !== undefined) {
        sessionStorage.setItem('GEMINI_KEY', newKeys.geminiKey);
      }
      if (newKeys.supabaseUrl !== undefined) {
        sessionStorage.setItem('SUPABASE_URL', newKeys.supabaseUrl);
      }
      if (newKeys.supabaseAnonKey !== undefined) {
        sessionStorage.setItem('SUPABASE_ANON_KEY', newKeys.supabaseAnonKey);
      }
    }

    setKeys(updatedKeys);
  }, [keys]);

  const clearKeys = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('GEMINI_KEY');
      sessionStorage.removeItem('SUPABASE_URL');
      sessionStorage.removeItem('SUPABASE_ANON_KEY');
    }
    setKeys(DEFAULT_KEYS);
  }, []);

  const areKeysConfigured = useCallback(() => {
    return !!keys.geminiKey && !!keys.supabaseUrl && !!keys.supabaseAnonKey;
  }, [keys]);

  return {
    keys,
    saveKeys,
    clearKeys,
    areKeysConfigured,
    isLoaded: true,
  };
}
