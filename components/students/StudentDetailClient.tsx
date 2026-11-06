'use client';

import React from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { motion } from 'framer-motion';
import { StudentArtist, StudentAwardItem, StudentContactLink } from '@/data/students';
import { getArtworkDepartmentLabel } from '@/data/artworks';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  GraduationCap, 
  Award, 
  Medal,
  MapPin, 
  Mail, 
  Phone,
  MessageCircle,
  Instagram,
  Globe,
  Printer, 
  Sparkles, 
  ArrowUpRight, 
  Box, 
  Layers,
  Calendar,
  Building,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Quote
} from 'lucide-react';

interface StudentDetailClientProps {
  student: StudentArtist;
}

interface NormalizedAward {
  id: string;
  title: string;
  year: string;
  issuer: string;
  description?: string;
}

export function StudentDetailClient({ student }: StudentDetailClientProps) {
  const { locale, isRTL } = useLanguage();
  const { artworks: allArtworks } = useArchive();

  const name = student.fullName[locale] || student.fullName.ckb;
  const dept = student.department[locale] || student.department.ckb;
  const cohort = student.cohort[locale] || student.cohort.ckb;
  const bio = student.bio[locale] || student.bio.ckb;
  const statement = student.statement[locale] || student.statement.ckb;
  const studio = student.studioLocation[locale] || student.studioLocation.ckb;

  // Student artworks from dynamic archive
  const artworks = allArtworks.filter((a) =>
    student.artworkSlugs.includes(a.slug)
  );

  // Normalize awards to handle both structured StudentAwardItem and legacy LocalizedString
  const normalizedAwards: NormalizedAward[] = (student.awards || []).map((award, idx) => {
    if (typeof award === 'object' && 'title' in award) {
      const structured = award as StudentAwardItem;
      return {
        id: structured.id || `award-${idx}`,
        title: structured.title,
        year: structured.year || '',
        issuer: structured.issuer || 'پەیمانگای هونەرە جوانەکانی چەمچەماڵ',
        description: structured.description || '',
      };
    } else {
      const localized = award as any;
      return {
        id: `award-${idx}`,
        title: localized[locale] || localized.ckb || localized.en || String(award),
        year: `${student.graduationYear}`,
        issuer: 'پەیمانگای هونەرە جوانەکانی چەمچەماڵ • Chamchamal Fine Arts',
        description: '',
      };
    }
  });

  // Effective Contact Links (explicit contactLinks or fallback email)
  const contactLinks: StudentContactLink[] = student.contactLinks && student.contactLinks.length > 0
    ? student.contactLinks
    : [
        {
          id: 'default-email',
          platform: 'email',
          url: `mailto:${student.email}`,
          displayLabel: student.email,
        },
      ];

  const getContactIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'viber':
        return <MessageCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'website':
        return <Globe className="w-3.5 h-3.5 text-gold shrink-0" />;
      default:
        return <ExternalLink className="w-3.5 h-3.5 text-gold shrink-0" />;
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-14 w-full pb-32 safe-bottom">
      {/* Breadcrumb Navigation & Print Action */}
      <nav
        aria-label="Breadcrumb Navigation"
        className="flex items-center justify-between border-b border-museum-divider pb-4 pt-2 print:hidden"
      >
        <Link
          href="/students"
          className="group inline-flex items-center gap-2 text-xs font-medium text-museum-secondary hover:text-gold transition-colors"
        >
          {isRTL ? (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          ) : (
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          )}
          <span>
            {locale === 'ckb'
              ? 'گەڕانەوە بۆ ڕێبەری خوێندکاران و دەرچووان'
              : locale === 'ar'
              ? 'العودة لدليل الطلاب والخريجين'
              : 'Back to Artists & Alumni Directory'}
          </span>
        </Link>

        {/* Print Portfolio Button */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian text-xs font-bold shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>
            {locale === 'ckb'
              ? 'داگرتنی پۆرتفۆلیۆ (PDF / چاپکردن)'
              : locale === 'ar'
              ? 'تحميل الملف الفني (PDF / طباعة)'
              : 'Download Art Portfolio (PDF)'}
          </span>
        </button>
      </nav>

      {/* 1. Hero Section: Editorial High-Res Avatar, Trilingual Name & Department */}
      <section className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-obsidian-surface/90 via-obsidian-surface/60 to-obsidian border border-museum-border shadow-art-card flex flex-col md:flex-row items-center md:items-start gap-8 print:border-black print:text-black">
        {/* Specular line */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none print:hidden" />

        {/* High-Res Artist Portrait */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-gold/50 shadow-[0_0_24px_rgba(212,175,55,0.3)] shrink-0 bg-obsidian-elevated">
          <SafeImage
            src={student.avatarUrl}
            alt={name}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Artist Moniker & Academic Credentials */}
        <div className="flex flex-col text-center md:text-start flex-1 gap-3">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-gold/15 text-gold border border-gold/30">
              {dept}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono text-parchment-muted bg-white/5 border border-white/10">
              {cohort}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-parchment-pure print:text-black font-serif">
            {name}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-1 gap-x-4 text-xs text-museum-secondary mt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>{studio}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-mono">
              <GraduationCap className="w-3.5 h-3.5 text-gold" />
              <span>Class of {student.graduationYear}</span>
            </span>
          </div>

          {/* Disciplines Chips */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
            {student.disciplines.map((d, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-full text-[11px] bg-obsidian-elevated text-parchment-muted border border-white/5"
              >
                {d[locale] || d.ckb}
              </span>
            ))}
          </div>

          {/* 2. Contact Action Bar: Glassmorphism Pill Buttons */}
          {contactLinks.length > 0 && (
            <div className="pt-3 mt-1 border-t border-museum-divider flex flex-wrap items-center justify-center md:justify-start gap-2.5 print:hidden">
              {contactLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-gold/15 border border-white/10 hover:border-gold/40 text-xs font-medium text-parchment hover:text-gold transition-all duration-300 shadow-glass-pill group"
                >
                  {getContactIcon(link.platform)}
                  <span className="font-mono text-[11px]">{link.displayLabel}</span>
                  <ArrowUpRight className="w-3 h-3 text-museum-caption group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. The Artist Statement: "The Masterpiece Quote" Editorial Block */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative p-8 sm:p-12 md:p-14 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-gold/[0.07] via-obsidian-surface/90 to-obsidian border border-gold/25 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group print:border-black print:text-black"
      >
        {/* Specular line & ambient glow */}
        <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none print:hidden" />
        <div className="absolute -top-20 start-1/2 -translate-x-1/2 w-96 h-40 bg-gold/10 blur-3xl rounded-full pointer-events-none print:hidden" />

        {/* Giant faint glowing gold quotation watermark icon */}
        <Quote
          className="absolute -top-6 -end-6 w-36 h-36 sm:w-48 sm:h-48 text-gold/10 group-hover:text-gold/15 transition-all duration-700 transform rotate-12 pointer-events-none select-none print:hidden"
          aria-hidden="true"
        />

        {/* Editorial Subheader Badge */}
        <div className="flex items-center gap-2.5 mb-6 relative z-10">
          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono tracking-widest text-gold uppercase font-semibold">
            {locale === 'ckb'
              ? 'ڕاگەیاندراوی هونەری • ARTIST STATEMENT'
              : locale === 'ar'
              ? 'البيان الفني • ARTIST STATEMENT'
              : 'ARTIST STATEMENT • FINE ARTS PHILOSOPHY'}
          </span>
        </div>

        {/* Editorial Masterpiece Quote */}
        <blockquote className="relative z-10 my-2">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif text-parchment-pure font-light leading-relaxed sm:leading-loose tracking-wide italic">
            <span className="text-gold font-serif text-3xl sm:text-4xl me-2">&ldquo;</span>
            {statement}
            <span className="text-gold font-serif text-3xl sm:text-4xl ms-2">&rdquo;</span>
          </p>
        </blockquote>

        {/* Curatorial Attribution Footer */}
        <div className="mt-8 pt-6 border-t border-gold/15 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-museum-secondary relative z-10 print:border-black">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span className="text-gold font-serif font-bold text-sm tracking-wide">{name}</span>
            <span className="text-museum-caption">•</span>
            <span className="text-museum-caption">{dept}</span>
          </div>
          <div className="flex items-center gap-3 text-museum-caption text-[11px]">
            <span>{studio}</span>
            <span>•</span>
            <span className="text-gold/80 font-mono">Chamchamal Fine Arts Archive</span>
          </div>
        </div>
      </motion.section>

      {/* 4. Biography: "The Academic Dossier" Curatorial Panel */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative p-8 sm:p-10 rounded-3xl bg-white/[0.02] border-s-4 border-s-gold border-y border-e border-white/5 backdrop-blur-xl shadow-art-card overflow-hidden group print:border-black print:text-black"
      >
        {/* Subtle background academic watermark */}
        <div className="absolute top-0 end-0 p-6 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity print:hidden">
          <GraduationCap className="w-36 h-36 text-gold" />
        </div>

        {/* Header & Verification Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold">
              <GraduationCap className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-white/40 font-mono block">
                INSTITUTIONAL CURATORIAL DOSSIER
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-parchment-pure mt-0.5">
                {locale === 'ckb'
                  ? 'ژیاننامە و ڕێڕەوی ئەکادیمی'
                  : locale === 'ar'
                  ? 'السيرة الأكاديمية والمسار الفني'
                  : 'Curatorial Biography & Academic Dossier'}
              </h2>
            </div>
          </div>

          {/* Official Verification Seal Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-[11px] text-gold font-mono shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>
              {locale === 'ckb'
                ? 'تۆماری فەرمی پەیمانگا'
                : locale === 'ar'
                ? 'سجل أكاديمي موثق'
                : 'Verified Academic Record'}
            </span>
          </div>
        </div>

        {/* Biography Text Body */}
        <div className="prose prose-invert max-w-none text-museum-secondary text-sm sm:text-base leading-relaxed sm:leading-loose whitespace-pre-line font-light relative z-10">
          {bio}
        </div>

        {/* Academic Dossier Curatorial Metadata Grid */}
        <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-mono relative z-10 print:border-black">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">
              {locale === 'ckb' ? 'بەش' : locale === 'ar' ? 'القسم' : 'Department'}
            </span>
            <span className="text-parchment font-semibold truncate">{dept}</span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">
              {locale === 'ckb' ? 'خول / ساڵ' : locale === 'ar' ? 'الدورة / التخرج' : 'Cohort / Class'}
            </span>
            <span className="text-gold font-semibold truncate">{student.graduationYear} • {cohort}</span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">
              {locale === 'ckb' ? 'ستۆدیۆ' : locale === 'ar' ? 'المرسم' : 'Studio Base'}
            </span>
            <span className="text-parchment font-semibold truncate">{studio}</span>
          </div>
          <div className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">
              {locale === 'ckb' ? 'کۆدی پێناسی ئەرشیف' : locale === 'ar' ? 'معرف الأرشيف' : 'Archive ID'}
            </span>
            <span className="text-parchment-muted font-mono text-[11px] truncate">CFA-{student.id.toUpperCase()}</span>
          </div>
        </div>
      </motion.section>

      {/* 5. Awards & Certificates: "The Prestige Showcase" */}
      {normalizedAwards.length > 0 && (
        <section className="flex flex-col gap-6">
          {/* Header with Glowing Radial Ambient Background */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gold/[0.12] via-obsidian-surface/60 to-transparent border border-gold/20 overflow-hidden flex flex-wrap items-center justify-between gap-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_start,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/30 via-gold/10 to-amber-900/40 text-gold border border-gold/40 flex items-center justify-center shadow-gold-glow-sm">
                <Medal className="w-6 h-6 text-gold" />
              </div>
              <div>
                <span className="text-[10px] text-gold font-mono tracking-widest uppercase block font-semibold">
                  PRESTIGE & MERIT SHOWCASE • دەستکەوت و بڕوانامەکان
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-parchment-pure font-serif">
                  {locale === 'ckb'
                    ? 'خەڵات، ڕێزلێنان و بڕوانامە فەرمییەکان'
                    : locale === 'ar'
                    ? 'الجوائز والأوسمة والشهادات التقديرية'
                    : 'Honors, Awards & Certified Distinctions'}
                </h2>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2">
              <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-gold/15 border border-gold/30 text-gold shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {normalizedAwards.length}{' '}
                  {locale === 'ckb' ? 'خەڵاتی ڕێزلێنان' : locale === 'ar' ? 'تكريم' : 'Honors Cataloged'}
                </span>
              </span>
            </div>
          </div>

          {/* 3D-Lift Card Grid with Staggered Framer Motion entrance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {normalizedAwards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 hover:border-gold/40 shadow-art-card hover:shadow-[0_15px_40px_rgba(212,175,55,0.18)] transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between gap-5 group overflow-hidden"
              >
                {/* Soft Glowing Watermark Medal in Background */}
                <Medal
                  className="absolute -bottom-4 -end-4 w-32 h-32 text-gold/[0.04] group-hover:text-gold/[0.1] transition-all duration-700 pointer-events-none transform -rotate-12 group-hover:scale-110"
                  aria-hidden="true"
                />

                {/* Engraved Brass Plate Year Badge */}
                {award.year && (
                  <div
                    className={`absolute top-0 end-0 px-4 py-1.5 bg-gradient-to-br from-gold via-amber-500 to-amber-700 text-obsidian font-mono font-extrabold text-xs tracking-wider shadow-md ${
                      isRTL ? 'rounded-br-2xl rounded-tl-xl' : 'rounded-bl-2xl rounded-tr-xl'
                    }`}
                  >
                    {award.year}
                  </div>
                )}

                <div className="flex items-start gap-4 pe-14">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/25 via-gold/10 to-amber-900/30 text-gold border border-gold/40 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-gold-glow-sm transition-all duration-300">
                    <Award className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-parchment-pure group-hover:text-gold-light transition-colors font-serif leading-snug">
                      {award.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-museum-secondary mt-1">
                      <Building className="w-3.5 h-3.5 text-gold/70 shrink-0" />
                      <span className="truncate">{award.issuer}</span>
                    </div>
                  </div>
                </div>

                {award.description && (
                  <p className="text-xs sm:text-sm text-museum-caption group-hover:text-museum-secondary transition-colors leading-relaxed ps-1 pt-1 border-t border-white/5">
                    {award.description}
                  </p>
                )}

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-museum-caption">
                  <span className="flex items-center gap-1.5 text-gold/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                    <span>Verified Institute Distinction</span>
                  </span>
                  <span className="text-white/30">#CHAM-{String(index + 1).padStart(2, '0')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Portfolio Gallery: Chronological Gallery of Artworks */}
      <section className="flex flex-col gap-6 pt-4">
        <div className="flex items-center justify-between border-b border-museum-divider pb-4">
          <div>
            <span className="text-[10px] text-gold font-mono tracking-widest uppercase block">
              CATALOGED RETROSPECTIVE
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-parchment-pure font-serif mt-0.5">
              {locale === 'ckb'
                ? 'شاکارەکانی نێو ئەرشیفی دیجیتاڵی'
                : locale === 'ar'
                ? 'الأعمال المؤرشفة في المعرض الدائم'
                : 'Archived Masterworks'}
            </h2>
          </div>
          <span className="text-xs text-museum-secondary">
            {artworks.length} {locale === 'ckb' ? 'بەرهەم' : locale === 'ar' ? 'أعمال' : 'Works'}
          </span>
        </div>

        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <Link
                key={art.id}
                href={`/artworks/${art.slug}`}
                className="group relative rounded-3xl bg-obsidian-surface/80 border border-museum-border hover:border-gold/50 shadow-art-card overflow-hidden flex flex-col transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full bg-obsidian-elevated overflow-hidden">
                  <SafeImage
                    src={art.imageUrl}
                    alt={art.title[locale] || art.title.ckb}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />

                  {art.has3DModel && (
                    <div className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-gold border border-gold/30 flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5 animate-spin-slow" />
                      <span>3D / AR</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col gap-2">
                  <span className="text-[10px] text-gold uppercase tracking-wider">
                    {getArtworkDepartmentLabel(art.departmentLabel || art.department, locale)} • {art.year}
                  </span>
                  <h3 className="text-base font-bold text-parchment-pure group-hover:text-gold-light truncate transition-colors">
                    {art.title[locale] || art.title.ckb}
                  </h3>
                  <p className="text-xs text-museum-secondary line-clamp-2">
                    {art.medium[locale] || art.medium.ckb}
                  </p>
                  <div className="mt-3 pt-3 border-t border-museum-divider flex items-center justify-between text-[11px] text-museum-secondary">
                    <span>{art.dimensions}</span>
                    <span className="text-gold flex items-center gap-1">
                      <span>Explore</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-obsidian-surface/40 border border-museum-border text-center text-museum-secondary text-xs">
            {locale === 'ckb'
              ? 'هیچ بەرهەمێکی پەیوەندیدار بەم خوێندکارە لە ئەرشیفدا تۆمار نەکراوە.'
              : 'No archived masterworks currently linked to this student profile.'}
          </div>
        )}
      </section>
    </div>
  );
}
