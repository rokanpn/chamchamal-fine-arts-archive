import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ARTWORKS_DATA, Artwork } from '@/data/artworks';
import { ArtworkDetailClient } from '@/components/artwork/ArtworkDetailClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return ARTWORKS_DATA.map((artwork) => ({
    slug: artwork.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const artwork = ARTWORKS_DATA.find((item) => item.slug === params.slug);

  if (!artwork) {
    return {
      title: 'Archival Masterwork | Chamchamal Fine Arts Archive',
    };
  }

  const title = `${artwork.title.ckb} (${artwork.title.en}) | ${artwork.artist.ckb}`;
  const description = artwork.description.ckb;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: artwork.imageUrl,
          width: 1200,
          height: 800,
          alt: artwork.title.en,
        },
      ],
    },
  };
}

export default function ArtworkDetailPage({ params }: PageProps) {
  const artwork = ARTWORKS_DATA.find((item) => item.slug === params.slug);

  const initialArtwork: Artwork = artwork || {
    id: `temp-${params.slug}`,
    slug: params.slug,
    title: { ckb: 'شاکاری پەسەندکراوی ئەرشیف', ar: 'عمل فني معتمد', en: 'Archival Masterwork' },
    artist: { ckb: 'هونەرمەندی پەیمانگای چەمچەماڵ', ar: 'فنان المعهد', en: 'Institute Artist' },
    artistId: 'faculty-collection',
    artistBio: { ckb: 'دەرچووی بەشی هونەری لە پەیمانگای هونەرە جوانەکان', ar: 'خريج قسم الفنون بالمعهد', en: 'Graduate of Chamchamal Fine Arts' },
    artistGraduationYear: 2022,
    category: 'painting',
    categoryLabel: { ckb: 'شێوەکاری', ar: 'رسم تشكيلي', en: 'Painting' },
    department: { ckb: 'شێوەکاری', ar: 'فنون تشكيلية', en: 'Fine Arts' },
    medium: { ckb: 'تەکنیکی تێکەڵاو', ar: 'تقنية مختلطة', en: 'Mixed Atelier Media' },
    year: 2026,
    dimensions: '120 × 90 cm',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    has3DModel: false,
    description: { ckb: 'شاکاری تۆمارکراو لە ئەرشیفی دیجیتاڵی پەیمانگای هونەرە جوانەکانی چەمچەماڵ.', ar: 'عمل موثق في الأرشيف الرقمي.', en: 'Official archival acquisition at Chamchamal Fine Arts Institute.' },
    locationInInstitute: { ckb: 'هۆڵی پێشانگای هەمیشەیی', ar: 'قاعة المعرض الدائم', en: 'Permanent Exhibition Hall' },
    provenancePedestal: 'WALL-GALLERY-N1',
    physicalPlaqueCode: 'CFA-ACQ-2026',
    atelierTools: [],
    toolSlugs: [],
  };

  return <ArtworkDetailClient artwork={initialArtwork} />;
}
