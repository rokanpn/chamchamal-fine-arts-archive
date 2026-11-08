import { createClient } from '@supabase/supabase-js';
import { Artwork, ArtworkDepartment, DEPARTMENT_LABELS, LocalizedString } from '@/data/artworks';
import { AtelierTool } from '@/data/tools';
import { parseArtworkDimensions } from '@/lib/dimensions';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

if (!isSupabaseConfigured) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.warn(
      '[Supabase] Warning: Missing valid NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.'
    );
  }
}

// Initialize and export the Supabase client singleton with zero-caching fetch
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          cache: 'no-store',
          headers: {
            ...options.headers,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        });
      },
    },
  }
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
  dimensions?: string;
  width_cm?: number | null;
  height_cm?: number | null;
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
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase credentials. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment or Vercel dashboard.'
    );
  }

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
    throw new Error(
      `Failed to upload to Supabase bucket 'archive-media': ${error.message}. Please verify the bucket exists and public upload is permitted.`
    );
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
            ckb: String(parsed.ckb || parsed.en || parsed.ar || defaultText),
            ar: String(parsed.ar || parsed.en || parsed.ckb || defaultText),
            en: String(parsed.en || parsed.ckb || parsed.ar || defaultText),
          };
        }
      } catch (_) {}
      return { ckb: field, ar: field, en: field };
    }
    if (typeof field === 'object' && field !== null) {
      return {
        ckb: String(field.ckb || field.en || field.ar || defaultText),
        ar: String(field.ar || field.en || field.ckb || defaultText),
        en: String(field.en || field.ckb || field.ar || defaultText),
      };
    }
    return { ckb: defaultText, ar: defaultText, en: defaultText };
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

  const rawW = row.width_cm != null ? Number(row.width_cm) : undefined;
  const rawH = row.height_cm != null ? Number(row.height_cm) : undefined;
  const parsedDims = parseArtworkDimensions(row.dimensions, rawW, rawH, row.aspectRatio);
  const width_cm = rawW ?? parsedDims.widthCm;
  const height_cm = rawH ?? parsedDims.heightCm;

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
    dimensions: row.dimensions || `${width_cm} × ${height_cm} cm`,
    width_cm,
    height_cm,
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
  if (!isSupabaseConfigured) {
    return [];
  }
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
      slug: artwork.slug,
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
      dimensions: artwork.dimensions || `${artwork.width_cm || 120} × ${artwork.height_cm || 90} cm`,
      width_cm: artwork.width_cm != null ? Number(artwork.width_cm) : null,
      height_cm: artwork.height_cm != null ? Number(artwork.height_cm) : null,
    };

    const { error } = await supabase.from('artworks').upsert(row, { onConflict: 'id' });
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
    if (updatedData.dimensions !== undefined) row.dimensions = updatedData.dimensions;
    if (updatedData.width_cm !== undefined) row.width_cm = updatedData.width_cm != null ? Number(updatedData.width_cm) : null;
    if (updatedData.height_cm !== undefined) row.height_cm = updatedData.height_cm != null ? Number(updatedData.height_cm) : null;

    const { data, error } = await supabase
      .from('artworks')
      .update(row)
      .eq('id', idOrSlug)
      .select();

    if (error) {
      console.error('[Supabase] Update artwork error:', error);
      return false;
    }

    if (!data || data.length === 0) {
      const fullRow = {
        id: idOrSlug,
        slug: updatedData.slug || idOrSlug,
        title: updatedData.title || { ckb: 'شاکاری پەیمانگە', ar: 'عمل فني', en: 'Masterwork' },
        artist: updatedData.artist || { ckb: 'هونەرمەند', ar: 'فنان', en: 'Artist' },
        year: updatedData.year || new Date().getFullYear(),
        department: updatedData.department || 'painting',
        description: updatedData.description || {},
        thumbnailUrl: updatedData.imageUrl || null,
        imageUrl: updatedData.imageUrl || null,
        modelUrl: updatedData.modelUrl || null,
        hasPedestal: updatedData.hasPedestal !== false,
        modelScale: updatedData.modelScale || 1.0,
        dimensions: updatedData.dimensions || `${updatedData.width_cm || 120} × ${updatedData.height_cm || 90} cm`,
        width_cm: updatedData.width_cm != null ? Number(updatedData.width_cm) : null,
        height_cm: updatedData.height_cm != null ? Number(updatedData.height_cm) : null,
      };
      await supabase.from('artworks').upsert(fullRow, { onConflict: 'id' });
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
    const { error } = await supabase.from('artworks').delete().or(`id.eq.${id},slug.eq.${id}`);
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

// ─────────────────────────────────────────────────────────────
// TOOLS & PRODUCTS SUPABASE HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Maps a Supabase tools table row into the full client-side AtelierTool schema.
 */
export function mapSupabaseRowToTool(row: any): AtelierTool {
  const parseLocal = (field: any, defaultText: string = ''): LocalizedString => {
    if (!field) return { ckb: defaultText, ar: defaultText, en: defaultText };
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        if (parsed && typeof parsed === 'object') {
          return {
            ckb: String(parsed.ckb || parsed.en || parsed.ar || defaultText),
            ar: String(parsed.ar || parsed.en || parsed.ckb || defaultText),
            en: String(parsed.en || parsed.ckb || parsed.ar || defaultText),
          };
        }
      } catch (_) {}
      return { ckb: field, ar: field, en: field };
    }
    if (typeof field === 'object' && field !== null) {
      return {
        ckb: String(field.ckb || field.en || field.ar || defaultText),
        ar: String(field.ar || field.en || field.ckb || defaultText),
        en: String(field.en || field.ckb || field.ar || defaultText),
      };
    }
    return { ckb: defaultText, ar: defaultText, en: defaultText };
  };

  const id = String(row.id || `tool-${Date.now()}`);
  const slug = row.slug || id;
  const category = (row.category || 'painting') as 'painting' | 'sculpture' | 'ceramics' | 'calligraphy';

  const defaultCategoryLabels: Record<string, LocalizedString> = {
    painting: { ckb: 'شێوەکاری و ڕەنگ', ar: 'الرسم والتلوين', en: 'Painting & Pigments' },
    sculpture: { ckb: 'پەیکەرسازی و بەرد', ar: 'النحت وتشكيل الحجر', en: 'Sculpture & Stone' },
    ceramics: { ckb: 'سیرامیک و ئاگر', ar: 'الخزف والفنون النارية', en: 'Ceramics & Kiln' },
    calligraphy: { ckb: 'خۆشنووسی و مەرەکەب', ar: 'الخط والمداد', en: 'Calligraphy & Inks' },
  };

  const parseProTips = (tips: any) => {
    if (!tips || typeof tips !== 'object') {
      return { ckb: ['کەرەستەکە بە پاکی ڕابگرە.'], ar: ['حافظ على نظافة الأداة.'], en: ['Maintain tool in clean condition.'] };
    }
    return {
      ckb: Array.isArray(tips.ckb) ? tips.ckb : [],
      ar: Array.isArray(tips.ar) ? tips.ar : [],
      en: Array.isArray(tips.en) ? tips.en : [],
    };
  };

  return {
    id,
    slug,
    name: parseLocal(row.name, 'Atelier Tool'),
    category,
    categoryLabel: row.categoryLabel
      ? parseLocal(row.categoryLabel, category)
      : defaultCategoryLabels[category] || defaultCategoryLabels.painting,
    description: parseLocal(row.description, ''),
    historicalSignificance: parseLocal(row.historicalSignificance, ''),
    bestPractices: parseLocal(row.bestPractices, ''),
    materials: parseLocal(row.materials, ''),
    origin: parseLocal(row.origin, ''),
    glbUrl: row.glbUrl || row.glb_url || '',
    imageUrl:
      row.imageUrl ||
      row.image_url ||
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: Array.isArray(row.galleryImages)
      ? row.galleryImages
      : [row.imageUrl || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80'],
    videoUrl: row.videoUrl || '',
    videoTitle: parseLocal(row.videoTitle, ''),
    audioDuration: row.audioDuration || '2:00 Min',
    usageInstructions: parseLocal(row.usageInstructions, ''),
    proTips: parseProTips(row.proTips),
    usedInArtworkSlugs: Array.isArray(row.usedInArtworkSlugs) ? row.usedInArtworkSlugs : [],
  };
}

