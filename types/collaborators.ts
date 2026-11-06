export interface LocalizedString {
  ckb: string;
  ar: string;
  en: string;
}

export type CollaborationType = 'workshop' | 'residency' | 'biennial' | 'masterclass';

export interface Collaborator {
  id: string;
  slug: string;
  name: LocalizedString;
  artistTitle: LocalizedString;
  country: LocalizedString;
  bio: LocalizedString;
  avatarUrl: string;
  collaborationType: CollaborationType;
  collaborationTypeLabel: LocalizedString;
  collaborationYear: number;
  galleryPhotos: string[];
  curatorialSummary: LocalizedString;
  featured?: boolean;
}
