'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface PaintingDoorLeafProps {
  width: number;
  height: number;
  hovered: boolean;
}

const KURDISH_FONT = '/fonts/NotoSansArabic-Bold.ttf';

/**
 * ─────────────────────────────────────────────────────────────
 * PAINTING HALL ARTISTIC STUDIO DOOR
 * ─────────────────────────────────────────────────────────────
 * Modeled directly after the weathered dark oak atelier door concept:
 * - Rich dark oak wood body with colorful paint splatters (red, blue, yellow, green)
 * - Top carved wooden cartouche with Kurdish calligraphy: "بەشی وێنەکێشان"
 * - 4 embedded canvas paintings with raised 3D brass/gold frames (landscapes left, portraits right)
 * - Studio tools: 3D brushes, palette knives, and tilted empty hanging frames on side panels
 * - Antique bronze artist's palette handle with brushes and brass pull ring
 */
export function PaintingDoorLeaf({ width, height, hovered }: PaintingDoorLeafProps) {
  const [centerTexture, setCenterTexture] = useState<THREE.Texture | null>(null);
  const [fullTexture, setFullTexture] = useState<THREE.Texture | null>(null);
  const [signTexture, setSignTexture] = useState<THREE.Texture | null>(null);
  const [leftTexture, setLeftTexture] = useState<THREE.Texture | null>(null);
  const [rightTexture, setRightTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isCurrent = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load('/textures/painting-door-center.jpg', (tex) => {
      if (!isCurrent) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setCenterTexture(tex);
    });

    loader.load('/textures/painting-door-full.jpg', (tex) => {
      if (!isCurrent) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setFullTexture(tex);
    });

    loader.load('/textures/painting-door-sign.jpg', (tex) => {
      if (!isCurrent) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setSignTexture(tex);
    });

    loader.load('/textures/painting-door-left.jpg', (tex) => {
      if (!isCurrent) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setLeftTexture(tex);
    });

    loader.load('/textures/painting-door-right.jpg', (tex) => {
      if (!isCurrent) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setRightTexture(tex);
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  // Proportions
  const doorWidth = width;
  const doorHeight = height;

  // Oak Wood Material Colors
  const darkOakColor = hovered ? '#4d3725' : '#3d2b1c';
  const midOakColor = hovered ? '#614833' : '#4f3927';

  // Brass / Gold Frame Material
  const brassColor = hovered ? '#f5d77f' : '#d4af37';
  const brassRoughness = 0.32;
  const brassMetalness = 0.88;

  // Palette Handle Position (middle-right of the center door)
  const handleX = 0.22;
  const handleY = -0.04;

  return (
    <group position={[0, 0, 0.105]}>
      {/* ── 1. Outer Dark Oak Casing & Frame ── */}
      <mesh position={[0, 0, -0.015]} raycast={() => null}>
        <boxGeometry args={[doorWidth, doorHeight, 0.03]} />
        <meshStandardMaterial
          color={darkOakColor}
          roughness={0.78}
          metalness={0.15}
        />
      </mesh>

      {/* ── 2. Center Wooden Door Leaf ── */}
      <mesh position={[0, 0, 0]} raycast={() => null}>
        <boxGeometry args={[doorWidth - 0.06, doorHeight - 0.04, 0.02]} />
        <meshStandardMaterial
          color="#2e1f13"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* ── 3. Main Center Door Texture Plane (Studio Wood + Canvases) ── */}
      <mesh position={[0, -0.08, 0.012]} raycast={() => null}>
        <planeGeometry args={[doorWidth - 0.1, doorHeight - 0.28]} />
        <meshStandardMaterial
          map={centerTexture || fullTexture || undefined}
          color="#f4ebe1"
          roughness={0.75}
          metalness={0.12}
        />
      </mesh>

      {/* ── 4. 3D Raised Brass Molding Frames around the 4 Canvases ── */}
      {/* Upper-Left Landscape Canvas Frame */}
      <mesh position={[-0.16, 0.25, 0.022]} raycast={() => null}>
        <boxGeometry args={[0.34, 0.44, 0.015]} />
        <meshStandardMaterial
          color={brassColor}
          roughness={brassRoughness}
          metalness={brassMetalness}
        />
      </mesh>
      <mesh position={[-0.16, 0.25, 0.024]} raycast={() => null}>
        <planeGeometry args={[0.31, 0.41]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Upper-Right Portrait Canvas Frame */}
      <mesh position={[0.16, 0.25, 0.022]} raycast={() => null}>
        <boxGeometry args={[0.34, 0.44, 0.015]} />
        <meshStandardMaterial
          color={brassColor}
          roughness={brassRoughness}
          metalness={brassMetalness}
        />
      </mesh>

      {/* Lower-Left Landscape Canvas Frame */}
      <mesh position={[-0.16, -0.38, 0.022]} raycast={() => null}>
        <boxGeometry args={[0.34, 0.44, 0.015]} />
        <meshStandardMaterial
          color={brassColor}
          roughness={brassRoughness}
          metalness={brassMetalness}
        />
      </mesh>

      {/* Lower-Right Portrait Canvas Frame */}
      <mesh position={[0.16, -0.38, 0.022]} raycast={() => null}>
        <boxGeometry args={[0.34, 0.44, 0.015]} />
        <meshStandardMaterial
          color={brassColor}
          roughness={brassRoughness}
          metalness={brassMetalness}
        />
      </mesh>

      {/* ── 5. Top Shaped Wooden Signboard (Calligraphy Cartouche) ── */}
      <group position={[0, doorHeight / 2 - 0.2, 0.025]}>
        {/* Shaped Wooden Sign Base Slab */}
        <mesh position={[0, 0, 0]} raycast={() => null}>
          <boxGeometry args={[0.76, 0.28, 0.02]} />
          <meshStandardMaterial
            color={midOakColor}
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>

        {/* Stepped Beveled Border Rim */}
        <mesh position={[0, 0, 0.01]} raycast={() => null}>
          <boxGeometry args={[0.72, 0.24, 0.008]} />
          <meshStandardMaterial
            color="#342316"
            roughness={0.8}
            metalness={0.15}
          />
        </mesh>

        {/* Signboard Texture Overlay if available */}
        {signTexture && (
          <mesh position={[0, 0, 0.015]} raycast={() => null}>
            <planeGeometry args={[0.70, 0.22]} />
            <meshStandardMaterial
              map={signTexture}
              color="#e6dcce"
              roughness={0.75}
            />
          </mesh>
        )}

        {/* 3D Chiseled Kurdish Title: بەشی وێنەکێشان */}
        {/* Shadow Drop Layer for deep carved relief look */}
        <Text
          position={[0.003, 0.035, 0.022]}
          fontSize={0.088}
          font={KURDISH_FONT}
          color="#120c07"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          direction="rtl"
          maxWidth={0.68}
          raycast={() => null}
        >
          بەشی وێنەکێشان
        </Text>
        {/* Primary Carved Inscription (Golden-amber painted relief) */}
        <Text
          position={[0, 0.04, 0.025]}
          fontSize={0.088}
          font={KURDISH_FONT}
          color="#e0bc6a"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          direction="rtl"
          maxWidth={0.68}
          raycast={() => null}
        >
          بەشی وێنەکێشان
        </Text>

        {/* Subtext: Painting Hall */}
        <Text
          position={[0, -0.05, 0.025]}
          fontSize={0.042}
          color="#d2a856"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          letterSpacing={0.05}
          raycast={() => null}
        >
          Painting Hall
        </Text>
      </group>

      {/* ── 6. Antique Bronze Artist's Palette Handle ── */}
      {/* Positioned at the center-right of the door */}
      <group position={[handleX, handleY, 0.025]}>
        {/* Wooden Artist Palette Base Plate */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, -0.15]} raycast={() => null}>
          <boxGeometry args={[0.13, 0.17, 0.018]} />
          <meshStandardMaterial
            color="#5e442d"
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>

        {/* Palette Thumbhole (Deep dark cylinder cutout) */}
        <mesh position={[-0.02, -0.02, 0.008]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.02, 0.02, 0.022, 20]} />
          <meshBasicMaterial color="#1a120b" />
        </mesh>

        {/* Miniature Artist Brushes Sticking Through Palette */}
        {/* Brush 1 */}
        <mesh position={[-0.02, 0.04, 0.02]} rotation={[0, 0, 0.35]} raycast={() => null}>
          <cylinderGeometry args={[0.004, 0.004, 0.15, 12]} />
          <meshStandardMaterial color="#8a5329" roughness={0.5} />
        </mesh>
        {/* Brush 1 Ferrule & Tip */}
        <mesh position={[-0.045, 0.10, 0.02]} rotation={[0, 0, 0.35]} raycast={() => null}>
          <cylinderGeometry args={[0.005, 0.005, 0.025, 12]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Brush 2 */}
        <mesh position={[0.01, 0.05, 0.018]} rotation={[0, 0, -0.2]} raycast={() => null}>
          <cylinderGeometry args={[0.0035, 0.0035, 0.14, 12]} />
          <meshStandardMaterial color="#a06030" roughness={0.5} />
        </mesh>

        {/* Antique Bronze Ring Pull Knocker */}
        <group position={[0.03, -0.01, 0.018]}>
          {/* Ring Mount Stud */}
          <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
            <cylinderGeometry args={[0.018, 0.022, 0.02, 16]} />
            <meshStandardMaterial
              color={hovered ? '#e6be58' : '#9e7a4b'}
              roughness={0.38}
              metalness={0.88}
            />
          </mesh>
          {/* Hanging Knocker Ring */}
          <mesh position={[0, -0.03, 0.01]} raycast={() => null}>
            <torusGeometry args={[0.048, 0.009, 14, 28]} />
            <meshStandardMaterial
              color={hovered ? '#e6be58' : '#9e7a4b'}
              roughness={0.38}
              metalness={0.88}
            />
          </mesh>
        </group>
      </group>

      {/* ── 7. Left Flanking Studio Tools & Hanging Frames ── */}
      <group position={[-doorWidth / 2 + 0.12, 0, 0.02]}>
        {/* Texture map for left tools panel */}
        {leftTexture && (
          <mesh position={[0, 0, 0]} raycast={() => null}>
            <planeGeometry args={[0.22, doorHeight - 0.3]} />
            <meshStandardMaterial
              map={leftTexture}
              color="#ede3d5"
              roughness={0.8}
            />
          </mesh>
        )}

        {/* 3D Empty Picture Frame 1 (Hanging at artistic angle) */}
        <group position={[-0.02, 0.05, 0.018]} rotation={[0, 0, 0.18]}>
          <mesh raycast={() => null}>
            <boxGeometry args={[0.18, 0.22, 0.012]} />
            <meshStandardMaterial color="#a07a48" roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.005]} raycast={() => null}>
            <planeGeometry args={[0.14, 0.18]} />
            <meshBasicMaterial color="#22160d" />
          </mesh>
        </group>

        {/* 3D Empty Picture Frame 2 (Hanging below, tilted) */}
        <group position={[-0.03, -0.22, 0.016]} rotation={[0, 0, -0.12]}>
          <mesh raycast={() => null}>
            <boxGeometry args={[0.16, 0.24, 0.012]} />
            <meshStandardMaterial color="#5c442c" roughness={0.7} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.005]} raycast={() => null}>
            <planeGeometry args={[0.12, 0.20]} />
            <meshBasicMaterial color="#1a110a" />
          </mesh>
        </group>

        {/* Top Peg Rack with Paintbrushes */}
        <mesh position={[0, 0.35, 0.012]} raycast={() => null}>
          <boxGeometry args={[0.16, 0.03, 0.02]} />
          <meshStandardMaterial color="#4a3522" roughness={0.7} />
        </mesh>
        {/* Brush 1 */}
        <mesh position={[-0.04, 0.42, 0.018]} rotation={[0, 0, -0.08]} raycast={() => null}>
          <cylinderGeometry args={[0.004, 0.004, 0.16, 12]} />
          <meshStandardMaterial color="#8a4d25" roughness={0.5} />
        </mesh>
        {/* Brush 2 */}
        <mesh position={[0, 0.44, 0.018]} raycast={() => null}>
          <cylinderGeometry args={[0.005, 0.005, 0.18, 12]} />
          <meshStandardMaterial color="#9c582c" roughness={0.5} />
        </mesh>
        {/* Brush 3 */}
        <mesh position={[0.04, 0.41, 0.018]} rotation={[0, 0, 0.08]} raycast={() => null}>
          <cylinderGeometry args={[0.004, 0.004, 0.15, 12]} />
          <meshStandardMaterial color="#7a421e" roughness={0.5} />
        </mesh>
      </group>

      {/* ── 8. Right Flanking Studio Tools & Hanging Frames ── */}
      <group position={[doorWidth / 2 - 0.12, 0, 0.02]}>
        {/* Texture map for right tools panel */}
        {rightTexture && (
          <mesh position={[0, 0, 0]} raycast={() => null}>
            <planeGeometry args={[0.22, doorHeight - 0.3]} />
            <meshStandardMaterial
              map={rightTexture}
              color="#ede3d5"
              roughness={0.8}
            />
          </mesh>
        )}

        {/* 3D Empty Angled Picture Frame */}
        <group position={[0.02, 0.32, 0.018]} rotation={[0, 0, -0.2]}>
          <mesh raycast={() => null}>
            <boxGeometry args={[0.18, 0.20, 0.012]} />
            <meshStandardMaterial color="#b38a54" roughness={0.5} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.005]} raycast={() => null}>
            <planeGeometry args={[0.14, 0.16]} />
            <meshBasicMaterial color="#20150d" />
          </mesh>
        </group>

        {/* Middle Peg Rack with Palette Knife & Flat Brush */}
        <mesh position={[0, -0.05, 0.012]} raycast={() => null}>
          <boxGeometry args={[0.16, 0.03, 0.02]} />
          <meshStandardMaterial color="#4a3522" roughness={0.7} />
        </mesh>
        {/* Flat Brush */}
        <group position={[-0.03, -0.12, 0.018]}>
          <mesh position={[0, -0.04, 0]} raycast={() => null}>
            <boxGeometry args={[0.035, 0.10, 0.008]} />
            <meshStandardMaterial color="#a06030" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.03, 0]} raycast={() => null}>
            <boxGeometry args={[0.038, 0.04, 0.01]} />
            <meshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
        {/* Palette Knife (Diamond metal blade) */}
        <group position={[0.04, -0.15, 0.018]}>
          <mesh position={[0, -0.06, 0]} raycast={() => null}>
            <cylinderGeometry args={[0.005, 0.005, 0.10, 10]} />
            <meshStandardMaterial color="#6a3015" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.03, 0]} rotation={[0, 0, 0.1]} raycast={() => null}>
            <boxGeometry args={[0.018, 0.07, 0.003]} />
            <meshStandardMaterial color="#e0e0e0" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* ── 9. Colorful Paint Splatters & Brushstroke Drops ── */}
      {/* Red, blue, yellow, green, white drips placed along the wooden casing */}
      <group position={[0, 0, 0.024]}>
        {/* Red Splatters */}
        <mesh position={[-doorWidth * 0.38, 0.28, 0]} raycast={() => null}>
          <circleGeometry args={[0.018, 8]} />
          <meshStandardMaterial color="#c92a2a" roughness={0.3} />
        </mesh>
        <mesh position={[-doorWidth * 0.36, 0.22, 0]} raycast={() => null}>
          <circleGeometry args={[0.012, 8]} />
          <meshStandardMaterial color="#e03131" roughness={0.3} />
        </mesh>
        <mesh position={[doorWidth * 0.37, -0.32, 0]} raycast={() => null}>
          <circleGeometry args={[0.015, 8]} />
          <meshStandardMaterial color="#c92a2a" roughness={0.3} />
        </mesh>

        {/* Ultramarine Blue Splatters */}
        <mesh position={[-doorWidth * 0.35, -0.15, 0]} raycast={() => null}>
          <circleGeometry args={[0.022, 8]} />
          <meshStandardMaterial color="#1971c2" roughness={0.3} />
        </mesh>
        <mesh position={[-doorWidth * 0.37, -0.21, 0]} raycast={() => null}>
          <circleGeometry args={[0.014, 8]} />
          <meshStandardMaterial color="#1c7ed6" roughness={0.3} />
        </mesh>
        <mesh position={[doorWidth * 0.38, 0.15, 0]} raycast={() => null}>
          <circleGeometry args={[0.02, 8]} />
          <meshStandardMaterial color="#1971c2" roughness={0.3} />
        </mesh>

        {/* Cadmium Yellow Splatters */}
        <mesh position={[-doorWidth * 0.39, 0.08, 0]} raycast={() => null}>
          <circleGeometry args={[0.024, 8]} />
          <meshStandardMaterial color="#fcc419" roughness={0.3} />
        </mesh>
        <mesh position={[doorWidth * 0.35, -0.22, 0]} raycast={() => null}>
          <circleGeometry args={[0.018, 8]} />
          <meshStandardMaterial color="#fab005" roughness={0.3} />
        </mesh>

        {/* Viridian Green Splatters */}
        <mesh position={[-doorWidth * 0.37, -0.38, 0]} raycast={() => null}>
          <circleGeometry args={[0.019, 8]} />
          <meshStandardMaterial color="#2f9e44" roughness={0.3} />
        </mesh>
        <mesh position={[doorWidth * 0.39, 0.02, 0]} raycast={() => null}>
          <circleGeometry args={[0.022, 8]} />
          <meshStandardMaterial color="#37b24d" roughness={0.3} />
        </mesh>

        {/* Titanium White Splatters */}
        <mesh position={[-doorWidth * 0.36, 0.42, 0]} raycast={() => null}>
          <circleGeometry args={[0.015, 8]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.3} />
        </mesh>
        <mesh position={[doorWidth * 0.36, 0.38, 0]} raycast={() => null}>
          <circleGeometry args={[0.017, 8]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.3} />
        </mesh>
      </group>

      {/* ── 10. Warm Studio Grazing Spotlight ── */}
      <pointLight
        position={[0, doorHeight / 2 + 0.3, 0.65]}
        intensity={hovered ? 20 : 12}
        distance={4.8}
        decay={2}
        color={hovered ? '#fff3d6' : '#ffe9c2'}
      />
    </group>
  );
}

