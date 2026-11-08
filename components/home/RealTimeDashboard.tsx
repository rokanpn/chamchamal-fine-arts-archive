'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useArchive, DEFAULT_DEPARTMENTS_CONFIG, DepartmentId } from '@/context/ArchiveContext';
import { getArtworkDepartmentLabel } from '@/data/artworks';
import { useLanguage } from '@/context/LanguageContext';
import { SafeImage } from '@/components/ui/SafeImage';
import { 
  Palette, 
  Music, 
  Sparkles, 
  Box, 
  GraduationCap, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  Volume2,
  Theater
} from 'lucide-react';

/**
 * Robust image component that resolves idb:// and remote media URLs without crashing Next.js
 */
function DepartmentThumbnailImage({ src, alt }: { src: string; alt: string }) {
  return (
    <SafeImage
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      fallbackSrc="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80"
    />
  );
}

/**
 * Format western numbers into Kurdish/Arabic eastern numerals based on locale
 */
export function formatLocalizedNumber(num: number | string, locale: 'ckb' | 'ar' | 'en'): string {
  const str = String(num);
  if (locale === 'en') return str;
  const easternDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/\d/g, (d) => easternDigits[parseInt(d, 10)]);
}

/**
 * Lightweight 60fps Count-Up Hook with easeOutExpo
 */
function useCountUp(end: number, duration: number = 1100): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(ease * end));
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [end, duration]);

  return count;
}

