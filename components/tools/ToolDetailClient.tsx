'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';
import { AtelierTool } from '@/data/tools';
import { getArtworkDepartmentLabel } from '@/data/artworks';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { ModelViewer3D } from '@/components/artwork/ModelViewer3D';
import { AudioGuidePlayer } from '@/components/artwork/AudioGuidePlayer';
import { 
  ArrowLeft, 
  ArrowRight, 
  Wrench, 
  Box, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  ArrowUpRight,
  Video,
  Headphones,
  Image as ImageIcon,
  Printer,
  Share2,
  Check,
  Layers,
  Info
} from 'lucide-react';

interface ToolDetailClientProps {
  tool: AtelierTool;
}

export function ToolDetailClient({ tool: initialTool }: ToolDetailClientProps) {
  const { locale, isRTL } = useLanguage();
  const { tools, artworks: allArtworks } = useArchive();

  // Prefer dynamic state from ArchiveContext if user edited/updated in admin
  const tool = tools.find((t) => t.slug === initialTool.slug || t.id === initialTool.id) || initialTool;

  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'video' | 'gallery'>('3d');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const name = tool?.name?.[locale] || tool?.name?.ckb || tool?.name?.en || '';
  const categoryLabel = tool?.categoryLabel?.[locale] || tool?.categoryLabel?.ckb || tool?.categoryLabel?.en || '';
  const description = tool?.description?.[locale] || tool?.description?.ckb || tool?.description?.en || '';
  const history = tool?.historicalSignificance?.[locale] || tool?.historicalSignificance?.ckb || tool?.historicalSignificance?.en || '';
  const bestPractices = tool?.bestPractices?.[locale] || tool?.bestPractices?.ckb || tool?.bestPractices?.en || '';
  const materials = tool?.materials?.[locale] || tool?.materials?.ckb || tool?.materials?.en || '';
  const origin = tool?.origin?.[locale] || tool?.origin?.ckb || tool?.origin?.en || '';
  const usageInstructions = tool?.usageInstructions ? (tool?.usageInstructions?.[locale] || tool?.usageInstructions?.ckb || tool?.usageInstructions?.en || '') : '';
  const proTips = tool?.proTips ? (tool?.proTips?.[locale] || tool?.proTips?.ckb || tool?.proTips?.en || []) : [];
  const videoTitle = tool?.videoTitle ? (tool?.videoTitle?.[locale] || tool?.videoTitle?.ckb || tool?.videoTitle?.en || '') : '';

  // Matching artworks
  const relatedArtworks = allArtworks.filter((art) =>
    tool.usedInArtworkSlugs.includes(art.slug)
  );

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-14 w-full pb-32 safe-bottom">
      {/* Breadcrumb Navigation & Top Action Bar */}
      <nav
        aria-label="Breadcrumb Navigation"
        className="flex items-center justify-between border-b border-stone-200/80 dark:border-museum-divider pb-4 pt-2 print:hidden"
      >
        <Link
          href="/tools"
          className="group inline-flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-museum-secondary hover:text-gold transition-colors"
        >
          {isRTL ? (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          ) : (
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          )}
          <span>
            {locale === 'ckb'
              ? 'گەڕانەوە بۆ کەرەستەناسی'
              : locale === 'ar'
              ? 'العودة لموسوعة الأدوات'
              : 'Back to Instruments'}
          </span>
        </Link>

        {/* Action Buttons: Share & Print Spec */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-obsidian-surface border border-stone-200 dark:border-museum-border text-xs text-stone-800 dark:text-parchment hover:border-gold/50 transition-all"
            title="Share instrument link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  {locale === 'ckb' ? 'کۆپی کرا' : 'Copied'}
                </span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-gold" />
                <span className="hidden sm:inline">
                  {locale === 'ckb' ? 'هاوبەشکردن' : locale === 'ar' ? 'مشاركة' : 'Share'}
                </span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-obsidian-surface border border-stone-200 dark:border-museum-border text-xs text-stone-800 dark:text-parchment hover:border-gold/50 transition-all"
            title="Print Atelier Technical Spec Sheet"
          >
            <Printer className="w-3.5 h-3.5 text-gold" />
            <span className="hidden sm:inline">
              {locale === 'ckb' ? 'چاپی دۆسیەی هونەری' : locale === 'ar' ? 'طباعة الوثيقة' : 'Print Atelier Spec'}
            </span>
          </button>
        </div>
      </nav>

      {/* Printable Atelier Header (Visible only when printed) */}
      <div className="hidden print:block border-b-2 border-black pb-4 mb-4 text-black">
        <h1 className="text-2xl font-bold font-serif">{name}</h1>
        <p className="text-sm italic">
          Chamchamal Fine Arts Institute Digital Archive • Atelier Instruments Division
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Category: {categoryLabel} | Origin: {origin} | Materials: {materials}
        </p>
      </div>

      {/* Interactive Multimedia Stage Switcher */}
      <section className="w-full flex flex-col gap-4 print:hidden">
        {/* Stage Media Selector Tabs */}
        <div className="flex items-center justify-between border-b border-museum-border/60 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMediaTab('3d')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                activeMediaTab === '3d'
                  ? 'bg-gold text-obsidian shadow-gold-glow'
                  : 'text-museum-secondary hover:text-parchment bg-white/5'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'پشکنینی ۳D و AR' : locale === 'ar' ? 'فحص ثلاثي الأبعاد AR' : '3D & AR Stage'}</span>
            </button>

            {tool.videoUrl && (
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeMediaTab === 'video'
                    ? 'bg-gold text-obsidian shadow-gold-glow'
                    : 'text-museum-secondary hover:text-parchment bg-white/5'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'فێرکاری ڤیدیۆیی' : locale === 'ar' ? 'ورشة فيديو' : 'Video Workshop'}</span>
              </button>
            )}

            {tool.galleryImages && tool.galleryImages.length > 0 && (
              <button
                onClick={() => setActiveMediaTab('gallery')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeMediaTab === 'gallery'
                    ? 'bg-gold text-obsidian shadow-gold-glow'
                    : 'text-museum-secondary hover:text-parchment bg-white/5'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'وێنەی ستۆدیۆ' : locale === 'ar' ? 'صور الأتيليه' : 'Studio Photos'}</span>
              </button>
            )}
          </div>

          <span className="text-[11px] text-museum-caption font-mono hidden md:inline">
            Interactive Atelier Stage
          </span>
        </div>

        {/* Tab 1: 3D Model Stage */}
        {activeMediaTab === '3d' && (
          <div className="w-full">
            <ModelViewer3D
              modelUrl={tool.glbUrl}
              posterUrl={tool.imageUrl}
              title={name}
              vertices="140,000 Vertices"
              polygons="280,000 Triangles"
            />
          </div>
        )}

        {/* Tab 2: Workshop Video Embed */}
        {activeMediaTab === 'video' && tool.videoUrl && (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black/80 border border-museum-border shadow-art-card flex flex-col items-center justify-center">
            <iframe
              src={tool.videoUrl}
              title={videoTitle || name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        )}

        {/* Tab 3: Studio Gallery */}
        {activeMediaTab === 'gallery' && tool.galleryImages && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tool.galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGalleryImg(imgUrl)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-obsidian-elevated border border-museum-border hover:border-gold/50 cursor-pointer transition-all shadow-art-card"
                >
                  <SafeImage
                    src={imgUrl}
                    alt={`${name} angle ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-black/70 text-gold text-xs font-mono border border-gold/40">
                      {locale === 'ckb' ? 'گەورەکردن' : 'Enlarge'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Gallery Lightbox Modal */}
            <AnimatePresence>
              {selectedGalleryImg && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                  onClick={() => setSelectedGalleryImg(null)}
                >
                  <div
                    className="relative max-w-4xl max-h-[85vh] w-full h-full rounded-2xl overflow-hidden border border-museum-border shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SafeImage
                      src={selectedGalleryImg}
                      alt={name}
                      fill
                      className="object-contain"
                    />
                    <button
                      onClick={() => setSelectedGalleryImg(null)}
                      className="absolute top-4 end-4 p-2 rounded-full bg-black/70 text-parchment hover:text-gold border border-white/10"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Audio Commentary Player Section */}
      <section className="w-full print:hidden">
        <AudioGuidePlayer
          artistName={
            locale === 'ckb'
              ? 'مامۆستایانی ئاتلیێی چەمچەماڵ'
              : locale === 'ar'
              ? 'أساتذة محترف معهد جمجمال'
              : 'Atelier Faculty & Master Artisans'
          }
          artworkTitle={`${name} (${categoryLabel})`}
          audioDurationSeconds={135}
        />
      </section>

      {/* Editorial Instrument Anatomy Dossier */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
        {/* Main Content: 2 Columns */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-gold/15 text-gold border border-gold/30 w-fit">
              {categoryLabel}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 dark:text-parchment-pure leading-tight font-serif">
              {name}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-parchment-muted leading-relaxed">
              {description}
            </p>
          </div>

          {/* Step-by-Step Usage Instructions */}
          {usageInstructions && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-obsidian-surface/60 border border-stone-200/80 dark:border-museum-border backdrop-blur-xl flex flex-col gap-3 shadow-sm dark:shadow-none">
              <h2 className="text-xs font-semibold text-gold tracking-widest uppercase font-serif flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                <span>
                  {locale === 'ckb'
                    ? 'ڕێکاری فێرکاری و هەنگاوەکانی کارکردن'
                    : locale === 'ar'
                    ? 'خطوات ومراحل العمل الأكاديمي'
                    : 'Pedagogical Workflow & Application Method'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-museum-secondary leading-relaxed">
                {usageInstructions}
              </p>
            </div>
          )}

          {/* Master Artisan Pro-Tips */}
          {proTips && proTips.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-obsidian-surface/60 border border-stone-200/80 dark:border-museum-border backdrop-blur-xl flex flex-col gap-4 shadow-sm dark:shadow-none">
              <h2 className="text-xs font-semibold text-gold tracking-widest uppercase font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>
                  {locale === 'ckb'
                    ? 'ڕاسپاردە و فێڵە هونەرییەکانی مامۆستایانی ئاتلیێ'
                    : locale === 'ar'
                    ? 'نصائح وأسرار كبار أساتذة الأتيليه'
                    : 'Master Artisan Studio Pro-Tips'}
                </span>
              </h2>
              <div className="flex flex-col gap-2.5">
                {proTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-museum-border/60 text-xs text-stone-800 dark:text-parchment"
                  >
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5 font-bold">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Significance Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-obsidian-surface/60 border border-stone-200/80 dark:border-museum-border backdrop-blur-xl flex flex-col gap-3 shadow-sm dark:shadow-none">
            <h2 className="text-xs font-semibold text-gold tracking-widest uppercase font-serif flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>
                {locale === 'ckb'
                  ? 'پێگەی مێژوویی و کەلەپووری'
                  : locale === 'ar'
                  ? 'الأهمية التاريخية والتراثية'
                  : 'Historical & Curatorial Significance'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-museum-secondary leading-relaxed">
              {history}
            </p>
          </div>

          {/* Workshop Best Practices Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-obsidian-surface/60 border border-stone-200/80 dark:border-museum-border backdrop-blur-xl flex flex-col gap-3 shadow-sm dark:shadow-none">
            <h2 className="text-xs font-semibold text-gold tracking-widest uppercase font-serif flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {locale === 'ckb'
                  ? 'ڕێنمایی بەکارهێنان و پاراستنی ئەکادیمی'
                  : locale === 'ar'
                  ? 'إرشادات الاستخدام والصيانة الأكاديمية'
                  : 'Recommended Studio Practices & Maintenance'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-museum-secondary leading-relaxed">
              {bestPractices}
            </p>
          </div>

          {/* Masterworks Created With This Tool */}
          {relatedArtworks.length > 0 && (
            <div className="flex flex-col gap-4 print:hidden">
              <h2 className="text-sm font-bold text-stone-900 dark:text-parchment-pure flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>
                  {locale === 'ckb'
                    ? 'شاکارەکانی پەیمانگە کە بەم ئامرازە خوڵقێنراون'
                    : locale === 'ar'
                    ? 'روائع تم إبداعها بهذه الأداة في المعهد'
                    : 'Masterworks Produced With This Instrument'}
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArtworks.map((art) => (
                  <Link
                    key={art.id}
                    href={`/artworks/${art.slug}`}
                    className="group relative flex items-center gap-3.5 p-3 rounded-2xl bg-white dark:bg-obsidian-surface/80 border border-stone-200 dark:border-museum-border hover:border-gold/50 transition-all shadow-sm dark:shadow-art-card overflow-hidden"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 dark:bg-obsidian-elevated shrink-0">
                      <SafeImage
                        src={art.imageUrl}
                        alt={art?.title?.[locale] || art?.title?.ckb || art?.title?.en || ''}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[10px] text-gold uppercase tracking-wider">
                        {getArtworkDepartmentLabel(art.departmentLabel || art.department, locale)}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-parchment group-hover:text-gold-dark dark:group-hover:text-gold-light truncate transition-colors">
                        {art?.title?.[locale] || art?.title?.ckb || art?.title?.en || ''}
                      </h4>
                      <span className="text-[11px] text-stone-500 dark:text-museum-secondary truncate">
                        {art?.artist?.[locale] || art?.artist?.ckb || art?.artist?.en || ''} • {art.year}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gold shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Tool Specifications & Provenance */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-obsidian-surface/70 border border-stone-200/80 dark:border-museum-border shadow-sm dark:shadow-art-card flex flex-col gap-4">
            <span className="text-xs font-semibold text-gold uppercase tracking-wider font-serif">
              {locale === 'ckb'
                ? 'تایبەتمەندییە فیزیکییەکان'
                : locale === 'ar'
                ? 'المواصفات الفنية والمواد'
                : 'Technical Specifications'}
            </span>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <span className="text-stone-500 dark:text-museum-caption block text-[10px] uppercase">
                  {locale === 'ckb' ? 'پێکهاتە و کەرەستە' : locale === 'ar' ? 'المواد والمكونات' : 'Materials & Composition'}
                </span>
                <span className="text-stone-900 dark:text-parchment font-medium mt-0.5 block">
                  {materials}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-museum-divider">
                <span className="text-stone-500 dark:text-museum-caption block text-[10px] uppercase">
                  {locale === 'ckb' ? 'سەرچاوە و دروستکەر' : locale === 'ar' ? 'المصدر والمنشأ' : 'Provenance & Forge'}
                </span>
                <span className="text-stone-900 dark:text-parchment font-medium mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>{origin}</span>
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-museum-divider">
                <span className="text-stone-500 dark:text-museum-caption block text-[10px] uppercase">
                  {locale === 'ckb' ? 'بەشی پەیوەندیدار' : locale === 'ar' ? 'القسم الأكاديمي' : 'Relevant Academic Dept.'}
                </span>
                <span className="text-gold font-medium mt-0.5 block">
                  {categoryLabel}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-museum-divider">
                <span className="text-stone-500 dark:text-museum-caption block text-[10px] uppercase">
                  {locale === 'ckb' ? 'تۆماری دەنگی' : locale === 'ar' ? 'التعليق الصوتي' : 'Audio Commentary'}
                </span>
                <span className="text-stone-900 dark:text-parchment font-mono mt-0.5 block">
                  {tool.audioDuration || '2:15 Min'} • Fine Arts Faculty
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-museum-divider">
                <span className="text-stone-500 dark:text-museum-caption block text-[10px] uppercase">
                  {locale === 'ckb' ? 'کۆدی دیجیتاڵی' : locale === 'ar' ? 'المعرف الرقمي' : 'Digital ID'}
                </span>
                <span className="text-stone-500 dark:text-museum-secondary font-mono text-[10px] mt-0.5 block truncate">
                  {tool.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
