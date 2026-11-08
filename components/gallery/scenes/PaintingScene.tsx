'use client';

import React, { useState, useRef, useMemo, Suspense, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Artwork, getArtworkDepartmentLabel } from '@/data/artworks';
import { computeArtwork3DDimensions } from '@/lib/dimensions';
import { InstituteEndWallLogo, GalleryWelcomeSign, GalleryWelcomeOverheadArch } from '@/components/gallery/GalleryBranding';
import { withCacheBust } from '@/lib/cacheBust';

// --- Constants (mirrored from original VirtualTourClient) ---
const CORRIDOR_WIDTH = 6.4;
const CORRIDOR_HEIGHT = 4.2;
const SPACING_INTERVAL = 5.5;
const ENTRY_BUFFER = 5.0;
const EXIT_BUFFER = 8.0;
const WALKING_SPEED = 7.5;

// --- Error Boundary for 3D texture loading ---
class TextureErrorBoundary extends React.Component<
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
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// --- Fallback canvas plane ---
function FrameCanvasPlaceholder({ width, height }: { width: number; height: number }) {
  return (
    <mesh position={[0, 0, 0.05]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color="#222222" />
    </mesh>
  );
}

// --- Safe artwork image (texture loader with 404 fallback) ---
function SafeArtworkImage({ url, width, height }: { url: string; width: number; height: number }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    if (!url) { setLoadFailed(true); return; }
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      withCacheBust(url),
      (t) => {
        if (isCurrent) {
          t.colorSpace = THREE.SRGBColorSpace;
          t.needsUpdate = true;
          setTexture(t);
          setLoadFailed(false);
        }
      },
      undefined,
      () => { if (isCurrent) setLoadFailed(true); }
    );
    return () => { isCurrent = false; };
  }, [url]);

  if (loadFailed || !texture) return <FrameCanvasPlaceholder width={width} height={height} />;

  return (
    <mesh position={[0, 0, 0.05]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// --- Single Artwork Frame (identical to original) ---
interface ArtworkFrameProps {
  artwork: Artwork;
  index: number;
  total: number;
  isFocused: boolean;
  locale: 'ckb' | 'ar' | 'en';
  onFocus: (artwork: Artwork, index: number) => void;
  onOpenModal: (artwork: Artwork) => void;
}

function ArtworkFrame3D({ artwork, index, total, isFocused, locale, onFocus, onOpenModal }: ArtworkFrameProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const isLeft = index % 2 === 0;
  const zPosition = -(ENTRY_BUFFER + index * SPACING_INTERVAL);
  const xPosition = isLeft ? -(CORRIDOR_WIDTH / 2 - 0.08) : (CORRIDOR_WIDTH / 2 - 0.08);
  const rotationY = isLeft ? Math.PI / 2 : -Math.PI / 2;

  const { frameW, frameH, canvasW, canvasH } = useMemo(() => {
    return computeArtwork3DDimensions(artwork);
  }, [artwork]);

  const plaqueText = useMemo(() => {
    const artistName = artwork.artist[locale] || artwork.artist.ckb || artwork.artist.en;
    const deptText = getArtworkDepartmentLabel(artwork.departmentLabel || artwork.department, locale);
    const discipline = artwork.categoryLabel?.[locale] || deptText || artwork.categoryLabel?.ckb || artwork.categoryLabel?.en || 'Painting';
    return `${artistName} • ${discipline} • ${artwork.year}`;
  }, [artwork, locale]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const targetScale = hovered || isFocused ? 1.03 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
    }
    if (lightRef.current) {
      const targetIntensity = hovered || isFocused ? 24 : 14;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, delta * 6);
    }
  });

  return (
    <group position={[xPosition, CORRIDOR_HEIGHT * 0.48, zPosition]} rotation={[0, rotationY, 0]}>
      {/* Gallery luminaire */}
      <group position={[0, frameH / 2 + 0.55, 0.25]}>
        <mesh position={[0, 0, -0.15]}>
          <boxGeometry args={[0.08, 0.08, 0.3]} />
          <meshStandardMaterial color="#22201d" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 5, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.14, 0.22, 16]} />
          <meshStandardMaterial color="#1a1815" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.09, 0.04]} rotation={[Math.PI / 5, 0, 0]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color={hovered || isFocused ? '#ffe89e' : '#ffdca8'} />
        </mesh>
      </group>

      {/* Spotlight */}
      <pointLight
        ref={lightRef}
        position={[0, frameH / 2 + 0.4, 0.6]}
        intensity={hovered || isFocused ? 22 : 16}
        distance={5.5}
        decay={2}
        color={hovered || isFocused ? '#fff7dc' : '#fff3d1'}
      />

      {/* Artwork frame assembly */}
      <group ref={meshRef}>
        {/* Generous Clickable Hit Target (ONLY interactive raycast recipient) */}
        <mesh
          position={[0, -0.1, 0.05]}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
          onClick={(e) => { e.stopPropagation(); onFocus(artwork, index); }}
          onDoubleClick={(e) => { e.stopPropagation(); onOpenModal(artwork); }}
        >
          <boxGeometry args={[frameW + 0.2, frameH + 0.6, 0.25]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Outer frame */}
        <mesh position={[0, 0, 0]} raycast={() => null}>
          <boxGeometry args={[frameW, frameH, 0.08]} />
          <meshStandardMaterial color={hovered || isFocused ? '#1a1814' : '#0f0e0c'} roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Gold fillet */}
        <mesh position={[0, 0, 0.042]} raycast={() => null}>
          <boxGeometry args={[frameW - 0.08, frameH - 0.08, 0.01]} />
          <meshStandardMaterial color={hovered || isFocused ? '#f5d77f' : '#D4AF37'} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Artwork image */}
        <TextureErrorBoundary fallback={<FrameCanvasPlaceholder width={canvasW} height={canvasH} />}>
          <Suspense fallback={<FrameCanvasPlaceholder width={canvasW} height={canvasH} />}>
            <SafeArtworkImage url={artwork.imageUrl} width={canvasW} height={canvasH} />
          </Suspense>
        </TextureErrorBoundary>

        {/* 3D scan badge */}
        {artwork.has3DModel && (
          <group position={[frameW / 2 - 0.35, frameH / 2 - 0.22, 0.06]}>
            <mesh raycast={() => null}>
              <planeGeometry args={[0.48, 0.2]} />
              <meshBasicMaterial color="#0A0A0C" transparent opacity={0.85} />
            </mesh>
            <Text position={[0, 0, 0.01]} fontSize={0.08} color="#D4AF37" anchorX="center" anchorY="middle" raycast={() => null}>
              3D SCAN
            </Text>
          </group>
        )}

        {/* Exhibition plaque */}
        <group position={[0, -frameH / 2 - 0.22, 0.02]}>
          <mesh position={[0, 0, 0.005]} raycast={() => null}>
            <boxGeometry args={[Math.max(1.36, frameW * 0.76), 0.26, 0.015]} />
            <meshStandardMaterial color="#8C7326" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.015]} raycast={() => null}>
            <boxGeometry args={[Math.max(1.32, frameW * 0.76 - 0.04), 0.22, 0.012]} />
            <meshStandardMaterial
              color={hovered || isFocused ? '#F5D77F' : '#D4AF37'}
              emissive={hovered || isFocused ? '#D4AF37' : '#B8860B'}
              emissiveIntensity={hovered || isFocused ? 0.35 : 0.15}
              metalness={0.75}
              roughness={0.25}
            />
          </mesh>
          <Text
            position={[0, 0, 0.025]}
            fontSize={0.072}
            font={locale === 'en' ? undefined : withCacheBust('/fonts/NotoSansArabic-Bold.ttf')}
            direction={locale === 'en' ? 'ltr' : 'rtl'}
            color="#0A0A0C"
            anchorX="center"
            anchorY="middle"
            maxWidth={Math.max(1.24, frameW * 0.72)}
            textAlign="center"
            raycast={() => null}
          >
            {plaqueText}
          </Text>
        </group>
      </group>
    </group>
  );
}

