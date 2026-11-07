'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtworkCategory, CATEGORIES } from '@/data/artworks';
import { ArtCard } from '@/components/ui/ArtCard';
import { useLanguage } from '@/context/LanguageContext';
import { useArchive } from '@/context/ArchiveContext';

export function ArtworkFeed() {
  const { locale } = useLanguage();
  const { artworks } = useArchive();
  const [selectedCategory, setSelectedCategory] = useState<ArtworkCategory>('all');

  // Filtered artworks computation using dynamic archive store
  const filteredArtworks = useMemo(() => {
    if (selectedCategory === 'all') return artworks;
    return artworks.filter((item) => item.category === selectedCategory);
  }, [artworks, selectedCategory]);

  return (
    <section id="gallery-feed" className="relative flex flex-col gap-5 sm:gap-8 scroll-mt-24">
      {/* Category Filter Pill Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-stone-200/80 dark:border-museum-divider pb-3 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <h2 className="text-lg sm:text-2xl font-bold text-stone-900 dark:text-parchment-pure">
              {locale === 'ckb'
                ? 'پێشانگای بەرهەمە هەڵبژێردراوەکان'
                : locale === 'ar'
                ? 'المعرض الرئيسي للأعمال المختارة'
                : 'Curated Permanent Collection'}
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-stone-600 dark:text-museum-secondary mt-0.5 sm:mt-1">
            {locale === 'ckb'
              ? 'تەواوی شاکارە هونەرییەکان، پەیکەرەکان و نموونە سێ ڕەهەندییەکان'
              : locale === 'ar'
              ? 'مجموعة فريدة تضم روائع الرسم، النحت، الخزف وفنون الطباعة'
              : 'Select masterworks across painting, academic sculpture, ceramics & prints'}
          </p>
        </div>

        {/* Scrollable Filter Pill Bar */}
        <div
          role="tablist"
          aria-label="Artwork Categories"
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            const label = cat.label[locale] || cat.label.ckb;

            return (
              <button
                key={cat.key}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.key)}
                className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-200 select-none flex items-center gap-1.5 sm:gap-2 ${
                  isSelected
                    ? 'text-stone-950 font-bold'
                    : 'text-stone-700 dark:text-parchment-muted hover:text-stone-950 dark:hover:text-parchment bg-stone-100 dark:bg-obsidian-surface/60 border border-stone-200 dark:border-museum-border'
                }`}
              >
                {/* Active Sliding Gold Pill */}
                {isSelected && (
                  <motion.div
                    layoutId="active-category-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gold via-[#E8C860] to-gold shadow-gold-glow -z-10"
                  />
                )}
                <span>{label}</span>
                <span
                  className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/20 text-stone-950 font-bold' : 'bg-black/5 dark:bg-white/10 text-stone-600 dark:text-museum-secondary'
                  }`}
                >
                  {cat.key === 'all'
                    ? artworks.length
                    : artworks.filter((a) => a.category === cat.key).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Mobile & Responsive Gallery Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredArtworks.map((artwork, idx) => (
            <motion.div
              key={artwork.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={artwork.featured && idx === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}
            >
              <ArtCard
                artwork={artwork}
                index={idx}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
