'use client';

import React from 'react';
import { useResolvedMediaUrl } from '@/hooks/useResolvedMediaUrl';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  fallbackSrc?: string;
  sizes?: string;
}

/**
 * SafeImage: Universal Image component replacing Next.js <Image> for dynamic/user-uploaded media.
 * - Resolves idb:// IndexedDB references into temporary blob: URLs with automatic memory cleanup.
 * - Eliminates Next.js "unconfigured host" crashes for custom or external image URLs.
 * - Eliminates "invalid protocol" crashes when idb:// is passed to next/image.
 * - Supports fill layout, eager priority loading, and graceful error fallbacks.
 */
export function SafeImage({
  src,
  alt,
  fill,
  priority,
  fallbackSrc = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
  className = '',
  style,
  onError,
  sizes,
  ...props
}: SafeImageProps) {
  const { resolvedUrl } = useResolvedMediaUrl(src);

  const isIdb = Boolean(src && src.startsWith('idb://'));
  const effectiveSrc = isIdb
    ? (resolvedUrl || fallbackSrc)
    : (resolvedUrl || src || fallbackSrc);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    }
    if (onError) {
      onError(e);
    }
  };

  if (fill) {
    return (
      <img
        src={effectiveSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={handleError}
        {...props}
      />
    );
  }

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={handleError}
      {...props}
    />
  );
}