// --- Corridor Environment (identical to original) ---
function CorridorEnvironment({ corridorLength }: { corridorLength: number }) {
  const centerZ = -corridorLength / 2 + 2;
  const beamCount = Math.floor(corridorLength / 6);
  const beamPositions = useMemo(() => {
    const list = [];
    for (let i = 0; i < beamCount; i++) list.push(1 - i * 6);
    return list;
  }, [beamCount]);

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0, centerZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow raycast={() => null}>
        <planeGeometry args={[CORRIDOR_WIDTH, corridorLength]} />
        <meshStandardMaterial color="#0b0b0e" roughness={0.28} metalness={0.15} />
      </mesh>
      {/* Velvet runner */}
      <mesh position={[0, 0.005, centerZ]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[1.8, corridorLength]} />
        <meshStandardMaterial color="#15141c" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[-0.92, 0.007, centerZ]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[0.03, corridorLength]} />
        <meshStandardMaterial color="#8a7226" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0.92, 0.007, centerZ]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[0.03, corridorLength]} />
        <meshStandardMaterial color="#8a7226" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, CORRIDOR_HEIGHT, centerZ]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[CORRIDOR_WIDTH, corridorLength]} />
        <meshStandardMaterial color="#070709" roughness={0.9} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, centerZ]} rotation={[0, Math.PI / 2, 0]} raycast={() => null}>
        <planeGeometry args={[corridorLength, CORRIDOR_HEIGHT]} />
        <meshStandardMaterial color="#121217" roughness={0.88} />
      </mesh>
      {/* Right wall */}
      <mesh position={[CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, centerZ]} rotation={[0, -Math.PI / 2, 0]} raycast={() => null}>
        <planeGeometry args={[corridorLength, CORRIDOR_HEIGHT]} />
        <meshStandardMaterial color="#121217" roughness={0.88} />
      </mesh>
      {/* Baseboards */}
      <mesh position={[-CORRIDOR_WIDTH / 2 + 0.04, 0.12, centerZ]} raycast={() => null}>
        <boxGeometry args={[0.08, 0.24, corridorLength]} />
        <meshStandardMaterial color="#1f1d19" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[CORRIDOR_WIDTH / 2 - 0.04, 0.12, centerZ]} raycast={() => null}>
        <boxGeometry args={[0.08, 0.24, corridorLength]} />
        <meshStandardMaterial color="#1f1d19" roughness={0.4} metalness={0.4} />
      </mesh>
      {/* Crown rails */}
      <mesh position={[-CORRIDOR_WIDTH / 2 + 0.04, CORRIDOR_HEIGHT - 0.08, centerZ]} raycast={() => null}>
        <boxGeometry args={[0.08, 0.16, corridorLength]} />
        <meshStandardMaterial color="#1a1815" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[CORRIDOR_WIDTH / 2 - 0.04, CORRIDOR_HEIGHT - 0.08, centerZ]} raycast={() => null}>
        <boxGeometry args={[0.08, 0.16, corridorLength]} />
        <meshStandardMaterial color="#1a1815" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Ceiling beams + lights */}
      {beamPositions.map((z, idx) => (
        <group key={idx} position={[0, CORRIDOR_HEIGHT - 0.1, z]}>
          <mesh raycast={() => null}>
            <boxGeometry args={[CORRIDOR_WIDTH, 0.2, 0.35]} />
            <meshStandardMaterial color="#16151a" roughness={0.6} />
          </mesh>
          <pointLight position={[0, -0.3, 0]} intensity={4.5} distance={7} decay={2} color="#ffe8b8" />
        </group>
      ))}
      {/* Overhead Entrance Archway (visible looking down corridor) */}
      <GalleryWelcomeOverheadArch />

      {/* Entrance Wall with Monumental Kurdish Welcome Sign */}
      <group position={[0, CORRIDOR_HEIGHT / 2, 2.5]} rotation={[0, Math.PI, 0]}>
        <mesh raycast={() => null}>
          <planeGeometry args={[CORRIDOR_WIDTH, CORRIDOR_HEIGHT]} />
          <meshStandardMaterial color="#0f0f13" roughness={0.8} />
        </mesh>
        <GalleryWelcomeSign />
      </group>

      {/* Rotunda Far End Wall (Official Institute Logo Emblem) */}
      <group position={[0, CORRIDOR_HEIGHT / 2, -corridorLength + 2]}>
        <mesh raycast={() => null}>
          <planeGeometry args={[CORRIDOR_WIDTH, CORRIDOR_HEIGHT]} />
          <meshStandardMaterial color="#0f0f13" roughness={0.8} />
        </mesh>
        <InstituteEndWallLogo />
      </group>
    </group>
  );
}

