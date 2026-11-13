'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigationTransition } from '@/context/NavigationTransitionContext';
import { Palette, Sparkles, GraduationCap, Building2, Globe, Loader2 } from 'lucide-react';

interface NavDestination {
  id: string;
  labelKey: 'gallery' | 'tools' | 'students' | 'faculty' | 'collaborators';
  href: string;
  icon: React.ElementType;
  badge?: string;
  matchPrefix?: string;
}

const DESTINATIONS: NavDestination[] = [
  { id: 'gallery', labelKey: 'gallery', href: '/', icon: Palette },
  { id: 'tools', labelKey: 'tools', href: '/tools', icon: Sparkles, matchPrefix: '/tools' },
  { id: 'students', labelKey: 'students', href: '/students', icon: GraduationCap, matchPrefix: '/students' },
  { id: 'faculty', labelKey: 'faculty', href: '/about/faculty', icon: Building2, matchPrefix: '/about' },
  { id: 'collaborators', labelKey: 'collaborators', href: '/collaborators', icon: Globe, matchPrefix: '/collaborators' },
];

export function BottomNav() {
  const { t } = useLanguage();
  const { navigateTo, prefetch, navigatingHref } = useNavigationTransition();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-[max(0.6rem,env(safe-area-inset-bottom))] inset-x-0 z-40 max-w-[320px] xs:max-w-[350px] mx-auto md:hidden landscape:hidden print:hidden px-2 pointer-events-none"
    >
      {/* Sleek Modern Floating App Dock */}
      <div className="relative flex items-center justify-between px-2 py-1 rounded-full backdrop-blur-2xl bg-white/95 dark:bg-black/85 border border-stone-200/90 dark:border-gold/30 shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_14px_45px_rgba(0,0,0,0.9),0_0_24px_rgba(212,175,55,0.15)] pointer-events-auto">
        {/* Subtle top edge specular light line */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-stone-400/25 dark:via-white/20 to-transparent pointer-events-none" />

        {DESTINATIONS.map((dest) => {
          const Icon = dest.icon;
          const isActive = dest.matchPrefix
            ? pathname.startsWith(dest.matchPrefix)
            : pathname === dest.href;
          const isPendingNav = navigatingHref === dest.href;
          const label = t.nav[dest.labelKey];

          return (
            <button
              key={dest.id}
              type="button"
              onClick={() => navigateTo(dest.href)}
              onPointerDown={() => prefetch(dest.href)}
              aria-label={label}
              title={label}
              className="relative flex items-center justify-center w-11 h-10 rounded-full focus:outline-none select-none cursor-pointer active:scale-90 transition-transform"
            >
              <div className="relative flex flex-col items-center justify-center">
                {/* Centered Active State Indicator: Perfectly Proportional Circle */}
                {(isActive || isPendingNav) && (
                  <motion.div
                    layoutId="bottom-nav-active-aura"
                    transition={{
                      type: 'spring',
                      stiffness: 480,
                      damping: 32,
                    }}
                    className="absolute -inset-2 rounded-full bg-gradient-to-b from-gold/25 via-gold/15 to-transparent border border-gold/50 shadow-[0_0_14px_rgba(212,175,55,0.35)] -z-10"
                  />
                )}

                {/* Tactile Icon */}
                <div className="relative flex items-center justify-center">
                  {isPendingNav ? (
                    <Loader2 className="w-5 h-5 text-gold animate-spin" />
                  ) : (
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive
                          ? 'text-gold-dark dark:text-gold'
                          : 'text-stone-500 dark:text-museum-secondary hover:text-stone-800 dark:hover:text-parchment'
                      }`}
                      strokeWidth={isActive ? 2.3 : 1.8}
                    />
                  )}

                  {dest.badge && !isPendingNav && (
                    <span className="absolute -top-0.5 -end-1 w-2 h-2 rounded-full bg-gold shadow-[0_0_6px_#D4AF37]" />
                  )}
                </div>

                {/* Active Micro Gold Dot Indicator Centered Under Icon */}
                {(isActive || isPendingNav) && (
                  <motion.span
                    layoutId="active-dot"
                    className="w-1 h-1 rounded-full bg-gold shadow-[0_0_6px_#D4AF37] mt-0.5"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Screen-reader accessible label (hidden visually for a modern clean icon dock) */}
                <span className="sr-only">{label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
