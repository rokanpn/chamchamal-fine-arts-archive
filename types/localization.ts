export type Locale = 'ckb' | 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface LanguageOption {
  code: Locale;
  label: string; // Native name
  shortLabel: string;
  dir: Direction;
  fontClass: string;
}

export interface NavigationTranslation {
  gallery: string;
  scan3d: string;
  tools: string;
  students: string;
  faculty: string;
  collaborators: string;
}

export interface DashboardTranslation {
  academicAnalytics: string;
  realtimeBoardTitle: string;
  realtimeBoardSubtitle: string;
  totalArtworksPill: string;
  scansPill: string;
  departmentsPill: string;
  historicalOverlayArtworks: string;
  historicalOverlayScans: string;
  historicalOverlayDepts: string;
  paintingTitle: string;
  paintingDesc: string;
  musicTitle: string;
  musicDesc: string;
  theaterTitle: string;
  theaterDesc: string;
  alumniCount: string;
  worksCount: string;
  exploreDept: string;
  liveBadge: string;
}

export interface ArchiveTranslations {
  instituteName: string;
  instituteSubline: string;
  archiveBadge: string;
  liveArchive: string;
  searchPlaceholder: string;
  nav: NavigationTranslation;
  hero: {
    tagline: string;
    headline: string;
    subheadline: string;
    exploreGallery: string;
    view3DArchive: string;
    featuredCount: string;
    scannedArtifacts: string;
    departments: string;
    topBadge: string;
    instituteName: string;
    subtitle: string;
    description: string;
    scanQr: string;
  };
  dashboard: DashboardTranslation;
  pwa: {
    installPrompt: string;
    installButton: string;
  };
}

export type TranslationsRecord = Record<Locale, ArchiveTranslations>;
