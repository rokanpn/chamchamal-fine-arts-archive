import { Metadata } from 'next';
import { STUDENTS_DATA } from '@/data/students';
import { StudentEditClient } from '@/components/admin/StudentEditClient';

interface PageProps {
  params: {
    id: string;
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return STUDENTS_DATA.map((student) => ({
    id: student.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const student = STUDENTS_DATA.find((item) => item.id === params.id || item.slug === params.id);
  const title = student
    ? `Edit: ${student.fullName.ckb} (${student.fullName.en}) | Student Registry`
    : `Edit Student Profile | Curatorial Portal`;

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function StudentEditPage({ params }: PageProps) {
  return <StudentEditClient id={params.id} />;
}
