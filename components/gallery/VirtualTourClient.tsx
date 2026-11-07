'use client';

import React, { useState, useRef, useMemo, Suspense, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { Canvas, useFrame } from '@react-three/fiber';
import { useArchive, AmbientTrack } from '@/context/ArchiveContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigationTransition } from '@/context/NavigationTransitionContext';
import { useResolvedAudioUrl } from '@/hooks/useResolvedAudioUrl';
import { Artwork, getArtworkDepartment, getArtworkDepartmentLabel } from '@/data/artworks';
import { LandscapeOrientationPrompt } from './controls/LandscapeOrientationPrompt';
import { DualVirtualJoysticks } from './controls/DualVirtualJoysticks';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
  X,
  ExternalLink,
  Eye,
  Crosshair,
  Move,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  DoorOpen,
  Box,
  Loader2,
  RotateCcw,
  RotateCw,
} from 'lucide-react';

// Scene component imports
import { LobbyScene, SceneType } from './scenes/LobbyScene';
import { PaintingScene } from './scenes/PaintingScene';
import { SculptureScene } from './scenes/SculptureScene';
import { MixedScene } from './scenes/MixedScene';

// Walking speed constant (used only for HUD logic, actual movement is in scene rigs)
const ENTRY_BUFFER = 5.0;
const SPACING_INTERVAL = 5.5;

// High-frequency 60fps controller that maps Left Virtual Joystick to Smooth Free-Look / Panning
function JoystickLookRigController({
  joystickLookRef,
  onRotate,
}: {
  joystickLookRef: React.MutableRefObject<{ x: number; y: number }>;
  onRotate: (deltaYaw: number, deltaPitch: number) => void;
}) {
  useFrame((_, delta) => {
    const look = joystickLookRef.current;
    if (Math.abs(look.x) > 0.03 || Math.abs(look.y) > 0.03) {
      const safeDelta = Number.isFinite(delta) && delta > 0 ? Math.min(delta, 0.1) : 0.016;
      const YAW_SPEED = 2.4;
      const PITCH_SPEED = 1.8;
      // Invert look.x so pushing right turns camera right (decreases yaw in Three.js coordinates)
      onRotate(-look.x * YAW_SPEED * safeDelta, look.y * PITCH_SPEED * safeDelta);
    }
  });

  return null;
}

