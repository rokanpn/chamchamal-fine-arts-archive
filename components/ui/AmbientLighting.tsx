import React from 'react';

export function AmbientLighting() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Primary Curatorial Overhead Spotlight (Warm Gold/Amber) */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[500px] rounded-full bg-gold/10 blur-[130px] animate-ambient-pulse" />

      {/* Secondary Bottom Diffused Fill Light */}
      <div className="absolute -bottom-[25%] left-1/4 w-[500px] h-[400px] rounded-full bg-gold/5 blur-[120px]" />

      {/* Ultra-subtle Fine Art Archival Grid Frame */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(to right, #F5F3EC 1px, transparent 1px), linear-gradient(to bottom, #F5F3EC 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Museum Vignette Edge Falloff */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
    </div>
  );
}
