'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentArtist, STUDENTS_DATA } from '@/data/students';
import { ARTWORKS_DATA } from '@/data/artworks';
import { useLanguage } from '@/context/LanguageContext';
import { 
  GraduationCap, 
  Sparkles, 
  MapPin, 
  ArrowUpRight, 
  Palette, 
  Award,
  Layers 
} from 'lucide-react';

export function StudentsIndexClient() {
  const { locale, isRTL } = useLanguage();
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const departments = useMemo(() => {
    return [
      { key: 'all', label: { ckb: 'هەموو قوتابیان و دەرچووان', ar: 'جميع الطلبة والخريجين', en: 'All Artists & Alumni' } },
      { key: 'painting', label: { ckb: 'شێوەکاری', ar: 'الفن التشكيلي', en: 'Painting' } },
      { key: 'sculpture', label: { ckb: 'پەیکەرسازی', ar: 'النحت', en: 'Sculpture' } },
      { key: 'ceramics', label: { ckb: 'سیرامیک', ar: 'الخزف', en: 'Ceramics' } },
      { key: 'design', label: { ckb: 'دیزاین و چاپ', ar: 'التصميم والطباعة', en: 'Design & Prints' } },
    ];
  }, []);

  const filteredStudents = useMemo(() => {
    if (selectedDept === 'all') return STUDENTS_DATA;
    return STUDENTS_DATA.filter((s) => {
      const deptEn = s.department.en.toLowerCase();
      if (selectedDept === 'painting') return deptEn.includes('painting');
      if (selectedDept === 'sculpture') return deptEn.includes('sculpture');
      if (selectedDept === 'ceramics') return deptEn.includes('ceramics');
      if (selectedDept === 'design') return deptEn.includes('design') || deptEn.includes('print');
      return true;
    });
  }, [selectedDept]);

  return (
    <div className="flex flex-col gap-10 sm:gap-14 w-full pb-32 safe-bottom">
      {/* Header */}
      <section className="relative pt-4 sm:pt-8 flex flex-col items-center text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold-light text-xs font-medium tracking-wide mb-4 shadow-gold-glow">
          <GraduationCap className="w-4 h-4 text-gold" />
          <span>
            {locale === 'ckb'
              ? 'تۆماری خوێندکاران و هونەرمەندانی پەیمانگە'
              : locale === 'ar'
              ? 'دليل طلبة وخريجي معهد الفنون الجميلة'
              : 'Student Artists & Alumni Directory'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-parchment-pure leading-tight">
          {locale === 'ckb'
            ? 'داهێنەرانی پەیمانگەی چەمچەماڵ'
            : locale === 'ar'
            ? 'مبدعو معهد الفنون الجميلة في جمجمال'
            : 'Artists & Creators of Chamchamal'}
        </h1>

        <p className="mt-4 text-sm sm:text-base text-museum-secondary max-w-2xl leading-relaxed">
          {locale === 'ckb'
            ? 'تۆمارێکی زیندووی دەرچووان و قوتابیانی پەیمانگە؛ لەگەڵ دەقی هونەری، ناسنامەی داهێنان، و ئەو بەرهەمانەی کە لە ئەرشیفی دیجیتاڵیدا پارێزراون.'
            : locale === 'ar'
            ? 'سجل حي يضم نخبة خريجي وطلبة المعهد عبر مختلف الدفعات، مع بياناتهم الفنية ومعارض أعمالهم الدائمة.'
            : 'A living curatorial register celebrating the artists, scholars, and sculptors shaping contemporary Kurdish fine arts across all academic cohorts.'}
        </p>

        {/* Department Filters */}
        <div
          role="tablist"
          className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none no-scrollbar max-w-full"
        >
          {departments.map((dept) => {
            const isSelected = selectedDept === dept.key;
            const label = dept.label[locale] || dept.label.ckb;

            return (
              <button
                key={dept.key}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedDept(dept.key)}
                className={`relative px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 select-none flex items-center gap-2 ${
                  isSelected
                    ? 'text-stone-950 font-bold'
                    : 'text-stone-700 dark:text-parchment-muted hover:text-stone-950 dark:hover:text-parchment bg-stone-100 dark:bg-obsidian-surface/60 border border-stone-200 dark:border-museum-border'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-student-dept-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gold via-[#E8C860] to-gold shadow-gold-glow -z-10"
                  />
                )}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Student Cards Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredStudents.map((student, idx) => {
            const name = student.fullName[locale] || student.fullName.ckb;
            const dept = student.department[locale] || student.department.ckb;
            const cohort = student.cohort[locale] || student.cohort.ckb;
            const statement = student.statement[locale] || student.statement.ckb;

            // Student artworks
            const studentArtworks = ARTWORKS_DATA.filter((a) =>
              student.artworkSlugs.includes(a.slug)
            );

            return (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                className="group relative rounded-3xl bg-white dark:bg-obsidian-surface/80 border border-stone-200/80 dark:border-museum-border hover:border-gold/40 shadow-sm dark:shadow-art-card p-6 flex flex-col justify-between overflow-hidden backdrop-blur-xl transition-all duration-300"
              >
                {/* Top Specular Line */}
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                <div className="flex flex-col gap-4">
                  {/* Avatar and Cohort Header */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold/40 shadow-inner-gold group-hover:border-gold transition-colors shrink-0">
                      <SafeImage
                        src={student.avatarUrl}
                        alt={name}
                        fill
                        className="object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-semibold text-gold uppercase tracking-wider truncate">
                        {dept}
                      </span>
                      <Link href={`/students/${student.id}`} className="group-hover:text-gold transition-colors">
                        <h2 className="text-lg font-bold text-parchment-pure truncate">
                          {name}
                        </h2>
                      </Link>
                      <span className="text-xs text-museum-secondary font-mono truncate">
                        {cohort}
                      </span>
                    </div>
                  </div>

                  {/* Curatorial Statement Snippet */}
                  <p className="text-xs text-parchment-muted italic leading-relaxed line-clamp-3 mt-1">
                    &ldquo;{statement}&rdquo;
                  </p>

                  {/* Archived Pieces Thumbnails Preview */}
                  {studentArtworks.length > 0 && (
                    <div className="mt-2 pt-3 border-t border-museum-divider flex flex-col gap-2">
                      <span className="text-[10px] font-medium text-museum-secondary uppercase tracking-wider">
                        {locale === 'ckb'
                          ? `بەرهەمە ئەرشیفکراوەکان (${studentArtworks.length}):`
                          : locale === 'ar'
                          ? `الأعمال المؤرشفة (${studentArtworks.length}):`
                          : `Archived Masterworks (${studentArtworks.length}):`}
                      </span>

                      <div className="flex items-center gap-2">
                        {studentArtworks.map((art) => (
                          <Link
                            key={art.id}
                            href={`/artworks/${art.slug}`}
                            className="group/art relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 hover:border-gold/50 transition-all shrink-0"
                            title={art.title[locale] || art.title.ckb}
                          >
                            <SafeImage
                              src={art.imageUrl}
                              alt={art.title[locale] || art.title.ckb}
                              fill
                              className="object-cover group-hover/art:scale-110 transition-transform"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="pt-6">
                  <Link
                    href={`/students/${student.id}`}
                    className="w-full py-2.5 rounded-full bg-obsidian-elevated/70 hover:bg-gold hover:text-obsidian border border-museum-border hover:border-gold text-parchment text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-glass-pill"
                  >
                    <span>{locale === 'ckb' ? 'بینینی پۆرتفۆلیۆی تەواو' : locale === 'ar' ? 'عرض السيرة الفنية الكاملة' : 'View Complete Portfolio'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
