'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export function OfflineBanner() {
  const { locale } = useLanguage();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4 }}
          className="fixed top-20 inset-x-4 max-w-lg mx-auto z-50 print:hidden"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-obsidian-surface via-[#18181f] to-obsidian-surface border border-gold/50 shadow-gold-glow backdrop-blur-2xl text-xs text-parchment">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-full bg-gold/20 text-gold">
                <WifiOff className="w-3.5 h-3.5" />
              </span>
              <div className="flex flex-col text-start">
                <span className="font-bold text-gold-light">
                  {locale === 'ckb'
                    ? 'حاڵەتی مۆزەخانەی ئۆفلاین چالاکە'
                    : locale === 'ar'
                    ? 'وضع المعرض بدون اتصال بالإنترنت'
                    : 'Offline Exhibition Mode Active'}
                </span>
                <span className="text-[10px] text-museum-secondary">
                  {locale === 'ckb'
                    ? 'هەموو بەرهەمەکان و مۆدێلەکان لە بیرگەی مۆبایلەکەت پارێزراون.'
                    : 'Collection & 3D models cached locally for seamless browsing.'}
                </span>
              </div>
            </div>

            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
