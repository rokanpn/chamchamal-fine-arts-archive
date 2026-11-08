'use client';

import { useState, useEffect } from 'react';
import { resolveMediaUrl } from '@/lib/mediaStorage';

/**
 * Universal React Hook to resolve media URLs directly.
 * Rejects legacy idb:// schemes in favor of cloud Supabase URLs.
 */
export function useResolvedMediaUrl(rawUrl: string | undefined): {
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

  return { resolvedUrl, isLoading: false, isIdb: false, error: null };
}
