'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { SculptureDoor } from './SculptureDoor';
import { PaintingDoor } from './PaintingDoor';
import { withCacheBust } from '@/lib/cacheBust';

const KURDISH_FONT = withCacheBust('/fonts/NotoSansArabic-Bold.ttf');

// Shared Scene Type Declaration
export type SceneType = 'lobby' | 'painting' | 'sculpture' | 'mixed';

// --- Compact Spatial Constants (Intimate Roman Vestibule) ---
const LOBBY_RADIUS = 3.6;     // Significantly scaled down from 7.0m for cozy mobile immersion
const LOBBY_HEIGHT = 3.8;     // Scaled down ceiling height
const ROTUNDA_SEGMENTS = 48;

// --- Free-Look Camera Rig (Optimized Spawn Distance) ---
interface LobbyFreeLookRigProps {
  targetYaw: number;
  targetPitch: number;
}

function LobbyFreeLookRig({ targetYaw, targetPitch }: LobbyFreeLookRigProps) {
  const currentYaw = useRef(0);
  const currentPitch = useRef(0);

  useFrame((state, delta) => {
    const safeDelta = Number.isFinite(delta) && delta > 0 ? Math.min(delta, 0.1) : 0.016;

    if (!Number.isFinite(currentYaw.current)) currentYaw.current = 0;
    if (!Number.isFinite(currentPitch.current)) currentPitch.current = 0;

    const safeTargetYaw = Number.isFinite(targetYaw) ? targetYaw : 0;
    const safeTargetPitch = Number.isFinite(targetPitch)
      ? THREE.MathUtils.clamp(targetPitch, -Math.PI / 4, Math.PI / 4)
      : 0;

    let yawDiff = (safeTargetYaw - currentYaw.current) % (Math.PI * 2);
    if (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
    if (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
    const effectiveTargetYaw = currentYaw.current + yawDiff;

    currentYaw.current = THREE.MathUtils.damp(currentYaw.current, effectiveTargetYaw, 10.0, safeDelta);
    currentPitch.current = THREE.MathUtils.damp(currentPitch.current, safeTargetPitch, 10.0, safeDelta);

    if (!Number.isFinite(currentYaw.current)) currentYaw.current = 0;
    if (!Number.isFinite(currentPitch.current)) currentPitch.current = 0;

    // Camera spawns slightly set back at z = 0.4 at comfortable eye level (1.6m)
    // All 3 Roman arched doors are immediately in view without walking!
    state.camera.position.set(0, 1.6, 0.4);
    state.camera.rotation.set(currentPitch.current, currentYaw.current, 0, 'YXZ');
  });

  return null;
}

// --- Scaled Classical Mixed Hall Portal Component (Texture-Mapped) ---
const MIXED_DOOR_TEXTURE = withCacheBust('/mixed-door.jpg');

interface MixedDoorProps {
  hovered: boolean;
}

function MixedDoor({ hovered }: MixedDoorProps) {
  const texture = useTexture(MIXED_DOOR_TEXTURE);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const ringRef = useRef<THREE.Group>(null);

  // Proportions matching the classical stone portal (297w x 535h = 0.555)
  const doorHeight = 2.0;
  const doorWidth = Number((doorHeight * (297 / 535)).toFixed(3)); // ~1.11m
  const doorDepth = 0.04;
  const centerY = doorHeight / 2 + 0.12;

  useFrame((state, delta) => {
    if (ringRef.current) {
      if (hovered) {
        const t = state.clock.getElapsedTime() * 7;
        const targetRot = Math.sin(t) * 0.14 + 0.06;
        ringRef.current.rotation.x = THREE.MathUtils.lerp(ringRef.current.rotation.x, targetRot, delta * 10);
      } else {
        ringRef.current.rotation.x = THREE.MathUtils.damp(ringRef.current.rotation.x, 0, 8, delta);
      }
    }
  });

  return (
    <group position={[0, centerY, 0.02]}>
      {/* 1. Door Physical Backing Slab */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[doorWidth + 0.02, doorHeight + 0.02, doorDepth]} />
        <meshStandardMaterial
          color={hovered ? '#3b434d' : '#2b333d'}
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Primary Textured Door Face */}
      <mesh position={[0, 0, doorDepth / 2 + 0.002]} castShadow receiveShadow raycast={() => null}>
        <planeGeometry args={[doorWidth, doorHeight]} />
        <meshStandardMaterial
          map={texture}
          color="#ffffff"
          roughness={0.92}
          metalness={0.0}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Scaled 3D Bronze Pull Ring */}
      <group position={[0, -0.06, doorDepth / 2 + 0.006]}>
        <mesh position={[0, 0, 0.004]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.075, 0.08, 0.012, 24]} />
          <meshStandardMaterial
            color={hovered ? '#94b3cf' : '#6f8fae'}
            roughness={0.35}
            metalness={0.88}
          />
        </mesh>
        <group ref={ringRef} position={[0, 0.01, 0.014]}>
          <mesh position={[0, -0.045, 0]} raycast={() => null}>
            <torusGeometry args={[0.05, 0.011, 12, 24]} />
            <meshStandardMaterial
              color={hovered ? '#b6d3eb' : '#88a9c7'}
              roughness={0.3}
              metalness={0.92}
            />
          </mesh>
        </group>
      </group>

      {/* 4. Subtle Warm Ambient Spotlight */}
      <pointLight
        position={[0, doorHeight * 0.25, 0.65]}
        intensity={hovered ? 12 : 6}
        distance={3.5}
        decay={2}
        color={hovered ? '#e6f2ff' : '#d2e4f7'}
      />
    </group>
  );
}

