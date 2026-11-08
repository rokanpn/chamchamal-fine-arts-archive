'use client';

import React, { useRef, useMemo, useState, useEffect, Suspense, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Artwork, getArtworkDepartment } from '@/data/artworks';
import { useResolvedMediaUrl } from '@/hooks/useResolvedMediaUrl';
import { withCacheBust } from '@/lib/cacheBust';

// Configure Google Draco wasm decoder CDN for compressed 3D models
if (typeof window !== 'undefined') {
  try {
    useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  } catch (_) {}
}

// --- Error Boundary for GLTF Models ---
class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('[SculptureScene] Model failed to load, falling back to bronze sculpture placeholder:', error);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// --- Wireframe Fallback Box ---
function FallbackBox({ position }: { position?: [number, number, number] }) {
  return (
    <mesh position={position ?? [0, 0.45, 0]}>
      <boxGeometry args={[0.55, 0.55, 0.55]} />
      <meshStandardMaterial color="#4a3e2a" roughness={0.6} metalness={0.4} wireframe />
    </mesh>
  );
}

// --- Ultra-Crisp 4K Procedural Official Kurdistan Flag Texture ---
function createKurdistanFlagTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  // High-fidelity 4K canvas (3:2 ratio matching 3.0m x 2.0m geometry)
  canvas.width = 4096;
  canvas.height = 2730;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const h = canvas.height;
  const w = canvas.width;
  const stripeH = h / 3;

  // 1. Top Red: Official Hex #ED2024
  ctx.fillStyle = '#ED2024';
  ctx.fillRect(0, 0, w, stripeH);

  // 2. Middle White: Official Hex #FFFFFF
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, stripeH, w, stripeH);

  // 3. Bottom Green: Official Hex #278E43
  ctx.fillStyle = '#278E43';
  ctx.fillRect(0, stripeH * 2, w, stripeH);

  // 4. Center Radiant 21-Ray Golden Sun: Official Hex #FECC00 (Rojî Kurdistanê)
  const cx = w / 2;
  const cy = h / 2;
  const sunRadius = 220;
  const rayOuter = 460;
  const rayInner = 215;
  const totalRays = 21;

  ctx.fillStyle = '#FECC00';

  // Draw 21 radiant triangular sun rays mathematically centered
  for (let i = 0; i < totalRays; i++) {
    // Top ray points exactly vertical (-90 degrees)
    const angle = (i * 2 * Math.PI) / totalRays - Math.PI / 2;
    const angleLeft = angle - (Math.PI / totalRays) * 0.95;
    const angleRight = angle + (Math.PI / totalRays) * 0.95;

    const tipX = cx + Math.cos(angle) * rayOuter;
    const tipY = cy + Math.sin(angle) * rayOuter;

    const baseLX = cx + Math.cos(angleLeft) * rayInner;
    const baseLY = cy + Math.sin(angleLeft) * rayInner;

    const baseRX = cx + Math.cos(angleRight) * rayInner;
    const baseRY = cy + Math.sin(angleRight) * rayInner;

    ctx.beginPath();
    ctx.moveTo(baseLX, baseLY);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(baseRX, baseRY);
    ctx.closePath();
    ctx.fill();
  }

  // Draw central circular sun disc
  ctx.beginPath();
  ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

