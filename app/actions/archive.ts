'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient, isSupabaseServerConfigured } from '@/lib/supabaseServer';
import { Artwork } from '@/data/artworks';
import { parseArtworkDimensions } from '@/lib/dimensions';
import { AtelierTool } from '@/data/tools';
import { StudentArtist } from '@/data/students';
import { FacultyMember } from '@/types/faculty';
import { Collaborator } from '@/types/collaborators';

/**
 * Safely parses any database field into a guaranteed non-null LocalizedString { ckb, ar, en }.
 * Prevents "TypeError: Cannot read properties of null (reading 'ckb')" when database columns are null.
 */
function parseLocalizedString(field: any, defaultText: string = ''): { ckb: string; ar: string; en: string } {
  if (!field) {
    return { ckb: defaultText, ar: defaultText, en: defaultText };
  }
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
}

/**
 * Universal revalidation trigger for all archive routes.
 * Ensures the Next.js server cache and all static route caches
 * are purged immediately across the site upon any admin mutation.
 */
function triggerArchiveRevalidation(extraPaths: string[] = []) {
  const corePaths = [
    '/admin',
    '/admin/artworks',
    '/admin/tools',
    '/admin/students',
    '/admin/faculty',
    '/admin/collaborators',
    '/artworks',
    '/virtual-tour',
    '/tools',
    '/students',
    '/about/faculty',
    '/collaborators',
    '/',
  ];

  const allPaths = Array.from(new Set([...corePaths, ...extraPaths]));

  for (const path of allPaths) {
    try {
      revalidatePath(path);
    } catch (err) {
      console.warn(`[Revalidate] Failed for path ${path}:`, err);
    }
  }

  // Also revalidate the root layout
  try {
    revalidatePath('/', 'layout');
  } catch (err) {
    console.warn('[Revalidate] Failed for root layout:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// ARTWORKS SERVER ACTIONS
// ─────────────────────────────────────────────────────────────

export async function saveArtworkAction(artwork: Artwork): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();

    const rawW = artwork.width_cm != null ? Number(artwork.width_cm) : undefined;
    const rawH = artwork.height_cm != null ? Number(artwork.height_cm) : undefined;
    const parsedDims = parseArtworkDimensions(artwork.dimensions, rawW, rawH, artwork.aspectRatio);
    const finalWidthCm = rawW ?? parsedDims.widthCm;
    const finalHeightCm = rawH ?? parsedDims.heightCm;
    const finalDimensions = artwork.dimensions || `${finalWidthCm} × ${finalHeightCm} cm`;

    const baselineRow = {
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      year: Number(artwork.year) || new Date().getFullYear(),
      department: artwork.department || 'painting',
      description: artwork.description || {},
      thumbnailUrl: artwork.imageUrl || null,
      imageUrl: artwork.imageUrl || null,
      modelUrl: artwork.modelUrl || null,
      hasPedestal: artwork.hasPedestal !== false,
      modelScale: Number(artwork.modelScale) || 1.0,
      dimensions: finalDimensions,
      width_cm: finalWidthCm,
      height_cm: finalHeightCm,
    };

    const fullRow = {
      ...baselineRow,
      slug: artwork.slug,
      artistId: artwork.artistId,
      artistBio: artwork.artistBio,
      artistGraduationYear: artwork.artistGraduationYear,
      category: artwork.category,
      categoryLabel: artwork.categoryLabel,
      departmentLabel: artwork.departmentLabel,
      medium: artwork.medium,
      dimensions: finalDimensions,
      width_cm: finalWidthCm,
      height_cm: finalHeightCm,
      aspectRatio: artwork.aspectRatio,
      has3DModel: artwork.has3DModel,
      modelVertices: artwork.modelVertices,
      modelPolygons: artwork.modelPolygons,
      featured: Boolean(artwork.featured),
      curatorialEssay: artwork.curatorialEssay,
      audioUrl: artwork.audioUrl,
      audioDurationSeconds: artwork.audioDurationSeconds,
      videoUrl: artwork.videoUrl,
      videoTitle: artwork.videoTitle,
      curatorialPdfUrl: artwork.curatorialPdfUrl,
      curatorialPdfFileName: artwork.curatorialPdfFileName,
      locationInInstitute: artwork.locationInInstitute,
      provenancePedestal: artwork.provenancePedestal,
      physicalPlaqueCode: artwork.physicalPlaqueCode,
      toolSlugs: artwork.toolSlugs,
    };

    let { error } = await supabase.from('artworks').upsert(fullRow, { onConflict: 'id' });

    if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
      console.warn('[saveArtworkAction] Full schema upsert failed, retrying with baseline schema:', error.message);
      const fallback = await supabase.from('artworks').upsert(baselineRow, { onConflict: 'id' });
      error = fallback.error;
    }

    if (error) {
      console.error('[saveArtworkAction] Supabase error:', error);
      triggerArchiveRevalidation([`/artworks/${artwork.slug}`]);
      return { success: false, error: error.message };
    }

    triggerArchiveRevalidation([`/artworks/${artwork.slug}`]);
    return { success: true };
  } catch (err: any) {
    console.error('[saveArtworkAction] Exception:', err);
    triggerArchiveRevalidation();
    return { success: false, error: err?.message || 'Server action exception' };
  }
}

