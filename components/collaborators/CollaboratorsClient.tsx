'use client';

import React, { useState, useMemo } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { Collaborator, CollaborationType } from '@/types/collaborators';
import { 
  Users, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Image as ImageIcon, 
  ArrowUpRight, 
  Globe, 
  Award,
  ChevronRight,
  Eye,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

export function CollaboratorsClient() {
  const { collaborators } = useArchive();
  const { locale, isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | CollaborationType>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const filteredCollaborators = useMemo(() => {
    if (activeFilter === 'all') return collaborators;
    return collaborators.filter((c) => c.collaborationType === activeFilter);
  }, [collaborators, activeFilter]);

  const filterTabs = [
    { key: 'all', label: { ckb: 'هەموو هاوبەشییەکان', ar: 'جميع المشاركات', en: 'All Collaborations' } },
    { key: 'masterclass', label: { ckb: 'ماستەرکلاس', ar: 'ماستركلاس', en: 'Masterclasses' } },
    { key: 'workshop', label: { ckb: 'وۆرکشۆپ', ar: 'ورش عمل', en: 'Workshops' } },
    { key: 'residency', label: { ckb: 'ئیقامەی هونەری', ar: 'إقامات فنية', en: 'Residencies' } },
    { key: 'biennial', label: { ckb: 'بیناڵی و مۆزەخانە', ar: 'بيناليات', en: 'Biennials' } },
  ];

  return (
    <div className="flex flex-col gap-12 sm:gap-16 w-full pb-32 safe-bottom">
      {/* Header Banner */}
      <section className="relative pt-6 sm:pt-10 flex flex-col items-center text-center max-w-4xl mx-auto px-2 sm:px-4 overflow-visible">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold-dark dark:text-gold-light text-xs font-medium tracking-wide mb-3 sm:mb-4 shadow-gold-glow">
          <Globe className="w-3.5 h-3.5 text-gold shrink-0" />
          <span>
            {locale === 'ckb'
              ? 'هونەرمەندانی میوان و هاوبەشە ئەکادیمییەکان'
              : locale === 'ar'
              ? 'الفنانون الزائرون والشراكات الأكاديمية'
              : 'Visiting Artists & Cultural Collaborators'}
          </span>
        </div>

        {/* Title Container with aggressive top breathing room for Kurdish ascenders & diacritics */}
        <div className="pt-5 sm:pt-6 w-full overflow-visible">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-stone-900 dark:text-parchment-pure leading-[1.85] sm:leading-[1.5] text-balance overflow-visible pt-1 font-serif">
            {locale === 'ckb'
              ? 'پردی دیالۆگی هونەری و هاوبەشییەکان'
              : locale === 'ar'
              ? 'جسور الحوار الفني والتبادل الإبداعي'
              : 'Artistic Dialogues & Global Residencies'}
          </h1>
        </div>

        <p className="mt-2 sm:mt-4 text-xs sm:text-base text-stone-600 dark:text-museum-secondary max-w-2xl leading-relaxed text-balance">
          {locale === 'ckb'
            ? 'تۆماری مێژوویی ئەو شێوەکار، پەیکەرساز، توێژەر و مامۆستا نێودەوڵەتییانەی کە ماستەرکلاس، ئیقامەی هونەری و پڕۆژەی هاوبەشیان لەگەڵ قوتابیانی پەیمانگەی چەمچەماڵ ئەنجامداوە.'
            : locale === 'ar'
            ? 'توثيق تاريخي لرواد الفن التشكيلي والأساتذة الزائرين الذين أقاموا ورش عمل وإقامات فنية مشتركة في رحاب معهد جمجمال.'
            : 'An archival directory commemorating international master artists, scholars, and residency mentors who have engaged in creative exchange with Chamchamal students.'}
        </p>

        {/* Filter Tab Pills */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 sm:pb-0 scrollbar-none no-scrollbar max-w-full">
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.key;
            const label = tab.label[locale] || tab.label.ckb;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gold text-stone-950 shadow-gold-glow font-bold'
                    : 'bg-stone-100 dark:bg-obsidian-surface border border-stone-200 dark:border-museum-border text-stone-600 dark:text-museum-secondary hover:text-stone-900 dark:hover:text-parchment'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Collaborators Timeline / Card Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredCollaborators.map((collaborator, idx) => (
          <motion.div
            key={collaborator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="group rounded-3xl bg-white dark:bg-obsidian-surface/80 border border-stone-200/80 dark:border-museum-border hover:border-gold/50 dark:hover:border-gold/50 transition-all duration-300 shadow-sm dark:shadow-art-card p-6 sm:p-8 flex flex-col justify-between gap-6 overflow-hidden relative"
          >
            {/* Top Card Bar: Avatar & Titles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-gold/40 shadow-art-card">
                  <SafeImage
                    src={collaborator.avatarUrl}
                    alt={collaborator.name.en}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex flex-col text-start">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gold/15 text-gold border border-gold/30">
                      {collaborator.collaborationTypeLabel[locale] || collaborator.collaborationTypeLabel.ckb}
                    </span>
                    <span className="text-xs text-museum-secondary font-mono">
                      {collaborator.collaborationYear}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-bold text-parchment-pure font-serif mt-1 group-hover:text-gold-light transition-colors">
                    {collaborator.name[locale] || collaborator.name.ckb}
                  </h3>
                  <span className="text-xs text-museum-secondary">
                    {collaborator.artistTitle[locale] || collaborator.artistTitle.ckb}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[11px] text-museum-caption self-start sm:self-auto">
                <MapPin className="w-3 h-3 text-gold" />
                <span>{collaborator.country[locale] || collaborator.country.ckb}</span>
              </div>
            </div>

            {/* Biography & Curatorial Summary */}
            <div className="flex flex-col gap-3 text-xs leading-relaxed text-start">
              <p className="text-parchment-muted">
                {collaborator.bio[locale] || collaborator.bio.ckb}
              </p>

              <div className="p-4 rounded-2xl bg-black/40 border border-museum-border/60 text-museum-secondary">
                <span className="text-gold font-semibold block mb-1 text-[11px] uppercase tracking-wider font-mono">
                  {locale === 'ckb' ? 'دەستکەوتی هاوبەشی لە پەیمانگە:' : 'Collaboration Dossier:'}
                </span>
                <p>
                  {collaborator.curatorialSummary[locale] || collaborator.curatorialSummary.ckb}
                </p>
              </div>
            </div>

            {/* Workshop Photo Thumbnails */}
            {collaborator.galleryPhotos && collaborator.galleryPhotos.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-museum-divider">
                <span className="text-[10px] text-museum-caption uppercase font-mono">
                  {locale === 'ckb' ? 'وێنەی دۆکیومێنتاریی وۆرکشۆپ' : 'Archival Workshop Photography'}
                </span>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {collaborator.galleryPhotos.map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={() => setSelectedPhoto(photo)}
                      className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-museum-border hover:border-gold/50 cursor-pointer group/img"
                    >
                      <SafeImage
                        src={photo}
                        alt={`Workshop ${pIdx + 1}`}
                        fill
                        className="object-cover group-hover/img:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-gold" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </section>

      {/* Lightbox Modal for Workshop Photo */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              className="relative max-w-4xl max-h-[85vh] w-full h-full rounded-3xl overflow-hidden border border-museum-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SafeImage
                src={selectedPhoto}
                alt="Workshop Enlarged"
                fill
                className="object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 end-4 p-2 rounded-full bg-black/70 text-parchment hover:text-gold border border-white/10"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
