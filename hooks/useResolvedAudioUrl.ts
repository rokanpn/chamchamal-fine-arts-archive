'use client';

import { useState, useEffect } from 'react';
import { resolveMediaUrl, getStoredMediaBlob } from '@/lib/mediaStorage';

/**
 * Custom React Hook to resolve audio URLs (including custom idb:// schemes)
 * into natively playable browser URLs (blob: or http/data).
 * Automatically cleans up created Blob object URLs on unmount or URL transition to prevent memory leaks.
 */
export function useResolvedAudioUrl(rawUrl: string | undefined): {
  resolvedUrl: string;
  isLoading: boolean;
  isIdb: boolean;
  error: Error | null;
} {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const isIdb = Boolean(rawUrl && rawUrl.startsWith('idb://'));

  useEffect(() => {
    let isCancelled = false;
    let localBlobUrl: string | null = null;

    if (!rawUrl) {
      setResolvedUrl('');
      setIsLoading(false);
      setError(null);
      return;
    }

    // Direct HTTP, HTTPS, Blob, or Data URLs can be played immediately
    if (
      rawUrl.startsWith('http://') ||
      rawUrl.startsWith('https://') ||
      rawUrl.startsWith('data:') ||
      rawUrl.startsWith('blob:')
    ) {
      setResolvedUrl(rawUrl);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Intercept and resolve idb:// custom scheme
    if (rawUrl.startsWith('idb://')) {
      setIsLoading(true);
      setError(null);

      getStoredMediaBlob(rawUrl)
        .then((blob) => {
          if (isCancelled) return;

          if (blob) {
            // Generate valid playback URL from the stored audio Blob
            localBlobUrl = URL.createObjectURL(blob);
            setResolvedUrl(localBlobUrl);
            setIsLoading(false);
          } else {
            // Fallback to resolveMediaUrl in case dataUrl exists in record or memory cache
            resolveMediaUrl(rawUrl).then((fallbackUrl) => {
              if (isCancelled) return;
              if (fallbackUrl) {
                setResolvedUrl(fallbackUrl);
              } else {
                setError(new Error(`Audio blob not found in IndexedDB for ${rawUrl}`));
              }
              setIsLoading(false);
            });
          }
        })
        .catch((err) => {
          if (isCancelled) return;
          console.warn('[useResolvedAudioUrl] Error resolving audio blob:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        });

      return () => {
        isCancelled = true;
        // Proper cleanup using URL.revokeObjectURL on unmount / URL transition
        if (localBlobUrl) {
          URL.revokeObjectURL(localBlobUrl);
        }
      };
    }

    // Fallback for other potential media schemes
    resolveMediaUrl(rawUrl).then((res) => {
      if (!isCancelled) {
        setResolvedUrl(res || rawUrl);
        setIsLoading(false);
      }
    });

    return () => {
      isCancelled = true;
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
      }
    };
  }, [rawUrl]);

  return {
    resolvedUrl,
    isLoading,
    isIdb,
    error,
  };
}
