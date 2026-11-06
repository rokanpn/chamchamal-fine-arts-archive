'use client';

import { useState, useEffect } from 'react';
import { resolveMediaUrl, getStoredMediaBlob } from '@/lib/mediaStorage';

/**
 * Universal React Hook to resolve any media reference (http, https, data, blob, or idb://)
 * into a valid browser-renderable URL.
 * Automatically cleans up temporary Blob object URLs on unmount or URL transition to prevent memory leaks.
 */
export function useResolvedMediaUrl(rawUrl: string | undefined): {
  resolvedUrl: string;
  isLoading: boolean;
  isIdb: boolean;
  error: Error | null;
} {
  const isIdb = Boolean(rawUrl && rawUrl.startsWith('idb://'));

  const [resolvedUrl, setResolvedUrl] = useState<string>(() => {
    if (!rawUrl) return '';
    // Direct browser playable/renderable URLs can be used immediately
    if (
      rawUrl.startsWith('http://') ||
      rawUrl.startsWith('https://') ||
      rawUrl.startsWith('data:') ||
      rawUrl.startsWith('blob:')
    ) {
      return rawUrl;
    }
    // Never initialize state with idb:// scheme to avoid invalid protocol crashes
    return '';
  });

  const [isLoading, setIsLoading] = useState<boolean>(isIdb);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let localBlobUrl: string | null = null;

    if (!rawUrl) {
      setResolvedUrl('');
      setIsLoading(false);
      setError(null);
      return;
    }

    // Direct HTTP, HTTPS, Blob, or Data URLs can be used immediately
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
                setError(new Error(`Media blob not found in IndexedDB for ${rawUrl}`));
              }
              setIsLoading(false);
            });
          }
        })
        .catch((err) => {
          if (isCancelled) return;
          console.warn('[useResolvedMediaUrl] Error resolving media blob:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        });

      return () => {
        isCancelled = true;
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

  return { resolvedUrl, isLoading, isIdb, error };
}
