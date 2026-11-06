'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { useRouter } from 'next/navigation';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { FileUploadDropzone } from '@/components/admin/FileUploadDropzone';
import { ModelPreviewStudio } from '@/components/admin/ModelPreviewStudio';
import { QuickToolAddModal } from '@/components/admin/QuickToolAddModal';
import { Artwork, ArtworkDepartment, DEPARTMENT_LABELS, DEPARTMENT_OPTIONS, getArtworkDepartment, ARTWORKS_DATA } from '@/data/artworks';
import { AtelierTool } from '@/data/tools';
import { IngestionFormData } from '@/types/admin';
import { 
  Save, 
  UploadCloud, 
  Box, 
  Sparkles, 
  Wrench, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Image as ImageIcon,
  Palette,
  MapPin,
  ExternalLink,
  Music,
  Video,
  FileText,
  BookOpen,
  Calendar,
  Layers,
  Search,
  Check,
  Eye,
  Pencil,
  AlertTriangle
} from 'lucide-react';

interface ArtworkEditClientProps {
  slug: string;
}

const PRESET_ART_IMAGES = [
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
];

const PRESET_3D_MODELS = [
  { label: 'Antique Camera (Khronos)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb' },
  { label: 'Water Bottle (Glazed)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/WaterBottle/glTF-Binary/WaterBottle.glb' },
  { label: 'Damaged Helmet (Bronze/Stone)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb' },
  { label: 'Lantern (Ceramics/Metal)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Lantern/glTF-Binary/Lantern.glb' },
];

