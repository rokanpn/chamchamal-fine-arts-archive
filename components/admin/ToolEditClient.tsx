'use client';

import React, { useState, useEffect } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { FileUploadDropzone } from '@/components/admin/FileUploadDropzone';
import { AtelierTool, TOOLS_DATA } from '@/data/tools';
import { ToolIngestionFormData } from '@/types/admin';
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
  Video,
  Headphones,
  BookOpen,
  MapPin,
  ExternalLink,
  Layers,
  SlidersHorizontal,
  Eye,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

const PRESET_MODELS = [
  { label: 'Antique Camera (Khronos)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb' },
  { label: 'Damaged Helmet (Sci-fi/Metal)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb' },
  { label: 'Water Bottle (Ceramics/Glaze)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/WaterBottle/glTF-Binary/WaterBottle.glb' },
  { label: 'Sheen Cloth (Silk / Fiber)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenCloth/glTF-Binary/SheenCloth.glb' },
  { label: 'Lantern (Bronze / Metal)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Lantern/glTF-Binary/Lantern.glb' },
  { label: 'Suzanne Blender Monkey (Sculpture)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF-Binary/Suzanne.glb' },
  { label: 'Avocado (Organic / Clay Texture)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Avocado/glTF-Binary/Avocado.glb' },
  { label: 'Duck (Glazed Terracotta)', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb' },
];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?auto=format&fit=crop&w=1200&q=80',
];

interface ToolEditClientProps {
  slug: string;
}