useTexture.preload(MIXED_DOOR_TEXTURE);

// --- Scaled Classical Museum Portal Component ---
interface DoorPortalProps {
  angle: number;       // Angle in radians from forward (-Z) direction
  label: string;       // Kurdish main title
  subLabel: string;    // English sub-title
  accentColor: string;
  scene: SceneType;
  onNavigate: (scene: SceneType) => void;
}

function DoorPortal({ angle, label, subLabel, accentColor, scene, onNavigate }: DoorPortalProps) {
  const [hovered, setHovered] = useState(false);
  const frameRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  // Position snugly along the compact rotunda perimeter facing the visitor
  const dist = LOBBY_RADIUS - 0.28;
  const doorX = Math.sin(angle) * dist;
  const doorZ = -Math.cos(angle) * dist;
  const rotY = -angle;

  // Scaled hitbox proportions per door type for frictionless mobile tapping
  const hitboxWidth = scene === 'painting' ? 2.15 : 1.25;
  const hitboxHeight = scene === 'painting' ? 1.75 : 2.1;
  const hitboxY = scene === 'painting' ? 0.98 : 1.12;

  useFrame((_, delta) => {
    if (frameRef.current) {
      const targetScale = hovered ? 1.025 : 1.0;
      frameRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }
    if (glowRef.current) {
      const targetIntensity = hovered ? 18 : 7;
      glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, targetIntensity, delta * 6);
    }
  });

  return (
    <group position={[doorX, 0, doorZ]} rotation={[0, rotY, 0]}>
      {/* Warm Ambient Doorway Illumination */}
      <pointLight
        ref={glowRef}
        position={[0, 1.4, 0.45]}
        intensity={7}
        distance={4.2}
        decay={2}
        color={accentColor}
      />

      {/* Visual Door Assembly */}
      <group ref={frameRef}>
        {/* Generous Invisible Touch/Click Hitbox for Mobile Frictionless Tapping (ONLY Raycast Recipient) */}
        <mesh
          position={[0, hitboxY, 0.08]}
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
            onNavigate(scene);
          }}
        >
          <boxGeometry args={[hitboxWidth, hitboxHeight, 0.45]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* ── Floor Plinth / Threshold Grounding the Portal ── */}
        <mesh position={[0, 0.04, 0.03]} raycast={() => null}>
          <boxGeometry args={[hitboxWidth + 0.1, 0.08, 0.16]} />
          <meshStandardMaterial
            color={hovered ? '#443628' : '#2e251d'}
            roughness={0.65}
            metalness={0.2}
          />
        </mesh>

        {/* ── Dedicated High-Performance Texture-Mapped Doors ── */}
        {scene === 'sculpture' ? (
          <SculptureDoor hovered={hovered} />
        ) : scene === 'painting' ? (
          <PaintingDoor hovered={hovered} />
        ) : (
          <MixedDoor hovered={hovered} />
        )}

        {/* ── Mobile-Friendly Hover / Active CTA Badge ── */}
        {hovered && (
          <group position={[0, 1.15, 0.15]}>
            <mesh raycast={() => null}>
              <planeGeometry args={[0.78, 0.22]} />
              <meshBasicMaterial color="#0A0A0C" transparent opacity={0.88} />
            </mesh>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.082}
              color="#D4AF37"
              anchorX="center"
              anchorY="middle"
              font={KURDISH_FONT}
              direction="rtl"
              raycast={() => null}
            >
              بچۆ ژوورەوە ←
            </Text>
          </group>
        )}
      </group>
    </group>
  );
}

