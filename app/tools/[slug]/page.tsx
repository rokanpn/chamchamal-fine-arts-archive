import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS_DATA } from '@/data/tools';
import { ToolDetailClient } from '@/components/tools/ToolDetailClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = TOOLS_DATA.find((item) => item.slug === params.slug);

  if (!tool) {
    return {
      title: 'Instrument Not Found | Chamchamal Fine Arts Archive',
    };
  }

  const ckbName = tool?.name?.ckb || tool?.name?.en || 'Instrument';
  const enName = tool?.name?.en || tool?.name?.ckb || 'Instrument';
  const title = `${ckbName} (${enName}) | Atelier Instruments`;
  const description = tool?.description?.ckb || tool?.description?.en || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: tool.imageUrl,
          width: 1200,
          height: 800,
          alt: enName,
        },
      ],
    },
  };
}

export default function ToolDetailPage({ params }: PageProps) {
  const tool = TOOLS_DATA.find((item) => item.slug === params.slug);

  if (!tool) {
    notFound();
  }

  return <ToolDetailClient tool={tool} />;
}
