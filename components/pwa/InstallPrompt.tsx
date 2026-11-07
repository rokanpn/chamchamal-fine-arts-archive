'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { 
  DownloadCloud, 
  Share, 
  PlusSquare, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Smartphone 
} from 'lucide-react';

export function InstallPrompt() {
  const { locale } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if already in standalone PWA mode
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;

      setIsStandalone(isStandaloneMode);

      // Check if dismissed recently
      const dismissed = sessionStorage.getItem('chamchamal_pwa_prompt_dismissed');
      if (isStandaloneMode || dismissed) return;

      // Detect iOS Safari
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/crios|chrome/.test(userAgent);

      if (isAppleDevice && isSafari) {
        setIsIOS(true);
        // Delay showing to not overwhelm immediate page load
        const timer = setTimeout(() => setShowPrompt(true), 4000);
        return () => clearTimeout(timer);
      }

      // Android / Desktop Chrome PWA prompt handler
      const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        const timer = setTimeout(() => setShowPrompt(true), 3500);
        return () => clearTimeout(timer);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('chamchamal_pwa_prompt_dismissed', 'true');
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="fixed bottom-20 md:bottom-6 inset-x-4 max-w-md mx-auto z-50 print:hidden"
      >
        <div className="relative rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#18181f] dark:via-obsidian-surface dark:to-[#101014] border border-stone-200/90 dark:border-2 dark:border-gold/50 p-5 shadow-lg dark:shadow-art-card backdrop-blur-2xl flex flex-col gap-3 overflow-hidden">
          {/* Close Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 end-3 p-1.5 rounded-full text-museum-secondary hover:text-parchment hover:bg-white/10 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold/30 to-obsidian border border-gold/50 flex items-center justify-center text-gold shadow-gold-glow shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>

            <div className="flex flex-col text-start pe-6">
              <span className="text-[10px] text-gold uppercase tracking-wider font-mono">
                PROGRESSIVE WEB APP (PWA)
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-parchment-pure">
                {locale === 'ckb'
                  ? 'ئەپەکە دابەزێنە سەر مۆبایلەکەت'
                  : locale === 'ar'
                  ? 'تثبيت تطبيق معهد جمجمال'
                  : 'Install Museum PWA'}
              </h4>
            </div>
          </div>

          <p className="text-[11px] text-museum-secondary leading-relaxed">
            {locale === 'ckb'
              ? 'بۆ ئەزموونێکی خێراتر، بینینی مۆدێلە سێ ڕەهەندییەکان و گەڕان لەناو هۆڵەکان بەبێ ئینتەرنێت.'
              : 'Add to your home screen for instantaneous offline loading and haptic 3D exhibition viewing.'}
          </p>

          {/* Action / iOS Guide */}
          {isIOS ? (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-parchment-muted">
              <Share className="w-4 h-4 text-gold shrink-0" />
              <span>
                {locale === 'ckb'
                  ? 'کلیک لە دوگمەی Share بکە، پاشان "Add to Home Screen" هەڵبژێرە.'
                  : 'Tap Share below, then select "Add to Home Screen".'}
              </span>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow hover:shadow-gold-glow-lg transition-all flex items-center justify-center gap-2"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>
                {locale === 'ckb' ? 'دابەزاندنی یەک-کلیک (Install)' : 'Install App to Device'}
              </span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