// --- Scaled Classical Roman Marble Column ---
function RomanColumn({ angle }: { angle: number }) {
  const r = LOBBY_RADIUS - 0.18;
  const colX = Math.sin(angle) * r;
  const colZ = -Math.cos(angle) * r;

  return (
    <group position={[colX, 0, colZ]}>
      {/* Plinth Base */}
      <mesh position={[0, 0.07, 0]} raycast={() => null}>
        <boxGeometry args={[0.26, 0.14, 0.26]} />
        <meshStandardMaterial color="#f0ece1" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Slender Fluted Marble Shaft */}
      <mesh position={[0, LOBBY_HEIGHT / 2, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.08, 0.095, LOBBY_HEIGHT - 0.28, 16]} />
        <meshStandardMaterial color="#faf7f0" roughness={0.28} metalness={0.06} />
      </mesh>
      {/* Golden Astragal Ring Trim */}
      <mesh position={[0, LOBBY_HEIGHT * 0.32, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[0.098, 0.012, 8, 20]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>
      {/* Classical Tuscan Capital */}
      <mesh position={[0, LOBBY_HEIGHT - 0.12, 0]} raycast={() => null}>
        <boxGeometry args={[0.28, 0.14, 0.28]} />
        <meshStandardMaterial color="#f0ece1" roughness={0.35} metalness={0.1} />
      </mesh>
    </group>
  );
}

// --- Bright Roman Classical Architecture (Marble & Oculus Skylight) ---
function RomanRotundaArchitecture() {
  return (
    <group>
      {/* 1. Polished Cream/White Marble Floor */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow raycast={() => null}>
        <circleGeometry args={[LOBBY_RADIUS + 0.5, ROTUNDA_SEGMENTS]} />
        <meshStandardMaterial
          color="#f6f3eb"
          roughness={0.18}
          metalness={0.08}
        />
      </mesh>

      {/* Gold Circular Floor Inlays */}
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[LOBBY_RADIUS * 0.45, LOBBY_RADIUS * 0.456, 48]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[LOBBY_RADIUS * 0.88, LOBBY_RADIUS * 0.886, 48]} />
        <meshBasicMaterial color="#C5A059" />
      </mesh>

      {/* Central Institute Seal Emblem */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <circleGeometry args={[0.62, 32]} />
        <meshStandardMaterial color="#ebe5d8" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[0.58, 0.62, 32]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>

      {/* 2. Classical Travertine/Cream Marble Walls */}
      <mesh position={[0, LOBBY_HEIGHT / 2, 0]} raycast={() => null}>
        <cylinderGeometry args={[LOBBY_RADIUS, LOBBY_RADIUS, LOBBY_HEIGHT, ROTUNDA_SEGMENTS, 1, true]} />
        <meshStandardMaterial
          color="#eae5da"
          roughness={0.6}
          metalness={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 3. Baseboard & Crown Molding */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[LOBBY_RADIUS - 0.015, 0.08, 6, ROTUNDA_SEGMENTS]} />
        <meshStandardMaterial color="#ded7c8" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, LOBBY_HEIGHT - 0.06, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[LOBBY_RADIUS - 0.015, 0.07, 6, ROTUNDA_SEGMENTS]} />
        <meshStandardMaterial color="#ded7c8" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Gold Crown Rail */}
      <mesh position={[0, LOBBY_HEIGHT - 0.04, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[LOBBY_RADIUS - 0.01, 0.018, 6, ROTUNDA_SEGMENTS]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>

      {/* 4. Ceiling with Classical Open Pantheon Oculus */}
      <mesh position={[0, LOBBY_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[0.9, LOBBY_RADIUS, ROTUNDA_SEGMENTS]} />
        <meshStandardMaterial color="#f2eee6" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Oculus Golden Ring Trim */}
      <mesh position={[0, LOBBY_HEIGHT - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[0.9, 0.035, 8, 36]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.25} metalness={0.85} />
      </mesh>

      {/* Bright Sky Oculus Light Disc */}
      <mesh position={[0, LOBBY_HEIGHT + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color="#fffbee" />
      </mesh>

      {/* Direct Daylight Pouring Down through the Oculus */}
      <pointLight
        position={[0, LOBBY_HEIGHT - 0.2, 0]}
        intensity={28}
        distance={9}
        decay={2}
        color="#fff8ea"
      />

      {/* 5. Classical Columns Framing the Doors (Carefully Positioned so View is 100% Unobstructed) */}
      {/* Flanking between Center & Side Doors (-22.5° and +22.5°) */}
      <RomanColumn angle={-Math.PI / 8} />
      <RomanColumn angle={Math.PI / 8} />

      {/* Flanking Outer Sides (-67.5° and +67.5°) */}
      <RomanColumn angle={-(Math.PI * 3) / 8} />
      <RomanColumn angle={(Math.PI * 3) / 8} />

      {/* Rear Perimeter Columns */}
      <RomanColumn angle={-Math.PI * 0.75} />
      <RomanColumn angle={Math.PI * 0.75} />
      <RomanColumn angle={Math.PI} />
    </group>
  );
}

// --- Mobile-Optimized Floating Inscription Plaque ---
function MobileOptimizedWelcomeText() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 2.4 + Math.sin(clock.getElapsedTime() * 0.8) * 0.015;
    }
  });

  return (
    <group ref={ref} position={[0, 2.4, -1.8]}>
      {/* Elegant Classical Roman Marble Cartouche Base */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.65, 0.44]} />
        <meshStandardMaterial
          color="#f6f2e9"
          roughness={0.25}
          metalness={0.08}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Gold Inset Frame */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[1.6, 0.39]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.3} />
      </mesh>

      {/* Scaled Kurdish Primary Title (Crisp, High-Contrast & Legible on Mobile) */}
      <Text
        position={[0, 0.1, 0.01]}
        fontSize={0.11}
        font={KURDISH_FONT}
        color="#4A3B12"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        direction="rtl"
        maxWidth={1.55}
      >
        دەروازەی گەورەی پێشانگا
      </Text>

      {/* Kurdish Subtitle */}
      <Text
        position={[0, -0.015, 0.01]}
        fontSize={0.075}
        font={KURDISH_FONT}
        color="#7A6832"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        direction="rtl"
        maxWidth={1.55}
      >
        پەیمانگەی هونەرە جوانەکانی چەمچەماڵ
      </Text>

      {/* Latin Caption */}
      <Text
        position={[0, -0.11, 0.01]}
        fontSize={0.05}
        color="#9A8550"
        anchorX="center"
        anchorY="middle"
      >
        CHAMCHAMAL FINE ARTS ARCHIVE • GRAND LOBBY
      </Text>
    </group>
  );
}