// --- FPS Free-Look Camera Rig (enhanced with Dual Joystick Strafe & Move) ---
interface FreeLookCameraRigProps {
  targetZ: number;
  moveDirection: number;
  targetYaw: number;
  targetPitch: number;
  maxTravelDistance: number;
  onUpdateTargetZ: (newZ: number) => void;
  onUpdateActiveIndex: (index: number) => void;
  totalArtworks: number;
  isFocused: boolean;
  targetX?: number;
  moveVector?: { x: number; y: number };
  onUpdateTargetX?: (newX: number) => void;
}

function FreeLookCameraRig({
  targetZ, moveDirection, targetYaw, targetPitch,
  maxTravelDistance, onUpdateTargetZ, onUpdateActiveIndex,
  totalArtworks, isFocused,
  targetX = 0, moveVector, onUpdateTargetX,
}: FreeLookCameraRigProps) {
  const currentYaw = useRef(0);
  const currentPitch = useRef(0);

  useFrame((state, delta) => {
    const safeDelta = Number.isFinite(delta) && delta > 0 ? Math.min(delta, 0.1) : 0.016;

    // Translation logic: combines moveVector (dual joystick) and moveDirection (keyboard fallback)
    const effectiveMoveY = moveVector && moveVector.y !== 0
      ? moveVector.y
      : (moveDirection !== 0 ? -moveDirection : 0);
    const effectiveMoveX = moveVector?.x ?? 0;

    if (!isFocused && (effectiveMoveY !== 0 || effectiveMoveX !== 0)) {
      if (effectiveMoveY !== 0) {
        // Pushing forward (+y) walks forward into corridor (-Z)
        const stepZ = -effectiveMoveY * WALKING_SPEED * safeDelta;
        const safeTargetZ = Number.isFinite(targetZ) ? targetZ : 1.8;
        const nextZ = Math.max(-maxTravelDistance, Math.min(1.8, safeTargetZ + stepZ));
        if (nextZ !== targetZ) onUpdateTargetZ(nextZ);
      }
      if (effectiveMoveX !== 0 && onUpdateTargetX) {
        const STRAFE_SPEED = 4.0;
        const stepX = effectiveMoveX * STRAFE_SPEED * safeDelta;
        const safeTargetX = Number.isFinite(targetX) ? targetX : 0;
        const nextX = Math.max(-1.4, Math.min(1.4, safeTargetX + stepX));
        if (nextX !== targetX) onUpdateTargetX(nextX);
      }
    }

    const safeTargetZ = Number.isFinite(targetZ) ? targetZ : 1.8;
    const safeTargetX = Number.isFinite(targetX) ? targetX : 0;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, safeTargetX, 4.0, safeDelta);
    state.camera.position.y = 1.7;
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, safeTargetZ, 4.0, safeDelta);

    if (!Number.isFinite(state.camera.position.x)) state.camera.position.x = 0;
    if (!Number.isFinite(state.camera.position.y)) state.camera.position.y = 1.7;
    if (!Number.isFinite(state.camera.position.z)) state.camera.position.z = 1.8;

    if (!Number.isFinite(currentYaw.current)) currentYaw.current = 0;
    if (!Number.isFinite(currentPitch.current)) currentPitch.current = 0;

    const safeTargetYaw = Number.isFinite(targetYaw) ? targetYaw : 0;
    const safeTargetPitch = Number.isFinite(targetPitch)
      ? THREE.MathUtils.clamp(targetPitch, -Math.PI / 4, Math.PI / 4) : 0;

    let yawDiff = (safeTargetYaw - currentYaw.current) % (Math.PI * 2);
    if (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
    if (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
    const effectiveTargetYaw = currentYaw.current + yawDiff;

    const dampingSpeed = isFocused ? 7.0 : 12.0;
    currentYaw.current = THREE.MathUtils.damp(currentYaw.current, effectiveTargetYaw, dampingSpeed, safeDelta);
    currentPitch.current = THREE.MathUtils.damp(currentPitch.current, safeTargetPitch, dampingSpeed, safeDelta);

    if (!Number.isFinite(currentYaw.current)) currentYaw.current = 0;
    if (!Number.isFinite(currentPitch.current)) currentPitch.current = 0;

    state.camera.rotation.set(currentPitch.current, currentYaw.current, 0, 'YXZ');

    if (!isFocused) {
      const progress = Math.max(0, Math.min(1, (1.8 - state.camera.position.z) / maxTravelDistance));
      const closestIdx = Math.min(totalArtworks - 1, Math.max(0, Math.round(progress * (totalArtworks - 1))));
      onUpdateActiveIndex(closestIdx);
    }
  });

  return null;
}