export function RealTimeDashboard() {
  const { artworks, students, departmentsConfig } = useArchive();
  const { t, locale, isRTL } = useLanguage();

  // 1. Dynamic Metric Computations from real ArchiveContext data
  const totalArtworksCount = artworks.length;
  const total3DCount = useMemo(() => {
    return artworks.filter((item) => item.has3DModel || Boolean(item.modelUrl)).length;
  }, [artworks]);

  // Strictly 3 Academic and Historic Departments
  const departmentsCount = 3;

  // Animated Count-Up Values
  const animatedArtworks = useCountUp(totalArtworksCount, 1200);
  const animated3D = useCountUp(total3DCount, 900);
  const animatedDepts = useCountUp(departmentsCount, 700);

  // 2. Dynamic Grouping by the 3 Authentic Departments:
  //    - شێوەکاری (Painting / Fine Arts)
  //    - مۆسیقا (Music)
  //    - شانۆ (Theater)
  const departmentData = useMemo(() => {
    // A. شێوەکاری (Painting / Fine Arts)
    const paintingArtworks = artworks.filter((a) =>
      ['painting', 'sculpture', 'ceramics', 'design'].includes(a?.category) ||
      /شێوەکاری|پەیکەرسازی|سیرامیک|دیزاین/i.test(getArtworkDepartmentLabel(a?.departmentLabel || a?.department, 'ckb'))
    );
    const paintingStudents = students.filter(
      (s) =>
        /شێوەکاری|پەیکەرسازی|سیرامیک|دیزاین|painting|sculpture|ceramics|design/i.test(
          s?.department?.ckb || s?.department?.en || ''
        ) || !/مۆسیقا|شانۆ/i.test(s?.department?.ckb || s?.department?.en || '')
    );
    const paintingCfg = departmentsConfig?.painting || DEFAULT_DEPARTMENTS_CONFIG.painting;

    // B. مۆسیقا (Music)
    const musicArtworks = artworks.filter(
      (a) =>
        a?.category === 'music' ||
        /مۆسیقا|دەنگ|تار|music/i.test(getArtworkDepartmentLabel(a?.departmentLabel || a?.department, 'ckb')) ||
        Boolean(a?.audioUrl)
    );
    const musicStudents = students.filter((s) => /مۆسیقا|music/i.test(s?.department?.ckb || s?.department?.en || ''));
    const musicCfg = departmentsConfig?.music || DEFAULT_DEPARTMENTS_CONFIG.music;

    // C. شانۆ (Theater)
    const theaterArtworks = artworks.filter(
      (a) =>
        a?.category === 'theater' ||
        /شانۆ|دراما|theater|theatre/i.test(getArtworkDepartmentLabel(a?.departmentLabel || a?.department, 'ckb'))
    );
    const theaterStudents = students.filter((s) =>
      /شانۆ|theater|theatre/i.test(s?.department?.ckb || s?.department?.en || '')
    );
    const theaterCfg = departmentsConfig?.theater || DEFAULT_DEPARTMENTS_CONFIG.theater;

    return [
      {
        id: 'painting' as DepartmentId,
        title: paintingCfg?.title || t.dashboard.paintingTitle,
        subtitle: paintingCfg?.subtitle || (locale === 'ckb' ? 'شێوەکاری و هونەری بینراو' : locale === 'ar' ? 'الفنون التشكيلية والبصرية' : 'Fine Arts & Painting'),
        desc: paintingCfg?.description || t.dashboard.paintingDesc,
        worksCount: paintingArtworks.length,
        studentsCount: paintingStudents.length,
        thumbnailUrl: paintingCfg?.coverImage || DEFAULT_DEPARTMENTS_CONFIG.painting.coverImage,
        href: '/artworks?dept=painting',
        icon: Palette,
        badgeLabel: paintingCfg?.badgeText || (locale === 'ckb' ? 'شاکارەکانی کانڤاس و بەرد' : locale === 'ar' ? 'روائع اللوحات والمجسمات' : 'Canvas & Sculpture'),
      },
      {
        id: 'music' as DepartmentId,
        title: musicCfg?.title || t.dashboard.musicTitle,
        subtitle: musicCfg?.subtitle || (locale === 'ckb' ? 'ئاواز و ژەنینی ئامێرەکان' : locale === 'ar' ? 'المقامات والآلات الموسيقية' : 'Music & Sound Arts'),
        desc: musicCfg?.description || t.dashboard.musicDesc,
        worksCount: musicArtworks.length,
        studentsCount: musicStudents.length,
        thumbnailUrl: musicCfg?.coverImage || DEFAULT_DEPARTMENTS_CONFIG.music.coverImage,
        href: '/artworks?dept=music',
        icon: Music,
        badgeLabel: musicCfg?.badgeText || (locale === 'ckb' ? 'ئاوازی تاری گەرمیان' : locale === 'ar' ? 'تسجيلات التار الحي' : 'Garmian Master Audio'),
        hasAudioBadge: true,
      },
      {
        id: 'theater' as DepartmentId,
        title: theaterCfg?.title || t.dashboard.theaterTitle,
        subtitle: theaterCfg?.subtitle || (locale === 'ckb' ? 'نواندن، دراما و سینۆگرافیا' : locale === 'ar' ? 'الفنون الدرامية والمسرحية' : 'Dramatic Arts & Theater'),
        desc: theaterCfg?.description || t.dashboard.theaterDesc,
        worksCount: theaterArtworks.length,
        studentsCount: theaterStudents.length,
        thumbnailUrl: theaterCfg?.coverImage || DEFAULT_DEPARTMENTS_CONFIG.theater.coverImage,
        href: '/artworks?dept=theater',
        icon: Theater,
        badgeLabel: theaterCfg?.badgeText || (locale === 'ckb' ? 'نمایشی زیندووی سەکۆ' : locale === 'ar' ? 'العروض الحية والسينوغرافيا' : 'Live Stage Production'),
      },
    ];
  }, [artworks, students, departmentsConfig, t, locale]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-12 sm:mt-16 flex flex-col gap-10 select-none">
      {/* ========================================================
          1. Continuous Organic Glass Capsule (No Generic Boxes)
         ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] backdrop-blur-3xl bg-white/80 dark:bg-white/[0.015] border border-stone-200/80 dark:border-t dark:border-x dark:border-gold/15 dark:border-b dark:border-gold/[0.05] shadow-sm dark:shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.08)] p-4 sm:p-8 md:p-12 overflow-hidden flex flex-col gap-4 sm:gap-8"
      >
        {/* Soft Ambient Radial Glow Behind Capsule */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-52 bg-gold/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Live Status Sub-Header Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 sm:pb-6 border-b border-stone-200/80 dark:border-white/[0.06] relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="p-1.5 sm:p-2 rounded-xl bg-gold/10 text-gold-dark dark:text-gold border border-gold/20 shadow-gold-glow-sm shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse text-gold" />
            </span>
            <div className="flex flex-col text-start min-w-0">
              <span className="text-[11px] sm:text-xs font-mono font-bold text-gold-dark dark:text-gold uppercase tracking-wider truncate">
                {t.dashboard.academicAnalytics}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-500 dark:text-white/50 font-sans truncate hidden xs:inline sm:inline">
                {t.dashboard.realtimeBoardSubtitle}
              </span>
            </div>
          </div>

          {/* Real-Time Live Status Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-mono shadow-sm backdrop-blur-md shrink-0">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">
              {t.dashboard.liveBadge}
            </span>
          </div>
        </div>

        {/* 3 Real-time Metrics Flow Separated by Vertical Gold Gradient Lines */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-0 relative z-10 items-center">
          {/* Metric 1: Total Artworks */}
          <div className="flex flex-col items-center md:items-start text-center md:text-start px-1 sm:px-2 md:px-6">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-dark dark:text-gold/80 shrink-0" />
              <span className="text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-white/60 truncate">
                {t.dashboard.totalArtworksPill}
              </span>
            </div>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-2xl sm:text-4xl md:text-6xl font-black text-gold-dark dark:text-gold font-serif tracking-tight dark:drop-shadow-[0_0_16px_rgba(212,175,55,0.7)]">
                {formatLocalizedNumber(animatedArtworks, locale)}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-500 dark:text-white/40 font-mono">
                {locale === 'ckb' ? 'بەرهەم' : locale === 'ar' ? 'عمل' : 'Works'}
              </span>
            </div>
            <div className="mt-2 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono text-gold-dark dark:text-gold-light bg-gold/10 border border-gold/25 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span>{t.dashboard.historicalOverlayArtworks}</span>
            </div>
          </div>

          {/* Vertical Separator 1 */}
          <div className="hidden md:block w-[1px] h-20 bg-gradient-to-b from-transparent via-gold/30 to-transparent self-center justify-self-center" />

          {/* Metric 2: 3D Scans */}
          <div className="flex flex-col items-center text-center px-1 sm:px-2 md:px-6">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-dark dark:text-gold/80 animate-pulse shrink-0" />
              <span className="text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-white/60 truncate">
                {t.dashboard.scansPill}
              </span>
            </div>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-2xl sm:text-4xl md:text-6xl font-black text-stone-900 dark:text-parchment-pure font-serif tracking-tight dark:drop-shadow-[0_0_16px_rgba(212,175,55,0.7)]">
                {formatLocalizedNumber(animated3D, locale)}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-500 dark:text-white/40 font-mono">
                {locale === 'ckb' ? 'مۆدێل' : locale === 'ar' ? 'مجسم' : '3D Models'}
              </span>
            </div>
            <div className="mt-2 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono text-gold-dark dark:text-gold-light bg-gold/10 border border-gold/25 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span>{t.dashboard.historicalOverlayScans}</span>
            </div>
          </div>

          {/* Vertical Separator 2 */}
          <div className="hidden md:block w-[1px] h-20 bg-gradient-to-b from-transparent via-gold/30 to-transparent self-center justify-self-center" />

          {/* Metric 3: Academic Departments */}
          <div className="flex flex-col items-center md:items-end text-center md:text-end px-1 sm:px-2 md:px-6">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-dark dark:text-gold/80 shrink-0" />
              <span className="text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-white/60 truncate">
                {t.dashboard.departmentsPill}
              </span>
            </div>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-2xl sm:text-4xl md:text-6xl font-black text-gold-dark dark:text-gold font-serif tracking-tight dark:drop-shadow-[0_0_16px_rgba(212,175,55,0.7)]">
                {formatLocalizedNumber(animatedDepts, locale)}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-500 dark:text-white/40 font-mono">
                {locale === 'ckb' ? 'بەش' : locale === 'ar' ? 'أقسام' : 'Depts'}
              </span>
            </div>
            <div className="mt-2 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono text-gold-dark dark:text-gold-light bg-gold/10 border border-gold/25 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>{t.dashboard.historicalOverlayDepts}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========================================================
          2. Organic Department Showcase (Fluid, Non-Rigid Alignment)
         ======================================================== */}
      <div className="flex flex-col gap-4 sm:gap-6 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-2 px-1 sm:px-2">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Layers className="w-3.5 h-3.5 text-gold" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-gold">
                {locale === 'ckb' ? 'پۆلێنکاری و بەشە مێژووییەکان' : locale === 'ar' ? 'التصنيف الأكاديمي والأقسام' : 'Academic Classifications'}
              </span>
            </div>
            <h4 className="text-lg sm:text-2xl font-bold text-parchment-pure font-serif mt-1">
              {locale === 'ckb' ? 'بەشە فەرمییەکانی پەیمانگە' : locale === 'ar' ? 'الأقسام الرسمية للمعهد' : 'Official Institute Departments'}
            </h4>
          </div>
          <p className="text-[11px] sm:text-xs text-museum-secondary font-sans max-w-md line-clamp-2 sm:line-clamp-none">
            {locale === 'ckb'
              ? 'کلیک لە هەر بەشێک بکە بۆ بینینی هەموو شاکارەکان، بەڵگەنامە دەنگییەکان و دەرچووانی ئەو بەشە.'
              : locale === 'ar'
              ? 'انقر على أي قسم لاستعراض كافة الأعمال والوثائق الصوتية وخريجي المسار.'
              : 'Explore each faculty to browse dedicated artworks, sound recordings, and alumni.'}
          </p>
        </div>

        {/* 3 Department Cards in 2-Column Mobile & 3-Column Desktop Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6">
          {departmentData.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={index === 2 ? 'col-span-2 md:col-span-1' : ''}
              >
                <Link
                  href={dept.href}
                  className="group relative flex flex-col h-full rounded-xl sm:rounded-3xl md:rounded-[2.2rem] bg-white dark:bg-gradient-to-b dark:from-white/[0.025] dark:via-white/[0.01] dark:to-black/60 border border-stone-200/80 dark:border-white/[0.06] hover:border-gold/40 shadow-sm dark:shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-md dark:hover:shadow-gold-glow backdrop-blur-2xl transition-all duration-500 overflow-hidden"
                >
                  {/* Subtle Top Gold Highlight */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent group-hover:via-gold/60 transition-all duration-500" />

                  {/* Thumbnail Image Container */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-black/60">
                    <DepartmentThumbnailImage
                      src={dept.thumbnailUrl}
                      alt={dept.title}
                    />
                    {/* Deep Vignette Fade into Body */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 dark:from-[#09090c] via-transparent dark:via-[#09090c]/40 to-transparent" />

                    {/* Floating Top Badge with Icon */}
                    <div className="absolute top-2 start-2 sm:top-3.5 sm:start-3.5 z-10 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/75 border border-gold/30 text-gold text-[9px] sm:text-xs font-medium backdrop-blur-md shadow-glass-pill max-w-[80%] sm:max-w-none">
                      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold shrink-0" />
                      <span className="text-[9px] sm:text-[11px] font-semibold truncate">{dept.badgeLabel}</span>
                    </div>

                    {/* Music Audio Pulse Indicator if active audio performance */}
                    {dept.hasAudioBadge && (
                      <div className="absolute top-2 end-2 sm:top-3.5 sm:end-3.5 z-10 flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] sm:text-[10px] font-mono backdrop-blur-md">
                        <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 animate-pulse" />
                        <span>AUDIO</span>
                      </div>
                    )}
                  </div>

                  {/* Department Content Body */}
                  <div className="p-2.5 sm:p-5 md:p-6 flex flex-col justify-between flex-1 gap-2 sm:gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                        <span className="text-[9px] sm:text-[11px] font-mono text-gold-dark dark:text-gold-light uppercase tracking-wider truncate">
                          {dept.subtitle}
                        </span>
                        <span className="text-[9px] sm:text-[11px] font-mono text-stone-400 dark:text-white/40 shrink-0">
                          0{index + 1}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-lg md:text-2xl font-bold text-stone-900 dark:text-parchment-pure font-serif mt-0.5 sm:mt-1 group-hover:text-gold-dark dark:group-hover:text-gold transition-colors line-clamp-1">
                        {dept.title}
                      </h4>

                      <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm text-stone-600 dark:text-museum-secondary leading-relaxed line-clamp-2">
                        {dept.desc}
                      </p>
                    </div>

                    {/* Department Metric Badges & Action Link */}
                    <div className="pt-2 sm:pt-4 border-t border-stone-200/80 dark:border-white/[0.06] flex flex-col gap-2 sm:gap-3.5">
                      <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-stone-500 dark:text-museum-caption">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span className="text-gold-dark dark:text-gold font-bold">
                            {formatLocalizedNumber(dept.worksCount, locale)}
                          </span>
                          <span className="text-stone-500 dark:text-white/50">{t.dashboard.worksCount}</span>
                        </div>
                        <span className="text-stone-300 dark:text-white/20">•</span>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span className="text-gold-dark dark:text-gold font-bold">
                            {formatLocalizedNumber(dept.studentsCount, locale)}
                          </span>
                          <span className="text-stone-500 dark:text-white/50">{t.dashboard.alumniCount}</span>
                        </div>
                      </div>

                      {/* Explore Button */}
                      <div className="inline-flex items-center justify-between w-full px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-stone-100 dark:bg-white/[0.03] group-hover:bg-gold/15 border border-stone-200/80 dark:border-white/[0.08] group-hover:border-gold/40 text-stone-800 dark:text-parchment-pure group-hover:text-gold-dark dark:group-hover:text-gold text-[10px] sm:text-xs font-semibold transition-all duration-300">
                        <span>{t.dashboard.exploreDept}</span>
                        {isRTL ? (
                          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
