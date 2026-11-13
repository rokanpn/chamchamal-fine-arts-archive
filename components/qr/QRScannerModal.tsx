'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Camera, 
  CameraOff, 
  RefreshCw, 
  UploadCloud, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Zap,
  ZapOff
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useArchive } from '@/context/ArchiveContext';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CameraStatus = 
  | 'idle'
  | 'requesting-permission'
  | 'scanning'
  | 'permission-denied'
  | 'no-camera'
  | 'insecure-context'
  | 'error'
  | 'success';

export function QRScannerModal({ isOpen, onClose }: QRScannerModalProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const { artworks, tools, students } = useArchive();

  const [status, setStatus] = useState<CameraStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [scannedResult, setScannedResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerId = 'chamchamal-qr-reader';

  // Tactile & Audio feedback on successful scan
  const triggerSuccessFeedback = useCallback(() => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([50, 70, 50]);
      }
    } catch (_) {}

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      }
    } catch (_) {}
  }, []);

  // Smart URL parser and routing logic
  const handleDecodedText = useCallback(
    (decodedText: string) => {
      if (isProcessing) return;
      setIsProcessing(true);
      triggerSuccessFeedback();
      setStatus('success');
      setScannedResult(decodedText);

      const cleaned = decodedText.trim();

      // Grace period to show checkmark animation
      setTimeout(() => {
        // 1. Check if it's a full URL
        try {
          if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
            const parsed = new URL(cleaned);
            const isLocalOrVercel =
              parsed.hostname === window.location.hostname ||
              parsed.hostname.includes('chamchamal') ||
              parsed.hostname.includes('vercel.app') ||
              parsed.hostname === 'localhost';

            if (isLocalOrVercel) {
              const destination = parsed.pathname + parsed.search + parsed.hash;
              router.push(destination);
              onClose();
              return;
            } else {
              // External URL
              window.location.href = cleaned;
              return;
            }
          }
        } catch (_) {}

        // 2. Relative URL
        if (cleaned.startsWith('/')) {
          router.push(cleaned);
          onClose();
          return;
        }

        // 3. Match against Artwork slug, ID, or physical plaque serial code
        const matchedArt = artworks.find(
          (a) =>
            a.slug === cleaned ||
            a.id === cleaned ||
            (a.physicalPlaqueCode && a.physicalPlaqueCode.toLowerCase() === cleaned.toLowerCase())
        );
        if (matchedArt) {
          router.push(`/artworks/${matchedArt.slug}`);
          onClose();
          return;
        }

        // 4. Match against Atelier Tool
        const matchedTool = tools.find((t) => t.slug === cleaned || t.id === cleaned);
        if (matchedTool) {
          router.push(`/tools/${matchedTool.slug}`);
          onClose();
          return;
        }

        // 5. Match against Student Profile
        const matchedStudent = students.find((s) => s.id === cleaned);
        if (matchedStudent) {
          router.push(`/students/${matchedStudent.id}`);
          onClose();
          return;
        }

        // 6. Generic clean slug fallback (e.g. "echoes-of-garmian")
        if (/^[a-z0-9-]+$/i.test(cleaned)) {
          router.push(`/artworks/${cleaned}`);
          onClose();
          return;
        }

        // If not automatically routable, keep modal open displaying the link so user can tap
        setIsProcessing(false);
      }, 700);
    },
    [isProcessing, triggerSuccessFeedback, router, onClose, artworks, tools, students]
  );

  // Stop active scanner safely
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.warn('[QRScanner] Stop notice:', err);
      } finally {
        scannerRef.current = null;
      }
    }
  }, []);

  // Initialize and start scanner with rear camera priority
  const startScanner = useCallback(async () => {
    await stopScanner();

    // Check secure context (camera requires HTTPS or localhost)
    if (
      typeof window !== 'undefined' &&
      !window.isSecureContext &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      setStatus('insecure-context');
      return;
    }

    setStatus('requesting-permission');
    setErrorMessage('');

    // Ensure DOM container is ready
    const container = document.getElementById(containerId);
    if (!container) {
      setTimeout(() => startScanner(), 100);
      return;
    }

    try {
      const html5QrCode = new Html5Qrcode(containerId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      scannerRef.current = html5QrCode;

      const qrConfig = {
        fps: 12,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minDim = Math.min(viewfinderWidth, viewfinderHeight);
          const size = Math.floor(minDim * 0.75);
          return {
            width: Math.max(size, 200),
            height: Math.max(size, 200),
          };
        },
        aspectRatio: 1.0,
      };

      // 1. Explicitly request rear environment camera (best for mobile physical plaques)
      try {
        await html5QrCode.start(
          { facingMode: 'environment' },
          qrConfig,
          (decodedText: string) => {
            handleDecodedText(decodedText);
          },
          () => {
            // Per-frame no QR code detected, normal behavior
          }
        );
        setStatus('scanning');
      } catch (primaryErr: any) {
        console.warn('[QRScanner] facingMode environment failed, checking device cameras:', primaryErr);

        // 2. Fallback: Query available cameras and pick rear/back or first available
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          const rearCam = cameras.find((c) =>
            /back|rear|environment|posterior|hintere/i.test(c.label)
          );
          const chosenId = rearCam ? rearCam.id : cameras[0].id;

          await html5QrCode.start(
            chosenId,
            qrConfig,
            (decodedText: string) => {
              handleDecodedText(decodedText);
            },
            () => {}
          );
          setStatus('scanning');
        } else {
          // 3. User camera fallback (e.g. desktop webcam)
          await html5QrCode.start(
            { facingMode: 'user' },
            qrConfig,
            (decodedText: string) => {
              handleDecodedText(decodedText);
            },
            () => {}
          );
          setStatus('scanning');
        }
      }

      // Check if torch/flashlight is supported
      try {
        const capabilities = html5QrCode.getRunningTrackCapabilities();
        if (capabilities && (capabilities as any).torch) {
          setHasTorch(true);
        }
      } catch (_) {}
    } catch (err: any) {
      console.error('[QRScanner] Camera start error:', err);
      const errName = err?.name || '';
      const errMsg = String(err?.message || err);

      if (
        errName === 'NotAllowedError' ||
        errName === 'PermissionDeniedError' ||
        errMsg.includes('NotAllowedError') ||
        errMsg.includes('Permission denied') ||
        errMsg.includes('denied')
      ) {
        setStatus('permission-denied');
      } else if (
        errName === 'NotFoundError' ||
        errName === 'DevicesNotFoundError' ||
        errMsg.includes('NotFoundError')
      ) {
        setStatus('no-camera');
      } else {
        setStatus('error');
        setErrorMessage(errMsg || 'Failed to initialize camera scanner.');
      }
    }
  }, [stopScanner, handleDecodedText]);

  // Handle image file upload for scanning
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      let scanner = scannerRef.current;
      if (!scanner) {
        scanner = new Html5Qrcode(containerId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });
        scannerRef.current = scanner;
      }

      const decodedText = await scanner.scanFile(file, true);
      handleDecodedText(decodedText);
    } catch (err: any) {
      console.warn('[QRScanner] Image scan error:', err);
      alert(
        locale === 'ckb'
          ? 'هیچ کۆدێکی QR لەم وێنەیەدا نەدۆزرایەوە. تکایە وێنەیەکی ڕوونتر هەڵبژێرە.'
          : locale === 'ar'
          ? 'لم يتم العثور على رمز QR صالح في هذه الصورة. يرجى تجربة صورة أوضح.'
          : 'No valid QR code detected in this image. Please select a clearer photo.'
      );
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Toggle flashlight / torch
  const toggleTorch = async () => {
    if (!scannerRef.current || !hasTorch) return;
    try {
      const nextState = !torchOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: nextState } as any],
      });
      setTorchOn(nextState);
    } catch (err) {
      console.warn('Torch toggle not supported on this device:', err);
    }
  };

  // Lifecycle
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setScannedResult('');
      startScanner();
    } else {
      stopScanner();
      setStatus('idle');
    }

    return () => {
      stopScanner();
    };
  }, [isOpen, startScanner, stopScanner]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            stopScanner();
            onClose();
          }}
          className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', damping: 26, stiffness: 340 }}
          className="relative w-full max-w-md rounded-3xl bg-obsidian-surface border border-gold/40 p-5 sm:p-7 shadow-art-card flex flex-col items-center text-center z-10 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="absolute top-4 end-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-museum-secondary hover:text-parchment transition-colors z-20"
            aria-label="Close Scanner"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest mb-1.5 font-mono">
            <Camera className="w-4 h-4 text-gold" />
            <span>
              {locale === 'ckb'
                ? 'سکانەری مۆزەخانەی چەمچەماڵ'
                : locale === 'ar'
                ? 'ماسح المعرض التفاعلي'
                : 'Museum Physical Plaque Scanner'}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-parchment-pure mb-1">
            {locale === 'ckb'
              ? 'کامێراکەت ئاڕاستەی کۆدی QR بکە'
              : locale === 'ar'
              ? 'وجّه الكاميرا نحو رمز QR على اللوحة'
              : 'Scan Physical Plaque QR Code'}
          </h3>

          <p className="text-xs text-museum-secondary mb-4 max-w-xs leading-relaxed">
            {locale === 'ckb'
              ? 'کامێرای دواوەی مۆبایلەکەت ئاڕاستەی پلاتی تەنیشت پەیکەر یان تابلۆکە بکە بۆ کردنەوەی ڕاستەوخۆ.'
              : locale === 'ar'
              ? 'وجّه الكاميرا الخلفية نحو اللوحة التعريفية بجانب العمل الفني للوصول المباشر.'
              : 'Point your rear camera at the physical plaque code next to the sculpture or painting.'}
          </p>

          {/* Viewfinder Viewport / Camera Stage */}
          <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[300px] rounded-2xl bg-black/80 border-2 border-gold/40 overflow-hidden flex items-center justify-center shadow-inner-gold mb-4">
            {/* Real Html5Qrcode video mounting container */}
            <div
              id={containerId}
              className={`w-full h-full object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_video]:rounded-2xl ${
                status === 'scanning' ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Scanning State: Laser Animation & Corner Reticles */}
            {status === 'scanning' && (
              <>
                {/* Laser scanline */}
                <motion.div
                  animate={{ y: [-110, 110, -110] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_12px_#D4AF37] pointer-events-none z-10"
                />

                {/* Golden Corner Reticles */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold rounded-tl pointer-events-none z-10" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold rounded-tr pointer-events-none z-10" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold rounded-bl pointer-events-none z-10" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold rounded-br pointer-events-none z-10" />

                {/* Subtitle pulse inside frame */}
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/70 backdrop-blur-md text-gold-light border border-gold/30">
                    {locale === 'ckb' ? 'کامێرای دواوە کارایە' : 'Rear Lens Active'}
                  </span>
                </div>
              </>
            )}

            {/* Requesting Permission / Initializing */}
            {(status === 'idle' || status === 'requesting-permission') && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-obsidian-surface/90 text-center gap-3">
                <RefreshCw className="w-8 h-8 text-gold animate-spin" />
                <span className="text-xs text-parchment font-medium">
                  {locale === 'ckb'
                    ? 'پەیوەستبوون بە کامێرای دواوە...'
                    : locale === 'ar'
                    ? 'جاري الاتصال بالكاميرا الخلفية...'
                    : 'Initializing rear camera lens...'}
                </span>
                <span className="text-[11px] text-museum-caption max-w-[220px]">
                  {locale === 'ckb'
                    ? 'ئەگەر داوای مۆڵەتی کرد، تکایە ڕێگە بدە (Allow).'
                    : 'Please grant camera access when prompted.'}
                </span>
              </div>
            )}

            {/* Success State Overlay */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-2.5 z-20"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-parchment">
                  {locale === 'ckb' ? 'کۆدەکە بە سەرکەوتوویی سکان کرا!' : 'Plaque Code Detected!'}
                </h4>
                <p className="text-[11px] text-gold font-mono truncate max-w-[220px]">
                  {scannedResult}
                </p>
                <span className="text-[10px] text-museum-caption animate-pulse">
                  {locale === 'ckb' ? 'کردنەوەی بەرهەم...' : 'Opening artwork...'}
                </span>
              </motion.div>
            )}

            {/* Permission Denied UI (iOS Safari & Android friendly) */}
            {status === 'permission-denied' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-5 bg-obsidian-surface text-center gap-2.5 z-20">
                <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-red-300">
                  {locale === 'ckb' ? 'مۆڵەتی کامێرا بەردەست نییە' : 'Camera Access Blocked'}
                </h4>
                <p className="text-[10px] text-museum-secondary leading-relaxed max-w-[230px]">
                  {locale === 'ckb'
                    ? 'لە ڕێکخستنەکانی براوسەر (Safari/Chrome Settings > Camera) ڕێگە بە کامێرا بدە.'
                    : locale === 'ar'
                    ? 'يرجى تفعيل إذن الكاميرا من إعدادات المتصفح للمتابعة.'
                    : 'Camera permission was denied. Please allow camera access in Safari or browser settings.'}
                </p>
                <button
                  onClick={startScanner}
                  className="px-4 py-1.5 rounded-full bg-gold text-obsidian text-xs font-bold shadow-gold-glow flex items-center gap-1.5 hover:scale-105 transition-transform mt-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{locale === 'ckb' ? 'دووبارە هەوڵبدەرەوە' : 'Request Again'}</span>
                </button>
              </div>
            )}

            {/* Insecure Context UI */}
            {status === 'insecure-context' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-5 bg-obsidian-surface text-center gap-2 z-20">
                <AlertCircle className="w-8 h-8 text-amber-400" />
                <h4 className="text-xs font-bold text-amber-300">HTTPS Required</h4>
                <p className="text-[10px] text-museum-secondary leading-relaxed">
                  Mobile camera scanning requires a secure HTTPS connection. Please access via the production domain.
                </p>
              </div>
            )}

            {/* Generic Error / No Camera UI */}
            {(status === 'error' || status === 'no-camera') && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-5 bg-obsidian-surface text-center gap-2 z-20">
                <CameraOff className="w-8 h-8 text-museum-secondary" />
                <h4 className="text-xs font-bold text-parchment">
                  {locale === 'ckb' ? 'کامێرا نەدۆزرایەوە' : 'No Camera Detected'}
                </h4>
                <p className="text-[10px] text-museum-secondary max-w-[220px]">
                  {errorMessage || (locale === 'ckb' ? 'تکایە دڵنیابە لە پەیوەستی کامێرا.' : 'Please verify device camera connection.')}
                </p>
                <button
                  onClick={startScanner}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-parchment text-xs font-medium flex items-center gap-1.5 transition-colors mt-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{locale === 'ckb' ? 'نوێکردنەوە' : 'Retry'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Action Controls: Torch / Upload from Gallery / Manual */}
          <div className="w-full flex items-center justify-center gap-2 sm:gap-3 mb-3">
            {/* Flashlight button if supported */}
            {hasTorch && status === 'scanning' && (
              <button
                onClick={toggleTorch}
                className={`p-2.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all ${
                  torchOn
                    ? 'bg-gold text-obsidian border-gold shadow-gold-glow'
                    : 'bg-white/5 border-white/10 text-museum-secondary hover:text-parchment'
                }`}
                title="Toggle Torch"
              >
                {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                <span className="text-[11px] hidden sm:inline">{torchOn ? 'Flash On' : 'Flash'}</span>
              </button>
            )}

            {/* Upload Photo of QR from Gallery (Guaranteed fallback for all mobile browsers) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-parchment text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4 text-gold" />
              <span>
                {locale === 'ckb'
                  ? 'هەڵبژاردنی وێنەی کۆد'
                  : locale === 'ar'
                  ? 'مسح من الأستوديو'
                  : 'Scan from Gallery'}
              </span>
            </button>

            {/* Retry lens */}
            <button
              onClick={startScanner}
              disabled={status === 'requesting-permission'}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-museum-secondary hover:text-parchment transition-colors"
              title="Restart Camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Manual test / fallback destination */}
          <div className="w-full pt-3 border-t border-museum-divider flex flex-col gap-2">
            <button
              onClick={() => {
                stopScanner();
                onClose();
                router.push('/artworks/chamchamal-freedom-monument');
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/40 text-gold-light hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-gold-glow"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>
                {locale === 'ckb'
                  ? 'تاقیکردنەوە: کردنەوەی پەیکەری چەمچەماڵ (۳D)'
                  : locale === 'ar'
                  ? 'تجربة: فتح نصب جمجمال ثلاثي الأبعاد'
                  : 'Direct Demo: Open 3D Freedom Monument'}
              </span>
              <ExternalLink className="w-3 h-3 text-gold" />
            </button>

            <button
              onClick={() => {
                stopScanner();
                onClose();
                const el = document.getElementById('gallery-feed');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[11px] text-museum-caption hover:text-parchment transition-colors py-1"
            >
              {locale === 'ckb' ? 'داخستن و گەڕان بەناو ئەرشیف' : 'Close and browse archive'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
