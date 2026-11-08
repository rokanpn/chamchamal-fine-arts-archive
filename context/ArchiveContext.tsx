'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Artwork, ARTWORKS_DATA } from '@/data/artworks';
import { StudentArtist, STUDENTS_DATA } from '@/data/students';
import { AtelierTool, TOOLS_DATA } from '@/data/tools';
import { FacultyMember } from '@/types/faculty';
import { FACULTY_DATA } from '@/data/faculty';
import { Collaborator } from '@/types/collaborators';
import { COLLABORATORS_DATA } from '@/data/collaborators';
import { CuratorUser } from '@/types/admin';
import { 
  supabase,
  fetchArtworksFromSupabase, 
  insertArtworkToSupabase, 
  updateArtworkInSupabase, 
  deleteArtworkFromSupabase 
} from '@/lib/supabase';
import {
  saveArtworkAction,
  deleteArtworkAction,
  toggle3DStatusAction,
  saveToolAction,
  deleteToolAction,
  saveStudentAction,
  deleteStudentAction,
  saveFacultyAction,
  deleteFacultyAction,
  saveCollaboratorAction,
  deleteCollaboratorAction,
  saveDepartmentConfigAction,
  saveGallerySettingsAction,
  fetchLiveArchiveDataAction,
} from '@/app/actions/archive';

export interface AmbientTrack {
  id: string;
  title: string;
  url: string;
}

export interface GallerySettings {
  ambientTracks: AmbientTrack[];
}

export type DepartmentId = 'painting' | 'music' | 'theater';

export interface DepartmentConfig {
  id: DepartmentId;
  title: string;
  subtitle: string;
  badgeText: string;
  description: string;
  coverImage: string;
}

interface ArchiveContextType {
  artworks: Artwork[];
  students: StudentArtist[];
  tools: AtelierTool[];
  faculty: FacultyMember[];
  collaborators: Collaborator[];

  // Gallery Settings (Multi-Track Ambient Playlist)
  gallerySettings: GallerySettings;
  updateGallerySettings: (settings: Partial<GallerySettings>) => void;

  // Departments Visual Metadata Config
  departmentsConfig: Record<DepartmentId, DepartmentConfig>;
  updateDepartmentConfig: (id: DepartmentId, newConfig: Partial<DepartmentConfig>) => void;
  resetDepartmentConfig: (id?: DepartmentId) => void;

