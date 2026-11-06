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
  fetchArtworksFromSupabase, 
  insertArtworkToSupabase, 
  updateArtworkInSupabase, 
  deleteArtworkFromSupabase 
} from '@/lib/supabase';

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

const ARTWORKS_STORAGE_KEY = 'chamchamal_curated_artworks_v1';
const TOOLS_STORAGE_KEY = 'chamchamal_curated_tools_v1';
const STUDENTS_STORAGE_KEY = 'chamchamal_curated_students_v1';
const FACULTY_STORAGE_KEY = 'chamchamal_curated_faculty_v1';
const COLLABORATORS_STORAGE_KEY = 'chamchamal_curated_collaborators_v1';
const GALLERY_SETTINGS_STORAGE_KEY = 'chamchamal_curated_gallery_settings_v1';
const DEPARTMENTS_CONFIG_STORAGE_KEY = 'chamchamal_curated_departments_config_v1';
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
  department: 'پەیمانگای هونەرە جوانەکانی چەمچەماڵ',
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

  // Initialize and synchronize with localStorage on client mount
  useEffect(() => {
    try {
      // Restore artworks
      const storedArtworks = localStorage.getItem(ARTWORKS_STORAGE_KEY);
      if (storedArtworks) {
        const parsed = JSON.parse(storedArtworks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArtworks(parsed);
        }
      }

      // Restore tools
      const storedTools = localStorage.getItem(TOOLS_STORAGE_KEY);
      if (storedTools) {
        const parsedTools = JSON.parse(storedTools);
        if (Array.isArray(parsedTools) && parsedTools.length > 0) {
          setTools(parsedTools);
        }
      }

      // Restore students
      const storedStudents = localStorage.getItem(STUDENTS_STORAGE_KEY);
      if (storedStudents) {
        const parsedStudents = JSON.parse(storedStudents);
        if (Array.isArray(parsedStudents) && parsedStudents.length > 0) {
          setStudents(parsedStudents);
        }
      }

      // Restore faculty
      const storedFaculty = localStorage.getItem(FACULTY_STORAGE_KEY);
      if (storedFaculty) {
        const parsedFaculty = JSON.parse(storedFaculty);
        if (Array.isArray(parsedFaculty) && parsedFaculty.length > 0) {
          setFaculty(parsedFaculty);
        }
      }

      // Restore collaborators
      const storedCollaborators = localStorage.getItem(COLLABORATORS_STORAGE_KEY);
      if (storedCollaborators) {
        const parsedCollaborators = JSON.parse(storedCollaborators);
        if (Array.isArray(parsedCollaborators) && parsedCollaborators.length > 0) {
          setCollaborators(parsedCollaborators);
        }
      }

      // Restore gallery settings
      const storedSettings = localStorage.getItem(GALLERY_SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        if (parsedSettings && Array.isArray(parsedSettings.ambientTracks) && parsedSettings.ambientTracks.length > 0) {
          setGallerySettings(parsedSettings);
        }
      }

      // Restore departments config
      const storedDepts = localStorage.getItem(DEPARTMENTS_CONFIG_STORAGE_KEY);
      if (storedDepts) {
        const parsed = JSON.parse(storedDepts);
        if (parsed && typeof parsed === 'object') {
          setDepartmentsConfig((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      }

      // Restore session
      const session = localStorage.getItem(AUTH_STORAGE_KEY);
      if (session === 'authenticated_curator_token') {
        setIsAuthenticated(true);
        setCurator(DEMO_CURATOR);
      }

      // Live Supabase Artworks Synchronization
      fetchArtworksFromSupabase()
        .then((liveArtworks) => {
          if (liveArtworks && liveArtworks.length > 0) {
            setArtworks((prev) => {
              const liveIds = new Set(liveArtworks.map((a) => a.id));
              const remaining = prev.filter((a) => !liveIds.has(a.id));
              return [...liveArtworks, ...remaining];
            });
          }
        })
        .catch((err) => {
          console.warn('[ArchiveContext] Live Supabase fetch fallback to local', err);
        });
    } catch (err) {
      console.warn('Storage sync warning', err);
    }
    setIsHydrated(true);
  }, []);

  // Artworks Handlers
  const addArtwork = (newArt: Artwork) => {
    setArtworks((prev) => {
      const updated = [newArt, ...prev];
      try {
        localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    // Persist permanently to live Supabase PostgreSQL table
    insertArtworkToSupabase(newArt);
  };

  const updateArtwork = (slug: string, updatedData: Partial<Artwork>) => {
    let resolvedId = slug;
    setArtworks((prev) => {
      const updated = prev.map((a) => {
        if (a.slug === slug || a.id === slug) {
          resolvedId = a.id;
          return {
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
        }
        return a;
      });
      try {
        localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    // Persist permanently to live Supabase PostgreSQL table
    updateArtworkInSupabase(resolvedId, updatedData);
  };

  const deleteArtwork = (id: string) => {
    setArtworks((prev) => {
      const updated = prev.filter((a) => a.id !== id && a.slug !== id);
      try {
        localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    // Persist permanently to live Supabase PostgreSQL table
    deleteArtworkFromSupabase(id);
  };

  const toggle3DStatus = (id: string) => {
    setArtworks((prev) => {
      const updated = prev.map((a) => {
        if (a.id === id) {
          return { ...a, has3DModel: !a.has3DModel };
        }
        return a;
      });
      try {
        localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Tools Handlers
  const addTool = (newTool: AtelierTool) => {
    setTools((prev) => {
      const updated = [newTool, ...prev];
      try {
        localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateTool = (slugOrId: string, updatedData: Partial<AtelierTool>) => {
    setTools((prev) => {
      const updated = prev.map((t) => {
        if (t.id === slugOrId || t.slug === slugOrId) {
          return {
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
        }
        return t;
      });
      try {
        localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteTool = (id: string) => {
    setTools((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Students Handlers
  const addStudent = (newStudent: StudentArtist) => {
    setStudents((prev) => {
      const updated = [newStudent, ...prev];
      try {
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateStudent = (idOrSlug: string, updatedData: Partial<StudentArtist>) => {
    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id === idOrSlug || s.slug === idOrSlug) {
          return {
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
        }
        return s;
      });
      try {
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Faculty Handlers
  const addFaculty = (newMember: FacultyMember) => {
    setFaculty((prev) => {
      const updated = [...prev, newMember].sort((a, b) => a.order - b.order);
      try {
        localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateFaculty = (idOrSlug: string, updatedData: Partial<FacultyMember>) => {
    setFaculty((prev) => {
      const updated = prev.map((f) => {
        if (f.id === idOrSlug || f.slug === idOrSlug) {
          return {
            ...f,
            ...updatedData,
            name: updatedData.name ? { ...f.name, ...updatedData.name } : f.name,
            role: updatedData.role ? { ...f.role, ...updatedData.role } : f.role,
            department: updatedData.department ? { ...f.department, ...updatedData.department } : f.department,
            bio: updatedData.bio ? { ...f.bio, ...updatedData.bio } : f.bio,
            officeLocation: updatedData.officeLocation ? { ...f.officeLocation, ...updatedData.officeLocation } : f.officeLocation,
          };
        }
        return f;
      }).sort((a, b) => a.order - b.order);
      try {
        localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteFaculty = (id: string) => {
    setFaculty((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem(FACULTY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Collaborators Handlers
  const addCollaborator = (newCollaborator: Collaborator) => {
    setCollaborators((prev) => {
      const updated = [newCollaborator, ...prev];
      try {
        localStorage.setItem(COLLABORATORS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateCollaborator = (idOrSlug: string, updatedData: Partial<Collaborator>) => {
    setCollaborators((prev) => {
      const updated = prev.map((c) => {
        if (c.id === idOrSlug || c.slug === idOrSlug) {
          return {
            ...c,
            ...updatedData,
            name: updatedData.name ? { ...c.name, ...updatedData.name } : c.name,
            artistTitle: updatedData.artistTitle ? { ...c.artistTitle, ...updatedData.artistTitle } : c.artistTitle,
            country: updatedData.country ? { ...c.country, ...updatedData.country } : c.country,
            bio: updatedData.bio ? { ...c.bio, ...updatedData.bio } : c.bio,
            curatorialSummary: updatedData.curatorialSummary ? { ...c.curatorialSummary, ...updatedData.curatorialSummary } : c.curatorialSummary,
          };
        }
        return c;
      });
      try {
        localStorage.setItem(COLLABORATORS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteCollaborator = (id: string) => {
    setCollaborators((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(COLLABORATORS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Auth Handlers
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
      return updated;
    });
  };

  // Departments Config Handlers
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
      } catch (e) {
        console.warn('Failed to persist departments config', e);
      }
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
