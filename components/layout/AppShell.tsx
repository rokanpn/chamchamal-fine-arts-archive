'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { AmbientLighting } from '../ui/AmbientLighting';
import { ServiceWorkerRegister } from '../pwa/ServiceWorkerRegister';
import { OfflineBanner } from '../pwa/OfflineBanner';
import { InstallPrompt } from '../pwa/InstallPrompt';
import { useLanguage } from '@/context/LanguageContext';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { locale, t } = useLanguage();
  const pathname = usePathname();
  const isVirtualTour = pathname === '/virtual-tour' || pathname?.startsWith('/virtual-tour');

  return (
    <div className="relative min-h-screen bg-obsidian text-parchment flex flex-col selection:bg-gold/30 selection:text-gold-dark dark:selection:text-gold-shimmer transition-colors duration-300">
      {/* PWA Service Worker Registration & Offline Toast */}
      <ServiceWorkerRegister />
      <OfflineBanner />

      {/* Museum Ambient Lighting & Atmosphere */}
      <AmbientLighting />

      {/* Floating Top Navigation (Hidden in 3D Virtual Tour which has its own immersive header) */}
      {!isVirtualTour && <Navbar />}

      {/* Main Exhibition Viewport Container */}
      <main
        className={
          isVirtualTour
            ? 'relative z-10 w-full h-screen overflow-hidden p-0 m-0 max-w-none'
            : 'relative z-10 flex-1 flex flex-col pt-20 sm:pt-24 pb-20 md:pb-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full'
        }
      >
        {children}
      </main>

      {/* Floating PWA Install Bottom Prompt (Hidden on 3D Virtual Tour) */}
      {!isVirtualTour && <InstallPrompt />}

      {/* Refined Museum Curatorial Footer (Hidden on 3D Virtual Tour) */}
      {!isVirtualTour && (
        <footer className="relative z-20 border-t border-stone-200/80 dark:border-museum-divider bg-stone-100/60 dark:bg-black/40 backdrop-blur-xl mt-auto py-8 px-4 sm:px-8 print:hidden">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600 dark:text-museum-secondary">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-start">
              <span className="font-semibold text-stone-900 dark:text-parchment">
                {t.instituteName}
              </span>
              <span className="hidden sm:inline text-stone-400 dark:text-museum-caption">•</span>
              <span className="text-[11px] text-stone-500 dark:text-museum-caption font-serif">
                CHAMCHAMAL FINE ARTS DIGITAL ARCHIVE &copy; {new Date().getFullYear()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-stone-500 dark:text-museum-caption text-[11px] font-mono">
              <span>
                {locale === 'ckb'
                  ? 'پاراستنی کەلەپووری هونەری هاوچەرخ'
                  : locale === 'ar'
                  ? 'حفظ التراث الفني المعاصر'
                  : 'Contemporary Art Heritage Preservation'}
              </span>
            </div>
          </div>
        </footer>
      )}

      {/* Floating Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
