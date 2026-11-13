export type { 
  StudentAwardItem, 
  StudentContactLink, 
  ContactPlatform 
} from '@/data/students';

export type ArtworkDepartment = 'painting' | 'sculpture' | 'ceramics';

export interface CuratorUser {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
  lastActive: string;
}

export interface IngestionFormData {
  // Titles (only one title is strictly needed)
  titleCkb: string;
  titleAr?: string;
  titleEn?: string;

  // Curatorial Artist & Department
  artistId?: string;
  category?: 'painting' | 'sculpture' | 'ceramics';
  department?: ArtworkDepartment;

  // Physical Medium & Spec
  mediumCkb?: string;
  mediumAr?: string;
  mediumEn?: string;
  year?: number;
  dimensions?: string;
  width_cm?: number;
  height_cm?: number;

  // Short Inscription
  descriptionCkb?: string;
  descriptionAr?: string;
  descriptionEn?: string;

  // Long-form Curatorial Essay / Critical Analysis
  curatorialEssayCkb?: string;
  curatorialEssayAr?: string;
  curatorialEssayEn?: string;

  // Museum Provenance
  locationInInstituteCkb?: string;
  locationInInstituteAr?: string;
  locationInInstituteEn?: string;
  provenancePedestal?: string;

  // Media 1: Primary Visual Image
  imageUrl: string;
  imageFileName?: string;

  // Media 2: 3D Photogrammetry (.glb / .gltf)
  has3DModel: boolean;
  hasPedestal?: boolean;
  modelScale?: number;
  modelUrl?: string;
  modelFileName?: string;
  modelVertices?: string;
  modelPolygons?: string;

  // Media 3: Audio Narration (.mp3 / .wav / .m4a)
  audioUrl?: string;
  audioFileName?: string;
  audioDurationSeconds?: number;

  // Media 4: Video Demonstration / Documentary (.mp4 / .webm / URL)
  videoUrl?: string;
  videoFileName?: string;
  videoTitleCkb?: string;
  videoTitleAr?: string;
  videoTitleEn?: string;

  // Media 5: Curatorial Research & Monograph PDF (.pdf)
  curatorialPdfUrl?: string;
  curatorialPdfFileName?: string;

  // Atelier Instruments Selection
  selectedToolSlugs: string[];
}

export interface ToolIngestionFormData {
  nameCkb: string;
  nameAr: string;
  nameEn: string;
  category: 'painting' | 'sculpture' | 'ceramics' | 'calligraphy';
  descriptionCkb: string;
  descriptionAr: string;
  descriptionEn: string;
  historicalSignificanceCkb: string;
  historicalSignificanceAr: string;
  historicalSignificanceEn: string;
  bestPracticesCkb: string;
  bestPracticesAr: string;
  bestPracticesEn: string;
  materialsCkb: string;
  materialsAr: string;
  materialsEn: string;
  originCkb: string;
  originAr: string;
  originEn: string;
  glbUrl: string;
  imageUrl: string;
  galleryImagesText: string;
  videoUrl: string;
  videoTitleCkb: string;
  videoTitleAr: string;
  videoTitleEn: string;
  audioDuration: string;
  usageInstructionsCkb: string;
  usageInstructionsAr: string;
  usageInstructionsEn: string;
  proTipsCkbText: string;
  proTipsArText: string;
  proTipsEnText: string;
  usedInArtworkSlugs: string[];
}