/**
 * Weathered Studio Oak Archway Lunette Fanlight above the Painting Door.
 */
export function PaintingDoorLunette({ radius }: { radius: number }) {
  return (
    <group position={[0, 0, 0.1]}>
      {/* Semicircle Oak Studio Transom */}
      <mesh rotation={[0, 0, 0]} raycast={() => null}>
        <cylinderGeometry
          args={[radius - 0.02, radius - 0.02, 0.025, 24, 1, false, 0, Math.PI]}
        />
        <meshStandardMaterial
          color="#382618"
          roughness={0.8}
          metalness={0.15}
        />
      </mesh>
      {/* Golden Fillet Arch Trim */}
      <mesh position={[0, 0.01, 0.015]} raycast={() => null}>
        <ringGeometry args={[radius * 0.5, radius * 0.94, 20, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#d4af37" roughness={0.35} metalness={0.85} />
      </mesh>
      {/* Radial Paint Splatters in Arch */}
      <mesh position={[-0.15, 0.22, 0.018]} raycast={() => null}>
        <circleGeometry args={[0.022, 8]} />
        <meshStandardMaterial color="#e03131" roughness={0.3} />
      </mesh>
      <mesh position={[0.14, 0.25, 0.018]} raycast={() => null}>
        <circleGeometry args={[0.025, 8]} />
        <meshStandardMaterial color="#1971c2" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.32, 0.018]} raycast={() => null}>
        <circleGeometry args={[0.02, 8]} />
        <meshStandardMaterial color="#fcc419" roughness={0.3} />
      </mesh>
    </group>
  );
}
