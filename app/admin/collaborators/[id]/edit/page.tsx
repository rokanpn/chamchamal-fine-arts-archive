import { Metadata } from 'next';
import { COLLABORATORS_DATA } from '@/data/collaborators';
import { CollaboratorEditClient } from '@/components/admin/CollaboratorEditClient';

interface PageProps {
  params: {
    id: string;
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return COLLABORATORS_DATA.map((collab) => ({
    id: collab.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const collab = COLLABORATORS_DATA.find((item) => item.id === params.id || item.slug === params.id);
  const title = collab
    ? `Edit: ${collab.name.ckb} (${collab.name.en}) | Collaborators Registry`
    : `Edit Collaborator | Curatorial Portal`;

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function CollaboratorEditPage({ params }: PageProps) {
  return <CollaboratorEditClient id={params.id} />;
}