// --- Main Compact Lobby Scene Component Export ---
interface LobbySceneProps {
  onNavigate: (scene: SceneType) => void;
  targetYaw: number;
  targetPitch: number;
}

export function LobbyScene({ onNavigate, targetYaw, targetPitch }: LobbySceneProps) {
  return (
    <>
      {/* Bright Roman Classical Marble Background */}
      <color attach="background" args={['#ece7df']} />

      {/* Bright Soft Studio Roman Daylight & Illumination (Zero Harsh Shadows) */}
      <ambientLight intensity={1.4} color="#fffcf5" />
      <directionalLight
        position={[3.5, 6.5, 2.5]}
        intensity={2.2}
        color="#fffbf2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0003}
      />
      <directionalLight
        position={[-3.5, 5.5, -2.5]}
        intensity={1.3}
        color="#f5f8ff"
      />
      <pointLight position={[0, 4.5, 0]} intensity={35} distance={12} decay={2} color="#fff6e0" />
      <hemisphereLight args={['#ffffff', '#e8dfd3', 1.2]} />

      {/* Smooth Free-Look Camera Rig */}
      <LobbyFreeLookRig targetYaw={targetYaw} targetPitch={targetPitch} />

      {/* Clear, Luminous Classical Museum Atmosphere (Warm Marble Tone) */}
      <fog attach="fog" args={['#ece7df', 5, 14]} />

      {/* Scaled-Down Roman Rotunda Architecture */}
      <RomanRotundaArchitecture />

      {/* Mobile-Friendly Floating Inscription */}
      <MobileOptimizedWelcomeText />

      {/* 3 Roman Arched Doors (Intimately positioned at -45°, 0°, +45°) */}
      {/* 1. Center Door: Painting Hall (بەشی وێنەکێشان) — Directly straight ahead */}
      <DoorPortal
        angle={0}
        label="بەشی وێنەکێشان"
        subLabel="Painting Hall"
        accentColor="#D4AF37"
        scene="painting"
        onNavigate={onNavigate}
      />

      {/* 2. Left Door: Sculpture Hall (بەشی پەیکەرسازی) — Intimate -45° arc */}
      <DoorPortal
        angle={-Math.PI / 4}
        label="بەشی پەیکەرسازی"
        subLabel="Sculpture Hall"
        accentColor="#B87333"
        scene="sculpture"
        onNavigate={onNavigate}
      />

      {/* 3. Right Door: Mixed Hall (بابەتی تێکەڵاو) — Intimate +45° arc */}
      <DoorPortal
        angle={Math.PI / 4}
        label="بابەتی تێکەڵاو"
        subLabel="Mixed Gallery"
        accentColor="#4A7599"
        scene="mixed"
        onNavigate={onNavigate}
      />
    </>
  );
}
