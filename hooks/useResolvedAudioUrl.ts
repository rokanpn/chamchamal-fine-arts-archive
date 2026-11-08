'use client';

import { useState, useEffect } from 'react';
import { resolveMediaUrl } from '@/lib/mediaStorage';

/**
 * Custom React Hook to resolve audio URLs directly.
 * Strips legacy idb:// schemes in favor of cloud Supabase audio URLs.
 */
export function useResolvedAudioUrl(rawUrl: string | undefined): {
  resolvedUrl: string;
  isLoading: boolean;
  isIdb: boolean;
  error: Error | null;
} {
  const isIdb = Boolean(rawUrl && rawUrl.startsWith('idb://'));

  const [resolvedUrl, setResolvedUrl] = useState<string>(() => {
    if (!rawUrl || isIdb) return '';
    return rawUrl;
  });

  useEffect(() => {
    if (!rawUrl || rawUrl.startsWith('idb://')) {
      setResolvedUrl('');
      return;
    }
    setResolvedUrl(rawUrl);
  }, [rawUrl]);

  return {
    resolvedUrl,
    isLoading: false,
    isIdb: false,
    error: null,
  };
}
