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
    <section id="gallery-feed" className="relative flex flex-col gap-8 scroll-mt-24">
      {/* Category Filter Pill Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-museum-divider pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <h2 className="text-xl sm:text-2xl font-bold text-parchment-pure">
              {locale === 'ckb'
                ? 'پێشانگای بەرهەمە هەڵبژێردراوەکان'
                : locale === 'ar'
                ? 'المعرض الرئيسي للأعمال المختارة'
                : 'Curated Permanent Collection'}
            </h2>
          </div>
          <p className="text-xs text-museum-secondary mt-1">
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
          className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
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
                className={`relative px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 select-none flex items-center gap-2 ${
                  isSelected
                    ? 'text-obsidian font-semibold'
                    : 'text-parchment-muted hover:text-parchment bg-obsidian-surface/60 border border-museum-border'
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
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/20 text-obsidian' : 'bg-white/10 text-museum-secondary'
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

      {/* Asymmetric Staggered Gallery Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
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
