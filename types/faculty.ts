export interface LocalizedString {
  ckb: string;
  ar: string;
  en: string;
}

export interface FacultyMember {
  id: string;
  slug: string;
  name: LocalizedString;
  role: LocalizedString;
  department: LocalizedString;
  bio: LocalizedString;
  avatarUrl: string;
  academicDegrees: LocalizedString[];
  contactEmail: string;
  officeLocation: LocalizedString;
  order: number;
}