export async function deleteArtworkAction(id: string, slug?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('artworks').delete().or(`id.eq.${id},slug.eq.${id}`);

    if (error) {
      console.error('[deleteArtworkAction] Supabase error:', error);
      triggerArchiveRevalidation();
      return { success: false, error: error.message };
    }

    const extra = slug ? [`/artworks/${slug}`] : [];
    triggerArchiveRevalidation(extra);
    return { success: true };
  } catch (err: any) {
    console.error('[deleteArtworkAction] Exception:', err);
    triggerArchiveRevalidation();
    return { success: false, error: err?.message || 'Server action exception' };
  }
}

export async function toggle3DStatusAction(id: string, has3DModel: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from('artworks')
      .update({ has3DModel, has_3d_model: has3DModel })
      .eq('id', id);

    if (error) {
      console.warn('[toggle3DStatusAction] Warning:', error.message);
    }

    triggerArchiveRevalidation();
    return { success: true };
  } catch (err: any) {
    triggerArchiveRevalidation();
    return { success: false, error: err?.message };
  }
}

// ─────────────────────────────────────────────────────────────
// TOOLS SERVER ACTIONS
// ─────────────────────────────────────────────────────────────

export async function saveToolAction(tool: AtelierTool): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();

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
      console.error('[saveToolAction] Supabase error:', error);
      triggerArchiveRevalidation([`/tools/${tool.slug}`]);
      return { success: false, error: error.message };
    }

    triggerArchiveRevalidation([`/tools/${tool.slug}`]);
    return { success: true };
  } catch (err: any) {
    console.error('[saveToolAction] Exception:', err);
    triggerArchiveRevalidation();
    return { success: false, error: err?.message || 'Server action exception' };
  }
}

export async function deleteToolAction(id: string, slug?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('tools').delete().or(`id.eq.${id},slug.eq.${id}`);

    if (error) {
      console.error('[deleteToolAction] Supabase error:', error);
      triggerArchiveRevalidation();
      return { success: false, error: error.message };
    }

    const extra = slug ? [`/tools/${slug}`] : [];
    triggerArchiveRevalidation(extra);
    return { success: true };
  } catch (err: any) {
    console.error('[deleteToolAction] Exception:', err);
    triggerArchiveRevalidation();
    return { success: false, error: err?.message };
  }
}

// ─────────────────────────────────────────────────────────────
// STUDENTS & ALUMNI SERVER ACTIONS
// ─────────────────────────────────────────────────────────────

export async function saveStudentAction(student: StudentArtist): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();

    const row = {
      id: student.id,
      slug: student.slug,
      fullName: student.fullName,
      department: student.department,
      graduationYear: student.graduationYear,
      avatarUrl: student.avatarUrl,
      bio: student.bio,
      statement: student.statement,
      studioLocation: student.studioLocation,
      awards: student.awards,
      contactLinks: student.contactLinks,
      cohort: student.cohort,
      artworkSlugs: student.artworkSlugs,
      email: student.email,
      disciplines: student.disciplines,
    };

    const { error } = await supabase.from('students').upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('[saveStudentAction] Supabase error:', error);
      triggerArchiveRevalidation([`/students/${student.id}`]);
      return { success: false, error: error.message };
    }

    triggerArchiveRevalidation([`/students/${student.id}`]);
    return { success: true };
  } catch (err: any) {
    console.error('[saveStudentAction] Exception:', err);
    triggerArchiveRevalidation();
    return { success: false, error: err?.message || 'Server action exception' };
  }
}

export async function deleteStudentAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('students').delete().or(`id.eq.${id},slug.eq.${id}`);

    if (error) {
      console.error('[deleteStudentAction] Supabase error:', error);
      triggerArchiveRevalidation();
      return { success: false, error: error.message };
    }

    triggerArchiveRevalidation([`/students/${id}`]);
    return { success: true };
  } catch (err: any) {
    console.error('[deleteStudentAction] Exception:', err);
    triggerArchiveRevalidation();
    return { success: false, error: err?.message };
  }
}

