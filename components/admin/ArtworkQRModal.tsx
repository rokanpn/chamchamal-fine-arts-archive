'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Box, 
  QrCode,
  Globe,
  Share2,
  Image as ImageIcon
} from 'lucide-react';
import { Artwork, getArtworkDepartment, getArtworkDepartmentLabel } from '@/data/artworks';
import { useLanguage } from '@/context/LanguageContext';

interface ArtworkQRModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRODUCTION_DOMAIN = 'https://chamchamal-fine-arts-archive.vercel.app';

export function ArtworkQRModal({ artwork, isOpen, onClose }: ArtworkQRModalProps) {
  const { locale } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [useProductionUrl, setUseProductionUrl] = useState(true);
  const [isExportingPlaque, setIsExportingPlaque] = useState(false);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute artwork URL
  const origin = typeof window !== 'undefined' ? window.location.origin : PRODUCTION_DOMAIN;
  const baseUrl = useProductionUrl ? PRODUCTION_DOMAIN : origin;
  const artworkUrl = artwork ? `${baseUrl}/artworks/${artwork.slug}` : '';

  const title = artwork?.title?.[locale] || artwork?.title?.ckb || artwork?.title?.en || 'Archival Artwork';
  const titleEn = artwork?.title?.en || artwork?.title?.ckb || '';
  const titleCkb = artwork?.title?.ckb || artwork?.title?.en || '';
  const artist = artwork?.artist?.[locale] || artwork?.artist?.ckb || artwork?.artist?.en || 'Institute Artist';
  const department = artwork ? getArtworkDepartmentLabel(artwork.departmentLabel || artwork.department, locale) : '';
  const departmentCkb = artwork ? getArtworkDepartmentLabel(artwork.departmentLabel || artwork.department, 'ckb') : '';
  const medium = artwork?.medium?.[locale] || artwork?.medium?.ckb || artwork?.medium?.en || '';
  const deptKey = getArtworkDepartment(artwork);
  const dimensions = artwork?.dimensions || `${artwork?.width_cm || 120} × ${artwork?.height_cm || 90} cm`;
  const plaqueCode = artwork?.physicalPlaqueCode || `CFA-${artwork?.year || 2026}-${deptKey.slice(0, 2).toUpperCase()}-01`;
  const pedestal = artwork?.provenancePedestal || 'GALLERY-PEDESTAL-1';

  // Copy link
  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(artworkUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch (_) {}
  };

  // Download raw QR code PNG (High-Res 1024x1024)
  const handleDownloadQrPng = useCallback(() => {
    if (!artwork) return;
    const canvas = document.getElementById(`qr-code-canvas-${artwork.id}`) as HTMLCanvasElement;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${artwork.slug}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [artwork]);

  // Download complete High-Res Museum Plaque as a printable PNG (1200 x 1800 px)
  const handleDownloadFullPlaquePng = useCallback(async () => {
    if (!artwork) return;
    setIsExportingPlaque(true);

    try {
      const qrCanvas = document.getElementById(`qr-code-canvas-${artwork.id}`) as HTMLCanvasElement;
      if (!qrCanvas) throw new Error('QR Canvas not found');

      // Create high-res 1200x1800 canvas (standard 4x6 / 10x15cm ratio at 300 DPI)
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Background: Deep obsidian museum gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1800);
      bgGrad.addColorStop(0, '#1c1b22');
      bgGrad.addColorStop(0.5, '#121117');
      bgGrad.addColorStop(1, '#09080c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 1800);

      // 2. Ornate Golden Borders
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 6;
      ctx.strokeRect(50, 50, 1100, 1700);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(65, 65, 1070, 1670);

      // Corner accent embellishments
      const drawCorner = (x: number, y: number, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(-15, -15, 30, 4);
        ctx.fillRect(-15, -15, 4, 30);
        ctx.restore();
      };
      drawCorner(50, 50, 0);
      drawCorner(1150, 50, 90);
      drawCorner(1150, 1750, 180);
      drawCorner(50, 1750, 270);

      // 3. Institutional Emblem & Header
      ctx.textAlign = 'center';
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 32px "Noto Sans Arabic", Arial, sans-serif';
      ctx.fillText('پەیمانگەی هونەرە جوانەکانی چەمچەماڵ', 600, 140);

      ctx.fillStyle = 'rgba(235, 230, 215, 0.85)';
      ctx.font = '600 22px Georgia, serif';
      ctx.fillText('CHAMCHAMAL FINE ARTS INSTITUTE', 600, 185);

      ctx.fillStyle = '#C5A059';
      ctx.font = 'bold 20px "Noto Sans Arabic", Arial, sans-serif';
      ctx.fillText(departmentCkb || 'بەشی هونەرە بینراوەکان', 600, 225);

      // Horizontal separator line
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(300, 260);
      ctx.lineTo(900, 260);
      ctx.stroke();

      // 4. Artwork Title (Kurdish & English)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 54px "Noto Sans Arabic", Arial, sans-serif';
      ctx.fillText(titleCkb, 600, 360);

      ctx.fillStyle = 'rgba(235, 230, 215, 0.9)';
      ctx.font = 'italic 34px Georgia, serif';
      ctx.fillText(titleEn, 600, 420);

      // 5. Artist Name, Year & Category
      ctx.fillStyle = '#E8C860';
      ctx.font = 'bold 36px "Noto Sans Arabic", Arial, sans-serif';
      ctx.fillText(`${artist} (${artwork.year})`, 600, 500);

      ctx.fillStyle = 'rgba(200, 195, 180, 0.8)';
      ctx.font = '24px "Noto Sans Arabic", Arial, sans-serif';
      ctx.fillText(`${medium}  •  ${dimensions}`, 600, 555);

      // 6. Draw High-Contrast White Background for QR Code
      const qrBoxX = 350;
      const qrBoxY = 630;
      const qrBoxSize = 500;
      const qrPad = 40;

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 32);
      ctx.fill();

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw the QR Canvas into the white box
      ctx.drawImage(qrCanvas, qrBoxX + qrPad, qrBoxY + qrPad, qrBoxSize - qrPad * 2, qrBoxSize - qrPad * 2);

      // 7. Plaque Serial Code & Instructions
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(plaqueCode, 600, 1100);

      // 8. Bottom Instruction Pills
      ctx.fillStyle = '#E8C860';
      ctx.font = 'bold 28px "Noto Sans Arabic", Arial, sans-serif';
      ctx.fillText('کۆدەکە سکان بکە بۆ بینینی مۆدێلی سێ ڕەهەندی', 600, 1240);

      ctx.fillStyle = 'rgba(235, 230, 215, 0.85)';
      ctx.font = 'italic 22px Georgia, serif';
      ctx.fillText('Scan to inspect 3D photogrammetry and curatorial dossier', 600, 1285);

      // 9. Pedestal Location
      ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`PROVENANCE PEDESTAL: ${pedestal}`, 600, 1340);

      // 10. URL Text for manual entry
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '18px monospace';
      ctx.fillText(artworkUrl, 600, 1640);

      // Export as PNG
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${artwork.slug}-museum-plaque.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('[ArtworkQRModal] Export plaque error:', err);
      alert('Failed to generate full plaque PNG.');
    } finally {
      setIsExportingPlaque(false);
    }
  }, [artwork, artworkUrl, titleCkb, titleEn, artist, departmentCkb, medium, dimensions, plaqueCode, pedestal]);

  // Print directly using browser print
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (!isOpen || !artwork) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 print:p-0 print:static print:inset-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-2xl print:hidden"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 340 }}
          className="relative w-full max-w-xl max-h-[92vh] rounded-3xl bg-obsidian-surface border border-gold/40 shadow-art-card flex flex-col z-10 overflow-hidden print:w-full print:max-w-none print:shadow-none print:border-none print:bg-white print:text-black print:rounded-none print:p-0 print:m-0"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-museum-divider bg-black/40 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-start">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold">
                  PHYSICAL MUSEUM PLAQUE QR STUDIO
                </span>
                <h3 className="text-base sm:text-lg font-bold text-parchment-pure truncate max-w-xs sm:max-w-md">
                  {title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body / Scrollable Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center gap-5">
            {/* Domain URL Selector Toggle */}
            <div className="w-full flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-black/30 border border-museum-border text-xs print:hidden">
              <span className="text-museum-secondary font-mono text-[11px] truncate flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="truncate">{artworkUrl}</span>
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-parchment text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gold" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => setUseProductionUrl(!useProductionUrl)}
                  className="px-2.5 py-1 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold text-[10px] font-mono border border-gold/30 transition-colors"
                  title="Toggle production vs local domain"
                >
                  {useProductionUrl ? 'Prod (Vercel)' : 'Current Host'}
                </button>
              </div>
            </div>

            {/* Hidden High-Resolution Canvas for 1024x1024 PNG Exports */}
            <div className="hidden">
              <QRCodeCanvas
                id={`qr-code-canvas-${artwork.id}`}
                value={artworkUrl}
                size={1024}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Printable Physical Museum Plaque Preview (10cm x 15cm format) */}
            <div
              id="printable-museum-plaque"
              className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#1c1b22] via-[#121117] to-[#09080c] border-2 border-gold/60 p-6 flex flex-col items-center text-center shadow-gold-glow print:border-black print:bg-white print:text-black print:shadow-none print:w-full print:max-w-md print:mx-auto print:my-0"
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-1 mb-2">
                <div className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center text-gold shadow-inner-gold print:border-black print:text-black mb-1">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[9px] tracking-widest uppercase font-serif text-gold print:text-black font-semibold">
                  CHAMCHAMAL FINE ARTS INSTITUTE
                </span>
                <span className="text-[10px] text-parchment-muted print:text-black font-medium">
                  {department}
                </span>
              </div>

              {/* Title & Artist */}
              <div className="flex flex-col items-center gap-0.5 my-1.5">
                <h4 className="text-lg sm:text-xl font-bold text-parchment-pure print:text-black font-serif">
                  {title}
                </h4>
                <span className="text-[11px] text-parchment-muted print:text-black font-serif italic">
                  {titleEn}
                </span>
                <p className="text-xs text-gold-light print:text-black font-semibold mt-0.5">
                  {artist} ({artwork.year})
                </p>
                <span className="text-[10px] text-museum-secondary print:text-black">
                  {medium} • {dimensions}
                </span>
              </div>

              {/* Central Scannable QR Code */}
              <div className="my-3 p-3.5 rounded-2xl bg-white border border-gold/50 shadow-art-card flex flex-col items-center justify-center print:border-black">
                <QRCodeSVG
                  value={artworkUrl}
                  size={160}
                  level="H"
                  includeMargin={true}
                  className="w-36 h-36 sm:w-40 sm:h-40"
                />
                <span className="text-[9px] font-mono text-black font-bold mt-1 uppercase tracking-wider">
                  {plaqueCode}
                </span>
              </div>

              {/* Plaque Footer */}
              <div className="flex flex-col items-center gap-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold-light text-[10px] font-medium print:border-black print:text-black">
                  <Box className="w-3 h-3 text-gold print:text-black" />
                  <span>
                    {locale === 'ckb'
                      ? 'سکان بکە بۆ بینینی مۆدێلی سێ ڕەهەندی'
                      : 'Scan for 3D & AR Inspection'}
                  </span>
                </div>

                <span className="text-[9px] font-mono text-museum-caption print:text-black mt-0.5">
                  PEDESTAL: {pedestal}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="px-6 py-4 border-t border-museum-divider bg-black/50 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <Link
              href={`/artworks/${artwork.slug}`}
              target="_blank"
              className="text-xs text-museum-secondary hover:text-gold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{locale === 'ckb' ? 'بینینی پەڕەی بەرهەم' : 'Open Live Artwork'}</span>
            </Link>

            <div className="flex items-center gap-2">
              {/* 1. Download QR Code PNG */}
              <button
                onClick={handleDownloadQrPng}
                className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-parchment text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                title="Download just the high-res QR code PNG"
              >
                <Download className="w-3.5 h-3.5 text-gold" />
                <span className="hidden sm:inline">QR Only</span>
                <span>(PNG)</span>
              </button>

              {/* 2. Download Full Museum Plaque PNG */}
              <button
                onClick={handleDownloadFullPlaquePng}
                disabled={isExportingPlaque}
                className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-parchment text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                title="Download the complete archival museum plaque card as PNG"
              >
                <ImageIcon className="w-3.5 h-3.5 text-gold" />
                <span className="hidden sm:inline">Plaque Card</span>
                <span>(PNG)</span>
              </button>

              {/* 3. Direct Print */}
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-full bg-gold text-obsidian text-xs font-bold shadow-gold-glow flex items-center gap-1.5 hover:scale-105 transition-all"
                title="Print physical museum plaque directly"
              >
                <Printer className="w-3.5 h-3.5 text-obsidian" />
                <span>{locale === 'ckb' ? 'چاپکردنی ڕاستەوخۆ' : 'Print Plaque'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