// --- PaintingScene Props ---
export interface PaintingSceneProps {
  artworks: Artwork[];
  locale: 'ckb' | 'ar' | 'en';
  targetZ: number;
  moveDirection: number;
  targetYaw: number;
  targetPitch: number;
  focusedArtworkIndex: number | null;
  onUpdateTargetZ: (z: number) => void;
  onUpdateActiveIndex: (index: number) => void;
  onFocusArtwork: (artwork: Artwork, index: number) => void;
  onOpenModal: (artwork: Artwork) => void;
  targetX?: number;
  moveVector?: { x: number; y: number };
  onUpdateTargetX?: (x: number) => void;
}

export function PaintingScene({
  artworks, locale, targetZ, moveDirection,
  targetYaw, targetPitch, focusedArtworkIndex,
  onUpdateTargetZ, onUpdateActiveIndex, onFocusArtwork, onOpenModal,
  targetX = 0, moveVector, onUpdateTargetX,
}: PaintingSceneProps) {
  const corridorLength = useMemo(() =>
    Math.max(30, artworks.length * SPACING_INTERVAL + ENTRY_BUFFER + EXIT_BUFFER),
    [artworks.length]
  );
  const maxTravelDistance = useMemo(() => corridorLength - 7, [corridorLength]);

  return (
    <>
      <color attach="background" args={['#0c0c10']} />
      <fog attach="fog" args={['#0c0c10', 8, 38]} />

      {/* Soft Studio Museum Lighting (Bright, High-Key, Zero Harsh Shadows) */}
      <ambientLight intensity={1.35} color="#fffcf5" />

      {/* Key Studio Directional Light */}
      <directionalLight
        position={[3, 7, 4]}
        intensity={2.2}
        color="#fffbf2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0003}
      />

      {/* Soft Opposing Fill Light to lift all shadows */}
      <directionalLight position={[-3, 6, -10]} intensity={1.35} color="#f5f8ff" />

      {/* Distant Corridor Fill Light */}
      <directionalLight position={[0, 5, -25]} intensity={1.15} color="#fff8ee" />

      {/* Floor & Ceiling Upward Bounce Light */}
      <hemisphereLight args={['#ffffff', '#ded5c5', 1.15]} />

      <FreeLookCameraRig
        targetZ={targetZ}
        moveDirection={moveDirection}
        targetYaw={targetYaw}
        targetPitch={targetPitch}
        maxTravelDistance={maxTravelDistance}
        onUpdateTargetZ={onUpdateTargetZ}
        onUpdateActiveIndex={onUpdateActiveIndex}
        totalArtworks={artworks.length}
        isFocused={focusedArtworkIndex !== null}
        targetX={targetX}
        moveVector={moveVector}
        onUpdateTargetX={onUpdateTargetX}
      />

      <CorridorEnvironment corridorLength={corridorLength} />

      {artworks.map((art, idx) => (
        <ArtworkFrame3D
          key={art.id}
          artwork={art}
          index={idx}
          total={artworks.length}
          isFocused={focusedArtworkIndex === idx}
          locale={locale}
          onFocus={onFocusArtwork}
          onOpenModal={onOpenModal}
        />
      ))}
    </>
  );
}
