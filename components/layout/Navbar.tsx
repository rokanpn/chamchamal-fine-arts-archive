'use client';

import React, { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigationTransition } from '@/context/NavigationTransitionContext';
import { useTheme } from 'next-themes';
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
  Loader2,
  Sun,
  Moon
} from 'lucide-react';

export function Navbar() {
  const { locale, setLocale, availableLanguages, t, isRTL } = useLanguage();
  const { navigateTo, prefetch, navigatingHref } = useNavigationTransition();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

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
        className={`relative flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-2xl transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 dark:bg-black/75 border border-stone-200/90 dark:border-t-white/10 dark:border-b-gold/20 dark:border-x-white/[0.04] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12),0_0_20px_rgba(212,175,55,0.1)] dark:shadow-[0_16px_50px_-8px_rgba(0,0,0,0.95),0_0_30px_rgba(212,175,55,0.12)]'
            : 'bg-white/80 dark:bg-black/55 border border-stone-200/70 dark:border-t-white/10 dark:border-b-gold/20 dark:border-x-white/[0.04] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.08),0_0_15px_rgba(212,175,55,0.06)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.85),0_0_25px_rgba(212,175,55,0.08)]'
        }`}
      >
        {/* Specular Edge Highlights */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-stone-400/20 dark:via-white/25 to-transparent pointer-events-none" />
        <div className="absolute inset-x-12 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent pointer-events-none" />

        {/* 1. Left: Official Dynamic Logo & Official Typography */}
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
          {/* Dynamic Institute Logo Medallion (Transparent in Dark Mode, Solid White in Light Mode) */}
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-obsidian-surface/90 border border-gold/40 shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_0_16px_rgba(212,175,55,0.25)] group-hover:border-gold group-hover:shadow-[0_0_22px_rgba(212,175,55,0.45)] transition-all duration-300 overflow-hidden shrink-0 p-1">
            <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/15 transition-colors duration-500 pointer-events-none" />

            {/* Dark Mode Logo: Transparent background */}
            <img
              src="/logo-dark.png"
              alt={t.instituteName}
              className="w-full h-full object-contain rounded-full hidden dark:block transition-transform duration-300 group-hover:scale-105"
            />

            {/* Light Mode Logo: Solid white background */}
            <img
              src="/logo-light.png"
              alt={t.instituteName}
              className="w-full h-full object-contain rounded-full block dark:hidden transition-transform duration-300 group-hover:scale-105"
            />

            {/* Micro Gold Twinkle Flare */}
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#D4AF37] opacity-80 pointer-events-none" />
          </div>

          {/* Typography Moniker & Official Medallion */}
          <div className="flex flex-col text-start">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-wide text-stone-900 dark:text-parchment group-hover:text-gold-dark dark:group-hover:text-gold-light transition-colors duration-200">
                {t.instituteName}
              </span>

              {/* 2. Badge: Golden Metallic Medallion "ئەرشیفی فەرمی" */}
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wider bg-gold/15 text-gold-dark dark:text-gold-shimmer border border-gold/40 shadow-sm select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_6px_#D4AF37]" />
                <span>{t.archiveBadge}</span>
              </span>
            </div>

            <span className="text-[9px] sm:text-[10px] text-stone-500 dark:text-museum-secondary tracking-widest line-clamp-1 font-serif uppercase">
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

        {/* 4. Right: Theme Switcher Toggle, Segmented Frosted Localization Capsule & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Localization: Multi-Segmented Sliding Frosted Capsule */}
          <div
            role="radiogroup"
            aria-label="Language and Direction Selector"
            className="relative hidden sm:flex items-center p-1 rounded-full bg-stone-100/80 dark:bg-black/40 border border-stone-200/80 dark:border-white/5 backdrop-blur-xl shadow-sm dark:shadow-glass-pill"
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
                      ? 'text-stone-900 dark:text-parchment-pure font-bold'
                      : 'text-stone-600 hover:text-stone-900 dark:text-museum-secondary dark:hover:text-parchment'
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

          {/* Theme Switcher Toggle Button (Sun / Moon) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'گۆڕین بۆ دۆخی ڕۆژ (Light Mode)' : 'گۆڕین بۆ دۆخی شەو (Dark Mode)'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="relative p-2 sm:p-2.5 rounded-full bg-stone-100/90 dark:bg-black/40 hover:bg-gold/15 dark:hover:bg-gold/15 border border-stone-200/90 dark:border-white/10 text-stone-700 dark:text-parchment hover:text-gold-dark dark:hover:text-gold transition-all duration-300 shadow-sm focus:outline-none cursor-pointer active:scale-95 group shrink-0"
          >
            <span className="sr-only">Toggle theme</span>
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-4 h-4 text-stone-700 group-hover:-rotate-12 transition-transform" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile Drawer Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-stone-100/90 dark:bg-white/5 hover:bg-stone-200/80 dark:hover:bg-white/10 active:scale-95 border border-stone-200/90 dark:border-white/10 text-stone-700 dark:text-parchment hover:text-gold-dark dark:hover:text-gold transition-all focus:outline-none cursor-pointer"
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
            className="lg:hidden mt-2 p-4 rounded-3xl bg-white/95 dark:bg-black/85 backdrop-blur-3xl border border-stone-200/90 dark:border-gold/30 shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.15)] flex flex-col gap-4 overflow-hidden"
          >
            {/* Mobile Header Medallion with dynamic logo */}
            <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-museum-divider pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-gold/40 shrink-0">
                  <img src="/logo-dark.png" alt={t.instituteName} className="w-full h-full object-contain hidden dark:block" />
                  <img src="/logo-light.png" alt={t.instituteName} className="w-full h-full object-contain block dark:hidden" />
                </div>
                <span className="text-xs font-bold text-stone-900 dark:text-parchment font-serif">
                  {t.instituteName}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-gold/15 text-gold-dark dark:text-gold border border-gold/30">
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
                        ? 'bg-gold/15 text-gold-dark dark:text-gold border border-gold/40 shadow-sm dark:shadow-[0_0_14px_rgba(212,175,55,0.2)]'
                        : 'text-stone-700 dark:text-parchment-muted hover:text-stone-950 dark:hover:text-parchment hover:bg-stone-100/80 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        link.isActive ? 'bg-gold text-obsidian font-bold shadow-gold-glow' : 'bg-stone-200/60 dark:bg-white/5 text-stone-600 dark:text-museum-secondary'
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
                      <ChevronRight className="w-4 h-4 text-stone-400 dark:text-museum-caption rtl:rotate-180" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Theme Switcher Bar */}
            <div className="pt-2 border-t border-stone-200/80 dark:border-museum-divider flex items-center justify-between">
              <span className="text-[10px] font-mono text-stone-500 dark:text-museum-secondary uppercase">
                {locale === 'ckb' ? 'شێوازی ڕووکار' : 'Appearance'}
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-black/60 border border-stone-200/80 dark:border-white/10 text-xs font-semibold text-stone-800 dark:text-parchment hover:text-gold-dark dark:hover:text-gold cursor-pointer active:scale-95 transition-all"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{locale === 'ckb' ? 'دۆخی ڕۆژ (ڕووناک)' : 'Light Mode'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-stone-700" />
                    <span>{locale === 'ckb' ? 'دۆخی شەو (تاریک)' : 'Dark Mode'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Localization Segmented Bar */}
            <div className="pt-2 border-t border-stone-200/80 dark:border-museum-divider flex flex-col gap-2">
              <span className="text-[10px] font-mono text-stone-500 dark:text-museum-secondary uppercase">
                {locale === 'ckb' ? 'هەڵبژاردنی زمان' : 'Interface Language'}
              </span>
              <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-stone-100/90 dark:bg-black/60 border border-stone-200/80 dark:border-white/5">
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
                          : 'text-stone-600 dark:text-museum-secondary hover:text-stone-900 dark:hover:text-parchment'
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
