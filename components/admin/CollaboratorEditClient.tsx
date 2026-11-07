'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { FileUploadDropzone } from '@/components/admin/FileUploadDropzone';
import { Collaborator, CollaborationType } from '@/types/collaborators';
import { COLLABORATORS_DATA } from '@/data/collaborators';
import { 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Save, 
  User, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Image as ImageIcon,
  Eye,
  AlertTriangle,
  Award
} from 'lucide-react';

const PRESET_COLLABORATOR_AVATARS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
];

interface CollaboratorEditClientProps {
  id: string;
}

export function CollaboratorEditClient({ id }: CollaboratorEditClientProps) {
  const router = useRouter();
  const { collaborators, updateCollaborator, isHydrated } = useArchive();
  const { locale, isRTL } = useLanguage();

  const targetCollab = collaborators.find((c) => c.id === id || c.slug === id) ||
    COLLABORATORS_DATA.find((c) => c.id === id || c.slug === id);

  const [langTab, setLangTab] = useState<'ckb' | 'ar' | 'en'>('ckb');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [nameCkb, setNameCkb] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');

  const [artistTitleCkb, setArtistTitleCkb] = useState('');
  const [artistTitleAr, setArtistTitleAr] = useState('');
  const [artistTitleEn, setArtistTitleEn] = useState('');

  const [countryCkb, setCountryCkb] = useState('');
  const [countryAr, setCountryAr] = useState('');
  const [countryEn, setCountryEn] = useState('');

  const [collaborationType, setCollaborationType] = useState<CollaborationType>('workshop');
  const [collaborationYear, setCollaborationYear] = useState(2024);

  const [bioCkb, setBioCkb] = useState('');
  const [bioAr, setBioAr] = useState('');
  const [bioEn, setBioEn] = useState('');

  const [curatorialSummaryCkb, setCuratorialSummaryCkb] = useState('');
  const [curatorialSummaryAr, setCuratorialSummaryAr] = useState('');
  const [curatorialSummaryEn, setCuratorialSummaryEn] = useState('');

  const [avatarUrl, setAvatarUrl] = useState(PRESET_COLLABORATOR_AVATARS[0]);
  const [galleryPhotosText, setGalleryPhotosText] = useState('');

  // Populate data when targetCollab is found
  useEffect(() => {
    if (targetCollab) {
      setNameCkb(targetCollab.name?.ckb || '');
      setNameAr(targetCollab.name?.ar || '');
      setNameEn(targetCollab.name?.en || '');

      setArtistTitleCkb(targetCollab.artistTitle?.ckb || '');
      setArtistTitleAr(targetCollab.artistTitle?.ar || '');
      setArtistTitleEn(targetCollab.artistTitle?.en || '');

      setCountryCkb(targetCollab.country?.ckb || '');
      setCountryAr(targetCollab.country?.ar || '');
      setCountryEn(targetCollab.country?.en || '');

      setCollaborationType(targetCollab.collaborationType || 'workshop');
      setCollaborationYear(targetCollab.collaborationYear || 2024);

      setBioCkb(targetCollab.bio?.ckb || '');
      setBioAr(targetCollab.bio?.ar || '');
      setBioEn(targetCollab.bio?.en || '');

      setCuratorialSummaryCkb(targetCollab.curatorialSummary?.ckb || '');
      setCuratorialSummaryAr(targetCollab.curatorialSummary?.ar || '');
      setCuratorialSummaryEn(targetCollab.curatorialSummary?.en || '');

      setAvatarUrl(targetCollab.avatarUrl || PRESET_COLLABORATOR_AVATARS[0]);
      setGalleryPhotosText((targetCollab.galleryPhotos || []).join('\n'));
    }
  }, [targetCollab]);

  if (isHydrated && !targetCollab) {
    return (
      <AdminAuthGuard>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-parchment-pure mb-2">
              {locale === 'ckb' ? 'هونەرمەندی هاوبەش نەدۆزرایەوە' : 'Collaborator Record Not Found'}
            </h2>
            <p className="text-museum-secondary text-sm max-w-md">
              {locale === 'ckb' 
                ? 'ئەم هونەرمەندە میوانە لە تۆماری ئەرشیفدا بەردەست نییە.' 
                : 'The requested visiting collaborator profile could not be located.'}
            </p>
          </div>
          <Link
            href="/admin?tab=collaborators"
            className="px-6 py-2.5 rounded-full bg-gold/20 hover:bg-gold text-gold-light hover:text-obsidian font-bold text-xs transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{locale === 'ckb' ? 'گەڕانەوە بۆ ژووری سەرپەرشتیار' : 'Return to Admin Hub'}</span>
          </Link>
        </div>
      </AdminAuthGuard>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCollab) return;
    setIsSubmitting(true);

    const typeLabels: Record<CollaborationType, { ckb: string; ar: string; en: string }> = {
      workshop: { ckb: 'وۆرکشۆپ و خولی ڕاهێنان', ar: 'ورشة عمل وتدريب', en: 'Workshop & Atelier Sessions' },
      masterclass: { ckb: 'ماستەرکلاسی مێژوویی', ar: 'ماستركلاس تخصصي', en: 'Masterclass Symposia' },
      residency: { ckb: 'ئیقامەی هونەری (Residency)', ar: 'إقامة فنية بحثية', en: 'Artistic Residency' },
      biennial: { ckb: 'بیناڵی و مۆزەخانەی هاوبەش', ar: 'بينالي ومعارض مشتركة', en: 'Biennial & Joint Exhibition' },
    };

    const parsedPhotos = galleryPhotosText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const updatedData: Partial<Collaborator> = {
      name: {
        ckb: nameCkb || targetCollab.name.ckb,
        ar: nameAr || nameCkb || targetCollab.name.ar,
        en: nameEn || targetCollab.name.en,
      },
      artistTitle: {
        ckb: artistTitleCkb || targetCollab.artistTitle.ckb,
        ar: artistTitleAr || artistTitleCkb || targetCollab.artistTitle.ar,
        en: artistTitleEn || targetCollab.artistTitle.en,
      },
      country: {
        ckb: countryCkb || targetCollab.country.ckb,
        ar: countryAr || countryCkb || targetCollab.country.ar,
        en: countryEn || targetCollab.country.en,
      },
      bio: {
        ckb: bioCkb,
        ar: bioAr,
        en: bioEn,
      },
      avatarUrl: avatarUrl || targetCollab.avatarUrl,
      collaborationType,
      collaborationTypeLabel: typeLabels[collaborationType],
      collaborationYear: Number(collaborationYear),
      galleryPhotos: parsedPhotos.length > 0 ? parsedPhotos : targetCollab.galleryPhotos,
      curatorialSummary: {
        ckb: curatorialSummaryCkb,
        ar: curatorialSummaryAr,
        en: curatorialSummaryEn,
      },
    };

    updateCollaborator(targetCollab.id || targetCollab.slug, updatedData);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <AdminAuthGuard>
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-32">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-museum-border pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin?tab=collaborators"
              className="p-2 rounded-xl bg-white/5 hover:bg-gold/15 text-museum-secondary hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest">
                <Globe className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'دەستکاریکردنی هونەرمەندی هاوبەش' : 'Edit Visiting Artist'}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-parchment-pure">
                {targetCollab?.name[locale] || targetCollab?.name.ckb || 'Modify Collaborator Record'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/collaborators"
              target="_blank"
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment text-xs flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{locale === 'ckb' ? 'بینینی لاپەڕەی گشتی' : 'Public Directory'}</span>
            </Link>
          </div>
        </div>

        {/* Success Alert Banner */}
        {isSuccess && (
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-emerald-300 font-bold text-sm">
                  {locale === 'ckb' ? 'زانیارییەکان بە سەرکەوتوویی پاشەکەوت کران' : 'Collaborator Profile Updated Successfully'}
                </h4>
                <p className="text-emerald-400/80 text-xs">
                  {locale === 'ckb' 
                    ? 'ناسنامە، وێنەی پڕۆفایل، وێنەکانی وۆرکشۆپ و پڕۆژەی هاوبەش نوێکرانەوە.' 
                    : 'Artistic residency records, workshop gallery, and summary synchronized.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/collaborators"
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'بینینی لاپەڕەی هاوبەشەکان' : 'View Collaborators Page'}</span>
              </Link>
              <Link
                href="/admin?tab=collaborators"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-parchment font-bold text-xs transition-colors"
              >
                {locale === 'ckb' ? 'گەڕانەوە بۆ لیستی هاوبەشەکان' : 'Back to Collaborators Registry'}
              </Link>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1: Identity & Collaboration Focus */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-museum-divider pb-4">
              <div>
                <h2 className="text-base font-bold text-parchment-pure flex items-center gap-2 font-serif">
                  <User className="w-4 h-4 text-gold" />
                  <span>{locale === 'ckb' ? 'ناسنامەی هونەرمەند و ناونیشانی پسپۆڕی' : 'Visiting Artist Identity & Academic Focus'}</span>
                </h2>
                <p className="text-xs text-museum-secondary">
                  {locale === 'ckb' ? 'ناوی هونەرمەند، نازناوی پیشەیی و وڵاتی بنەڕەت بە سێ زمان' : 'Artist name, discipline title, and origin across 3 languages'}
                </p>
              </div>

              {/* Language Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-museum-border self-start sm:self-auto">
                {(['ckb', 'ar', 'en'] as const).map((code) => (
                  <button
                    type="button"
                    key={code}
                    onClick={() => setLangTab(code)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      langTab === code
                        ? 'bg-gold text-obsidian shadow-sm'
                        : 'text-museum-secondary hover:text-parchment'
                    }`}
                  >
                    {code === 'ckb' ? 'کوردی' : code === 'ar' ? 'العربية' : 'EN'}
                  </button>
                ))}
              </div>
            </div>

            {/* Trilingual Names */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={langTab === 'ckb' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  ناوی هونەرمەند (کوردی سۆرانی) *
                </label>
                <input
                  type="text"
                  required
                  value={nameCkb}
                  onChange={(e) => setNameCkb(e.target.value)}
                  placeholder="وەک: ئیسماعیل خەیات"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'ar' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  اسم الفنان (العربية)
                </label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: إسماعيل خياط"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'en' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  Artist Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Ismail Khayat"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Trilingual Title & Discipline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={langTab === 'ckb' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  نازناوی هونەری / پسپۆڕی (کوردی سۆرانی)
                </label>
                <input
                  type="text"
                  value={artistTitleCkb}
                  onChange={(e) => setArtistTitleCkb(e.target.value)}
                  placeholder="وەک: پێشەنگی شێوەکاری و هونەرمەندی تاوێرەکان"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'ar' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  الصفة الفنية (العربية)
                </label>
                <input
                  type="text"
                  value={artistTitleAr}
                  onChange={(e) => setArtistTitleAr(e.target.value)}
                  placeholder="مثال: رائد الفن التشكيلي الكردي"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'en' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  Artist Discipline & Title (English)
                </label>
                <input
                  type="text"
                  value={artistTitleEn}
                  onChange={(e) => setArtistTitleEn(e.target.value)}
                  placeholder="e.g. Master Sculptor & Muralist"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Collaboration Type Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary uppercase">
                {locale === 'ckb' ? 'جۆری چالاکی و هاوبەشی ئەکادیمی' : 'Collaboration Track & Typology'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'workshop', labelCkb: 'وۆرکشۆپ', labelEn: 'Workshop', icon: '🎨' },
                  { key: 'masterclass', labelCkb: 'ماستەرکلاس', labelEn: 'Masterclass', icon: '🏛️' },
                  { key: 'residency', labelCkb: 'ئیقامەی هونەری', labelEn: 'Residency', icon: '🏡' },
                  { key: 'biennial', labelCkb: 'بیناڵی و مۆزەخانە', labelEn: 'Biennial', icon: '✨' },
                ].map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setCollaborationType(type.key as any)}
                    className={`p-3 rounded-2xl border text-start flex items-center gap-3 transition-all ${
                      collaborationType === type.key
                        ? 'bg-gold/15 border-gold text-gold shadow-gold-glow'
                        : 'bg-black/40 border-museum-border text-museum-secondary hover:border-gold/30'
                    }`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-parchment-pure">
                        {locale === 'ckb' ? type.labelCkb : type.labelEn}
                      </span>
                      <span className="text-[10px] text-museum-caption">{type.labelEn}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Country & Collaboration Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span>{locale === 'ckb' ? 'وڵات یان شاری بنەڕەت' : 'Country or Region of Origin'}</span>
                </label>
                <input
                  type="text"
                  value={langTab === 'ckb' ? countryCkb : langTab === 'ar' ? countryAr : countryEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (langTab === 'ckb') setCountryCkb(val);
                    else if (langTab === 'ar') setCountryAr(val);
                    else setCountryEn(val);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                  <span>{locale === 'ckb' ? 'ساڵی هاوبەشی و بەڕێوەچوون' : 'Collaboration Year'}</span>
                </label>
                <input
                  type="number"
                  min="1995"
                  max="2035"
                  value={collaborationYear}
                  onChange={(e) => setCollaborationYear(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Portrait Photography */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-5">
            <h2 className="text-base font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'وێنەی پڕۆفایلی هونەرمەند' : 'Artist Portrait Photography'}</span>
            </h2>

            <FileUploadDropzone
              mediaType="image"
              value={avatarUrl}
              label={locale === 'ckb' ? 'وێنەی پڕۆفایلی هونەرمەندی هاوبەش' : 'Collaborator Portrait Photo'}
              presets={PRESET_COLLABORATOR_AVATARS.map((url, i) => ({ label: `Collaborator Preset ${i + 1}`, url }))}
              onChange={(url) => {
                setAvatarUrl(url);
              }}
            />
          </div>

          {/* Section 3: Biography & Curatorial Project Summary */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <h2 className="text-base font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <Award className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'ژیاننامە و کورتەی پڕۆژەی هاوبەش' : 'Artist Biography & Collaborative Project Summary'}</span>
            </h2>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary">
                {langTab === 'ckb' ? 'ژیاننامەی هونەرمەند (کوردی سۆرانی)' : langTab === 'ar' ? 'السيرة الذاتية (العربية)' : 'Artist Bio (English)'}
              </label>
              <textarea
                rows={3}
                value={langTab === 'ckb' ? bioCkb : langTab === 'ar' ? bioAr : bioEn}
                onChange={(e) => {
                  const val = e.target.value;
                  if (langTab === 'ckb') setBioCkb(val);
                  else if (langTab === 'ar') setBioAr(val);
                  else setBioEn(val);
                }}
                className="w-full p-4 rounded-2xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
              />
            </div>

            {/* Curatorial Summary */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary">
                {langTab === 'ckb' ? 'کورتەی پڕۆژەی هاوبەش لەگەڵ پەیمانگە' : langTab === 'ar' ? 'ملخص المشروع المشترك بالمعهد' : 'Curatorial Impact & Workshop Summary'}
              </label>
              <textarea
                rows={3}
                value={langTab === 'ckb' ? curatorialSummaryCkb : langTab === 'ar' ? curatorialSummaryAr : curatorialSummaryEn}
                onChange={(e) => {
                  const val = e.target.value;
                  if (langTab === 'ckb') setCuratorialSummaryCkb(val);
                  else if (langTab === 'ar') setCuratorialSummaryAr(val);
                  else setCuratorialSummaryEn(val);
                }}
                className="w-full p-4 rounded-2xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
              />
            </div>

            {/* Gallery Photos */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-gold" />
                <span>{locale === 'ckb' ? 'فۆتۆی وۆرکشۆپ و چاڵاکییەکان (بەستەر بە هەر دێڕێک)' : 'Workshop Archive Photography (One URL per line)'}</span>
              </label>
              <textarea
                rows={3}
                value={galleryPhotosText}
                onChange={(e) => setGalleryPhotosText(e.target.value)}
                placeholder="https://images.unsplash.com/...\nhttps://images.unsplash.com/..."
                className="w-full p-3 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold font-mono"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-museum-divider">
            <Link
              href="/admin?tab=collaborators"
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment text-xs font-bold transition-colors"
            >
              {locale === 'ckb' ? 'پاشگەزبوونەوە' : 'Cancel'}
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (locale === 'ckb' ? 'پاشەکەوت دەکرێت...' : 'Saving Changes...')
                  : (locale === 'ckb' ? 'پاشەکەوتکردنی گۆڕانکارییەکان' : 'Save Collaborator Profile')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </AdminAuthGuard>
  );
}
