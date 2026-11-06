'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { FileUploadDropzone } from '@/components/admin/FileUploadDropzone';
import { FacultyMember } from '@/types/faculty';
import { 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  PlusCircle, 
  User, 
  GraduationCap, 
  Mail, 
  MapPin, 
  Sparkles,
  Sliders
} from 'lucide-react';

const PRESET_FACULTY_AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
];

export default function NewFacultyPage() {
  const router = useRouter();
  const { faculty, addFaculty } = useArchive();
  const { locale, isRTL } = useLanguage();

  const [langTab, setLangTab] = useState<'ckb' | 'ar' | 'en'>('ckb');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  // Form State
  const [nameCkb, setNameCkb] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');

  const [roleCkb, setRoleCkb] = useState('مامۆستای بەشی شێوەکاری');
  const [roleAr, setRoleAr] = useState('أستاذ قسم الفن التشكيلي');
  const [roleEn, setRoleEn] = useState('Professor of Fine Arts');

  const [deptCkb, setDeptCkb] = useState('بەشی شێوەکاری');
  const [deptAr, setDeptAr] = useState('قسم الفن التشكيلي');
  const [deptEn, setDeptEn] = useState('Painting Department');

  const [bioCkb, setBioCkb] = useState('');
  const [bioAr, setBioAr] = useState('');
  const [bioEn, setBioEn] = useState('');

  const [avatarUrl, setAvatarUrl] = useState(PRESET_FACULTY_AVATARS[0]);
  const [email, setEmail] = useState('');
  const [officeLocationCkb, setOfficeLocationCkb] = useState('باڵەخانەی ئەکادیمی، ژووری مامۆستایان');
  const [degreesText, setDegreesText] = useState('ماستەر لە هونەرە جوانەکان - زانکۆی بەغدا');
  const [order, setOrder] = useState(faculty.length + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedSlug = (nameEn || nameCkb)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);

    const parsedDegrees = degreesText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((deg) => ({
        ckb: deg,
        ar: deg,
        en: deg,
      }));

    const newFaculty: FacultyMember = {
      id: generatedSlug,
      slug: generatedSlug,
      name: {
        ckb: nameCkb || 'مامۆستای پەیمانگا',
        ar: nameAr || nameCkb || 'أستاذ المعهد',
        en: nameEn || 'Institute Professor',
      },
      role: {
        ckb: roleCkb,
        ar: roleAr,
        en: roleEn,
      },
      department: {
        ckb: deptCkb,
        ar: deptAr,
        en: deptEn,
      },
      bio: {
        ckb: bioCkb || 'مامۆستا و پەروەردەکاری دێرین لە پەیمانگای هونەرە جوانەکانی چەمچەماڵ.',
        ar: bioAr || bioCkb || 'أكاديمي وأستاذ بمعهد الفنون الجميلة بجمجمال.',
        en: bioEn || 'Educator and faculty member at Chamchamal Fine Arts Institute.',
      },
      avatarUrl: avatarUrl || PRESET_FACULTY_AVATARS[0],
      academicDegrees: parsedDegrees.length > 0 ? parsedDegrees : [
        {
          ckb: 'ماستەر لە هونەرە جوانەکان',
          ar: 'ماجستير الفنون الجميلة',
          en: 'Master of Fine Arts',
        },
      ],
      contactEmail: email || `${generatedSlug}@cfa-chamchamal.edu.krd`,
      officeLocation: {
        ckb: officeLocationCkb,
        ar: officeLocationCkb,
        en: officeLocationCkb,
      },
      order: Number(order) || 10,
    };

    addFaculty(newFaculty);
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
                ? 'تۆمارکردنی ئەندامی نوێی دەستەی کارگێڕی یان مامۆستا'
                : 'Register Faculty & Administration Member'}
            </h1>
            <p className="text-xs text-museum-secondary">
              {locale === 'ckb'
                ? 'ناسنامەی فەرمی ئەکادیمی، پۆست، خاوەن بڕوانامە و ئیمەیڵی پەیوەندی'
                : 'Register administrative leaders and academic faculty for the public showcase.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-gold/15 text-gold border border-gold/30">
              Faculty Registry
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
                  {locale === 'ckb' ? 'ئەندامی دەستە بە سەرکەوتوویی تۆمارکرا!' : 'Faculty member registered successfully!'}
                </h4>
                <p className="text-xs text-emerald-400/80">
                  {locale === 'ckb'
                    ? 'ئێستا لە لاپەڕەی دەستەی کارگێڕیدا دەردەکەوێت.'
                    : 'Now displayed in the public faculty showcase.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/about/faculty"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-colors"
              >
                <span>{locale === 'ckb' ? 'بینینی لاپەڕەی مامۆستایان' : 'View Faculty Page'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setCreatedSlug(null)}
                className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
              >
                {locale === 'ckb' ? 'تۆمارکردنی یەکێکی تر' : 'Register Another'}
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1: Names & Titles */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-museum-divider pb-4">
              <div>
                <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif">
                  <User className="w-4 h-4 text-gold" />
                  <span>{locale === 'ckb' ? 'ناوی ئەکادیمی و پێگە' : 'Academic Identity & Leadership Post'}</span>
                </h2>
              </div>

              {/* Language Switcher */}
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
                    ناوی تەواو بە کوردی سۆرانی *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameCkb}
                    onChange={(e) => setNameCkb(e.target.value)}
                    placeholder="نموونە: مامۆستا کامەران کەریم"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      ناونیشانی کارگێڕی یان پۆست
                    </label>
                    <input
                      type="text"
                      value={roleCkb}
                      onChange={(e) => setRoleCkb(e.target.value)}
                      placeholder="نموونە: سەرۆکی بەشی شێوەکاری"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      بەش / هۆبە
                    </label>
                    <input
                      type="text"
                      value={deptCkb}
                      onChange={(e) => setDeptCkb(e.target.value)}
                      placeholder="نموونە: بەشی شێوەکاری و ڕەنگ"
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    کورتەی ژیاننامەی ئەکادیمی و ئەزموونی وانەوتنەوە
                  </label>
                  <textarea
                    rows={3}
                    value={bioCkb}
                    onChange={(e) => setBioCkb(e.target.value)}
                    placeholder="پوختەیەک لەسەر ئەزموون و کارەکانی..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}

            {langTab === 'ar' && (
              <div className="flex flex-col gap-4 text-start" dir="rtl">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    الاسم الكامل بالعربية
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: أ. كامران كريم"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      المنصب أو اللقب الأكاديمي
                    </label>
                    <input
                      type="text"
                      value={roleAr}
                      onChange={(e) => setRoleAr(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      القسم
                    </label>
                    <input
                      type="text"
                      value={deptAr}
                      onChange={(e) => setDeptAr(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    السيرة الذاتية الأكاديمية
                  </label>
                  <textarea
                    rows={3}
                    value={bioAr}
                    onChange={(e) => setBioAr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}

            {langTab === 'en' && (
              <div className="flex flex-col gap-4 text-start" dir="ltr">
                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Full Name in English
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Prof. Kamaran Karim"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      Academic Role / Post
                    </label>
                    <input
                      type="text"
                      value={roleEn}
                      onChange={(e) => setRoleEn(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-parchment mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={deptEn}
                      onChange={(e) => setDeptEn(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-parchment mb-1">
                    Academic Biography
                  </label>
                  <textarea
                    rows={3}
                    value={bioEn}
                    onChange={(e) => setBioEn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Portrait Upload */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-4">
            <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'وێنەی پۆرترەیتی ئەکادیمی' : 'Academic Portrait Photo'}</span>
            </h2>

            <FileUploadDropzone
              mediaType="image"
              value={avatarUrl}
              label={locale === 'ckb' ? 'وێنەی مامۆستا (JPG, PNG, WebP)' : 'Portrait Photo (JPG, PNG, WebP)'}
              optional={false}
              presets={PRESET_FACULTY_AVATARS.map((url, i) => ({ label: `Faculty Preset ${i + 1}`, url }))}
              onChange={(url) => setAvatarUrl(url)}
            />
          </div>

          {/* Section 3: Academic Degrees, Email & Order */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-4">
            <h2 className="text-sm font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <GraduationCap className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'بڕوانامەکان و پەیوەندی' : 'Qualifications & Contact'}</span>
            </h2>

            <div>
              <label className="block text-xs font-medium text-parchment mb-1">
                بڕوانامە و زانکۆ دەرچووەکان (هەر بڕوانامەیەک لە دێڕێک)
              </label>
              <textarea
                rows={2}
                value={degreesText}
                onChange={(e) => setDegreesText(e.target.value)}
                placeholder="ماستەر لە هونەرە جوانەکان - زانکۆی بەغدا..."
                className="w-full px-4 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'ئیمەیڵی فەرمی' : 'Official Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="faculty@cfa-chamchamal.edu.krd"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'شوێنی ئۆفیس' : 'Office Location'}
                </label>
                <input
                  type="text"
                  value={officeLocationCkb}
                  onChange={(e) => setOfficeLocationCkb(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-parchment mb-1">
                  {locale === 'ckb' ? 'ڕیزبەندی پیشاندان (Order)' : 'Display Order'}
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment font-mono outline-none focus:border-gold text-center"
                />
              </div>
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
                  ? (locale === 'ckb' ? 'خەریکی تۆمارکردن...' : 'Registering...')
                  : (locale === 'ckb' ? 'تۆمارکردنی مامۆستا لە دەستە' : 'Register Faculty Member')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </AdminAuthGuard>
  );
}