// ─────────────────────────────────────────────────────────────
// FACULTY & ADMINISTRATION SERVER ACTIONS
// ─────────────────────────────────────────────────────────────

export async function saveFacultyAction(member: FacultyMember): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();

    const row = {
      id: member.id,
      slug: member.slug,
      name: member.name,
      role: member.role,
      department: member.department,
      avatarUrl: member.avatarUrl,
      bio: member.bio,
      officeLocation: member.officeLocation,
      academicDegrees: member.academicDegrees,
      contactEmail: member.contactEmail,
      order: member.order,
    };

    const { error } = await supabase.from('faculty').upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('[saveFacultyAction] Supabase error:', error);
      triggerArchiveRevalidation();
      return { success: false, error: error.message };
    }

    triggerArchiveRevalidation();
    return { success: true };
  } catch (err: any) {
    console.error('[saveFacultyAction] Exception:', err);
    triggerArchiveRevalidation();
    return { success: false, error: err?.message };
  }
}

export async function deleteFacultyAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('faculty').delete().or(`id.eq.${id},slug.eq.${id}`);

    if (error) {
      console.error('[deleteFacultyAction] Supabase error:', error);
      triggerArchiveRevalidation();
      return { success: false, error: error.message };
    }

    triggerArchiveRevalidation();
    return { success: true };
  } catch (err: any) {
    console.error('[deleteFacultyAction] Exception:', err);
    triggerArchiveRevalidation();
    return { success: false, error: err?.message };
  }
}

// ─────────────────────────────────────────────────────────────
// COLLABORATORS & VISITING ARTISTS SERVER ACTIONS
// ─────────────────────────────────────────────────────────────

export async function saveCollaboratorAction(collaborator: Collaborator): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();

    const row = {
      id: collaborator.id,
      slug: collaborator.slug,
      name: collaborator.name,
      artistTitle: collaborator.artistTitle,
      country: collaborator.country,
      avatarUrl: collaborator.avatarUrl,
      bio: collaborator.bio,
      curatorialSummary: collaborator.curatorialSummary,
      collaborationYear: collaborator.collaborationYear,
      collaborationType: collaborator.collaborationType,
      collaborationTypeLabel: collaborator.collaborationTypeLabel,
      galleryPhotos: collaborator.galleryPhotos,
      featured: collaborator.featured,
    };

    const { error } = await supabase.from('collaborators').upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('[saveCollaboratorAction] Supabase error:', error);
      triggerArchiveRevalidation();
      return { success: false, error: error.message };
    }

    triggerArchiveRevalidation();
    return { success: true };
  } catch (err: any) {
    console.error('[saveCollaboratorAction] Exception:', err);
    triggerArchiveRevalidation();
    return { success: false, error: err?.message };
  }
}

export async function deleteCollaboratorAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('collaborators').delete().or(`id.eq.${id},slug.eq.${id}`);

    if (error) {
      console.error('[deleteCollaboratorAction] Supabase error:', error);
      triggerArchiveRevalidation();
      return { success: false, error: error.message };
    }

    triggerArchiveRevalidation();
    return { success: true };
  } catch (err: any) {
    console.error('[deleteCollaboratorAction] Exception:', err);
    triggerArchiveRevalidation();
    return { success: false, error: err?.message };
  }
}

// ─────────────────────────────────────────────────────────────
// CONFIGURATION & SETTINGS SERVER ACTIONS
// ─────────────────────────────────────────────────────────────

export async function saveDepartmentConfigAction(config: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();
    const row = {
      id: 'departments_config',
      value: config,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('archive_settings').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[saveDepartmentConfigAction] Settings upsert warning:', error.message);
    }

    triggerArchiveRevalidation();
    return { success: true };
  } catch (err: any) {
    triggerArchiveRevalidation();
    return { success: false, error: err?.message };
  }
}

export async function saveGallerySettingsAction(settings: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();
    const row = {
      id: 'gallery_settings',
      value: settings,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('archive_settings').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('[saveGallerySettingsAction] Settings upsert warning:', error.message);
    }

    triggerArchiveRevalidation(['/virtual-tour']);
    return { success: true };
  } catch (err: any) {
    triggerArchiveRevalidation(['/virtual-tour']);
    return { success: false, error: err?.message };
  }
}

// ─────────────────────────────────────────────────────────────
// SERVER-SIDE INITIAL DATA LOADER
// ─────────────────────────────────────────────────────────────