// --- VIP Centerpiece: Waving Kurdistan Flag + VIP Stanchions & Velvet Ropes ---
function VIPFlagCenterpiece() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const tex = createKurdistanFlagTexture();
    setTexture(tex);
    return () => {
      tex.dispose();
    };
  }, []);

  // Shared custom uniform object for GPU animation
  const customUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  // PBR MeshStandardMaterial modified via onBeforeCompile for realistic daylight cloth physics
  const clothMaterial = useMemo(() => {
    if (!texture) return null;

    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.65,
      metalness: 0.1,
    });

    mat.customProgramCacheKey = () => 'kurdistan_flag_gentle_breeze_v2';

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.uTime;

      // Inject uniform at top of vertex shader
      shader.vertexShader = `uniform float uTime;\n` + shader.vertexShader;

      // 1. Organic gentle breeze displacement in begin_vertex
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        
        // Pin firmly to the flagpole at left edge (uv.x = 0.0)
        // Amplitude grows smoothly toward the fly end (uv.x = 1.0)
        float pinWeight = smoothstep(0.0, 0.95, uv.x);
        
        // Multi-harmonic gentle breeze cloth physics:
        // Wave 1: Primary diagonal wind billow (organic angled fold line)
        float wave1 = sin(uv.x * 4.2 - uTime * 2.2 + uv.y * 1.6) * 0.16;
        
        // Wave 2: Secondary soft traveling ripple
        float wave2 = cos(uv.x * 7.5 - uTime * 3.4 + uv.y * 2.8) * 0.05;
        
        // Wave 3: Delicate high-frequency edge flutter (strongest at trailing tip)
        float wave3 = sin(uv.x * 12.0 - uTime * 5.0 + uv.y * 4.5) * 0.025 * pow(uv.x, 1.8);
        
        // Wave 4: Subtle vertical breathing swell / drape
        float wave4 = sin(uv.x * 2.8 - uTime * 1.4) * 0.035;
        
        // Apply organic wave displacements
        transformed.z += (wave1 + wave2 + wave3) * pinWeight;
        transformed.y += (wave4 * (1.0 - uv.y * 0.5)) * pinWeight;
        `
      );

      // 2. Dynamic normal perturbation so rotunda daylight shines along the curving cloth folds
      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
        #include <beginnormal_vertex>
        
        float pinWeightNorm = smoothstep(0.0, 0.95, uv.x);
        float dWz = (cos(uv.x * 4.2 - uTime * 2.2 + uv.y * 1.6) * 4.2 * 0.16 +
                     -sin(uv.x * 7.5 - uTime * 3.4 + uv.y * 2.8) * 7.5 * 0.05) * pinWeightNorm;
        objectNormal = normalize(vec3(-dWz * 0.6, 0.0, 1.0));
        `
      );
    };

    return mat;
  }, [texture, customUniforms]);

  // Clean up material on unmount
  useEffect(() => {
    return () => {
      clothMaterial?.dispose();
    };
  }, [clothMaterial]);

  // Update wind simulation time on each animation frame
  useFrame(({ clock }) => {
    if (customUniforms) {
      customUniforms.uTime.value = clock.getElapsedTime();
    }
  });

  // VIP Barrier Geometry Constants
  const BARRIER_RADIUS = 2.5;
  const STANCHION_COUNT = 10;
  const STANCHION_HEIGHT = 0.96;
  const ROPE_COLLAR_Y = 0.88;

  // Stanchion Positions
  const stanchionPositions = useMemo(() => {
    const list: THREE.Vector3[] = [];
    for (let i = 0; i < STANCHION_COUNT; i++) {
      const angle = (i / STANCHION_COUNT) * Math.PI * 2;
      list.push(
        new THREE.Vector3(
          Math.sin(angle) * BARRIER_RADIUS,
          ROPE_COLLAR_Y,
          Math.cos(angle) * BARRIER_RADIUS
        )
      );
    }
    return list;
  }, [BARRIER_RADIUS, STANCHION_COUNT, ROPE_COLLAR_Y]);

  // Drooping Red Velvet Rope Tube Geometries between consecutive stanchions
  const ropeCurves = useMemo(() => {
    const curves: THREE.CatmullRomCurve3[] = [];
    for (let i = 0; i < STANCHION_COUNT; i++) {
      const p1 = stanchionPositions[i];
      const p2 = stanchionPositions[(i + 1) % STANCHION_COUNT];

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y -= 0.19; // Natural gravitational droop

      curves.push(new THREE.CatmullRomCurve3([p1, mid, p2]));
    }
    return curves;
  }, [stanchionPositions, STANCHION_COUNT]);

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. The Central Flagpole & Waving Kurdistan Flag ── */}
      <group position={[0, 0, 0]}>
        {/* Stepped Classical Flagpole Plinth Base */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.38, 0.46, 0.16, 24]} />
          <meshStandardMaterial color="#f4efe6" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.26, 0.32, 0.08, 24]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Golden Flagpole Mast (Positioned exactly at left edge of the 3.0m flag: x = -1.5) */}
        <mesh position={[-1.5, 2.35, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 4.7, 16]} />
          <meshStandardMaterial color="#8C7326" roughness={0.25} metalness={0.88} />
        </mesh>

        {/* Top Golden Crown Finial Sphere */}
        <mesh position={[-1.5, 4.72, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.18} metalness={0.95} />
        </mesh>

        {/* Waving Flag: High-Density 128x128 Geometry for Ultra-Smooth Gentle Breeze Folds (Raycast Disabled for High Performance) */}
        <mesh position={[0, 3.25, 0]} castShadow receiveShadow raycast={() => null}>
          <planeGeometry args={[3.0, 2.0, 128, 128]} />
          {clothMaterial ? (
            <primitive object={clothMaterial} attach="material" />
          ) : (
            <meshStandardMaterial
              color="#ED2024"
              roughness={0.65}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
          )}
        </mesh>

        {/* Dedicated Warm Chandelier Spotlight shining down on the Flag */}
        <pointLight position={[0, 5.2, 0]} intensity={32} distance={9} decay={2} color="#fff6e0" />
      </group>

      {/* ── 2. VIP Barrier: Golden Stanchions ── */}
      {stanchionPositions.map((pos, idx) => (
        <group key={`stanchion-${idx}`} position={[pos.x, 0, pos.z]}>
          {/* Heavy Brass Base Plinth */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.16, 0.19, 0.04, 20]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.11, 0.15, 0.03, 20]} />
            <meshStandardMaterial color="#8C7326" roughness={0.25} metalness={0.85} />
          </mesh>

          {/* Slender Golden Post */}
          <mesh position={[0, STANCHION_HEIGHT / 2, 0]}>
            <cylinderGeometry args={[0.018, 0.02, STANCHION_HEIGHT, 16]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.92} />
          </mesh>

          {/* Rope Attachment Collar */}
          <mesh position={[0, ROPE_COLLAR_Y, 0]}>
            <cylinderGeometry args={[0.032, 0.032, 0.04, 16]} />
            <meshStandardMaterial color="#8C7326" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Spherical Crown Finial */}
          <mesh position={[0, STANCHION_HEIGHT + 0.045, 0]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.18} metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* ── 3. Drooping Red Velvet Ropes ── */}
      {ropeCurves.map((curve, idx) => (
        <mesh key={`rope-${idx}`} castShadow receiveShadow raycast={() => null}>
          <tubeGeometry args={[curve, 24, 0.022, 10, false]} />
          <meshStandardMaterial
            color="#8A0303" // Deep Crimson Red Velvet
            roughness={0.88}
            metalness={0.06}
          />
        </mesh>
      ))}

      {/* Velvet Rope Gold Hook Clasps at ends */}
      {stanchionPositions.map((pos, idx) => (
        <group key={`clasp-${idx}`} position={[pos.x, pos.y, pos.z]}>
          <mesh>
            <torusGeometry args={[0.028, 0.007, 8, 16]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// --- Classical White Marble Pedestal (for hasPedestal === true) ---
function WhiteMarblePedestal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Top Carrara Marble Slab */}
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.96, 0.07, 0.96]} />
        <meshStandardMaterial color="#faf7f0" roughness={0.22} metalness={0.08} />
      </mesh>
      {/* Golden Fillet Trim under Top Slab */}
      <mesh position={[0, 0.435, 0]}>
        <boxGeometry args={[0.92, 0.02, 0.92]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.85} />
      </mesh>
      {/* Main Fluted Shaft */}
      <mesh position={[0, 0.0, 0]}>
        <cylinderGeometry args={[0.34, 0.38, 0.84, 20]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.3} metalness={0.06} />
      </mesh>
      {/* Golden Astragal Ring */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.365, 0.016, 8, 24]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>
      {/* Base Plinth */}
      <mesh position={[0, -0.46, 0]}>
        <boxGeometry args={[0.92, 0.08, 0.92]} />
        <meshStandardMaterial color="#faf7f0" roughness={0.25} metalness={0.08} />
      </mesh>
    </group>
  );
}

