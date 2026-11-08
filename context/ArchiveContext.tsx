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
  deleteArtworkFromSupabase,
  fetchToolsFromSupabase,
  insertToolToSupabase,
  updateToolInSupabase,
  deleteToolFromSupabase
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

// ── Storage Keys (Curator Auth & Local Customizations) ─────────────
const GALLERY_SETTINGS_STORAGE_KEY = 'chamchamal_curated_gallery_settings_v4';
const DEPARTMENTS_CONFIG_STORAGE_KEY = 'chamchamal_curated_departments_config_v4';
const AUTH_STORAGE_KEY = 'chamchamal_curator_session_token';

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
      // 1. Initial State: Seed with default archive catalog
      setArtworks(ARTWORKS_DATA);
      setTools(TOOLS_DATA);
      setStudents(STUDENTS_DATA);
      setFaculty(FACULTY_DATA);
      setCollaborators(COLLABORATORS_DATA);

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

          // Sync Artworks directly from Supabase
          if (liveData.artworks && liveData.artworks.length > 0) {
            setArtworks(liveData.artworks);
          } else {
            // Check client-side direct Supabase fallback
            const clientLiveArts = await fetchArtworksFromSupabase();
            if (clientLiveArts && clientLiveArts.length > 0) {
              setArtworks(clientLiveArts);
            }
          }

          // Sync Tools directly from Supabase
          if (liveData.tools && liveData.tools.length > 0) {
            setTools(liveData.tools);
          } else {
            const clientLiveTools = await fetchToolsFromSupabase();
            if (clientLiveTools && clientLiveTools.length > 0) {
              setTools(clientLiveTools);
            }
          }

          // Sync Students
          if (liveData.students && liveData.students.length > 0) {
            setStudents(liveData.students);
          }

          // Sync Faculty
          if (liveData.faculty && liveData.faculty.length > 0) {
            setFaculty(liveData.faculty.sort((a, b) => a.order - b.order));
          }

          // Sync Collaborators
          if (liveData.collaborators && liveData.collaborators.length > 0) {
            setCollaborators(liveData.collaborators);
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

      // Real-time listener for postgres changes on archive tables
      const channel = supabase
        .channel('realtime_archive_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'artworks' },
          () => {
            syncLiveArchive();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tools' },
          () => {
            syncLiveArchive();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'students' },
          () => {
            syncLiveArchive();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'faculty' },
          () => {
            syncLiveArchive();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'collaborators' },
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
    setArtworks((prev) => [newArt, ...prev.filter((a) => a.id !== newArt.id && a.slug !== newArt.slug)]);

    // Persist via Server Action with direct Supabase fallback
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
      return prev.map((a) => {
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
    setArtworks((prev) => prev.filter((a) => a.id !== id && a.slug !== id));

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
      return prev.map((a) => {
        if (a.id === id) {
          nextStatus = !a.has3DModel;
          return { ...a, has3DModel: nextStatus };
        }
        return a;
      });
    });

    toggle3DStatusAction(id, nextStatus).catch((err) => {
      console.warn('[ArchiveContext] toggle3DStatusAction notice:', err);
    });
  };

  // ── Tools Handlers ─────────────────────────────────────────────────
  const addTool = (newTool: AtelierTool) => {
    setTools((prev) => [newTool, ...prev.filter((t) => t.id !== newTool.id && t.slug !== newTool.slug)]);

    saveToolAction(newTool).then((res) => {
      if (!res.success) {
        insertToolToSupabase(newTool);
      }
    }).catch(() => {
      insertToolToSupabase(newTool);
    });
  };

  const updateTool = (slugOrId: string, updatedData: Partial<AtelierTool>) => {
    let resolvedId = slugOrId;
    let fullTool: AtelierTool | null = null;

    setTools((prev) => {
      return prev.map((t) => {
        if (t.id === slugOrId || t.slug === slugOrId) {
          resolvedId = t.id;
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
    });

    if (fullTool) {
      saveToolAction(fullTool).then((res) => {
        if (!res.success) {
          updateToolInSupabase(resolvedId, updatedData);
        }
      }).catch(() => {
        updateToolInSupabase(resolvedId, updatedData);
      });
    }
  };

  const deleteTool = (id: string) => {
    setTools((prev) => prev.filter((t) => t.id !== id && t.slug !== id));

    deleteToolAction(id).then((res) => {
      if (!res.success) {
        deleteToolFromSupabase(id);
      }
    }).catch(() => {
      deleteToolFromSupabase(id);
    });
  };

  // ── Students Handlers ──────────────────────────────────────────────
  const addStudent = (newStudent: StudentArtist) => {
    setStudents((prev) => [newStudent, ...prev.filter((s) => s.id !== newStudent.id && s.slug !== newStudent.slug)]);

    saveStudentAction(newStudent).catch((err) => {
      console.warn('[ArchiveContext] saveStudentAction notice:', err);
    });
  };

  const updateStudent = (idOrSlug: string, updatedData: Partial<StudentArtist>) => {
    let fullStudent: StudentArtist | null = null;
    setStudents((prev) => {
      return prev.map((s) => {
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
    });

    if (fullStudent) {
      saveStudentAction(fullStudent).catch((err) => {
        console.warn('[ArchiveContext] saveStudentAction notice:', err);
      });
    }
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id && s.slug !== id));

    deleteStudentAction(id).catch((err) => {
      console.warn('[ArchiveContext] deleteStudentAction notice:', err);
    });
  };

  // ── Faculty Handlers ───────────────────────────────────────────────
  const addFaculty = (newMember: FacultyMember) => {
    setFaculty((prev) => [...prev.filter((f) => f.id !== newMember.id && f.slug !== newMember.slug), newMember].sort((a, b) => a.order - b.order));

    saveFacultyAction(newMember).catch((err) => {
      console.warn('[ArchiveContext] saveFacultyAction notice:', err);
    });
  };

  const updateFaculty = (idOrSlug: string, updatedData: Partial<FacultyMember>) => {
    let fullMember: FacultyMember | null = null;
    setFaculty((prev) => {
      return prev.map((f) => {
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
    });

    if (fullMember) {
      saveFacultyAction(fullMember).catch((err) => {
        console.warn('[ArchiveContext] saveFacultyAction notice:', err);
      });
    }
  };

  const deleteFaculty = (id: string) => {
    setFaculty((prev) => prev.filter((f) => f.id !== id && f.slug !== id));

    deleteFacultyAction(id).catch((err) => {
      console.warn('[ArchiveContext] deleteFacultyAction notice:', err);
    });
  };

  // ── Collaborators Handlers ─────────────────────────────────────────
  const addCollaborator = (newCollaborator: Collaborator) => {
    setCollaborators((prev) => [newCollaborator, ...prev.filter((c) => c.id !== newCollaborator.id && c.slug !== newCollaborator.slug)]);

    saveCollaboratorAction(newCollaborator).catch((err) => {
      console.warn('[ArchiveContext] saveCollaboratorAction notice:', err);
    });
  };

  const updateCollaborator = (idOrSlug: string, updatedData: Partial<Collaborator>) => {
    let fullCollab: Collaborator | null = null;
    setCollaborators((prev) => {
      return prev.map((c) => {
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
    });

    if (fullCollab) {
      saveCollaboratorAction(fullCollab).catch((err) => {
        console.warn('[ArchiveContext] saveCollaboratorAction notice:', err);
      });
    }
  };

  const deleteCollaborator = (id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id && c.slug !== id));

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
