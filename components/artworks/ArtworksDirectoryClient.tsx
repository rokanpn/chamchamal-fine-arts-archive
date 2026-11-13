'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { Artwork, ArtworkCategory, CATEGORIES, getArtworkDepartment, getArtworkDepartmentLabel } from '@/data/artworks';
import { ArtCard } from '@/components/ui/ArtCard';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Palette, 
  Box, 
  Layers, 
  Search,
  Filter
} from 'lucide-react';

export function ArtworksDirectoryClient() {
  const { artworks } = useArchive();
  const { t, locale, isRTL } = useLanguage();
  const searchParams = useSearchParams();

  // Selected department filter from query param: ?dept=painting | sculpture | ceramics
  const initialDept = searchParams?.get('dept')?.toLowerCase() || 'all';
  const [selectedDept, setSelectedDept] = useState<string>(initialDept);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync if query param changes
  useEffect(() => {
    if (searchParams) {
      const q = searchParams.get('dept')?.toLowerCase();
      if (q) setSelectedDept(q);
    }
  }, [searchParams]);

  // Department Filters List (Strictly 3 Academic Departments)
  const departmentsList = useMemo(() => [
    {
      id: 'all',
      label: {
        ckb: 'هەموو بەشەکان',
        ar: 'جميع الأقسام',
        en: 'All Departments',
      },
      icon: Layers,
    },
    {
      id: 'painting',
      label: {
        ckb: 'شێوەکاری',
        ar: 'الفنون التشكيلية',
        en: 'Painting',
      },
      icon: Palette,
    },
    {
      id: 'sculpture',
      label: {
        ckb: 'پەیکەرسازی',
        ar: 'النحت والتجسيم',
        en: 'Sculpture',
      },
      icon: Box,
    },
    {
      id: 'ceramics',
      label: {
        ckb: 'سیرامیک',
        ar: 'الخزف والسيراميك',
        en: 'Ceramics',
      },
      icon: Sparkles,
    },
  ], []);

  // Filter artworks dynamically
  const filteredArtworks = useMemo(() => {
    return artworks.filter((item) => {
      // 1. Department Filter
      if (selectedDept !== 'all') {
        const itemDeptCode = getArtworkDepartment(item);
        if (selectedDept === 'painting' || selectedDept === 'shewakari' || selectedDept === 'شێوەکاری') {
          if (itemDeptCode !== 'painting' && item.category !== 'painting') return false;
        } else if (selectedDept === 'sculpture' || selectedDept === 'پەیکەرسازی') {
          if (itemDeptCode !== 'sculpture' && item.category !== 'sculpture') return false;
        } else if (selectedDept === 'ceramics' || selectedDept === 'سیرامیک') {
          if (itemDeptCode !== 'ceramics' && item.category !== 'ceramics') return false;
        }
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleStr = (item?.title?.[locale] || item?.title?.ckb || item?.title?.en || '').toLowerCase();
        const artistStr = (item?.artist?.[locale] || item?.artist?.ckb || item?.artist?.en || '').toLowerCase();
        const titleMatch = titleStr.includes(q);
        const artistMatch = artistStr.includes(q);
        const deptLabel = getArtworkDepartmentLabel(item.departmentLabel || item.department, locale);
        const deptMatch = deptLabel.toLowerCase().includes(q);
        if (!titleMatch && !artistMatch && !deptMatch) return false;
      }

      return true;
    });
  }, [artworks, selectedDept, searchQuery, locale]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8 pb-32">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-museum-secondary hover:text-gold transition-colors w-fit group"
        >
          {isRTL ? (
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          ) : (
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          )}
          <span>{locale === 'ckb' ? 'گەڕانەوە بۆ پەڕەی سەرەکی' : locale === 'ar' ? 'العودة للرئيسية' : 'Return Home'}</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-museum-divider pb-6">
          <div>
            <div
              dir={isRTL ? 'rtl' : 'ltr'}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl sm:rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-wider mb-1 max-w-full text-right"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-normal text-right leading-relaxed">
                {locale === 'ckb' ? 'ئەرشیفی فەرمی بەشە ئەکادیمییەکان' : locale === 'ar' ? 'الأرشيف الرسمي للأقسام' : 'Official Academic Archive'}
              </span>
            </div>
            <div className="overflow-visible">
              <h1
                style={{ paddingTop: '0.5em', marginTop: '-0.5em', overflow: 'visible', lineHeight: '1.8' }}
                className="text-2xl sm:text-4xl font-bold text-stone-900 dark:text-parchment-pure overflow-visible font-serif"
              >
                {locale === 'ckb' ? 'تەواوی شاکار و بەرهەمە تۆمارکراوەکان' : locale === 'ar' ? 'سجل الأعمال والروائع الموثقة' : 'Archived Fine Arts Masterworks'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-museum-secondary mt-1 max-w-2xl">
              {locale === 'ckb'
                ? 'کۆکراوەی سەرجەم بەرهەمە هونەرییەکان و دۆکیۆمێنتەکانی سێ بەشە سەرەکییەکەی پەیمانگە (شێوەکاری، پەیکەرسازی، سیرامیک).'
                : locale === 'ar'
                ? 'المجموعة الكاملة للأعمال الفنية ووثائق الأقسام الأكاديمية الثلاثة للمعهد (الفنون التشكيلية، النحت، الخزف).'
                : 'Complete repository of artistic works and archival documentation across the 3 historic institute departments (Painting, Sculpture, Ceramics).'}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-white/40 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'ckb' ? 'گەڕان لە بەرهەمەکان...' : locale === 'ar' ? 'البحث في الأعمال...' : 'Search artworks...'}
              className="w-full ps-10 pe-4 py-2.5 rounded-full bg-white/5 border border-white/10 focus:border-gold/60 text-xs text-parchment placeholder-white/40 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs by Department */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {departmentsList.map((dept) => {
          const isSelected = selectedDept === dept.id;
          const Icon = dept.icon;
          const label = dept?.label?.[locale] || dept?.label?.ckb || dept?.label?.en || '';

          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`relative px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 select-none flex items-center gap-2 ${
                isSelected
                  ? 'text-obsidian font-semibold'
                  : 'text-parchment-muted hover:text-parchment bg-obsidian-surface/60 border border-museum-border'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="active-dept-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-gold via-[#E8C860] to-gold shadow-gold-glow -z-10"
                />
              )}
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-obsidian' : 'text-gold'}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Artworks Grid (3-Column Mobile) */}
      <motion.div layout className="grid grid-cols-3 gap-2 sm:gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredArtworks.map((artwork, idx) => (
            <motion.div
              key={artwork.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <ArtCard artwork={artwork} index={idx} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredArtworks.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
          <Filter className="w-8 h-8 text-white/30" />
          <h3 className="text-base font-bold text-parchment">
            {locale === 'ckb' ? 'هیچ بەرهەمێک نەدۆزرایەوە' : locale === 'ar' ? 'لم يتم العثور على أعمال' : 'No artworks found'}
          </h3>
          <p className="text-xs text-museum-secondary">
            {locale === 'ckb' ? 'تکایە فلتەرەکان پاک بکەرەوە یان وشەیەکی تر بەکاربهێنە.' : 'Try adjusting your search or department filter.'}
          </p>
          <button
            onClick={() => { setSelectedDept('all'); setSearchQuery(''); }}
            className="mt-2 px-4 py-2 rounded-full bg-white/10 hover:bg-gold/20 text-xs text-white hover:text-gold transition-colors"
          >
            {locale === 'ckb' ? 'پاککردنەوەی هەموو فلتەرەکان' : 'Reset All Filters'}
          </button>
        </div>
      )}
    </div>
  );
}