// --- Classical Bronze Fallback Geometry (Used for distant LOD & loading states) ---
function SculpturePlaceholderShape({
  artwork,
  scaleMultiplier = 1.0,
  isDistant = false,
}: {
  artwork: Artwork;
  scaleMultiplier?: number;
  isDistant?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const shapeIndex = (artwork.id ? artwork.id.charCodeAt(0) : 0) % 4;

  useFrame(({ clock }) => {
    // Only animate rotation if close; distant placeholders stay static to save CPU
    if (ref.current && !isDistant) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.4;
      ref.current.position.y = 0.45 * scaleMultiplier + Math.sin(clock.getElapsedTime() * 1.1) * 0.02;
    }
  });

  return (
    <mesh
      ref={ref}
      position={[0, 0.45 * scaleMultiplier, 0]}
      scale={[scaleMultiplier, scaleMultiplier, scaleMultiplier]}
      castShadow={!isDistant}
      raycast={() => null}
    >
      {shapeIndex === 0 && <octahedronGeometry args={[0.42, 0]} />}
      {shapeIndex === 1 && <dodecahedronGeometry args={[0.36, 0]} />}
      {shapeIndex === 2 && <icosahedronGeometry args={[0.38, 0]} />}
      {shapeIndex === 3 && <torusKnotGeometry args={[0.26, 0.09, 32, 10]} />}
      <meshStandardMaterial
        color="#B87333"
        roughness={0.3}
        metalness={0.82}
        emissive="#3d2000"
        emissiveIntensity={isDistant ? 0.08 : 0.2}
      />
    </mesh>
  );
}

// --- Auto-Scaled GLB Model Loader with IndexedDB Support & Draco Decompression ---
function AutoScaledGLBModel({
  url,
  scaleMultiplier = 1.0,
  castShadow = true,
}: {
  url: string;
  scaleMultiplier?: number;
  castShadow?: boolean;
}) {
  const { resolvedUrl, isLoading, error } = useResolvedMediaUrl(url);

  if (isLoading || !resolvedUrl || error) {
    return <SculpturePlaceholderShape artwork={{ id: url } as any} scaleMultiplier={scaleMultiplier} />;
  }

  return <ActualGLBModel url={resolvedUrl} scaleMultiplier={scaleMultiplier} castShadow={castShadow} />;
}

function ActualGLBModel({
  url,
  scaleMultiplier = 1.0,
  castShadow = true,
}: {
  url: string;
  scaleMultiplier?: number;
  castShadow?: boolean;
}) {
  // Pass true for Draco decompression & meshopt support (with cache-busting version query)
  const bustedUrl = withCacheBust(url);
  const { scene } = useGLTF(bustedUrl, true, true);

  // Compute bounding box, center on X/Z, and align bottom directly to Y = 0
  const { cloned, finalScale } = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const base = maxDim > 0 ? 0.85 / maxDim : 1;
    const computedScale = base * scaleMultiplier;

    // Center horizontally and ensure lowest geometry point is exactly at local y = 0
    clone.position.x = -center.x;
    clone.position.y = -box.min.y;
    clone.position.z = -center.z;

    return {
      cloned: clone,
      finalScale: computedScale,
    };
  }, [scene, scaleMultiplier]);

  // Clean up cloned meshes upon unmount to release GPU resources
  useEffect(() => {
    return () => {
      cloned.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) {
            mesh.geometry.dispose();
          }
        }
      });
    };
  }, [cloned]);

  return (
    <group scale={[finalScale, finalScale, finalScale]}>
      <primitive object={cloned} castShadow={castShadow} receiveShadow raycast={() => null} />
    </group>
  );
}