  // Artworks
  addArtwork: (artwork: Artwork) => void;
  updateArtwork: (slug: string, updatedData: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;
  toggle3DStatus: (id: string) => void;

  // Tools
  addTool: (tool: AtelierTool) => void;
  updateTool: (slugOrId: string, updatedData: Partial<AtelierTool>) => void;
  deleteTool: (id: string) => void;

  // Students & Alumni
  addStudent: (student: StudentArtist) => void;
  updateStudent: (idOrSlug: string, updatedData: Partial<StudentArtist>) => void;
  deleteStudent: (id: string) => void;

  // Faculty & Administration
  addFaculty: (member: FacultyMember) => void;
  updateFaculty: (idOrSlug: string, updatedData: Partial<FacultyMember>) => void;
  deleteFaculty: (id: string) => void;

  // Visiting Artists & Collaborators
  addCollaborator: (collaborator: Collaborator) => void;
  updateCollaborator: (idOrSlug: string, updatedData: Partial<Collaborator>) => void;
  deleteCollaborator: (id: string) => void;

  // Curatorial Authentication
  isAuthenticated: boolean;
  curator: CuratorUser | null;
  login: (passcode: string) => boolean;
  logout: () => void;
  isHydrated: boolean;
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

// ── Cache versioning & storage keys ─────────────────────────────────
const DATA_VERSION = 'v4';
const ARTWORKS_STORAGE_KEY = `chamchamal_curated_artworks_${DATA_VERSION}`;
const TOOLS_STORAGE_KEY = `chamchamal_curated_tools_${DATA_VERSION}`;
const STUDENTS_STORAGE_KEY = `chamchamal_curated_students_${DATA_VERSION}`;
const FACULTY_STORAGE_KEY = `chamchamal_curated_faculty_${DATA_VERSION}`;
const COLLABORATORS_STORAGE_KEY = `chamchamal_curated_collaborators_${DATA_VERSION}`;
const GALLERY_SETTINGS_STORAGE_KEY = `chamchamal_curated_gallery_settings_${DATA_VERSION}`;
const DEPARTMENTS_CONFIG_STORAGE_KEY = `chamchamal_curated_departments_config_${DATA_VERSION}`;
const AUTH_STORAGE_KEY = 'chamchamal_curator_session_token';

// Tracking deleted items so static seed data never resurrects deleted records on reload
const DELETED_ARTWORKS_KEY = `chamchamal_deleted_artworks_${DATA_VERSION}`;
const DELETED_TOOLS_KEY = `chamchamal_deleted_tools_${DATA_VERSION}`;
const DELETED_STUDENTS_KEY = `chamchamal_deleted_students_${DATA_VERSION}`;
const DELETED_FACULTY_KEY = `chamchamal_deleted_faculty_${DATA_VERSION}`;
const DELETED_COLLABORATORS_KEY = `chamchamal_deleted_collaborators_${DATA_VERSION}`;

function getDeletedIds(storageKey: string): Set<string> {
  if (typeof localStorage === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function addDeletedId(storageKey: string, id: string) {
  if (typeof localStorage === 'undefined') return;
  try {
    const set = getDeletedIds(storageKey);
    set.add(id);
    localStorage.setItem(storageKey, JSON.stringify(Array.from(set)));
  } catch (_) {}
}

function removeDeletedId(storageKey: string, id: string) {
  if (typeof localStorage === 'undefined') return;
  try {
    const set = getDeletedIds(storageKey);
    set.delete(id);
    localStorage.setItem(storageKey, JSON.stringify(Array.from(set)));
  } catch (_) {}
}

export const DEFAULT_DEPARTMENTS_CONFIG: Record<DepartmentId, DepartmentConfig> = {
  painting: {
    id: 'painting',
    title: 'شێوەکاری',
    subtitle: 'شێوەکاری و هونەری بینراو',
    badgeText: 'شاکارەکانی کانڤاس و بەرد',
    description: 'شێوەکاری ئەکادیمی، پەیکەرسازی، سیرامیک و گرافیک دیزاینی هاوچەرخ',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
  },
  music: {
    id: 'music',
    title: 'مۆسیقا',
    subtitle: 'ئاواز و ژەنینی ئامێرەکان',
    badgeText: 'ئاوازی تاری گەرمیان',
    description: 'تۆماری ئاوازە دێرینەکانی گەرمیان، ژەنینی تاری کوردی و مەقاماتی ڕەسەن',
    coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
  },
  theater: {
    id: 'theater',
    title: 'شانۆ',
    subtitle: 'نواندن، دراما و سینۆگرافیا',
    badgeText: 'نمایشی زیندووی سەکۆ',
    description: 'شانۆگەری درامی، نواندنی جەستەیی، دەرهێنان و دیمەنکاری سینۆگرافیا',
    coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
  },
};

export const DEFAULT_AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'track-1',
    title: 'ئاوازی نەرم و مۆسیقای گەشت بە هۆڵی پێشانگادا (Museum Atelier Reverie)',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-impromptu-01-112196.mp3',
  },
  {
    id: 'track-2',
    title: 'شنەی گەرمیان • تاری کلاسیکی کوردی (Echoes of Garmian Strings)',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
  },
  {
    id: 'track-3',
    title: 'بێدەنگی و ئارامی ستۆدیۆی هونەر (Contemplative Fine Arts Hall)',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=soft-ambient-11116.mp3',
  },
];

export const DEFAULT_GALLERY_SETTINGS: GallerySettings = {
  ambientTracks: DEFAULT_AMBIENT_TRACKS,
};

const DEMO_CURATOR: CuratorUser = {
  id: 'curator-01',
  name: 'مامۆستا زریان بەرزنجی (Curator Zryan)',
  role: 'سەرپەرشتیاری ئەرشیفی دیجیتاڵی (Chief Archivist)',
  department: 'پەیمانگەی هونەرە جوانەکانی چەمچەماڵ',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  lastActive: 'ئێستا چالاکە • Active Now',
};

export function ArchiveProvider({ children }: { children: ReactNode }) {
  const [artworks, setArtworks] = useState<Artwork[]>(ARTWORKS_DATA);
  const [students, setStudents] = useState<StudentArtist[]>(STUDENTS_DATA);
  const [tools, setTools] = useState<AtelierTool[]>(TOOLS_DATA);
  const [faculty, setFaculty] = useState<FacultyMember[]>(FACULTY_DATA);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(COLLABORATORS_DATA);
  const [gallerySettings, setGallerySettings] = useState<GallerySettings>(DEFAULT_GALLERY_SETTINGS);
  const [departmentsConfig, setDepartmentsConfig] = useState<Record<DepartmentId, DepartmentConfig>>(DEFAULT_DEPARTMENTS_CONFIG);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [curator, setCurator] = useState<CuratorUser | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Initialize and synchronize with localStorage & live Supabase
  useEffect(() => {
    try {
      // 1. Restore local cache on client mount
      const deletedArtIds = getDeletedIds(DELETED_ARTWORKS_KEY);
      const storedArtworks = localStorage.getItem(ARTWORKS_STORAGE_KEY);
      if (storedArtworks) {
        const parsed = JSON.parse(storedArtworks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArtworks(parsed.filter((a: any) => !deletedArtIds.has(a.id) && !deletedArtIds.has(a.slug)));
        }
      } else {
        setArtworks(ARTWORKS_DATA.filter((a) => !deletedArtIds.has(a.id) && !deletedArtIds.has(a.slug)));
      }

      const deletedToolIds = getDeletedIds(DELETED_TOOLS_KEY);
      const storedTools = localStorage.getItem(TOOLS_STORAGE_KEY);
      if (storedTools) {
        const parsedTools = JSON.parse(storedTools);
        if (Array.isArray(parsedTools) && parsedTools.length > 0) {
          setTools(parsedTools.filter((t: any) => !deletedToolIds.has(t.id) && !deletedToolIds.has(t.slug)));
        }
      } else {
        setTools(TOOLS_DATA.filter((t) => !deletedToolIds.has(t.id) && !deletedToolIds.has(t.slug)));
      }

      const deletedStuIds = getDeletedIds(DELETED_STUDENTS_KEY);
      const storedStudents = localStorage.getItem(STUDENTS_STORAGE_KEY);
      if (storedStudents) {
        const parsedStudents = JSON.parse(storedStudents);
        if (Array.isArray(parsedStudents) && parsedStudents.length > 0) {
          setStudents(parsedStudents.filter((s: any) => !deletedStuIds.has(s.id) && !deletedStuIds.has(s.slug)));
        }
      } else {
        setStudents(STUDENTS_DATA.filter((s) => !deletedStuIds.has(s.id) && !deletedStuIds.has(s.slug)));
      }

      const deletedFacIds = getDeletedIds(DELETED_FACULTY_KEY);
      const storedFaculty = localStorage.getItem(FACULTY_STORAGE_KEY);
      if (storedFaculty) {
        const parsedFaculty = JSON.parse(storedFaculty);
        if (Array.isArray(parsedFaculty) && parsedFaculty.length > 0) {
          setFaculty(parsedFaculty.filter((f: any) => !deletedFacIds.has(f.id) && !deletedFacIds.has(f.slug)));
        }
      } else {
        setFaculty(FACULTY_DATA.filter((f) => !deletedFacIds.has(f.id) && !deletedFacIds.has(f.slug)));
      }

      const deletedColIds = getDeletedIds(DELETED_COLLABORATORS_KEY);
      const storedCollaborators = localStorage.getItem(COLLABORATORS_STORAGE_KEY);
      if (storedCollaborators) {
        const parsedCollaborators = JSON.parse(storedCollaborators);
        if (Array.isArray(parsedCollaborators) && parsedCollaborators.length > 0) {
          setCollaborators(parsedCollaborators.filter((c: any) => !deletedColIds.has(c.id) && !deletedColIds.has(c.slug)));
        }
      } else {
        setCollaborators(COLLABORATORS_DATA.filter((c) => !deletedColIds.has(c.id) && !deletedColIds.has(c.slug)));
      }

      const storedSettings = localStorage.getItem(GALLERY_SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        if (parsedSettings && Array.isArray(parsedSettings.ambientTracks) && parsedSettings.ambientTracks.length > 0) {
          setGallerySettings(parsedSettings);
        }
      }

      const storedDepts = localStorage.getItem(DEPARTMENTS_CONFIG_STORAGE_KEY);
      if (storedDepts) {
        const parsed = JSON.parse(storedDepts);
        if (parsed && typeof parsed === 'object') {
          setDepartmentsConfig((prev) => ({ ...prev, ...parsed }));
        }
      }

      const session = localStorage.getItem(AUTH_STORAGE_KEY);
      if (session === 'authenticated_curator_token') {
        setIsAuthenticated(true);
        setCurator(DEMO_CURATOR);
      }

      // 2. Comprehensive Server & Supabase Live Synchronization
      const syncLiveArchive = async () => {
        try {
          const liveData = await fetchLiveArchiveDataAction();

          // Sync Artworks
          const currentDeletedArts = getDeletedIds(DELETED_ARTWORKS_KEY);
          if (liveData.artworks && liveData.artworks.length > 0) {
            const liveIds = new Set(liveData.artworks.map((a) => a.id));
            const staticFallback = ARTWORKS_DATA.filter(
              (a) => !liveIds.has(a.id) && !currentDeletedArts.has(a.id) && !currentDeletedArts.has(a.slug)
            );
            const freshList = [
              ...liveData.artworks.filter((a) => !currentDeletedArts.has(a.id) && !currentDeletedArts.has(a.slug)),
              ...staticFallback,
            ];
            setArtworks(freshList);
            try {
              localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(freshList));
            } catch (_) {}
          } else {
            // Check client-side direct Supabase fallback
            const clientLiveArts = await fetchArtworksFromSupabase();
            if (clientLiveArts && clientLiveArts.length > 0) {
              const liveIds = new Set(clientLiveArts.map((a) => a.id));
              const staticFallback = ARTWORKS_DATA.filter(
                (a) => !liveIds.has(a.id) && !currentDeletedArts.has(a.id) && !currentDeletedArts.has(a.slug)
              );
              const freshList = [
                ...clientLiveArts.filter((a) => !currentDeletedArts.has(a.id) && !currentDeletedArts.has(a.slug)),
                ...staticFallback,
              ];
              setArtworks(freshList);
              try {
                localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(freshList));
              } catch (_) {}
            }
          }

          // Sync Tools
          const currentDeletedTools = getDeletedIds(DELETED_TOOLS_KEY);
          if (liveData.tools && liveData.tools.length > 0) {
            const liveToolIds = new Set(liveData.tools.map((t) => t.id));
            const staticFallback = TOOLS_DATA.filter(
              (t) => !liveToolIds.has(t.id) && !currentDeletedTools.has(t.id) && !currentDeletedTools.has(t.slug)
            );
            const freshList = [
              ...liveData.tools.filter((t) => !currentDeletedTools.has(t.id) && !currentDeletedTools.has(t.slug)),
              ...staticFallback,
            ];
            setTools(freshList);
            try {
              localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(freshList));
            } catch (_) {}
          }

          // Sync Students
          const currentDeletedStudents = getDeletedIds(DELETED_STUDENTS_KEY);
          if (liveData.students && liveData.students.length > 0) {
            const liveStuIds = new Set(liveData.students.map((s) => s.id));
            const staticFallback = STUDENTS_DATA.filter(
              (s) => !liveStuIds.has(s.id) && !currentDeletedStudents.has(s.id) && !currentDeletedStudents.has(s.slug)
            );
            const freshList = [
              ...liveData.students.filter((s) => !currentDeletedStudents.has(s.id) && !currentDeletedStudents.has(s.slug)),
              ...staticFallback,
            ];
            setStudents(freshList);
            try {
              localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(freshList));
            } catch (_) {}
          }

          // Sync Faculty
          const currentDeletedFaculty = getDeletedIds(DELETED_FACULTY_KEY);
          if (liveData.faculty && liveData.faculty.length > 0) {
            const liveFacIds = new Set(liveData.faculty.map((f) => f.id));
            const staticFallback = FACULTY_DATA.filter(
              (f) => !liveFacIds.has(f.id) && !currentDeletedFaculty.has(f.id) && !currentDeletedFaculty.has(f.slug)
            );
            const freshList = [
              ...liveData.faculty.filter((f) => !currentDeletedFaculty.has(f.id) && !currentDeletedFaculty.has(f.slug)),
              ...staticFallback,
            ].sort((a, b) => a.order - b.order);
            setFaculty(freshList);
            try {
              localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(freshList));
            } catch (_) {}
          }

          // Sync Collaborators
          const currentDeletedCollabs = getDeletedIds(DELETED_COLLABORATORS_KEY);
          if (liveData.collaborators && liveData.collaborators.length > 0) {
            const liveColIds = new Set(liveData.collaborators.map((c) => c.id));
            const staticFallback = COLLABORATORS_DATA.filter(
              (c) => !liveColIds.has(c.id) && !currentDeletedCollabs.has(c.id) && !currentDeletedCollabs.has(c.slug)
            );
            const freshList = [
              ...liveData.collaborators.filter((c) => !currentDeletedCollabs.has(c.id) && !currentDeletedCollabs.has(c.slug)),
              ...staticFallback,
            ];
            setCollaborators(freshList);
            try {
              localStorage.setItem(COLLABORATORS_STORAGE_KEY, JSON.stringify(freshList));
            } catch (_) {}
          }

          // Sync Settings
          if (liveData.departmentsConfig) {
            setDepartmentsConfig((prev) => ({ ...prev, ...liveData.departmentsConfig }));
          }
          if (liveData.gallerySettings && liveData.gallerySettings.ambientTracks) {
            setGallerySettings((prev) => ({ ...prev, ...liveData.gallerySettings }));
          }
        } catch (err) {
          console.warn('[ArchiveContext] Live archive sync notice:', err);
        }
      };

