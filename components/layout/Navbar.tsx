'use client';

import React, { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigationTransition } from '@/context/NavigationTransitionContext';
import { 
  Menu, 
  X, 
  Palette, 
  Sparkles, 
  Box, 
  GraduationCap, 
  Building2, 
  Globe, 
  ChevronRight,
  Loader2
} from 'lucide-react';

export function Navbar() {
  const { locale, setLocale, availableLanguages, t, isRTL } = useLanguage();
  const { navigateTo, prefetch, navigatingHref } = useNavigationTransition();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Track scroll depth for dynamic glass elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      id: 'gallery',
      href: '/',
      label: t.nav.gallery,
      icon: Palette,
      isActive: pathname === '/',
    },
    {
      id: 'scan3d',
      href: '/artworks/chamchamal-freedom-monument',
      label: t.nav.scan3d,
      icon: Box,
      isActive: pathname.startsWith('/artworks'),
      hasPulse: true,
    },
    {
      id: 'tools',
      href: '/tools',
      label: t.nav.tools,
      icon: Sparkles,
      isActive: pathname.startsWith('/tools'),
    },
    {
      id: 'students',
      href: '/students',
      label: t.nav.students,
      icon: GraduationCap,
      isActive: pathname.startsWith('/students'),
    },
    {
      id: 'faculty',
      href: '/about/faculty',
      label: t.nav.faculty,
      icon: Building2,
      isActive: pathname.startsWith('/about'),
    },
    {
      id: 'collaborators',
      href: '/collaborators',
      label: t.nav.collaborators,
      icon: Globe,
      isActive: pathname.startsWith('/collaborators'),
    },
  ];

  return (
    <header className="fixed top-2 inset-x-2 sm:top-4 sm:inset-x-5 md:inset-x-8 z-50 max-w-7xl mx-auto print:hidden">
      {/* Premium 3D-Effect Museum Glassmorphism Navigation Capsule */}
      <nav
        aria-label="Main Navigation"
        className={`relative flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-2xl bg-black/55 border-double border-t-white/10 border-b-gold/20 border-x-white/[0.04] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.85),0_0_25px_rgba(212,175,55,0.08),inset_0_1px_1px_rgba(255,255,255,0.18),inset_0_-1px_2px_rgba(212,175,55,0.15)] transition-all duration-500 ${
          scrolled ? 'bg-black/75 shadow-[0_16px_50px_-8px_rgba(0,0,0,0.95),0_0_30px_rgba(212,175,55,0.12)]' : ''
        }`}
      >
        {/* Specular Edge Highlights */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
        <div className="absolute inset-x-12 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent pointer-events-none" />

        {/* 1. Left: Interstellar Gold-Plated Seal & Official Typography */}
        <a
          href="/"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
              e.preventDefault();
              navigateTo('/');
            }
          }}
          onMouseEnter={() => prefetch('/')}
          onPointerDown={() => prefetch('/')}
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-full shrink-0 cursor-pointer active:scale-95 transition-transform"
        >
          {/* Interstellar Seal Monogram */}
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-obsidian-surface via-black to-obsidian-elevated border border-gold/50 shadow-[0_0_16px_rgba(212,175,55,0.25),inset_0_1px_2px_rgba(255,255,255,0.3)] group-hover:border-gold group-hover:shadow-[0_0_24px_rgba(212,175,55,0.45)] transition-all duration-500 overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/15 transition-colors duration-500" />

            {/* Sacred Geometric 8-Point Interstellar Star SVG */}
            <svg
              className="w-5 h-5 text-gold group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 drop-shadow-[0_0_4px_rgba(212,175,55,0.6)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer Star Radiance */}
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              {/* Inner Concentric Core */}
              <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1" fill="rgba(212,175,55,0.15)" />
              {/* Central Pivot Diamond */}
              <polygon points="12 10 13.5 12 12 14 10.5 12" fill="currentColor" stroke="none" />
            </svg>

            {/* Micro Gold Twinkle Flare */}
            <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-gold shadow-[0_0_6px_#D4AF37] animate-ping opacity-80" />
          </div>

          {/* Typography Moniker & Official Medallion */}
          <div className="flex flex-col text-start">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-wide text-parchment group-hover:text-gold-light transition-colors duration-200">
                {t.instituteName}
              </span>

              {/* 2. Badge: Golden Metallic Medallion "ئەرشیفی فەرمی" */}
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wider bg-gradient-to-br from-amber-500/20 via-gold/15 to-amber-900/40 text-gold-shimmer border border-gold/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_2px_8px_rgba(212,175,55,0.15)] select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_6px_#D4AF37]" />
                <span>{t.archiveBadge}</span>
              </span>
            </div>

            <span className="text-[9px] sm:text-[10px] text-museum-secondary tracking-widest line-clamp-1 font-serif uppercase">
              CHAMCHAMAL FINE ARTS DIGITAL ARCHIVE
            </span>
          </div>
        </a>

        {/* 3. Center: Interactive Navigation Anchors (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full bg-obsidian-elevated/40 border border-white/[0.04] backdrop-blur-md shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isPendingNav = navigatingHref === link.href;

            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    navigateTo(link.href);
                  }
                }}
                onMouseEnter={() => prefetch(link.href)}
                onPointerDown={() => prefetch(link.href)}
                className={`relative px-3.5 py-1.5 text-xs rounded-full transition-all duration-200 focus:outline-none select-none group/link cursor-pointer active:scale-95 ${
                  isPendingNav ? 'opacity-85' : ''
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className={`flex items-center gap-1.5 font-medium transition-colors duration-200 ${
                    link.isActive || isPendingNav
                      ? 'text-parchment-pure font-bold'
                      : 'text-parchment-muted hover:text-parchment'
                  }`}
                >
                  {/* Amber glowing feedback dot when active or navigating */}
                  {isPendingNav ? (
                    <Loader2 className="w-3 h-3 text-gold animate-spin shrink-0" />
                  ) : link.isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#D4AF37] animate-pulse shrink-0" />
                  ) : link.hasPulse ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover/link:bg-gold shrink-0 transition-colors" />
                  ) : null}

                  <span>{link.label}</span>
                </motion.div>

                {/* Thread-Like Horizontal Gold Under-Indicator */}
                {link.isActive && (
                  <motion.div
                    layoutId="navbar-under-indicator"
                    className="absolute -bottom-1 inset-x-2.5 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent rounded-full shadow-[0_0_8px_rgba(212,175,55,0.9)]"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* 4. Right: Segmented Frosted Localization Capsule & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Localization: Multi-Segmented Sliding Frosted Capsule */}
          <div
            role="radiogroup"
            aria-label="Language and Direction Selector"
            className="relative hidden sm:flex items-center p-1 rounded-full bg-black/40 border border-white/5 backdrop-blur-xl shadow-glass-pill"
          >
            <div className="sr-only">Current Language: {locale}</div>

            {availableLanguages.map((lang) => {
              const isSelected = locale === lang.code;

              return (
                <button
                  key={lang.code}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    startTransition(() => {
                      setLocale(lang.code);
                    });
                  }}
                  className={`relative z-10 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 select-none cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'text-parchment-pure font-bold'
                      : 'text-museum-secondary hover:text-parchment'
                  }`}
                >
                  {/* Sliding Frosted Gold Pill */}
                  {isSelected && (
                    <motion.div
                      layoutId="active-language-pill"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/30 via-gold/20 to-gold/30 border border-gold/50 shadow-[0_0_12px_rgba(212,175,55,0.28),inset_0_1px_1px_rgba(255,255,255,0.2)] -z-10"
                    />
                  )}
                  <span className="inline-block">{lang.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Drawer Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-parchment hover:text-gold transition-all focus:outline-none cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-gold" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="lg:hidden mt-2 p-4 rounded-3xl bg-black/85 backdrop-blur-3xl border border-gold/30 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.15)] flex flex-col gap-4 overflow-hidden"
          >
            {/* Mobile Header Medallion */}
            <div className="flex items-center justify-between border-b border-museum-divider pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_#D4AF37]" />
                <span className="text-xs font-bold text-parchment font-serif">
                  {t.instituteName}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-gold/15 text-gold border border-gold/30">
                {t.archiveBadge}
              </span>
            </div>

            {/* Mobile Links List */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isPendingNav = navigatingHref === link.href;

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => {
                      navigateTo(link.href, () => setMobileMenuOpen(false));
                    }}
                    onPointerDown={() => prefetch(link.href)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer active:scale-95 ${
                      link.isActive || isPendingNav
                        ? 'bg-gold/15 text-gold border border-gold/40 shadow-[0_0_14px_rgba(212,175,55,0.2)]'
                        : 'text-parchment-muted hover:text-parchment hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        link.isActive ? 'bg-gold text-obsidian font-bold shadow-gold-glow' : 'bg-white/5 text-museum-secondary'
                      }`}>
                        {isPendingNav ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span className="text-sm font-semibold">{link.label}</span>
                    </div>

                    {isPendingNav ? (
                      <span className="text-xs font-mono text-gold animate-pulse">Loading...</span>
                    ) : link.isActive ? (
                      <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_6px_#D4AF37] animate-pulse" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-museum-caption rtl:rotate-180" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Localization Segmented Bar */}
            <div className="pt-2 border-t border-museum-divider flex flex-col gap-2">
              <span className="text-[10px] font-mono text-museum-secondary uppercase">
                {locale === 'ckb' ? 'هەڵبژاردنی زمان' : 'Interface Language'}
              </span>
              <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-black/60 border border-white/5">
                {availableLanguages.map((lang) => {
                  const isSelected = locale === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        startTransition(() => {
                          setLocale(lang.code);
                        });
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian shadow-gold-glow'
                          : 'text-museum-secondary hover:text-parchment'
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