// --- Single Circular Sculpture Display Item (Smart Pedestal Logic) ---
interface CircularSculptureDisplayProps {
  artwork: Artwork;
  index: number;
  total: number;
  rotundaRadius: number;
  isFocused: boolean;
  locale: 'ckb' | 'ar' | 'en';
  onFocus: (artwork: Artwork, index: number, coords?: { x: number; y: number; z: number }) => void;
  onOpenModal: (artwork: Artwork) => void;
}

function CircularSculptureDisplay({
  artwork,
  index,
  total,
  rotundaRadius,
  isFocused,
  locale,
  onFocus,
  onOpenModal,
}: CircularSculptureDisplayProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Position along the circular ring facing inward toward origin (0, 0, 0)
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const x = Math.sin(angle) * rotundaRadius;
  const z = Math.cos(angle) * rotundaRadius;
  const rotY = angle + Math.PI; // Face the central VIP Kurdistan Flag

  const hasPedestal = artwork.hasPedestal !== false;
  const modelScale = typeof artwork.modelScale === 'number' && artwork.modelScale > 0 ? artwork.modelScale : 1.0;

  // ── Distance-Based LOD & Resource Management ──
  // In a rotunda with 100+ sculptures, only mount the heavy 3D GLB model and allocate GPU buffers
  // when the camera is within 18 meters (or if focused). Distant models render a lightweight bronze placeholder.
  const [isClose, setIsClose] = useState(isFocused);
  const frameCounter = useRef(Math.floor(Math.random() * 10)); // Stagger checks across frames

  useFrame(({ camera }, delta) => {
    // 1. Throttle distance check: every 10 frames (~160ms) to avoid CPU bottleneck with 100+ items
    frameCounter.current++;
    if (frameCounter.current % 10 === 0 || isFocused) {
      const dx = camera.position.x - x;
      const dz = camera.position.z - z;
      const distSq = dx * dx + dz * dz;

      // Hysteresis: mount when within 18m, unmount when beyond 24m (unless focused)
      const LOAD_DIST_SQ = 18 * 18; // 324
      const UNLOAD_DIST_SQ = 24 * 24; // 576

      if (!isClose && (distSq < LOAD_DIST_SQ || isFocused)) {
        setIsClose(true);
      } else if (isClose && distSq > UNLOAD_DIST_SQ && !isFocused) {
        setIsClose(false);
      }
    }

    // 2. Interactive visual feedback
    if (meshRef.current) {
      const targetScale = hovered || isFocused ? 1.03 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }
    if (lightRef.current) {
      const targetIntensity = hovered || isFocused ? 26 : 14;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, delta * 6);
    }
  });

  const isModelActive = isClose || isFocused;

  const plaqueText = useMemo(() => {
    const title = artwork.title[locale] || artwork.title.ckb;
    const artist = artwork.artist[locale] || artwork.artist.ckb;
    return `${title} • ${artist} • ${artwork.year}`;
  }, [artwork, locale]);

  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* Overhead Warm Focused Gallery Luminaire (Only active when nearby to respect WebGL max light limits) */}
      {(isModelActive || hovered) && (
        <pointLight
          ref={lightRef}
          position={[0, 3.4, 0.4]}
          intensity={hovered || isFocused ? 34 : 20}
          distance={6.2}
          decay={2}
          color={hovered || isFocused ? '#fff7e0' : '#fff5d8'}
        />
      )}

      {/* Visual Assembly */}
      <group ref={meshRef}>
        {/* Generous Clickable Hit Target (ONLY interactive raycast recipient) */}
        <mesh
          position={[0, hasPedestal ? 1.04 + 0.6 * modelScale : 0.6 * modelScale, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={(e) => {
            e.stopPropagation();
            const targetY = hasPedestal ? 1.04 + 0.45 * modelScale : Math.max(0.6, 0.45 * modelScale);
            onFocus(artwork, index, { x, y: targetY, z });
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onOpenModal(artwork);
          }}
        >
          <cylinderGeometry
            args={[
              0.7 * Math.max(1, modelScale * 0.7),
              0.7 * Math.max(1, modelScale * 0.7),
              Math.max(1.6, (hasPedestal ? 1.4 : 1.2) * modelScale),
              16,
            ]}
          />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* ── CONDITIONAL PEDESTAL SYSTEM ── */}
        {hasPedestal ? (
          <>
            {/* 1. Raised Classical White Marble Pedestal */}
            <WhiteMarblePedestal position={[0, 0.52, 0]} />

            {/* Model sitting gracefully atop the pedestal */}
            <group position={[0, 1.04, 0]}>
              {artwork.modelUrl && isModelActive ? (
                <ModelErrorBoundary fallback={<SculpturePlaceholderShape artwork={artwork} scaleMultiplier={modelScale} />}>
                  <Suspense fallback={<SculpturePlaceholderShape artwork={artwork} scaleMultiplier={modelScale} />}>
                    <AutoScaledGLBModel url={artwork.modelUrl} scaleMultiplier={modelScale} castShadow={isModelActive} />
                  </Suspense>
                </ModelErrorBoundary>
              ) : (
                <SculpturePlaceholderShape artwork={artwork} scaleMultiplier={modelScale} isDistant={!isModelActive} />
              )}
            </group>

            {/* Brass Exhibition Plaque on Front Face of Pedestal */}
            <group position={[0, 0.48, 0.51]}>
              <mesh position={[0, 0, 0]} raycast={() => null}>
                <boxGeometry args={[0.82, 0.22, 0.015]} />
                <meshStandardMaterial color="#8C7326" metalness={0.9} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0, 0.01]} raycast={() => null}>
                <boxGeometry args={[0.78, 0.18, 0.012]} />
                <meshStandardMaterial
                  color={hovered || isFocused ? '#F5D77F' : '#D4AF37'}
                  emissive={hovered || isFocused ? '#D4AF37' : '#B8860B'}
                  emissiveIntensity={hovered || isFocused ? 0.35 : 0.15}
                  metalness={0.8}
                  roughness={0.25}
                />
              </mesh>
              <Text
                position={[0, 0, 0.02]}
                fontSize={0.052}
                color="#0A0A0C"
                anchorX="center"
                anchorY="middle"
                maxWidth={0.74}
                textAlign="center"
                raycast={() => null}
              >
                {plaqueText}
              </Text>
            </group>
          </>
        ) : (
          <>
            {/* 2. Direct Floor-Standing Massive Sculpture (NO Pedestal) */}
            <group position={[0, 0.0, 0]}>
              {artwork.modelUrl && isModelActive ? (
                <ModelErrorBoundary fallback={<SculpturePlaceholderShape artwork={artwork} scaleMultiplier={modelScale} />}>
                  <Suspense fallback={<SculpturePlaceholderShape artwork={artwork} scaleMultiplier={modelScale} />}>
                    <AutoScaledGLBModel url={artwork.modelUrl} scaleMultiplier={modelScale} castShadow={isModelActive} />
                  </Suspense>
                </ModelErrorBoundary>
              ) : (
                <SculpturePlaceholderShape artwork={artwork} scaleMultiplier={modelScale} isDistant={!isModelActive} />
              )}
            </group>

            {/* Classical Angled Floor Stanchion Plaque */}
            <group position={[0, 0.02, 0.65]} rotation={[-Math.PI / 6, 0, 0]}>
              <mesh position={[0, 0.12, 0]} raycast={() => null}>
                <boxGeometry args={[0.82, 0.22, 0.02]} />
                <meshStandardMaterial color="#f0ece1" roughness={0.3} metalness={0.1} />
              </mesh>
              <mesh position={[0, 0.12, 0.012]} raycast={() => null}>
                <boxGeometry args={[0.78, 0.18, 0.01]} />
                <meshStandardMaterial
                  color={hovered || isFocused ? '#F5D77F' : '#D4AF37'}
                  emissive={hovered || isFocused ? '#D4AF37' : '#B8860B'}
                  emissiveIntensity={hovered || isFocused ? 0.3 : 0.15}
                  metalness={0.8}
                  roughness={0.25}
                />
              </mesh>
              <Text
                position={[0, 0.12, 0.022]}
                fontSize={0.05}
                color="#0A0A0C"
                anchorX="center"
                anchorY="middle"
                maxWidth={0.74}
                textAlign="center"
                raycast={() => null}
              >
                {plaqueText}
              </Text>
            </group>
          </>
        )}
      </group>
    </group>
  );
}

