'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  useArchive, 
  DepartmentId, 
  DepartmentConfig, 
  DEFAULT_DEPARTMENTS_CONFIG 
} from '@/context/ArchiveContext';
import { getArtworkDepartmentLabel } from '@/data/artworks';
import { useLanguage } from '@/context/LanguageContext';
import { FileUploadDropzone } from '@/components/admin/FileUploadDropzone';
import { SafeImage } from '@/components/ui/SafeImage';
import { 
  Palette, 
  Box, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  Layers, 
  ExternalLink, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

const DEPT_ICONS: Record<DepartmentId, React.ComponentType<{ className?: string }>> = {
  painting: Palette,
  sculpture: Box,
  ceramics: Sparkles,
};

const DEPT_PRESETS: Record<DepartmentId, { label: string; url: string }[]> = {
  painting: [
    {
      label: 'کانڤاسی هونەری کلاسیک',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'ستۆدیۆی شێوەکاری و ڕەنگ',
      url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'تابلۆی سروشتی گەرمیان',
      url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  sculpture: [
    {
      label: 'پەیکەرسازی و فۆرمی برۆنز',
      url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'نەخشاندنی بەردی مێژوویی',
      url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'هۆڵی پەیکەرسازی پەیمانگە',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  ceramics: [
    {
      label: 'گڵینە و کوزەی نەریتی گەرمیان',
      url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'هونەری سوورکردنەوەی سیرامیک لە فڕن',
      url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'چەرخی سفالگەری و دەفرسازی',
      url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    },
  ],
};

function LivePreviewCard({
  config,
  deptId,
  worksCount,
  studentsCount,
}: {
  config: DepartmentConfig;
  deptId: DepartmentId;
  worksCount: number;
  studentsCount: number;
}) {
  const { isRTL, locale } = useLanguage();
  const Icon = DEPT_ICONS[deptId];

  return (
    <div className="relative flex flex-col rounded-[2.2rem] bg-gradient-to-b from-white/[0.04] via-white/[0.015] to-black/80 border border-gold/30 shadow-[0_20px_45px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Top Gold Border Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Image Preview with Badges */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/60">
        <SafeImage
          src={config.coverImage}
          alt={config.title}
          fill
          fallbackSrc={DEFAULT_DEPARTMENTS_CONFIG[deptId].coverImage}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-[#09090c]/40 to-transparent" />

        {/* Badge Pill */}
        <div className="absolute top-3.5 start-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-gold/40 text-gold text-xs font-medium backdrop-blur-md">
          <Icon className="w-3.5 h-3.5 text-gold" />
          <span className="text-[11px] font-semibold">{config.badgeText || 'دەقی باج'}</span>
        </div>

        
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col justify-between flex-1 gap-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-gold uppercase tracking-wider font-semibold">
              {config.subtitle || 'ژێرناو'}
            </span>
            <span className="text-[10px] font-mono text-white/40">
              {deptId === 'painting' ? '01' : deptId === 'sculpture' ? '02' : '03'}
            </span>
          </div>

          <h4 className="text-xl font-bold text-parchment-pure font-serif mt-1">
            {config.title || 'ناوی بەش'}
          </h4>

          <p className="mt-2 text-xs text-museum-secondary leading-relaxed line-clamp-3">
            {config.description || 'وەسفی بەش'}
          </p>
        </div>

        {/* Live Metrics Bar */}
        <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono text-museum-caption">
            <div className="flex items-center gap-1.5">
              <span className="text-gold font-bold">{worksCount}</span>
              <span className="text-white/60">{locale === 'ckb' ? 'شاکار' : 'Works'}</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-gold font-bold">{studentsCount}</span>
              <span className="text-white/60">{locale === 'ckb' ? 'خوێندکار' : 'Alumni'}</span>
            </div>
          </div>

          <div className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
            <span>{locale === 'ckb' ? 'گەڕان بە بەشدا' : 'Explore Faculty'}</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DepartmentConfigEditor() {
  const { 
    departmentsConfig, 
    updateDepartmentConfig, 
    resetDepartmentConfig,
    artworks,
    students 
  } = useArchive();
  const { locale, isRTL } = useLanguage();

  const [selectedDeptId, setSelectedDeptId] = useState<DepartmentId>('painting');
  const [formData, setFormData] = useState<DepartmentConfig>(
    departmentsConfig?.painting || DEFAULT_DEPARTMENTS_CONFIG.painting
  );
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Sync form when selected department changes or when global config updates
  useEffect(() => {
    const current = departmentsConfig?.[selectedDeptId] || DEFAULT_DEPARTMENTS_CONFIG[selectedDeptId];
    setFormData(current);
  }, [selectedDeptId, departmentsConfig]);

    // Compute live department counts
  const paintingWorksCount = artworks.filter((a) => a.department === 'painting' || a.category === 'painting').length;
  const sculptureWorksCount = artworks.filter((a) => a.department === 'sculpture' || a.category === 'sculpture').length;
  const ceramicsWorksCount = artworks.filter((a) => a.department === 'ceramics' || a.category === 'ceramics').length;

  const paintingStudentsCount = students.filter((s) => /painting|شێوەکاری/i.test(s?.department?.en || s?.department?.ckb || '')).length;
  const sculptureStudentsCount = students.filter((s) => /sculpture|پەیکەر/i.test(s?.department?.en || s?.department?.ckb || '')).length;
  const ceramicsStudentsCount = students.filter((s) => /ceramic|سیرامیک/i.test(s?.department?.en || s?.department?.ckb || '')).length;

  const currentWorksCount =
    selectedDeptId === 'painting'
      ? paintingWorksCount
      : selectedDeptId === 'sculpture'
      ? sculptureWorksCount
      : ceramicsWorksCount;

  const currentStudentsCount =
    selectedDeptId === 'painting'
      ? paintingStudentsCount
      : selectedDeptId === 'sculpture'
      ? sculptureStudentsCount
      : ceramicsStudentsCount;

  const handleSave = () => {
    updateDepartmentConfig(selectedDeptId, formData);
    setIsSavedFeedback(true);
    setTimeout(() => {
      setIsSavedFeedback(false);
    }, 2800);
  };

  const handleReset = () => {
    const defaultData = DEFAULT_DEPARTMENTS_CONFIG[selectedDeptId];
    if (
      confirm(
        locale === 'ckb'
          ? `ئایا دڵنیایت لە گەڕاندنەوەی زانیارییەکانی بەشی (${defaultData.title}) بۆ باری بنەڕەت؟`
          : `Reset "${defaultData.title}" department metadata back to original default settings?`
      )
    ) {
      resetDepartmentConfig(selectedDeptId);
      setFormData(defaultData);
      setIsSavedFeedback(true);
      setTimeout(() => {
        setIsSavedFeedback(false);
      }, 2500);
    }
  };

  const departmentsList: { id: DepartmentId; title: string; defaultSubtitle: string; icon: any }[] = [
    {
      id: 'painting',
      title: departmentsConfig?.painting?.title || 'شێوەکاری',
      defaultSubtitle: 'ڕەنگ و هێڵەکان بۆ گێڕانەوەی چیرۆکەکان',
      icon: Palette,
    },
    {
      id: 'sculpture',
      title: departmentsConfig?.sculpture?.title || 'پەیکەرسازی',
      defaultSubtitle: 'بەرجەستەکردنی هەستەکان لەناو بەرد و ماددەکاندا',
      icon: Box,
    },
    {
      id: 'ceramics',
      title: departmentsConfig?.ceramics?.title || 'سیرامیک',
      defaultSubtitle: 'هونەری گۆڕینی قوڕ بۆ شاکاری نەمر بە یارمەتی ئاگر',
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gold/10 text-gold border border-gold/25 shadow-gold-glow-sm">
            <Layers className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-parchment-pure font-serif">
              {locale === 'ckb' ? 'بەڕێوەبردنی بەشە فەرمییەکانی پەیمانگە' : 'Official Institute Departments Curator'}
            </h2>
            <p className="text-xs text-museum-secondary mt-0.5">
              {locale === 'ckb'
                ? 'دەستکاریکردنی ڕاستەوخۆی وێنەی بەرگ، ناونیشان، ژێرناو و باجی هەر سێ بەشە ئەکادیمییەکە لەسەر پەڕەی سەرەکی'
                : 'Directly customize cover images, titles, subtitles, and badges for the 3 authentic academic departments.'}
            </p>
          </div>
        </div>

        {/* Global Action Link */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-parchment text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-gold" />
            <span>{locale === 'ckb' ? 'بینینی لاپەڕەی سەرەکی' : 'View Homepage'}</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
        </div>
      </div>

      {/* 3 Department Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {departmentsList.map((dept) => {
          const Icon = dept.icon;
          const isSelected = selectedDeptId === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`p-4 rounded-2xl text-start transition-all flex items-center justify-between border cursor-pointer ${
                isSelected
                  ? 'bg-gold/15 border-gold shadow-gold-glow text-parchment'
                  : 'bg-obsidian-surface/60 border-white/5 hover:border-gold/30 text-museum-secondary hover:text-parchment'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl border ${
                    isSelected
                      ? 'bg-gold text-obsidian border-gold'
                      : 'bg-white/5 text-gold border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-serif text-parchment-pure">
                    {dept.title}
                  </h4>
                  <span className="text-[10px] font-mono text-museum-caption block truncate max-w-[140px]">
                    {dept.defaultSubtitle}
                  </span>
                </div>
              </div>

              {isSelected && (
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Form Controls (8 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-obsidian-surface/80 border border-museum-border shadow-art-card backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-museum-divider pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-gold" />
              <h3 className="text-base font-bold text-parchment-pure font-serif">
                {locale === 'ckb'
                  ? `ڕێکخستنەکانی بەشی (${formData.title})`
                  : `Configuring: ${formData.title}`}
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/25 font-bold uppercase tracking-wider">
              ID: {selectedDeptId}
            </span>
          </div>

          {/* Title & Subtitle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">
                {locale === 'ckb' ? 'ناوی فەرمی بەش (Title)' : 'Department Title'}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="ناوی بەش"
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian-elevated border border-white/10 focus:border-gold text-parchment text-sm outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">
                {locale === 'ckb' ? 'ژێرناو (Subtitle)' : 'Subtitle / Specialty'}
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="ژێرناو و تایبەتمەندی"
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian-elevated border border-white/10 focus:border-gold text-parchment text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Badge Label */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">
              {locale === 'ckb' ? 'دەقی باجی سەرەکی (Top Badge Label)' : 'Top Badge Pill Label'}
            </label>
            <input
              type="text"
              value={formData.badgeText}
              onChange={(e) => setFormData((prev) => ({ ...prev, badgeText: e.target.value }))}
              placeholder="دەقی باجی نیشاندراو لەسەر وێنە"
              className="w-full px-4 py-2.5 rounded-xl bg-obsidian-elevated border border-white/10 focus:border-gold text-parchment text-sm outline-none transition-colors"
            />
            <p className="text-[11px] text-museum-caption">
              {locale === 'ckb'
                ? 'ئەم دەقە لەناو باجە زێڕینەکەی سەرەوەی وێنەی کارەکەدا دەردەکەوێت.'
                : 'Rendered inside the glowing glassmorphic pill at the top of the department card.'}
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">
              {locale === 'ckb' ? 'پێناسە و وەسفی بەش (Description)' : 'Department Description'}
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="وەسفی کورتی بەش بۆ بینەران"
              className="w-full px-4 py-3 rounded-xl bg-obsidian-elevated border border-white/10 focus:border-gold text-parchment text-sm outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Cover Image Upload Dropzone */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">
              {locale === 'ckb' ? 'وێنەی بەرگی سەرەکی (Cover Image)' : 'Department Cover Image'}
            </label>
            <FileUploadDropzone
              mediaType="image"
              value={formData.coverImage}
              label={locale === 'ckb' ? 'بارکردنی وێنەی بەرگی بەش' : 'Upload Department Cover Image'}
              description={locale === 'ckb' ? 'وێنەی کوالێتی بەرز لە ئامێرەکەتەوە باربکە یان لینکێکی ڕاستەوخۆ دابنێ' : 'Drag & drop image from local storage or paste remote URL'}
              presets={DEPT_PRESETS[selectedDeptId]}
              onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
            />
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-4 border-t border-museum-divider flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              onClick={handleReset}
              type="button"
              className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-red-400 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'گەڕاندنەوە بۆ بنەڕەت' : 'Reset to Defaults'}</span>
            </button>

            <button
              onClick={handleSave}
              type="button"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow hover:shadow-gold-glow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSavedFeedback ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-obsidian" />
                  <span>{locale === 'ckb' ? 'گۆڕانکارییەکان پاشەکەوت کران!' : 'Changes Saved!'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{locale === 'ckb' ? 'پاشەکەوتکردنی گۆڕانکارییەکان' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right / Live Interactive Preview Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gold" />
              <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
                {locale === 'ckb' ? 'پێشبینینی ڕاستەوخۆ (Live Preview)' : 'Live Homepage Preview'}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          <LivePreviewCard
            config={formData}
            deptId={selectedDeptId}
            worksCount={currentWorksCount}
            studentsCount={currentStudentsCount}
          />

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-museum-caption flex items-center gap-2 leading-relaxed">
            <Sparkles className="w-4 h-4 text-gold shrink-0" />
            <span>
              {locale === 'ckb'
                ? 'ژمارەی شاکارەکان و دەرچووان لە داتای ڕاستەقینەی ئەرشیف بە شێوەیەکی دینامیکی دەخوێندرێنەوە.'
                : 'Artwork and alumni counts are dynamically calculated in real-time from the archive database.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
