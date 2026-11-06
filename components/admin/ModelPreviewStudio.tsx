'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useResolvedMediaUrl } from '@/hooks/useResolvedMediaUrl';

// Configure Google Draco wasm decoder CDN for compressed 3D models in admin preview
if (typeof window !== 'undefined') {
  try {
    useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  } catch (_) {}
}
import { 
  Box, 
  Rotate3d, 
  Layers, 
  Maximize2, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Info,
  Check
} from 'lucide-react';

// --- Error Boundary for 3D Studio Canvas ---
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class StudioErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.warn('[ModelPreviewStudio] 3D mesh load failure:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// --- Wireframe Fallback Mesh ---
function FallbackMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.45, 0]}>
      <octahedronGeometry args={[0.45, 0]} />
      <meshStandardMaterial color="#D4AF37" wireframe roughness={0.3} metalness={0.7} />
    </mesh>
  );
}

// --- Classical White Marble Pedestal (Exact 1:1 match with SculptureScene) ---
function StudioPedestal() {
  return (
    <group position={[0, 0.52, 0]}>
      {/* Top Carrara Marble Slab */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[0.96, 0.07, 0.96]} />
        <meshStandardMaterial color="#faf7f0" roughness={0.22} metalness={0.08} />
      </mesh>
      {/* Golden Fillet Trim under Top Slab */}
      <mesh position={[0, 0.435, 0]} raycast={() => null}>
        <boxGeometry args={[0.92, 0.02, 0.92]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.85} />
      </mesh>
      {/* Main Fluted Shaft */}
      <mesh position={[0, 0.0, 0]} castShadow receiveShadow raycast={() => null}>
        <cylinderGeometry args={[0.34, 0.38, 0.84, 24]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.3} metalness={0.06} />
      </mesh>
      {/* Golden Astragal Ring */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[0.365, 0.016, 8, 24]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>
      {/* Base Plinth */}
      <mesh position={[0, -0.46, 0]} receiveShadow raycast={() => null}>
        <boxGeometry args={[0.92, 0.08, 0.92]} />
        <meshStandardMaterial color="#faf7f0" roughness={0.25} metalness={0.08} />
      </mesh>
    </group>
  );
}

// --- Polished Carrara & Travertine White Marble Rotunda Floor (Exact match with SculptureScene) ---
function StudioRotundaFloor() {
  return (
    <group position={[0, 0, 0]}>
      {/* Polished White Carrara Marble Floor Disc */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow raycast={() => null}>
        <circleGeometry args={[3.2, 64]} />
        <meshStandardMaterial color="#f7f4ee" roughness={0.18} metalness={0.08} />
      </mesh>

      {/* Concentric Gold Inlay Rings on Floor */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[0.72, 0.74, 48]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[1.5, 1.52, 48]} />
        <meshBasicMaterial color="#C5A059" />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[2.55, 2.58, 48]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>

      {/* Architectural Scale Ruler Stick at side (X = 1.35) */}
      <group position={[1.35, 0, 0]}>
        {/* Slender golden ruler pole */}
        <mesh position={[0, 1.0, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.012, 0.012, 2.0, 12]} />
          <meshStandardMaterial color="#8C7326" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Metric Height Indicators (0.5m, 1.0m, 1.5m, 2.0m) */}
        {[0.5, 1.0, 1.5, 2.0].map((h) => (
          <mesh key={`marker-${h}`} position={[-0.04, h, 0]} raycast={() => null}>
            <boxGeometry args={[0.08, 0.012, 0.012]} />
            <meshBasicMaterial color="#D4AF37" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// --- Background Classical Roman Corinthian Marble Columns for Atmosphere ---
function StudioBackgroundColumns() {
  const angles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
  const radius = 2.8;

  return (
    <group>
      {angles.map((ang, idx) => {
        const x = Math.sin(ang) * radius;
        const z = Math.cos(ang) * radius;
        return (
          <group key={`col-${idx}`} position={[x, 0, z]}>
            {/* Plinth Base */}
            <mesh position={[0, 0.08, 0]} raycast={() => null}>
              <boxGeometry args={[0.36, 0.16, 0.36]} />
              <meshStandardMaterial color="#f0ece1" roughness={0.35} metalness={0.1} />
            </mesh>
            {/* Fluted Column Shaft */}
            <mesh position={[0, 2.2, 0]} raycast={() => null}>
              <cylinderGeometry args={[0.11, 0.13, 4.2, 16]} />
              <meshStandardMaterial color="#faf7f0" roughness={0.28} metalness={0.06} />
            </mesh>
            {/* Golden Astragal Ring */}
            <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
              <torusGeometry args={[0.135, 0.014, 8, 20]} />
              <meshBasicMaterial color="#D4AF37" />
            </mesh>
            {/* Tuscan Capital */}
            <mesh position={[0, 4.35, 0]} raycast={() => null}>
              <boxGeometry args={[0.38, 0.18, 0.38]} />
              <meshStandardMaterial color="#f0ece1" roughness={0.35} metalness={0.1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// --- Actual GLB Model Loader with Precise Ground Normalization ---
interface StudioGLBModelProps {
  url: string;
  modelScale: number;
  hasPedestal: boolean;
  onDimensionsMeasured?: (dims: { width: number; height: number; depth: number }) => void;
}

function StudioGLBModel({ url, modelScale, hasPedestal, onDimensionsMeasured }: StudioGLBModelProps) {
  // Support standard, Draco-compressed, and Meshopt-compressed models
  const { scene } = useGLTF(url, true, true);

  // Compute normalized baseline scale, center horizontally, and align bottom directly to local y = 0
  const { cloned, finalScale, dims } = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const base = maxDim > 0 ? 0.85 / maxDim : 1;
    const computedScale = base * modelScale;

    // Center horizontally and align lowest vertex exactly to local y = 0
    clone.position.x = -center.x;
    clone.position.y = -box.min.y;
    clone.position.z = -center.z;

    const realW = Math.round(size.x * computedScale * 100);
    const realH = Math.round(size.y * computedScale * 100);
    const realD = Math.round(size.z * computedScale * 100);

    return {
      cloned: clone,
      finalScale: computedScale,
      dims: { width: realW, height: realH, depth: realD },
    };
  }, [scene, modelScale]);

  useEffect(() => {
    if (onDimensionsMeasured && dims) {
      onDimensionsMeasured(dims);
    }
  }, [dims, onDimensionsMeasured]);

  // If on pedestal, base sits at y = 1.04 atop pedestal. If on floor, base sits at y = 0.0
  const containerY = hasPedestal ? 1.04 : 0.0;

  return (
    <group position={[0, containerY, 0]}>
      <group scale={[finalScale, finalScale, finalScale]}>
        <primitive object={cloned} castShadow receiveShadow raycast={() => null} />
      </group>
    </group>
  );
}

export interface ModelPreviewStudioProps {
  modelUrl: string;
  modelFileName?: string;
  hasPedestal: boolean;
  onPedestalChange: (val: boolean) => void;
  modelScale: number;
  onScaleChange: (val: number) => void;
  locale?: 'ckb' | 'ar' | 'en';
}

export function ModelPreviewStudio({
  modelUrl,
  modelFileName,
  hasPedestal,
  onPedestalChange,
  modelScale,
  onScaleChange,
  locale = 'ckb',
}: ModelPreviewStudioProps) {
  const [mounted, setMounted] = useState(false);
  const [measuredDims, setMeasuredDims] = useState<{ width: number; height: number; depth: number } | null>(null);

  // Resolve Blob/idb:// or external URL safely
  const { resolvedUrl, isLoading: isResolvingUrl } = useResolvedMediaUrl(modelUrl);

  useEffect(() => {
    setMounted(true);
  }, []);

  const SCALE_PRESETS = [
    { label: '0.5x', value: 0.5, desc: locale === 'ckb' ? 'بچووک' : 'Mini' },
    { label: '1.0x', value: 1.0, desc: locale === 'ckb' ? 'ستاندارد' : 'Standard' },
    { label: '1.5x', value: 1.5, desc: locale === 'ckb' ? 'گەورە' : 'Large' },
    { label: '2.0x', value: 2.0, desc: locale === 'ckb' ? 'مرۆیی (١.٧م)' : 'Life-Size' },
    { label: '3.0x', value: 3.0, desc: locale === 'ckb' ? 'مۆنۆمێنتال' : 'Monumental' },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-black/50 border border-gold/30 p-4 shadow-glass-card">
      {/* Studio Header: Title & Pedestal Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shadow-gold-glow">
            <Rotate3d className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-parchment-pure flex items-center gap-2">
              <span>{locale === 'ckb' ? 'ستۆدیۆی پێشبینی ۳D و کۆنتڕۆڵی قەبارە' : 'Live 3D Studio & Scale Controller'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-mono">
                {modelScale.toFixed(1)}x
              </span>
            </h4>
            <p className="text-[11px] text-white/50">
              {locale === 'ckb'
                ? 'پێشبینی ڕاستەوخۆی مۆدێل، تاقیکردنەوەی قەبارە لەسەر زەوی یان پایەی مەڕمەڕ'
                : 'Interactive real-time preview to calibrate scale on the floor or classical pedestal'}
            </p>
          </div>
        </div>

        {/* Smart Pedestal Toggle Switch */}
        <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-bold text-parchment-pure">
              {hasPedestal
                ? locale === 'ckb' ? 'پایەی مەڕمەڕ' : 'Marble Pedestal'
                : locale === 'ckb' ? 'ڕاستەوخۆ سەر زەوی' : 'Floor-Standing'}
            </span>
            <span className="text-[9px] text-white/40">
              {hasPedestal
                ? locale === 'ckb' ? 'بەرزکراوە بە پایە' : 'Raised on Plinth'
                : locale === 'ckb' ? 'مۆنۆمێنتی زەوی' : 'Direct Floor'}
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={hasPedestal}
              onChange={(e) => onPedestalChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
          </label>
        </div>
      </div>

      {/* 3D Viewport Box: Exact Sculpture Rotunda Atmosphere Match */}
      <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden bg-[#ece7df] border border-gold/40 shadow-inner">
        {/* Environment Badge */}
        <div className="absolute top-2.5 right-2.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gold/40 text-[10px] text-gold flex items-center gap-1.5 shadow-md pointer-events-none z-10">
          <Sparkles className="w-3 h-3 text-gold animate-pulse" />
          <span className="font-semibold font-serif">
            {locale === 'ckb' ? 'ڕۆتۆندای پەیکەرسازی' : 'Sculpture Rotunda'}
          </span>
        </div>

        {mounted && resolvedUrl ? (
          <StudioErrorBoundary
            fallback={
              <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-2 text-amber-900 bg-[#ece7df]">
                <AlertCircle className="w-8 h-8 text-amber-700" />
                <span className="text-xs font-bold text-amber-900">
                  {locale === 'ckb' ? 'هەڵە لە خوێندنەوەی مۆدێلی ۳D' : 'Unable to parse 3D GLB mesh'}
                </span>
                <span className="text-[10px] text-amber-800/70">
                  {locale === 'ckb' ? 'تکایە دڵنیابە فایلەکە فۆرماتی دروستی .glb یان .gltf هەبێت' : 'Verify standard binary GLTF format'}
                </span>
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center h-full gap-2 text-amber-800 bg-[#ece7df]">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-700" />
                  <span className="text-xs font-mono font-medium">
                    {locale === 'ckb' ? 'بارکردنی مۆدێلی ۳D...' : 'Loading 3D Photogrammetry...'}
                  </span>
                </div>
              }
            >
              <Canvas
                shadows
                camera={{ position: [0, 1.65, 2.8], fov: 42 }}
                gl={{ antialias: true, alpha: false }}
              >
                {/* 1. Bright Classical Roman Travertine & Carrara Marble Atmosphere */}
                <color attach="background" args={['#ece7df']} />
                <fog attach="fog" args={['#ece7df', 3.5, 9.5]} />

                {/* 2. Exact Daylight Illumination matching SculptureScene */}
                <ambientLight intensity={0.95} color="#fff9f2" />
                <directionalLight
                  position={[3.2, 12, 2.4]}
                  intensity={1.8}
                  color="#fffaf0"
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                  shadow-bias={-0.0001}
                />
                <hemisphereLight args={['#ffffff', '#e8dfd5', 0.85]} />

                {/* Overhead Warm Focused Gallery Luminaire (spotlight directly on the artwork) */}
                <pointLight
                  position={[0, 3.4, 0.4]}
                  intensity={14}
                  distance={5.5}
                  decay={2}
                  color="#fff5d8"
                />

                {/* 3. Studio Environment: Polished Marble Floor & Background Columns */}
                <StudioRotundaFloor />
                <StudioBackgroundColumns />

                {/* 4. Raised Classical Marble Pedestal (if enabled) */}
                {hasPedestal && <StudioPedestal />}

                {/* 5. 3D Model with Real-Time Scale Multiplier */}
                <StudioGLBModel
                  url={resolvedUrl}
                  modelScale={modelScale}
                  hasPedestal={hasPedestal}
                  onDimensionsMeasured={setMeasuredDims}
                />

                {/* 6. Realistic Eye-Level OrbitControls matching museum visitor view */}
                <OrbitControls
                  makeDefault
                  target={[0, hasPedestal ? 1.3 : 0.65, 0]}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={0.8}
                  maxDistance={5.5}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI / 2 + 0.02}
                />
              </Canvas>
            </Suspense>
          </StudioErrorBoundary>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3 text-amber-900/60 bg-[#ece7df]">
            <div className="w-12 h-12 rounded-2xl bg-black/5 border border-amber-900/15 flex items-center justify-center text-amber-800">
              <Box className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1 max-w-xs">
              <span className="text-xs font-bold text-amber-950 font-serif">
                {locale === 'ckb' ? 'مۆدێلی ۳D دیاری نەکراوە' : 'No 3D Model Attached'}
              </span>
              <span className="text-[11px] text-amber-900/60">
                {locale === 'ckb'
                  ? 'فایلێکی .glb باربکە یان مۆدێلێکی ئامادەکراو هەڵبژێرە بۆ کاراکردنی ستۆدیۆی ڕاستەوخۆ'
                  : 'Upload a .glb file or choose a preset above to engage the live studio'}
              </span>
            </div>
          </div>
        )}

        {/* Viewport Floating HUD Badge: Real-World Estimated Size */}
        {measuredDims && (
          <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gold/30 text-[10px] text-parchment-pure flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono text-gold font-bold">
              {measuredDims.width} × {measuredDims.height} × {measuredDims.depth} cm
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/60">
              {locale === 'ckb' ? `بەرزایی: ${(measuredDims.height / 100).toFixed(2)} م` : `Height: ${(measuredDims.height / 100).toFixed(2)}m`}
            </span>
          </div>
        )}

        {/* Viewport Controls Hint */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-white/40 border border-white/10 pointer-events-none">
          {locale === 'ckb' ? 'خولانەوە بە چەپکلیک • زووم بە سکڕۆڵ • جووڵە بە ڕاستکلیک' : 'Rotate: Drag • Zoom: Scroll • Pan: Right Click'}
        </div>
      </div>

      {/* Real-Time Scale Multiplier Controls */}
      <div className="flex flex-col gap-2.5 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-parchment-pure flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-gold" />
            <span>{locale === 'ckb' ? 'ڕێژەی گەورەکردنی مۆدێل (Scale Multiplier)' : 'Model Scale Multiplier'}</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-gold px-2.5 py-0.5 rounded-md bg-gold/15 border border-gold/30">
              {modelScale.toFixed(1)}x
            </span>
            {modelScale !== 1.0 && (
              <button
                type="button"
                onClick={() => onScaleChange(1.0)}
                className="text-[10px] text-white/50 hover:text-gold flex items-center gap-1 transition-colors"
                title="Reset to 1.0x"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>{locale === 'ckb' ? 'ڕێکخستنەوە' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Range Slider */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/40">0.1x</span>
          <input
            type="range"
            min="0.1"
            max="10.0"
            step="0.1"
            value={modelScale}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gold hover:opacity-100 transition-opacity"
          />
          <span className="text-[10px] font-mono text-white/40">10.0x</span>
        </div>

        {/* Quick Scale Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          <span className="text-[10px] text-white/40 mr-1">
            {locale === 'ckb' ? 'قەبارە خێراکان:' : 'Presets:'}
          </span>
          {SCALE_PRESETS.map((preset) => {
            const isActive = Math.abs(modelScale - preset.value) < 0.05;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onScaleChange(preset.value)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 border ${
                  isActive
                    ? 'bg-gold text-obsidian font-bold border-gold shadow-gold-glow'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10 hover:text-white'
                }`}
              >
                <span>{preset.label}</span>
                <span className={`text-[9px] ${isActive ? 'text-obsidian/75' : 'text-white/40'}`}>
                  ({preset.desc})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
