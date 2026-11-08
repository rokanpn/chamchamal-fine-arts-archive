import { Metadata } from 'next';
import { TOOLS_DATA } from '@/data/tools';
import { ToolEditClient } from '@/components/admin/ToolEditClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return TOOLS_DATA.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = TOOLS_DATA.find((item) => item.slug === params.slug);
  const title = tool
    ? `Edit: ${tool?.name?.ckb || tool?.name?.en || 'Tool'} (${tool?.name?.en || ''}) | Atelier Admin`
    : `Edit Atelier Tool | Curatorial Portal`;

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ToolEditPage({ params }: PageProps) {
  return <ToolEditClient slug={params.slug} />;
}
