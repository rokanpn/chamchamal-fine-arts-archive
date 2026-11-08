import { Metadata } from 'next';
import { ARTWORKS_DATA } from '@/data/artworks';
import { ArtworkEditClient } from '@/components/admin/ArtworkEditClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = true;
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function generateStaticParams() {
  return ARTWORKS_DATA.map((artwork) => ({
    slug: artwork.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const artwork = ARTWORKS_DATA.find((item) => item.slug === params.slug);
  const title = artwork
    ? `Edit: ${artwork?.title?.ckb || artwork?.title?.en || 'Artwork'} (${artwork?.title?.en || ''}) | Curatorial Portal`
    : `Edit Masterwork | Curatorial Portal`;

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ArtworkEditPage({ params }: PageProps) {
  return <ArtworkEditClient slug={params.slug} />;
}
