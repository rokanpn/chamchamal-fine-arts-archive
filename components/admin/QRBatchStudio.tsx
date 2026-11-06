'use client';

import React, { useState } from 'react';
import { Artwork, getArtworkDepartmentLabel } from '@/data/artworks';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Printer, 
  CheckSquare, 
  Square, 
  QrCode, 
  Sparkles, 
  Box, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';

interface QRBatchStudioProps {
  artworks: Artwork[];
}

export function QRBatchStudio({ artworks }: QRBatchStudioProps) {
  const { locale, isRTL } = useLanguage();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    artworks.slice(0, 4).map((a) => a.id)
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === artworks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(artworks.map((a) => a.id));
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const selectedArtworks = artworks.filter((a) => selectedIds.includes(a.id));

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Control Ribbon (Hidden during printing) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-obsidian-surface/80 border border-museum-border flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-col">
          <h2 className="text-base sm:text-lg font-bold text-parchment-pure flex items-center gap-2">
            <QrCode className="w-5 h-5 text-gold" />
            <span>
              {locale === 'ckb'
                ? 'ستۆدیۆی پلاتی فیزیکی مۆزەخانە (١٠سم × ١٥سم)'
                : locale === 'ar'
                ? 'استوديو طباعة اللوحات الإرشادية للمتحف'
                : 'Physical Gallery Plaque Studio (10cm × 15cm)'}
            </span>
          </h2>
          <p className="text-xs text-museum-secondary mt-0.5">
            {locale === 'ckb'
              ? 'پلاتی فەرمی بۆ هەڵواسین لە هۆڵەکانی پەیمانگا؛ لەگەڵ کۆدی سێ ڕەهەندی و زانیاری بەرهەم.'
              : 'Print-ready archival labels formatted for physical mounting beside artworks in institute galleries.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            className="px-3.5 py-1.5 rounded-full bg-obsidian-elevated hover:bg-white/10 border border-museum-border text-xs text-parchment transition-all flex items-center gap-2"
          >
            {selectedIds.length === artworks.length ? (
              <CheckSquare className="w-4 h-4 text-gold" />
            ) : (
              <Square className="w-4 h-4 text-museum-secondary" />
            )}
            <span>
              {selectedIds.length === artworks.length
                ? locale === 'ckb' ? 'لابردنی هەمووی' : 'Deselect All'
                : locale === 'ckb' ? 'دیاریکردنی هەمووی' : 'Select All'}
            </span>
          </button>

          <button
            onClick={handlePrint}
            disabled={selectedArtworks.length === 0}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold text-xs shadow-gold-glow hover:shadow-gold-glow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" />
            <span>
              {locale === 'ckb'
                ? `چاپکردنی پێڕست (${selectedArtworks.length} پلات)`
                : `Batch Print (${selectedArtworks.length} Plaques)`}
            </span>
          </button>
        </div>
      </div>

      {/* Plaque Grid / Printable Sheets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4 print:w-full">
        {artworks.map((artwork) => {
          const isSelected = selectedIds.includes(artwork.id);
          const title = artwork.title[locale] || artwork.title.ckb;
          const artist = artwork.artist[locale] || artwork.artist.ckb;
          const department = getArtworkDepartmentLabel(artwork.departmentLabel || artwork.department, locale);
          const medium = artwork.medium[locale] || artwork.medium.ckb;

          // In print mode, only render selected ones
          return (
            <div
              key={artwork.id}
              className={`relative transition-opacity ${
                isSelected ? 'opacity-100' : 'opacity-40 print:hidden'
              }`}
            >
              {/* Screen Selection Checkbox */}
              <button
                onClick={() => toggleSelect(artwork.id)}
                className="absolute top-4 start-4 z-20 p-1.5 rounded-full bg-black/70 hover:bg-black text-parchment border border-white/20 print:hidden shadow-glass-pill"
                title="Toggle for Batch Print"
              >
                {isSelected ? (
                  <CheckSquare className="w-4 h-4 text-gold" />
                ) : (
                  <Square className="w-4 h-4 text-museum-secondary" />
                )}
              </button>

              {/* Physical Museum Plaque (10cm x 15cm aspect ratio) */}
              <div className="relative aspect-[10/14] sm:aspect-[10/15] rounded-3xl bg-gradient-to-b from-[#18181e] via-[#101014] to-black border-2 border-gold/60 p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-art-card overflow-hidden print:border-black print:bg-white print:text-black print:shadow-none print:aspect-[10/14]">
                {/* Top Archival Header */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center text-gold shadow-inner-gold print:border-black print:text-black">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] tracking-widest uppercase font-serif text-gold print:text-black font-semibold">
                    CHAMCHAMAL FINE ARTS INSTITUTE
                  </span>
                  <span className="text-[10px] text-parchment-muted print:text-black font-medium">
                    {department}
                  </span>
                </div>

                {/* Central Title & Metadata */}
                <div className="flex flex-col items-center gap-1 my-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-parchment-pure print:text-black">
                    {title}
                  </h3>
                  <span className="text-xs text-parchment-muted print:text-black font-serif">
                    {artwork.title.en}
                  </span>
                  <p className="text-xs text-gold-light print:text-black font-semibold mt-1">
                    {artist} ({artwork.year})
                  </p>
                  <span className="text-[10px] text-museum-secondary print:text-black">
                    {medium} • {artwork.dimensions}
                  </span>
                </div>

                {/* Physical High-Res QR Code */}
                <div className="my-2 p-3 rounded-2xl bg-white border border-gold/40 shadow-inner flex flex-col items-center justify-center">
                  <QrCode className="w-28 h-28 sm:w-32 sm:h-32 text-black" strokeWidth={1.5} />
                  <span className="text-[8px] font-mono text-black/75 mt-0.5 uppercase tracking-wider">
                    {artwork.physicalPlaqueCode}
                  </span>
                </div>

                {/* Bottom Callout & Pedestal Provenance */}
                <div className="flex flex-col items-center gap-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold-light text-[10px] font-medium print:border-black print:text-black">
                    <Box className="w-3 h-3 text-gold print:text-black" />
                    <span>
                      {locale === 'ckb'
                        ? 'سکان بکە بۆ بینینی مۆدێلی سێ ڕەهەندی'
                        : 'Scan for 3D & AR Inspection'}
                    </span>
                  </div>

                  <span className="text-[9px] font-mono text-museum-caption print:text-black mt-1">
                    LOCATION: {artwork.provenancePedestal}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
