'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { usePathname, useRouter } from 'next/navigation';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Key, 
  Sparkles, 
  PlusCircle, 
  QrCode, 
  LayoutDashboard, 
  Eye, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, curator, login, logout, isHydrated } = useArchive();
  const { locale, isRTL } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(passcode);
    if (!success) {
      setError(true);
    } else {
      setError(false);
      setPasscode('');
    }
  };

  const handleDemoAccess = () => {
    login('chamchamal2026');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    );
  }

  // Not Authenticated: Render Curatorial Security Terminal
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-3xl bg-obsidian-surface/90 border border-gold/40 p-8 sm:p-10 shadow-art-card backdrop-blur-2xl flex flex-col items-center text-center">
          {/* Top Specular Line */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />

          {/* Archival Shield Monogram */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 via-obsidian-elevated to-black border border-gold/50 flex items-center justify-center text-gold shadow-gold-glow mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <span className="text-[10px] tracking-widest uppercase font-serif text-gold">
            CHAMCHAMAL FINE ARTS INSTITUTE
          </span>

          <h1 className="text-2xl font-bold text-parchment-pure mt-1">
            {locale === 'ckb' ? 'دەروازەی کارگێڕی مۆزەخانە' : locale === 'ar' ? 'بوابة أمين المتحف والأرشيف' : 'Curatorial Access Gateway'}
          </h1>

          <p className="text-xs text-museum-secondary mt-2 mb-6">
            {locale === 'ckb'
              ? 'تەنها سەرپەرشتیاران و دەستەی مۆزەخانە دەتوانن بەرهەمی نوێ و کۆدی QR زیاد بکەن.'
              : locale === 'ar'
              ? 'مخصص حصرياً للمشرفين وأمناء الأرشيف لإدراج الأعمال وتوليد اللوحات الإرشادية.'
              : 'Authorized entry for archival cataloging, 3D asset ingestion, and physical plaque printing.'}
          </p>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-3">
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder={locale === 'ckb' ? 'کۆدی نهێنی سەرپەرشتیار...' : locale === 'ar' ? 'رمز مرور أمين المتحف...' : 'Curator Security Passcode...'}
                className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-museum-border focus:border-gold focus:outline-none text-parchment text-sm placeholder:text-museum-caption text-center"
              />
              <Key className="w-4 h-4 text-museum-secondary absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
            </div>

            {error && (
              <span className="text-[11px] text-red-400 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'کۆدەکە هەڵەیە (دەتوانیت دوگمەی خوارەوە دابگریت)' : 'Invalid code (Use instant demo below)'}</span>
              </span>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
            >
              {locale === 'ckb' ? 'چوونەژوورەوەی پارێزراو' : locale === 'ar' ? 'تسجيل الدخول الآمن' : 'Authenticate & Unlock'}
            </button>
          </form>

          {/* Instant 1-Click Demo Passcode Pill */}
          <div className="mt-6 pt-6 border-t border-museum-divider w-full flex flex-col items-center gap-2">
            <span className="text-[10px] text-museum-caption uppercase tracking-wider">
              {locale === 'ckb' ? 'تاقیکردنەوەی خێرا بۆ هەڵسەنگاندن' : 'Evaluation Demo Mode'}
            </span>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="px-4 py-2 rounded-full bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold-light text-xs font-semibold flex items-center gap-2 transition-all shadow-glass-pill"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>{locale === 'ckb' ? 'چوونەژوورەوەی خێرا بە یەک کلیک' : locale === 'ar' ? 'دخول تجريبي فوري بنقرة واحدة' : 'Instant 1-Click Curator Access'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated State: Renders Curator Ribbon + Main Admin Content
  return (
    <div className="flex flex-col gap-8 w-full pb-32 safe-bottom">
      {/* Curator Top Status Bar */}
      <header className="p-4 sm:p-5 rounded-2xl bg-obsidian-surface/90 border border-gold/30 shadow-art-card flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl">
        {/* Profile Info */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gold/50 shadow-inner-gold shrink-0">
            <SafeImage
              src={curator?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'}
              alt="Curator Avatar"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col text-start">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-parchment-pure">
                {curator?.name}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-museum-secondary font-mono">
              {curator?.role}
            </span>
          </div>
        </div>

        {/* Admin Navigation Links */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/admin"
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              pathname === '/admin'
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-parchment-muted hover:text-parchment bg-white/5 border border-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {locale === 'ckb' ? 'دەستەی کارگێڕی' : locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </span>
          </Link>

          <Link
            href="/admin/artworks/new"
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              pathname === '/admin/artworks/new'
                ? 'bg-gold text-obsidian font-bold shadow-gold-glow'
                : 'text-parchment-muted hover:text-parchment bg-white/5 border border-white/5'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>
              {locale === 'ckb' ? 'زیادکردنی بەرهەم' : locale === 'ar' ? 'إدراج عمل' : 'Add Artwork'}
            </span>
          </Link>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            title="Log Out"
            className="p-2 rounded-full text-museum-secondary hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Admin Route Children */}
      {children}
    </div>
  );
}