// --- Classical Roman Corinthian Marble Column ---
function RomanRotundaColumn({ angle, radius }: { angle: number; radius: number }) {
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  return (
    <group position={[x, 0, z]}>
      {/* Plinth Base */}
      <mesh position={[0, 0.1, 0]} raycast={() => null}>
        <boxGeometry args={[0.42, 0.2, 0.42]} />
        <meshStandardMaterial color="#f0ece1" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Fluted Column Shaft */}
      <mesh position={[0, 2.7, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.13, 0.155, 5.0, 18]} />
        <meshStandardMaterial color="#faf7f0" roughness={0.28} metalness={0.06} />
      </mesh>
      {/* Golden Astragal Ring */}
      <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[0.165, 0.016, 8, 24]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>
      {/* Tuscan/Corinthian Capital */}
      <mesh position={[0, 5.25, 0]} raycast={() => null}>
        <boxGeometry args={[0.44, 0.22, 0.44]} />
        <meshStandardMaterial color="#f0ece1" roughness={0.35} metalness={0.1} />
      </mesh>
    </group>
  );
}

// --- Grand Roman Circular Rotunda Architecture ---
function RotundaArchitecture({ radius }: { radius: number }) {
  const WALL_RADIUS = radius + 2.2;
  const ROOM_HEIGHT = 5.6;

  // 18 Classical Columns around the perimeter
  const COLUMN_COUNT = 18;
  const columnAngles = useMemo(() => {
    return Array.from({ length: COLUMN_COUNT }, (_, i) => (i / COLUMN_COUNT) * Math.PI * 2);
  }, [COLUMN_COUNT]);

  return (
    <group>
      {/* 1. Polished White Carrara Marble Floor */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow raycast={() => null}>
        <circleGeometry args={[WALL_RADIUS + 1.5, 64]} />
        <meshStandardMaterial color="#f7f4ee" roughness={0.18} metalness={0.08} />
      </mesh>

      {/* Concentric Gold Inlay Rings on Floor */}
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[2.55, 2.58, 48]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[radius * 0.72, radius * 0.726, 64]} />
        <meshBasicMaterial color="#C5A059" />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[radius + 0.8, radius + 0.81, 64]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>

      {/* 2. Classical Travertine Cream Marble Walls */}
      <mesh position={[0, ROOM_HEIGHT / 2, 0]} raycast={() => null}>
        <cylinderGeometry args={[WALL_RADIUS, WALL_RADIUS, ROOM_HEIGHT, 64, 1, true]} />
        <meshStandardMaterial color="#eae5da" roughness={0.65} metalness={0.05} side={THREE.BackSide} />
      </mesh>

      {/* Baseboards and Crown Rails */}
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[WALL_RADIUS - 0.02, 0.12, 6, 64]} />
        <meshStandardMaterial color="#ded7c8" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, ROOM_HEIGHT - 0.08, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[WALL_RADIUS - 0.02, 0.1, 6, 64]} />
        <meshStandardMaterial color="#ded7c8" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, ROOM_HEIGHT - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[WALL_RADIUS - 0.015, 0.025, 6, 64]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>

      {/* 3. Grand Roman Pantheon Ceiling with Central Open Oculus */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[1.4, WALL_RADIUS, 64]} />
        <meshStandardMaterial color="#f2eee6" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Oculus Golden Ring Trim */}
      <mesh position={[0, ROOM_HEIGHT - 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[1.4, 0.045, 8, 48]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Luminous Sky Oculus Disc */}
      <mesh position={[0, ROOM_HEIGHT + 0.04, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <circleGeometry args={[1.4, 48]} />
        <meshBasicMaterial color="#fffbee" />
      </mesh>

      {/* Direct Daylight Pouring Down from the Oculus */}
      <directionalLight position={[0, ROOM_HEIGHT + 3, 0]} intensity={2.2} color="#fff6ea" />

      {/* Classical Roman Columns framing the rotunda perimeter */}
      {columnAngles.map((ang, i) => (
        <RomanRotundaColumn key={`col-${i}`} angle={ang} radius={WALL_RADIUS - 0.35} />
      ))}
    </group>
  );
}

// --- Floating 3D Title Plaque ---
function FloatingRotundaTitle({ radius }: { radius: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 4.2 + Math.sin(clock.getElapsedTime() * 0.5) * 0.03;
    }
  });

  return (
    <group ref={ref} position={[0, 4.2, -radius * 0.5]}>
      {/* Classical Roman Marble Cartouche Base */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[5.2, 0.8]} />
        <meshStandardMaterial
          color="#f6f2e9"
          roughness={0.25}
          metalness={0.08}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[5.1, 0.72]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.3} />
      </mesh>

      {/* Kurdish Title */}
      <Text
        position={[0, 0.16, 0.01]}
        fontSize={0.21}
        color="#4A3B12"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={5.0}
      >
        ئەمانە بەرهەمی پەیمانگەی هونەرە جوانەکانی چەمچەماڵە
      </Text>

      {/* Kurdish & English Subtitle */}
      <Text
        position={[0, -0.14, 0.01]}
        fontSize={0.11}
        color="#7A6832"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        هۆڵی ڕۆتۆندای پەیکەرسازی • SCULPTURE & 3D ROTUNDA
      </Text>
    </group>
  );
}

