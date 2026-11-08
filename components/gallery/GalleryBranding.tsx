'use client';

import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { withCacheBust } from '@/lib/cacheBust';

const KURDISH_FONT_BOLD = withCacheBust('/fonts/NotoSansArabic-Bold.ttf');
const KURDISH_FONT_REGULAR = withCacheBust('/fonts/NotoSansArabic-Regular.ttf');

/**
 * ─────────────────────────────────────────────────────────────
 * 1. END OF THE HALL (OFFICIAL INSTITUTE LOGO)
 * ─────────────────────────────────────────────────────────────
 * Replaces the legacy "END OF EXHIBITION HALL" yellow circle.
 * Displays the official emblem of Chamchamal Fine Arts Institute,
 * maintaining its authentic aspect ratio on an architectural museum plaque.
 */
export function InstituteEndWallLogo() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1.0);

  useEffect(() => {
    let isCurrent = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    // Priority candidates for logo image in public directory
    const candidates = [
      withCacheBust('/logo.png'),
      withCacheBust('/logo-light.png'),
      withCacheBust('/logo-transparent.png'),
      withCacheBust('/logo-dark.png'),
      withCacheBust('/logo-light.jpg'),
    ];

    const tryLoad = (idx: number) => {
      if (idx >= candidates.length || !isCurrent) return;
      loader.load(
        candidates[idx],
        (tex) => {
          if (!isCurrent) return;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.needsUpdate = true;
          if (tex.image && tex.image.width && tex.image.height) {
            setAspectRatio(tex.image.width / tex.image.height);
          }
          setTexture(tex);
        },
        undefined,
        () => {
          if (isCurrent) tryLoad(idx + 1);
        }
      );
    };

    tryLoad(0);
    return () => {
      isCurrent = false;
    };
  }, []);

  const logoH = 2.0;
  const logoW = Number((logoH * aspectRatio).toFixed(3));
  const plaqueW = Math.max(logoW + 0.6, 2.8);
  const plaqueH = logoH + 0.95;

  return (
    <group position={[0, 0.35, 0.04]}>
      {/* Museum Base Mounting Backplate */}
      <mesh position={[0, 0, -0.03]} raycast={() => null}>
        <planeGeometry args={[plaqueW, plaqueH]} />
        <meshStandardMaterial color="#14131a" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Gold Trim Border Fillet */}
      <mesh position={[0, 0, -0.02]} raycast={() => null}>
        <planeGeometry args={[plaqueW - 0.06, plaqueH - 0.06]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>

      {/* Dark Obsidian Inset Canvas */}
      <mesh position={[0, 0, -0.01]} raycast={() => null}>
        <planeGeometry args={[plaqueW - 0.12, plaqueH - 0.12]} />
        <meshStandardMaterial color="#0c0b10" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Dedicated Gallery Luminaire Spotlight over the Logo */}
      <pointLight position={[0, logoH / 2 + 0.8, 0.8]} intensity={20} distance={7} decay={2} color="#fff1d0" />

      {/* Official Institute Logo Mesh (Preserving Aspect Ratio) */}
      {texture ? (
        <mesh position={[0, 0.22, 0.02]}>
          <planeGeometry args={[logoW, logoH]} />
          <meshBasicMaterial map={texture} transparent alphaTest={0.02} toneMapped={false} />
        </mesh>
      ) : (
        /* Fallback Golden Geometric Monogram while texture initializes */
        <group position={[0, 0.22, 0.02]}>
          <mesh>
            <circleGeometry args={[0.9, 48]} />
            <meshStandardMaterial color="#18171f" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <ringGeometry args={[0.84, 0.89, 48]} />
            <meshBasicMaterial color="#D4AF37" />
          </mesh>
        </group>
      )}

      {/* Gold Divider Line under Logo */}
      <mesh position={[0, -logoH / 2 + 0.08, 0.015]} raycast={() => null}>
        <planeGeometry args={[Math.min(plaqueW - 0.6, 2.2), 0.015]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>

      {/* Kurdish Title Under Logo */}
      <Text
        position={[0, -logoH / 2 - 0.08, 0.03]}
        fontSize={0.115}
        font={KURDISH_FONT_BOLD}
        color="#D4AF37"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        direction="rtl"
        maxWidth={plaqueW - 0.2}
      >
        پەیمانگەی هونەرە جوانەکانی چەمچەماڵ
      </Text>

      {/* Architectural Latin Sub-inscription */}
      <Text
        position={[0, -logoH / 2 - 0.24, 0.03]}
        fontSize={0.065}
        color="#A89E88"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        letterSpacing={0.05}
      >
        CHAMCHAMAL FINE ARTS INSTITUTE • DIGITAL ARCHIVE
      </Text>
    </group>
  );
}

