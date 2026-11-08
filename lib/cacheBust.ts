/**
 * Global Asset Cache Buster
 * Appends a version query parameter (?v=2) to static 3D models, textures, images,
 * and fonts so mobile browsers (Safari, Chrome) immediately fetch fresh assets
 * instead of using stale disk/memory caches.
 */

export const ASSET_VERSION = '2';

export function withCacheBust(url: string | undefined | null, version: string = ASSET_VERSION): string {
  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim();
  if (!trimmed) return '';

  // Never touch browser-internal / memory schemes
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('idb://')
  ) {
    return trimmed;
  }

  // If a version tag already exists, update it
  if (/[?&]v=[^&]+/.test(trimmed)) {
    return trimmed.replace(/([?&])v=[^&]+/, `$1v=${version}`);
  }

  const separator = trimmed.includes('?') ? '&' : '?';
  return `${trimmed}${separator}v=${version}`;
}
