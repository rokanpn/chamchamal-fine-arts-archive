'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { FileUploadDropzone } from '@/components/admin/FileUploadDropzone';
import { ModelPreviewStudio } from '@/components/admin/ModelPreviewStudio';
import { QuickToolAddModal } from '@/components/admin/QuickToolAddModal';
import { Artwork, ArtworkDepartment, DEPARTMENT_LABELS, DEPARTMENT_OPTIONS } from '@/data/artworks';
import { AtelierTool } from '@/data/tools';
import { IngestionFormData } from '@/types/admin';
import { 
  PlusCircle, 
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
  Check
} from 'lucide-react';

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

export default function NewArtworkIngestionPage() {
  const router = useRouter();
  const { students, tools, addArtwork } = useArchive();
  const { locale, isRTL } = useLanguage();

  const [langTab, setLangTab] = useState<'ckb' | 'ar' | 'en'>('ckb');
  const [toolSearch, setToolSearch] = useState('');
  const [isQuickToolModalOpen, setIsQuickToolModalOpen] = useState(false);
  const [createdArtworkSlug, setCreatedArtworkSlug] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State with optional defaults
  const [formData, setFormData] = useState<IngestionFormData>({
    titleCkb: '',
    titleAr: '',
    titleEn: '',
    artistId: students[0]?.id || 'shwan-karim-ahmed',
    category: 'painting',
    department: 'painting',
    mediumCkb: '',
    mediumAr: '',
    mediumEn: '',
    year: new Date().getFullYear(),
    dimensions: '120 × 90 cm',
    width_cm: 120,
    height_cm: 90,
    descriptionCkb: '',
    descriptionAr: '',
    descriptionEn: '',
    curatorialEssayCkb: '',
    curatorialEssayAr: '',
    curatorialEssayEn: '',
    locationInInstituteCkb: 'هۆڵی پێشانگای سەرەکی، قاتی یەکەم',
    locationInInstituteAr: 'القاعة الكبرى للمقتنيات، الطابق الأول',
    locationInInstituteEn: 'Main Permanent Gallery Hall, Floor 1',
    provenancePedestal: 'WALL-GALLERY-N1',
    imageUrl: PRESET_ART_IMAGES[0],
    imageFileName: '',
    has3DModel: false,
    hasPedestal: true,
    modelScale: 1.0,
    modelUrl: '',
    modelFileName: '',
    modelVertices: '320,000 Vertices',
    modelPolygons: '640,000 Triangles',
    audioUrl: '',
    audioFileName: '',
    audioDurationSeconds: 140,
    videoUrl: '',
    videoFileName: '',
    videoTitleCkb: 'شیکاری بەرهەم و قۆناغەکانی دروستکردن',
    videoTitleAr: 'توثيق العمل ومراحل الإبداع',
    videoTitleEn: 'Masterwork Analysis & Creation Documentary',
    curatorialPdfUrl: '',
    curatorialPdfFileName: '',
    selectedToolSlugs: ['horsehair-filbert-brush'],
  });

  const handleToolToggle = (slug: string) => {
    setFormData((prev) => {
      const exists = prev.selectedToolSlugs.includes(slug);
      return {
        ...prev,
        selectedToolSlugs: exists
          ? prev.selectedToolSlugs.filter((s) => s !== slug)
          : [...prev.selectedToolSlugs, slug],
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
      (tool?.name?.ckb || '').toLowerCase().includes(term) ||
      (tool?.name?.en || '').toLowerCase().includes(term) ||
      (tool?.name?.ar || '').toLowerCase().includes(term)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedArtist = students.find((s) => s.id === formData.artistId) || students[0];
    const generatedSlug = (formData.titleEn || formData.titleCkb || 'masterwork')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);

    const has3D = Boolean(formData.modelUrl && formData.modelUrl.trim().length > 0);

    const categoryLabels: Record<string, { ckb: string; ar: string; en: string }> = {
      painting: { ckb: 'شێوەکاری', ar: 'رسم تشكيلي', en: 'Painting' },
      sculpture: { ckb: 'پەیکەرسازی', ar: 'نحت وتجسيم', en: 'Sculpture' },
      ceramics: { ckb: 'سیرامیک', ar: 'خزف فني', en: 'Ceramics' },
      design: { ckb: 'دیزاین و گرافیک', ar: 'تصميم وجرافيك', en: 'Design & Graphics' },
    };

    const newArtwork: Artwork = {
      id: `art-${Date.now()}`,
      slug: generatedSlug,
      title: {
        ckb: formData.titleCkb || formData.titleEn || 'شاکاری نوێی پەیمانگە',
        ar: formData.titleAr || formData.titleCkb || formData.titleEn || 'عمل فني جديد',
        en: formData.titleEn || formData.titleCkb || 'New Archival Masterwork',
      },
      artist: selectedArtist ? selectedArtist.fullName : { ckb: 'هونەرمەندی پەیمانگە', ar: 'فنان المعهد', en: 'Institute Artist' },
      artistId: selectedArtist ? selectedArtist.id : 'faculty-collection',
      artistBio: selectedArtist ? selectedArtist.bio : { ckb: 'دەرچووی پەیمانگەی هونەرە جوانەکان', ar: 'خريج معهد الفنون', en: 'Alumnus of Fine Arts Institute' },
      artistGraduationYear: selectedArtist ? selectedArtist.graduationYear : 2022,
      category: formData.category || 'painting',
      categoryLabel: categoryLabels[formData.category || 'painting'],
      department: (formData.department || 'painting') as ArtworkDepartment,
      departmentLabel: DEPARTMENT_LABELS[(formData.department || 'painting') as ArtworkDepartment],
      medium: {
        ckb: formData.mediumCkb || 'تەکنیکی تێکەڵاو',
        ar: formData.mediumAr || 'تقنية مختلطة',
        en: formData.mediumEn || 'Mixed Atelier Media',
      },
      year: Number(formData.year) || new Date().getFullYear(),
      dimensions: formData.dimensions || `${formData.width_cm || 120} × ${formData.height_cm || 90} cm`,
      width_cm: formData.width_cm ? Number(formData.width_cm) : 120,
      height_cm: formData.height_cm ? Number(formData.height_cm) : 90,
      imageUrl: formData.imageUrl || PRESET_ART_IMAGES[0],
      aspectRatio: 'portrait',
      has3DModel: has3D,
      hasPedestal: formData.hasPedestal,
      modelScale: formData.modelScale || 1.0,
      modelUrl: has3D ? formData.modelUrl : undefined,
      modelVertices: has3D ? formData.modelVertices : undefined,
      modelPolygons: has3D ? formData.modelPolygons : undefined,
      featured: false,
      description: {
        ckb: formData.descriptionCkb || 'شاکاری پەسەندکراو لەلایەن کۆمیتەی ئەرشیفی پەیمانگەی هونەرە جوانەکانی چەمچەماڵ.',
        ar: formData.descriptionAr || formData.descriptionCkb || 'عمل فني معتمد لدى لجنة الأرشيف بمعهد جمجمال.',
        en: formData.descriptionEn || 'Acquisition ratified by the Curatorial Board of Chamchamal Fine Arts Institute.',
      },
      curatorialEssay: formData.curatorialEssayCkb || formData.curatorialEssayEn ? {
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
        ckb: formData.locationInInstituteCkb || 'هۆڵی پێشانگای هەمیشەیی',
        ar: formData.locationInInstituteAr || 'قاعة المعرض الدائم',
        en: formData.locationInInstituteEn || 'Permanent Gallery Hall',
      },
      provenancePedestal: formData.provenancePedestal || 'GALLERY-PEDESTAL-1',
      physicalPlaqueCode: `CFA-${formData.year || 2026}-${(formData.category || 'PA').slice(0, 2).toUpperCase()}-${Math.floor(Math.random() * 800 + 100)}`,
      atelierTools: tools
        .filter((t) => formData.selectedToolSlugs.includes(t.slug))
        .map((t) => t.name),
      toolSlugs: formData.selectedToolSlugs,
    };

    addArtwork(newArtwork);
    setCreatedArtworkSlug(generatedSlug);
    setIsSubmitting(false);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-parchment-pure font-serif">
              {locale === 'ckb'
                ? 'تۆمارکردنی شاکاری نوێ لە ئەرشیف'
                : locale === 'ar'
                ? 'فهرسة عمل فني جديد في الأرشيف'
                : 'Curatorial Artwork Ingestion Studio'}
            </h1>
            <p className="text-xs text-museum-secondary">
              {locale === 'ckb'
                ? 'فایلی فۆتۆگرافی، مۆدێلی ۳D، دەنگی لێکۆڵینەوە، ڤیدیۆ و تێزی PDF ڕاستەوخۆ لە ئامێرەکەتەوە باربکە.'
                : 'Upload high-res imagery, 3D photogrammetry, audio guide, video documentary, and research PDF directly from your device.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-gold/15 text-gold border border-gold/30">
              Modular Studio • v2.0
            </span>
          </div>
        </div>

        {/* Success Alert Banner */}
        {createdArtworkSlug && (
          <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-200">
                  {locale === 'ckb' ? 'شاکارەکە بە سەرکەوتوویی خرایە ئەرشیفەوە!' : 'Masterwork cataloged successfully!'}
                </h4>
                <p className="text-xs text-emerald-400/80">
                  {locale === 'ckb'
                    ? 'هەموو فایلی میدیایی، مۆدێل و کەرەستەکان بەستراونەتەوە و ئامادەی سەردانن.'
                    : 'Media files, 3D meshes, audio guide, and cross-linked instruments are live.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/artworks/${createdArtworkSlug}`}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-colors"
              >
                <span>{locale === 'ckb' ? 'بینینی لاپەڕەی شاکار' : 'View Live Masterwork'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setCreatedArtworkSlug(null)}
                className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
              >
                {locale === 'ckb' ? 'تۆمارکردنی یەکێکی تر' : 'Catalog Another'}
              </button>
            </div>
          </div>
        )}

        {/* Main Ingestion Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1: Identification & Mandatory Title */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-museum-divider pb-4">
              <div>
                <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif">
                  <Palette className="w-4 h-4 text-gold" />
                  <span>
                    {locale === 'ckb' ? 'ناسنامەی بنەڕەتیی بەرهەم' : 'Masterwork Identification'}
                  </span>
                </h2>
                <p className="text-[11px] text-museum-caption mt-0.5">
                  Only the artwork title is mandatory. All other fields are completely flexible and optional.
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

            {/* Trilingual Title & Description Inputs */}
            {langTab === 'ckb' && (
              <div className="flex flex-col gap-4 text-start" dir="rtl">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    ناوی شاکار بە کوردی سۆرانی * <span className="text-gold font-mono">(پێویست)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleCkb}
                    onChange={(e) => setFormData({ ...formData, titleCkb: e.target.value })}
                    placeholder="نموونە: دڵۆپەی هەڵوەرین لە گەرمیان"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    دەقی کورت یان تەکنیک (ئارەزوومەندانە)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionCkb}
                    onChange={(e) => setFormData({ ...formData, descriptionCkb: e.target.value })}
                    placeholder="کورتەیەک لەسەر بیرۆکەی بەرهەمەکە..."
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1 flex items-center justify-between">
                    <span>وتاری ڕەخنەیی و شیکاریی دوورودرێژی مۆزەخانەیی (ئارەزوومەندانە)</span>
                    <span className="text-[10px] text-gold font-mono">Long-form Curatorial Essay</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.curatorialEssayCkb}
                    onChange={(e) => setFormData({ ...formData, curatorialEssayCkb: e.target.value })}
                    placeholder="لێکۆڵینەوەیەکی قووڵ دەربارەی مێژووی خوڵقاندن، فەلسەفەی فۆڕم و ڕەنگ، و ڕەهەندی ئەکادیمی بەرهەمەکە بنووسە..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold leading-relaxed font-sans"
                  />
                </div>
              </div>
            )}

            {langTab === 'ar' && (
              <div className="flex flex-col gap-4 text-start" dir="rtl">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    عنوان العمل الفني بالعربية (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    placeholder="مثال: أصداء كرميان الحزينة"
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
                    rows={5}
                    value={formData.curatorialEssayAr}
                    onChange={(e) => setFormData({ ...formData, curatorialEssayAr: e.target.value })}
                    placeholder="نص تحليلي ونقدي شامل للعمل..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold leading-relaxed"
                  />
                </div>
              </div>
            )}

            {langTab === 'en' && (
              <div className="flex flex-col gap-4 text-start" dir="ltr">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Artwork Title in English (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g. Echoes of Garmian Landscape"
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
                    rows={5}
                    value={formData.curatorialEssayEn}
                    onChange={(e) => setFormData({ ...formData, curatorialEssayEn: e.target.value })}
                    placeholder="Deep editorial analysis of composition, stylistic influence, and historical resonance..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Department (3D Tour Hall), Category, Artist, Medium, Year in Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-3 border-t border-museum-divider">
              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'بەشی پەیمانگە (هۆڵی ٣D)' : '3D Tour Department'}
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
                      {student?.fullName?.[locale] || student?.fullName?.ckb || student?.fullName?.en || ''} ({student.graduationYear})
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
                  placeholder="ڕۆنی سەر کانڤاس، بڕۆنز..."
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'ساڵی بەرهەمهێنان' : 'Creation Year'}
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full px-2.5 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment font-mono outline-none focus:border-gold text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'پانی و بەرزایی (سم)' : 'Width & Height (cm)'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      placeholder={locale === 'ckb' ? 'پانی (سم)' : 'Width (cm)'}
                      value={formData.width_cm ?? ''}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : undefined;
                        const h = formData.height_cm ?? 90;
                        setFormData({
                          ...formData,
                          width_cm: val,
                          dimensions: val ? `${val} × ${h} cm` : formData.dimensions,
                        });
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment font-mono outline-none focus:border-gold text-center"
                    />
                    <span className="absolute end-2 top-2 text-[10px] text-parchment-muted pointer-events-none">W</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder={locale === 'ckb' ? 'بەرزایی (سم)' : 'Height (cm)'}
                      value={formData.height_cm ?? ''}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : undefined;
                        const w = formData.width_cm ?? 120;
                        setFormData({
                          ...formData,
                          height_cm: val,
                          dimensions: val ? `${w} × ${val} cm` : formData.dimensions,
                        });
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment font-mono outline-none focus:border-gold text-center"
                    />
                    <span className="absolute end-2 top-2 text-[10px] text-parchment-muted pointer-events-none">H</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Native Device Media Ingestion Engine */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <div className="border-b border-museum-divider pb-3">
              <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif">
                <UploadCloud className="w-4 h-4 text-gold" />
                <span>
                  {locale === 'ckb'
                    ? 'فایلی میدیایی و مۆڵتیمیدیا (بارکردنی ڕاستەوخۆ لە ئامێرەکەت)'
                    : 'Native Client Device Media Ingestion'}
                </span>
              </h2>
              <p className="text-[11px] text-museum-secondary mt-0.5">
                Drop files from your computer or smartphone. Files are processed locally and preserved permanently in the archive storage.
              </p>
            </div>

            {/* Media 1: Primary Visual Image */}
            <FileUploadDropzone
              mediaType="image"
              value={formData.imageUrl}
              fileName={formData.imageFileName}
              label={locale === 'ckb' ? 'وێنەی سەرەکیی شاکار (JPG, PNG, WebP) *' : 'Primary Masterwork Visual Image (JPG, PNG, WebP) *'}
              description={locale === 'ckb' ? 'وێنەیەکی کواڵێتی بەرز لە شاکارەکە؛ دەتوانی لە ئامێرەکەتەوە هەڵیبژێریت یان لینکی وێب بەکاربهێنیت.' : 'High-resolution archival photography with responsive aspect-ratio canvas preview.'}
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
                description={locale === 'ckb' ? 'ئەگەر سکانی ۳D هەیە، بیخە ئێرە تا بینەر بتوانێت بە شێوازی ۳D و AR سەیری بکات. ئەگەر نییە، بەتاڵی جێیبهێڵە و بینەری ۲D کاردەکات.' : 'Optional: Photogrammetry mesh with instant inline 3D test stage. If absent, the archive seamlessly displays high-resolution 2D Parallax.'}
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
                description={locale === 'ckb' ? 'دەنگی مامۆستا یان شیکەرەوەی هونەری؛ ئەگەر دانەنرێت، پلەیەرەکەی دەنگ بە جوانی دەشاردرێتەوە.' : 'Optional: Voice narration explaining aesthetic decisions and historical subtext. Cleanly omitted if absent.'}
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
                description={locale === 'ckb' ? 'فایلی ڤیدیۆی ئەکادیمی یان لینکی فێرکاری لە ئاتلیێدا.' : 'Optional: Workshop footage or curatorial documentary video.'}
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
                description={locale === 'ckb' ? 'فایلی PDFی تایبەت بە لێکۆڵینەوە، تێزی دەرچوون یان وتاری مۆزەخانەیی؛ بەگمەیەکی شیکاری لە پەڕەی بەرهەمەکە دروست دەکات.' : 'Optional: Complete dissertation or curatorial dossier PDF available for download and reading.'}
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
                    {locale === 'ckb' ? 'بانکی کەرەستە و ئامرازەکانی ئاتلیێ' : 'Atelier Instruments Repository'}
                  </span>
                </h2>
                <p className="text-[11px] text-museum-secondary mt-0.5">
                  Select existing tools used to craft this piece, or quickly register a new instrument on the fly.
                </p>
              </div>

              {/* Quick Add Shortcut Button */}
              <button
                type="button"
                onClick={() => setIsQuickToolModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gold/15 text-gold hover:bg-gold/25 border border-gold/40 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>
                  {locale === 'ckb' ? '+ زیادکردنی کەرەستەی نوێ بۆ سەرچاوەکان' : '+ Quick Add Instrument'}
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
                      <Image
                        src={tool.imageUrl}
                        alt={tool.name.en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex flex-col flex-1 min-w-0 text-start">
                      <span className="text-[10px] text-gold uppercase tracking-wider font-mono">
                        {tool?.categoryLabel?.[locale] || tool?.categoryLabel?.ckb || tool?.categoryLabel?.en || ''}
                      </span>
                      <h4 className="text-xs font-bold text-parchment truncate">
                        {tool?.name?.[locale] || tool?.name?.ckb || tool?.name?.en || ''}
                      </h4>
                      <span className="text-[10px] text-museum-caption truncate">
                        {tool?.name?.en || ''}
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
                {formData.selectedToolSlugs.length} {locale === 'ckb' ? 'کەرەستە هەڵبژێردراوە' : 'instruments selected'}
              </span>
              <span className="font-mono text-gold">
                {tools.length} Total Registered Tools
              </span>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-museum-divider">
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
              <PlusCircle className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (locale === 'ckb' ? 'خەریکی تۆمارکردن لە ئەرشیف...' : 'Cataloging Masterwork...')
                  : (locale === 'ckb' ? 'تۆمارکردنی شاکار لە ئەرشیف' : 'Ingest Masterwork into Archive')}
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
