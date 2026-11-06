'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { FileUploadDropzone } from '@/components/admin/FileUploadDropzone';
import { Collaborator, CollaborationType } from '@/types/collaborators';
import { 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  PlusCircle, 
  User, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Image as ImageIcon 
} from 'lucide-react';

const PRESET_COLLABORATOR_AVATARS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
];

export default function NewCollaboratorPage() {
  const router = useRouter();
  const { addCollaborator } = useArchive();
  const { locale, isRTL } = useLanguage();

  const [langTab, setLangTab] = useState<'ckb' | 'ar' | 'en'>('ckb');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  // Form State
  const [nameCkb, setNameCkb] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');

  const [artistTitleCkb, setArtistTitleCkb] = useState('شێوەکار و مامۆستای میوان');
  const [artistTitleAr, setArtistTitleAr] = useState('فنان تشكيلي وأستاذ زائر');
  const [artistTitleEn, setArtistTitleEn] = useState('Visiting Master Artist');

  const [countryCkb, setCountryCkb] = useState('کوردستان');
  const [countryAr, setCountryAr] = useState('كردستان');
  const [countryEn, setCountryEn] = useState('Kurdistan');

  const [collaborationType, setCollaborationType] = useState<CollaborationType>('workshop');
  const [collaborationYear, setCollaborationYear] = useState(new Date().getFullYear());

  const [bioCkb, setBioCkb] = useState('');
  const [bioAr, setBioAr] = useState('');
  const [bioEn, setBioEn] = useState('');

  const [curatorialSummaryCkb, setCuratorialSummaryCkb] = useState('');
  const [curatorialSummaryAr, setCuratorialSummaryAr] = useState('');
  const [curatorialSummaryEn, setCuratorialSummaryEn] = useState('');

  const [avatarUrl, setAvatarUrl] = useState(PRESET_COLLABORATOR_AVATARS[0]);
  const [galleryPhotosText, setGalleryPhotosText] = useState(
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80\nhttps://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedSlug = (nameEn || nameCkb)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);

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

    const newCollaborator: Collaborator = {
      id: generatedSlug,
      slug: generatedSlug,
      name: {
        ckb: nameCkb || 'هونەرمەندی هاوبەش',
        ar: nameAr || nameCkb || 'فنان زائر',
        en: nameEn || 'Visiting Artist',
      },
      artistTitle: {
        ckb: artistTitleCkb,
        ar: artistTitleAr,
        en: artistTitleEn,
      },
      country: {
        ckb: countryCkb,
        ar: countryAr,
        en: countryEn,
      },
      bio: {
        ckb: bioCkb || 'هونەرمەندی خاوەن ئەزموون کە بەشداربووە لە چالاکییە هاوبەشەکانی پەیمانگادا.',
        ar: bioAr || bioCkb || 'فنان متميز شارك في فعاليات المعهد المشتركة.',
        en: bioEn || 'Renowned artist who contributed to academic collaborations at the institute.',
      },
      avatarUrl: avatarUrl || PRESET_COLLABORATOR_AVATARS[0],
      collaborationType,
      collaborationTypeLabel: typeLabels[collaborationType],
      collaborationYear: Number(collaborationYear),
      galleryPhotos: parsedPhotos.length > 0 ? parsedPhotos : [avatarUrl],
      curatorialSummary: {
        ckb: curatorialSummaryCkb || 'ئەنجامدانی خولی بەرهەمهێنانی هاوبەش لەگەڵ خوێندکارانی پەیمانگا.',
        ar: curatorialSummaryAr || curatorialSummaryCkb || 'إقامة مشاريع إنتاج فني مشترك مع طلبة المعهد.',
        en: curatorialSummaryEn || curatorialSummaryCkb || 'Conducted collaborative atelier production with Chamchamal students.',
      },
      featured: false,
    };

    addCollaborator(newCollaborator);
    setCreatedSlug(generatedSlug);
    setIsSubmitting(false);
  };

  return (
    <AdminAuthGuard>
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-32">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-museum-divider pb-5">
          <div className="flex flex-col gap-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-xs text-museum-secondary hover:text-gold transition-colors w-fit mb-2"
            >
              {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{locale === 'ckb' ? 'گەڕانەوە بۆ دەستەی بەڕێوەبردن' : 'Back to Curator Portal'}</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-parchment-pure font-serif">
              {locale === 'ckb'
                ? 'تۆمارکردنی هونەرمەندی میوان یان هاوبەشی ئەکادیمی'
                : 'Archive Visiting Artist & Cultural Collaborator'}
            </h1>
            <p className="text-xs text-museum-secondary">
              {locale === 'ckb'
                ? 'ناسنامە، وێنەی وۆرکشۆپ، جۆری هاوبەشی (ماستەرکلاس، ئیقامە، بیناڵی) و دەستکەوت'
                : 'Catalog visiting master artists, residency mentors, and collaborative workshops.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-gold/15 text-gold border border-gold/30">
              Collaborators Registry
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {createdSlug && (
          <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-200">
                  {locale === 'ckb' ? 'هونەرمەندەکە بە سەرکەوتوویی خرایە ئەرشیفەوە!' : 'Collaborator recorded successfully!'}
                </h4>
                <p className="text-xs text-emerald-400/80">
                  {locale === 'ckb'
                    ? 'ئێستا لە لاپەڕەی گشتیی هونەرمەندانی هاوبەشدا دەردەکەوێت.'
                    : 'Now visible in the public collaborators timeline.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/collaborators"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-colors"
              >
                <span>{locale === 'ckb' ? 'بینینی لاپەڕەی هاوبەشەکان' : 'View Collaborators Page'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setCreatedSlug(null)}
                className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
              >
                {locale === 'ckb' ? 'تۆمارکردنی یەکێکی تر' : 'Archive Another'}
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1: Names & Country */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-museum-divider pb-4">
              <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif">
                <Globe className="w-4 h-4 text-gold" />
                <span>{locale === 'ckb' ? 'ناسنامەی هونەرمەندی میوان' : 'Artist Identity & Origin'}</span>
              </h2>

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

            {/* Trilingual Inputs */}
            {langTab === 'ckb' && (
              <div className="flex flex-col gap-4 text-start" dir="rtl">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    ناوی هونەرمەند بە کوردی *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameCkb}
                    onChange={(e) => setNameCkb(e.target.value)}
                    placeholder="نموونە: ئیسماعیل خەیات"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      پسپۆڕی / بواری هونەری
                    </label>
                    <input
                      type="text"
                      value={artistTitleCkb}
                      onChange={(e) => setArtistTitleCkb(e.target.value)}
                      placeholder="نموونە: شێوەکاری مۆدێرن و تاوێرە بەردینەکان"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      وڵات / شار
                    </label>
                    <input
                      type="text"
                      value={countryCkb}
                      onChange={(e) => setCountryCkb(e.target.value)}
                      placeholder="کوردستان / سلێمانی"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    کورتەی ژیاننامە
                  </label>
                  <textarea
                    rows={3}
                    value={bioCkb}
                    onChange={(e) => setBioCkb(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    دەستکەوتی هاوبەشی لەگەڵ قوتابیانی پەیمانگا
                  </label>
                  <textarea
                    rows={2}
                    value={curatorialSummaryCkb}
                    onChange={(e) => setCuratorialSummaryCkb(e.target.value)}
                    placeholder="لە میانەی وۆرکشۆپەکەدا چ بەرهەمێک خوڵقێنرا..."
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}

            {langTab === 'ar' && (
              <div className="flex flex-col gap-4 text-start" dir="rtl">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    اسم الفنان بالعربية
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      المجال الفني
                    </label>
                    <input
                      type="text"
                      value={artistTitleAr}
                      onChange={(e) => setArtistTitleAr(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      البلد / المدينة
                    </label>
                    <input
                      type="text"
                      value={countryAr}
                      onChange={(e) => setCountryAr(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    السيرة الموجزة
                  </label>
                  <textarea
                    rows={3}
                    value={bioAr}
                    onChange={(e) => setBioAr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    نتائج التعاون مع المعهد
                  </label>
                  <textarea
                    rows={2}
                    value={curatorialSummaryAr}
                    onChange={(e) => setCuratorialSummaryAr(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}

            {langTab === 'en' && (
              <div className="flex flex-col gap-4 text-start" dir="ltr">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Artist Name in English
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Ismail Khayat"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      Discipline / Field
                    </label>
                    <input
                      type="text"
                      value={artistTitleEn}
                      onChange={(e) => setArtistTitleEn(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      Country / City
                    </label>
                    <input
                      type="text"
                      value={countryEn}
                      onChange={(e) => setCountryEn(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Curatorial Biography
                  </label>
                  <textarea
                    rows={3}
                    value={bioEn}
                    onChange={(e) => setBioEn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Collaboration Dossier Summary
                  </label>
                  <textarea
                    rows={2}
                    value={curatorialSummaryEn}
                    onChange={(e) => setCuratorialSummaryEn(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Collaboration Type & Year */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-4">
            <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <Calendar className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'شێواز و ساڵی هاوبەشی' : 'Collaboration Type & Date'}</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'workshop', label: 'Workshop / وۆرکشۆپ' },
                { id: 'masterclass', label: 'Masterclass / ماستەرکلاس' },
                { id: 'residency', label: 'Residency / ئیقامەی هونەری' },
                { id: 'biennial', label: 'Biennial / بیناڵی' },
              ].map((type) => (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setCollaborationType(type.id as any)}
                  className={`p-3 rounded-2xl border text-xs font-semibold transition-all ${
                    collaborationType === type.id
                      ? 'bg-gold/20 text-gold-light border-gold shadow-gold-glow'
                      : 'bg-black/30 border-museum-border text-museum-secondary hover:text-parchment'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="w-48 mt-2">
              <label className="block text-xs font-medium text-parchment mb-1">
                {locale === 'ckb' ? 'ساڵی هاوبەشی' : 'Collaboration Year'}
              </label>
              <input
                type="number"
                value={collaborationYear}
                onChange={(e) => setCollaborationYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment font-mono outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Section 3: Portrait & Workshop Photos */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <ImageIcon className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'وێنەی پۆرترەیت و فۆتۆی وۆرکشۆپ' : 'Media: Portrait & Workshop Archive'}</span>
            </h2>

            <FileUploadDropzone
              mediaType="image"
              value={avatarUrl}
              label={locale === 'ckb' ? 'وێنەی سەرەکیی هونەرمەند' : 'Artist Portrait'}
              optional={false}
              presets={PRESET_COLLABORATOR_AVATARS.map((url, i) => ({ label: `Preset ${i + 1}`, url }))}
              onChange={(url) => setAvatarUrl(url)}
            />

            <div>
              <label className="block text-xs font-medium text-parchment mb-1">
                {locale === 'ckb' ? 'لینکی وێنەکانی وۆرکشۆپ و پڕۆژە (هەر لینکێک لە دێڕێک)' : 'Workshop Photography URLs (One per line)'}
              </label>
              <textarea
                rows={3}
                value={galleryPhotosText}
                onChange={(e) => setGalleryPhotosText(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment font-mono outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-museum-divider">
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-museum-secondary hover:text-parchment bg-white/5 transition-colors"
            >
              {locale === 'ckb' ? 'پاشگەزبوونەوە' : 'Cancel'}
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs tracking-wide shadow-gold-glow flex items-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (locale === 'ckb' ? 'خەریکی تۆمارکردن...' : 'Archiving...')
                  : (locale === 'ckb' ? 'تۆمارکردنی هاوبەشی لە ئەرشیف' : 'Archive Collaborator')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </AdminAuthGuard>
  );
}