      // Initial live fetch
      syncLiveArchive();

      // Real-time listener for postgres changes on artworks table
      const channel = supabase
        .channel('realtime_archive_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'artworks' },
          () => {
            syncLiveArchive();
          }
        )
        .subscribe();

      // Revalidate on visibility change (switching tabs, waking screen)
      const handleRevalidate = () => {
        if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
          syncLiveArchive();
        }
      };

      window.addEventListener('visibilitychange', handleRevalidate);
      window.addEventListener('focus', handleRevalidate);

      setIsHydrated(true);

      return () => {
        supabase.removeChannel(channel);
        window.removeEventListener('visibilitychange', handleRevalidate);
        window.removeEventListener('focus', handleRevalidate);
      };
    } catch (err) {
      console.warn('[ArchiveContext] Storage initialization notice', err);
      setIsHydrated(true);
    }
  }, []);

  // ── Artworks Handlers ──────────────────────────────────────────────
  const addArtwork = (newArt: Artwork) => {
    setArtworks((prev) => {
      const updated = [newArt, ...prev.filter((a) => a.id !== newArt.id && a.slug !== newArt.slug)];
      try {
        localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    removeDeletedId(DELETED_ARTWORKS_KEY, newArt.id);
    if (newArt.slug) removeDeletedId(DELETED_ARTWORKS_KEY, newArt.slug);

    // Persist via Server Action (bypasses RLS with service role key & revalidates paths)
    saveArtworkAction(newArt).then((res) => {
      if (!res.success) {
        console.warn('[ArchiveContext] saveArtworkAction warning:', res.error);
        insertArtworkToSupabase(newArt);
      }
    }).catch(() => {
      insertArtworkToSupabase(newArt);
    });
  };

  const updateArtwork = (slug: string, updatedData: Partial<Artwork>) => {
    let resolvedId = slug;
    let fullArtwork: Artwork | null = null;

    setArtworks((prev) => {
      const updated = prev.map((a) => {
        if (a.slug === slug || a.id === slug) {
          resolvedId = a.id;
          const merged: Artwork = {
            ...a,
            ...updatedData,
            title: updatedData.title ? { ...a.title, ...updatedData.title } : a.title,
            medium: updatedData.medium ? { ...a.medium, ...updatedData.medium } : a.medium,
            description: updatedData.description ? { ...a.description, ...updatedData.description } : a.description,
            curatorialEssay: updatedData.curatorialEssay
              ? { ...(a.curatorialEssay || { ckb: '', ar: '', en: '' }), ...updatedData.curatorialEssay }
              : a.curatorialEssay,
            locationInInstitute: updatedData.locationInInstitute
              ? { ...a.locationInInstitute, ...updatedData.locationInInstitute }
              : a.locationInInstitute,
          };
          fullArtwork = merged;
          return merged;
        }
        return a;
      });
      try {
        localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (fullArtwork) {
      saveArtworkAction(fullArtwork).then((res) => {
        if (!res.success) {
          console.warn('[ArchiveContext] saveArtworkAction warning:', res.error);
          updateArtworkInSupabase(resolvedId, updatedData);
        }
      }).catch(() => {
        updateArtworkInSupabase(resolvedId, updatedData);
      });
    }
  };

  const deleteArtwork = (id: string) => {
    setArtworks((prev) => {
      const updated = prev.filter((a) => a.id !== id && a.slug !== id);
      try {
        localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Record permanently so static defaults cannot restore it on reload
    addDeletedId(DELETED_ARTWORKS_KEY, id);

    deleteArtworkAction(id).then((res) => {
      if (!res.success) {
        deleteArtworkFromSupabase(id);
      }
    }).catch(() => {
      deleteArtworkFromSupabase(id);
    });
  };

  const toggle3DStatus = (id: string) => {
    let nextStatus = false;
    setArtworks((prev) => {
      const updated = prev.map((a) => {
        if (a.id === id) {
          nextStatus = !a.has3DModel;
          return { ...a, has3DModel: nextStatus };
        }
        return a;
      });
      try {
        localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    toggle3DStatusAction(id, nextStatus).catch((err) => {
      console.warn('[ArchiveContext] toggle3DStatusAction notice:', err);
    });
  };

  // ── Tools Handlers ─────────────────────────────────────────────────
  const addTool = (newTool: AtelierTool) => {
    setTools((prev) => {
      const updated = [newTool, ...prev.filter((t) => t.id !== newTool.id && t.slug !== newTool.slug)];
      try {
        localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    removeDeletedId(DELETED_TOOLS_KEY, newTool.id);
    if (newTool.slug) removeDeletedId(DELETED_TOOLS_KEY, newTool.slug);

    saveToolAction(newTool).catch((err) => {
      console.warn('[ArchiveContext] saveToolAction notice:', err);
    });
  };

  const updateTool = (slugOrId: string, updatedData: Partial<AtelierTool>) => {
    let fullTool: AtelierTool | null = null;
    setTools((prev) => {
      const updated = prev.map((t) => {
        if (t.id === slugOrId || t.slug === slugOrId) {
          const merged: AtelierTool = {
            ...t,
            ...updatedData,
            name: updatedData.name ? { ...t.name, ...updatedData.name } : t.name,
            categoryLabel: updatedData.categoryLabel ? { ...t.categoryLabel, ...updatedData.categoryLabel } : t.categoryLabel,
            description: updatedData.description ? { ...t.description, ...updatedData.description } : t.description,
            historicalSignificance: updatedData.historicalSignificance ? { ...t.historicalSignificance, ...updatedData.historicalSignificance } : t.historicalSignificance,
            bestPractices: updatedData.bestPractices ? { ...t.bestPractices, ...updatedData.bestPractices } : t.bestPractices,
            materials: updatedData.materials ? { ...t.materials, ...updatedData.materials } : t.materials,
            origin: updatedData.origin ? { ...t.origin, ...updatedData.origin } : t.origin,
            usageInstructions: updatedData.usageInstructions ? { ...t.usageInstructions, ...updatedData.usageInstructions } : t.usageInstructions,
            videoTitle: updatedData.videoTitle ? { ...t.videoTitle, ...updatedData.videoTitle } : t.videoTitle,
            proTips: updatedData.proTips ? { ...t.proTips, ...updatedData.proTips } : t.proTips,
          };
          fullTool = merged;
          return merged;
        }
        return t;
      });
      try {
        localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (fullTool) {
      saveToolAction(fullTool).catch((err) => {
        console.warn('[ArchiveContext] saveToolAction notice:', err);
      });
    }
  };

  const deleteTool = (id: string) => {
    setTools((prev) => {
      const updated = prev.filter((t) => t.id !== id && t.slug !== id);
      try {
        localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    addDeletedId(DELETED_TOOLS_KEY, id);
    deleteToolAction(id).catch((err) => {
      console.warn('[ArchiveContext] deleteToolAction notice:', err);
    });
  };

  // ── Students Handlers ──────────────────────────────────────────────
  const addStudent = (newStudent: StudentArtist) => {
    setStudents((prev) => {
      const updated = [newStudent, ...prev.filter((s) => s.id !== newStudent.id && s.slug !== newStudent.slug)];
      try {
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    removeDeletedId(DELETED_STUDENTS_KEY, newStudent.id);
    if (newStudent.slug) removeDeletedId(DELETED_STUDENTS_KEY, newStudent.slug);

    saveStudentAction(newStudent).catch((err) => {
      console.warn('[ArchiveContext] saveStudentAction notice:', err);
    });
  };

  const updateStudent = (idOrSlug: string, updatedData: Partial<StudentArtist>) => {
    let fullStudent: StudentArtist | null = null;
    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id === idOrSlug || s.slug === idOrSlug) {
          const merged: StudentArtist = {
            ...s,
            ...updatedData,
            fullName: updatedData.fullName ? { ...s.fullName, ...updatedData.fullName } : s.fullName,
            department: updatedData.department ? { ...s.department, ...updatedData.department } : s.department,
            bio: updatedData.bio ? { ...s.bio, ...updatedData.bio } : s.bio,
            statement: updatedData.statement ? { ...s.statement, ...updatedData.statement } : s.statement,
            studioLocation: updatedData.studioLocation ? { ...s.studioLocation, ...updatedData.studioLocation } : s.studioLocation,
            awards: updatedData.awards !== undefined ? updatedData.awards : s.awards,
            contactLinks: updatedData.contactLinks !== undefined ? updatedData.contactLinks : s.contactLinks,
          };
          fullStudent = merged;
          return merged;
        }
        return s;
      });
      try {
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (fullStudent) {
      saveStudentAction(fullStudent).catch((err) => {
        console.warn('[ArchiveContext] saveStudentAction notice:', err);
      });
    }
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== id && s.slug !== id);
      try {
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    addDeletedId(DELETED_STUDENTS_KEY, id);
    deleteStudentAction(id).catch((err) => {
      console.warn('[ArchiveContext] deleteStudentAction notice:', err);
    });
  };

  // ── Faculty Handlers ───────────────────────────────────────────────
  const addFaculty = (newMember: FacultyMember) => {
    setFaculty((prev) => {
      const updated = [...prev.filter((f) => f.id !== newMember.id && f.slug !== newMember.slug), newMember].sort((a, b) => a.order - b.order);
      try {
        localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    removeDeletedId(DELETED_FACULTY_KEY, newMember.id);
    if (newMember.slug) removeDeletedId(DELETED_FACULTY_KEY, newMember.slug);

    saveFacultyAction(newMember).catch((err) => {
      console.warn('[ArchiveContext] saveFacultyAction notice:', err);
    });
  };

  const updateFaculty = (idOrSlug: string, updatedData: Partial<FacultyMember>) => {
    let fullMember: FacultyMember | null = null;
    setFaculty((prev) => {
      const updated = prev.map((f) => {
        if (f.id === idOrSlug || f.slug === idOrSlug) {
          const merged: FacultyMember = {
            ...f,
            ...updatedData,
            name: updatedData.name ? { ...f.name, ...updatedData.name } : f.name,
            role: updatedData.role ? { ...f.role, ...updatedData.role } : f.role,
            department: updatedData.department ? { ...f.department, ...updatedData.department } : f.department,
            bio: updatedData.bio ? { ...f.bio, ...updatedData.bio } : f.bio,
            officeLocation: updatedData.officeLocation ? { ...f.officeLocation, ...updatedData.officeLocation } : f.officeLocation,
          };
          fullMember = merged;
          return merged;
        }
        return f;
      }).sort((a, b) => a.order - b.order);
      try {
        localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (fullMember) {
      saveFacultyAction(fullMember).catch((err) => {
        console.warn('[ArchiveContext] saveFacultyAction notice:', err);
      });
    }
  };

  const deleteFaculty = (id: string) => {
    setFaculty((prev) => {
      const updated = prev.filter((f) => f.id !== id && f.slug !== id);
      try {
        localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    addDeletedId(DELETED_FACULTY_KEY, id);
    deleteFacultyAction(id).catch((err) => {
      console.warn('[ArchiveContext] deleteFacultyAction notice:', err);
    });
  };

  // ── Collaborators Handlers ─────────────────────────────────────────
  const addCollaborator = (newCollaborator: Collaborator) => {
    setCollaborators((prev) => {
      const updated = [newCollaborator, ...prev.filter((c) => c.id !== newCollaborator.id && c.slug !== newCollaborator.slug)];
      try {
        localStorage.setItem(COLLABORATORS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    removeDeletedId(DELETED_COLLABORATORS_KEY, newCollaborator.id);
    if (newCollaborator.slug) removeDeletedId(DELETED_COLLABORATORS_KEY, newCollaborator.slug);

    saveCollaboratorAction(newCollaborator).catch((err) => {
      console.warn('[ArchiveContext] saveCollaboratorAction notice:', err);
    });
  };

  const updateCollaborator = (idOrSlug: string, updatedData: Partial<Collaborator>) => {
    let fullCollab: Collaborator | null = null;
    setCollaborators((prev) => {
      const updated = prev.map((c) => {
        if (c.id === idOrSlug || c.slug === idOrSlug) {
          const merged: Collaborator = {
            ...c,
            ...updatedData,
            name: updatedData.name ? { ...c.name, ...updatedData.name } : c.name,
            artistTitle: updatedData.artistTitle ? { ...c.artistTitle, ...updatedData.artistTitle } : c.artistTitle,
            country: updatedData.country ? { ...c.country, ...updatedData.country } : c.country,
            bio: updatedData.bio ? { ...c.bio, ...updatedData.bio } : c.bio,
            curatorialSummary: updatedData.curatorialSummary ? { ...c.curatorialSummary, ...updatedData.curatorialSummary } : c.curatorialSummary,
          };
          fullCollab = merged;
          return merged;
        }
        return c;
      });
      try {
        localStorage.setItem(COLLABORATORS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (fullCollab) {
      saveCollaboratorAction(fullCollab).catch((err) => {
        console.warn('[ArchiveContext] saveCollaboratorAction notice:', err);
      });
    }
  };

  const deleteCollaborator = (id: string) => {
    setCollaborators((prev) => {
      const updated = prev.filter((c) => c.id !== id && c.slug !== id);
      try {
        localStorage.setItem(COLLABORATORS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    addDeletedId(DELETED_COLLABORATORS_KEY, id);
    deleteCollaboratorAction(id).catch((err) => {
      console.warn('[ArchiveContext] deleteCollaboratorAction notice:', err);
    });
  };

  // ── Auth Handlers ──────────────────────────────────────────────────
  const login = (passcode: string): boolean => {
    const validKeys = ['chamchamal2026', 'admin', 'curator', 'demo'];
    if (validKeys.includes(passcode.toLowerCase().trim())) {
      setIsAuthenticated(true);
      setCurator(DEMO_CURATOR);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, 'authenticated_curator_token');
      } catch (e) {}
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurator(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {}
  };

  // ── Settings Handlers ──────────────────────────────────────────────
  const updateGallerySettings = (newSettings: Partial<GallerySettings>) => {
    setGallerySettings((prev) => {
      const updated: GallerySettings = {
        ...prev,
        ...newSettings,
        ambientTracks: newSettings.ambientTracks || prev.ambientTracks,
      };
      try {
        localStorage.setItem(GALLERY_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      saveGallerySettingsAction(updated).catch((err) => {
        console.warn('[ArchiveContext] saveGallerySettingsAction notice:', err);
      });
      return updated;
    });
  };

  const updateDepartmentConfig = (id: DepartmentId, newConfig: Partial<DepartmentConfig>) => {
    setDepartmentsConfig((prev) => {
      const updated = {
        ...prev,
        [id]: {
          ...prev[id],
          ...newConfig,
        },
      };
      try {
        localStorage.setItem(DEPARTMENTS_CONFIG_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      saveDepartmentConfigAction(updated).catch((err) => {
        console.warn('[ArchiveContext] saveDepartmentConfigAction notice:', err);
      });
      return updated;
    });
  };

  const resetDepartmentConfig = (id?: DepartmentId) => {
    setDepartmentsConfig((prev) => {
      let updated: Record<DepartmentId, DepartmentConfig>;
      if (id) {
        updated = {
          ...prev,
          [id]: DEFAULT_DEPARTMENTS_CONFIG[id],
        };
      } else {
        updated = DEFAULT_DEPARTMENTS_CONFIG;
      }
      try {
        localStorage.setItem(DEPARTMENTS_CONFIG_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      saveDepartmentConfigAction(updated).catch((err) => {
        console.warn('[ArchiveContext] saveDepartmentConfigAction notice:', err);
      });
      return updated;
    });
  };

  return (
    <ArchiveContext.Provider
      value={{
        artworks,
        students,
        tools,
        faculty,
        collaborators,
        gallerySettings,
        updateGallerySettings,
        departmentsConfig,
        updateDepartmentConfig,
        resetDepartmentConfig,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        toggle3DStatus,
        addTool,
        updateTool,
        deleteTool,
        addStudent,
        updateStudent,
        deleteStudent,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        addCollaborator,
        updateCollaborator,
        deleteCollaborator,
        isAuthenticated,
        curator,
        login,
        logout,
        isHydrated,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
}

export function useArchive() {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
}
