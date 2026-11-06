import { createClient } from '@supabase/supabase-js';
import { Artwork, ArtworkDepartment, DEPARTMENT_LABELS, LocalizedString } from '@/data/artworks';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.warn(
      '[Supabase] Warning: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.'
    );
  }
}

// Initialize and export the Supabase client singleton
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// Strongly-typed database entity interfaces
export interface LocalizedText {
  ckb?: string;
  ar?: string;
  en?: string;
}

export interface ArtworkRecord {
  id: string;
  title: string | LocalizedText;
  artist: string | LocalizedText;
  year: number;
  department: ArtworkDepartment;
  description?: string | LocalizedText;
  thumbnailUrl?: string | null;
  imageUrl?: string | null;
  modelUrl?: string | null;
  hasPedestal: boolean;
  modelScale: number;
  created_at?: string;
}

/**
 * Uploads a file (image, 3D model .glb/.gltf, audio, video) directly to the Supabase 'archive-media' storage bucket.
 * Returns the permanent public CDN URL and metadata.
 */
export async function uploadMediaToSupabase(
  file: File | Blob,
  fileName?: string,
  folder: string = 'media'
): Promise<{ url: string; path: string; name: string; size: number }> {
  const originalName = fileName || (file instanceof File ? file.name : `file_${Date.now()}`);
  const ext = originalName.includes('.') ? originalName.split('.').pop() : 'bin';
  const cleanBase = originalName
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^\w-]/g, '_')
    .slice(0, 32);
  const filePath = `${folder}/${cleanBase}_${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('archive-media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: (file as any).type || undefined,
    });

  if (error) {
    console.error('[Supabase Storage] Upload error:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('archive-media')
    .getPublicUrl(data.path);

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
    name: originalName,
    size: file.size,
  };
}

/**
 * Maps a Supabase artworks table row into the full client-side Artwork schema.
 * Handles both JSONB objects and plain strings for title/artist/description gracefully.
 */
export function mapSupabaseRowToArtwork(row: any): Artwork {
  const parseLocal = (field: any, defaultText: string = ''): LocalizedString => {
    if (!field) return { ckb: defaultText, ar: defaultText, en: defaultText };
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        if (parsed && typeof parsed === 'object') {
          return {
            ckb: parsed.ckb || parsed.en || defaultText,
            ar: parsed.ar || parsed.en || defaultText,
            en: parsed.en || parsed.ckb || defaultText,
          };
        }
      } catch (_) {}
      return { ckb: field, ar: field, en: field };
    }
    return {
      ckb: field.ckb || field.en || defaultText,
      ar: field.ar || field.en || defaultText,
      en: field.en || field.ckb || defaultText,
    };
  };

  const deptCode: ArtworkDepartment =
    row.department === 'sculpture' || row.department === 'mixed' ? row.department : 'painting';

  const titleObj = parseLocal(row.title, 'Archival Artwork');
  const artistObj = parseLocal(row.artist, 'Institute Artist');
  const descObj = parseLocal(row.description, '');

  const id = String(row.id || `art-${Date.now()}`);
  const slug =
    row.slug ||
    (titleObj.en || titleObj.ckb || id)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-') ||
    id;

  const rawModelUrl = row.modelUrl || row.model_url || '';
  const hasModel = Boolean(rawModelUrl && rawModelUrl.trim().length > 0);
  const rawThumbnailUrl = row.thumbnailUrl || row.thumbnail_url || row.imageUrl || row.image_url || '';
  const imageUrl =
    rawThumbnailUrl && rawThumbnailUrl.trim().length > 0
      ? rawThumbnailUrl
      : 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80';

  const category =
    row.category || (deptCode === 'sculpture' ? 'sculpture' : deptCode === 'mixed' ? 'design' : 'painting');

  return {
    id,
    slug,
    title: titleObj,
    artist: artistObj,
    artistId: row.artistId || row.artist_id || 'faculty-collection',
    artistBio: parseLocal(row.artistBio || row.artist_bio, 'Alumnus of Chamchamal Fine Arts Institute'),
    artistGraduationYear: Number(row.artistGraduationYear || row.artist_graduation_year) || 2022,
    category,
    categoryLabel: DEPARTMENT_LABELS[deptCode],
    department: deptCode,
    departmentLabel: DEPARTMENT_LABELS[deptCode],
    medium: parseLocal(row.medium, deptCode === 'sculpture' ? 'Carved Limestone & Bronze' : 'Mixed Atelier Media'),
    year: Number(row.year) || new Date().getFullYear(),
    dimensions: row.dimensions || '120 × 90 cm',
    imageUrl,
    thumbnailUrl: imageUrl,
    aspectRatio: row.aspectRatio || 'portrait',
    has3DModel: hasModel,
    hasPedestal: row.hasPedestal !== false && row.has_pedestal !== false,
    modelScale:
      typeof row.modelScale === 'number' && row.modelScale > 0
        ? row.modelScale
        : typeof row.model_scale === 'number' && row.model_scale > 0
        ? row.model_scale
        : 1.0,
    modelUrl: hasModel ? rawModelUrl : undefined,
    modelVertices: row.modelVertices || (hasModel ? '320,000 Vertices' : undefined),
    modelPolygons: row.modelPolygons || (hasModel ? '640,000 Triangles' : undefined),
    featured: Boolean(row.featured),
    description: descObj,
    locationInInstitute: parseLocal(row.locationInInstitute || row.location_in_institute, 'Main Gallery Hall'),
    provenancePedestal: row.provenancePedestal || 'GALLERY-PEDESTAL-1',
    physicalPlaqueCode: row.physicalPlaqueCode || `CFA-${row.year || 2026}-${deptCode.slice(0, 2).toUpperCase()}-01`,
    atelierTools: [],
    toolSlugs: Array.isArray(row.toolSlugs) ? row.toolSlugs : [],
  };
}

/**
 * Fetches all artworks from the live Supabase 'artworks' table.
 */
export async function fetchArtworksFromSupabase(): Promise<Artwork[]> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch artworks:', error.message);
      return [];
    }

    if (!data || !Array.isArray(data)) return [];

    return data.map(mapSupabaseRowToArtwork);
  } catch (err) {
    console.warn('[Supabase] Network error during artworks fetch:', err);
    return [];
  }
}

/**
 * Inserts a new artwork into the live Supabase 'artworks' table.
 */
export async function insertArtworkToSupabase(artwork: Artwork): Promise<boolean> {
  try {
    const row = {
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      year: artwork.year,
      department: artwork.department,
      description: artwork.description,
      thumbnailUrl: artwork.imageUrl,
      imageUrl: artwork.imageUrl,
      modelUrl: artwork.modelUrl || null,
      hasPedestal: artwork.hasPedestal !== false,
      modelScale: artwork.modelScale || 1.0,
    };

    const { error } = await supabase.from('artworks').insert(row);
    if (error) {
      console.error('[Supabase] Insert artwork error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Insert artwork exception:', err);
    return false;
  }
}

/**
 * Updates an artwork in the live Supabase 'artworks' table.
 */
export async function updateArtworkInSupabase(
  idOrSlug: string,
  updatedData: Partial<Artwork>
): Promise<boolean> {
  try {
    const row: Record<string, any> = {};
    if (updatedData.title !== undefined) row.title = updatedData.title;
    if (updatedData.artist !== undefined) row.artist = updatedData.artist;
    if (updatedData.year !== undefined) row.year = updatedData.year;
    if (updatedData.department !== undefined) row.department = updatedData.department;
    if (updatedData.description !== undefined) row.description = updatedData.description;
    if (updatedData.imageUrl !== undefined) {
      row.thumbnailUrl = updatedData.imageUrl;
      row.imageUrl = updatedData.imageUrl;
    }
    if (updatedData.modelUrl !== undefined) row.modelUrl = updatedData.modelUrl || null;
    if (updatedData.hasPedestal !== undefined) row.hasPedestal = updatedData.hasPedestal;
    if (updatedData.modelScale !== undefined) row.modelScale = updatedData.modelScale;

    // Try updating existing row
    const { data, error } = await supabase
      .from('artworks')
      .update(row)
      .eq('id', idOrSlug)
      .select();

    if (error) {
      console.error('[Supabase] Update artwork error:', error);
      return false;
    }

    // If row was not yet present in Supabase, insert it so it persists permanently
    if (!data || data.length === 0) {
      const fullRow = {
        id: idOrSlug,
        title: updatedData.title || { ckb: 'شاکاری پەیمانگا', ar: 'عمل فني', en: 'Masterwork' },
        artist: updatedData.artist || { ckb: 'هونەرمەند', ar: 'فنان', en: 'Artist' },
        year: updatedData.year || new Date().getFullYear(),
        department: updatedData.department || 'painting',
        description: updatedData.description || {},
        thumbnailUrl: updatedData.imageUrl || null,
        imageUrl: updatedData.imageUrl || null,
        modelUrl: updatedData.modelUrl || null,
        hasPedestal: updatedData.hasPedestal !== false,
        modelScale: updatedData.modelScale || 1.0,
      };
      await supabase.from('artworks').insert(fullRow);
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Update artwork exception:', err);
    return false;
  }
}

/**
 * Deletes an artwork from the live Supabase 'artworks' table.
 */
export async function deleteArtworkFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('artworks').delete().eq('id', id);
    if (error) {
      console.error('[Supabase] Delete artwork error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Delete artwork exception:', err);
    return false;
  }
}
