'use client';

import React, { useRef, useMemo, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Artwork } from '@/data/artworks';
import { computeArtwork3DDimensions } from '@/lib/dimensions';
import { InstituteEndWallLogo, GalleryWelcomeSign, GalleryWelcomeOverheadArch } from '@/components/gallery/GalleryBranding';
import { withCacheBust } from '@/lib/cacheBust';

// --- Constants ---
const CORRIDOR_WIDTH = 6.4;
const CORRIDOR_HEIGHT = 4.2;
const SPACING_INTERVAL = 5.5;
const ENTRY_BUFFER = 5.0;
const EXIT_BUFFER = 8.0;
const WALKING_SPEED = 7.5;

// --- FPS Camera Rig ---
interface FreeLookRigProps {
  targetZ: number;
  moveDirection: number;
  targetYaw: number;
  targetPitch: number;
  maxTravelDistance: number;
  onUpdateTargetZ: (z: number) => void;
  onUpdateActiveIndex: (index: number) => void;
  totalItems: number;
  targetX?: number;
  moveVector?: { x: number; y: number };
  onUpdateTargetX?: (x: number) => void;
}

function FreeLookCameraRig({
  targetZ, moveDirection, targetYaw, targetPitch,
  maxTravelDistance, onUpdateTargetZ, onUpdateActiveIndex, totalItems,
  targetX = 0, moveVector, onUpdateTargetX,
}: FreeLookRigProps) {
  const currentYaw = useRef(0);
  const currentPitch = useRef(0);

  useFrame((state, delta) => {
    const safeDelta = Number.isFinite(delta) && delta > 0 ? Math.min(delta, 0.1) : 0.016;

    const effectiveMoveY = moveVector && moveVector.y !== 0
      ? moveVector.y
      : (moveDirection !== 0 ? -moveDirection : 0);
    const effectiveMoveX = moveVector?.x ?? 0;

    if (effectiveMoveY !== 0 || effectiveMoveX !== 0) {
      if (effectiveMoveY !== 0) {
        const step = -effectiveMoveY * WALKING_SPEED * safeDelta;
        const safeTargetZ = Number.isFinite(targetZ) ? targetZ : 1.8;
        const nextZ = Math.max(-maxTravelDistance, Math.min(1.8, safeTargetZ + step));
        if (nextZ !== targetZ) onUpdateTargetZ(nextZ);
      }
      if (effectiveMoveX !== 0 && onUpdateTargetX) {
        const STRAFE_SPEED = 4.0;
        const stepX = effectiveMoveX * STRAFE_SPEED * safeDelta;
        const safeTargetX = Number.isFinite(targetX) ? targetX : 0;
        const nextX = Math.max(-1.3, Math.min(1.3, safeTargetX + stepX));
        if (nextX !== targetX) onUpdateTargetX(nextX);
      }
    }

    const safeTargetZ = Number.isFinite(targetZ) ? targetZ : 1.8;
    const safeTargetX = Number.isFinite(targetX) ? targetX : 0;
    state.camera.position.set(
      THREE.MathUtils.damp(state.camera.position.x, safeTargetX, 4.0, safeDelta),
      1.7,
      THREE.MathUtils.damp(state.camera.position.z, safeTargetZ, 4.0, safeDelta)
    );
    if (!Number.isFinite(state.camera.position.x)) state.camera.position.x = 0;
    if (!Number.isFinite(state.camera.position.z)) state.camera.position.z = 1.8;

    if (!Number.isFinite(currentYaw.current)) currentYaw.current = 0;
    if (!Number.isFinite(currentPitch.current)) currentPitch.current = 0;

    const safeYaw = Number.isFinite(targetYaw) ? targetYaw : 0;
    const safePitch = Number.isFinite(targetPitch) ? THREE.MathUtils.clamp(targetPitch, -Math.PI / 4, Math.PI / 4) : 0;
    let yawDiff = (safeYaw - currentYaw.current) % (Math.PI * 2);
    if (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
    if (yawDiff < -Math.PI) yawDiff += Math.PI * 2;

    currentYaw.current = THREE.MathUtils.damp(currentYaw.current, currentYaw.current + yawDiff, 12.0, safeDelta);
    currentPitch.current = THREE.MathUtils.damp(currentPitch.current, safePitch, 12.0, safeDelta);
    if (!Number.isFinite(currentYaw.current)) currentYaw.current = 0;
    if (!Number.isFinite(currentPitch.current)) currentPitch.current = 0;

    state.camera.rotation.set(currentPitch.current, currentYaw.current, 0, 'YXZ');

    if (totalItems > 0) {
      const progress = Math.max(0, Math.min(1, (1.8 - state.camera.position.z) / maxTravelDistance));
      onUpdateActiveIndex(Math.min(totalItems - 1, Math.max(0, Math.round(progress * (totalItems - 1)))));
    }
  });
  return null;
}

// --- Artwork image for mixed (simple texture loader) ---
function MixedArtworkImage({ url, width, height }: { url: string; width: number; height: number }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [failed, setFailed] = useState(false);

  React.useEffect(() => {
    if (!url) { setFailed(true); return; }
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(withCacheBust(url),
      (t) => { if (alive) { t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; setTexture(t); } },
      undefined,
      () => { if (alive) setFailed(true); }
    );
    return () => { alive = false; };
  }, [url]);

  if (failed || !texture) {
    return <mesh position={[0, 0, 0.05]}><planeGeometry args={[width, height]} /><meshBasicMaterial color="#1a1a2a" /></mesh>;
  }
  return (
    <mesh position={[0, 0, 0.05]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// --- Mixed Display Frame (compact version) ---
function MixedFrame({ artwork, index, locale }: { artwork: Artwork; index: number; locale: 'ckb' | 'ar' | 'en' }) {
  const isLeft = index % 2 === 0;
  const zPosition = -(ENTRY_BUFFER + index * SPACING_INTERVAL);
  const xPosition = isLeft ? -(CORRIDOR_WIDTH / 2 - 0.08) : (CORRIDOR_WIDTH / 2 - 0.08);
  const rotationY = isLeft ? Math.PI / 2 : -Math.PI / 2;
  const [hovered, setHovered] = useState(false);

  const { frameW, frameH, canvasW, canvasH } = useMemo(() => {
    return computeArtwork3DDimensions(artwork);
  }, [artwork]);

  const plaqueText = useMemo(() => {
    const title = artwork?.title?.[locale] || artwork?.title?.ckb || artwork?.title?.en || '';
    const artist = artwork?.artist?.[locale] || artwork?.artist?.ckb || artwork?.artist?.en || '';
    return `${title} • ${artist} • ${artwork.year}`;
  }, [artwork, locale]);

  return (
    <group position={[xPosition, CORRIDOR_HEIGHT * 0.48, zPosition]} rotation={[0, rotationY, 0]}>
      <pointLight position={[0, frameH / 2 + 0.4, 0.6]} intensity={20} distance={5.2} decay={2} color="#fff6dc" />
      <group>
        {/* Invisible hit target for raycasting */}
        <mesh
          position={[0, -0.1, 0.05]}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
          <boxGeometry args={[frameW + 0.2, frameH + 0.6, 0.25]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Frame */}
        <mesh raycast={() => null}>
          <boxGeometry args={[frameW, frameH, 0.08]} />
          <meshStandardMaterial color={hovered ? '#1a1814' : '#0f0e0c'} roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Gold fillet */}
        <mesh position={[0, 0, 0.042]} raycast={() => null}>
          <boxGeometry args={[frameW - 0.08, frameH - 0.08, 0.01]} />
          <meshStandardMaterial color={hovered ? '#f5d77f' : '#7a9fcc'} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Image */}
        <Suspense fallback={null}>
          <MixedArtworkImage url={artwork.imageUrl} width={canvasW} height={canvasH} />
        </Suspense>
        {/* Plaque */}
        <group position={[0, -frameH / 2 - 0.22, 0.02]}>
          <mesh position={[0, 0, 0.005]} raycast={() => null}>
            <boxGeometry args={[Math.max(1.36, frameW * 0.76), 0.26, 0.015]} />
            <meshStandardMaterial color="#2a4a6a" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.015]} raycast={() => null}>
            <boxGeometry args={[Math.max(1.32, frameW * 0.76 - 0.04), 0.22, 0.012]} />
            <meshStandardMaterial color="#7a9fcc" emissive="#1a3a5a" emissiveIntensity={0.2} metalness={0.7} roughness={0.3} />
          </mesh>
          <Text
            position={[0, 0, 0.025]}
            fontSize={0.065}
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

// --- Mixed corridor environment ---
function MixedCorridorEnvironment({ corridorLength }: { corridorLength: number }) {
  const centerZ = -corridorLength / 2 + 2;
  const beamCount = Math.floor(corridorLength / 6);
  const beamPositions = useMemo(() => {
    const list = [];
    for (let i = 0; i < beamCount; i++) list.push(1 - i * 6);
    return list;
  }, [beamCount]);

  return (
    <group>
      <mesh position={[0, 0, centerZ]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[CORRIDOR_WIDTH, corridorLength]} />
        <meshStandardMaterial color="#0b0b0f" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.005, centerZ]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[1.8, corridorLength]} />
        <meshStandardMaterial color="#0d0c18" roughness={0.75} />
      </mesh>
      {[-0.92, 0.92].map((x) => (
        <mesh key={x} position={[x, 0.007, centerZ]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
          <planeGeometry args={[0.03, corridorLength]} />
          <meshStandardMaterial color="#2a4a6a" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, CORRIDOR_HEIGHT, centerZ]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[CORRIDOR_WIDTH, corridorLength]} />
        <meshStandardMaterial color="#07070a" roughness={0.9} />
      </mesh>
      <mesh position={[-CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, centerZ]} rotation={[0, Math.PI / 2, 0]} raycast={() => null}>
        <planeGeometry args={[corridorLength, CORRIDOR_HEIGHT]} />
        <meshStandardMaterial color="#10101a" roughness={0.88} />
      </mesh>
      <mesh position={[CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, centerZ]} rotation={[0, -Math.PI / 2, 0]} raycast={() => null}>
        <planeGeometry args={[corridorLength, CORRIDOR_HEIGHT]} />
        <meshStandardMaterial color="#10101a" roughness={0.88} />
      </mesh>
      {[-CORRIDOR_WIDTH / 2 + 0.04, CORRIDOR_WIDTH / 2 - 0.04].map((x) => (
        <React.Fragment key={x}>
          <mesh position={[x, 0.12, centerZ]} raycast={() => null}>
            <boxGeometry args={[0.08, 0.24, corridorLength]} />
            <meshStandardMaterial color="#1a1d22" roughness={0.4} metalness={0.4} />
          </mesh>
          <mesh position={[x, CORRIDOR_HEIGHT - 0.08, centerZ]} raycast={() => null}>
            <boxGeometry args={[0.08, 0.16, corridorLength]} />
            <meshStandardMaterial color="#161820" roughness={0.4} metalness={0.5} />
          </mesh>
        </React.Fragment>
      ))}
      {beamPositions.map((z, idx) => (
        <group key={idx} position={[0, CORRIDOR_HEIGHT - 0.1, z]}>
          <mesh raycast={() => null}>
            <boxGeometry args={[CORRIDOR_WIDTH, 0.2, 0.35]} />
            <meshStandardMaterial color="#141520" roughness={0.6} />
          </mesh>
          <pointLight position={[0, -0.3, 0]} intensity={4} distance={7} decay={2} color="#d8e8ff" />
        </group>
      ))}
      {/* Overhead Entrance Archway */}
      <GalleryWelcomeOverheadArch />

      {/* Entrance Wall with Monumental Kurdish Welcome Sign */}
      <group position={[0, CORRIDOR_HEIGHT / 2, 2.5]} rotation={[0, Math.PI, 0]}>
        <mesh raycast={() => null}>
          <planeGeometry args={[CORRIDOR_WIDTH, CORRIDOR_HEIGHT]} />
          <meshStandardMaterial color="#0d0d18" roughness={0.8} />
        </mesh>
        <GalleryWelcomeSign />
      </group>

      {/* Back Wall (Official Institute Logo Emblem) */}
      <group position={[0, CORRIDOR_HEIGHT / 2, -corridorLength + 2]}>
        <mesh raycast={() => null}>
          <planeGeometry args={[CORRIDOR_WIDTH, CORRIDOR_HEIGHT]} />
          <meshStandardMaterial color="#0d0d18" roughness={0.8} />
        </mesh>
        <InstituteEndWallLogo />
      </group>
    </group>
  );
}

// --- MixedScene Props ---
export interface MixedSceneProps {
  artworks: Artwork[];
  locale: 'ckb' | 'ar' | 'en';
  targetZ: number;
  moveDirection: number;
  targetYaw: number;
  targetPitch: number;
  onUpdateTargetZ: (z: number) => void;
  onUpdateActiveIndex: (index: number) => void;
  targetX?: number;
  moveVector?: { x: number; y: number };
  onUpdateTargetX?: (x: number) => void;
}

export function MixedScene({
  artworks, locale, targetZ, moveDirection,
  targetYaw, targetPitch,
  onUpdateTargetZ, onUpdateActiveIndex,
  targetX = 0, moveVector, onUpdateTargetX,
}: MixedSceneProps) {
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
        totalItems={artworks.length}
        targetX={targetX}
        moveVector={moveVector}
        onUpdateTargetX={onUpdateTargetX}
      />

      <MixedCorridorEnvironment corridorLength={corridorLength} />

      {artworks.map((art, idx) => (
        <MixedFrame key={art.id} artwork={art} index={idx} locale={locale} />
      ))}
    </>
  );
}