export function ArtworkEditClient({ slug }: ArtworkEditClientProps) {
  const router = useRouter();
  const { artworks, students, tools, updateArtwork, isHydrated } = useArchive();
  const { locale, isRTL } = useLanguage();

  // Find target artwork from context with fallback to static initial dataset
  const targetArtwork = artworks.find((a) => a.slug === slug || a.id === slug) ||
    ARTWORKS_DATA.find((a) => a.slug === slug);

  const [langTab, setLangTab] = useState<'ckb' | 'ar' | 'en'>('ckb');
  const [toolSearch, setToolSearch] = useState('');
  const [isQuickToolModalOpen, setIsQuickToolModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState<IngestionFormData>({
    titleCkb: '',
    titleAr: '',
    titleEn: '',
    artistId: students[0]?.id || '',
    category: 'painting',
    department: 'painting',
    mediumCkb: '',
    mediumAr: '',
    mediumEn: '',
    year: new Date().getFullYear(),
    dimensions: '',
    descriptionCkb: '',
    descriptionAr: '',
    descriptionEn: '',
    curatorialEssayCkb: '',
    curatorialEssayAr: '',
    curatorialEssayEn: '',
    locationInInstituteCkb: '',
    locationInInstituteAr: '',
    locationInInstituteEn: '',
    provenancePedestal: '',
    imageUrl: '',
    imageFileName: '',
    has3DModel: false,
    hasPedestal: true,
    modelScale: 1.0,
    modelUrl: '',
    modelFileName: '',
    modelVertices: '380,000 Vertices',
    modelPolygons: '760,000 Triangles',
    audioUrl: '',
    audioFileName: '',
    audioDurationSeconds: 145,
    videoUrl: '',
    videoFileName: '',
    videoTitleCkb: '',
    videoTitleAr: '',
    videoTitleEn: '',
    curatorialPdfUrl: '',
    curatorialPdfFileName: '',
    selectedToolSlugs: [],
  });

  // Populate data when artwork is found or hydrated
  useEffect(() => {
    if (targetArtwork) {
      setFormData({
        titleCkb: targetArtwork.title.ckb || '',
        titleAr: targetArtwork.title.ar || '',
        titleEn: targetArtwork.title.en || '',
        artistId: targetArtwork.artistId || students[0]?.id || '',
        category: targetArtwork.category || 'painting',
        department: targetArtwork.department ? getArtworkDepartment(targetArtwork) : 'painting',
        mediumCkb: targetArtwork.medium.ckb || '',
        mediumAr: targetArtwork.medium.ar || '',
        mediumEn: targetArtwork.medium.en || '',
        year: targetArtwork.year || new Date().getFullYear(),
        dimensions: targetArtwork.dimensions || '',
        descriptionCkb: targetArtwork.description.ckb || '',
        descriptionAr: targetArtwork.description.ar || '',
        descriptionEn: targetArtwork.description.en || '',
        curatorialEssayCkb: targetArtwork.curatorialEssay?.ckb || '',
        curatorialEssayAr: targetArtwork.curatorialEssay?.ar || '',
        curatorialEssayEn: targetArtwork.curatorialEssay?.en || '',
        locationInInstituteCkb: targetArtwork.locationInInstitute.ckb || '',
        locationInInstituteAr: targetArtwork.locationInInstitute.ar || '',
        locationInInstituteEn: targetArtwork.locationInInstitute.en || '',
        provenancePedestal: targetArtwork.provenancePedestal || '',
        imageUrl: targetArtwork.imageUrl || '',
        imageFileName: '',
        has3DModel: targetArtwork.has3DModel || false,
        hasPedestal: targetArtwork.hasPedestal !== false,
        modelScale: typeof targetArtwork.modelScale === 'number' && targetArtwork.modelScale > 0 ? targetArtwork.modelScale : 1.0,
        modelUrl: targetArtwork.modelUrl || '',
        modelFileName: '',
        modelVertices: targetArtwork.modelVertices || '380,000 Vertices',
        modelPolygons: targetArtwork.modelPolygons || '760,000 Triangles',
        audioUrl: targetArtwork.audioUrl || '',
        audioFileName: '',
        audioDurationSeconds: targetArtwork.audioDurationSeconds || 145,
        videoUrl: targetArtwork.videoUrl || '',
        videoFileName: '',
        videoTitleCkb: targetArtwork.videoTitle?.ckb || '',
        videoTitleAr: targetArtwork.videoTitle?.ar || '',
        videoTitleEn: targetArtwork.videoTitle?.en || '',
        curatorialPdfUrl: targetArtwork.curatorialPdfUrl || '',
        curatorialPdfFileName: targetArtwork.curatorialPdfFileName || '',
        selectedToolSlugs: targetArtwork.toolSlugs || [],
      });
    }
  }, [targetArtwork, students]);

  if (isHydrated && !targetArtwork) {
    return (
      <AdminAuthGuard>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-6 p-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2 max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-parchment-pure">
              {locale === 'ckb' ? 'شاکارەکە بۆ دەستکاریکردن نەدۆزرایەوە' : 'Masterwork Not Found for Editing'}
            </h2>
            <p className="text-xs text-museum-secondary">
              {locale === 'ckb'
                ? 'ئەم بەرهەمە لە تۆماری فەرمیی پەیمانگادا بوونی نییە یان سڕدراوەتەوە.'
                : 'This artwork cannot be found in the curatorial registry or was removed.'}
            </p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-2.5 rounded-full bg-gold text-obsidian font-bold text-xs shadow-gold-glow hover:opacity-90"
          >
            {locale === 'ckb' ? 'گەڕانەوە بۆ دەستەی بەڕێوەبردن' : 'Return to Curator Hub'}
          </Link>
        </div>
      </AdminAuthGuard>
    );
  }

  const handleToolToggle = (toolSlug: string) => {
    setFormData((prev) => {
      const exists = prev.selectedToolSlugs.includes(toolSlug);
      return {
        ...prev,
        selectedToolSlugs: exists
          ? prev.selectedToolSlugs.filter((s) => s !== toolSlug)
          : [...prev.selectedToolSlugs, toolSlug],
      };
    });
  };

  const handleToolCreated = (newTool: AtelierTool) => {
    setFormData((prev) => ({
      ...prev,
      selectedToolSlugs: [...prev.selectedToolSlugs, newTool.slug],
    }));
  };

  const filteredTools = tools.filter((tool) => {
    const term = toolSearch.toLowerCase();
    return (
      tool.name.ckb.toLowerCase().includes(term) ||
      tool.name.en.toLowerCase().includes(term) ||
      tool.name.ar.toLowerCase().includes(term)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetArtwork) return;
    setIsSubmitting(true);

    const selectedArtist = students.find((s) => s.id === formData.artistId) || students[0];
    const has3D = Boolean(formData.modelUrl && formData.modelUrl.trim().length > 0);

    const categoryLabels: Record<string, { ckb: string; ar: string; en: string }> = {
      painting: { ckb: 'شێوەکاری', ar: 'رسم تشكيلي', en: 'Painting' },
      sculpture: { ckb: 'پەیکەرسازی', ar: 'نحت وتجسيم', en: 'Sculpture' },
      ceramics: { ckb: 'سیرامیک', ar: 'خزف فني', en: 'Ceramics' },
      design: { ckb: 'دیزاین و گرافیک', ar: 'تصميم وجرافيك', en: 'Design & Graphics' },
    };

    const updatedData: Partial<Artwork> = {
      title: {
        ckb: formData.titleCkb || targetArtwork.title.ckb,
        ar: formData.titleAr || formData.titleCkb || targetArtwork.title.ar,
        en: formData.titleEn || formData.titleCkb || targetArtwork.title.en,
      },
      artist: selectedArtist ? selectedArtist.fullName : targetArtwork.artist,
      artistId: selectedArtist ? selectedArtist.id : targetArtwork.artistId,
      artistBio: selectedArtist ? selectedArtist.bio : targetArtwork.artistBio,
      artistGraduationYear: selectedArtist ? selectedArtist.graduationYear : targetArtwork.artistGraduationYear,
      category: formData.category || targetArtwork.category,
      categoryLabel: categoryLabels[formData.category || 'painting'],
      department: (formData.department || (targetArtwork ? getArtworkDepartment(targetArtwork) : 'painting')) as ArtworkDepartment,
      departmentLabel: DEPARTMENT_LABELS[(formData.department || (targetArtwork ? getArtworkDepartment(targetArtwork) : 'painting')) as ArtworkDepartment],
      medium: {
        ckb: formData.mediumCkb || targetArtwork.medium.ckb,
        ar: formData.mediumAr || targetArtwork.medium.ar,
        en: formData.mediumEn || targetArtwork.medium.en,
      },
      year: Number(formData.year) || targetArtwork.year,
      dimensions: formData.dimensions || targetArtwork.dimensions,
      imageUrl: formData.imageUrl || targetArtwork.imageUrl,
      has3DModel: has3D,
      hasPedestal: formData.hasPedestal,
      modelScale: formData.modelScale || 1.0,
      modelUrl: has3D ? formData.modelUrl : undefined,
      modelVertices: has3D ? formData.modelVertices : undefined,
      modelPolygons: has3D ? formData.modelPolygons : undefined,
      description: {
        ckb: formData.descriptionCkb || targetArtwork.description.ckb,
        ar: formData.descriptionAr || targetArtwork.description.ar,
        en: formData.descriptionEn || targetArtwork.description.en,
      },
      curatorialEssay: (formData.curatorialEssayCkb || formData.curatorialEssayEn) ? {
        ckb: formData.curatorialEssayCkb || '',
        ar: formData.curatorialEssayAr || formData.curatorialEssayCkb || '',
        en: formData.curatorialEssayEn || formData.curatorialEssayCkb || '',
      } : undefined,
      audioUrl: formData.audioUrl || undefined,
      audioDurationSeconds: formData.audioDurationSeconds || 145,
      videoUrl: formData.videoUrl || undefined,
      videoTitle: formData.videoUrl ? {
        ckb: formData.videoTitleCkb || 'شیکاری ڤیدیۆیی بەرهەم',
        ar: formData.videoTitleAr || 'توثيق مرئي للعمل',
        en: formData.videoTitleEn || 'Documentary Video',
      } : undefined,
      curatorialPdfUrl: formData.curatorialPdfUrl || undefined,
      curatorialPdfFileName: formData.curatorialPdfFileName || undefined,
      locationInInstitute: {
        ckb: formData.locationInInstituteCkb || targetArtwork.locationInInstitute.ckb,
        ar: formData.locationInInstituteAr || targetArtwork.locationInInstitute.ar,
        en: formData.locationInInstituteEn || targetArtwork.locationInInstitute.en,
      },
      provenancePedestal: formData.provenancePedestal || targetArtwork.provenancePedestal,
      atelierTools: tools
        .filter((t) => formData.selectedToolSlugs.includes(t.slug))
        .map((t) => t.name),
      toolSlugs: formData.selectedToolSlugs,
    };

    updateArtwork(targetArtwork.slug, updatedData);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <AdminAuthGuard>
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-32">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-museum-divider pb-5">
          <div className="flex flex-col gap-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-xs text-museum-secondary hover:text-gold transition-colors w-fit mb-2"
            >
              {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{locale === 'ckb' ? 'گەڕانەوە بۆ دەستەی بەڕێوەبردن' : 'Back to Curator Portal'}</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold border border-gold/30 flex items-center justify-center">
                <Pencil className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-parchment-pure font-serif">
                {locale === 'ckb'
                  ? 'دەستکاریکردنی شاکاری ئەرشیف'
                  : locale === 'ar'
                  ? 'تعديل وتحديث بيانات العمل الفني'
                  : 'Edit Masterwork Dossier'}
              </h1>
            </div>
            <p className="text-xs text-museum-secondary mt-1">
              {locale === 'ckb'
                ? `نوێکردنەوەی زانیاری، فایلە میدیاییەکان، مۆدێلی ۳D، و کەرەستە بەستراوەکانی: "${formData.titleCkb || slug}"`
                : `Update metadata, trilingual texts, 3D meshes, local files, and linked atelier tools for: "${formData.titleEn || slug}"`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/artworks/${slug}`}
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-obsidian-surface hover:bg-obsidian-elevated border border-museum-border text-parchment hover:text-gold text-xs font-semibold flex items-center gap-1.5 transition-all shadow-glass-pill"
            >
              <Eye className="w-3.5 h-3.5 text-gold" />
              <span>{locale === 'ckb' ? 'بینینی لاپەڕەی زیندوو' : 'View Live Route'}</span>
            </Link>
          </div>
        </div>

        {/* Success Alert Banner */}
        {isSuccess && (
          <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-200">
                  {locale === 'ckb' ? 'گۆڕانکارییەکان بە سەرکەوتوویی پاشەکەوت کران!' : 'Changes saved successfully!'}
                </h4>
                <p className="text-xs text-emerald-400/80">
                  {locale === 'ckb'
                    ? 'هەموو پەڕەکانی پێشانگا، ناسنامەی ۳D، و تۆماری کەرەستەکان ڕاستەوخۆ نوێکرانەوە.'
                    : 'The masterwork stage, gallery feeds, 3D photogrammetry, and atelier cross-links are now live.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/artworks/${slug}`}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-colors"
              >
                <span>{locale === 'ckb' ? 'بینینی شاکاری نوێکراوە' : 'View Updated Artwork'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin"
                className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
              >
                {locale === 'ckb' ? 'گەڕانەوە بۆ دەستە' : 'Back to Dashboard'}
              </Link>
            </div>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1: Identification & Trilingual Titles */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-museum-divider pb-4">
              <div>
                <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif">
                  <Palette className="w-4 h-4 text-gold" />
                  <span>
                    {locale === 'ckb' ? 'دەستکاریکردنی ناونیشان و زانیاریی سەرەکی' : 'Core Identification & Inscriptions'}
                  </span>
                </h2>
                <p className="text-[11px] text-museum-caption mt-0.5">
                  Synchronize and refine editorial titles, critical essays, and catalogue metadata.
                </p>
              </div>

              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-museum-border self-start sm:self-auto">
                {(['ckb', 'ar', 'en'] as const).map((code) => (
                  <button
                    type="button"
                    key={code}
                    onClick={() => setLangTab(code)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      langTab === code
                        ? 'bg-gold text-obsidian shadow-sm'
                        : 'text-museum-secondary hover:text-parchment'
                    }`}
                  >
                    {code === 'ckb' ? 'کوردی' : code === 'ar' ? 'العربية' : 'EN'}
                  </button>
                ))}
              </div>
            </div>

            {/* Trilingual Title & Essay Inputs */}
            {langTab === 'ckb' && (
              <div className="flex flex-col gap-4 text-start" dir="rtl">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    ناوی شاکار بە کوردی سۆرانی *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleCkb}
                    onChange={(e) => setFormData({ ...formData, titleCkb: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    دەقی کورت یان تەکنیک
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionCkb}
                    onChange={(e) => setFormData({ ...formData, descriptionCkb: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1 flex items-center justify-between">
                    <span>وتاری ڕەخنەیی و شیکاریی دوورودرێژی مۆزەخانەیی</span>
                    <span className="text-[10px] text-gold font-mono">Long-form Curatorial Essay</span>
                  </label>
                  <textarea
                    rows={6}
                    value={formData.curatorialEssayCkb}
                    onChange={(e) => setFormData({ ...formData, curatorialEssayCkb: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold leading-relaxed font-sans"
                  />
                </div>
              </div>
            )}

            {langTab === 'ar' && (
              <div className="flex flex-col gap-4 text-start" dir="rtl">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    عنوان العمل الفني بالعربية
                  </label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    الوصف المختصر
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    القراءة النقدية والدراسة التحليلية المفصلة
                  </label>
                  <textarea
                    rows={6}
                    value={formData.curatorialEssayAr}
                    onChange={(e) => setFormData({ ...formData, curatorialEssayAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold leading-relaxed"
                  />
                </div>
              </div>
            )}

            {langTab === 'en' && (
              <div className="flex flex-col gap-4 text-start" dir="ltr">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Artwork Title in English
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Short Curatorial Synopsis
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Comprehensive Curatorial Monograph / Critical Essay
                  </label>
                  <textarea
                    rows={6}
                    value={formData.curatorialEssayEn}
                    onChange={(e) => setFormData({ ...formData, curatorialEssayEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Department (3D Tour Hall), Category, Artist, Medium, Year in Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-3 border-t border-museum-divider">
              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'بەشی پەیمانگا (هۆڵی ٣D)' : '3D Tour Department'}
                </label>
                <select
                  value={formData.department || 'painting'}
                  onChange={(e) => {
                    const nextDept = e.target.value as ArtworkDepartment;
                    setFormData((prev) => ({
                      ...prev,
                      department: nextDept,
                      category:
                        nextDept === 'painting'
                          ? 'painting'
                          : nextDept === 'sculpture'
                          ? 'sculpture'
                          : prev.category === 'painting' || prev.category === 'sculpture'
                          ? 'design'
                          : prev.category,
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-gold/40 text-xs text-parchment outline-none focus:border-gold font-medium"
                >
                  <option value="painting">بەشی وێنەکێشان (Painting Hall)</option>
                  <option value="sculpture">بەشی پەیکەرسازی (Sculpture Rotunda)</option>
                  <option value="mixed">بابەتی تێکەڵاو (Mixed Media Gallery)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'پۆلێن / جۆر' : 'Discipline / Category'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                >
                  <option value="painting">Painting / شێوەکاری</option>
                  <option value="sculpture">Sculpture / پەیکەرسازی</option>
                  <option value="ceramics">Ceramics / سیرامیک</option>
                  <option value="design">Design & Graphics / گرافیک</option>
                  <option value="music">Music / مۆسیقا</option>
                  <option value="theater">Theater / شانۆ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'هونەرمەند' : 'Artist'}
                </label>
                <select
                  value={formData.artistId}
                  onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.fullName[locale] || student.fullName.ckb} ({student.graduationYear})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'کەرەستە (Medium)' : 'Medium'}
                </label>
                <input
                  type="text"
                  value={formData.mediumCkb}
                  onChange={(e) => setFormData({ ...formData, mediumCkb: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'ساڵ و قەبارە' : 'Year & Dimensions'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment font-mono outline-none focus:border-gold text-center"
                  />
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment font-mono outline-none focus:border-gold text-center"
                  />
                </div>
              </div>
            </div>

            {/* Pedestal & Gallery Provenance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-museum-divider">
              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'شوێنی فیزیکی لە پەیمانگا' : 'Location in Institute'}
                </label>
                <input
                  type="text"
                  value={formData.locationInInstituteCkb}
                  onChange={(e) => setFormData({ ...formData, locationInInstituteCkb: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'کۆدی پێدەستاڵ یان دیوار (Pedestal Code)' : 'Provenance Pedestal'}
                </label>
                <input
                  type="text"
                  value={formData.provenancePedestal}
                  onChange={(e) => setFormData({ ...formData, provenancePedestal: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment font-mono outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Media Assets & Native Upload Replacement */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <div className="border-b border-museum-divider pb-3">
              <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif">
                <UploadCloud className="w-4 h-4 text-gold" />
                <span>
                  {locale === 'ckb'
                    ? 'فایلە میدیاییەکان و بارکردنەوە (مۆدێلی ۳D، دەنگ، ڤیدیۆ، PDF)'
                    : 'Media Assets & Native File Replacement'}
                </span>
              </h2>
              <p className="text-[11px] text-museum-secondary mt-0.5">
                Inspect current media files or upload replacements directly from your device.
              </p>
            </div>

            {/* Media 1: Primary Visual Image */}
            <FileUploadDropzone
              mediaType="image"
              value={formData.imageUrl}
              fileName={formData.imageFileName}
              label={locale === 'ckb' ? 'وێنەی سەرەکیی شاکار (JPG, PNG, WebP) *' : 'Primary Masterwork Visual Image (JPG, PNG, WebP) *'}
              optional={false}
              presets={PRESET_ART_IMAGES.map((url, i) => ({ label: `Artwork Preset ${i + 1}`, url }))}
              onChange={(url, name) => setFormData((prev) => ({ ...prev, imageUrl: url, imageFileName: name }))}
            />

            {/* Media 2: 3D Photogrammetry Model (.glb, .gltf) */}
            <div className="pt-4 border-t border-museum-divider">
              <FileUploadDropzone
                mediaType="model3d"
                value={formData.modelUrl || ''}
                fileName={formData.modelFileName}
                label={locale === 'ckb' ? 'مۆدێلی ۳D / AR (GLB یان GLTF)' : '3D Photogrammetric Model (.glb, .gltf)'}
                optional={true}
                posterUrl={formData.imageUrl}
                presets={PRESET_3D_MODELS}
                onChange={(url, name) =>
                  setFormData((prev) => ({
                    ...prev,
                    modelUrl: url,
                    modelFileName: name,
                    has3DModel: Boolean(url && url.trim().length > 0),
                  }))
                }
              />

              {/* Live 3D Preview Studio & Scale Controller */}
              <div className="mt-3">
                <ModelPreviewStudio
                  modelUrl={formData.modelUrl || ''}
                  modelFileName={formData.modelFileName}
                  hasPedestal={formData.hasPedestal !== false}
                  onPedestalChange={(val) => setFormData((prev) => ({ ...prev, hasPedestal: val }))}
                  modelScale={formData.modelScale || 1.0}
                  onScaleChange={(val) => setFormData((prev) => ({ ...prev, modelScale: val }))}
                  locale={locale}
                />
              </div>
            </div>

            {/* Media 3: Audio Commentary Narration (.mp3, .wav, .m4a) */}
            <div className="pt-4 border-t border-museum-divider">
              <FileUploadDropzone
                mediaType="audio"
                value={formData.audioUrl || ''}
                fileName={formData.audioFileName}
                label={locale === 'ckb' ? 'دەنگی ڕێبەری مۆزەخانەیی (Audio Guide Narration)' : 'Curatorial Audio Commentary (.mp3, .wav, .m4a)'}
                optional={true}
                onChange={(url, name) => setFormData((prev) => ({ ...prev, audioUrl: url, audioFileName: name }))}
              />
            </div>

            {/* Media 4: Video Demonstration / Documentary (.mp4, .webm) */}
            <div className="pt-4 border-t border-museum-divider">
              <FileUploadDropzone
                mediaType="video"
                value={formData.videoUrl || ''}
                fileName={formData.videoFileName}
                label={locale === 'ckb' ? 'ڤیدیۆی بەڵگەنامەیی یان ستۆدیۆ (Video Documentary)' : 'Curatorial Video Documentary (.mp4, .webm, or YouTube)'}
                optional={true}
                onChange={(url, name) => setFormData((prev) => ({ ...prev, videoUrl: url, videoFileName: name }))}
              />
            </div>

            {/* Media 5: Curatorial Research & Monograph PDF */}
            <div className="pt-4 border-t border-museum-divider">
              <FileUploadDropzone
                mediaType="pdf"
                value={formData.curatorialPdfUrl || ''}
                fileName={formData.curatorialPdfFileName}
                label={locale === 'ckb' ? 'تێزی ئەکادیمی و لێکۆڵینەوەی هونەری (PDF Monograph)' : 'Curatorial Research Monograph / Academic PDF'}
                optional={true}
                onChange={(url, name) => setFormData((prev) => ({ ...prev, curatorialPdfUrl: url, curatorialPdfFileName: name }))}
              />
            </div>
          </div>

          {/* Section 3: Reusable Atelier Tools Bank & Quick-Add */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-museum-divider pb-3">
              <div>
                <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif">
                  <Wrench className="w-4 h-4 text-gold" />
                  <span>
                    {locale === 'ckb' ? 'کەرەستە و ئامرازە بەستراوەکانی ئاتلیێ' : 'Connected Atelier Instruments'}
                  </span>
                </h2>
                <p className="text-[11px] text-museum-secondary mt-0.5">
                  Update atelier tools cross-linked with this masterwork.
                </p>
              </div>

              {/* Quick Add Shortcut Button */}
              <button
                type="button"
                onClick={() => setIsQuickToolModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gold/15 text-gold hover:bg-gold/25 border border-gold/40 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <Wrench className="w-4 h-4" />
                <span>
                  {locale === 'ckb' ? '+ زیادکردنی کەرەستەی نوێ' : '+ Quick Add Instrument'}
                </span>
              </button>
            </div>

            {/* Search Filter for Tools */}
            <div className="relative w-full">
              <input
                type="text"
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                placeholder={locale === 'ckb' ? 'گەڕان لە کەرەستەکاندا...' : 'Filter atelier instruments...'}
                className="w-full ps-9 pe-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
              />
              <Search className="w-4 h-4 text-museum-secondary absolute top-1/2 -translate-y-1/2 start-3" />
            </div>

            {/* Interactive Tool Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
              {filteredTools.map((tool) => {
                const isSelected = formData.selectedToolSlugs.includes(tool.slug);
                return (
                  <div
                    key={tool.id}
                    onClick={() => handleToolToggle(tool.slug)}
                    className={`group relative flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gold/15 border-gold text-parchment shadow-gold-glow'
                        : 'bg-black/40 border-museum-border text-museum-secondary hover:border-gold/30 hover:bg-black/60'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-obsidian-elevated border border-museum-border">
                      <SafeImage
                        src={tool.imageUrl}
                        alt={tool.name.en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex flex-col flex-1 min-w-0 text-start">
                      <span className="text-[10px] text-gold uppercase tracking-wider font-mono">
                        {tool.categoryLabel[locale] || tool.categoryLabel.ckb}
                      </span>
                      <h4 className="text-xs font-bold text-parchment truncate">
                        {tool.name[locale] || tool.name.ckb}
                      </h4>
                      <span className="text-[10px] text-museum-caption truncate">
                        {tool.name.en}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-gold border-gold text-obsidian'
                          : 'border-museum-border text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-museum-caption pt-2 border-t border-museum-divider">
              <span>
                {formData.selectedToolSlugs.length} {locale === 'ckb' ? 'کەرەستە بەستراوەتەوە' : 'instruments connected'}
              </span>
              <span className="font-mono text-gold">
                {tools.length} Available Tools
              </span>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-museum-divider">
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-museum-secondary hover:text-parchment bg-white/5 transition-colors"
            >
              {locale === 'ckb' ? 'پاشگەزبوونەوە' : 'Cancel'}
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs tracking-wide shadow-gold-glow flex items-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (locale === 'ckb' ? 'خەریکی پاشەکەوتکردن...' : 'Saving Changes...')
                  : (locale === 'ckb' ? 'پاشەکەوتکردنی گۆڕانکارییەکان' : 'Save Changes')}
              </span>
            </button>
          </div>
        </form>

        {/* Quick Add Tool Modal */}
        <QuickToolAddModal
          isOpen={isQuickToolModalOpen}
          onClose={() => setIsQuickToolModalOpen(false)}
          onToolCreated={handleToolCreated}
        />
      </div>
    </AdminAuthGuard>
  );
}
