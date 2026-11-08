-- ==============================================================================
-- Chamchamal Fine Arts Archive (ئەرشیفی دیجیتاڵی پەیمانگەی هونەرە جوانەکانی چەمچەماڵ)
-- Complete Supabase Schema, Tables, Extensions & RLS Security Policies
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: ARTWORKS
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.artworks (
  id TEXT PRIMARY KEY,
  slug TEXT,
  title JSONB NOT NULL,
  artist JSONB NOT NULL,
  "artistId" TEXT,
  "artistBio" JSONB,
  "artistGraduationYear" INTEGER,
  year INTEGER NOT NULL,
  category TEXT DEFAULT 'painting',
  "categoryLabel" JSONB,
  department TEXT NOT NULL,
  "departmentLabel" JSONB,
  medium JSONB,
  dimensions TEXT DEFAULT '120 × 90 cm',
  width_cm NUMERIC,
  height_cm NUMERIC,
  "imageUrl" TEXT,
  "thumbnailUrl" TEXT,
  "aspectRatio" TEXT DEFAULT 'portrait',
  "has3DModel" BOOLEAN DEFAULT FALSE,
  "hasPedestal" BOOLEAN DEFAULT TRUE,
  "modelScale" NUMERIC DEFAULT 1.0,
  "modelUrl" TEXT,
  "modelVertices" TEXT,
  "modelPolygons" TEXT,
  featured BOOLEAN DEFAULT FALSE,
  description JSONB,
  "curatorialEssay" JSONB,
  "audioUrl" TEXT,
  "audioDurationSeconds" INTEGER,
  "videoUrl" TEXT,
  "videoTitle" JSONB,
  "curatorialPdfUrl" TEXT,
  "curatorialPdfFileName" TEXT,
  "locationInInstitute" JSONB,
  "provenancePedestal" TEXT,
  "physicalPlaqueCode" TEXT,
  "toolSlugs" JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent column additions for existing installations
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "artistId" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "artistBio" JSONB;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "artistGraduationYear" INTEGER;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'painting';
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "categoryLabel" JSONB;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "departmentLabel" JSONB;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS medium JSONB;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS dimensions TEXT DEFAULT '120 × 90 cm';
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS width_cm NUMERIC;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS height_cm NUMERIC;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "aspectRatio" TEXT DEFAULT 'portrait';
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "has3DModel" BOOLEAN DEFAULT FALSE;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "hasPedestal" BOOLEAN DEFAULT TRUE;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "modelScale" NUMERIC DEFAULT 1.0;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "modelUrl" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "modelVertices" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "modelPolygons" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "curatorialEssay" JSONB;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "audioUrl" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "audioDurationSeconds" INTEGER;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "videoTitle" JSONB;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "curatorialPdfUrl" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "curatorialPdfFileName" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "locationInInstitute" JSONB;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "provenancePedestal" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "physicalPlaqueCode" TEXT;
ALTER TABLE public.artworks ADD COLUMN IF NOT EXISTS "toolSlugs" JSONB DEFAULT '[]'::jsonb;

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: TOOLS & ATELIER INSTRUMENTS
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tools (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  name JSONB NOT NULL,
  department TEXT NOT NULL DEFAULT 'painting',
  category TEXT NOT NULL DEFAULT 'brushes',
  "categoryLabel" JSONB,
  "imageUrl" TEXT,
  "galleryImages" JSONB DEFAULT '[]'::jsonb,
  description JSONB,
  "historicalSignificance" JSONB,
  "bestPractices" JSONB,
  materials JSONB,
  origin JSONB,
  "usageInstructions" JSONB,
  "videoUrl" TEXT,
  "videoTitle" JSONB,
  "proTips" JSONB DEFAULT '[]'::jsonb,
  "usedInArtworkSlugs" JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: STUDENTS & ALUMNI
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  slug TEXT,
  "fullName" JSONB NOT NULL,
  department TEXT NOT NULL DEFAULT 'painting',
  "graduationYear" INTEGER NOT NULL DEFAULT 2026,
  "avatarUrl" TEXT,
  bio JSONB,
  statement JSONB,
  "studioLocation" JSONB,
  awards JSONB DEFAULT '[]'::jsonb,
  "contactLinks" JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: FACULTY & ADMINISTRATION
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.faculty (
  id TEXT PRIMARY KEY,
  slug TEXT,
  name JSONB NOT NULL,
  role JSONB NOT NULL,
  department TEXT NOT NULL DEFAULT 'painting',
  "avatarUrl" TEXT,
  bio JSONB,
  "officeLocation" JSONB,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: COLLABORATORS & VISITING ARTISTS
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.collaborators (
  id TEXT PRIMARY KEY,
  slug TEXT,
  name JSONB NOT NULL,
  "artistTitle" JSONB,
  country JSONB,
  "avatarUrl" TEXT,
  bio JSONB,
  "curatorialSummary" JSONB,
  "collaborationYear" INTEGER DEFAULT 2026,
  "portfolioLinks" JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- TABLE: SETTINGS & CONFIGURATION
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.archive_settings (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables open read access and full administrative CRUD
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_settings ENABLE ROW LEVEL SECURITY;

-- Artworks Policies
DROP POLICY IF EXISTS "Public Read Artworks" ON public.artworks;
CREATE POLICY "Public Read Artworks" ON public.artworks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Artworks" ON public.artworks;
CREATE POLICY "Admin All Artworks" ON public.artworks FOR ALL USING (true) WITH CHECK (true);

-- Tools Policies
DROP POLICY IF EXISTS "Public Read Tools" ON public.tools;
CREATE POLICY "Public Read Tools" ON public.tools FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Tools" ON public.tools;
CREATE POLICY "Admin All Tools" ON public.tools FOR ALL USING (true) WITH CHECK (true);

-- Students Policies
DROP POLICY IF EXISTS "Public Read Students" ON public.students;
CREATE POLICY "Public Read Students" ON public.students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Students" ON public.students;
CREATE POLICY "Admin All Students" ON public.students FOR ALL USING (true) WITH CHECK (true);

-- Faculty Policies
DROP POLICY IF EXISTS "Public Read Faculty" ON public.faculty;
CREATE POLICY "Public Read Faculty" ON public.faculty FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Faculty" ON public.faculty;
CREATE POLICY "Admin All Faculty" ON public.faculty FOR ALL USING (true) WITH CHECK (true);

-- Collaborators Policies
DROP POLICY IF EXISTS "Public Read Collaborators" ON public.collaborators;
CREATE POLICY "Public Read Collaborators" ON public.collaborators FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Collaborators" ON public.collaborators;
CREATE POLICY "Admin All Collaborators" ON public.collaborators FOR ALL USING (true) WITH CHECK (true);

-- Settings Policies
DROP POLICY IF EXISTS "Public Read Settings" ON public.archive_settings;
CREATE POLICY "Public Read Settings" ON public.archive_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Settings" ON public.archive_settings;
CREATE POLICY "Admin All Settings" ON public.archive_settings FOR ALL USING (true) WITH CHECK (true);

-- ──────────────────────────────────────────────────────────────────────────────
-- STORAGE BUCKET: archive-media
-- ──────────────────────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('archive-media', 'archive-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access Archive Media" ON storage.objects;
CREATE POLICY "Public Access Archive Media" ON storage.objects FOR SELECT USING (bucket_id = 'archive-media');

DROP POLICY IF EXISTS "Admin Upload Archive Media" ON storage.objects;
CREATE POLICY "Admin Upload Archive Media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'archive-media');

DROP POLICY IF EXISTS "Admin Update Archive Media" ON storage.objects;
CREATE POLICY "Admin Update Archive Media" ON storage.objects FOR UPDATE USING (bucket_id = 'archive-media');

DROP POLICY IF EXISTS "Admin Delete Archive Media" ON storage.objects;
CREATE POLICY "Admin Delete Archive Media" ON storage.objects FOR DELETE USING (bucket_id = 'archive-media');

-- ──────────────────────────────────────────────────────────────────────────────
-- SUPABASE REALTIME REPLICATION
-- Broadcasts INSERT, UPDATE, DELETE to all connected client devices in real-time
-- ──────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.artworks;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tools;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.faculty;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.collaborators;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.archive_settings;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

