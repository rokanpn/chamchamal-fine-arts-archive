import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chamchamal Fine Arts Institute Digital Archive (ئەرشیفی پەیمانگەی چەمچەماڵ)',
    short_name: 'Chamchamal Art',
    description: 'Museum-grade Digital Archive, 3D Photogrammetric Repository & Biennial Collection for Chamchamal Fine Arts Institute.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0C',
    theme_color: '#0A0A0C',
    orientation: 'portrait',
    categories: ['education', 'arts', 'museum'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Permanent Gallery',
        url: '/',
        description: 'Explore curated oil paintings and 3D sculptures',
      },
      {
        name: '3D Monument Scan',
        url: '/artworks/chamchamal-freedom-monument',
        description: 'Direct access to 3D photogrammetry scan',
      },
      {
        name: 'Atelier Instruments',
        url: '/tools',
        description: 'Browse tools and materials encyclopedia',
      },
      {
        name: 'Artists Directory',
        url: '/students',
        description: 'View student and faculty portfolios',
      },
    ],
  };
}
