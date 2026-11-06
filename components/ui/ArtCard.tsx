'use client';

import React, { useRef, useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Artwork, getArtworkDepartmentLabel } from '@/data/artworks';
import { useLanguage } from '@/context/LanguageContext';
import { Box, Sparkles, Eye, ArrowUpRight } from 'lucide-react';

interface ArtCardProps {
  artwork: Artwork;
  index: number;
}

export function ArtCard({ artwork, index }: ArtCardProps) {
  const { locale, isRTL } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Fluid 3D Perspective Tilt Physics
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 260, mass: 0.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [7, -7]);
  const rotateY = useTransform(smoothX, [0, 1], [-7, 7]);
  const glareX = useTransform(smoothX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(smoothY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Localized texts
  const title = artwork.title[locale] || artwork.title.ckb;
  const artist = artwork.artist[locale] || artwork.artist.ckb;
  const medium = artwork.medium[locale] || artwork.medium.ckb;
  const department = getArtworkDepartmentLabel(artwork.departmentLabel || artwork.department, locale);
  const categoryLabel = artwork.categoryLabel[locale] || artwork.categoryLabel.ckb;

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.65, delay: (index % 4) * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ perspective: 1100 }}
      className="w-full"
    >
      <Link href={`/artworks/${artwork.slug}`} className="block focus:outline-none">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          whileTap={{ scale: 0.98 }}
          className="group relative flex flex-col rounded-2xl bg-obsidian-surface/80 border border-museum-border hover:border-gold/50 shadow-art-card hover:shadow-gold-glow transition-all duration-300 overflow-hidden cursor-pointer backdrop-blur-xl"
        >
          {/* Dynamic Specular Glare / Sheen Follower */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
            style={{
              background: `radial-gradient(circle 280px at ${glareX} ${glareY}, rgba(212, 175, 55, 0.16), transparent 70%)`,
            }}
          />

          {/* Top Fine Border Specular Line */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-20" />

          {/* Image Container with Dynamic Aspect Ratio */}
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-obsidian-elevated">
            <SafeImage
              src={artwork.imageUrl}
              alt={title}
              fill
              priority={index < 3}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            />

            {/* Liquid Obsidian Vignette Gradient over image */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-black/20 z-10" />

            {/* Top Floating Badges */}
            <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-none">
              {/* Category Pill */}
              <span className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide bg-black/60 text-parchment-pure border border-white/10 backdrop-blur-md shadow-glass-pill">
                {categoryLabel}
              </span>

              {/* 3D / AR Indicator Badge */}
              {artwork.has3DModel ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-gold/20 text-gold-shimmer border border-gold/40 backdrop-blur-md shadow-gold-glow">
                  <Box className="w-3.5 h-3.5 text-gold animate-spin-slow" />
                  <span>3D / AR SCAN</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] text-museum-secondary font-mono bg-black/40 backdrop-blur-sm border border-white/5">
                  {artwork.year}
                </span>
              )}
            </div>

            {/* Hover Inspect Indicator Center */}
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 border border-gold/40 text-gold-light text-xs font-medium backdrop-blur-md shadow-gold-glow">
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {artwork.has3DModel
                    ? locale === 'ckb'
                      ? 'پشکنینی ۳D و AR'
                      : locale === 'ar'
                      ? 'فحص ثلاثي الأبعاد و AR'
                      : 'Explore in 3D / AR'
                    : locale === 'ckb'
                    ? 'ڕوانینی ورد ۲.٥D'
                    : locale === 'ar'
                    ? 'معاينة العمق الفني'
                    : 'Inspect Canvas Depth'}
                </span>
              </div>
            </div>
          </div>

          {/* Artwork Editorial Inscription */}
          <div className="relative z-20 p-5 flex flex-col justify-between flex-1 gap-4">
            <div className="flex flex-col gap-1.5">
              {/* Department Tag */}
              <div className="flex items-center justify-between text-[11px] text-museum-secondary">
                <span className="line-clamp-1">{department}</span>
                <span className="font-mono text-[10px] text-gold/80">{artwork.dimensions}</span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-parchment-pure group-hover:text-gold-light transition-colors duration-200 line-clamp-1">
                {title}
              </h3>

              {/* Artist Moniker */}
              <p className="text-xs text-parchment-muted font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                <span>{artist}</span>
              </p>
            </div>

            {/* Medium and Action Footnote */}
            <div className="pt-3 border-t border-museum-divider flex items-center justify-between text-xs">
              <span className="text-[11px] text-museum-caption line-clamp-1 max-w-[70%]">
                {medium}
              </span>

              <div className="flex items-center gap-1 text-gold group-hover:text-gold-shimmer transition-colors font-medium text-xs">
                <ArrowUpRight
                  className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isRTL ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
