'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { FileUploadDropzone } from '@/components/admin/FileUploadDropzone';
import { StudentArtist, StudentAwardItem, StudentContactLink, ContactPlatform } from '@/data/students';
import { 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  PlusCircle, 
  User, 
  BookOpen, 
  Sparkles, 
  Palette, 
  Award, 
  Mail, 
  MapPin,
  Trash2,
  Plus,
  Share2,
  Phone,
  MessageCircle,
  Instagram,
  Globe
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
];

export default function NewStudentPage() {
  const router = useRouter();
  const { artworks, addStudent } = useArchive();
  const { locale, isRTL } = useLanguage();

  const [langTab, setLangTab] = useState<'ckb' | 'ar' | 'en'>('ckb');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdStudentSlug, setCreatedStudentSlug] = useState<string | null>(null);

  // Form State
  const [fullNameCkb, setFullNameCkb] = useState('');
  const [fullNameAr, setFullNameAr] = useState('');
  const [fullNameEn, setFullNameEn] = useState('');

  const [departmentKey, setDepartmentKey] = useState<'painting' | 'sculpture' | 'ceramics' | 'design'>('painting');
  const [graduationYear, setGraduationYear] = useState(new Date().getFullYear());

  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [email, setEmail] = useState('');
  const [studioLocationCkb, setStudioLocationCkb] = useState('ئاتلیێی هونەرمەند، چەمچەماڵ');
  const [studioLocationAr, setStudioLocationAr] = useState('أتيليه الفنان، جمجمال');
  const [studioLocationEn, setStudioLocationEn] = useState('Artist Atelier, Chamchamal');

  const [bioCkb, setBioCkb] = useState('');
  const [bioAr, setBioAr] = useState('');
  const [bioEn, setBioEn] = useState('');

  const [statementCkb, setStatementCkb] = useState('');
  const [statementAr, setStatementAr] = useState('');
  const [statementEn, setStatementEn] = useState('');

  // Dynamic Awards Array
  const [awardsList, setAwardsList] = useState<StudentAwardItem[]>([
    {
      id: 'award-1',
      title: 'خەڵاتی یەکەمی خولی دەرچوون لە بەشەکەیدا',
      year: `${new Date().getFullYear()}`,
      issuer: 'وەزارەتی ڕۆشنبیری و پەیمانگای چەمچەماڵ',
      description: 'ڕێزلێنان بۆ باڵادەستی ئەکادیمی و پرۆژەی دەرچوون',
    },
  ]);

  // Dynamic Contact Links Array
  const [contactLinksList, setContactLinksList] = useState<StudentContactLink[]>([
    {
      id: 'contact-1',
      platform: 'whatsapp',
      url: 'https://wa.me/9647701234567',
      displayLabel: '+964 770 123 4567',
    },
    {
      id: 'contact-2',
      platform: 'instagram',
      url: 'https://instagram.com/artist',
      displayLabel: '@artist',
    },
  ]);

  const [selectedArtworkSlugs, setSelectedArtworkSlugs] = useState<string[]>([]);

  // Award Actions
  const handleAddAward = () => {
    setAwardsList((prev) => [
      ...prev,
      {
        id: `award-${Date.now()}`,
        title: '',
        year: `${graduationYear}`,
        issuer: 'Chamchamal Fine Arts Institute',
        description: '',
      },
    ]);
  };

  const handleRemoveAward = (index: number) => {
    setAwardsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateAward = (index: number, field: keyof StudentAwardItem, value: string) => {
    setAwardsList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Contact Link Actions
  const handleAddContactLink = () => {
    setContactLinksList((prev) => [
      ...prev,
      {
        id: `contact-${Date.now()}`,
        platform: 'whatsapp',
        url: '',
        displayLabel: '',
      },
    ]);
  };

  const handleRemoveContactLink = (index: number) => {
    setContactLinksList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateContactLink = (index: number, field: keyof StudentContactLink, value: string) => {
    setContactLinksList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleArtworkToggle = (slug: string) => {
    setSelectedArtworkSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedSlug = (fullNameEn || fullNameCkb)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);

    const deptLabels: Record<string, { ckb: string; ar: string; en: string }> = {
      painting: { ckb: 'بەشی شێوەکاری', ar: 'قسم الفن التشكيلي', en: 'Painting Department' },
      sculpture: { ckb: 'بەشی پەیکەرسازی', ar: 'قسم النحت', en: 'Sculpture Department' },
      ceramics: { ckb: 'بەشی سیرامیک', ar: 'قسم الخزف', en: 'Ceramics Department' },
      design: { ckb: 'بەشی دیزاین و گرافیک', ar: 'قسم التصميم والجرافيك', en: 'Design & Graphics Department' },
    };

    const newStudent: StudentArtist = {
      id: generatedSlug,
      slug: generatedSlug,
      fullName: {
        ckb: fullNameCkb || 'خوێندکاری پەیمانگا',
        ar: fullNameAr || fullNameCkb || 'طالب المعهد',
        en: fullNameEn || 'Institute Student Artist',
      },
      department: deptLabels[departmentKey] || deptLabels.painting,
      graduationYear: Number(graduationYear),
      cohort: {
        ckb: `خولی دەرچووانی ${graduationYear}`,
        ar: `دفعة خريجي عام ${graduationYear}`,
        en: `Graduating Cohort of ${graduationYear}`,
      },
      avatarUrl: avatarUrl || PRESET_AVATARS[0],
      bio: {
        ckb: bioCkb || 'خوێندکار و دەرچووی دەستڕەنگینی پەیمانگای هونەرە جوانەکانی چەمچەماڵ.',
        ar: bioAr || bioCkb || 'فنان واعد من خريجي معهد الفنون الجميلة بجمجمال.',
        en: bioEn || 'Promising student artist and alumnus of Chamchamal Fine Arts Institute.',
      },
      statement: {
        ckb: statementCkb || 'هونەر ڕەنگدانەوەی هەست و ناسنامەی کۆمەڵگایە لە ڕوانگەی نەوەی نوێوە.',
        ar: statementAr || statementCkb || 'الفن هو مرآة الهوية والوجدان برؤية جيل تشكيلي صاعد.',
        en: statementEn || 'Art reflects the living spirit of our culture through the lens of a new generation.',
      },
      awards: awardsList.filter((a) => a.title.trim().length > 0),
      contactLinks: contactLinksList.filter((c) => c.url.trim().length > 0),
      artworkSlugs: selectedArtworkSlugs,
      email: email || `${generatedSlug}@alumni.cfa-chamchamal.edu.krd`,
      studioLocation: {
        ckb: studioLocationCkb,
        ar: studioLocationAr,
        en: studioLocationEn,
      },
      disciplines: [deptLabels[departmentKey]],
    };

    addStudent(newStudent);
    setCreatedStudentSlug(generatedSlug);
    setIsSubmitting(false);
  };

  return (
    <AdminAuthGuard>
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-32">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-museum-divider pb-5">
          <div className="flex flex-col gap-1">
            <Link
              href="/admin?tab=students"
              className="inline-flex items-center gap-2 text-xs text-museum-secondary hover:text-gold transition-colors w-fit mb-2"
            >
              {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{locale === 'ckb' ? 'گەڕانەوە بۆ لیستی خوێندکاران' : 'Back to Students Registry'}</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-parchment-pure font-serif">
              {locale === 'ckb'
                ? 'تۆمارکردنی خوێندکار یان دەرچووی نوێ'
                : 'Register Student / Alumnus'}
            </h1>
            <p className="text-xs text-museum-secondary">
              {locale === 'ckb'
                ? 'ناسنامەی ئەکادیمی، بڕوانامە و خەڵاتەکان، بەستەری پەیوەندی و بەستنەوە بە شاکارەکان'
                : 'Catalog student artists with bio, statement, awards, dynamic contact links, and connected works.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-gold/15 text-gold border border-gold/30">
              Student Directory Ingestion
            </span>
          </div>
        </div>

        {/* Success Alert Banner */}
        {createdStudentSlug && (
          <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-200">
                  {locale === 'ckb' ? 'خوێندکارەکە بە سەرکەوتوویی تۆمارکرا!' : 'Student profile cataloged successfully!'}
                </h4>
                <p className="text-xs text-emerald-400/80">
                  {locale === 'ckb'
                    ? 'پڕۆفایلی خوێندکار ئێستا لە بەشی گشتیی خوێندکاران و بەرهەمەکان بەردەستە.'
                    : 'The profile is now accessible in the public student directory.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/students/${createdStudentSlug}`}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-colors"
              >
                <span>{locale === 'ckb' ? 'بینینی پڕۆفایل' : 'View Profile'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setCreatedStudentSlug(null)}
                className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
              >
                {locale === 'ckb' ? 'تۆمارکردنی یەکێکی تر' : 'Catalog Another'}
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1: Identification & Trilingual Names */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-museum-divider pb-4">
              <div>
                <h2 className="text-base font-bold text-parchment-pure flex items-center gap-2 font-serif">
                  <User className="w-4 h-4 text-gold" />
                  <span>{locale === 'ckb' ? 'ناسنامە و زانیاری کەسی' : 'Personal & Academic Identity'}</span>
                </h2>
                <p className="text-xs text-museum-secondary">
                  {locale === 'ckb' ? 'ناوی تەواو، بەشی خوێندن و ساڵی دەرچوون' : 'Full name in three languages, cohort year, and department'}
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

            {/* Department Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary uppercase">
                {locale === 'ckb' ? 'بەشی خوێندن لە پەیمانگا *' : 'Academic Department *'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'painting', labelCkb: 'شێوەکاری', labelEn: 'Painting', icon: '🎨' },
                  { key: 'sculpture', labelCkb: 'پەیکەرسازی', labelEn: 'Sculpture', icon: '🗿' },
                  { key: 'ceramics', labelCkb: 'سیرامیک', labelEn: 'Ceramics', icon: '🏺' },
                  { key: 'design', labelCkb: 'دیزاین و گرافیک', labelEn: 'Design', icon: '📐' },
                ].map((dept) => (
                  <button
                    key={dept.key}
                    type="button"
                    onClick={() => setDepartmentKey(dept.key as any)}
                    className={`p-3.5 rounded-2xl border text-start flex items-center gap-3 transition-all ${
                      departmentKey === dept.key
                        ? 'bg-gold/15 border-gold text-gold shadow-gold-glow'
                        : 'bg-black/40 border-museum-border text-museum-secondary hover:border-gold/30'
                    }`}
                  >
                    <span className="text-xl">{dept.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-parchment-pure">
                        {locale === 'ckb' ? dept.labelCkb : dept.labelEn}
                      </span>
                      <span className="text-[10px] text-museum-caption">{dept.labelEn}</span>
                    </div>
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
                  value={fullNameCkb}
                  onChange={(e) => setFullNameCkb(e.target.value)}
                  placeholder="وەک: زانا قادر حەمید"
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
                  value={fullNameAr}
                  onChange={(e) => setFullNameAr(e.target.value)}
                  placeholder="مثال: دانا قادر حميد"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold text-end"
                  dir="rtl"
                />
              </div>

              <div className={langTab === 'en' ? 'block' : 'hidden md:block'}>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  Full Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={fullNameEn}
                  onChange={(e) => setFullNameEn(e.target.value)}
                  placeholder="e.g. Dana Qadir Hamid"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Graduation Year & Studio Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1">
                  {locale === 'ckb' ? 'ساڵی دەرچوون (خولی دەرچووان)' : 'Graduation Cohort Year'}
                </label>
                <input
                  type="number"
                  min="2000"
                  max="2035"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gold" />
                  <span>{locale === 'ckb' ? 'ئیمەیڵی سەرەکی' : 'Primary Email'}</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artist@alumni.cfa-chamchamal.edu.krd"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-museum-secondary mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span>{locale === 'ckb' ? 'شوێنی ئاتلیێ / شار' : 'Studio Location'}</span>
                </label>
                <input
                  type="text"
                  value={langTab === 'ckb' ? studioLocationCkb : langTab === 'ar' ? studioLocationAr : studioLocationEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (langTab === 'ckb') setStudioLocationCkb(val);
                    else if (langTab === 'ar') setStudioLocationAr(val);
                    else setStudioLocationEn(val);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Avatar & Profile Photography */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-5">
            <h2 className="text-base font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'وێنەی پڕۆفایل و سیمای ئەکادیمی' : 'Portrait Photography'}</span>
            </h2>

            <FileUploadDropzone
              mediaType="image"
              value={avatarUrl}
              label={locale === 'ckb' ? 'وێنەی پڕۆفایلی خوێندکار' : 'Student Portrait Photo'}
              presets={PRESET_AVATARS.map((url, i) => ({ label: `Avatar Preset ${i + 1}`, url }))}
              onChange={(url) => setAvatarUrl(url)}
            />
          </div>

          {/* Section 3: Biography & Statement */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-6">
            <h2 className="text-base font-bold text-parchment-pure flex items-center gap-2 font-serif border-b border-museum-divider pb-3">
              <BookOpen className="w-4 h-4 text-gold" />
              <span>{locale === 'ckb' ? 'ژیاننامە و تێڕوانینی هونەری' : 'Curatorial Biography & Artist Statement'}</span>
            </h2>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary">
                {langTab === 'ckb' ? 'ژیاننامەی کورت (کوردی سۆرانی)' : langTab === 'ar' ? 'السيرة الذاتية (العربية)' : 'Artist Bio (English)'}
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

            {/* Statement */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-museum-secondary">
                {langTab === 'ckb' ? 'تێڕوانینی هونەرمەند (Artist Statement)' : langTab === 'ar' ? 'البيان الفني' : 'Artist Statement'}
              </label>
              <textarea
                rows={3}
                value={langTab === 'ckb' ? statementCkb : langTab === 'ar' ? statementAr : statementEn}
                onChange={(e) => {
                  const val = e.target.value;
                  if (langTab === 'ckb') setStatementCkb(val);
                  else if (langTab === 'ar') setStatementAr(val);
                  else setStatementEn(val);
                }}
                className="w-full p-4 rounded-2xl bg-black/60 border border-museum-border text-sm text-parchment outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Section 4: Dynamic Awards & Certificates Array */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-museum-divider pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold" />
                <h2 className="text-base font-bold text-parchment-pure font-serif">
                  {locale === 'ckb' ? 'ڕێزلێنان، خەڵات و بڕوانامەکان' : 'Awards & Academic Certificates'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddAward}
                className="px-3.5 py-1.5 rounded-full bg-gold/15 hover:bg-gold/25 text-gold text-xs font-bold flex items-center gap-1.5 transition-colors border border-gold/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'زیادکردنی خەڵات' : 'Add Certificate'}</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {awardsList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-2xl bg-black/50 border border-museum-border flex flex-col gap-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gold font-bold">
                      #{idx + 1} {locale === 'ckb' ? 'بڕوانامە / خەڵات' : 'Certificate'}
                    </span>
                    {awardsList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAward(idx)}
                        className="p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Remove Award"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono text-museum-secondary mb-1">
                        {locale === 'ckb' ? 'ناوی خەڵات / بڕوانامە *' : 'Award / Certificate Title *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={item.title}
                        onChange={(e) => handleUpdateAward(idx, 'title', e.target.value)}
                        placeholder="وەک: خەڵاتی یەکەمی بیناڵی نەتەوەیی کوردستان"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-museum-secondary mb-1">
                        {locale === 'ckb' ? 'ساڵ' : 'Year'}
                      </label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => handleUpdateAward(idx, 'year', e.target.value)}
                        placeholder="2023"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-museum-secondary mb-1">
                        {locale === 'ckb' ? 'دەزگای بەخشەر (Issuer)' : 'Issuing Organization'}
                      </label>
                      <input
                        type="text"
                        value={item.issuer}
                        onChange={(e) => handleUpdateAward(idx, 'issuer', e.target.value)}
                        placeholder="وەک: وەزارەتی ڕۆشنبیری یان پەیمانگای چەمچەماڵ"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-museum-secondary mb-1">
                        {locale === 'ckb' ? 'کورتەی ڕێزلێنان (ئارەزوومەندانە)' : 'Optional Description'}
                      </label>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => handleUpdateAward(idx, 'description', e.target.value)}
                        placeholder="بۆ داهێنان لە بواری شێوەکاری..."
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Dynamic Contact & Social Links Array */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-museum-divider pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-gold" />
                <h2 className="text-base font-bold text-parchment-pure font-serif">
                  {locale === 'ckb' ? 'بەستەری پەیوەندی و سۆشیال میدیا' : 'Contact & Social Channels'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddContactLink}
                className="px-3.5 py-1.5 rounded-full bg-gold/15 hover:bg-gold/25 text-gold text-xs font-bold flex items-center gap-1.5 transition-colors border border-gold/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{locale === 'ckb' ? 'زیادکردنی بەستەر' : 'Add Link'}</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {contactLinksList.map((link, idx) => (
                <div
                  key={link.id || idx}
                  className="p-4 rounded-2xl bg-black/50 border border-museum-border flex flex-col sm:flex-row items-center gap-3"
                >
                  {/* Platform Selector */}
                  <div className="w-full sm:w-44 shrink-0">
                    <label className="block text-[10px] font-mono text-museum-secondary mb-1">
                      {locale === 'ckb' ? 'پلاتفۆرم' : 'Platform'}
                    </label>
                    <select
                      value={link.platform}
                      onChange={(e) => handleUpdateContactLink(idx, 'platform', e.target.value as ContactPlatform)}
                      className="w-full px-3 py-2 rounded-xl bg-black/70 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    >
                      <option value="whatsapp">WhatsApp / وەتسئەپ</option>
                      <option value="viber">Viber / ڤایبەر</option>
                      <option value="instagram">Instagram / ئینستاگرام</option>
                      <option value="phone">Phone / تەلەفۆن</option>
                      <option value="email">Email / ئیمەیڵ</option>
                      <option value="website">Website / ماڵپەڕ</option>
                    </select>
                  </div>

                  {/* URL / Number */}
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-mono text-museum-secondary mb-1">
                      {locale === 'ckb' ? 'بەستەر یان ژمارە (URL / Phone)' : 'Link URL or Number'}
                    </label>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleUpdateContactLink(idx, 'url', e.target.value)}
                      placeholder="https://wa.me/... یان https://instagram.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-black/70 border border-museum-border text-xs text-parchment font-mono outline-none focus:border-gold"
                    />
                  </div>

                  {/* Display Label */}
                  <div className="w-full sm:w-48">
                    <label className="block text-[10px] font-mono text-museum-secondary mb-1">
                      {locale === 'ckb' ? 'دەقی پیشاندان' : 'Display Text'}
                    </label>
                    <input
                      type="text"
                      value={link.displayLabel}
                      onChange={(e) => handleUpdateContactLink(idx, 'displayLabel', e.target.value)}
                      placeholder="@username یان +964..."
                      className="w-full px-3 py-2 rounded-xl bg-black/70 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveContactLink(idx)}
                    className="p-2 self-end sm:self-center mt-2 sm:mt-4 rounded-xl hover:bg-red-500/20 text-red-400 transition-colors shrink-0"
                    title="Remove Contact Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Cross-link with Existing Artworks */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card flex flex-col gap-4">
            <div>
              <h2 className="text-base font-bold text-parchment-pure flex items-center gap-2 font-serif">
                <Palette className="w-4 h-4 text-gold" />
                <span>{locale === 'ckb' ? 'بەستنەوە بە شاکارەکانی ئەم خوێندکارە' : 'Link with Institute Masterworks'}</span>
              </h2>
              <p className="text-xs text-museum-secondary">
                {locale === 'ckb'
                  ? 'ئەو شاکارانە دیاری بکە کە لەلایەن ئەم خوێندکارەوە دروستکراون'
                  : 'Tag artworks created by this student to link their portfolio.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {artworks.map((art) => {
                const isSelected = selectedArtworkSlugs.includes(art.slug);
                return (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => handleArtworkToggle(art.slug)}
                    className={`p-2.5 rounded-2xl border text-start flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-gold/15 border-gold shadow-gold-glow'
                        : 'bg-black/40 border-museum-border hover:border-gold/30'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-obsidian-elevated">
                      <Image src={art.imageUrl} alt={art.title.en} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-gold-light' : 'text-parchment'}`}>
                        {art.title[locale] || art.title.ckb}
                      </span>
                      <span className="text-[10px] text-museum-caption truncate">
                        {art.categoryLabel[locale] || art.categoryLabel.ckb} • {art.year}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-museum-divider">
            <Link
              href="/admin?tab=students"
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment text-xs font-bold transition-colors"
            >
              {locale === 'ckb' ? 'پاشگەزبوونەوە' : 'Cancel'}
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (locale === 'ckb' ? 'تۆمار دەکرێت...' : 'Cataloging...')
                  : (locale === 'ckb' ? 'تەواوکردنی تۆمارکردن' : 'Complete Student Registration')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </AdminAuthGuard>
  );
}
