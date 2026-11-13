'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';
import { Artwork, getArtworkDepartment, getArtworkDepartmentLabel } from '@/data/artworks';
import { STUDENTS_DATA } from '@/data/students';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { resolveMediaUrl } from '@/lib/mediaStorage';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { ModelViewer3D } from './ModelViewer3D';
import { ParallaxArtworkViewer } from './ParallaxArtworkViewer';
import { AudioGuidePlayer } from './AudioGuidePlayer';
import { 
  ArrowLeft, 
  ArrowRight, 
  Box, 
  Layers, 
  MapPin, 
  QrCode, 
  Share2, 
  Sparkles, 
  Wrench, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  X, 
  Printer, 
  ArrowUpRight,
  Video,
  FileText,
  Download,
  Eye,
  BookOpen,
  Check,
  Maximize2
} from 'lucide-react';

interface ArtworkDetailClientProps {
  artwork: Artwork;
}

export function ArtworkDetailClient({ artwork: initialArtwork }: ArtworkDetailClientProps) {
  const { locale, isRTL } = useLanguage();
  const { artworks, tools, students, isHydrated } = useArchive();

  // Find latest version from ArchiveContext if edited/updated
  const artwork = artworks.find((a) => a.slug === initialArtwork.slug || a.id === initialArtwork.id) || initialArtwork;

  // Resolve associated student artist profile & avatar
  const matchingStudent = (students || []).find(
    (s) => s.id === artwork?.artistId || s.slug === artwork?.artistId || (s.fullName?.en && artwork?.artist?.en && s.fullName.en.toLowerCase() === artwork.artist.en.toLowerCase())
  ) || STUDENTS_DATA.find(
    (s) => s.id === artwork?.artistId || s.slug === artwork?.artistId || (s.fullName?.en && artwork?.artist?.en && s.fullName.en.toLowerCase() === artwork.artist.en.toLowerCase())
  );

  const studentSlug = matchingStudent?.slug || matchingStudent?.id || artwork?.artistId;
  const studentAvatarUrl = matchingStudent?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';

  const isNotFound = isHydrated && initialArtwork.id.startsWith('temp-') && !artworks.some((a) => a.slug === initialArtwork.slug);

  // Resolved Media URLs (Handles IDB/Blob/Data URLs safely)
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string>(artwork?.imageUrl || '');
  const [resolvedModelUrl, setResolvedModelUrl] = useState<string>(artwork?.modelUrl || '');
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string>(artwork?.audioUrl || '');
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string>(artwork?.videoUrl || '');
  const [resolvedPdfUrl, setResolvedPdfUrl] = useState<string>(artwork?.curatorialPdfUrl || '');

  // Active Stage Mode: 3D vs. 2.5D Parallax Canvas
  const [stageMode, setStageMode] = useState<'3d' | 'parallax'>(artwork?.has3DModel ? '3d' : 'parallax');
  const [showPlaqueModal, setShowPlaqueModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEssayExpanded, setIsEssayExpanded] = useState(false);

  useEffect(() => {
    let active = true;
    if (artwork?.imageUrl) {
      resolveMediaUrl(artwork.imageUrl).then((url) => active && setResolvedImageUrl(url));
    }
    if (artwork?.modelUrl) {
      resolveMediaUrl(artwork.modelUrl).then((url) => active && setResolvedModelUrl(url));
    }
    if (artwork?.audioUrl) {
      resolveMediaUrl(artwork.audioUrl).then((url) => active && setResolvedAudioUrl(url));
    }
    if (artwork?.videoUrl) {
      resolveMediaUrl(artwork.videoUrl).then((url) => active && setResolvedVideoUrl(url));
    }
    if (artwork?.curatorialPdfUrl) {
      resolveMediaUrl(artwork.curatorialPdfUrl).then((url) => active && setResolvedPdfUrl(url));
    }
    return () => {
      active = false;
    };
  }, [artwork]);

  // Localized Strings with defensive optional chaining
  const title = artwork?.title?.[locale] || artwork?.title?.ckb || artwork?.title?.en || '';
  const artist = artwork?.artist?.[locale] || artwork?.artist?.ckb || artwork?.artist?.en || '';
  const artistBio = artwork?.artistBio?.[locale] || artwork?.artistBio?.ckb || artwork?.artistBio?.en || '';
  const department = getArtworkDepartmentLabel(artwork?.departmentLabel || artwork?.department, locale);
  const medium = artwork?.medium?.[locale] || artwork?.medium?.ckb || artwork?.medium?.en || '';
  const description = artwork?.description?.[locale] || artwork?.description?.ckb || artwork?.description?.en || '';
  const locationInInstitute = artwork?.locationInInstitute?.[locale] || artwork?.locationInInstitute?.ckb || artwork?.locationInInstitute?.en || '';

  const curatorialEssay = artwork?.curatorialEssay
    ? (artwork.curatorialEssay?.[locale] || artwork.curatorialEssay?.ckb || artwork.curatorialEssay?.en || '')
    : '';

  const videoTitle = artwork?.videoTitle
    ? (artwork.videoTitle?.[locale] || artwork.videoTitle?.ckb || artwork.videoTitle?.en || '')
    : (locale === 'ckb' ? 'شیکاری بەرهەم و قۆناغەکانی دروستکردن' : 'Creation & Atelier Documentary');

  // Matching Tools from Archive
  const matchingTools = tools.filter((tool) =>
    (artwork.toolSlugs || []).includes(tool.slug)
  );

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isVideoYoutube = resolvedVideoUrl.includes('youtube.com') || resolvedVideoUrl.includes('youtu.be');

  if (isNotFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 p-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2 max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-parchment-pure">
            {locale === 'ckb' ? 'شاکارەکە لە ئەرشیفدا نەدۆزرایەوە' : 'Masterwork Not Found'}
          </h2>
          <p className="text-xs text-museum-secondary">
            {locale === 'ckb'
              ? 'ئەم بەرهەمە لە تۆماری گشتیی پەیمانگەی چەمچەماڵدا بەردەست نییە.'
              : 'This work is not cataloged in the Institute permanent archive.'}
          </p>
        </div>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-gold text-obsidian font-bold text-xs shadow-gold-glow hover:opacity-90"
        >
          {locale === 'ckb' ? 'گەڕانەوە بۆ پێشانگا' : 'Return to Gallery'}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 sm:gap-14 w-full pb-32 safe-bottom">
      {/* Archival Breadcrumb & Navigation Bar */}
      <nav
        aria-label="Breadcrumb Navigation"
        className="flex items-center justify-between border-b border-museum-divider pb-4 pt-2 print:hidden"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs font-medium text-museum-secondary hover:text-gold transition-colors"
        >
          {isRTL ? (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          ) : (
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          )}
          <span>{locale === 'ckb' ? 'گەڕانەوە بۆ پێشانگا' : locale === 'ar' ? 'العودة للمعرض' : 'Back to Gallery'}</span>
        </Link>

        {/* Archival Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-museum-secondary font-mono">
          <Link href="/" className="hover:text-parchment transition-colors">
            {locale === 'ckb' ? 'پێشانگا' : locale === 'ar' ? 'المعرض' : 'Archive'}
          </Link>
          <span>/</span>
          <span className="text-museum-caption">{department}</span>
          <span>/</span>
          <span className="text-gold truncate max-w-[200px]">{title}</span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPlaqueModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-obsidian-surface hover:bg-obsidian-elevated border border-gold/30 text-gold-light text-xs font-medium transition-all shadow-glass-pill"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {locale === 'ckb' ? 'پلاتی فەرمی QR' : locale === 'ar' ? 'لوحة QR الرسمية' : 'Physical QR Plaque'}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-obsidian-surface hover:bg-obsidian-elevated border border-museum-border text-parchment-muted hover:text-parchment text-xs font-medium transition-all"
            title="Share Dossier"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {copied
                ? (locale === 'ckb' ? 'کۆپی کرا' : 'Copied')
                : (locale === 'ckb' ? 'هاوبەشکردن' : 'Share')}
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Exhibition Stage: 3D Model Viewer or 2.5D Parallax Canvas */}
      <section className="w-full flex flex-col gap-3">
        {/* Stage Toggle if 3D model is present */}
        {artwork.has3DModel && resolvedModelUrl && (
          <div className="flex items-center justify-between border-b border-museum-border/40 pb-2.5 print:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStageMode('3d')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  stageMode === '3d'
                    ? 'bg-gold text-obsidian shadow-gold-glow'
                    : 'text-museum-secondary hover:text-parchment bg-white/5'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'سکانی ۳D و AR' : '3D & AR Inspection'}</span>
              </button>

              <button
                onClick={() => setStageMode('parallax')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  stageMode === 'parallax'
                    ? 'bg-gold text-obsidian shadow-gold-glow'
                    : 'text-museum-secondary hover:text-parchment bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'کانڤاسی ۲.٥D قووڵایی' : '2.5D Parallax View'}</span>
              </button>
            </div>

            <span className="text-[11px] text-museum-caption font-mono hidden sm:inline">
              WebGL Photogrammetric Stage
            </span>
          </div>
        )}

        {/* Dynamic Stage Render */}
        <div className="w-full">
          {stageMode === '3d' && artwork.has3DModel && resolvedModelUrl ? (
            <ModelViewer3D
              modelUrl={resolvedModelUrl}
              posterUrl={resolvedImageUrl}
              title={title}
              vertices={artwork.modelVertices}
              polygons={artwork.modelPolygons}
            />
          ) : (
            <ParallaxArtworkViewer
              imageUrl={resolvedImageUrl}
              title={title}
              artist={artist}
              medium={medium}
              dimensions={artwork.dimensions}
            />
          )}
        </div>
      </section>

      {/* Curatorial Audio Guide Player (If audioUrl is provided or default commentary is active) */}
      {(resolvedAudioUrl || artwork.audioDurationSeconds) && (
        <section className="w-full print:hidden">
          <AudioGuidePlayer
            artistName={artist}
            artworkTitle={title}
            audioDurationSeconds={artwork.audioDurationSeconds || 145}
            audioUrl={resolvedAudioUrl || undefined}
          />
        </section>
      )}

      {/* Video Documentary Section (Modular: Only rendered if videoUrl is present) */}
      {resolvedVideoUrl && (
        <section className="w-full flex flex-col gap-3 print:hidden">
          <div className="flex items-center gap-2 border-b border-museum-divider pb-2.5">
            <Video className="w-4 h-4 text-gold" />
            <h3 className="text-xs font-bold text-parchment uppercase tracking-wider font-serif">
              {locale === 'ckb' ? 'بەڵگەنامەی ڤیدیۆیی و قۆناغەکانی کارکردن' : 'Curatorial Video Documentary'}
            </h3>
          </div>

          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black/80 border border-museum-border shadow-art-card">
            {isVideoYoutube ? (
              <iframe
                src={resolvedVideoUrl}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                controls
                src={resolvedVideoUrl}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </section>
      )}

      {/* Curatorial Editorial Dossier & Provenance */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
        {/* Main Dossier: Column 1 & 2 */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Title & Classification Banner */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-gold/15 text-gold border border-gold/30">
                {department}
              </span>
              <span className="text-xs text-museum-secondary font-mono">
                {artwork.physicalPlaqueCode}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-parchment-pure leading-tight font-serif">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-museum-secondary mt-1">
              <span className="text-parchment font-medium">{medium}</span>
              {artwork.dimensions && (
                <>
                  <span>•</span>
                  <span className="font-mono">{artwork.dimensions}</span>
                </>
              )}
              <span>•</span>
              <span className="font-mono text-gold">{artwork.year}</span>
            </div>
          </div>

          {/* Curatorial Short Inscription */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/60 border border-museum-border backdrop-blur-xl">
            <h2 className="text-xs font-semibold text-gold tracking-widest uppercase font-serif mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>
                {locale === 'ckb' ? 'دەقی شیکاریی مۆزەخانەیی' : locale === 'ar' ? 'القراءة النقدية والتوثيق' : 'Curatorial Inscription'}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-parchment-muted leading-relaxed font-normal">
              {description}
            </p>
          </div>

          {/* Long-form Curatorial Essay (Modular: Rendered if provided) */}
          {curatorialEssay && (
            <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/70 border border-gold/30 backdrop-blur-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-museum-divider pb-3">
                <h3 className="text-xs font-bold text-gold tracking-widest uppercase font-serif flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {locale === 'ckb'
                      ? 'وتاری ڕەخنەیی و لێکۆڵینەوەی ئەکادیمی'
                      : locale === 'ar'
                      ? 'الدراسة النقدية والبحث الأكاديمي الموسع'
                      : 'Comprehensive Curatorial Essay'}
                  </span>
                </h3>

                <button
                  onClick={() => setIsEssayExpanded(!isEssayExpanded)}
                  className="text-xs font-mono text-gold hover:underline"
                >
                  {isEssayExpanded
                    ? (locale === 'ckb' ? 'کورتکردنەوە' : 'Collapse')
                    : (locale === 'ckb' ? 'خوێندنەوەی تەواو' : 'Read Full Essay')}
                </button>
              </div>

              <div
                className={`text-sm sm:text-base text-parchment leading-relaxed whitespace-pre-line font-sans transition-all duration-300 ${
                  isEssayExpanded ? 'line-clamp-none' : 'line-clamp-6'
                }`}
              >
                {curatorialEssay}
              </div>
            </div>
          )}

          {/* Curatorial PDF Research Monograph (Modular: Rendered if PDF exists) */}
          {resolvedPdfUrl && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-obsidian-surface to-black/60 border border-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-art-card">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-parchment-pure">
                    {locale === 'ckb'
                      ? 'تێزی لێکۆڵینەوە و پەیپەری زانستیی بەرهەم (PDF)'
                      : 'Academic Research Monograph & Thesis (PDF)'}
                  </h4>
                  <p className="text-[11px] text-museum-secondary mt-0.5">
                    {artwork.curatorialPdfFileName || 'Chamchamal-Academic-Monograph.pdf'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={resolvedPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gold text-obsidian font-bold text-xs flex items-center justify-center gap-2 shadow-gold-glow hover:opacity-95 transition-opacity"
                >
                  <Eye className="w-4 h-4" />
                  <span>{locale === 'ckb' ? 'بینین و خوێندنەوە' : 'Read Monograph'}</span>
                </a>
              </div>
            </div>
          )}

          {/* Connected Atelier Artisan Tools Ribbon (Cross-linked to /tools/[slug]) */}
          {matchingTools.length > 0 && (
            <div className="flex flex-col gap-3 p-6 rounded-3xl bg-obsidian-surface/40 border border-museum-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-parchment">
                  <Wrench className="w-4 h-4 text-gold" />
                  <span>
                    {locale === 'ckb' ? 'کەرەستە و ئامرازەکانی ئاتلیێ' : locale === 'ar' ? 'أدوات ومواد الأتيليه المستخدمة' : 'Atelier Tools & Materials Used'}
                  </span>
                </div>
                <Link href="/tools" className="text-[11px] text-gold hover:underline flex items-center gap-1">
                  <span>{locale === 'ckb' ? 'کەرەستەناسی' : locale === 'ar' ? 'الموسوعة' : 'Instruments Index'}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {matchingTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="group flex items-center gap-3 p-2.5 rounded-2xl bg-obsidian-elevated hover:bg-gold/15 border border-white/5 hover:border-gold/40 transition-all shadow-art-card"
                  >
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-black/60">
                      <SafeImage
                        src={tool.imageUrl}
                        alt={tool.name.en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 text-start">
                      <span className="text-[10px] text-gold font-mono uppercase">
                        {tool?.categoryLabel?.[locale] || tool?.categoryLabel?.ckb || tool?.categoryLabel?.en || ''}
                      </span>
                      <h5 className="text-xs font-bold text-parchment group-hover:text-gold-light truncate transition-colors">
                        {tool?.name?.[locale] || tool?.name?.ckb || tool?.name?.en || ''}
                      </h5>
                      <span className="text-[10px] text-museum-secondary truncate">
                        {tool?.materials?.[locale] || tool?.materials?.ckb || tool?.materials?.en || ''}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gold shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Artist Profile & Institute Provenance Card */}
        <div className="flex flex-col gap-6">
          {/* Artist Moniker Card (Cross-linked to /students/[slug]) */}
          <Link
            href={`/students/${studentSlug}`}
            className="group block focus:outline-none"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="p-6 rounded-3xl bg-obsidian-surface/70 hover:bg-obsidian-surface border border-museum-border hover:border-gold/50 shadow-art-card hover:shadow-gold-glow transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  {/* High-res Profile Picture with Gold Border & Circular Mask */}
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold/40 group-hover:border-gold shadow-[0_0_12px_rgba(212,175,55,0.25)] group-hover:shadow-gold-glow group-hover:scale-105 transition-all duration-300 shrink-0 bg-obsidian-elevated">
                    <SafeImage
                      src={studentAvatarUrl}
                      alt={artist}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-museum-secondary font-serif uppercase tracking-wider">
                      {locale === 'ckb' ? 'هونەرمەند' : locale === 'ar' ? 'الفنان التشكيلي' : 'Artist / Alumnus'}
                    </span>
                    <span className="text-base font-bold text-parchment-pure group-hover:text-gold transition-colors">
                      {artist}
                    </span>
                    {matchingStudent?.department && (
                      <span className="text-[11px] text-museum-caption truncate">
                        {matchingStudent?.department?.[locale] || matchingStudent?.department?.ckb || matchingStudent?.department?.en || ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gold/10 group-hover:bg-gold/25 border border-gold/30 flex items-center justify-center text-gold transition-colors">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gold-light bg-gold/10 px-3 py-1.5 rounded-2xl border border-gold/20 mb-3">
                <GraduationCap className="w-4 h-4 text-gold shrink-0" />
                <span>
                  {locale === 'ckb'
                    ? `خولی دەرچوونی ${artwork.artistGraduationYear} - پەیمانگەی چەمچەماڵ`
                    : locale === 'ar'
                    ? `خريج دفعة ${artwork.artistGraduationYear} - معهد جمجمال`
                    : `Class of ${artwork.artistGraduationYear} • Chamchamal Fine Arts`}
                </span>
              </div>

              <p className="text-xs text-museum-secondary leading-relaxed line-clamp-3">
                {artistBio}
              </p>
            </motion.div>
          </Link>

          {/* Physical Provenance Inscription */}
          <div className="p-6 rounded-3xl bg-obsidian-surface/70 border border-museum-border flex flex-col gap-3">
            <span className="text-xs font-semibold text-gold uppercase tracking-wider font-serif">
              {locale === 'ckb' ? 'شوێنی فیزیکی لە پەیمانگە' : locale === 'ar' ? 'الموقع الفعلي في المعهد' : 'Physical Provenance'}
            </span>
            <div className="flex items-start gap-2.5 text-xs text-parchment">
              <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-medium">{locationInInstitute}</span>
                <span className="text-[11px] font-mono text-museum-caption">
                  {artwork.provenancePedestal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Museum Physical QR Plaque Modal */}
      <AnimatePresence>
        {showPlaqueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlaqueModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#18181f] via-obsidian-surface to-[#101014] border-2 border-gold/50 p-6 sm:p-8 shadow-gold-glow flex flex-col items-center text-center z-10 overflow-hidden"
            >
              <button
                onClick={() => setShowPlaqueModal(false)}
                className="absolute top-4 end-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold mb-3 shadow-inner-gold">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <span className="text-[10px] tracking-widest uppercase font-serif text-gold">
                CHAMCHAMAL FINE ARTS ARCHIVE
              </span>

              <h3 className="text-xl font-bold text-parchment-pure mt-2 font-serif">
                {title}
              </h3>
              <p className="text-xs text-parchment-muted mt-0.5">
                {artist} • {artwork.year}
              </p>

              {/* Hidden high-res canvas for downloading */}
              <div className="hidden">
                <QRCodeCanvas
                  id={`detail-qr-canvas-${artwork.id}`}
                  value={`https://chamchamal-fine-arts-archive.vercel.app/artworks/${artwork.slug}`}
                  size={1024}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Real Scannable High-Res QR Code */}
              <div className="my-5 p-4 rounded-2xl bg-white border border-gold/50 shadow-art-card flex flex-col items-center justify-center">
                <QRCodeSVG
                  value={`https://chamchamal-fine-arts-archive.vercel.app/artworks/${artwork.slug}`}
                  size={160}
                  level="H"
                  includeMargin={true}
                  className="w-36 h-36 sm:w-40 sm:h-40"
                />
                <span className="text-[9px] font-mono text-black font-bold mt-1 uppercase tracking-wider">
                  {artwork.physicalPlaqueCode || `CFA-2026-${getArtworkDepartment(artwork).slice(0, 2).toUpperCase()}-01`}
                </span>
              </div>

              <p className="text-[11px] text-museum-secondary mb-5">
                {locale === 'ckb'
                  ? 'ئەم کۆدە تەنیشت بەرهەمە فیزیکییەکە لە هۆڵی پەیمانگە هەڵواسراوە.'
                  : locale === 'ar'
                  ? 'هذا الرمز معلق بجانب العمل الفني في قاعة معهد الفنون بجمجمال.'
                  : 'This official archival plaque is mounted adjacent to the physical work at the institute.'}
              </p>

              <div className="w-full flex items-center gap-2">
                <button
                  onClick={() => {
                    const canvas = document.getElementById(`detail-qr-canvas-${artwork.id}`) as HTMLCanvasElement;
                    if (!canvas) return;
                    const dataUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = `${artwork.slug}-qr-code.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-parchment font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  title="Download High-Res QR PNG"
                >
                  <Download className="w-4 h-4 text-gold" />
                  <span>{locale === 'ckb' ? 'داگرتنی وێنە (PNG)' : 'Download PNG'}</span>
                </button>

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center justify-center gap-1.5 hover:scale-105 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>
                    {locale === 'ckb' ? 'چاپکردنی پلات' : locale === 'ar' ? 'طباعة اللوحة' : 'Print Plaque'}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