/**
 * Fetches all tools/products from the live Supabase 'tools' table.
 */
export async function fetchToolsFromSupabase(): Promise<AtelierTool[]> {
  if (!isSupabaseConfigured) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch tools:', error.message);
      return [];
    }

    if (!data || !Array.isArray(data)) return [];

    return data.map(mapSupabaseRowToTool);
  } catch (err) {
    console.warn('[Supabase] Network error during tools fetch:', err);
    return [];
  }
}

/**
 * Inserts or upserts a tool into the live Supabase 'tools' table.
 */
export async function insertToolToSupabase(tool: AtelierTool): Promise<boolean> {
  try {
    const row = {
      id: tool.id,
      slug: tool.slug,
      name: tool.name,
      category: tool.category,
      categoryLabel: tool.categoryLabel,
      imageUrl: tool.imageUrl,
      galleryImages: tool.galleryImages,
      description: tool.description,
      historicalSignificance: tool.historicalSignificance,
      bestPractices: tool.bestPractices,
      materials: tool.materials,
      origin: tool.origin,
      usageInstructions: tool.usageInstructions,
      videoUrl: tool.videoUrl,
      videoTitle: tool.videoTitle,
      proTips: tool.proTips,
      usedInArtworkSlugs: tool.usedInArtworkSlugs,
      glbUrl: tool.glbUrl,
      audioDuration: tool.audioDuration,
    };

    const { error } = await supabase.from('tools').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error('[Supabase] Insert tool error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Insert tool exception:', err);
    return false;
  }
}

