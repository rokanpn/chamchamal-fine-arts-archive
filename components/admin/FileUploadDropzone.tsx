'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import { useLanguage } from '@/context/LanguageContext';
import { storeLocalFile, resolveMediaUrl, formatFileSize } from '@/lib/mediaStorage';
import { uploadMediaToSupabase } from '@/lib/supabase';
import { ModelViewer3D } from '@/components/artwork/ModelViewer3D';
import { 
  UploadCloud, 
  FileCheck, 
  X, 
  Link as LinkIcon, 
  FileText, 
  Music, 
  Video, 
  Box, 
  Image as ImageIcon,
  ExternalLink,
  Eye,
  CheckCircle2,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export type MediaType = 'image' | 'model3d' | 'audio' | 'video' | 'pdf';

interface FileUploadDropzoneProps {
  mediaType: MediaType;
  value: string;
  fileName?: string;
  label: string;
  description?: string;
  optional?: boolean;
  posterUrl?: string;
  presets?: { label: string; url: string }[];
  onChange: (url: string, fileName?: string, sizeBytes?: number) => void;
}

export function FileUploadDropzone({
  mediaType,
  value,
  fileName: initialFileName,
  label,
  description,
  optional = true,
  posterUrl = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  presets = [],
  onChange,
}: FileUploadDropzoneProps) {
  const { locale, isRTL } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resolvedUrl, setResolvedUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>(initialFileName || '');
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [manualUrl, setManualUrl] = useState('');

  // Resolve url when value changes
  useEffect(() => {
    let active = true;
    if (value) {
      resolveMediaUrl(value).then((resolved) => {
        if (active) setResolvedUrl(resolved);
      });
      setManualUrl(value);
    } else {
      setResolvedUrl('');
      setFileName('');
      setFileSize(null);
    }
    return () => {
      active = false;
    };
  }, [value]);

  const acceptConfig: Record<MediaType, { accept: string; icon: any; typeName: string; extensions: string }> = {
    image: {
      accept: 'image/jpeg,image/png,image/webp,image/avif',
      icon: ImageIcon,
      typeName: locale === 'ckb' ? 'وێنەی کوالێتی بەرز' : 'High-Res Image',
      extensions: 'JPG, PNG, WebP',
    },
    model3d: {
      accept: '.glb,.gltf,model/gltf-binary',
      icon: Box,
      typeName: locale === 'ckb' ? 'مۆدێلی ۳D / AR' : '3D Photogrammetry Model',
      extensions: 'GLB, GLTF',
    },
    audio: {
      accept: 'audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/aac,.mp3,.wav,.m4a,.ogg',
      icon: Music,
      typeName: locale === 'ckb' ? 'دەنگی ڕێبەری مۆزەخانەیی' : 'Audio Narration Guide',
      extensions: 'MP3, WAV, M4A, OGG',
    },
    video: {
      accept: 'video/mp4,video/webm,.mp4,.webm',
      icon: Video,
      typeName: locale === 'ckb' ? 'ڤیدیۆی بەڵگەنامەیی / شیکاری' : 'Video Documentary',
      extensions: 'MP4, WebM',
    },
    pdf: {
      accept: 'application/pdf,.pdf',
      icon: FileText,
      typeName: locale === 'ckb' ? 'تێزی لێکۆڵینەوە و پەیپەری هونەری' : 'Curatorial Monograph PDF',
      extensions: 'PDF Document',
    },
  };

  const currentConfig = acceptConfig[mediaType];
  const IconComponent = currentConfig.icon;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsProcessing(true);

    try {
      const folder = mediaType === 'model3d' ? 'models' : mediaType === 'image' ? 'thumbnails' : 'media';
      // Direct live upload to Supabase Storage bucket 'archive-media'
      const uploaded = await uploadMediaToSupabase(file, file.name, folder);
      setFileName(uploaded.name);
      setFileSize(uploaded.size);
      setResolvedUrl(uploaded.url);
      onChange(uploaded.url, uploaded.name, uploaded.size);
    } catch (err) {
      console.warn('[FileUploadDropzone] Supabase upload error, attempting local storage fallback', err);
      try {
        const stored = await storeLocalFile(file);
        setFileName(stored.name);
        setFileSize(stored.size);
        onChange(stored.url, stored.name, stored.size);
      } catch (localErr) {
        console.error('Failed to process uploaded file', localErr);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClear = () => {
    setResolvedUrl('');
    setFileName('');
    setFileSize(null);
    setManualUrl('');
    onChange('', '', 0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualUrlSubmit = (url: string) => {
    setManualUrl(url);
    if (url.trim()) {
      const extractedName = url.split('/').pop()?.split('?')[0] || 'remote-asset';
      setFileName(extractedName);
      onChange(url.trim(), extractedName);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-parchment flex items-center gap-1.5">
            <IconComponent className="w-3.5 h-3.5 text-gold" />
            <span>{label}</span>
          </label>
          {optional && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-museum-secondary border border-white/5 font-mono">
              {locale === 'ckb' ? 'ئارەزوومەندانە (Optional)' : 'Optional'}
            </span>
          )}
        </div>

        {/* Input Mode Selector (Upload Device vs. Remote URL) */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/60 border border-museum-border text-[11px] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 font-medium ${
              inputMode === 'upload'
                ? 'bg-gold text-obsidian shadow-sm'
                : 'text-museum-secondary hover:text-parchment'
            }`}
          >
            <FolderOpen className="w-3 h-3" />
            <span>{locale === 'ckb' ? 'ئامێرەکەت' : 'Device File'}</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 font-medium ${
              inputMode === 'url'
                ? 'bg-gold text-obsidian shadow-sm'
                : 'text-museum-secondary hover:text-parchment'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>{locale === 'ckb' ? 'لینکی ئۆنلاین' : 'Web URL'}</span>
          </button>
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-museum-secondary -mt-1 leading-relaxed">
          {description}
        </p>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={currentConfig.accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Mode A: Native File Drag & Drop Area */}
      {inputMode === 'upload' && !value && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
            isDragging
              ? 'border-gold bg-gold/10 scale-[1.01]'
              : 'border-museum-border/80 bg-black/40 hover:border-gold/50 hover:bg-black/60'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-3 group-hover:scale-110 transition-transform shadow-inner-gold">
            {isProcessing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <h4 className="text-xs font-bold text-parchment">
            {isProcessing
              ? (locale === 'ckb' ? 'خەریکی بارکردنی فایلە بۆ کۆگای فەرمی (Supabase archive-media)...' : 'Uploading asset to Supabase archive-media storage...')
              : (locale === 'ckb'
                  ? 'فایلەکە ڕابکێشە بۆ ئێرە، یان کلیک بکە بۆ هەڵبژاردن'
                  : 'Drag & drop file here, or click to browse device')}
          </h4>

          <span className="text-[10px] text-museum-secondary mt-1 font-mono">
            {currentConfig.typeName} • ({currentConfig.extensions})
          </span>

          <span className="mt-3 px-3 py-1 rounded-full text-[10px] bg-white/5 border border-white/10 text-gold-light group-hover:bg-gold/20 transition-colors">
            {locale === 'ckb' ? 'گەڕان لە مۆبایل یان کۆمپیوتەرەکەت' : 'Browse Local Files'}
          </span>
        </div>
      )}

      {/* Mode B: Manual Web URL Input */}
      {inputMode === 'url' && !value && (
        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-black/40 border border-museum-border">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://example.com/asset..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-museum-border text-xs text-gold font-mono outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={() => handleManualUrlSubmit(manualUrl)}
              disabled={!manualUrl.trim()}
              className="px-4 py-2 rounded-xl bg-gold text-obsidian font-bold text-xs shadow-gold-glow disabled:opacity-40"
            >
              {locale === 'ckb' ? 'دانان' : 'Apply'}
            </button>
          </div>

          {presets.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="text-[10px] text-museum-caption uppercase">
                {locale === 'ckb' ? 'نموونە ئامادەکراوەکان:' : 'Tested Presets:'}
              </span>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleManualUrlSubmit(preset.url)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/5 text-museum-secondary hover:text-gold border border-white/10 hover:border-gold/30 transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* State: File Uploaded & Active Preview Stage */}
      {value && (
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-obsidian-surface/90 border border-gold/40 shadow-art-card">
          {/* File Meta Header */}
          <div className="flex items-center justify-between gap-3 border-b border-museum-divider pb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold border border-gold/30 flex items-center justify-center shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-parchment-pure truncate max-w-[240px] sm:max-w-md">
                  {fileName || value.split('/').pop()?.split('?')[0] || 'Active Media Asset'}
                </span>
                <span className="text-[10px] text-museum-secondary font-mono flex items-center gap-2">
                  <span>{currentConfig.typeName}</span>
                  {fileSize && (
                    <>
                      <span>•</span>
                      <span className="text-gold">{formatFileSize(fileSize)}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Loaded</span>
                  </span>
                </span>
              </div>
            </div>

            {/* Clear / Replace Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-parchment transition-colors"
                title="Replace file"
              >
                {locale === 'ckb' ? 'گۆڕین' : 'Replace'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Live Media Preview Stage */}
          <div className="w-full rounded-xl overflow-hidden bg-black/60 border border-museum-border/60">
            {/* 1. Image Preview */}
            {mediaType === 'image' && (resolvedUrl || value) && (
              <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden">
                <SafeImage
                  src={resolvedUrl || value}
                  alt={fileName || 'Preview'}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* 2. 3D Model Live Stage */}
            {mediaType === 'model3d' && resolvedUrl && (
              <div className="w-full">
                <ModelViewer3D
                  modelUrl={resolvedUrl}
                  posterUrl={posterUrl}
                  title={fileName || '3D Inspection Test'}
                  vertices="Live Photogrammetry Mesh"
                  polygons="WebGL / WebXR"
                />
              </div>
            )}

            {/* 3. Audio Narration Player */}
            {mediaType === 'audio' && resolvedUrl && (
              <div className="p-4 flex flex-col gap-2">
                <span className="text-[10px] text-gold uppercase tracking-wider font-mono">
                  {locale === 'ckb' ? 'تاقیکردنەوەی دەنگ:' : 'Audio Playback Test:'}
                </span>
                <audio
                  controls
                  src={resolvedUrl}
                  className="w-full h-10 accent-gold"
                />
              </div>
            )}

            {/* 4. Video Player */}
            {mediaType === 'video' && resolvedUrl && (
              <div className="relative aspect-video w-full bg-black">
                <video
                  controls
                  src={resolvedUrl}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* 5. PDF Research Document */}
            {mediaType === 'pdf' && resolvedUrl && (
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-gold" />
                  <div>
                    <h5 className="text-xs font-bold text-parchment">
                      {fileName || 'Curatorial-Monograph.pdf'}
                    </h5>
                    <p className="text-[10px] text-museum-secondary">
                      {locale === 'ckb' ? 'بەڵگەنامەی فەرمی ئامادەیە بۆ بینین و داگرتن' : 'Academic monograph ready for inspection'}
                    </p>
                  </div>
                </div>

                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-gold/15 text-gold hover:bg-gold/25 border border-gold/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{locale === 'ckb' ? 'کردنەوەی PDF' : 'Inspect PDF'}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
