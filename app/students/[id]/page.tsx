import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { STUDENTS_DATA } from '@/data/students';
import { StudentDetailClient } from '@/components/students/StudentDetailClient';

interface PageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const student = STUDENTS_DATA.find((item) => item.id === params.id);

  if (!student) {
    return {
      title: 'Artist Not Found | Chamchamal Fine Arts Archive',
    };
  }

  const title = `${student.fullName.ckb} (${student.fullName.en}) | Artist Profile`;
  const description = student.bio.ckb;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: student.avatarUrl,
          width: 600,
          height: 600,
          alt: student.fullName.en,
        },
      ],
    },
  };
}

export default function StudentProfilePage({ params }: PageProps) {
  const student = STUDENTS_DATA.find((item) => item.id === params.id);

  if (!student) {
    notFound();
  }

  return <StudentDetailClient student={student} />;
}