// --- Dynamic Circular Camera Rig for Rotunda Exploration ---
interface CircularCameraRigProps {
  rotundaRadius: number;
  moveDirection: number;
  targetYaw: number;
  targetPitch: number;
  focusedArtworkIndex: number | null;
  sculptures: Artwork[];
  onUpdateActiveIndex: (index: number) => void;
  moveVector?: { x: number; y: number };
}

function CircularCameraRig({
  rotundaRadius,
  moveDirection,
  targetYaw,
  targetPitch,
  focusedArtworkIndex,
  sculptures,
  onUpdateActiveIndex,
  moveVector,
}: CircularCameraRigProps) {
  const currentYaw = useRef(0);
  const currentPitch = useRef(0);
  const currentPos = useRef(new THREE.Vector3(0, 1.65, rotundaRadius * 0.65));

  const BARRIER_RADIUS = 2.4;

  useFrame((state, delta) => {
    const safeDelta = Number.isFinite(delta) && delta > 0 ? Math.min(delta, 0.1) : 0.016;

    // 1. Rotation handling
    if (!Number.isFinite(currentYaw.current)) currentYaw.current = 0;
    if (!Number.isFinite(currentPitch.current)) currentPitch.current = 0;

    let targetRotYaw = targetYaw;
    let targetRotPitch = targetPitch;

    // If focused on a specific sculpture, calculate precise camera angle and position facing the artwork
    if (focusedArtworkIndex !== null && sculptures[focusedArtworkIndex]) {
      const targetArt = sculptures[focusedArtworkIndex];
      const hasPedestal = targetArt.hasPedestal !== false;
      const targetScale = typeof targetArt.modelScale === 'number' && targetArt.modelScale > 0 ? targetArt.modelScale : 1.0;

      // Sculpture radial position & center height
      const angle = (focusedArtworkIndex / sculptures.length) * Math.PI * 2 - Math.PI / 2;
      const targetArtX = Math.sin(angle) * rotundaRadius;
      const targetArtZ = Math.cos(angle) * rotundaRadius;
      const targetArtY = hasPedestal ? 1.04 + 0.45 * targetScale : Math.max(0.6, 0.45 * targetScale);

      // Safe optimal camera position: inside the rotunda facing outward toward perimeter
      const camDist = 2.4 + (targetScale > 1 ? Math.min(2.5, (targetScale - 1) * 0.7) : 0);
      const camTargetX = Math.sin(angle) * (rotundaRadius - camDist);
      const camTargetZ = Math.cos(angle) * (rotundaRadius - camDist);
      const camTargetY = hasPedestal ? 1.65 : Math.max(1.35, 1.2 + 0.25 * targetScale);

      currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, camTargetX, 5.0, safeDelta);
      currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, camTargetY, 5.0, safeDelta);
      currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, camTargetZ, 5.0, safeDelta);

      // Camera looks outward toward perimeter directly framing the sculpture center
      targetRotYaw = angle + Math.PI;
      targetRotPitch = Math.atan2(targetArtY - camTargetY, camDist);
    } else {
      // Return camera height to standing eye-level when un-focused
      currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, 1.65, 4.0, safeDelta);

      // 2. Free walk along the camera's gaze direction when holding forward/backward or using dual joysticks
      const effectiveMoveY = moveVector && moveVector.y !== 0
        ? moveVector.y
        : (moveDirection !== 0 ? -moveDirection : 0);
      const effectiveMoveX = moveVector?.x ?? 0;

      if (effectiveMoveY !== 0 || effectiveMoveX !== 0) {
        const WALKING_SPEED = 7.5;
        const forwardStep = effectiveMoveY * WALKING_SPEED * safeDelta;
        const strafeStep = effectiveMoveX * WALKING_SPEED * safeDelta;

        const forwardDirX = -Math.sin(currentYaw.current);
        const forwardDirZ = -Math.cos(currentYaw.current);

        const strafeDirX = Math.cos(currentYaw.current);
        const strafeDirZ = -Math.sin(currentYaw.current);

        const nextX = currentPos.current.x + forwardDirX * forwardStep + strafeDirX * strafeStep;
        const nextZ = currentPos.current.z + forwardDirZ * forwardStep + strafeDirZ * strafeStep;

        const nextDist = Math.sqrt(nextX * nextX + nextZ * nextZ);
        const maxDist = rotundaRadius - 0.9;
        const minDist = BARRIER_RADIUS + 0.6; // Cannot walk into the VIP Flag barrier

        if (nextDist <= maxDist && nextDist >= minDist) {
          currentPos.current.x = nextX;
          currentPos.current.z = nextZ;
        }
      }
    }

    // Smooth shortest-path rotation interpolation
    const safeTargetYaw = Number.isFinite(targetRotYaw) ? targetRotYaw : 0;
    const safeTargetPitch = Number.isFinite(targetRotPitch)
      ? THREE.MathUtils.clamp(targetRotPitch, -Math.PI / 4, Math.PI / 4)
      : 0;

    let yawDiff = (safeTargetYaw - currentYaw.current) % (Math.PI * 2);
    if (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
    if (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
    const effectiveYaw = currentYaw.current + yawDiff;

    const damping = focusedArtworkIndex !== null ? 7.0 : 12.0;
    currentYaw.current = THREE.MathUtils.damp(currentYaw.current, effectiveYaw, damping, safeDelta);
    currentPitch.current = THREE.MathUtils.damp(currentPitch.current, safeTargetPitch, damping, safeDelta);

    if (!Number.isFinite(currentYaw.current)) currentYaw.current = 0;
    if (!Number.isFinite(currentPitch.current)) currentPitch.current = 0;

    // Apply to Three.js camera
    state.camera.position.copy(currentPos.current);
    state.camera.rotation.set(currentPitch.current, currentYaw.current, 0, 'YXZ');

    // Update active closest sculpture index for HUD
    if (focusedArtworkIndex === null && sculptures.length > 0) {
      let closestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < sculptures.length; i++) {
        const angle = (i / sculptures.length) * Math.PI * 2 - Math.PI / 2;
        const ax = Math.sin(angle) * rotundaRadius;
        const az = Math.cos(angle) * rotundaRadius;

        const dist = Math.hypot(currentPos.current.x - ax, currentPos.current.z - az);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      }
      onUpdateActiveIndex(closestIdx);
    }
  });

  return null;
}