/**
 * ─────────────────────────────────────────────────────────────
 * 2. START OF THE HALL (ARTISTIC KURDISH WELCOME PANEL)
 * ─────────────────────────────────────────────────────────────
 * Replaces the legacy "CHAMCHAMAL FINE ARTS ARCHIVE - VIRTUAL 3D GRAND GALLERY".
 * Prominently presents the official Kurdish welcome message with refined
 * golden typography and authentic institutional attribution.
 */
export function GalleryWelcomeSign() {
  return (
    <group position={[0, 0.05, 0.03]}>
      {/* Outer Monumental Base Plaque */}
      <mesh raycast={() => null}>
        <planeGeometry args={[4.4, 2.3]} />
        <meshStandardMaterial color="#14131a" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Golden Fillet Accent Border */}
      <mesh position={[0, 0, 0.005]} raycast={() => null}>
        <planeGeometry args={[4.32, 2.22]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>

      {/* Deep Obsidian Inner Panel */}
      <mesh position={[0, 0, 0.01]} raycast={() => null}>
        <planeGeometry args={[4.24, 2.14]} />
        <meshStandardMaterial color="#0b0a0f" roughness={0.75} metalness={0.25} />
      </mesh>

      {/* Architectural Museum Downlight */}
      <pointLight position={[0, 1.3, 0.8]} intensity={20} distance={7} decay={2} color="#fff2d8" />

      {/* Top Header: Institute Name */}
      <Text
        position={[0, 0.68, 0.03]}
        fontSize={0.125}
        font={KURDISH_FONT_BOLD}
        color="#D4AF37"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        direction="rtl"
        letterSpacing={0.02}
      >
        پەیمانگەی هونەرە جوانەکانی چەمچەماڵ
      </Text>

      {/* Fine Golden Divider */}
      <mesh position={[0, 0.48, 0.02]} raycast={() => null}>
        <planeGeometry args={[2.8, 0.016]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>

      {/* Main Welcome Title */}
      <Text
        position={[0, 0.22, 0.03]}
        fontSize={0.22}
        font={KURDISH_FONT_BOLD}
        color="#FFF6E0"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        direction="rtl"
        maxWidth={3.9}
        lineHeight={1.4}
      >
        بەخێربێن بۆ پێشانگای دیجیتاڵی
      </Text>

      {/* Descriptive Kurdish Subtitle */}
      <Text
        position={[0, -0.18, 0.03]}
        fontSize={0.11}
        font={KURDISH_FONT_REGULAR}
        color="#D8C7A3"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        direction="rtl"
        maxWidth={3.7}
        lineHeight={1.5}
      >
        سەرجەم ئەم بەرهەمانە شاکاری خوێندکاران و مامۆستایانی پەیمانگەی هونەرە جوانەکانی چەمچەماڵن
      </Text>

      {/* Subtle Latin Inscription */}
      <Text
        position={[0, -0.66, 0.03]}
        fontSize={0.072}
        color="#8E8573"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        letterSpacing={0.07}
      >
        CHAMCHAMAL FINE ARTS ARCHIVE • VIRTUAL 3D GRAND GALLERY
      </Text>
    </group>
  );
}

/**
 * ─────────────────────────────────────────────────────────────
 * 3. OVERHEAD ENTRANCE PORTAL ARCH
 * ─────────────────────────────────────────────────────────────
 * Spans above the doorway at Z = -1.2 so visitors stepping into
 * the gallery immediately see the official welcoming archway.
 */
export function GalleryWelcomeOverheadArch() {
  return (
    <group position={[0, 3.25, -1.2]}>
      {/* Arch Box Beam */}
      <mesh position={[0, 0, 0]} raycast={() => null}>
        <boxGeometry args={[4.8, 0.42, 0.08]} />
        <meshStandardMaterial color="#14131a" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Golden Inset Trim */}
      <mesh position={[0, 0, 0.042]} raycast={() => null}>
        <boxGeometry args={[4.72, 0.34, 0.01]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.25} metalness={0.85} />
      </mesh>
      {/* Warm Golden Glow Spotlight */}
      <pointLight position={[0, -0.35, 0.45]} intensity={14} distance={5.5} decay={2} color="#fff2d6" />
      {/* Kurdish Inscription */}
      <Text
        position={[0, 0.01, 0.05]}
        fontSize={0.135}
        font={KURDISH_FONT_BOLD}
        color="#0A0A0C"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        direction="rtl"
      >
        بەخێربێن بۆ پێشانگای دیجیتاڵی پەیمانگەی هونەرە جوانەکانی چەمچەماڵ
      </Text>
    </group>
  );
}
