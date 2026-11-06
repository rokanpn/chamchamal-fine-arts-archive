'use client';

import React, { useRef, useState, useEffect } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import { useResolvedMediaUrl } from '@/hooks/useResolvedMediaUrl';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Compass, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  Layers 
} from 'lucide-react';

interface ParallaxArtworkViewerProps {
  imageUrl: string;
  title: string;
  artist: string;
  medium: string;
  dimensions: string;
}

export function ParallaxArtworkViewer({
  imageUrl,
  title,
  artist,
  medium,
  dimensions,
}: ParallaxArtworkViewerProps) {
  const { locale, isRTL } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const { resolvedUrl } = useResolvedMediaUrl(imageUrl);
  const activeImageUrl = resolvedUrl || imageUrl;

  // Loupe Inspection state
  const [isLoupeActive, setIsLoupeActive] = useState(false);
  const [loupePosition, setLoupePosition] = useState({ x: 50, y: 50 }); // percentages
  const [loupePixelPos, setLoupePixelPos] = useState({ x: 0, y: 0 }); // client px within container
  const [isHovering, setIsHovering] = useState(false);

  // Parallax Physics Coordinates (Normalized 0 to 1, default center 0.5)
  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 220, mass: 0.15 };
  const smoothX = useSpring(normX, springConfig);
  const smoothY = useSpring(normY, springConfig);

  // Layer Transmutations
  const rotateX = useTransform(smoothY, [0, 1], [6, -6]);
  const rotateY = useTransform(smoothX, [0, 1], [-6, 6]);
  const canvasShiftX = useTransform(smoothX, [0, 1], [-12, 12]);
  const canvasShiftY = useTransform(smoothY, [0, 1], [-12, 12]);
  const shadowShiftX = useTransform(smoothX, [0, 1], [25, -25]);
  const shadowShiftY = useTransform(smoothY, [0, 1], [25, -25]);
  const glareX = useTransform(smoothX, [0, 1], ['15%', '85%']);
  const glareY = useTransform(smoothY, [0, 1], ['15%', '85%']);

  // Desktop Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    normX.set(Math.max(0, Math.min(1, x)));
    normY.set(Math.max(0, Math.min(1, y)));

    if (isLoupeActive) {
      setLoupePosition({ x: x * 100, y: y * 100 });
      setLoupePixelPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  // Mobile Gyroscope / Device Orientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: left to right [-90, 90]
        // beta: front to back [-180, 180]
        const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
        const clampedBeta = Math.max(10, Math.min(70, e.beta)); // typical phone holding angle ~40deg

        const targetX = (clampedGamma + 30) / 60;
        const targetY = (clampedBeta - 10) / 60;

        normX.set(targetX);
        normY.set(targetY);
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [normX, normY]);

  const handleReset = () => {
    normX.set(0.5);
    normY.set(0.5);
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[580px] rounded-3xl bg-gradient-to-b from-[#141418] via-obsidian-surface to-obsidian border border-museum-border overflow-hidden shadow-art-card flex items-center justify-center p-4 sm:p-8">
      {/* Museum Overhead Spotlight Radial Vignette */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gold/10 blur-[100px] pointer-events-none z-10" />

      {/* Parallax Stage Framing */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          handleReset();
        }}
        style={{ perspective: 1200 }}
        className="relative w-full h-full max-w-3xl flex items-center justify-center select-none cursor-crosshair"
      >
        {/* Dynamic Shadow Depth Projection Layer */}
        <motion.div
          style={{
            x: shadowShiftX,
            y: shadowShiftY,
          }}
          className="absolute inset-4 rounded-2xl bg-black/80 blur-2xl -z-10 pointer-events-none"
        />

        {/* Floating 2.5D Artwork Canvas Bevel */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            x: canvasShiftX,
            y: canvasShiftY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-[#22222b] shadow-2xl bg-obsidian-elevated flex items-center justify-center"
        >
          {/* Main High-Res Canvas Image */}
          <div className="relative w-full h-full">
            <SafeImage
              src={activeImageUrl}
              alt={title}
              fill
              priority
              className="object-contain object-center scale-[1.03] transition-transform duration-300"
            />
          </div>

          {/* Organic Linen Canvas Texture Overlay */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
              backgroundSize: '4px 4px',
            }}
          />

          {/* Dynamic Oil Paint Specular Varnish Sheen Follower */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-soft-light transition-opacity"
            style={{
              background: `radial-gradient(circle 350px at ${glareX} ${glareY}, rgba(255, 245, 210, 0.45), transparent 75%)`,
            }}
          />

          {/* Interactive Magnifying Loupe Lens */}
          <AnimatePresence>
            {isLoupeActive && isHovering && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                style={{
                  left: loupePixelPos.x,
                  top: loupePixelPos.y,
                  transform: 'translate(-50%, -50%)',
                }}
                className="pointer-events-none absolute w-44 h-44 rounded-full border-2 border-gold shadow-gold-glow-lg overflow-hidden z-40 bg-obsidian"
              >
                {/* Magnified Image Slice (2.5x Zoom) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backgroundImage: `url(${activeImageUrl})`,
                    backgroundPosition: `${loupePosition.x}% ${loupePosition.y}%`,
                    backgroundSize: '280%',
                    backgroundRepeat: 'no-repeat',
                  }}
                />

                {/* Reticle Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-full h-[1px] bg-gold" />
                  <div className="h-full w-[1px] bg-gold absolute" />
                </div>

                {/* Loupe Label Badge */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/80 text-[9px] font-mono text-gold-light border border-gold/40">
                  2.5× Loupe
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Top Floating Curatorial Metric Ribbon */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-gold/30 shadow-glass-pill pointer-events-auto">
          <Layers className="w-4 h-4 text-gold" />
          <span className="text-[11px] font-semibold text-gold-shimmer">
            {locale === 'ckb' ? 'بینینی ئەزموونی قووڵایی ۲.٥D' : locale === 'ar' ? 'معاينة العمق البصري التفاعلي 2.5D' : '2.5D Parallax Depth Canvas'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-[11px] text-museum-secondary font-mono pointer-events-auto">
          <span>{dimensions}</span>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 inset-x-4 z-30 flex items-center justify-between gap-3 pointer-events-none">
        {/* Reset Angle Control */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-obsidian-elevated/85 backdrop-blur-2xl border border-museum-border shadow-glass-nav pointer-events-auto">
          <button
            onClick={handleReset}
            title="Reset Perspective"
            className="p-2 rounded-full text-museum-secondary hover:text-parchment hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Loupe Mode Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.04 }}
          onClick={() => setIsLoupeActive((prev) => !prev)}
          className={`group pointer-events-auto flex items-center gap-2.5 px-5 py-2.5 rounded-full font-bold text-xs shadow-gold-glow transition-all cursor-pointer ${
            isLoupeActive
              ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian shadow-gold-glow-lg'
              : 'bg-obsidian-elevated/90 hover:bg-obsidian-elevated text-parchment border border-gold/40'
          }`}
        >
          {isLoupeActive ? (
            <ZoomOut className="w-4 h-4" />
          ) : (
            <ZoomIn className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
          )}
          <span>
            {isLoupeActive
              ? locale === 'ckb'
                ? 'داخستنی هاوێنەی زووم'
                : locale === 'ar'
                ? 'إيقاف العدسة المكبرة'
                : 'Exit Magnifier Loupe'
              : locale === 'ckb'
              ? 'هاوێنەی وردبینی ۲.٥× (Loupe)'
              : locale === 'ar'
              ? 'عدسة الفحص المجهري (Loupe)'
              : 'Inspect Brushwork (2.5×)'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
