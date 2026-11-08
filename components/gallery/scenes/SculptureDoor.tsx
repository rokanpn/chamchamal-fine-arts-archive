'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface SculptureDoorProps {
  hovered: boolean;
}

/**
 * ─────────────────────────────────────────────────────────────
 * SCULPTURE HALL CARVED STONE & MARBLE DOOR
 * ─────────────────────────────────────────────────────────────
 * High-performance 3D textured door:
 * - Direct texture mapping via useTexture('/sculpture-door.jpg')
 * - Contrast-optimized meshStandardMaterial (toneMapped={false}, color="#ffffff", roughness=0.92)
 *   so the natural text baked into the texture stands out dark and razor-sharp
 * - Scaled down for seamless mobile visibility (fits viewport without clipping)
 * - Proportional 3D antique bronze ring knocker with hover physics
 */
export function SculptureDoor({ hovered }: SculptureDoorProps) {
  const texture = useTexture('/sculpture-door.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;

  const ringRef = useRef<THREE.Group>(null);

  // Scaled down dimensions for mobile screens
  // Reference image aspect ratio: 297w x 535h = 0.555
  const doorHeight = 2.0;
  const doorWidth = Number((doorHeight * (297 / 535)).toFixed(3)); // ~1.11m
  const doorDepth = 0.04;

  // Center vertical placement: base near floor at y=0.12, center at y=1.12
  const centerY = doorHeight / 2 + 0.12;

  // Subtle interactive knocker ring swing when hovered
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
      {/* ── 1. Door Physical Backing Slab (Subtle Depth) ── */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[doorWidth + 0.02, doorHeight + 0.02, doorDepth]} />
        <meshStandardMaterial
          color={hovered ? '#4d463b' : '#3e372e'}
          roughness={0.75}
          metalness={0.15}
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

      {/* ── 3. Scaled 3D Antique Bronze Knocker Ring on Rosette ── */}
      {/* Center of rosette in texture: x = 0, y ≈ -0.06m from door center */}
      <group position={[0, -0.06, doorDepth / 2 + 0.006]}>
        {/* Rosette Rim */}
        <mesh position={[0, 0, 0.004]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.075, 0.08, 0.012, 24]} />
          <meshStandardMaterial
            color={hovered ? '#f0c78a' : '#c59556'}
            roughness={0.35}
            metalness={0.88}
          />
        </mesh>

        {/* Animated Pull Ring */}
        <group ref={ringRef} position={[0, 0.01, 0.014]}>
          <mesh position={[0, -0.045, 0]} raycast={() => null}>
            <torusGeometry args={[0.05, 0.011, 12, 24]} />
            <meshStandardMaterial
              color={hovered ? '#ffd899' : '#d4a263'}
              roughness={0.3}
              metalness={0.92}
            />
          </mesh>
        </group>
      </group>

      {/* ── 4. Subtle Warm Ambient Spotlight ── */}
      <pointLight
        position={[0, doorHeight * 0.25, 0.65]}
        intensity={hovered ? 12 : 6}
        distance={3.5}
        decay={2}
        color={hovered ? '#fff3d6' : '#ffe9c2'}
      />
    </group>
  );
}

useTexture.preload('/sculpture-door.jpg');

// Backwards compatibility alias
export const SculptureDoorLeaf = SculptureDoor;
