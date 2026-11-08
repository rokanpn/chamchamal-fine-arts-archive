// Media URL Resolution & Utility Helpers (IndexedDB Stripped - Pure Cloud Storage)

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Resolves any media reference into a live, playable browser URL.
 * Legacy idb:// schemes are stripped in favor of permanent Supabase CDN URLs.
 */
export async function resolveMediaUrl(url: string | undefined): Promise<string> {
  if (!url) return '';
  if (url.startsWith('idb://')) return '';
  return url;
}

/**
 * Deprecated IndexedDB blob getter (kept as no-op returning null for interface compatibility)
 */
export async function getStoredMediaBlob(_idOrUrl: string): Promise<Blob | null> {
  return null;
}
