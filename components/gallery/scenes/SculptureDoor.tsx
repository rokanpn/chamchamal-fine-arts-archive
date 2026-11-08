'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface SculptureDoorLeafProps {
  width: number;
  height: number;
  hovered: boolean;
}

const KURDISH_FONT = '/fonts/NotoSansArabic-Bold.ttf';

/**
 * ─────────────────────────────────────────────────────────────
 * SCULPTURE HALL CARVED STONE & MARBLE DOOR
 * ─────────────────────────────────────────────────────────────
 * Modeled directly after the antique carved stone & weathered marble
 * portal concept for the Chamchamal Fine Arts Institute:
 * - Weathered aged bronze door casing & structural frame
 * - Top carved stone cartouche with Kurdish calligraphy: "بەشی پەیکەرسازی"
 * - Four framed relief panels depicting classical sculptors & drapery figures
 * - Antique bronze rosette escutcheon with heavy ring knocker & keyhole
 */
export function SculptureDoorLeaf({ width, height, hovered }: SculptureDoorLeafProps) {
  const [fullTexture, setFullTexture] = useState<THREE.Texture | null>(null);
  const [reliefTexture, setReliefTexture] = useState<THREE.Texture | null>(null);
  const [cartoucheTexture, setCartoucheTexture] = useState<THREE.Texture | null>(null);

  const ringRef = useRef<THREE.Group>(null);

  useEffect(() => {
    let isCurrent = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    // Load cropped high-res textures
    loader.load('/textures/sculpture-door.jpg', (tex) => {
      if (!isCurrent) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setFullTexture(tex);
    });

    loader.load('/textures/sculpture-door-reliefs.jpg', (tex) => {
      if (!isCurrent) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setReliefTexture(tex);
    });

    loader.load('/textures/sculpture-door-cartouche.jpg', (tex) => {
      if (!isCurrent) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setCartoucheTexture(tex);
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  // Proportions inside the portal
  const frameWidth = width;
  const frameHeight = height;
  const panelWidth = width - 0.08;
  const panelHeight = height - 0.06;

  // Cartouche (top) vs Reliefs (bottom) layout
  const cartoucheH = 0.38;
  const transomRailH = 0.035;
  const reliefsH = panelHeight - cartoucheH - transomRailH - 0.04;

  const cartoucheY = panelHeight / 2 - cartoucheH / 2 - 0.02;
  const transomRailY = cartoucheY - cartoucheH / 2 - transomRailH / 2;
  const reliefsY = transomRailY - transomRailH / 2 - reliefsH / 2 - 0.01;

  // Antique Bronze Material Parameters
  const bronzeColor = hovered ? '#a67d53' : '#8a643d';
  const bronzeRoughness = 0.38;
  const bronzeMetalness = 0.88;

  // Weathered Stone Material Parameters
  const stoneColor = hovered ? '#f3ede4' : '#e6dfd3';
  const stoneRoughness = 0.82;
  const stoneMetalness = 0.12;

  return (
    <group position={[0, 0, 0.105]}>
      {/* ── 1. Outer Aged Bronze Door Casing (Beveled Rim) ── */}
      <mesh position={[0, 0, -0.015]} raycast={() => null}>
        <boxGeometry args={[frameWidth, frameHeight, 0.03]} />
        <meshStandardMaterial
          color={hovered ? '#4e3f2e' : '#3d3123'}
          roughness={0.65}
          metalness={0.5}
        />
      </mesh>

      {/* ── 2. Inner Recessed Door Field ── */}
      <mesh position={[0, 0, 0]} raycast={() => null}>
        <boxGeometry args={[panelWidth, panelHeight, 0.02]} />
        <meshStandardMaterial
          color="#231c15"
          roughness={0.9}
          metalness={0.2}
        />
      </mesh>

      {/* ── 3. Full Door Texture Base Layer (Fall-through Coverage) ── */}
      {fullTexture && (
        <mesh position={[0, 0, 0.012]} raycast={() => null}>
          <planeGeometry args={[panelWidth, panelHeight]} />
          <meshStandardMaterial
            map={fullTexture}
            roughness={stoneRoughness}
            metalness={stoneMetalness}
            color={stoneColor}
          />
        </mesh>
      )}

      {/* ── 4. Transom Divider Bar (Weathered Bronze Lintel) ── */}
      <mesh position={[0, transomRailY, 0.022]} raycast={() => null}>
        <boxGeometry args={[panelWidth - 0.02, transomRailH, 0.025]} />
        <meshStandardMaterial
          color={bronzeColor}
          roughness={0.45}
          metalness={0.8}
        />
      </mesh>

      {/* ── 5. Top Carved Stone Cartouche (Kurdish Calligraphy Header) ── */}
      <group position={[0, cartoucheY, 0.018]}>
        {/* Scalloped Stone Cartouche Backing Slab */}
        <mesh position={[0, 0, 0]} raycast={() => null}>
          <planeGeometry args={[panelWidth - 0.04, cartoucheH]} />
          <meshStandardMaterial
            map={cartoucheTexture || undefined}
            color={stoneColor}
            roughness={0.78}
            metalness={0.15}
          />
        </mesh>

        {/* Bronze Fillet Trim for Cartouche */}
        <mesh position={[0, 0, 0.005]} raycast={() => null}>
          <boxGeometry args={[panelWidth - 0.03, cartoucheH + 0.01, 0.008]} />
          <meshStandardMaterial
            color={bronzeColor}
            roughness={0.45}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>

        {/* Chiseled Kurdish Title: بەشی پەیکەرسازی */}
        {/* Shadow Drop layer for authentic deep carved look */}
        <Text
          position={[0.003, 0.045, 0.012]}
          fontSize={0.098}
          font={KURDISH_FONT}
          color="#1e1812"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          direction="rtl"
          maxWidth={panelWidth - 0.1}
          raycast={() => null}
        >
          بەشی پەیکەرسازی
        </Text>
        {/* Primary Carved Inscription */}
        <Text
          position={[0, 0.05, 0.015]}
          fontSize={0.098}
          font={KURDISH_FONT}
          color="#382e22"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          direction="rtl"
          maxWidth={panelWidth - 0.1}
          raycast={() => null}
        >
          بەشی پەیکەرسازی
        </Text>

        {/* Chiseled Latin Subtitle: Sculpture Hall */}
        <Text
          position={[0, -0.07, 0.015]}
          fontSize={0.048}
          color="#4e4030"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          letterSpacing={0.05}
          raycast={() => null}
        >
          Sculpture Hall
        </Text>
      </group>

      {/* ── 6. Lower Four Framed Relief Quadrants ── */}
      <group position={[0, reliefsY, 0.018]}>
        {/* Main High-Resolution Relief Texture Plane */}
        <mesh position={[0, 0, 0]} raycast={() => null}>
          <planeGeometry args={[panelWidth - 0.04, reliefsH]} />
          <meshStandardMaterial
            map={reliefTexture || fullTexture || undefined}
            roughness={stoneRoughness}
            metalness={stoneMetalness}
            color={stoneColor}
          />
        </mesh>

        {/* Outer Stone Molding Frame Around the 4 Reliefs */}
        <mesh position={[0, 0, 0.008]} raycast={() => null}>
          <boxGeometry args={[panelWidth - 0.03, reliefsH + 0.01, 0.012]} />
          <meshStandardMaterial
            color={bronzeColor}
            roughness={0.5}
            metalness={0.75}
          />
        </mesh>

        {/* Center Vertical Stone Mullion Divider */}
        <mesh position={[0, 0, 0.014]} raycast={() => null}>
          <boxGeometry args={[0.042, reliefsH, 0.016]} />
          <meshStandardMaterial
            color={stoneColor}
            roughness={0.8}
            metalness={0.15}
          />
        </mesh>

        {/* Center Horizontal Stone Mullion Divider */}
        <mesh position={[0, 0, 0.014]} raycast={() => null}>
          <boxGeometry args={[panelWidth - 0.04, 0.042, 0.016]} />
          <meshStandardMaterial
            color={stoneColor}
            roughness={0.8}
            metalness={0.15}
          />
        </mesh>

        {/* ── 7. Antique Bronze Rosette Escutcheon & Ring Handle ── */}
        {/* Positioned at the central intersection, slightly offset to the right */}
        <group ref={ringRef} position={[0.045, 0, 0.022]}>
          {/* Stepped Circular Escutcheon Backplate */}
          <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
            <cylinderGeometry args={[0.13, 0.145, 0.022, 36]} />
            <meshStandardMaterial
              color={bronzeColor}
              roughness={bronzeRoughness}
              metalness={bronzeMetalness}
            />
          </mesh>

          {/* Raised Beaded Concentric Ornament Ring */}
          <mesh position={[0, 0, 0.014]} raycast={() => null}>
            <torusGeometry args={[0.098, 0.012, 14, 36]} />
            <meshStandardMaterial
              color={hovered ? '#d4af37' : bronzeColor}
              roughness={0.3}
              metalness={0.92}
            />
          </mesh>

          {/* Recessed Darkened Bronze Center Medallion */}
          <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
            <cylinderGeometry args={[0.075, 0.075, 0.012, 24]} />
            <meshStandardMaterial
              color="#2a1e12"
              roughness={0.7}
              metalness={0.6}
            />
          </mesh>

          {/* Heavy Bronze Ring Knocker Handle */}
          <group position={[0, -0.015, 0.025]}>
            <mesh raycast={() => null}>
              <torusGeometry args={[0.078, 0.015, 16, 36]} />
              <meshStandardMaterial
                color={hovered ? '#e6be58' : bronzeColor}
                roughness={0.28}
                metalness={0.95}
              />
            </mesh>
            {/* Hanging Ring Shadow */}
            <mesh position={[0, 0, -0.015]} raycast={() => null}>
              <torusGeometry args={[0.078, 0.012, 8, 24]} />
              <meshBasicMaterial color="#110d08" transparent opacity={0.4} />
            </mesh>
          </group>

          {/* Top Pivot Bracket Stud */}
          <mesh position={[0, 0.065, 0.02]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
            <cylinderGeometry args={[0.022, 0.026, 0.028, 16]} />
            <meshStandardMaterial
              color={hovered ? '#d4af37' : bronzeColor}
              roughness={0.3}
              metalness={0.92}
            />
          </mesh>

          {/* Antique Keyhole Escutcheon Plate (Directly to the right of ring) */}
          <group position={[0.22, 0, 0.005]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
              <cylinderGeometry args={[0.028, 0.032, 0.016, 20]} />
              <meshStandardMaterial
                color={bronzeColor}
                roughness={0.35}
                metalness={0.9}
              />
            </mesh>
            {/* Keyhole Slot */}
            <mesh position={[0, 0, 0.009]} raycast={() => null}>
              <boxGeometry args={[0.006, 0.022, 0.01]} />
              <meshBasicMaterial color="#0b0805" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── 8. Warm Bronze/Stone Grazing Spotlight ── */}
      <pointLight
        position={[0, height / 2 + 0.3, 0.6]}
        intensity={hovered ? 18 : 10}
        distance={4.8}
        decay={2}
        color={hovered ? '#ffe8c2' : '#f5dfbe'}
      />
    </group>
  );
}

/**
 * Weathered Roman Semicircular Tympanum/Lunette above the door.
 */
export function SculptureDoorLunette({ radius }: { radius: number }) {
  return (
    <group position={[0, 0, 0.1]}>
      {/* Weathered Stone Fanlight Semicircle */}
      <mesh rotation={[0, 0, 0]} raycast={() => null}>
        <cylinderGeometry
          args={[radius - 0.02, radius - 0.02, 0.025, 24, 1, false, 0, Math.PI]}
        />
        <meshStandardMaterial
          color="#352c20"
          roughness={0.85}
          metalness={0.25}
        />
      </mesh>
      {/* Inner Ornamental Fan Spokes */}
      <mesh position={[0, 0.01, 0.015]} raycast={() => null}>
        <ringGeometry args={[radius * 0.45, radius * 0.92, 16, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#8a643d" roughness={0.4} metalness={0.8} />
      </mesh>
    </group>
  );
}
