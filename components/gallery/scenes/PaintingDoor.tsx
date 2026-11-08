'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface PaintingDoorProps {
  hovered: boolean;
}

/**
 * ─────────────────────────────────────────────────────────────
 * PAINTING HALL ARTISTIC STUDIO DOOR
 * ─────────────────────────────────────────────────────────────
 * High-performance 3D textured door:
 * - Direct texture mapping via useTexture('/painting-door.jpg')
 * - Contrast-optimized meshStandardMaterial (toneMapped={false}, color="#ffffff", roughness=0.92)
 *   so the natural text baked into the texture stands out dark and razor-sharp
 * - Scaled down for seamless mobile visibility (fits viewport without clipping)
 * - Proportional 3D antique bronze artist palette handle with interactive pull ring
 */
export function PaintingDoor({ hovered }: PaintingDoorProps) {
  const texture = useTexture('/painting-door.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;

  const pullRingRef = useRef<THREE.Group>(null);

  // Scaled down dimensions for mobile screens
  // Reference image aspect ratio: 644w x 518h = 1.243
  const doorHeight = 1.65;
  const doorWidth = Number((doorHeight * (644 / 518)).toFixed(3)); // ~2.05m
  const doorDepth = 0.04;

  // Center vertical placement: base near floor at y=0.15, center at y=0.975
  const centerY = doorHeight / 2 + 0.15;

  // Subtle interactive pull ring swing when hovered
  useFrame((state, delta) => {
    if (pullRingRef.current) {
      if (hovered) {
        const t = state.clock.getElapsedTime() * 7;
        const targetRot = Math.sin(t) * 0.16 + 0.06;
        pullRingRef.current.rotation.x = THREE.MathUtils.lerp(pullRingRef.current.rotation.x, targetRot, delta * 10);
      } else {
        pullRingRef.current.rotation.x = THREE.MathUtils.damp(pullRingRef.current.rotation.x, 0, 8, delta);
      }
    }
  });

  // Position of artist palette handle in texture:
  // In 644x518 image, palette handle sits on right edge of center leaf:
  // x ≈ +0.165 of door width, y ≈ -0.06 of door height
  const handleX = doorWidth * 0.165;
  const handleY = -doorHeight * 0.06;

  return (
    <group position={[0, centerY, 0.02]}>
      {/* ── 1. Door Physical Backing Slab (Subtle Depth) ── */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[doorWidth + 0.02, doorHeight + 0.02, doorDepth]} />
        <meshStandardMaterial
          color={hovered ? '#442e1d' : '#332215'}
          roughness={0.8}
          metalness={0.12}
        />
      </mesh>

      {/* ── 2. Primary Textured Door Face (High Contrast, No Specular Glare) ── */}
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

      {/* ── 3. Scaled 3D Antique Bronze Palette Handle with Pull Ring ── */}
      <group position={[handleX, handleY, doorDepth / 2 + 0.006]}>
        {/* Palette Knob Base */}
        <mesh position={[0, 0, 0.004]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.035, 0.04, 0.012, 16]} />
          <meshStandardMaterial
            color={hovered ? '#f0c78a' : '#c59556'}
            roughness={0.35}
            metalness={0.88}
          />
        </mesh>

        {/* Animated Pull Ring */}
        <group ref={pullRingRef} position={[0, -0.008, 0.012]}>
          <mesh position={[0, -0.03, 0]} raycast={() => null}>
            <torusGeometry args={[0.036, 0.008, 10, 20]} />
            <meshStandardMaterial
              color={hovered ? '#ffd899' : '#d4a263'}
              roughness={0.3}
              metalness={0.92}
            />
          </mesh>
        </group>
      </group>

      {/* ── 4. Warm Grazing Studio Spotlight ── */}
      <pointLight
        position={[0, doorHeight * 0.3, 0.7]}
        intensity={hovered ? 14 : 7}
        distance={3.8}
        decay={2}
        color={hovered ? '#fff3d6' : '#ffe8c2'}
      />
    </group>
  );
}

useTexture.preload('/painting-door.jpg');

// Backwards compatibility alias
export const PaintingDoorLeaf = PaintingDoor;
