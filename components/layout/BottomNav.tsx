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
      className="fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto md:hidden print:hidden"
    >
      <div className="relative flex items-center justify-around px-1.5 py-2 rounded-full backdrop-blur-2xl bg-obsidian-surface/90 border border-museum-border shadow-glass-nav">
        {/* Subtle top edge light line */}
        <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

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
              className="relative flex flex-col items-center justify-center flex-1 py-1 focus:outline-none select-none cursor-pointer active:scale-90 transition-transform"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="relative flex flex-col items-center gap-0.5"
              >
                {/* Active Sliding Ambient Gold Glow */}
                {(isActive || isPendingNav) && (
                  <motion.div
                    layoutId="bottom-nav-active-aura"
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 32,
                    }}
                    className="absolute -inset-x-2 -inset-y-1 rounded-full bg-gradient-to-b from-gold/20 to-gold/5 border border-gold/40 shadow-gold-glow -z-10"
                  />
                )}

                {/* Tactile Icon with Optional Floating Badge */}
                <div className="relative">
                  {isPendingNav ? (
                    <Loader2 className="w-4 h-4 text-gold animate-spin" />
                  ) : (
                    <Icon
                      className={`w-4 h-4 transition-colors duration-200 ${
                        isActive ? 'text-gold' : 'text-museum-secondary'
                      }`}
                      strokeWidth={isActive ? 2.2 : 1.7}
                    />
                  )}

                  {dest.badge && !isPendingNav && (
                    <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[8px] font-bold bg-gold text-obsidian uppercase tracking-wider">
                      {dest.badge}
                    </span>
                  )}
                </div>

                {/* Localized Label */}
                <span
                  className={`text-[9px] tracking-tight transition-colors duration-200 truncate max-w-[55px] ${
                    isActive || isPendingNav
                      ? 'text-parchment font-semibold'
                      : 'text-museum-secondary font-medium'
                  }`}
                >
                  {label}
                </span>

                {/* Active Gold Micro-Dot Indicator */}
                {(isActive || isPendingNav) && (
                  <motion.span
                    layoutId="active-dot"
                    className="w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
