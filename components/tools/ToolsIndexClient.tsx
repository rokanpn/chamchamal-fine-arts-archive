'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';
import { AtelierTool, ToolCategory, TOOL_CATEGORIES } from '@/data/tools';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { ModelViewer3D } from '@/components/artwork/ModelViewer3D';
import { AudioGuidePlayer } from '@/components/artwork/AudioGuidePlayer';
import { 
  Wrench, 
  Box, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  MapPin, 
  Eye, 
  X, 
  Video, 
  Headphones, 
  Image as ImageIcon, 
  CheckCircle2, 
  BookOpen, 
  Info 
} from 'lucide-react';

export function ToolsIndexClient() {
  const { locale, isRTL } = useLanguage();
  const { tools, artworks: allArtworks } = useArchive();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [previewTool, setPreviewTool] = useState<AtelierTool | null>(null);
  const [modalTab, setModalTab] = useState<'3d' | 'audio' | 'gallery' | 'video' | 'tips'>('3d');

  const filteredTools = useMemo(() => {
    if (selectedCategory === 'all') return tools;
    return tools.filter((tool) => tool.category === selectedCategory);
  }, [tools, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 sm:gap-12 w-full pb-32 safe-bottom">
      {/* Header Section */}
      <section className="relative pt-2 sm:pt-8 flex flex-col items-center text-center max-w-3xl mx-auto px-1 sm:px-4">
        {/* Top Eyebrow Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold-dark dark:text-gold-light text-[10px] sm:text-xs font-medium tracking-wide mb-2 sm:mb-4 shadow-gold-glow">
          <Wrench className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold shrink-0" />
          <span>
            {locale === 'ckb'
              ? 'کەرەستەناسی و ئامرازەکانی ئاتلیێ'
              : locale === 'ar'
              ? 'موسوعة أدوات وخامات الأتيليه'
              : 'Atelier Instruments & Material Encyclopedia'}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-xl sm:text-3xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-parchment-pure leading-snug sm:leading-tight text-balance">
          {locale === 'ckb'
            ? 'ئامرازەکانی داهێنانی هونەری'
            : locale === 'ar'
            ? 'أدوات الإبداع التشكيلي في جمجمال'
            : 'Instruments of Fine Art & Craft'}
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-2 sm:mt-4 text-[11px] sm:text-sm md:text-base text-stone-600 dark:text-museum-secondary max-w-2xl leading-relaxed text-balance line-clamp-3 sm:line-clamp-none px-2 sm:px-0">
          {locale === 'ckb'
            ? 'ڕوانگەیەکی ورد و فرەمیدیا بۆ ئەو فڵچە، قەڵەمی تاشین، قوڕی خۆماڵی، خەڵووز و ئامرازانەی کە مامۆستایان و قوتابیانی پەیمانگە شاکارەکانی پێ دەخولقێنن؛ لەگەڵ سکانی ۳D، فێرکاری ڤیدیۆیی و ڕێنمایی دەنگی.'
            : locale === 'ar'
            ? 'دليل متعدد الوسائط يضم مجسمات ثلاثية الأبعاد، مقاطع فيديو تعليمية، وشروحات صوتية للأدوات والخامات المستخدمة في معهد جمجمال.'
            : 'An interactive multimedia encyclopedia spotlighting bespoke brushes, carving gouges, indigenous terracotta clays, and reed pens with unique 3D photogrammetry, video workshops, and audio guides.'}
        </p>

        {/* Category Filter Pills */}
        <div
          role="tablist"
          aria-label="Tool Categories"
          className="mt-4 sm:mt-8 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none no-scrollbar max-w-full -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {TOOL_CATEGORIES.map((cat) => {
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
                {isSelected && (
                  <motion.div
                    layoutId="active-tool-cat-pill"
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
                    ? tools.length
                    : tools.filter((t) => t.category === cat.key).length}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tools Grid (2-Column Mobile, 3-Column Desktop) */}
      <motion.div
        layout
        className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredTools.map((tool, idx) => {
            const toolName = tool.name[locale] || tool.name.ckb;
            const categoryLabel = tool.categoryLabel[locale] || tool.categoryLabel.ckb;
            const description = tool.description[locale] || tool.description.ckb;
            const origin = tool.origin[locale] || tool.origin.ckb;

            // Connected artworks
            const connectedArtworks = allArtworks.filter((a) =>
              tool.usedInArtworkSlugs.includes(a.slug)
            );

            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                className="group relative rounded-xl sm:rounded-3xl bg-white dark:bg-obsidian-surface/80 border border-stone-200/80 dark:border-museum-border hover:border-gold/40 shadow-sm dark:shadow-art-card flex flex-col justify-between overflow-hidden backdrop-blur-xl transition-all duration-300"
              >
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-stone-400/20 dark:via-white/15 to-transparent pointer-events-none" />

                <div className="flex flex-col flex-1">
                  {/* Tool Thumbnail Stage */}
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-stone-100 dark:bg-obsidian-elevated">
                    <SafeImage
                      src={tool.imageUrl}
                      alt={toolName}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent dark:from-obsidian dark:via-obsidian/30 dark:to-transparent" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-1.5 sm:top-3.5 inset-x-1.5 sm:inset-x-3.5 flex items-center justify-between gap-1 pointer-events-none z-10">
                      <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-semibold bg-black/65 text-parchment-pure border border-white/10 backdrop-blur-md shadow-glass-pill truncate max-w-[55%] sm:max-w-none">
                        {categoryLabel}
                      </span>

                      {/* Multimedia 3D & Audio Inspector Trigger */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPreviewTool(tool);
                          setModalTab('3d');
                        }}
                        className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold bg-gold/25 hover:bg-gold/35 text-gold-shimmer border border-gold/40 backdrop-blur-md transition-all shadow-gold-glow cursor-pointer shrink-0"
                      >
                        <Box className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gold animate-spin-slow shrink-0" />
                        <span className="hidden sm:inline">3D & Media</span>
                        <span className="sm:hidden">3D</span>
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-2 sm:p-4 md:p-5 flex flex-col gap-1 sm:gap-2.5 flex-1">
                    <div className="flex items-center gap-1 text-[8px] sm:text-[11px] text-stone-500 dark:text-museum-secondary">
                      <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gold shrink-0" />
                      <span className="line-clamp-1">{origin}</span>
                    </div>

                    <Link href={`/tools/${tool.slug}`} className="group-hover:text-gold transition-colors">
                      <h2 className="text-xs sm:text-base md:text-lg font-bold text-stone-900 dark:text-parchment-pure line-clamp-1">
                        {toolName}
                      </h2>
                    </Link>

                    <p className="text-[9px] sm:text-xs text-stone-600 dark:text-museum-secondary leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {description}
                    </p>

                    {/* Multimedia Badges Ribbon */}
                    <div className="flex items-center gap-1.5 sm:gap-3 text-[8px] sm:text-[11px] text-gold-dark dark:text-gold/90 font-mono pt-1 border-t border-stone-200/60 dark:border-white/5 flex-wrap">
                      <span className="flex items-center gap-0.5 sm:gap-1">
                        <Box className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gold shrink-0" />
                        <span className="hidden sm:inline">3D Model</span>
                        <span className="sm:hidden">3D</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 sm:gap-1">
                        <Headphones className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gold shrink-0" />
                        <span>{tool.audioDuration}</span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>Video</span>
                      </span>
                    </div>

                    {/* Connected Artworks Live Badges (compact on mobile, full on desktop) */}
                    {connectedArtworks.length > 0 && (
                      <div className="hidden sm:flex mt-1 pt-2 border-t border-stone-200/60 dark:border-museum-divider flex-col gap-1.5">
                        <span className="text-[10px] font-medium text-gold uppercase tracking-wider">
                          {locale === 'ckb'
                            ? 'کارە پەیوەندیدارەکان بەم کەرەستەیە:'
                            : locale === 'ar'
                            ? 'أعمال أُبدعت بهذه الأداة:'
                            : 'Masterworks Made With This Tool:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {connectedArtworks.slice(0, 2).map((art) => (
                            <Link
                              key={art.id}
                              href={`/artworks/${art.slug}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-stone-100 dark:bg-obsidian-elevated hover:bg-gold/15 border border-stone-200 dark:border-white/5 hover:border-gold/30 text-stone-700 dark:text-parchment-muted hover:text-gold-dark dark:hover:text-gold-light transition-all"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                              <span className="truncate max-w-[120px]">
                                {art.title[locale] || art.title.ckb}
                              </span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-2 sm:p-4 md:p-5 pt-0 mt-auto">
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="w-full py-1.5 sm:py-2.5 px-2 rounded-full bg-stone-100 dark:bg-obsidian-elevated/70 hover:bg-gold hover:text-stone-950 dark:hover:text-obsidian border border-stone-200 dark:border-museum-border hover:border-gold text-stone-800 dark:text-parchment text-[9px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 shadow-glass-pill text-center"
                  >
                    <span className="hidden sm:inline">
                      {locale === 'ckb' ? 'بینینی ئەناتۆمی و فرەمیدیا' : locale === 'ar' ? 'فحص تفاصيل الأداة والوسائط' : 'Inspect Instrument Anatomy'}
                    </span>
                    <span className="sm:hidden">
                      {locale === 'ckb' ? 'بینینی وردەکاری' : locale === 'ar' ? 'فحص التفاصيل' : 'Inspect'}
                    </span>
                    <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Expanded Multi-Media 3D Tool Inspector Modal */}
      <AnimatePresence>
        {previewTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewTool(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              className="relative w-full max-w-3xl max-h-[92vh] rounded-3xl bg-obsidian-surface border border-gold/40 shadow-art-card flex flex-col z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-museum-divider flex items-center justify-between bg-black/40">
                <div className="flex flex-col text-start">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-gold">
                    MULTIMEDIA ATELIER TOOL INSPECTOR
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-parchment-pure truncate max-w-md sm:max-w-xl">
                    {previewTool.name[locale] || previewTool.name.ckb}
                  </h3>
                </div>

                <button
                  onClick={() => setPreviewTool(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Multimedia Tabs Navigation */}
              <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-museum-divider bg-obsidian-elevated/40 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setModalTab('3d')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    modalTab === '3d'
                      ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                      : 'text-museum-secondary hover:text-parchment'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Model & AR</span>
                </button>

                <button
                  onClick={() => setModalTab('audio')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    modalTab === 'audio'
                      ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                      : 'text-museum-secondary hover:text-parchment'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{locale === 'ckb' ? 'دەنگ و ڕێنمایی' : 'Audio Guide'}</span>
                </button>

                <button
                  onClick={() => setModalTab('gallery')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    modalTab === 'gallery'
                      ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                      : 'text-museum-secondary hover:text-parchment'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{locale === 'ckb' ? 'وێنەی ئەتەلێیە' : 'Studio Photos'}</span>
                </button>

                <button
                  onClick={() => setModalTab('video')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    modalTab === 'video'
                      ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                      : 'text-museum-secondary hover:text-parchment'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{locale === 'ckb' ? 'ڤیدیۆی فێرکاری' : 'Workshop Video'}</span>
                </button>

                <button
                  onClick={() => setModalTab('tips')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    modalTab === 'tips'
                      ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                      : 'text-museum-secondary hover:text-parchment'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{locale === 'ckb' ? 'ڕێنمایی دەستکاری' : 'Master Tips'}</span>
                </button>
              </div>

              {/* Modal Body with Active Tab */}
              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                {/* Tab 1: Distinct 3D Model Stage */}
                {modalTab === '3d' && (
                  <div className="flex flex-col gap-4">
                    <div className="w-full">
                      <ModelViewer3D
                        modelUrl={previewTool.glbUrl}
                        posterUrl={previewTool.imageUrl}
                        title={previewTool.name[locale] || previewTool.name.ckb}
                        vertices="140,000 Vertices"
                        polygons="280,000 Triangles"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-obsidian-elevated/80 border border-museum-border grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-museum-caption block text-[10px] uppercase">
                          {locale === 'ckb' ? 'پێکهاتە' : 'Materials'}
                        </span>
                        <span className="text-parchment font-medium mt-0.5 block">
                          {previewTool.materials[locale] || previewTool.materials.ckb}
                        </span>
                      </div>
                      <div>
                        <span className="text-museum-caption block text-[10px] uppercase">
                          {locale === 'ckb' ? 'سەرچاوە' : 'Provenance'}
                        </span>
                        <span className="text-parchment font-medium mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          <span>{previewTool.origin[locale] || previewTool.origin.ckb}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Embedded Audio Guide */}
                {modalTab === 'audio' && (
                  <div className="flex flex-col gap-4">
                    <AudioGuidePlayer
                      artistName={previewTool.name[locale] || previewTool.name.ckb}
                      artworkTitle={previewTool.categoryLabel[locale] || previewTool.categoryLabel.ckb}
                      audioDurationSeconds={135}
                    />

                    <div className="p-5 rounded-2xl bg-obsidian-elevated/60 border border-museum-border text-xs leading-relaxed text-parchment-muted">
                      <p>{previewTool.historicalSignificance[locale] || previewTool.historicalSignificance.ckb}</p>
                    </div>
                  </div>
                )}

                {/* Tab 3: Studio Photo Gallery */}
                {modalTab === 'gallery' && (
                  <div className="flex flex-col gap-4">
                    <span className="text-xs text-museum-secondary">
                      {locale === 'ckb'
                        ? 'وێنەی ڕاستەقینەی بەکارهێنانی کەرەستەکە لە ئاتلیێی پەیمانگەی چەمچەماڵ:'
                        : 'High-resolution multi-angle photography of instrument application in the atelier:'}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {previewTool.galleryImages.map((imgUrl, i) => (
                        <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-museum-border bg-obsidian-elevated">
                          <SafeImage
                            src={imgUrl}
                            alt="Studio photo"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 4: Video Workshop Demonstration */}
                {modalTab === 'video' && (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-semibold text-gold flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <span>{previewTool.videoTitle[locale] || previewTool.videoTitle.ckb}</span>
                    </span>

                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-museum-border bg-black shadow-art-card">
                      <iframe
                        src={previewTool.videoUrl}
                        title="Workshop Video"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Tab 5: Master Artisan Usage Instructions & Pro-Tips */}
                {modalTab === 'tips' && (
                  <div className="flex flex-col gap-4">
                    <div className="p-5 rounded-2xl bg-obsidian-elevated/60 border border-museum-border flex flex-col gap-2">
                      <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{locale === 'ckb' ? 'شێوازی بەکارهێنانی تەکنیکی' : 'Technical Application Instructions'}</span>
                      </h4>
                      <p className="text-xs text-parchment leading-relaxed">
                        {previewTool.usageInstructions[locale] || previewTool.usageInstructions.ckb}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-gold/10 border border-gold/30 flex flex-col gap-2.5">
                      <h4 className="text-xs font-bold text-gold-light uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-gold" />
                        <span>{locale === 'ckb' ? 'ئامۆژگارییە زێڕینەکانی مامۆستایانی پەیمانگە (Pro-Tips)' : 'Master Artisan Pro-Tips'}</span>
                      </h4>
                      <div className="flex flex-col gap-2 text-xs text-parchment-muted">
                        {(previewTool.proTips[locale] || previewTool.proTips.ckb).map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-museum-divider bg-black/40 flex items-center justify-between">
                <span className="text-xs text-museum-secondary">
                  {previewTool.materials[locale] || previewTool.materials.ckb}
                </span>

                <Link
                  href={`/tools/${previewTool.slug}`}
                  onClick={() => setPreviewTool(null)}
                  className="px-5 py-2.5 rounded-full bg-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center gap-1.5 hover:shadow-gold-glow-lg transition-all"
                >
                  <span>{locale === 'ckb' ? 'پەڕەی تەواوی ئامراز' : 'Full Dedicated Dossier'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
