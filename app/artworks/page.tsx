import React, { Suspense } from 'react';
import { ArtworksDirectoryClient } from '@/components/artworks/ArtworksDirectoryClient';

export const metadata = {
  title: 'پێشانگای بەرهەمەکان | Chamchamal Fine Arts Archive',
  description: 'ئەرشیفی فەرمی بەشە ئەکادیمییەکانی پەیمانگای هونەرە جوانەکانی چەمچەماڵ: شێوەکاری، مۆسیقا، شانۆ.',
};

export default function ArtworksPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold/40 border-t-gold animate-spin" />
      </div>
    }>
      <ArtworksDirectoryClient />
    </Suspense>
  );
}
