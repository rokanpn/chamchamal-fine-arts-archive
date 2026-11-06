'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { 
  RotateCw, 
  RotateCcw, 
  Box, 
  Layers, 
  Maximize2, 
  Smartphone, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';

interface ModelViewer3DProps {
  modelUrl: string;
  posterUrl: string;
  title: string;
  vertices?: string;
  polygons?: string;
}

export function ModelViewer3D({
  modelUrl,
  posterUrl,
  title,
  vertices = '380,000 Vertices',
  polygons = '760,000 Polygons',
}: ModelViewer3DProps) {
  const { locale, isRTL } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModuleReady, setIsModuleReady] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const viewerRef = useRef<any>(null);

  // Safely import @google/model-viewer on the client only
  useEffect(() => {
    let mounted = true;
    if (typeof window !== 'undefined') {
      import('@google/model-viewer')
        .then(() => {
          if (mounted) setIsModuleReady(true);
        })
        .catch((err) => {
          console.error('Failed to load @google/model-viewer', err);
        });
    }
    return () => {
      mounted = false;
    };
  }, []);

  const handleResetCamera = () => {
    if (viewerRef.current) {
      viewerRef.current.cameraOrbit = '45deg 75deg 105%';
      viewerRef.current.fieldOfView = 'auto';
      viewerRef.current.jumpCameraToGoal?.();
    }
  };

  const handleToggleAutoRotate = () => {
    setAutoRotate((prev) => !prev);
  };

  const handleActivateAR = () => {
    if (viewerRef.current && typeof viewerRef.current.activateAR === 'function') {
      viewerRef.current.activateAR();
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[580px] rounded-3xl bg-gradient-to-b from-[#131317] via-obsidian-surface to-obsidian border border-museum-border overflow-hidden shadow-art-card flex items-center justify-center">
      {/* Museum Overhead Spotlight Radial Gradient */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gold/10 blur-[100px] pointer-events-none z-10" />

      {/* Model Viewer Container */}
      {isModuleReady ? (
        <model-viewer
          ref={viewerRef}
          src={modelUrl}
          poster={posterUrl}
          alt={title}
          auto-rotate={autoRotate ? true : undefined}
          auto-rotate-delay={1000}
          rotation-per-second="25deg"
          camera-controls
          shadow-intensity="1.6"
          shadow-softness="0.8"
          environment-image="neutral"
          exposure="1.1"
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-orbit="45deg 75deg 105%"
          touch-action="pan-y"
          onLoad={() => setIsLoaded(true)}
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
          className="relative z-20 cursor-grab active:cursor-grabbing focus:outline-none"
        >
          {/* Custom AR Slot Button for mobile devices */}
          <button
            slot="ar-button"
            className="hidden" // We use our luxury bespoke UI button below
          />
        </model-viewer>
      ) : (
        /* Poster Skeleton Loading Stage */
        <div className="relative w-full h-full flex items-center justify-center z-10">
          <SafeImage
            src={posterUrl}
            alt={title}
            fill
            priority
            className="object-cover object-center opacity-40 blur-sm"
          />
          <div className="absolute inset-0 bg-obsidian/60 backdrop-blur-md" />
          <div className="relative z-20 flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            <span className="text-xs text-gold font-medium font-serif tracking-wider">
              {locale === 'ckb' ? 'ئامادەکردنی مۆدێلی ۳D...' : locale === 'ar' ? 'تهيئة المجسم ثلاثي الأبعاد...' : 'Initializing 3D Mesh...'}
            </span>
          </div>
        </div>
      )}

      {/* Top Floating Curatorial Metric Ribbon */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-gold/30 shadow-glass-pill pointer-events-auto">
          <Box className="w-4 h-4 text-gold animate-spin-slow" />
          <span className="text-[11px] font-semibold text-gold-shimmer">
            {locale === 'ckb' ? 'سکانی ۳D فۆتۆگرامەتری' : locale === 'ar' ? 'مسح ثلاثي الأبعاد عالي الدقة' : '3D Photogrammetry Model'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-[11px] text-museum-secondary font-mono pointer-events-auto">
          <span>{vertices}</span>
          <span className="text-gold">•</span>
          <span>{polygons}</span>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 inset-x-4 z-30 flex items-center justify-between gap-3 pointer-events-none">
        {/* Camera and Turntable Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-obsidian-elevated/85 backdrop-blur-2xl border border-museum-border shadow-glass-nav pointer-events-auto">
          <button
            onClick={handleToggleAutoRotate}
            title={autoRotate ? 'Pause Rotation' : 'Start Rotation'}
            className={`p-2 rounded-full transition-colors ${
              autoRotate
                ? 'bg-gold/20 text-gold-light border border-gold/30'
                : 'text-museum-secondary hover:text-parchment hover:bg-white/5'
            }`}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset Camera Angle"
            className="p-2 rounded-full text-museum-secondary hover:text-parchment hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Prominent Floating AR Launch Button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.04 }}
          onClick={handleActivateAR}
          className="group pointer-events-auto flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow hover:shadow-gold-glow-lg transition-all animate-gold-pulse cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-obsidian group-hover:scale-110 transition-transform" />
          <span>
            {locale === 'ckb'
              ? 'لە ژوورەکەتدا بیبینە (AR)'
              : locale === 'ar'
              ? 'عرض في مساحتك (AR)'
              : 'View in Your Space (AR)'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
