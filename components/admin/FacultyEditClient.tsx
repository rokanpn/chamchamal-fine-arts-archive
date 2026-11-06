'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { FileUploadDropzone } from '@/components/admin/FileUploadDropzone';
import { FacultyMember } from '@/types/faculty';
import { FACULTY_DATA } from '@/data/faculty';
import { 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Save, 
  User, 
  GraduationCap, 
  Mail, 
  MapPin, 
  Sparkles,
  Sliders,
  Eye,
  AlertTriangle
} from 'lucide-react';

const PRESET_FACULTY_AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
];

interface FacultyEditClientProps {
  id: string;
}

export function FacultyEditClient({ id }: FacultyEditClientProps) {
  const router = useRouter();
  const { faculty, updateFaculty, isHydrated } = useArchive();
  const { locale, isRTL } = useLanguage();

  const targetMember = faculty.find((f) => f.id === id || f.slug === id) ||
    FACULTY_DATA.find((f) => f.id === id || f.slug === id);

  const [langTab, setLangTab] = useState<'ckb' | 'ar' | 'en'>('ckb');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [nameCkb, setNameCkb] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');

  const [roleCkb, setRoleCkb] = useState('');
  const [roleAr, setRoleAr] = useState('');
  const [roleEn, setRoleEn] = useState('');

  const [deptCkb, setDeptCkb] = useState('');
  const [deptAr, setDeptAr] = useState('');
  const [deptEn, setDeptEn] = useState('');

  const [bioCkb, setBioCkb] = useState('');
  const [bioAr, setBioAr] = useState('');
  const [bioEn, setBioEn] = useState('');

  const [avatarUrl, setAvatarUrl] = useState(PRESET_FACULTY_AVATARS[0]);
  const [email, setEmail] = useState('');
  const [officeLocationCkb, setOfficeLocationCkb] = useState('');
  const [officeLocationAr, setOfficeLocationAr] = useState('');
  const [officeLocationEn, setOfficeLocationEn] = useState('');
  const [degreesText, setDegreesText] = useState('');
  const [order, setOrder] = useState(1);

  // Populate data when targetMember is found
  useEffect(() => {
    if (targetMember) {
      setNameCkb(targetMember.name?.ckb || '');
      setNameAr(targetMember.name?.ar || '');
      setNameEn(targetMember.name?.en || '');

      setRoleCkb(targetMember.role?.ckb || '');
      setRoleAr(targetMember.role?.ar || '');
      setRoleEn(targetMember.role?.en || '');

      setDeptCkb(targetMember.department?.ckb || '');
      setDeptAr(targetMember.department?.ar || '');
      setDeptEn(targetMember.department?.en || '');

      setBioCkb(targetMember.bio?.ckb || '');
      setBioAr(targetMember.bio?.ar || '');
      setBioEn(targetMember.bio?.en || '');

      setAvatarUrl(targetMember.avatarUrl || PRESET_FACULTY_AVATARS[0]);
      setEmail(targetMember.contactEmail || '');

      setOfficeLocationCkb(targetMember.officeLocation?.ckb || '');
      setOfficeLocationAr(targetMember.officeLocation?.ar || '');
      setOfficeLocationEn(targetMember.officeLocation?.en || '');

      const degrees = (targetMember.academicDegrees || [])
        .map((d) => d.ckb || d.en || '')
        .filter(Boolean)
        .join('\n');
      setDegreesText(degrees);

      setOrder(targetMember.order || 1);
    }
  }, [targetMember]);

  if (isHydrated && !targetMember) {
    return (
      <AdminAuthGuard>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-parchment-pure mb-2">
              {locale === 'ckb' ? 'ئەندامی دەستەی مامۆستایان نەدۆزرایەوە' : 'Faculty Member Not Found'}
            </h2>
            <p className="text-museum-secondary text-sm max-w-md">
              {locale === 'ckb' 
                ? 'ئەم مامۆستایە لە تۆماری دەستەی کارگێڕیدا بەردەست نییە.' 
                : 'The requested faculty profile could not be found.'}
            </p>
          </div>
          <Link
            href="/admin?tab=faculty"
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
    if (!targetMember) return;
    setIsSubmitting(true);

    const parsedDegrees = degreesText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((deg) => ({
        ckb: deg,
        ar: deg,
        en: deg,
      }));

    const updatedData: Partial<FacultyMember> = {
      name: {
        ckb: nameCkb || targetMember.name.ckb,
        ar: nameAr || nameCkb || targetMember.name.ar,
        en: nameEn || targetMember.name.en,
      },
      role: {
        ckb: roleCkb || targetMember.role.ckb,
        ar: roleAr || roleCkb || targetMember.role.ar,
        en: roleEn || targetMember.role.en,
      },
      department: {
        ckb: deptCkb || targetMember.department.ckb,
        ar: deptAr || deptCkb || targetMember.department.ar,
        en: deptEn || targetMember.department.en,
      },
      bio: {
        ckb: bioCkb,
        ar: bioAr,
        en: bioEn,
      },
      avatarUrl: avatarUrl || targetMember.avatarUrl,
      academicDegrees: parsedDegrees.length > 0 ? parsedDegrees : targetMember.academicDegrees,
      contactEmail: email || targetMember.contactEmail,
      officeLocation: {
        ckb: officeLocationCkb || targetMember.officeLocation.ckb,
        ar: officeLocationAr || officeLocationCkb || targetMember.officeLocation.ar,
        en: officeLocationEn || officeLocationCkb || targetMember.officeLocation.en,
      },
      order: Number(order) || 1,
    };

    updateFaculty(targetMember.id || targetMember.slug, updatedData);
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
              href="/admin?tab=faculty"
              className="p-2 rounded-xl bg-white/5 hover:bg-gold/15 text-museum-secondary hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest">
                <Building2 className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'دەستکاریکردنی زانیاری مامۆستا' : 'Edit Faculty Member'}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-parchment-pure">
                {targetMember?.name[locale] || targetMember?.name.ckb || 'Modify Faculty Record'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/about/faculty"
              target="_blank"
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment text-xs flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{locale === 'ckb' ? 'بینینی لاپەڕەی مامۆستایان' : 'Public Showcase'}</span>
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
                  {locale === 'ckb' ? 'زانیارییەکان بە سەرکەوتوویی نوێکرانەوە' : 'Faculty Profile Updated Successfully'}
                </h4>
                <p className="text-emerald-400/80 text-xs">
                  {locale === 'ckb' 
                    ? 'پۆست، بڕوانامە و زانیاری پەیوەندی لە ئەرشیفدا پاشەکەوت کران.' 
                    : 'Institutional credentials, portrait, and office details synchronized.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/about/faculty"
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'بینینی لاپەڕەی مامۆستایان' : 'View Public Page'}</span>
              </Link>
              <Link
                href="/admin?tab=faculty"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-parchment font-bold text-xs transition-colors"
              >
                {locale === 'ckb' ? 'گەڕانەوە بۆ لیستی مامۆستایان' : 'Back to Faculty Registry'}
              </Link>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1: Official Identity & Roles */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-museum-divider pb-4">
              <div>
                <h2 className="text-base font-bold text-parchment-pure flex items-center gap-2 font-serif">
                  <User className="w-4 h-4 text-gold" />
                  <span>{locale === 'ckb' ? 'ناسنامەی فەرمی و پۆستی ئەکادیمی' : 'Institutional Identity & Leadership Post'}</span>
                </h2>
                <p className="text-xs text-museum-secondary">
                  {locale === 'ckb' ? 'ناوی مامۆستا، ناونیشانی کارگێڕی و بەش بە سێ زمان' : 'Official title, role, and department in Kurdish, Arabic, and English'}
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
                  ناوی تەواو (کوردی سۆرانی) *
                </label>
                <input
                  type="text"
                  required
                  value={nameCkb}
                  onChange={(e) => setNameCkb(e.target.value)}
                  placeholder="وەک: مامۆستا زریان بەرزنجی"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'ar' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  الاسم الكامل (العربية)
                </label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: أ.د. زريان البرزنجي"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'en' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  Full Name & Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Prof. Zryan Barzanji"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Trilingual Role & Leadership Post */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={langTab === 'ckb' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  پۆست یان ئەرک (کوردی سۆرانی) *
                </label>
                <input
                  type="text"
                  required
                  value={roleCkb}
                  onChange={(e) => setRoleCkb(e.target.value)}
                  placeholder="وەک: ڕاگری پەیمانگا یان سەرۆکی بەش"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'ar' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  المنصب الأكاديمي (العربية)
                </label>
                <input
                  type="text"
                  value={roleAr}
                  onChange={(e) => setRoleAr(e.target.value)}
                  placeholder="مثال: عميد معهد الفنون الجميلة"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'en' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  Leadership Role (English) *
                </label>
                <input
                  type="text"
                  required
                  value={roleEn}
                  onChange={(e) => setRoleEn(e.target.value)}
                  placeholder="e.g. Dean of Chamchamal Fine Arts Institute"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Trilingual Department */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={langTab === 'ckb' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  بەش یان دەستە (کوردی سۆرانی)
                </label>
                <input
                  type="text"
                  value={deptCkb}
                  onChange={(e) => setDeptCkb(e.target.value)}
                  placeholder="وەک: بەشی شێوەکاری"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'ar' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  القسم أو الهيئة (العربية)
                </label>
                <input
                  type="text"
                  value={deptAr}
                  onChange={(e) => setDeptAr(e.target.value)}
                  placeholder="مثال: قسم الفن التشكيلي"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'en' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  Department (English)
                </label>
                <input
                  type="text"
                  value={deptEn}
                  onChange={(e) => setDeptEn(e.target.value)}
                  placeholder="e.g. Painting Department"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Portrait Photography */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-5">
            <h2 className="text-base font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'وێنەی پڕۆفایل و سیمای ئەکادیمی' : 'Official Academic Portrait'}</span>
            </h2>

            <FileUploadDropzone
              mediaType="image"
              value={avatarUrl}
              label={locale === 'ckb' ? 'وێنەی پڕۆفایلی مامۆستا' : 'Faculty Portrait Photo'}
              presets={PRESET_FACULTY_AVATARS.map((url, i) => ({ label: `Faculty Preset ${i + 1}`, url }))}
              onChange={(url) => {
                setAvatarUrl(url);
              }}
            />
          </div>

          {/* Section 3: Curatorial Bio & Credentials */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <h2 className="text-base font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <GraduationCap className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'ژیاننامە، ئەزموون و بڕوانامەکان' : 'Biography & Academic Credentials'}</span>
            </h2>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary">
                {langTab === 'ckb' ? 'ژیاننامەی ئەکادیمی و پێشینەی هونەری (کوردی سۆرانی)' : langTab === 'ar' ? 'السيرة الذاتية والأكاديمية (العربية)' : 'Academic Biography (English)'}
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

            {/* Degrees */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-gold" />
                <span>{locale === 'ckb' ? 'بڕوانامە و پلە ئەکادیمییەکان (هەر دێڕێک خاڵێکە)' : 'Academic Degrees & Credentials (One per line)'}</span>
              </label>
              <textarea
                rows={3}
                value={degreesText}
                onChange={(e) => setDegreesText(e.target.value)}
                placeholder="ماستەر لە هونەرە جوانەکان - زانکۆی بەغدا\nبەکالۆریۆس لە شێوەکاری"
                className="w-full p-3 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold font-mono"
              />
            </div>

            {/* Contact, Office & Ordering */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gold" />
                  <span>{locale === 'ckb' ? 'ئیمەیڵی فەرمی' : 'Official Email'}</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span>{locale === 'ckb' ? 'شوێنی ئۆفیس' : 'Office Location'}</span>
                </label>
                <input
                  type="text"
                  value={langTab === 'ckb' ? officeLocationCkb : langTab === 'ar' ? officeLocationAr : officeLocationEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (langTab === 'ckb') setOfficeLocationCkb(val);
                    else if (langTab === 'ar') setOfficeLocationAr(val);
                    else setOfficeLocationEn(val);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-gold" />
                  <span>{locale === 'ckb' ? 'ڕیزبەندی پیشاندان' : 'Display Order'}</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-museum-divider">
            <Link
              href="/admin?tab=faculty"
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
                  : (locale === 'ckb' ? 'پاشەکەوتکردنی گۆڕانکارییەکان' : 'Save Faculty Profile')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </AdminAuthGuard>
  );
}
