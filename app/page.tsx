'use client';

import React from 'react';
import { CuratorialHero } from '@/components/home/CuratorialHero';
import { ArtworkFeed } from '@/components/home/ArtworkFeed';

export default function Home() {
  return (
    <div className="flex flex-col gap-14 sm:gap-20 w-full pb-32 sm:pb-36 safe-bottom">
      {/* Interactive Ambient Hero Section */}
      <CuratorialHero />

      {/* Dynamic Art Biennial Masonry Feed with Category Filters */}
      <ArtworkFeed />
    </div>
  );
}