// Main Interactive Virtual 3D Multi-Room Museum Component
export function VirtualTourClient() {
  const { artworks, gallerySettings } = useArchive();
  const { locale, isRTL } = useLanguage();
  const { navigateTo, prefetch, navigatingHref, isNavigating } = useNavigationTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  const isExitingToHome = navigatingHref === '/';

  // ─────────────────────────────────────────────────────────────
  // Scene Management State (React 18 Concurrent Transitions)
  // ─────────────────────────────────────────────────────────────
  const [currentScene, setCurrentScene] = useState<SceneType>('lobby');
  const [isPending, startTransition] = useTransition();

  // Filter artworks strictly by department for each 3D exhibition hall
  const paintingArtworks = useMemo(() => {
    const list = artworks.filter(
      (a) => a.department === 'painting' || getArtworkDepartment(a) === 'painting'
    );
    return list.length > 0 ? list : artworks.filter((a) => a.category === 'painting');
  }, [artworks]);

  const sculptureArtworks = useMemo(() => {
    const sculpts = artworks.filter(
      (a) => a.department === 'sculpture' || getArtworkDepartment(a) === 'sculpture'
    );
    return sculpts.length > 0 ? sculpts : artworks.filter((a) => a.category === 'sculpture' || a.category === 'ceramics');
  }, [artworks]);

  const mixedArtworks = useMemo(() => {
    const mixed = artworks.filter(
      (a) => a.department === 'mixed' || getArtworkDepartment(a) === 'mixed'
    );
    return mixed.length > 0 ? mixed : artworks.filter((a) => a.category === 'design' || a.category === 'music' || a.category === 'theater');
  }, [artworks]);

  const activeArtworksList = useMemo(() => {
    switch (currentScene) {
      case 'painting':
        return paintingArtworks;
      case 'sculpture':
        return sculptureArtworks;
      case 'mixed':
        return mixedArtworks;
      default:
        return artworks;
    }
  }, [currentScene, paintingArtworks, sculptureArtworks, mixedArtworks, artworks]);

  // ─────────────────────────────────────────────────────────────
  // Multi-Track Ambient Audio State
  // ─────────────────────────────────────────────────────────────
  const ambientTracks: AmbientTrack[] = useMemo(() => {
    return gallerySettings?.ambientTracks && gallerySettings.ambientTracks.length > 0
      ? gallerySettings.ambientTracks
      : [
          {
            id: 'default-1',
            title: 'Museum Atelier Reverie • ئاوازی نەرمی هۆڵی پێشانگا',
            url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-impromptu-01-112196.mp3',
          },
          {
            id: 'default-2',
            title: 'Echoes of Garmian Strings • تاری کلاسیکی کوردی',
            url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
          },
        ];
  }, [gallerySettings]);

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = ambientTracks[activeTrackIndex] || ambientTracks[0];
  const { resolvedUrl: playableAudioUrl, isLoading: isAudioResolving } = useResolvedAudioUrl(currentTrack?.url);

  // ─────────────────────────────────────────────────────────────
  // Shared Camera Navigation State (used by all hall scenes)
  // ─────────────────────────────────────────────────────────────
  const [targetZ, setTargetZ] = useState(1.8);
  const [targetX, setTargetX] = useState(0);
  const [moveDirection, setMoveDirection] = useState(0); // -1: forward, +1: backward, 0: idle
  const [targetYaw, setTargetYaw] = useState(0);
  const [targetPitch, setTargetPitch] = useState(0);
  const [focusedArtworkIndex, setFocusedArtworkIndex] = useState<number | null>(null);
  const [activeArtworkIndex, setActiveArtworkIndex] = useState(0);

  // Dual Virtual Joysticks & Mobile Orientation State
  const [joystickMove, setJoystickMove] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const joystickLookRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isLandscapePromptDismissed, setIsLandscapePromptDismissed] = useState(false);

  useEffect(() => {
    const checkDeviceOrientation = () => {
      if (typeof window === 'undefined') return;
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const landscape = window.innerWidth > window.innerHeight;
      setIsTouchDevice(touch);
      setIsLandscape(landscape);
    };

    checkDeviceOrientation();
    window.addEventListener('resize', checkDeviceOrientation);
    window.addEventListener('orientationchange', checkDeviceOrientation);

    return () => {
      window.removeEventListener('resize', checkDeviceOrientation);
      window.removeEventListener('orientationchange', checkDeviceOrientation);
    };
  }, []);

  // Joystick Input Handlers
  const handleJoystickMove = useCallback((vector: { x: number; y: number }) => {
    setJoystickMove(vector);
    if (Math.abs(vector.y) > 0.15) {
      setMoveDirection(vector.y > 0 ? -1 : 1);
    } else {
      setMoveDirection(0);
    }
  }, []);

  const handleJoystickLook = useCallback((vector: { x: number; y: number }) => {
    joystickLookRef.current = vector;
  }, []);

  const handleJoystickRotate = useCallback((deltaYaw: number, deltaPitch: number) => {
    setTargetYaw((prev) => prev + deltaYaw);
    setTargetPitch((prev) => Math.max(-Math.PI / 4, Math.min(Math.PI / 4, prev + deltaPitch)));
  }, []);

  // UI Overlays & Modals
  const [selectedModalArtwork, setSelectedModalArtwork] = useState<Artwork | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioPlayerExpanded, setIsAudioPlayerExpanded] = useState(false);

  // Drag / Look / Multi-Touch interaction state
  const isPointerDownRef = useRef(false);
  const lastPointerPosRef = useRef({ x: 0, y: 0 });
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastPinchDistRef = useRef<number | null>(null);

  // Quick 45-degree turn helpers for fluid mobile and keyboard navigation
  const handleTurnLeft = useCallback(() => {
    setTargetYaw((prev) => prev + Math.PI / 4);
  }, []);

  const handleTurnRight = useCallback(() => {
    setTargetYaw((prev) => prev - Math.PI / 4);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Scene Transition: Non-blocking Concurrent Navigation
  // ─────────────────────────────────────────────────────────────
  const handleNavigateToScene = useCallback((scene: SceneType) => {
    setTargetZ(1.8);
    setTargetX(0);
    setTargetYaw(0);
    setTargetPitch(0);
    setMoveDirection(0);
    setJoystickMove({ x: 0, y: 0 });
    joystickLookRef.current = { x: 0, y: 0 };
    setFocusedArtworkIndex(null);
    setActiveArtworkIndex(0);
    setSelectedModalArtwork(null);

    // Non-blocking React 18 transition
    startTransition(() => {
      setCurrentScene(scene);
    });
  }, []);

  const handleBackToLobby = useCallback(() => {
    handleNavigateToScene('lobby');
  }, [handleNavigateToScene]);

  // ─────────────────────────────────────────────────────────────
  // Audio Playback Controls
  // ─────────────────────────────────────────────────────────────
  const handleTogglePlay = useCallback(() => {
    if (!audioRef.current || !playableAudioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => { console.warn('Playback error (requires user interaction)', e); setIsPlaying(false); });
    }
  }, [isPlaying, playableAudioUrl]);

  const handleNextTrack = useCallback(() => {
    setActiveTrackIndex((prev) => (prev + 1) % ambientTracks.length);
  }, [ambientTracks.length]);

  const handlePrevTrack = useCallback(() => {
    setActiveTrackIndex((prev) => (prev - 1 + ambientTracks.length) % ambientTracks.length);
  }, [ambientTracks.length]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying && playableAudioUrl) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [playableAudioUrl, activeTrackIndex, isPlaying, volume]);

  // ─────────────────────────────────────────────────────────────
  // Click-to-Focus (Unified Painting Linear Corridor & Sculpture Radial Rotunda)
  // ─────────────────────────────────────────────────────────────
  const handleFocusArtwork = useCallback(
    (artwork: Artwork, index: number, coords?: { x: number; y: number; z: number }) => {
      if (typeof index !== 'number' || isNaN(index)) return;
      setFocusedArtworkIndex(index);
      setActiveArtworkIndex(index);
      setMoveDirection(0);

      if (currentScene === 'painting') {
        const artZ = -(ENTRY_BUFFER + index * SPACING_INTERVAL);
        setTargetZ(artZ);
        const isLeft = index % 2 === 0;
        setTargetYaw(isLeft ? Math.PI / 2 : -Math.PI / 2);
        setTargetPitch(0);
      } else if (currentScene === 'sculpture') {
        const total = sculptureArtworks.length;
        if (total > 0) {
          const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
          // Camera looks outward toward perimeter directly at the sculpture
          const focusYaw = angle + Math.PI;
          setTargetYaw(focusYaw);
          const targetScale = typeof artwork.modelScale === 'number' && artwork.modelScale > 0 ? artwork.modelScale : 1.0;
          const targetArtY = artwork.hasPedestal !== false ? 1.04 + 0.45 * targetScale : Math.max(0.6, 0.45 * targetScale);
          const camY = artwork.hasPedestal !== false ? 1.65 : Math.max(1.35, 1.2 + 0.25 * targetScale);
          const camDist = 2.4 + (targetScale > 1 ? Math.min(2.5, (targetScale - 1) * 0.7) : 0);
          setTargetPitch(Math.atan2(targetArtY - camY, camDist));
        }
      }
    },
    [currentScene, sculptureArtworks]
  );

  const handleResetFocus = useCallback(() => {
    setFocusedArtworkIndex(null);
    setMoveDirection(0);
    if (currentScene === 'painting') {
      setTargetYaw(0);
      setTargetPitch(0);
    } else if (currentScene === 'sculpture') {
      // Level the pitch in the circular rotunda while preserving comfortable horizontal gaze
      setTargetPitch(0);
    }
  }, [currentScene]);

  // ─────────────────────────────────────────────────────────────
  // Keyboard Navigation
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedModalArtwork) {
          setSelectedModalArtwork(null);
          return;
        }
        if (focusedArtworkIndex !== null) {
          handleResetFocus();
          return;
        }
        if (currentScene !== 'lobby') {
          handleBackToLobby();
        }
        return;
      }
      if (currentScene === 'lobby') return;
      if (focusedArtworkIndex !== null) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setMoveDirection(-1);
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') setMoveDirection(1);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'w', 'W', 's', 'S'].includes(e.key)) setMoveDirection(0);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [focusedArtworkIndex, selectedModalArtwork, handleResetFocus, handleBackToLobby, currentScene]);

  // ─────────────────────────────────────────────────────────────
  // Mouse Wheel Navigation (hall scenes only)
  // ─────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (currentScene === 'lobby') return;
    if (focusedArtworkIndex !== null) return;
    setTargetZ((prev) => {
      const next = prev - e.deltaY * 0.012;
      return Math.max(-200, Math.min(1.8, next));
    });
  }, [currentScene, focusedArtworkIndex]);

  // ─────────────────────────────────────────────────────────────
  // Free-Look & Multi-Touch Drag/Pinch Handlers (Optimized for Mobile)
  // ─────────────────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (currentScene === 'painting' && focusedArtworkIndex !== null) return;
    if ((e.target as HTMLElement).tagName === 'CANVAS') {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      isPointerDownRef.current = true;
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

      if (activePointersRef.current.size === 2) {
        const points = Array.from(activePointersRef.current.values());
        lastPinchDistRef.current = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      }

      try { (e.target as HTMLElement).setPointerCapture(e.pointerId); } catch (_) {}
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Multi-touch 2-Finger Pinch-to-Zoom / Dolly on touch screens
    if (activePointersRef.current.size >= 2) {
      const points = Array.from(activePointersRef.current.values());
      const currentDist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      if (lastPinchDistRef.current !== null) {
        const pinchDelta = currentDist - lastPinchDistRef.current;
        if (currentScene !== 'lobby') {
          setTargetZ((prev) => {
            const next = prev + pinchDelta * 0.038;
            return Math.max(-200, Math.min(1.8, next));
          });
        }
      }
      lastPinchDistRef.current = currentDist;
      return;
    }

    if (currentScene === 'painting' && focusedArtworkIndex !== null) return;

    // Single-pointer rotation (fluid orbit/pan)
    const dx = e.clientX - lastPointerPosRef.current.x;
    const dy = e.clientY - lastPointerPosRef.current.y;
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

    // Adaptive touch sensitivity: Touch screens have high pixel density and short thumb travel
    const isTouch = e.pointerType === 'touch';
    const SENSITIVITY = isTouch ? 0.0068 : 0.0035;

    setTargetYaw((prev) => prev - dx * SENSITIVITY);
    setTargetPitch((prev) => Math.max(-Math.PI / 4, Math.min(Math.PI / 4, prev - dy * SENSITIVITY)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      lastPinchDistRef.current = null;
    }
    if (activePointersRef.current.size === 0) {
      isPointerDownRef.current = false;
    }
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch (_) {}
  };

  // ─────────────────────────────────────────────────────────────
  // Fullscreen API
  // ─────────────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) await containerRef.current.requestFullscreen();
        else if ((containerRef.current as any)?.webkitRequestFullscreen) await (containerRef.current as any).webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if ((document as any)?.webkitExitFullscreen) await (document as any).webkitExitFullscreen();
      }
    } catch (err) { console.error('Fullscreen error:', err); }
  }, []);

  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFSChange);
    document.addEventListener('webkitfullscreenchange', handleFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange);
      document.removeEventListener('webkitfullscreenchange', handleFSChange);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Computed values for HUD
  // ─────────────────────────────────────────────────────────────
  const currentArtwork = activeArtworksList[activeArtworkIndex] || activeArtworksList[0] || artworks[0];
  const focusedArtwork = focusedArtworkIndex !== null ? (activeArtworksList[focusedArtworkIndex] || null) : null;

  const isInHall = currentScene !== 'lobby';
  const isPaintingHall = currentScene === 'painting';

  // Painting-specific: max travel distance for progress bar
  const paintingCorridorLength = useMemo(() =>
    Math.max(30, artworks.length * SPACING_INTERVAL + ENTRY_BUFFER + 8.0),
    [artworks.length]
  );
  const maxTravelDistance = paintingCorridorLength - 7;
  const progressRatio = isPaintingHall
    ? Math.max(0, Math.min(1, (1.8 - targetZ) / maxTravelDistance))
    : 0;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`dark relative w-full h-screen bg-[#070709] text-[#F5F3EC] overflow-hidden select-none touch-none transition-opacity duration-300 ${
        isNavigating ? 'opacity-85 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Hidden Native Audio Element for Playlist */}
      <audio ref={audioRef} src={playableAudioUrl} onEnded={handleNextTrack} preload="auto" />

      {/* ── Main 3D WebGL Canvas ── */}
      <Canvas
        camera={{ position: [0, 1.7, 1.8], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          {/* Active 60fps Native Left Joystick Look / Panning Controller */}
          <JoystickLookRigController
            joystickLookRef={joystickLookRef}
            onRotate={handleJoystickRotate}
          />

          {/* Grand Lobby */}
          {currentScene === 'lobby' && (
            <LobbyScene
              onNavigate={handleNavigateToScene}
              targetYaw={targetYaw}
              targetPitch={targetPitch}
            />
          )}

          {/* Painting Hall */}
          {currentScene === 'painting' && (
            <PaintingScene
              artworks={paintingArtworks}
              locale={locale}
              targetZ={targetZ}
              targetX={targetX}
              moveVector={joystickMove}
              moveDirection={moveDirection}
              targetYaw={targetYaw}
              targetPitch={targetPitch}
              focusedArtworkIndex={focusedArtworkIndex}
              onUpdateTargetZ={setTargetZ}
              onUpdateTargetX={setTargetX}
              onUpdateActiveIndex={setActiveArtworkIndex}
              onFocusArtwork={handleFocusArtwork}
              onOpenModal={(item) => setSelectedModalArtwork(item)}
            />
          )}

          {/* Sculpture Hall */}
          {currentScene === 'sculpture' && (
            <SculptureScene
              artworks={sculptureArtworks}
              locale={locale}
              targetZ={targetZ}
              moveVector={joystickMove}
              moveDirection={moveDirection}
              targetYaw={targetYaw}
              targetPitch={targetPitch}
              focusedArtworkIndex={focusedArtworkIndex}
              onUpdateTargetZ={setTargetZ}
              onUpdateActiveIndex={setActiveArtworkIndex}
              onFocusArtwork={handleFocusArtwork}
              onOpenModal={(item) => setSelectedModalArtwork(item)}
            />
          )}

          {/* Mixed Hall */}
          {currentScene === 'mixed' && (
            <MixedScene
              artworks={mixedArtworks}
              locale={locale}
              targetZ={targetZ}
              targetX={targetX}
              moveVector={joystickMove}
              moveDirection={moveDirection}
              targetYaw={targetYaw}
              targetPitch={targetPitch}
              onUpdateTargetZ={setTargetZ}
              onUpdateTargetX={setTargetX}
              onUpdateActiveIndex={setActiveArtworkIndex}
            />
          )}
        </Suspense>
      </Canvas>

      {/* ── Non-Blocking Scene Transition Loading HUD ── */}
      {isPending && (
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-200">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#0e0e12]/95 border border-gold/30 shadow-gold-glow animate-pulse">
            <div className="w-10 h-10 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
            <div className="flex flex-col items-center text-center gap-1">
              <span className="text-sm font-bold text-parchment-pure font-serif">
                {locale === 'ckb' ? 'پەڕینەوە بۆ هۆڵی هونەر...' : locale === 'ar' ? 'الانتقال إلى قاعة العرض...' : 'Entering Curatorial Gallery...'}
              </span>
              <span className="text-[11px] text-white/50">
                {locale === 'ckb' ? 'بارکردنی شاکارەکان و فەزای سێ ڕەهەندی' : locale === 'ar' ? 'تحميل الفضاء ثلاثي الأبعاد والمقتنيات' : 'Synthesizing 3D Architectural Space'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Navigation & Curatorial Header ── */}
      <header className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between pointer-events-none z-20 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
        {/* Back Link to Archive site with Instant 0ms Micro-Feedback & Concurrent Routing */}
        <button
          type="button"
          onClick={() => navigateTo('/')}
          onMouseEnter={() => prefetch('/')}
          onPointerDown={() => prefetch('/')}
          className={`pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 shadow-glass-pill backdrop-blur-md cursor-pointer active:scale-95 group ${
            isExitingToHome
              ? 'bg-gold/30 border border-gold text-gold shadow-gold-glow animate-pulse'
              : 'bg-black/60 hover:bg-gold/15 border border-white/10 hover:border-gold/50 text-xs font-medium text-parchment hover:text-gold'
          }`}
        >
          {isExitingToHome ? (
            <Loader2 className="w-4 h-4 text-gold animate-spin" />
          ) : isRTL ? (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          ) : (
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          )}
          <span>
            {isExitingToHome
              ? (locale === 'ckb' ? 'دەگەڕێتەوە...' : 'Exiting...')
              : (locale === 'ckb' ? 'گەڕانەوە بۆ ئەرشیف' : locale === 'ar' ? 'العودة للأرشيف' : 'Return to Archive')}
          </span>
        </button>

        {/* Center Scene Identifier */}
        <div className="hidden md:flex flex-col items-center pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-gold/30 text-gold text-xs font-mono shadow-gold-glow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>
              {currentScene === 'lobby'
                ? (locale === 'ckb' ? 'دەروازەی گەورە • GRAND LOBBY' : locale === 'ar' ? 'الردهة الكبرى' : 'GRAND LOBBY')
                : currentScene === 'painting'
                ? (locale === 'ckb' ? 'بەشی وێنەکێشان • PAINTING HALL' : 'PAINTING HALL')
                : currentScene === 'sculpture'
                ? (locale === 'ckb' ? 'بەشی پەیکەرسازی • SCULPTURE HALL' : 'SCULPTURE HALL')
                : (locale === 'ckb' ? 'بابەتی تێکەڵاو • MIXED GALLERY' : 'MIXED GALLERY')}
            </span>
          </div>
          <span className="text-[11px] text-white/50 mt-1 font-serif">
            {locale === 'ckb' ? 'پەیمانگەی هونەرە جوانەکانی چەمچەماڵ' : 'Chamchamal Fine Arts Archive'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Audio toggle */}
          <button
            onClick={handleTogglePlay}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95 shadow-glass-pill backdrop-blur-md cursor-pointer ${
              isPlaying
                ? 'bg-gold/20 text-gold border-gold/60 shadow-gold-glow-sm'
                : 'bg-black/60 text-white/70 hover:text-white border-white/10 hover:border-gold/50'
            }`}
            title={isPlaying ? 'بێدەنگکردن' : 'لێدانی مۆسیقا'}
          >
            {isPlaying ? <Volume2 className="w-4 h-4 text-gold" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-gold/20 active:bg-gold/30 active:scale-95 border border-gold/40 hover:border-gold flex items-center justify-center text-white hover:text-gold transition-all shadow-glass-pill backdrop-blur-md cursor-pointer"
            title={isFullscreen ? 'دەرچوون لە پڕاوپڕکردن' : 'پڕاوپڕکردنی پەردە'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-gold" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── Back to Lobby Button (shown when inside a hall) ── */}
      {isInHall && (
        <button
          onClick={handleBackToLobby}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/80 hover:bg-gold/20 active:bg-gold/30 active:scale-95 border border-gold/40 hover:border-gold text-gold text-xs font-bold shadow-gold-glow-sm backdrop-blur-xl transition-all cursor-pointer"
          title={locale === 'ckb' ? 'گەڕانەوە بۆ دەروازەی گەورە' : 'Back to Grand Lobby'}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 text-gold animate-spin" />
          ) : (
            <DoorOpen className="w-4 h-4" />
          )}
          <span>
            {isPending
              ? (locale === 'ckb' ? 'پەڕینەوە...' : 'Opening Lobby...')
              : (locale === 'ckb' ? 'گەڕانەوە بۆ دەروازە' : locale === 'ar' ? 'العودة للردهة' : 'Back to Lobby')}
          </span>
        </button>
      )}

      {/* ── Collapsible Ambient Multi-Track Media Player ── */}
      {!isAudioPlayerExpanded ? (
        /* ── Compact Floating Audio Trigger Button ── */
        <button
          type="button"
          onClick={() => setIsAudioPlayerExpanded(true)}
          className={`fixed ${
            isTouchDevice
              ? 'top-20 start-3 sm:start-6'
              : 'bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4.25rem))] md:bottom-6 start-3 sm:start-6'
          } z-35 pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all active:scale-90 cursor-pointer group ${
            isPlaying
              ? 'bg-black/90 border-gold/70 text-gold shadow-gold-glow-sm hover:border-gold hover:shadow-gold-glow'
              : 'bg-black/80 border-white/15 text-white/70 hover:text-gold hover:border-gold/40'
          }`}
          title={
            locale === 'ckb'
              ? `مۆسیقای باکگراوند: ${currentTrack?.title || ''}`
              : locale === 'ar'
              ? `الموسيقى: ${currentTrack?.title || ''}`
              : `Audio Guide: ${currentTrack?.title || ''}`
          }
          aria-label="Open Audio Player"
        >
          <Music className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${isPlaying ? 'text-gold animate-pulse' : ''}`} />

          {/* Active audio pulsating indicator badge */}
          {isPlaying && (
            <span className="absolute -top-1 -end-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-gold to-amber-500 border border-obsidian" />
            </span>
          )}
        </button>
      ) : (
        /* ── Expanded Full Media Player Card with Minimize/Close Button ── */
        <div
          className={`fixed ${
            isTouchDevice
              ? 'top-20 start-3 sm:start-6'
              : 'bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4.25rem))] md:bottom-6 start-3 sm:start-6'
          } z-50 pointer-events-auto max-w-[280px] sm:max-w-sm w-[calc(100vw-24px)] transition-all animate-in fade-in zoom-in-95 duration-200`}
        >
          <div className="p-3 sm:p-4 rounded-2xl bg-black/95 border border-gold/60 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex flex-col gap-2.5 transition-all">
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                    isPlaying
                      ? 'bg-gold/20 text-gold border-gold/60 shadow-gold-glow-sm'
                      : 'bg-white/5 text-museum-secondary border-white/10'
                  }`}
                >
                  <Music className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse text-gold' : ''}`} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-mono text-gold uppercase tracking-wider truncate">
                    {locale === 'ckb' ? 'مۆسیقای باکگراوند' : locale === 'ar' ? 'موسيقى المعرض' : 'Ambient Music'} • {activeTrackIndex + 1}/{ambientTracks.length}
                  </span>
                  {isAudioResolving && <span className="text-[9px] font-mono text-gold animate-pulse">Loading...</span>}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isPlaying && (
                  <div className="flex items-center gap-0.5 me-1">
                    <span className="w-0.5 h-2 bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-3 bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-2 bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
                {/* Minimize / Close Button */}
                <button
                  type="button"
                  onClick={() => setIsAudioPlayerExpanded(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-gold hover:bg-gold/15 active:scale-95 transition-all cursor-pointer"
                  title={locale === 'ckb' ? 'داخستنی پەنجەرە' : locale === 'ar' ? 'تصغير' : 'Minimize Audio Player'}
                  aria-label="Close Audio Player"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Track Title */}
            <h4 className="text-xs font-bold text-parchment-pure truncate font-serif px-0.5" title={currentTrack?.title}>
              {currentTrack?.title || 'Ambient Track'}
            </h4>

            {/* Player Controls & Volume Slider */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevTrack}
                  className="p-1.5 rounded-lg hover:bg-gold/15 text-museum-secondary hover:text-gold transition-colors cursor-pointer active:scale-95"
                  title="Previous Track"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleTogglePlay}
                  className="w-7 h-7 rounded-full bg-gradient-to-r from-gold via-amber-400 to-amber-500 text-obsidian flex items-center justify-center shadow-gold-glow-sm hover:shadow-gold-glow transition-all active:scale-90 cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-obsidian" /> : <Play className="w-3.5 h-3.5 fill-obsidian ms-0.5" />}
                </button>
                <button
                  onClick={handleNextTrack}
                  className="p-1.5 rounded-lg hover:bg-gold/15 text-museum-secondary hover:text-gold transition-colors cursor-pointer active:scale-95"
                  title="Next Track"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Volume2 className="w-3 h-3 text-gold/80 shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-white/20 rounded-full accent-gold cursor-pointer"
                  title={`Volume: ${Math.round(volume * 100)}%`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Center HUD: Nav Pad + Artwork Card (shown only in halls) ── */}
      {isInHall && (
        <footer className="fixed bottom-3 sm:bottom-4 inset-x-2 sm:inset-x-4 pointer-events-none z-30 flex flex-col items-center gap-2 max-w-sm sm:max-w-md mx-auto w-full">
          {/* Active / Focused Artwork Pill Card (Painting and Sculpture halls) */}
          {(isPaintingHall || currentScene === 'sculpture') && (focusedArtwork || currentArtwork) && (
            <div className="pointer-events-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-black/85 border border-gold/40 hover:border-gold/70 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl flex items-center gap-2.5 sm:gap-3 transition-all max-w-sm sm:max-w-md w-full justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden border border-gold/50 shrink-0 bg-black">
                  <SafeImage
                    src={(focusedArtwork || currentArtwork).imageUrl}
                    alt={(focusedArtwork || currentArtwork).title[locale] || (focusedArtwork || currentArtwork).title.en}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    {focusedArtwork && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold bg-gold/20 text-gold border border-gold/40">
                        <Crosshair className="w-2.5 h-2.5" />
                        <span>{locale === 'ckb' ? 'سەرنجدراو' : 'Focused'}</span>
                      </span>
                    )}
                    <span className="text-[9px] sm:text-[10px] text-gold font-mono uppercase tracking-wider truncate">
                      {getArtworkDepartmentLabel((focusedArtwork || currentArtwork).departmentLabel || (focusedArtwork || currentArtwork).department, locale)} • {(focusedArtwork || currentArtwork).year}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-parchment-pure truncate font-serif mt-0.5">
                    {(focusedArtwork || currentArtwork).title[locale] || (focusedArtwork || currentArtwork).title.ckb}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {focusedArtwork && (
                  <button
                    onClick={handleResetFocus}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-gold/20 text-white hover:text-gold border border-white/15 hover:border-gold/50 text-[10px] sm:text-xs font-mono transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="font-sans font-medium">
                      {locale === 'ckb' ? 'داخستن' : locale === 'ar' ? 'إلغاء' : 'Exit Focus'}
                    </span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedModalArtwork(focusedArtwork || currentArtwork)}
                  className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-gold via-amber-400 to-amber-500 text-obsidian text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-gold-glow-sm hover:shadow-gold-glow transition-all cursor-pointer"
                >
                  <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-obsidian" />
                  <span>{locale === 'ckb' ? 'وردەکاری' : locale === 'ar' ? 'معاينة' : 'Inspect'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Desktop Only Navigation Controls (Old clunky buttons are removed on mobile/touch, where Dual Joysticks take over) */}
          {!isTouchDevice && (
            <div className="pointer-events-auto hidden md:flex items-center justify-center gap-2 select-none">
              <button
                type="button"
                onClick={handleTurnLeft}
                className="w-10 h-10 rounded-xl bg-black/80 hover:bg-gold/20 active:bg-gold/30 border border-gold/40 hover:border-gold flex items-center justify-center text-gold shadow-art-card backdrop-blur-xl transition-all cursor-pointer"
                title="Turn Left 45°"
              >
                <RotateCcw className="w-4 h-4 text-gold" />
              </button>

              <button
                disabled={isPaintingHall && focusedArtworkIndex !== null}
                onClick={() => {
                  if (isPaintingHall && focusedArtworkIndex !== null) return;
                  setTargetZ((prev) => Math.min(1.8, prev + 2.5));
                }}
                className="px-4 py-2 rounded-xl bg-black/80 hover:bg-gold/20 border border-gold/40 text-parchment-pure shadow-art-card backdrop-blur-xl flex items-center gap-1.5 cursor-pointer text-xs font-bold"
              >
                <ArrowDown className="w-3.5 h-3.5 text-gold" />
                <span>{locale === 'ckb' ? 'دواوە' : 'Back'}</span>
              </button>

              <button
                onClick={handleResetFocus}
                className="w-10 h-10 rounded-xl bg-black/80 hover:bg-gold/20 border border-gold/40 hover:border-gold flex items-center justify-center text-gold shadow-art-card backdrop-blur-xl transition-all cursor-pointer"
                title="Recenter View"
              >
                <Compass className="w-4 h-4 text-gold" />
              </button>

              <button
                disabled={isPaintingHall && focusedArtworkIndex !== null}
                onClick={() => {
                  if (isPaintingHall && focusedArtworkIndex !== null) return;
                  setTargetZ((prev) => Math.max(-200, prev - 2.5));
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold/30 to-amber-900/35 border border-gold/60 text-gold-light backdrop-blur-xl flex items-center gap-1.5 cursor-pointer text-xs font-bold"
              >
                <ArrowUp className="w-3.5 h-3.5 text-gold" />
                <span>{locale === 'ckb' ? 'پێشەوە' : 'Forward'}</span>
              </button>

              <button
                type="button"
                onClick={handleTurnRight}
                className="w-10 h-10 rounded-xl bg-black/80 hover:bg-gold/20 active:bg-gold/30 border border-gold/40 hover:border-gold flex items-center justify-center text-gold shadow-art-card backdrop-blur-xl transition-all cursor-pointer"
                title="Turn Right 45°"
              >
                <RotateCw className="w-4 h-4 text-gold" />
              </button>
            </div>
          )}

          {/* Guidance hint + Progress bar (Painting hall only) */}
          <div className="flex flex-col items-center gap-1 w-full max-w-sm sm:max-w-md">
            {!isTouchDevice && (
              <div className="hidden md:flex items-center gap-1.5 text-[10px] text-white/50 font-mono text-center">
                <Move className="w-3 h-3 text-gold shrink-0" />
                <span>
                  {locale === 'ckb'
                    ? 'W/A/S/D یان دوگمەکانی تەختەکلیل بۆ ڕۆیشتن • ڕاکێشانی ماوس بۆ سەیرکردن'
                    : 'W/A/S/D or Arrow Keys to Walk • Click & Drag Mouse to Look'}
                </span>
              </div>
            )}
            {isPaintingHall && (
              <div className="w-full flex flex-col gap-1 px-1">
                <div className="w-full h-1 sm:h-1.5 rounded-full bg-white/10 overflow-hidden relative shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-gold via-amber-400 to-amber-600 transition-all duration-150"
                    style={{ width: `${Math.round(progressRatio * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between w-full text-[9px] font-mono text-white/40 px-0.5">
                  <span>{locale === 'ckb' ? 'دەروازەی پێشانگا' : 'Grand Entrance'}</span>
                  <span className="text-gold font-bold">{Math.round(progressRatio * 100)}%</span>
                  <span>{locale === 'ckb' ? 'کۆتایی هۆڵ' : 'Rotunda End'}</span>
                </div>
              </div>
            )}
          </div>
        </footer>
      )}

      {/* Lobby hint when in lobby */}
      {!isInHall && (
        <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 w-full max-w-sm sm:max-w-md flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/75 border border-gold/30 shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl text-[10px] sm:text-[11px] text-white/70 font-mono text-center">
            <Move className="w-3 h-3 text-gold shrink-0" />
            <span>
              {locale === 'ckb'
                ? 'دەستلێدان و ڕاکێشان بۆ سەیرکردن • دوو پەنجە بۆ زووم • کلیک لە دەروازەکان بکە'
                : locale === 'ar'
                ? 'اسحب للنظر • إصبعان للتكبير • انقر على الأبواب للدخول'
                : 'Swipe to Look • Pinch to Zoom • Tap Doors to Enter'}
            </span>
          </div>
        </div>
      )}

      {/* ── Curatorial Artwork Inspection Modal (Painting hall) ── */}
      {selectedModalArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-obsidian-surface via-obsidian-surface/95 to-obsidian border border-gold/40 shadow-[0_25px_60px_rgba(212,175,55,0.2)] p-6 sm:p-10 flex flex-col md:flex-row gap-8">
            <button
              onClick={() => setSelectedModalArtwork(null)}
              className="absolute top-5 end-5 w-10 h-10 rounded-full bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/50 flex items-center justify-center text-white hover:text-gold transition-all z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Artwork Preview */}
            <div className="relative w-full md:w-1/2 aspect-square sm:aspect-[4/3] md:aspect-auto rounded-2xl overflow-hidden border border-gold/30 bg-black shrink-0">
              <SafeImage
                src={selectedModalArtwork.imageUrl}
                alt={selectedModalArtwork.title[locale] || selectedModalArtwork.title.en}
                fill
                className="object-contain"
              />
              {selectedModalArtwork.has3DModel && (
                <div className="absolute top-3 start-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs font-bold text-gold border border-gold/40 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>3D / Photogrammetry Available</span>
                </div>
              )}
            </div>

            {/* Curatorial Details */}
            <div className="flex flex-col justify-between flex-1 gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-gold/15 text-gold border border-gold/30">
                    {selectedModalArtwork.categoryLabel[locale] || selectedModalArtwork.categoryLabel.ckb}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-mono text-white/50 bg-white/5 border border-white/10">
                    {selectedModalArtwork.year}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-parchment-pure font-serif">
                  {selectedModalArtwork.title[locale] || selectedModalArtwork.title.ckb}
                </h2>
                <div className="flex items-center gap-2 text-xs text-gold mt-1.5 font-medium">
                  <span>{selectedModalArtwork.artist[locale] || selectedModalArtwork.artist.ckb}</span>
                  <span>•</span>
                  <span className="text-museum-secondary">
                    {getArtworkDepartmentLabel(selectedModalArtwork.departmentLabel || selectedModalArtwork.department, locale)}
                  </span>
                </div>
                <p className="mt-4 text-xs sm:text-sm text-museum-secondary leading-relaxed line-clamp-4">
                  {selectedModalArtwork.description[locale] || selectedModalArtwork.description.ckb}
                </p>
                <div className="mt-4 pt-4 border-t border-museum-divider/60 grid grid-cols-2 gap-3 text-xs font-mono text-museum-caption">
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase">Medium</span>
                    <span className="text-parchment truncate block">{selectedModalArtwork.medium[locale] || selectedModalArtwork.medium.ckb}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase">Dimensions</span>
                    <span className="text-parchment truncate block">{selectedModalArtwork.dimensions}</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-museum-divider flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo(`/artworks/${selectedModalArtwork.slug}`)}
                  onMouseEnter={() => prefetch(`/artworks/${selectedModalArtwork.slug}`)}
                  onPointerDown={() => prefetch(`/artworks/${selectedModalArtwork.slug}`)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold via-amber-400 to-amber-500 text-obsidian font-bold text-xs sm:text-sm shadow-gold-glow hover:shadow-gold-glow-lg active:scale-95 transition-all cursor-pointer"
                >
                  {navigatingHref === `/artworks/${selectedModalArtwork.slug}` ? (
                    <>
                      <Loader2 className="w-4 h-4 text-obsidian animate-spin" />
                      <span>{locale === 'ckb' ? 'دەکرێتەوە...' : 'Opening...'}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {locale === 'ckb' ? 'لاپەڕەی تەواوی شاکارەکە' : locale === 'ar' ? 'عرض الصفحة الكاملة للعمل' : 'View Masterwork Page'}
                      </span>
                      <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedModalArtwork(null)}
                  className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                >
                  {locale === 'ckb' ? 'داخستن' : locale === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Landscape Orientation Recommendation Prompt for Mobile Viewports ── */}
      <LandscapeOrientationPrompt
        locale={locale}
        isDismissed={isLandscapePromptDismissed}
        onDismiss={() => setIsLandscapePromptDismissed(true)}
      />

      {/* ── Modern Mobile-Game Style Dual Virtual Joysticks (Subtle & Faint) ── */}
      {isTouchDevice && (isLandscape || isLandscapePromptDismissed) && (
        <DualVirtualJoysticks
          onMoveChange={handleJoystickMove}
          onLookChange={handleJoystickLook}
          locale={locale}
        />
      )}
    </div>
  );
}
