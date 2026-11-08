import { Metadata } from 'next';
import { FACULTY_DATA } from '@/data/faculty';
import { FacultyEditClient } from '@/components/admin/FacultyEditClient';

interface PageProps {
  params: {
    id: string;
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return FACULTY_DATA.map((member) => ({
    id: member.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const member = FACULTY_DATA.find((item) => item.id === params.id || item.slug === params.id);
  const title = member
    ? `Edit: ${member?.name?.ckb || member?.name?.en || 'Faculty'} (${member?.name?.en || ''}) | Faculty Registry`
    : `Edit Faculty Member | Curatorial Portal`;

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function FacultyEditPage({ params }: PageProps) {
  return <FacultyEditClient id={params.id} />;
}