export function ToolEditClient({ slug }: ToolEditClientProps) {
  const router = useRouter();
  const { tools, artworks, updateTool, isHydrated } = useArchive();
  const { locale, isRTL } = useLanguage();

  const targetTool = tools.find((t) => t.slug === slug || t.id === slug) ||
    TOOLS_DATA.find((t) => t.slug === slug || t.id === slug);

  const [langTab, setLangTab] = useState<'ckb' | 'ar' | 'en'>('ckb');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<ToolIngestionFormData>({
    nameCkb: '',
    nameAr: '',
    nameEn: '',
    category: 'painting',
    descriptionCkb: '',
    descriptionAr: '',
    descriptionEn: '',
    historicalSignificanceCkb: '',
    historicalSignificanceAr: '',
    historicalSignificanceEn: '',
    bestPracticesCkb: '',
    bestPracticesAr: '',
    bestPracticesEn: '',
    materialsCkb: '',
    materialsAr: '',
    materialsEn: '',
    originCkb: '',
    originAr: '',
    originEn: '',
    glbUrl: PRESET_MODELS[0].url,
    imageUrl: PRESET_IMAGES[0],
    galleryImagesText: '',
    videoUrl: '',
    videoTitleCkb: '',
    videoTitleAr: '',
    videoTitleEn: '',
    audioDuration: '2:20 Min',
    usageInstructionsCkb: '',
    usageInstructionsAr: '',
    usageInstructionsEn: '',
    proTipsCkbText: '',
    proTipsArText: '',
    proTipsEnText: '',
    usedInArtworkSlugs: [],
  });

  // Populate data when targetTool is found
  useEffect(() => {
    if (targetTool) {
      setFormData({
        nameCkb: targetTool.name?.ckb || '',
        nameAr: targetTool.name?.ar || '',
        nameEn: targetTool.name?.en || '',
        category: targetTool.category || 'painting',
        descriptionCkb: targetTool.description?.ckb || '',
        descriptionAr: targetTool.description?.ar || '',
        descriptionEn: targetTool.description?.en || '',
        historicalSignificanceCkb: targetTool.historicalSignificance?.ckb || '',
        historicalSignificanceAr: targetTool.historicalSignificance?.ar || '',
        historicalSignificanceEn: targetTool.historicalSignificance?.en || '',
        bestPracticesCkb: targetTool.bestPractices?.ckb || '',
        bestPracticesAr: targetTool.bestPractices?.ar || '',
        bestPracticesEn: targetTool.bestPractices?.en || '',
        materialsCkb: targetTool.materials?.ckb || '',
        materialsAr: targetTool.materials?.ar || '',
        materialsEn: targetTool.materials?.en || '',
        originCkb: targetTool.origin?.ckb || '',
        originAr: targetTool.origin?.ar || '',
        originEn: targetTool.origin?.en || '',
        glbUrl: targetTool.glbUrl || PRESET_MODELS[0].url,
        imageUrl: targetTool.imageUrl || PRESET_IMAGES[0],
        galleryImagesText: (targetTool.galleryImages || []).join('\n'),
        videoUrl: targetTool.videoUrl || '',
        videoTitleCkb: targetTool.videoTitle?.ckb || '',
        videoTitleAr: targetTool.videoTitle?.ar || '',
        videoTitleEn: targetTool.videoTitle?.en || '',
        audioDuration: targetTool.audioDuration || '2:20 Min',
        usageInstructionsCkb: targetTool.usageInstructions?.ckb || '',
        usageInstructionsAr: targetTool.usageInstructions?.ar || '',
        usageInstructionsEn: targetTool.usageInstructions?.en || '',
        proTipsCkbText: (targetTool.proTips?.ckb || []).join('\n'),
        proTipsArText: (targetTool.proTips?.ar || []).join('\n'),
        proTipsEnText: (targetTool.proTips?.en || []).join('\n'),
        usedInArtworkSlugs: targetTool.usedInArtworkSlugs || [],
      });
    }
  }, [targetTool]);

  if (isHydrated && !targetTool) {
    return (
      <AdminAuthGuard>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-parchment-pure mb-2">
              {locale === 'ckb' ? 'کەرەستەکە نەدۆزرایەوە' : 'Atelier Tool Not Found'}
            </h2>
            <p className="text-museum-secondary text-sm max-w-md">
              {locale === 'ckb' 
                ? 'ئەم کەرەستەیە لە ئەرشیفدا بەردەست نییە یان سڕاوەتەوە.' 
                : 'The requested atelier instrument could not be resolved in the repository.'}
            </p>
          </div>
          <Link
            href="/admin?tab=tools"
            className="px-6 py-2.5 rounded-full bg-gold/20 hover:bg-gold text-gold-light hover:text-obsidian font-bold text-xs transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{locale === 'ckb' ? 'گەڕانەوە بۆ ژووری سەرپەرشتیار' : 'Return to Admin Hub'}</span>
          </Link>
        </div>
      </AdminAuthGuard>
    );
  }

  const handleArtworkToggle = (artSlug: string) => {
    setFormData((prev) => {
      const exists = prev.usedInArtworkSlugs.includes(artSlug);
      return {
        ...prev,
        usedInArtworkSlugs: exists
          ? prev.usedInArtworkSlugs.filter((s) => s !== artSlug)
          : [...prev.usedInArtworkSlugs, artSlug],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTool) return;
    setIsSubmitting(true);

    const galleryImages = formData.galleryImagesText
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const proTipsCkb = formData.proTipsCkbText.split('\n').map((s) => s.trim()).filter(Boolean);
    const proTipsAr = formData.proTipsArText.split('\n').map((s) => s.trim()).filter(Boolean);
    const proTipsEn = formData.proTipsEnText.split('\n').map((s) => s.trim()).filter(Boolean);

    const categoryLabels: Record<string, { ckb: string; ar: string; en: string }> = {
      painting: { ckb: 'شێوەکاری و ڕەنگ', ar: 'الرسم والتلوين', en: 'Painting & Pigments' },
      sculpture: { ckb: 'پەیکەرسازی و بەرد', ar: 'النحت وتشكيل الحجر', en: 'Sculpture & Stone' },
      ceramics: { ckb: 'سیرامیک و ئاگر', ar: 'الخزف والفنون النارية', en: 'Ceramics & Kiln' },
      calligraphy: { ckb: 'خۆشنووسی و مەرەکەب', ar: 'الخط والمداد', en: 'Calligraphy & Inks' },
    };

    const updatedData: Partial<AtelierTool> = {
      name: {
        ckb: formData.nameCkb || targetTool?.name?.ckb || targetTool?.name?.en || '',
        ar: formData.nameAr || formData.nameCkb || targetTool?.name?.ar || '',
        en: formData.nameEn || targetTool?.name?.en || '',
      },
      category: formData.category,
      categoryLabel: categoryLabels[formData.category] || categoryLabels.painting,
      description: {
        ckb: formData.descriptionCkb,
        ar: formData.descriptionAr,
        en: formData.descriptionEn,
      },
      historicalSignificance: {
        ckb: formData.historicalSignificanceCkb,
        ar: formData.historicalSignificanceAr,
        en: formData.historicalSignificanceEn,
      },
      bestPractices: {
        ckb: formData.bestPracticesCkb,
        ar: formData.bestPracticesAr,
        en: formData.bestPracticesEn,
      },
      materials: {
        ckb: formData.materialsCkb,
        ar: formData.materialsAr,
        en: formData.materialsEn,
      },
      origin: {
        ckb: formData.originCkb,
        ar: formData.originAr,
        en: formData.originEn,
      },
      glbUrl: formData.glbUrl,
      imageUrl: formData.imageUrl,
      galleryImages: galleryImages.length > 0 ? galleryImages : [formData.imageUrl],
      videoUrl: formData.videoUrl,
      videoTitle: {
        ckb: formData.videoTitleCkb,
        ar: formData.videoTitleAr,
        en: formData.videoTitleEn,
      },
      audioDuration: formData.audioDuration || '2:20 Min',
      usageInstructions: {
        ckb: formData.usageInstructionsCkb,
        ar: formData.usageInstructionsAr,
        en: formData.usageInstructionsEn,
      },
      proTips: {
        ckb: proTipsCkb.length > 0 ? proTipsCkb : ['کەرەستەکە بە پاکی ڕابگرە.'],
        ar: proTipsAr.length > 0 ? proTipsAr : ['حافظ على نظافة الأداة.'],
        en: proTipsEn.length > 0 ? proTipsEn : ['Maintain tool in clean condition.'],
      },
      usedInArtworkSlugs: formData.usedInArtworkSlugs,
    };

    updateTool(targetTool.id || targetTool.slug, updatedData);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <AdminAuthGuard>
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-32">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-museum-border pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin?tab=tools"
              className="p-2 rounded-xl bg-white/5 hover:bg-gold/15 text-museum-secondary hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest">
                <Wrench className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'دەستکاریکردنی کەرەستەی ئاتلیێ' : 'Edit Atelier Instrument'}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-parchment-pure">
                {targetTool?.name?.[locale] || targetTool?.name?.ckb || targetTool?.name?.en || 'Modify Tool Record'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {targetTool && (
              <Link
                href={`/tools/${targetTool.slug}`}
                target="_blank"
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment text-xs flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{locale === 'ckb' ? 'پشکنینی پەیج' : 'Live Route'}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Success Alert Banner */}
        {isSuccess && (
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-emerald-300 font-bold text-sm">
                  {locale === 'ckb' ? 'گۆڕانکارییەکان بە سەرکەوتوویی پاشەکەوت کران' : 'Changes Saved Successfully'}
                </h4>
                <p className="text-emerald-400/80 text-xs">
                  {locale === 'ckb' 
                    ? 'زانیاری و وێنە و مۆدێلی سێ ڕەهەندی کەرەستەکە لە داتابەیس نوێکرانەوە.' 
                    : 'Instrument details, photogrammetry stage, and linked works synchronized.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/tools/${targetTool?.slug}`}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'بینینی پەڕەی گشتی' : 'View Live'}</span>
              </Link>
              <Link
                href="/admin?tab=tools"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-parchment font-bold text-xs transition-colors"
              >
                {locale === 'ckb' ? 'گەڕانەوە بۆ لیستی کەرەستەکان' : 'Back to Tools Table'}
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1: Classification & Trilingual Names */}
          <div className="p-6 rounded-3xl bg-obsidian-surface/80 border border-museum-border flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-museum-divider pb-4">
              <div>
                <h3 className="text-base font-bold text-parchment-pure flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gold" />
                  <span>{locale === 'ckb' ? 'ناسینەوە و پۆلێنکردنی کەرەستە' : 'Instrument Identification & Department'}</span>
                </h3>
                <p className="text-xs text-museum-secondary">
                  {locale === 'ckb' ? 'ناوی فەرمی بە هەر سێ زمان و بەشی پەیوەندیدار' : 'Official designations across Kurdish, Arabic, and English'}
                </p>
              </div>

              {/* Language Switcher Tabs */}
              <div className="inline-flex p-1 rounded-xl bg-black/60 border border-museum-border shrink-0">
                {(['ckb', 'ar', 'en'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setLangTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition-all ${
                      langTab === tab
                        ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                        : 'text-museum-secondary hover:text-parchment'
                    }`}
                  >
                    {tab === 'ckb' ? 'کوردی' : tab === 'ar' ? 'العربية' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary uppercase">
                {locale === 'ckb' ? 'بەشی هونەری تایبەتمەند' : 'Fine Arts Atelier Department'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'painting', label: 'شێوەکاری / Painting', icon: '🎨' },
                  { key: 'sculpture', label: 'پەیکەرسازی / Sculpture', icon: '🗿' },
                  { key: 'ceramics', label: 'سیرامیک / Ceramics', icon: '🏺' },
                  { key: 'calligraphy', label: 'خۆشنووسی / Calligraphy', icon: '✒️' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: item.key as any })}
                    className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2.5 transition-all ${
                      formData.category === item.key
                        ? 'bg-gold/15 border-gold text-gold-light shadow-gold-glow'
                        : 'bg-black/40 border-museum-border text-museum-secondary hover:border-gold/30'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trilingual Title Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={langTab === 'ckb' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  ناوی کەرەستە (کوردی سۆرانی) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameCkb}
                  onChange={(e) => setFormData({ ...formData, nameCkb: e.target.value })}
                  placeholder="وەک: فڵچەی تاڵی دەستکردی ژمارە ١٢"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'ar' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  اسم الأداة (العربية)
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="مثال: فرشاة رسم الأكاديمية نمرة ١٢"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'en' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  Tool Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Master Atelier Filbert Brush No. 12"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Trilingual Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary uppercase">
                {locale === 'ckb' ? 'پێناسە و کورتەی تەکنیکی' : 'Curatorial Description & Technical Profile'}
              </label>
              {langTab === 'ckb' && (
                <textarea
                  rows={3}
                  value={formData.descriptionCkb}
                  onChange={(e) => setFormData({ ...formData, descriptionCkb: e.target.value })}
                  placeholder="پێناسەی کەرەستەکە بە کوردی سۆرانی بنووسە..."
                  className="w-full p-4 rounded-2xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                  dir="rtl"
                />
              )}
              {langTab === 'ar' && (
                <textarea
                  rows={3}
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder="أدخل الوصف الأكاديمي للأداة بالعربية..."
                  className="w-full p-4 rounded-2xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                  dir="rtl"
                />
              )}
              {langTab === 'en' && (
                <textarea
                  rows={3}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Enter technical studio description in English..."
                  className="w-full p-4 rounded-2xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                  dir="ltr"
                />
              )}
            </div>
          </div>

          {/* Section 2: Materials, Provenance & Pedagogical Insights */}
          <div className="p-6 rounded-3xl bg-obsidian-surface/80 border border-museum-border flex flex-col gap-5">
            <h3 className="text-base font-bold text-parchment-pure flex items-center gap-2 border-b border-museum-divider pb-3">
              <BookOpen className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'پێکهاتە، سەرچاوە و ڕێنمایی بەکارهێنان' : 'Materials, Provenance & Pedagogical Protocol'}</span>
            </h3>

            {/* Materials & Origin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  {langTab === 'ckb' ? 'پێکهاتە و کەرەستە (ماددەکان)' : langTab === 'ar' ? 'المواد والمكونات' : 'Material Composition'}
                </label>
                <input
                  type="text"
                  value={langTab === 'ckb' ? formData.materialsCkb : langTab === 'ar' ? formData.materialsAr : formData.materialsEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (langTab === 'ckb') setFormData({ ...formData, materialsCkb: val });
                    else if (langTab === 'ar') setFormData({ ...formData, materialsAr: val });
                    else setFormData({ ...formData, materialsEn: val });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  {langTab === 'ckb' ? 'سەرچاوە و بەرهەمهێنان' : langTab === 'ar' ? 'المصدر والمنشأ' : 'Provenance & Origin'}
                </label>
                <input
                  type="text"
                  value={langTab === 'ckb' ? formData.originCkb : langTab === 'ar' ? formData.originAr : formData.originEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (langTab === 'ckb') setFormData({ ...formData, originCkb: val });
                    else if (langTab === 'ar') setFormData({ ...formData, originAr: val });
                    else setFormData({ ...formData, originEn: val });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Historical Significance */}
            <div>
              <label className="block text-xs font-mono text-museum-secondary mb-1">
                {langTab === 'ckb' ? 'گرنگی مێژوویی و کەلەپووری' : langTab === 'ar' ? 'الأهمية التاريخية والتراثية' : 'Historical & Curatorial Significance'}
              </label>
              <textarea
                rows={2}
                value={langTab === 'ckb' ? formData.historicalSignificanceCkb : langTab === 'ar' ? formData.historicalSignificanceAr : formData.historicalSignificanceEn}
                onChange={(e) => {
                  const val = e.target.value;
                  if (langTab === 'ckb') setFormData({ ...formData, historicalSignificanceCkb: val });
                  else if (langTab === 'ar') setFormData({ ...formData, historicalSignificanceAr: val });
                  else setFormData({ ...formData, historicalSignificanceEn: val });
                }}
                className="w-full p-3 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
              />
            </div>

            {/* Usage Instructions */}
            <div>
              <label className="block text-xs font-mono text-museum-secondary mb-1">
                {langTab === 'ckb' ? 'ڕێکاری بەکارهێنانی ئاتلیێ' : langTab === 'ar' ? 'إرشادات الاستخدام بالأكاديمية' : 'Step-by-Step Atelier Usage Guide'}
              </label>
              <textarea
                rows={2}
                value={langTab === 'ckb' ? formData.usageInstructionsCkb : langTab === 'ar' ? formData.usageInstructionsAr : formData.usageInstructionsEn}
                onChange={(e) => {
                  const val = e.target.value;
                  if (langTab === 'ckb') setFormData({ ...formData, usageInstructionsCkb: val });
                  else if (langTab === 'ar') setFormData({ ...formData, usageInstructionsAr: val });
                  else setFormData({ ...formData, usageInstructionsEn: val });
                }}
                className="w-full p-3 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
              />
            </div>

            {/* Pro Tips */}
            <div>
              <label className="block text-xs font-mono text-museum-secondary mb-1">
                {locale === 'ckb' ? 'ئامۆژگاری و فێڵە تەکنیکییەکان (هەر دێڕێک خاڵێکە)' : 'Pro Atelier Tips (One per line)'}
              </label>
              <textarea
                rows={3}
                value={langTab === 'ckb' ? formData.proTipsCkbText : langTab === 'ar' ? formData.proTipsArText : formData.proTipsEnText}
                onChange={(e) => {
                  const val = e.target.value;
                  if (langTab === 'ckb') setFormData({ ...formData, proTipsCkbText: val });
                  else if (langTab === 'ar') setFormData({ ...formData, proTipsArText: val });
                  else setFormData({ ...formData, proTipsEnText: val });
                }}
                className="w-full p-3 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold font-mono"
              />
            </div>
          </div>

          {/* Section 3: Media, 3D Photogrammetry & Audio */}
          <div className="p-6 rounded-3xl bg-obsidian-surface/80 border border-museum-border flex flex-col gap-6">
            <h3 className="text-base font-bold text-parchment-pure flex items-center gap-2 border-b border-museum-divider pb-3">
              <Box className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'میدیای فرەڕەهەند و پشکنەری سێ ڕەهەندی' : 'Multimodal Media & 3D Photogrammetry Stage'}</span>
            </h3>

            {/* Main Image Upload Dropzone */}
            <div className="flex flex-col gap-3">
              <FileUploadDropzone
                mediaType="image"
                value={formData.imageUrl}
                label={locale === 'ckb' ? 'وێنەی سەرەکی کەرەستە (فۆتۆی ئاتلیێ)' : 'Primary Tool Photography'}
                presets={PRESET_IMAGES.map((url, i) => ({ label: `Tool Preset ${i + 1}`, url }))}
                onChange={(url) => {
                  setFormData((prev) => ({
                    ...prev,
                    imageUrl: url,
                  }));
                }}
              />
            </div>

            {/* 3D GLB Model Upload Dropzone */}
            <div className="flex flex-col gap-3">
              <FileUploadDropzone
                mediaType="model3d"
                value={formData.glbUrl}
                label={locale === 'ckb' ? 'مۆدێلی سێ ڕەهەندی کەرەستە (فۆتۆگرامێتری GLB)' : '3D Photogrammetry Stage (.GLB)'}
                presets={PRESET_MODELS}
                posterUrl={formData.imageUrl}
                onChange={(url) => {
                  setFormData((prev) => ({
                    ...prev,
                    glbUrl: url,
                  }));
                }}
              />
            </div>

            {/* Video & Audio Documentation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-gold" />
                  <span>{locale === 'ckb' ? 'بەستەری ڤیدیۆی فێرکاری (YouTube / MP4)' : 'Video Tutorial Link (YouTube Embed)'}</span>
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-gold" />
                  <span>{locale === 'ckb' ? 'ماوەی ڕێبەری دەنگی (Audio Guide Duration)' : 'Audio Narration Duration'}</span>
                </label>
                <input
                  type="text"
                  value={formData.audioDuration}
                  onChange={(e) => setFormData({ ...formData, audioDuration: e.target.value })}
                  placeholder="e.g. 2:45 Min"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold font-mono"
                />
              </div>
            </div>

            {/* Gallery Images */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-gold" />
                <span>{locale === 'ckb' ? 'وێنەکانی گەلەری (بەستەر بە هەر دێڕێک)' : 'Studio Multi-Angle Gallery (One URL per line)'}</span>
              </label>
              <textarea
                rows={3}
                value={formData.galleryImagesText}
                onChange={(e) => setFormData({ ...formData, galleryImagesText: e.target.value })}
                placeholder="https://images.unsplash.com/...\nhttps://images.unsplash.com/..."
                className="w-full p-3 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold font-mono"
              />
            </div>
          </div>

          {/* Section 4: Cross-Linked Masterworks */}
          <div className="p-6 rounded-3xl bg-obsidian-surface/80 border border-museum-border flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-parchment-pure flex items-center gap-2">
                <Layers className="w-4 h-4 text-gold" />
                <span>{locale === 'ckb' ? 'شاكارە پەیوەندیدارەکان' : 'Linked Fine Arts Masterworks'}</span>
              </h3>
              <p className="text-xs text-museum-secondary">
                {locale === 'ckb' 
                  ? 'ئەو بەرهەمانە دیاری بکە کە ئەم کەرەستەیەیان تێدا بەکارهاتووە بۆ دروستکردنی پەیوەندی هاوبەش' 
                  : 'Tag artworks created using this instrument to establish reciprocal atelier provenance'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {artworks.map((art) => {
                const isSelected = formData.usedInArtworkSlugs.includes(art.slug);
                return (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => handleArtworkToggle(art.slug)}
                    className={`p-2.5 rounded-2xl border text-start flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-gold/15 border-gold shadow-gold-glow'
                        : 'bg-black/40 border-museum-border hover:border-gold/30'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-obsidian-elevated">
                      <SafeImage src={art.imageUrl} alt={art.title.en} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-gold-light' : 'text-parchment'}`}>
                        {art?.title?.[locale] || art?.title?.ckb || art?.title?.en || ''}
                      </span>
                      <span className="text-[10px] text-museum-caption truncate">
                        {art?.artist?.[locale] || art?.artist?.ckb || art?.artist?.en || ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-museum-divider">
            <Link
              href="/admin?tab=tools"
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment text-xs font-bold transition-colors"
            >
              {locale === 'ckb' ? 'پاشگەزبوونەوە' : 'Cancel'}
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (locale === 'ckb' ? 'پاشەکەوت دەکرێت...' : 'Saving Changes...')
                  : (locale === 'ckb' ? 'پاشەکەوتکردنی گۆڕانکارییەکان' : 'Save Tool Modifications')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </AdminAuthGuard>
  );
}
