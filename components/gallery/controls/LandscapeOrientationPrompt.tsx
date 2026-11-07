'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Sparkles, X, RotateCw } from 'lucide-react';

interface LandscapeOrientationPromptProps {
  locale: 'ckb' | 'ar' | 'en';
  isDismissed: boolean;
  onDismiss: () => void;
}

export function LandscapeOrientationPrompt({
  locale,
  isDismissed,
  onDismiss,
}: LandscapeOrientationPromptProps) {
  const [isPortraitTouch, setIsPortraitTouch] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window === 'undefined') return;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      // Portrait mode on mobile/tablet screens
      const isPortrait = window.innerHeight > window.innerWidth;
      // Screen width under 1024px to target mobile and tablet form factors
      const isMobileScreen = Math.min(window.innerWidth, window.innerHeight) < 900;

      setIsPortraitTouch(isTouch && isPortrait && isMobileScreen);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Automatically hide if dismissed or already rotated to landscape
  if (!isPortraitTouch || isDismissed) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Landscape Orientation Recommendation"
      className="fixed inset-0 z-50 flex items-center justify-center p-5 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in pointer-events-auto"
    >
      <div className="relative max-w-sm w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#14141a]/95 via-obsidian/95 to-[#0b0b0e]/95 border border-gold/40 shadow-[0_25px_60px_rgba(212,175,55,0.2)] flex flex-col items-center text-center gap-4 transition-all">
        {/* Subtle decorative gold light at top */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />

        {/* Dismiss Button in corner */}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3.5 end-3.5 p-1.5 rounded-full text-white/50 hover:text-gold hover:bg-gold/15 active:scale-95 transition-all cursor-pointer"
          title={locale === 'ckb' ? 'داخستن' : locale === 'ar' ? 'إغلاق' : 'Dismiss'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Exhibition Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-[10px] font-mono uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-gold animate-pulse" />
          <span>
            {locale === 'ckb'
              ? 'گەشتی سێ ڕەهەندی • 3D TOUR'
              : locale === 'ar'
              ? 'جولة ثلاثية الأبعاد'
              : '3D VIRTUAL TOUR'}
          </span>
        </div>

        {/* Animated Phone Rotation Visual */}
        <div className="relative w-24 h-24 flex items-center justify-center my-1">
          {/* Subtle Outer Pulsing Halo */}
          <div className="absolute inset-0 rounded-full bg-gold/10 border border-gold/20 animate-ping opacity-30" />

          {/* Circular Rotation Arrow Arc */}
          <svg className="absolute inset-0 w-full h-full text-gold/30" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Animated Tilting Smartphone Graphic */}
          <div className="animate-rotate-phone flex items-center justify-center text-gold">
            <div className="w-12 h-20 rounded-xl border-2 border-gold/80 bg-gradient-to-b from-black/80 to-[#18161f] shadow-gold-glow flex flex-col items-center justify-between p-1.5">
              {/* Top speaker notch */}
              <div className="w-3.5 h-0.5 rounded-full bg-gold/60" />
              {/* Virtual joystick indicator dots on screen */}
              <div className="w-full flex items-center justify-between px-1 opacity-70">
                <div className="w-2 h-2 rounded-full border border-gold animate-pulse" />
                <div className="w-2 h-2 rounded-full border border-gold animate-pulse" />
              </div>
              {/* Home indicator pill */}
              <div className="w-4 h-0.5 rounded-full bg-gold/60" />
            </div>
          </div>
        </div>

        {/* Multilingual Guidance Text */}
        <div className="flex flex-col gap-2">
          <h3 className="text-base sm:text-lg font-bold text-parchment-pure font-serif leading-snug">
            {locale === 'ckb'
              ? 'تکایە مۆبایلەکەت بسوڕێنە بۆ باری ئاسۆیی'
              : locale === 'ar'
              ? 'يرجى تدوير هاتفك إلى الوضع الأفقي'
              : 'Rotate to Landscape for the Best Experience'}
          </h3>

          <p className="text-xs text-white/75 leading-relaxed font-sans px-1">
            {locale === 'ckb'
              ? 'بۆ ئەزموونی سینەمایی تەواو و کۆنتڕۆڵی ئاسان بە جووتە جۆیستیکی سەردەمییانە (Dual Virtual Joysticks)، تکایە ئامێرەکەت بکە بە ئاسۆیی (Landscape).'
              : locale === 'ar'
              ? 'للحصول على أفضل تجربة ثلاثية الأبعاد وتحكم سلس بعصي التحكم الافتراضية، يرجى تدوير جهازك إلى الوضع الأفقي.'
              : 'For the most immersive view and smooth navigation using dual virtual thumbsticks, please turn your device horizontally.'}
          </p>

          <span className="text-[11px] font-mono text-gold/80 mt-1">
            {locale === 'ckb'
              ? 'ئۆتۆماتیکی دەکرێتەوە لەگەڵ سووڕاندنی مۆبایل'
              : 'Auto-activates when rotated • Dual Thumbsticks'}
          </span>
        </div>

        {/* Action Button: Continue in Portrait */}
        <button
          type="button"
          onClick={onDismiss}
          className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-gold/20 active:scale-95 border border-white/15 hover:border-gold/50 text-white/80 hover:text-gold text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
        >
          <span>
            {locale === 'ckb'
              ? 'بەردەوام بە لە باری ستوونی (Portrait)'
              : locale === 'ar'
              ? 'المتابعة بالوضع الرأسي'
              : 'Continue in Portrait'}
          </span>
        </button>
      </div>
    </div>
  );
}
