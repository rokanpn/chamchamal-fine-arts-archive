'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { FileUploadDropzone } from '@/components/admin/FileUploadDropzone';
import { ModelViewer3D } from '@/components/artwork/ModelViewer3D';
import { AtelierTool } from '@/data/tools';
import { ToolIngestionFormData } from '@/types/admin';
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
  Video,
  Headphones,
  BookOpen,
  MapPin,
  ExternalLink,
  Layers,
  SlidersHorizontal
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
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80', // Brushes
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1200&q=80', // Chisel
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80', // Pigments
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80', // Clay
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80', // Atelier oil
  'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?auto=format&fit=crop&w=1200&q=80', // Workshop
];

export default function NewToolIngestionPage() {
  const router = useRouter();
  const { artworks, addTool } = useArchive();
  const { locale, isRTL } = useLanguage();

  const [langTab, setLangTab] = useState<'ckb' | 'ar' | 'en'>('ckb');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdToolSlug, setCreatedToolSlug] = useState<string | null>(null);

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
    materialsCkb: 'داری گوێز، تاڵی دەستکرد، کانزای زێڕین',
    materialsAr: 'خشب الجوز العتيق، ألياف دقيقة، حلقة نحاسية',
    materialsEn: 'Walnut hardwood, synthetic micro-filaments, brass ferrule',
    originCkb: 'کارگەی ئاتلیێی پەیمانگەی چەمچەماڵ',
    originAr: 'ورشة الأتيليه بمعهد جمجمال',
    originEn: 'Chamchamal Atelier Foundry & Crafts Studio',
    glbUrl: PRESET_MODELS[0].url,
    imageUrl: PRESET_IMAGES[0],
    galleryImagesText: `${PRESET_IMAGES[0]}\n${PRESET_IMAGES[1]}\n${PRESET_IMAGES[2]}`,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitleCkb: 'فێرکاری بەکارهێنانی کەرەستەکە لە ئاتلیێدا',
    videoTitleAr: 'ورشة تدريبية لاستخدام الأداة في الأتيليه',
    videoTitleEn: 'Master Atelier Workshop & Tool Handling Demonstration',
    audioDuration: '2:20 Min',
    usageInstructionsCkb: 'فڵچەکە بە گۆشەی ٤٥ پلە بەکاربهێنە بۆ کێشانی هێڵە وردەکان و پڕکردنەوەی پاشخان بە جووڵەی نەرم.',
    usageInstructionsAr: 'استخدم الأداة بزاوية ٤٥ درجة لتحديد التفاصيل الدقيقة وملء المساحات بحركات متناسقة.',
    usageInstructionsEn: 'Hold at a 45-degree angle to lay down precise linework and fluid wash coverage with controlled wrist pressure.',
    proTipsCkbText: 'پێش بەکارهێنان کەرەستەکە بە ڕۆنی سروشتی نەرم بکەرەوە\nهەرگیز ڕاستەوخۆ بەر تیشکی خۆر وشکی مەکەرەوە\nدوای تەواوبوون بە سابوونی زەیتی زەیتوون بیشۆ',
    proTipsArText: 'قم بترطيب الألياف بالزيوت الطبيعية قبل البدء\nتجنب التجفيف المباشر تحت أشعة الشمس\nنظف الأداة فور الانتهاء بصابون زيت الزيتون الطبيعي',
    proTipsEnText: 'Condition the fibers with organic walnut oil prior to use\nNever heat-dry or leave exposed to direct southern sunlight\nCleanse immediately using mild olive-oil bar soap after sessions',
    usedInArtworkSlugs: [artworks[0]?.slug || 'autumn-whispers-goptapa'],
  });

  const handleArtworkToggle = (slug: string) => {
    setFormData((prev) => {
      const exists = prev.usedInArtworkSlugs.includes(slug);
      return {
        ...prev,
        usedInArtworkSlugs: exists
          ? prev.usedInArtworkSlugs.filter((s) => s !== slug)
          : [...prev.usedInArtworkSlugs, slug],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedSlug = (formData.nameEn || formData.nameCkb)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);

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

    const newTool: AtelierTool = {
      id: `tool-${Date.now()}`,
      slug: generatedSlug,
      name: {
        ckb: formData.nameCkb || 'ئامرازی نوێی ئاتلیێ',
        ar: formData.nameAr || formData.nameCkb || 'أداة أكاديمية جديدة',
        en: formData.nameEn || 'New Atelier Instrument',
      },
      category: formData.category,
      categoryLabel: categoryLabels[formData.category] || categoryLabels.painting,
      description: {
        ckb: formData.descriptionCkb || 'کەرەستەیەکی پێشکەوتووی خوێندنی هونەری لە پەیمانگەی چەمچەماڵ.',
        ar: formData.descriptionAr || formData.descriptionCkb || 'أداة فنية وأكاديمية متقدمة في معهد جمجمال.',
        en: formData.descriptionEn || 'Advanced atelier studio instrument curated for Chamchamal Fine Arts Institute.',
      },
      historicalSignificance: {
        ckb: formData.historicalSignificanceCkb || 'بەشێکە لە کەلەپوور و مێژووی دەستڕەنگینی هونەرمەندانی پەیمانگە.',
        ar: formData.historicalSignificanceAr || formData.historicalSignificanceCkb || 'جزء من إرث وتاريخ الحرفيين والفنانين بالمعهد.',
        en: formData.historicalSignificanceEn || 'Integral part of the material history and artistic lineage at the Institute.',
      },
      bestPractices: {
        ckb: formData.bestPracticesCkb || 'ڕاگرتنی لە شوێنی وشک و پاککردنەوەی بەردەوام بە ماددەی بێ ترشەڵۆک.',
        ar: formData.bestPracticesAr || formData.bestPracticesCkb || 'الحفظ في بيئة جافة والتنظيف الدوري بمواد خالية من الأحماض.',
        en: formData.bestPracticesEn || 'Store in humidity-controlled environment and clean with archival pH-neutral solvents.',
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
      audioDuration: formData.audioDuration || '2:15 Min',
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

    addTool(newTool);
    setCreatedToolSlug(generatedSlug);
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
                ? 'تۆمارکردنی کەرەستە و ئامرازی نوێ لە ئەرشیف'
                : locale === 'ar'
                ? 'فهرسة أداة أو خامة أكاديمية جديدة'
                : 'Ingest New Atelier Instrument'}
            </h1>
            <p className="text-xs text-museum-secondary">
              {locale === 'ckb'
                ? 'زیادکردنی کەرەستەی هونەری، مۆدێلی ۳D، فێرکاری ڤیدیۆیی و ڕێنمایی دەنگی'
                : 'Register atelier instruments with 3D photogrammetry, video workshops, and curatorial audio commentary.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-gold/15 text-gold border border-gold/30">
              Curatorial Atelier Ingestion
            </span>
          </div>
        </div>

        {/* Success Alert Banner */}
        {createdToolSlug && (
          <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-200">
                  {locale === 'ckb' ? 'ئامرازەکە بە سەرکەوتوویی تۆمارکرا!' : 'Instrument cataloged successfully!'}
                </h4>
                <p className="text-xs text-emerald-400/80">
                  {locale === 'ckb'
                    ? 'ئێستا لە موسوعەی کەرەستەناسی و مۆدێلی ۳D بەردەستە.'
                    : 'Now accessible in the live encyclopedia with complete 3D & multimedia dossier.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/tools/${createdToolSlug}`}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-colors"
              >
                <span>{locale === 'ckb' ? 'بینینی لاپەڕەی ئامرازەکە' : 'View Live Instrument'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setCreatedToolSlug(null)}
                className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
              >
                {locale === 'ckb' ? 'تۆمارکردنی یەکێکی تر' : 'Catalog Another'}
              </button>
            </div>
          </div>
        )}

        {/* Main Ingestion Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1: Classification & Category */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-5">
            <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif">
              <Layers className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'پۆلێنکردنی کەرەستە' : 'Instrument Category & Discipline'}</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'painting', labelCkb: 'شێوەکاری و ڕەنگ', labelEn: 'Painting & Pigments' },
                { id: 'sculpture', labelCkb: 'پەیکەرسازی و بەرد', labelEn: 'Sculpture & Stone' },
                { id: 'ceramics', labelCkb: 'سیرامیک و ئاگر', labelEn: 'Ceramics & Kiln' },
                { id: 'calligraphy', labelCkb: 'خۆشنووسی و مەرەکەب', labelEn: 'Calligraphy & Inks' },
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category: cat.id as any })}
                  className={`p-3.5 rounded-2xl border text-start flex flex-col gap-1 transition-all ${
                    formData.category === cat.id
                      ? 'bg-gold/15 border-gold text-parchment shadow-gold-glow'
                      : 'bg-black/40 border-museum-border text-museum-secondary hover:border-gold/30'
                  }`}
                >
                  <span className="text-xs font-bold text-parchment">
                    {locale === 'ckb' ? cat.labelCkb : cat.labelEn}
                  </span>
                  <span className="text-[10px] text-gold/80 font-mono capitalize">
                    {cat.id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Trilingual Curatorial Metadata */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-museum-divider pb-4">
              <div>
                <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>
                    {locale === 'ckb' ? 'زانیاری و ناسنامەی سیانی (کوردی، عەرەبی، ئینگلیزی)' : 'Trilingual Archival Dossier'}
                  </span>
                </h2>
                <p className="text-[11px] text-museum-caption mt-0.5">
                  Select language tab to provide synchronized descriptions across all 3 official archive languages.
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

            {/* Kurdish Fields */}
            {langTab === 'ckb' && (
              <div className="flex flex-col gap-4 text-start" dir="rtl">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    ناوی ئامرازەکە بە کوردی سۆرانی *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameCkb}
                    onChange={(e) => setFormData({ ...formData, nameCkb: e.target.value })}
                    placeholder="نموونە: فڵچەی فیلبێرتی مووی ئەسپ"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    پێناسە و کورتەی کەرەستەکە *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.descriptionCkb}
                    onChange={(e) => setFormData({ ...formData, descriptionCkb: e.target.value })}
                    placeholder="کورتەیەک لەسەر تایبەتمەندی فڵچە یان ئامرازەکە..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      پێکهاتە و کەرەستە (Materials)
                    </label>
                    <input
                      type="text"
                      value={formData.materialsCkb}
                      onChange={(e) => setFormData({ ...formData, materialsCkb: e.target.value })}
                      placeholder="نموونە: داری گوێز، تاڵی دەستکرد"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      سەرچاوە و کارگە (Origin / Forge)
                    </label>
                    <input
                      type="text"
                      value={formData.originCkb}
                      onChange={(e) => setFormData({ ...formData, originCkb: e.target.value })}
                      placeholder="نموونە: کارگەی پەیمانگەی چەمچەماڵ"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    پێگەی مێژوویی و کەلەپووری (Historical Significance)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.historicalSignificanceCkb}
                    onChange={(e) => setFormData({ ...formData, historicalSignificanceCkb: e.target.value })}
                    placeholder="مێژووی بەکارهێنان لە هونەری کوردیدا..."
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    ڕێنمایی بەکارهێنان و ڕێکاری فێرکاری (Usage Instructions)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.usageInstructionsCkb}
                    onChange={(e) => setFormData({ ...formData, usageInstructionsCkb: e.target.value })}
                    placeholder="هەنگاوەکانی بەکارهێنان لە هۆڵەکانی وانەوتندا..."
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    فێڵ و نهێنییە هونەرییەکانی مامۆستایان (Pro-Tips - دێڕ بە دێڕ بنووسە)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.proTipsCkbText}
                    onChange={(e) => setFormData({ ...formData, proTipsCkbText: e.target.value })}
                    placeholder="هەر ئامۆژگارییەک لە دێڕێکی جیاواز..."
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}

            {/* Arabic Fields */}
            {langTab === 'ar' && (
              <div className="flex flex-col gap-4 text-start" dir="rtl">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    اسم الأداة بالعربية *
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="مثال: فرشاة فيلبرت من شعر الحصان الطبيعي"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    الوصف الأكاديمي بالعربية *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    placeholder="شرح موجز لخصائص الأداة واستخداماتها..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      المواد والمكونات
                    </label>
                    <input
                      type="text"
                      value={formData.materialsAr}
                      onChange={(e) => setFormData({ ...formData, materialsAr: e.target.value })}
                      placeholder="مثال: خشب الجوز، شعيرات دقيقة"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      المصدر والورشة المصنعة
                    </label>
                    <input
                      type="text"
                      value={formData.originAr}
                      onChange={(e) => setFormData({ ...formData, originAr: e.target.value })}
                      placeholder="مثال: ورشة معهد جمجمال"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    الأهمية التاريخية والتراثية
                  </label>
                  <textarea
                    rows={2}
                    value={formData.historicalSignificanceAr}
                    onChange={(e) => setFormData({ ...formData, historicalSignificanceAr: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    إرشادات وخطوات الاستخدام
                  </label>
                  <textarea
                    rows={2}
                    value={formData.usageInstructionsAr}
                    onChange={(e) => setFormData({ ...formData, usageInstructionsAr: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    نصائح وأسرار كبار الأساتذة (سطر لكل نصيحة)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.proTipsArText}
                    onChange={(e) => setFormData({ ...formData, proTipsArText: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}

            {/* English Fields */}
            {langTab === 'en' && (
              <div className="flex flex-col gap-4 text-start" dir="ltr">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Instrument Title in English *
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Master Horsehair Filbert Brush No. 8"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Curatorial Summary & Technical Overview *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Academic curatorial summary of instrument traits and workshop application..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      Materials & Composition
                    </label>
                    <input
                      type="text"
                      value={formData.materialsEn}
                      onChange={(e) => setFormData({ ...formData, materialsEn: e.target.value })}
                      placeholder="e.g. Walnut hardwood, micro-filaments, brass ferrule"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      Provenance & Forge
                    </label>
                    <input
                      type="text"
                      value={formData.originEn}
                      onChange={(e) => setFormData({ ...formData, originEn: e.target.value })}
                      placeholder="e.g. Chamchamal Atelier Foundry"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Historical & Curatorial Significance
                  </label>
                  <textarea
                    rows={2}
                    value={formData.historicalSignificanceEn}
                    onChange={(e) => setFormData({ ...formData, historicalSignificanceEn: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Step-by-Step Pedagogical Workflow
                  </label>
                  <textarea
                    rows={2}
                    value={formData.usageInstructionsEn}
                    onChange={(e) => setFormData({ ...formData, usageInstructionsEn: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Master Artisan Pro-Tips (One tip per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.proTipsEnText}
                    onChange={(e) => setFormData({ ...formData, proTipsEnText: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: 3D Photogrammetry GLB & Live Test Stage */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-museum-divider pb-3">
              <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif">
                <Box className="w-4 h-4 text-gold" />
                <span>{locale === 'ckb' ? 'مۆدێلی ۳D و تاقیکردنەوەی ڕاستەوخۆ' : '3D Photogrammetry Mesh & Live Stage Test'}</span>
              </h2>
              <span className="text-[11px] text-museum-caption font-mono">
                WebGL / WebXR AR Compatible
              </span>
            </div>

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

            {/* Live 3D Preview Stage */}
            {formData.glbUrl && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-xs font-semibold text-gold font-serif flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{locale === 'ckb' ? 'تاقیکردنەوەی ڕاستەوخۆی سووڕانەوە و AR' : 'Live Interactive 3D Rotation Stage'}</span>
                </span>
                <div className="w-full rounded-2xl overflow-hidden border border-museum-border">
                  <ModelViewer3D
                    modelUrl={formData.glbUrl}
                    posterUrl={formData.imageUrl}
                    title={formData.nameEn || 'Test Stage'}
                    vertices="120,000 Vertices"
                    polygons="240,000 Triangles"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Imagery, Studio Gallery & Video */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <ImageIcon className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'وێنەی سەرەکی، گەلەری ستۆدیۆ و ڤیدیۆ' : 'Media Suite: Cover, Gallery & Video Workshop'}</span>
            </h2>

            {/* Cover Image Upload Dropzone */}
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

            {/* Gallery Images Textarea */}
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-medium text-parchment">
                {locale === 'ckb' ? 'لینکی وێنەکانی گەلەری ستۆدیۆ (هەر وێنەیەک لە دێڕێک)' : 'Studio Gallery Image URLs (One URL per line)'}
              </label>
              <textarea
                rows={3}
                value={formData.galleryImagesText}
                onChange={(e) => setFormData({ ...formData, galleryImagesText: e.target.value })}
                placeholder="https://images.unsplash.com/...\nhttps://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment font-mono outline-none focus:border-gold"
              />
            </div>

            {/* Workshop Video & Audio Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'لینکی ڤیدیۆی فێرکاری (YouTube Embed URL)' : 'Workshop Demonstration Video URL'}
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'ماوەی ڕێنمایی دەنگی (Audio Guide Duration)' : 'Curator Audio Commentary Duration'}
                </label>
                <input
                  type="text"
                  value={formData.audioDuration}
                  onChange={(e) => setFormData({ ...formData, audioDuration: e.target.value })}
                  placeholder="2:25 Min"
                  className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Cross-linking with Institute Artworks */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-4">
            <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>
                {locale === 'ckb' ? 'بەستنەوە بە شاکارەکانی پەیمانگە' : 'Cross-link with Institute Masterworks'}
              </span>
            </h2>
            <p className="text-xs text-museum-secondary">
              {locale === 'ckb'
                ? 'دیاریبکە کام لە بەرهەمەکان بەم کەرەستەیە کێشراون یان دروستکراون:'
                : 'Select all artworks in the permanent collection created or shaped using this tool:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
              {artworks.map((art) => {
                const isSelected = formData.usedInArtworkSlugs.includes(art.slug);
                return (
                  <div
                    key={art.id}
                    onClick={() => handleArtworkToggle(art.slug)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gold/15 border-gold text-parchment'
                        : 'bg-black/30 border-museum-border text-museum-secondary hover:border-gold/30'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-obsidian-elevated">
                      <Image src={art.imageUrl} alt={art.title.en} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 text-start">
                      <span className="text-xs font-bold text-parchment truncate">
                        {art?.title?.[locale] || art?.title?.ckb || art?.title?.en || ''}
                      </span>
                      <span className="text-[10px] text-museum-secondary truncate">
                        {art?.artist?.[locale] || art?.artist?.ckb || art?.artist?.en || ''}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="accent-gold w-4 h-4 rounded"
                    />
                  </div>
                );
              })}
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
                  ? (locale === 'ckb' ? 'خەریکی تۆمارکردن...' : 'Ingesting...')
                  : (locale === 'ckb' ? 'تۆمارکردن لە ئەرشیف' : 'Ingest Instrument into Archive')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </AdminAuthGuard>
  );
}
