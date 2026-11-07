'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Move, Compass } from 'lucide-react';

interface JoystickProps {
  side: 'left' | 'right';
  label: string;
  subLabel: string;
  icon: React.ReactNode;
  onChange: (vector: { x: number; y: number }) => void;
}

const MAX_TRAVEL = 34; // Maximum travel radius in pixels
const DEADZONE = 4;    // Pixel deadzone to prevent drift

function SingleVirtualThumbstick({
  side,
  label,
  subLabel,
  icon,
  onChange,
}: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only capture one pointer per thumbstick
    if (activePointerIdRef.current !== null) return;
    activePointerIdRef.current = e.pointerId;
    setIsActive(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    if (baseRef.current) {
      const rect = baseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist < DEADZONE) {
        setKnobPos({ x: 0, y: 0 });
        onChange({ x: 0, y: 0 });
      } else {
        const clampedDist = Math.min(dist, MAX_TRAVEL);
        const angle = Math.atan2(dy, dx);
        const kx = Math.cos(angle) * clampedDist;
        const ky = Math.sin(angle) * clampedDist;
        setKnobPos({ x: kx, y: ky });
        onChange({
          x: Number((kx / MAX_TRAVEL).toFixed(3)),
          y: Number((-ky / MAX_TRAVEL).toFixed(3)),
        });
      }
    }
  }, [onChange]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId || !baseRef.current) return;

    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist < DEADZONE) {
      setKnobPos({ x: 0, y: 0 });
      onChange({ x: 0, y: 0 });
      return;
    }

    const clampedDist = Math.min(dist, MAX_TRAVEL);
    const angle = Math.atan2(dy, dx);
    const kx = Math.cos(angle) * clampedDist;
    const ky = Math.sin(angle) * clampedDist;

    setKnobPos({ x: kx, y: ky });
    onChange({
      x: Number((kx / MAX_TRAVEL).toFixed(3)),
      y: Number((-ky / MAX_TRAVEL).toFixed(3)),
    });
  }, [onChange]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    activePointerIdRef.current = null;
    setIsActive(false);
    setKnobPos({ x: 0, y: 0 });
    onChange({ x: 0, y: 0 });

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  }, [onChange]);

  return (
    <div className="flex flex-col items-center select-none touch-none pointer-events-auto">
      {/* Outer Thumbstick Base Ring */}
      <div
        ref={baseRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-28 h-28 rounded-full border flex items-center justify-center transition-opacity duration-200 cursor-grab active:cursor-grabbing backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${
          isActive
            ? 'opacity-65 border-gold/70 bg-black/40 ring-2 ring-gold/30 shadow-gold-glow-sm'
            : 'opacity-30 hover:opacity-50 border-gold/30 bg-black/25'
        }`}
        style={{ touchAction: 'none' }}
      >
        {/* Subtle Crosshair Ticks at 4 quadrants */}
        <span className="absolute top-1.5 inset-x-1/2 -translate-x-1/2 w-0.5 h-2 bg-gold/40 rounded-full pointer-events-none" />
        <span className="absolute bottom-1.5 inset-x-1/2 -translate-x-1/2 w-0.5 h-2 bg-gold/40 rounded-full pointer-events-none" />
        <span className="absolute start-1.5 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-gold/40 rounded-full pointer-events-none" />
        <span className="absolute end-1.5 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-gold/40 rounded-full pointer-events-none" />

        {/* Center Deadzone Circle */}
        <div className="w-8 h-8 rounded-full border border-white/10 pointer-events-none" />

        {/* Dynamic Floating Knob / Nipple */}
        <div
          className={`absolute w-12 h-12 rounded-full border flex items-center justify-center shadow-lg transition-transform pointer-events-none ${
            isActive
              ? 'bg-gradient-to-br from-gold/50 via-gold/30 to-amber-700/40 border-gold text-gold shadow-gold-glow-sm scale-105'
              : 'bg-gradient-to-br from-white/15 via-black/40 to-black/60 border-gold/50 text-gold/80'
          }`}
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: isActive ? 'none' : 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {icon}
        </div>
      </div>

      {/* Subtitle / Functional Label */}
      <span className="text-[9px] font-mono text-gold/45 uppercase tracking-widest text-center mt-1.5 select-none pointer-events-none">
        {label} • {subLabel}
      </span>
    </div>
  );
}

export interface DualVirtualJoysticksProps {
  onMoveChange: (vector: { x: number; y: number }) => void;
  onLookChange: (vector: { x: number; y: number }) => void;
  locale?: 'ckb' | 'ar' | 'en';
}

export function DualVirtualJoysticks({
  onMoveChange,
  onLookChange,
  locale = 'ckb',
}: DualVirtualJoysticksProps) {
  return (
    <div
      dir="ltr"
      className="fixed inset-x-0 bottom-4 sm:bottom-6 px-4 sm:px-8 z-40 flex items-end justify-between pointer-events-none select-none touch-none"
    >
      {/* ── Left Joystick: Movement / Walking / Translation ── */}
      <div className="pointer-events-auto">
        <SingleVirtualThumbstick
          side="left"
          label="MOVE"
          subLabel={locale === 'ckb' ? 'جوڵە' : locale === 'ar' ? 'تحريك' : 'WALK'}
          icon={<Move className="w-4 h-4" />}
          onChange={onMoveChange}
        />
      </div>

      {/* ── Right Joystick: Camera Look / Panning / Rotation ── */}
      <div className="pointer-events-auto">
        <SingleVirtualThumbstick
          side="right"
          label="LOOK"
          subLabel={locale === 'ckb' ? 'ڕوانین' : locale === 'ar' ? 'رؤية' : 'VIEW'}
          icon={<Compass className="w-4 h-4" />}
          onChange={onLookChange}
        />
      </div>
    </div>
  );
}