// --- Main Sculpture Scene Component Export ---
export interface SculptureSceneProps {
  artworks: Artwork[];
  locale: 'ckb' | 'ar' | 'en';
  targetZ: number;
  moveDirection: number;
  targetYaw: number;
  targetPitch: number;
  focusedArtworkIndex?: number | null;
  onUpdateTargetZ: (z: number) => void;
  onUpdateActiveIndex: (index: number) => void;
  onFocusArtwork?: (artwork: Artwork, index: number, coords?: { x: number; y: number; z: number }) => void;
  onOpenModal?: (artwork: Artwork) => void;
  moveVector?: { x: number; y: number };
}

export function SculptureScene({
  artworks,
  locale,
  moveDirection,
  targetYaw,
  targetPitch,
  focusedArtworkIndex = null,
  onUpdateActiveIndex,
  onFocusArtwork,
  onOpenModal,
  moveVector,
}: SculptureSceneProps) {
  // Filter artworks that belong to sculpture department or feature 3D models
  const sculptureArtworks = useMemo(() => {
    if (artworks.length > 0 && artworks.every((a) => a.department === 'sculpture' || getArtworkDepartment(a) === 'sculpture')) {
      return artworks;
    }
    const sculpts = artworks.filter(
      (a) => a.department === 'sculpture' || getArtworkDepartment(a) === 'sculpture' || Boolean(a.has3DModel && a.modelUrl) || a.category === 'sculpture' || a.category === 'ceramics'
    );
    return sculpts.length >= 2 ? sculpts : artworks;
  }, [artworks]);

  // Dynamically calculate rotunda radius based on sculpture count
  const rotundaRadius = useMemo(() => {
    return Math.max(8.0, sculptureArtworks.length * 1.8);
  }, [sculptureArtworks.length]);

  const handleFocus = useCallback(
    (artwork: Artwork, index: number, coords?: { x: number; y: number; z: number }) => {
      if (onFocusArtwork) {
        onFocusArtwork(artwork, index, coords);
      }
    },
    [onFocusArtwork]
  );

  const handleModal = useCallback(
    (artwork: Artwork) => {
      if (onOpenModal) {
        onOpenModal(artwork);
      }
    },
    [onOpenModal]
  );

  return (
    <>
      {/* 1. Bright Classical Roman Travertine & Carrara Marble Atmosphere */}
      <color attach="background" args={['#ece7df']} />
      <fog attach="fog" args={['#ece7df', rotundaRadius * 0.9, rotundaRadius * 2.4]} />

      {/* 2. Soft Studio Lighting Setup (Bright, High-Key, Zero Harsh Shadows) */}
      <ambientLight intensity={1.4} color="#fffcf5" />

      {/* Key Light: Elevated warm daylight studio spotlight */}
      <directionalLight
        position={[rotundaRadius * 0.45, 14, rotundaRadius * 0.35]}
        intensity={2.3}
        color="#fffbf2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={Math.max(50, rotundaRadius * 2.5)}
        shadow-bias={-0.0003}
      />

      {/* Fill Light: Soft cool-white opposing light to eliminate black crevices */}
      <directionalLight
        position={[-rotundaRadius * 0.45, 12, -rotundaRadius * 0.35]}
        intensity={1.35}
        color="#f5f8ff"
      />

      {/* Rim / Silhouette Light: Accentuates sculpture contours & marble columns */}
      <directionalLight
        position={[0, 13, -rotundaRadius * 0.5]}
        intensity={1.1}
        color="#fff9ea"
      />

      {/* Sky & Floor Bounce Light: Warm Carrara marble floor bounce */}
      <hemisphereLight args={['#ffffff', '#e8dfd3', 1.2]} />

      {/* Central Oculus Volumetric Down-Light */}
      <pointLight position={[0, 8, 0]} intensity={45} distance={rotundaRadius * 1.5} decay={2} color="#fff6e2" />

      {/* 2. Free-Look & Circular Rotunda Camera Rig */}
      <CircularCameraRig
        rotundaRadius={rotundaRadius}
        moveDirection={moveDirection}
        targetYaw={targetYaw}
        targetPitch={targetPitch}
        focusedArtworkIndex={focusedArtworkIndex}
        sculptures={sculptureArtworks}
        onUpdateActiveIndex={onUpdateActiveIndex}
        moveVector={moveVector}
      />

      {/* 3. Grand Roman Classical Rotunda Architecture */}
      <RotundaArchitecture radius={rotundaRadius} />

      {/* 4. Floating 3D Title Inscription */}
      <FloatingRotundaTitle radius={rotundaRadius} />

      {/* 5. The VIP Flag Centerpiece at (0, 0, 0) with Stanchions & Velvet Ropes */}
      <VIPFlagCenterpiece />

      {/* 6. Sculptures in a Circular Ring with Smart Conditional Pedestals */}
      {sculptureArtworks.map((art, idx) => (
        <CircularSculptureDisplay
          key={art.id}
          artwork={art}
          index={idx}
          total={sculptureArtworks.length}
          rotundaRadius={rotundaRadius}
          isFocused={focusedArtworkIndex === idx}
          locale={locale}
          onFocus={handleFocus}
          onOpenModal={handleModal}
        />
      ))}
    </>
  );
}
