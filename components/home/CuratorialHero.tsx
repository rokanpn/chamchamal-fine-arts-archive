'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { RealTimeDashboard } from '@/components/home/RealTimeDashboard';
import { 
  QrCode, 
  Sparkles, 
  Box, 
  X, 
  Camera, 
  ArrowUpRight
} from 'lucide-react';

interface CuratorialHeroProps {
  onScanClick?: () => void;
  onExploreClick?: () => void;
}

// 24 Deterministic Twinkling Micro-Stars
const STAR_PARTICLES = [
  { top: '4%', left: '8%', size: 2.2, duration: 6.5, delay: 0 },
  { top: '8%', left: '85%', size: 2.8, duration: 8.5, delay: 1.2 },
  { top: '15%', left: '25%', size: 1.8, duration: 5.5, delay: 0.6 },
  { top: '19%', left: '72%', size: 2.5, duration: 7.2, delay: 2.1 },
  { top: '27%', left: '12%', size: 3.0, duration: 9.0, delay: 0.4 },
  { top: '31%', left: '48%', size: 1.5, duration: 6.0, delay: 1.8 },
  { top: '38%', left: '92%', size: 2.4, duration: 8.0, delay: 2.5 },
  { top: '44%', left: '35%', size: 2.0, duration: 7.5, delay: 0.9 },
  { top: '51%', left: '6%', size: 3.2, duration: 10.0, delay: 1.5 },
  { top: '56%', left: '78%', size: 1.8, duration: 6.2, delay: 2.8 },
  { top: '63%', left: '22%', size: 2.6, duration: 8.8, delay: 0.3 },
  { top: '68%', left: '60%', size: 2.2, duration: 7.0, delay: 1.7 },
  { top: '74%', left: '88%', size: 3.0, duration: 9.5, delay: 2.3 },
  { top: '79%', left: '16%', size: 1.6, duration: 5.8, delay: 0.8 },
  { top: '84%', left: '42%', size: 2.5, duration: 8.2, delay: 1.9 },
  { top: '89%', left: '70%', size: 2.8, duration: 9.2, delay: 0.5 },
  { top: '93%', left: '30%', size: 2.0, duration: 6.8, delay: 2.4 },
  { top: '96%', left: '82%', size: 2.4, duration: 7.8, delay: 1.1 },
  { top: '11%', left: '55%', size: 2.2, duration: 7.4, delay: 1.4 },
  { top: '23%', left: '95%', size: 1.7, duration: 6.2, delay: 2.9 },
  { top: '35%', left: '3%', size: 2.9, duration: 8.9, delay: 0.7 },
  { top: '48%', left: '82%', size: 1.9, duration: 6.5, delay: 1.6 },
  { top: '60%', left: '45%', size: 2.7, duration: 8.4, delay: 2.2 },
  { top: '72%', left: '96%', size: 2.1, duration: 7.1, delay: 0.2 },
];

// 18 Deterministic Falling Golden Droplets / Liquid Muse Dust
const GOLDEN_DROPLETS = [
  { left: '6%', height: 24, duration: 8.5, delay: 0 },
  { left: '12%', height: 32, duration: 11.0, delay: 2.5 },
  { left: '19%', height: 18, duration: 7.5, delay: 1.0 },
  { left: '26%', height: 28, duration: 9.8, delay: 3.8 },
  { left: '33%', height: 22, duration: 8.2, delay: 0.4 },
  { left: '41%', height: 36, duration: 12.5, delay: 2.0 },
  { left: '48%', height: 20, duration: 7.8, delay: 4.2 },
  { left: '55%', height: 30, duration: 10.2, delay: 1.5 },
  { left: '62%', height: 16, duration: 6.8, delay: 3.0 },
  { left: '69%', height: 26, duration: 9.2, delay: 0.8 },
  { left: '76%', height: 34, duration: 11.8, delay: 2.7 },
  { left: '83%', height: 20, duration: 8.0, delay: 4.5 },
  { left: '89%', height: 28, duration: 10.5, delay: 1.2 },
  { left: '94%', height: 22, duration: 7.2, delay: 3.5 },
  { left: '16%', height: 25, duration: 9.0, delay: 5.0 },
  { left: '38%', height: 30, duration: 11.2, delay: 0.2 },
  { left: '58%', height: 22, duration: 8.6, delay: 4.0 },
  { left: '79%', height: 26, duration: 10.0, delay: 1.8 },
];

/**
 * Unified Magic Atmosphere Component
 * Combines Conic Volumetric Rays, Breathing Radial Aura, Twinkling Stars, and Soft Falling Golden Droplets
 */