/**
 * Updates a tool in the live Supabase 'tools' table.
 */
export async function updateToolInSupabase(
  idOrSlug: string,
  updatedData: Partial<AtelierTool>
): Promise<boolean> {
  try {
    const row: Record<string, any> = {};
    if (updatedData.name !== undefined) row.name = updatedData.name;
    if (updatedData.category !== undefined) row.category = updatedData.category;
    if (updatedData.categoryLabel !== undefined) row.categoryLabel = updatedData.categoryLabel;
    if (updatedData.description !== undefined) row.description = updatedData.description;
    if (updatedData.imageUrl !== undefined) row.imageUrl = updatedData.imageUrl;
    if (updatedData.galleryImages !== undefined) row.galleryImages = updatedData.galleryImages;
    if (updatedData.historicalSignificance !== undefined) row.historicalSignificance = updatedData.historicalSignificance;
    if (updatedData.bestPractices !== undefined) row.bestPractices = updatedData.bestPractices;
    if (updatedData.materials !== undefined) row.materials = updatedData.materials;
    if (updatedData.origin !== undefined) row.origin = updatedData.origin;
    if (updatedData.usageInstructions !== undefined) row.usageInstructions = updatedData.usageInstructions;
    if (updatedData.videoUrl !== undefined) row.videoUrl = updatedData.videoUrl;
    if (updatedData.videoTitle !== undefined) row.videoTitle = updatedData.videoTitle;
    if (updatedData.proTips !== undefined) row.proTips = updatedData.proTips;
    if (updatedData.usedInArtworkSlugs !== undefined) row.usedInArtworkSlugs = updatedData.usedInArtworkSlugs;
    if (updatedData.glbUrl !== undefined) row.glbUrl = updatedData.glbUrl;
    if (updatedData.audioDuration !== undefined) row.audioDuration = updatedData.audioDuration;

    const { data, error } = await supabase
      .from('tools')
      .update(row)
      .eq('id', idOrSlug)
      .select();

    if (error) {
      console.error('[Supabase] Update tool error:', error);
      return false;
    }

    if (!data || data.length === 0) {
      const fullRow = {
        id: idOrSlug,
        slug: updatedData.slug || idOrSlug,
        ...row,
      };
      await supabase.from('tools').upsert(fullRow, { onConflict: 'id' });
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Update tool exception:', err);
    return false;
  }
}

/**
 * Deletes a tool from the live Supabase 'tools' table.
 */
export async function deleteToolFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('tools').delete().or(`id.eq.${id},slug.eq.${id}`);
    if (error) {
      console.error('[Supabase] Delete tool error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Delete tool exception:', err);
    return false;
  }
}
