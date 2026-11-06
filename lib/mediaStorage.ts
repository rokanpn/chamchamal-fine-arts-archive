// Native Client Device Media Storage Engine (IndexedDB + Blob / Data URL)

const DB_NAME = 'ChamchamalMediaArchiveDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

let dbPromise: Promise<IDBDatabase> | null = null;
const objectUrlCache = new Map<string, string>();

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only available in browser environments'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return dbPromise;
}

export interface StoredMediaRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  dataUrl?: string;
  createdAt: number;
}

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
 * Stores a local device file into IndexedDB and in-memory cache.
 * For files under 2.5MB, also stores a DataURL for instant portability.
 */
export async function storeLocalFile(file: File): Promise<{
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}> {
  const id = `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  let dataUrl: string | undefined;

  // Convert to Base64 DataURL if under 3MB for immediate portability
  if (file.size <= 3 * 1024 * 1024) {
    try {
      dataUrl = await fileToDataUrl(file);
    } catch (e) {
      console.warn('Could not generate DataURL', e);
    }
  }

  const activeUrl = dataUrl || (typeof window !== 'undefined' ? URL.createObjectURL(file) : '');
  objectUrlCache.set(id, activeUrl);

  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record: StoredMediaRecord = {
      id,
      name: file.name,
      type: file.type,
      size: file.size,
      blob: file,
      dataUrl,
      createdAt: Date.now(),
    };

    store.put(record);
  } catch (err) {
    console.warn('IndexedDB persistence warning, using in-memory object URL fallback', err);
  }

  // If we have a DataURL, prefer it for cross-tab persistence; otherwise use idb reference
  const persistentUrl = dataUrl || `idb://${id}`;

  return {
    id,
    url: persistentUrl,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

/**
 * Resolves any media reference (http, https, data:, blob:, or idb://)
 * into a live, playable browser URL.
 */
export async function resolveMediaUrl(url: string | undefined): Promise<string> {
  if (!url) return '';
  if (typeof window === 'undefined') return url;

  // Standard web or data or blob URLs
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Handle idb:// references
  if (url.startsWith('idb://')) {
    const id = url.replace('idb://', '');
    if (objectUrlCache.has(id)) {
      return objectUrlCache.get(id)!;
    }

    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      return new Promise<string>((resolve) => {
        req.onsuccess = () => {
          const record = req.result as StoredMediaRecord | undefined;
          if (record) {
            if (record.dataUrl) {
              objectUrlCache.set(id, record.dataUrl);
              resolve(record.dataUrl);
            } else if (record.blob) {
              const liveUrl = URL.createObjectURL(record.blob);
              objectUrlCache.set(id, liveUrl);
              resolve(liveUrl);
            } else {
              resolve('');
            }
          } else {
            resolve('');
          }
        };
        req.onerror = () => resolve('');
      });
    } catch (e) {
      console.warn('Error resolving IDB media url', e);
      return '';
    }
  }

  return url;
}

/**
 * Retrieves the raw Blob stored in IndexedDB for a given idb:// reference or media ID.
 */
export async function getStoredMediaBlob(idOrUrl: string): Promise<Blob | null> {
  if (!idOrUrl || typeof window === 'undefined') return null;
  const id = idOrUrl.startsWith('idb://') ? idOrUrl.replace('idb://', '') : idOrUrl;

  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);

    return new Promise<Blob | null>((resolve) => {
      req.onsuccess = () => {
        const record = req.result as StoredMediaRecord | undefined;
        if (record && record.blob) {
          resolve(record.blob);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('getStoredMediaBlob error:', err);
    return null;
  }
}