export interface LiveArchiveData {
  artworks: Artwork[] | null;
  tools: AtelierTool[] | null;
  students: StudentArtist[] | null;
  faculty: FacultyMember[] | null;
  collaborators: Collaborator[] | null;
  departmentsConfig: Record<string, any> | null;
  gallerySettings: Record<string, any> | null;
}

export async function fetchLiveArchiveDataAction(): Promise<LiveArchiveData> {
  const result: LiveArchiveData = {
    artworks: null,
    tools: null,
    students: null,
    faculty: null,
    collaborators: null,
    departmentsConfig: null,
    gallerySettings: null,
  };

  if (!isSupabaseServerConfigured()) {
    return result;
  }

  try {
    const supabase = getSupabaseServerClient();

    // 1. Fetch Artworks
    const { data: artData, error: artErr } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!artErr && Array.isArray(artData) && artData.length > 0) {
      result.artworks = artData.map((row: any) => {
        const rawW = row.width_cm != null ? Number(row.width_cm) : undefined;
        const rawH = row.height_cm != null ? Number(row.height_cm) : undefined;
        const parsedDims = parseArtworkDimensions(row.dimensions, rawW, rawH, row.aspectRatio);
        const finalWidthCm = rawW ?? parsedDims.widthCm;
        const finalHeightCm = rawH ?? parsedDims.heightCm;

        return {
          id: String(row.id),
          slug: row.slug || String(row.id),
          title: parseLocalizedString(row.title, 'Archival Artwork'),
          artist: parseLocalizedString(row.artist, 'Institute Artist'),
          artistId: row.artistId || row.artist_id || 'faculty-collection',
          artistBio: parseLocalizedString(row.artistBio || row.artist_bio, 'Alumnus of Chamchamal Fine Arts Institute'),
          artistGraduationYear: Number(row.artistGraduationYear || row.artist_graduation_year) || 2022,
          category: row.category || 'painting',
          categoryLabel: parseLocalizedString(row.categoryLabel, 'Painting'),
          department: row.department || 'painting',
          departmentLabel: parseLocalizedString(row.departmentLabel, 'Fine Arts'),
          medium: parseLocalizedString(row.medium, 'Mixed Atelier Media'),
          year: Number(row.year) || 2026,
          dimensions: row.dimensions || `${finalWidthCm} × ${finalHeightCm} cm`,
          width_cm: finalWidthCm,
          height_cm: finalHeightCm,
          imageUrl: row.imageUrl || row.image_url || row.thumbnailUrl || row.thumbnail_url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: row.thumbnailUrl || row.thumbnail_url || row.imageUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
          aspectRatio: row.aspectRatio || 'portrait',
          has3DModel: Boolean(row.has3DModel || row.has_3d_model || row.modelUrl || row.model_url),
          hasPedestal: row.hasPedestal !== false && row.has_pedestal !== false,
          modelScale: Number(row.modelScale || row.model_scale) || 1.0,
          modelUrl: row.modelUrl || row.model_url || undefined,
          modelVertices: row.modelVertices || undefined,
          modelPolygons: row.modelPolygons || undefined,
          featured: Boolean(row.featured),
          description: parseLocalizedString(row.description, ''),
          curatorialEssay: row.curatorialEssay ? parseLocalizedString(row.curatorialEssay, '') : undefined,
          audioUrl: row.audioUrl || undefined,
          audioDurationSeconds: Number(row.audioDurationSeconds) || undefined,
          videoUrl: row.videoUrl || undefined,
          videoTitle: row.videoTitle ? parseLocalizedString(row.videoTitle, '') : undefined,
          curatorialPdfUrl: row.curatorialPdfUrl || undefined,
          curatorialPdfFileName: row.curatorialPdfFileName || undefined,
          locationInInstitute: parseLocalizedString(row.locationInInstitute, 'Main Gallery Hall'),
          provenancePedestal: row.provenancePedestal || 'GALLERY-PEDESTAL-1',
          physicalPlaqueCode: row.physicalPlaqueCode || `CFA-${row.year || 2026}-01`,
          atelierTools: [],
          toolSlugs: Array.isArray(row.toolSlugs) ? row.toolSlugs : [],
        };
      });
    }

    // 2. Fetch Tools
    const { data: toolData, error: toolErr } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });

    if (!toolErr && Array.isArray(toolData) && toolData.length > 0) {
      result.tools = toolData.map((row: any) => ({
        id: String(row.id),
        slug: row.slug || String(row.id),
        name: parseLocalizedString(row.name, 'Atelier Tool'),
        category: row.category || 'painting',
        categoryLabel: parseLocalizedString(row.categoryLabel, 'Tools'),
        imageUrl: row.imageUrl || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
        galleryImages: Array.isArray(row.galleryImages) ? row.galleryImages : [],
        description: parseLocalizedString(row.description, ''),
        historicalSignificance: parseLocalizedString(row.historicalSignificance, ''),
        bestPractices: parseLocalizedString(row.bestPractices, ''),
        materials: parseLocalizedString(row.materials, ''),
        origin: parseLocalizedString(row.origin, ''),
        usageInstructions: parseLocalizedString(row.usageInstructions, ''),
        videoUrl: row.videoUrl || '',
        videoTitle: parseLocalizedString(row.videoTitle, ''),
        proTips: typeof row.proTips === 'object' && row.proTips !== null ? row.proTips : { ckb: [], ar: [], en: [] },
        usedInArtworkSlugs: Array.isArray(row.usedInArtworkSlugs) ? row.usedInArtworkSlugs : [],
        glbUrl: row.glbUrl || '',
        audioDuration: row.audioDuration || '',
      }));
    }

    // 3. Fetch Students
    const { data: stuData, error: stuErr } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (!stuErr && Array.isArray(stuData) && stuData.length > 0) {
      result.students = stuData.map((row: any) => ({
        id: String(row.id),
        slug: row.slug || String(row.id),
        fullName: parseLocalizedString(row.fullName, 'Student Artist'),
        department: parseLocalizedString(row.department, 'Fine Arts'),
        graduationYear: Number(row.graduationYear) || 2026,
        avatarUrl: row.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: parseLocalizedString(row.bio, ''),
        statement: parseLocalizedString(row.statement, ''),
        studioLocation: parseLocalizedString(row.studioLocation, 'Chamchamal'),
        awards: Array.isArray(row.awards) ? row.awards : [],
        contactLinks: Array.isArray(row.contactLinks) ? row.contactLinks : [],
        cohort: parseLocalizedString(row.cohort, 'Class of 2026'),
        artworkSlugs: Array.isArray(row.artworkSlugs) ? row.artworkSlugs : [],
        email: row.email || '',
        disciplines: Array.isArray(row.disciplines) ? row.disciplines : [],
      }));
    }

    // 4. Fetch Faculty
    const { data: facData, error: facErr } = await supabase
      .from('faculty')
      .select('*')
      .order('order', { ascending: true });

    if (!facErr && Array.isArray(facData) && facData.length > 0) {
      result.faculty = facData.map((row: any) => ({
        id: String(row.id),
        slug: row.slug || String(row.id),
        name: parseLocalizedString(row.name, 'Faculty Member'),
        role: parseLocalizedString(row.role, 'Faculty'),
        department: parseLocalizedString(row.department, 'Fine Arts'),
        avatarUrl: row.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        bio: parseLocalizedString(row.bio, ''),
        officeLocation: parseLocalizedString(row.officeLocation, ''),
        academicDegrees: Array.isArray(row.academicDegrees) ? row.academicDegrees : [],
        contactEmail: row.contactEmail || '',
        order: Number(row.order) || 0,
      }));
    }

    // 5. Fetch Collaborators
    const { data: colData, error: colErr } = await supabase
      .from('collaborators')
      .select('*')
      .order('created_at', { ascending: false });

    if (!colErr && Array.isArray(colData) && colData.length > 0) {
      result.collaborators = colData.map((row: any) => ({
        id: String(row.id),
        slug: row.slug || String(row.id),
        name: parseLocalizedString(row.name, 'Visiting Artist'),
        artistTitle: parseLocalizedString(row.artistTitle, 'Collaborating Artist'),
        country: parseLocalizedString(row.country, 'Kurdistan'),
        avatarUrl: row.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: parseLocalizedString(row.bio, ''),
        curatorialSummary: parseLocalizedString(row.curatorialSummary, ''),
        collaborationType: row.collaborationType || 'workshop',
        collaborationTypeLabel: parseLocalizedString(row.collaborationTypeLabel, 'Workshop'),
        collaborationYear: Number(row.collaborationYear) || 2026,
        galleryPhotos: Array.isArray(row.galleryPhotos) ? row.galleryPhotos : [],
        featured: Boolean(row.featured),
      }));
    }

    // 6. Fetch Settings
    const { data: settingsData } = await supabase.from('archive_settings').select('*');
    if (Array.isArray(settingsData)) {
      for (const row of settingsData) {
        if (row.id === 'departments_config' && row.value) {
          result.departmentsConfig = row.value;
        } else if (row.id === 'gallery_settings' && row.value) {
          result.gallerySettings = row.value;
        }
      }
    }
  } catch (err) {
    console.warn('[fetchLiveArchiveDataAction] Network or config notice:', err);
  }

  return result;
}
