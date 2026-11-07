'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtelierTool } from '@/data/tools';
import { useArchive } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { FileUploadDropzone } from './FileUploadDropzone';
import { 
  X, 
  Plus, 
  Wrench, 
  Sparkles, 
  Box, 
  Check, 
  Layers 
} from 'lucide-react';

interface QuickToolAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToolCreated: (createdTool: AtelierTool) => void;
}

const PRESET_TOOL_IMAGES = [
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
];

export function QuickToolAddModal({ isOpen, onClose, onToolCreated }: QuickToolAddModalProps) {
  const { addTool } = useArchive();
  const { locale, isRTL } = useLanguage();

  const [nameCkb, setNameCkb] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [category, setCategory] = useState<'painting' | 'sculpture' | 'ceramics' | 'calligraphy'>('painting');
  const [imageUrl, setImageUrl] = useState(PRESET_TOOL_IMAGES[0]);
  const [glbUrl, setGlbUrl] = useState('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb');
  const [descriptionCkb, setDescriptionCkb] = useState('');
  const [materialsCkb, setMaterialsCkb] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const generatedSlug = (nameEn || nameCkb)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);

    const categoryLabels: Record<string, { ckb: string; ar: string; en: string }> = {
      painting: { ckb: 'شێوەکاری و ڕەنگ', ar: 'الرسم والتلوين', en: 'Painting & Pigments' },
      sculpture: { ckb: 'پەیکەرسازی و بەرد', ar: 'النحت وتشكيل الحجر', en: 'Sculpture & Stone' },
      ceramics: { ckb: 'سیرامیک و ئاگر', ar: 'الخزف والفنون النارية', en: 'Ceramics & Kiln' },
      calligraphy: { ckb: 'خۆشنووسی و مەرەکەب', ar: 'الخط والمداد', en: 'Calligraphy & Inks' },
    };

    const newTool: AtelierTool = {
      id: `tool-${Date.now()}`,
      slug: generatedSlug,
      name: {
        ckb: nameCkb || 'ئامرازی نوێی ئاتلیێ',
        ar: nameAr || nameCkb || 'أداة أكاديمية جديدة',
        en: nameEn || 'New Atelier Instrument',
      },
      category,
      categoryLabel: categoryLabels[category] || categoryLabels.painting,
      description: {
        ckb: descriptionCkb || 'کەرەستەیەکی پیشەیی بەکارهاتوو لە ئاتلیێی پەیمانگەی چەمچەماڵ.',
        ar: descriptionCkb || 'أداة احترافية مستخدمة في محترفات معهد جمجمال.',
        en: 'Professional studio instrument used in Chamchamal Fine Arts ateliers.',
      },
      historicalSignificance: {
        ckb: 'بەشێک لە کەلەپوور و مێژووی دەستڕەنگینی هونەرمەندانی پەیمانگە.',
        ar: 'جزء من تراث المعهد وتاريخه الفني.',
        en: 'Part of the institute material heritage.',
      },
      bestPractices: {
        ckb: 'ڕاگرتنی لە شوێنی وشک و پاککردنەوەی بەردەوام.',
        ar: 'الحفظ في مكان جاف والتنظيف الدوري.',
        en: 'Store in a dry location and maintain regularly.',
      },
      materials: {
        ckb: materialsCkb || 'کەرەستەی ئەکادیمی',
        ar: 'مواد أكاديمية',
        en: 'Archival atelier materials',
      },
      origin: {
        ckb: 'پەیمانگەی هونەرە جوانەکانی چەمچەماڵ',
        ar: 'معهد الفنون الجميلة بجمجمال',
        en: 'Chamchamal Fine Arts Institute Foundry',
      },
      glbUrl: glbUrl || 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
      imageUrl: imageUrl || PRESET_TOOL_IMAGES[0],
      galleryImages: [imageUrl || PRESET_TOOL_IMAGES[0]],
      videoUrl: '',
      videoTitle: { ckb: '', ar: '', en: '' },
      audioDuration: '2:15 Min',
      usageInstructions: { ckb: '', ar: '', en: '' },
      proTips: { ckb: [], ar: [], en: [] },
      usedInArtworkSlugs: [],
    };

    addTool(newTool);
    onToolCreated(newTool);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#18181f] via-obsidian-surface to-[#101014] border border-gold/40 p-6 sm:p-8 shadow-gold-glow z-10 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-museum-divider pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-parchment-pure font-serif">
                {locale === 'ckb' ? 'زیادکردنی خێرای کەرەستەی نوێ بۆ سەرچاوەکان' : 'Quick Add Atelier Instrument'}
              </h3>
              <p className="text-[11px] text-museum-secondary">
                {locale === 'ckb'
                  ? 'کەرەستەکە دەخرێتە نێو لیستی گشتی و بۆ هەموو بەرهەمەکان دەمێنێتەوە.'
                  : 'Permanently registered in the Institute tools archive for this and future works.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Tool Name in Kurdish & English */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-parchment mb-1">
                ناوی کەرەستە (کوردی) *
              </label>
              <input
                type="text"
                required
                value={nameCkb}
                onChange={(e) => setNameCkb(e.target.value)}
                placeholder="نموونە: فڵچەی فیلبێرت"
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-parchment mb-1">
                Name (English)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Filbert Brush No. 8"
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-medium text-parchment mb-1.5">
              {locale === 'ckb' ? 'بەش / پۆلێن' : 'Category & Discipline'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'painting', label: 'Painting' },
                { id: 'sculpture', label: 'Sculpture' },
                { id: 'ceramics', label: 'Ceramics' },
                { id: 'calligraphy', label: 'Calligraphy' },
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    category === cat.id
                      ? 'bg-gold/20 text-gold-light border-gold shadow-sm'
                      : 'bg-black/30 border-museum-border text-museum-secondary hover:text-parchment'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tool Photo Dropzone */}
          <FileUploadDropzone
            mediaType="image"
            value={imageUrl}
            label={locale === 'ckb' ? 'وێنەی فۆتۆگرافی کەرەستە' : 'Instrument Photograph'}
            optional={false}
            onChange={(url) => setImageUrl(url)}
          />

          {/* Optional 3D GLB Dropzone */}
          <FileUploadDropzone
            mediaType="model3d"
            value={glbUrl}
            label={locale === 'ckb' ? 'مۆدێلی ۳D / AR (ئارەزوومەندانە)' : '3D Photogrammetry GLB (Optional)'}
            optional={true}
            presets={[
              { label: 'Camera', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb' },
              { label: 'Bottle', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/WaterBottle/glTF-Binary/WaterBottle.glb' },
              { label: 'Helmet', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb' },
            ]}
            onChange={(url) => setGlbUrl(url)}
          />

          {/* Short Description */}
          <div>
            <label className="block text-xs font-medium text-parchment mb-1">
              {locale === 'ckb' ? 'پێناسەی کورت' : 'Short Atelier Description'}
            </label>
            <input
              type="text"
              value={descriptionCkb}
              onChange={(e) => setDescriptionCkb(e.target.value)}
              placeholder="تایبەتمەندی بەکارهێنانی ئەم ئامرازە لە پەیمانگەدا..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-museum-border text-xs text-parchment outline-none focus:border-gold"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-museum-divider">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs text-museum-secondary hover:text-parchment bg-white/5"
            >
              {locale === 'ckb' ? 'داخستن' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'تۆمارکردن و بەستنەوە' : 'Save & Select Tool'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
