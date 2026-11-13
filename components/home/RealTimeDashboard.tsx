'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useArchive, DEFAULT_DEPARTMENTS_CONFIG, DepartmentId } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { SafeImage } from '@/components/ui/SafeImage';
import { 
  Palette, 
  Sparkles, 
  Box, 
  Layers, 
  ArrowRight, 
  ArrowLeft
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
  const { artworks, departmentsConfig } = useArchive();
  const { t, locale, isRTL } = useLanguage();

  // 1. Dynamic Metric Computations: Only Artworks, 3D Scans, and strictly 3 Departments
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

  // 2. The 3 Authentic Departments of the Institute:
  //    - شێوەکاری (Painting)
  //    - پەیکەرسازی (Sculpture)
  //    - سیرامیک (Ceramics)
  const departmentData = useMemo(() => {
    const paintingCfg = departmentsConfig?.painting || DEFAULT_DEPARTMENTS_CONFIG.painting;
    const sculptureCfg = departmentsConfig?.sculpture || DEFAULT_DEPARTMENTS_CONFIG.sculpture;
    const ceramicsCfg = departmentsConfig?.ceramics || DEFAULT_DEPARTMENTS_CONFIG.ceramics;

    return [
      {
        id: 'painting' as DepartmentId,
        title: locale === 'ckb' ? 'شێوەکاری' : locale === 'ar' ? 'الفنون التشكيلية' : 'Painting',
        badgeLabel: locale === 'ckb' ? 'بەشی شێوەکاری' : locale === 'ar' ? 'قسم الفنون التشكيلية' : 'Painting Department',
        desc:
          locale === 'ckb'
            ? 'ڕەنگ و هێڵەکان یەکدەگرن بۆ گێڕانەوەی چیرۆکەکان'
            : locale === 'ar'
            ? 'تتحد الألوان والخطوط لسرد أعمق الحكايات'
            : 'Colors and lines unite to tell stories',
        thumbnailUrl: paintingCfg?.coverImage || DEFAULT_DEPARTMENTS_CONFIG.painting.coverImage,
        href: '/artworks?dept=painting',
        icon: Palette,
      },
      {
        id: 'sculpture' as DepartmentId,
        title: locale === 'ckb' ? 'پەیکەرسازی' : locale === 'ar' ? 'النحت والتجسيم' : 'Sculpture',
        badgeLabel: locale === 'ckb' ? 'بەشی پەیکەرسازی' : locale === 'ar' ? 'قسم النحت' : 'Sculpture Department',
        desc:
          locale === 'ckb'
            ? 'بەرجەستەکردنی هەستەکان لەناو بەرد و ماددەکاندا'
            : locale === 'ar'
            ? 'تجسيد المشاعر الإنسانية داخل الحجر والمواد الصامتة'
            : 'Embodying feelings in stone and materials',
        thumbnailUrl: sculptureCfg?.coverImage || DEFAULT_DEPARTMENTS_CONFIG.sculpture.coverImage,
        href: '/artworks?dept=sculpture',
        icon: Box,
      },
      {
        id: 'ceramics' as DepartmentId,
        title: locale === 'ckb' ? 'سیرامیک' : locale === 'ar' ? 'الخزف والسيراميك' : 'Ceramics',
        badgeLabel: locale === 'ckb' ? 'بەشی سیرامیک' : locale === 'ar' ? 'قسم الخزف والسيراميك' : 'Ceramics Department',
        desc:
          locale === 'ckb'
            ? 'هونەری گۆڕینی قوڕ بۆ شاکاری نەمر بە یارمەتی ئاگر'
            : locale === 'ar'
            ? 'فن تحويل الطين الخام إلى تحف خالدة برفق ألسنة اللهب'
            : 'The art of turning clay into immortal masterpieces with fire',
        thumbnailUrl: ceramicsCfg?.coverImage || DEFAULT_DEPARTMENTS_CONFIG.ceramics.coverImage,
        href: '/artworks?dept=ceramics',
        icon: Sparkles,
      },
    ];
  }, [departmentsConfig, locale]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-12 sm:mt-16 flex flex-col gap-10 select-none">
      {/* ========================================================
          1. Continuous Organic Glass Capsule: Live Stats Banner
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

        {/* 3 Real-time Metrics: Total Artworks, 3D Scans, Academic Departments */}
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

          {/* Metric 3: Academic Departments (Strictly 3) */}
          <div className="flex flex-col items-center md:items-end text-center md:text-end px-1 sm:px-2 md:px-6">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-dark dark:text-gold/80 shrink-0" />
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
          2. Modern & Soft Departments Section (Minimalist & Elegant)
         ======================================================== */}
      <div className="flex flex-col gap-6 sm:gap-8 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1 sm:px-2">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Layers className="w-3.5 h-3.5 text-gold" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-gold">
                {locale === 'ckb' ? 'پۆلێنکاری و بەشە مێژووییەکان' : locale === 'ar' ? 'التصنيف الأكاديمي والأقسام' : 'Academic Classifications'}
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-parchment-pure font-serif mt-1">
              {locale === 'ckb' ? 'بەشە فەرمییەکانی پەیمانگە' : locale === 'ar' ? 'الأقسام الرسمية للمعهد' : 'Official Institute Departments'}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-museum-secondary font-sans max-w-md">
            {locale === 'ckb'
              ? 'سێ بەشە ئەکادیمییە سەرەکییەکەی پەیمانگەی هونەرە جوانەکانی چەمچەماڵ؛ مەڵبەندی ڕەسەنی داهێنان و پاراستنی کەلەپوور.'
              : locale === 'ar'
              ? 'الأقسام الأكاديمية الثلاثة الرئيسية لمعهد الفنون الجميلة في جمجمال؛ منارة الإبداع والأصالة.'
              : 'The three core academic departments of Chamchamal Fine Arts Institute; preserving cultural heritage through fine creation.'}
          </p>
        </div>

        {/* 3 Modern Soft Department Cards (3-column layout on both mobile and desktop) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-5 md:gap-6 lg:gap-8">
          {departmentData.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Link
                  href={dept.href}
                  className="group relative flex flex-col h-full rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/90 dark:bg-stone-900/50 border border-stone-200/80 dark:border-white/10 hover:border-gold/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden backdrop-blur-xl"
                >
                  {/* Subtle Top Gold Highlight */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent group-hover:via-gold transition-all duration-300" />

                  {/* High Quality Image Container with Gentle Gradient */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-stone-100 dark:bg-black/60">
                    <DepartmentThumbnailImage
                      src={dept.thumbnailUrl}
                      alt={dept.title}
                    />
                    {/* Soft smooth gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/25 to-transparent" />

                    {/* Minimalist Floating Badge */}
                    <div className="absolute top-1.5 start-1.5 sm:top-4 sm:start-4 z-10 flex items-center gap-1 sm:gap-1.5 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/65 border border-white/15 text-gold text-xs font-medium backdrop-blur-md shadow-sm">
                      <Icon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gold shrink-0" />
                      <span className="hidden sm:inline text-[11px] font-semibold">{dept.badgeLabel}</span>
                    </div>
                  </div>

                  {/* Clean Content Body */}
                  <div className="p-2.5 sm:p-5 md:p-6 flex flex-col justify-between flex-1 gap-2 sm:gap-4">
                    <div>
                      <h4 className="text-xs sm:text-lg md:text-2xl font-bold text-stone-900 dark:text-parchment-pure font-serif group-hover:text-gold-dark dark:group-hover:text-gold transition-colors truncate sm:line-clamp-none">
                        {dept.title}
                      </h4>

                      <p className="hidden sm:block mt-1 sm:mt-2 text-xs sm:text-sm text-stone-600 dark:text-museum-secondary leading-relaxed line-clamp-2 md:line-clamp-3">
                        {dept.desc}
                      </p>
                    </div>

                    {/* Soft Minimalist Explore Action */}
                    <div className="pt-2 sm:pt-3 border-t border-stone-200/70 dark:border-white/[0.06]">
                      <div className="inline-flex items-center justify-between w-full px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-full bg-stone-100 dark:bg-white/[0.04] group-hover:bg-gold/15 border border-stone-200/80 dark:border-white/10 group-hover:border-gold/40 text-stone-800 dark:text-parchment-pure group-hover:text-gold-dark dark:group-hover:text-gold text-[9.5px] sm:text-xs font-semibold transition-all duration-300 gap-1">
                        <span className="truncate">{t.dashboard.exploreDept}</span>
                        {isRTL ? (
                          <ArrowLeft className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
                        ) : (
                          <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
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