function MagicAtmosphere() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* 1. Deep Obsidian Radial Foundation (Dark Mode only) */}
      <div className="absolute inset-0 bg-transparent dark:bg-[radial-gradient(circle_at_50%_25%,rgba(212,175,55,0.1)_0%,rgba(7,7,9,0.98)_75%)]" />

      {/* 2. Soft Breathing Gold Light Cones */}
      <motion.div
        animate={{
          opacity: [0.55, 0.85, 0.55],
          scale: [0.98, 1.04, 0.98],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-24 sm:-top-36 left-1/2 -translate-x-1/2 w-[340px] sm:w-[650px] md:w-[850px] h-[380px] sm:h-[500px] md:h-[600px] bg-[conic-gradient(from_90deg_at_50%_0%,rgba(212,175,55,0.16)_0deg,transparent_60deg,transparent_120deg,rgba(212,175,55,0.14)_180deg)] blur-2xl sm:blur-3xl rounded-full"
      />

      {/* Diagonal Ambient Light Rays */}
      <div className="hidden sm:block absolute -top-24 left-[8%] w-[380px] h-[750px] origin-top bg-gradient-to-b from-gold/10 via-amber-500/5 to-transparent blur-3xl transform -rotate-[22deg] opacity-60" />
      <div className="hidden sm:block absolute -top-24 right-[8%] w-[380px] h-[750px] origin-top bg-gradient-to-b from-gold/10 via-gold/5 to-transparent blur-3xl transform rotate-[22deg] opacity-60" />

      {/* Layer A: Twinkling Micro-Stars */}
      {STAR_PARTICLES.map((particle, idx) => (
        <motion.div
          key={`star-${idx}`}
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          className="absolute rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.9),0_0_12px_rgba(212,175,55,0.5)]"
          animate={{
            opacity: [0.15, 0.95, 0.15],
            scale: [0.75, 1.3, 0.75],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}

      {/* Layer B: Golden Water Droplets (Falling Softly Downward) */}
      {GOLDEN_DROPLETS.map((droplet, idx) => (
        <motion.div
          key={`droplet-${idx}`}
          style={{
            left: droplet.left,
            height: droplet.height,
            width: 1.2,
          }}
          className="absolute top-0 rounded-full bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent shadow-[0_0_8px_rgba(212,175,55,0.7)]"
          animate={{
            y: [-50, 1600],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: droplet.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: droplet.delay,
          }}
        />
      ))}
    </div>
  );
}

export function CuratorialHero({ onScanClick, onExploreClick }: CuratorialHeroProps) {
  const { t, locale } = useLanguage();
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <>
      <section className="relative pt-4 sm:pt-10 md:pt-12 pb-10 sm:pb-16 md:pb-24 flex flex-col items-center text-center max-w-6xl mx-auto px-3 sm:px-4 overflow-hidden">
        {/* Unified Magic Atmosphere with Stars & Falling Golden Rain */}
        <MagicAtmosphere />

        {/* 1. Curatorial Badge: Organic Capsule with Pulsing Gold Dot */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-stone-100/90 dark:bg-black/60 border border-gold/40 text-gold-dark dark:text-gold-light text-xs font-medium tracking-wide mb-3 sm:mb-5 shadow-sm dark:shadow-gold-glow-sm backdrop-blur-xl select-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold shadow-[0_0_8px_#D4AF37]" />
          </span>
          <span className="text-[10px] sm:text-xs font-semibold">
            {t.hero.topBadge}
          </span>
        </motion.div>

        {/* 2. Refined, Proportionate Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={`text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-parchment-pure leading-tight sm:leading-[1.24] max-w-3xl text-balance ${
            locale === 'en' ? 'font-serif' : 'font-kurdish'
          } dark:[text-shadow:_0_2px_24px_rgba(0,0,0,0.85),_0_0_40px_rgba(212,175,55,0.12)]`}
        >
          {t.hero.instituteName}
        </motion.h1>

        {/* Subtitle: Official Institute Designation */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="text-sm sm:text-lg md:text-2xl font-semibold text-gold-dark dark:text-gold-light mt-2 sm:mt-4 font-serif tracking-wide max-w-2xl dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        >
          {t.hero.subtitle}
        </motion.h2>

        {/* Organic Curatorial Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-2.5 sm:mt-4 md:mt-5 text-xs sm:text-sm md:text-base text-stone-600 dark:text-museum-secondary/90 max-w-2xl font-normal leading-relaxed text-balance text-center mx-auto line-clamp-3 sm:line-clamp-none"
        >
          {t.hero.description}
        </motion.p>

        {/* 3. Floating Interactive Action Pills */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-5 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
        >
          {/* Primary Action: QR Scanner */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => {
              if (onScanClick) onScanClick();
              else setShowQRModal(true);
            }}
            className="group relative flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-gold via-amber-400 to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 w-full sm:w-auto overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <QrCode className="w-4 h-4 text-stone-950 group-hover:rotate-6 transition-transform shrink-0" />
            <span>{t.hero.scanQr || 'QR سکان بکە 🔍'}</span>
          </motion.button>

          {/* Virtual 3D Tour */}
          <Link href="/virtual-tour" className="w-full sm:w-auto">
            <motion.div
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-gold/40 hover:border-gold bg-stone-100/90 dark:bg-gradient-to-r dark:from-obsidian-surface/90 dark:via-gold/15 dark:to-obsidian-surface/90 text-stone-900 dark:text-gold-light hover:text-gold-dark dark:hover:text-white backdrop-blur-md text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm dark:shadow-gold-glow-sm hover:shadow-md dark:hover:shadow-gold-glow cursor-pointer w-full sm:w-auto group"
            >
              <Box className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform shrink-0" />
              <span>
                {locale === 'ckb'
                  ? 'گەشتێکی ۳D 👓'
                  : locale === 'ar'
                  ? 'جولة ۳D 👓'
                  : 'Virtual 3D 👓'}
              </span>
            </motion.div>
          </Link>
        </motion.div>

        {/* 4. Organic Glassmorphism Dashboard (Continuous Capsule & Department Flow) */}
        <RealTimeDashboard />
      </section>

      {/* Museum Physical QR Scanner Simulation Modal */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQRModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md rounded-3xl bg-obsidian-surface border border-gold/40 p-6 sm:p-8 shadow-gold-glow flex flex-col items-center text-center z-10 overflow-hidden"
            >
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 end-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment transition-colors"
                aria-label="Close Scanner"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest mb-1">
                <Camera className="w-4 h-4" />
                <span>{locale === 'ckb' ? 'سکانەری مۆزەخانەی چەمچەماڵ' : locale === 'ar' ? 'ماسح المعرض التفاعلي' : 'Gallery QR Scanner'}</span>
              </div>
              <h3 className="text-xl font-bold text-parchment mb-2">
                {locale === 'ckb'
                  ? 'کۆدی تابلۆ یان پەیکەرەکە ئاڕاستە بکە'
                  : locale === 'ar'
                  ? 'وجّه الكاميرا نحو رمز اللوحة أو المنحوتة'
                  : 'Point at Physical Artwork Code'}
              </h3>
              <p className="text-xs text-museum-secondary mb-6 max-w-xs">
                {locale === 'ckb'
                  ? 'لە کاتی سەردانی پەیمانگە لە چەمچەماڵ، کامێراکەت بخەرە سەر هێمای تەنیشت بەرهەمەکە بۆ بینینی مۆدێلی ۳D و چیرۆکی شاکارەکە.'
                  : locale === 'ar'
                  ? 'أثناء زيارتك لمعهد جمجمال، امسح الرمز المجاور للعمل للوصول الفوري للمجسم ثلاثي الأبعاد.'
                  : 'While visiting the institute in Chamchamal, scan the physical plaque code for instant 3D model inspection.'}
              </p>

              <div className="relative w-52 h-52 rounded-2xl border-2 border-dashed border-gold/50 bg-black/60 flex items-center justify-center overflow-hidden mb-6">
                <motion.div
                  animate={{ y: [-90, 90, -90] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_12px_#D4AF37]"
                />

                <QrCode className="w-20 h-20 text-gold/30" />

                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold" />
              </div>

              <Link
                href="/artworks/chamchamal-freedom-monument"
                onClick={() => setShowQRModal(false)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center justify-center gap-2 mb-2"
              >
                <Box className="w-4 h-4 text-obsidian" />
                <span>
                  {locale === 'ckb'
                    ? 'تاقیکردنەوە: کردنەوەی پەیکەری چەمچەماڵ (۳D)'
                    : locale === 'ar'
                    ? 'تجربة: فتح نصب جمجمال ثلاثي الأبعاد'
                    : 'Simulate Scan: Open 3D Freedom Monument'}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  setShowQRModal(false);
                  const el = document.getElementById('gallery-feed');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 rounded-full hover:bg-white/5 text-museum-secondary hover:text-parchment text-xs font-medium transition-all"
              >
                {locale === 'ckb' ? 'گەڕان بەناو ئەرشیف بەبێ سکانەر' : locale === 'ar' ? 'تصفح الأرشيف بدون مسح' : 'Browse Gallery Without Scanner'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
