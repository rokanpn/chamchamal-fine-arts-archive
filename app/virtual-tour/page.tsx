import React from 'react';
import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'گەشتی خەیاڵی سێ-ڕەهەندی • 3D Virtual Gallery Tour | Chamchamal Fine Arts Institute',
  description: 'ئەزموونی گەشتێکی خەیاڵی نێو هۆڵی شاکارە هونەرییەکانی پەیمانگەی هونەرە جوانەکانی چەمچەماڵ لە ڕێگەی تەکنەلۆژیای پێشکەوتووی 3D WebGL.',
};

// Luxury Museum Loading Skeleton
function VirtualTourLoader() {
  return (
    <div className="dark w-full h-screen bg-[#070709] text-[#F5F3EC] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping" />
        <div className="absolute inset-0 rounded-full border-2 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border border-gold/40 flex items-center justify-center">
          <span className="text-gold text-xs font-mono font-bold">3D</span>
        </div>
      </div>

      <span className="text-xs font-mono text-gold tracking-widest uppercase mb-2">
        CHAMCHAMAL FINE ARTS ARCHIVE
      </span>
      <h1 className="text-xl sm:text-2xl font-bold text-parchment-pure font-serif mb-2">
        ئامادەکردنی هۆڵی پێشانگای خەیاڵی
      </h1>
      <p className="text-xs text-museum-secondary max-w-sm leading-relaxed">
        Loading WebGL 3D Gallery, spatial lighting, and dynamic curatorial corridor...
      </p>
    </div>
  );
}

// Client-only dynamic import to ensure WebGL and canvas evaluate on the browser
const VirtualTourClient = nextDynamic(
  () =>
    import('@/components/gallery/VirtualTourClient').then(
      (mod) => mod.VirtualTourClient
    ),
  {
    ssr: false,
    loading: () => <VirtualTourLoader />,
  }
);

export default function VirtualTourPage() {
  return <VirtualTourClient />;
}
