import { Metadata } from 'next';
import { StudentsIndexClient } from '@/components/students/StudentsIndexClient';

export const metadata: Metadata = {
  title: 'Student Artists & Alumni Directory | تۆماری هونەرمەندان | Chamchamal Fine Arts',
  description: 'The curatorial roster and digital portfolios of students, master craftsmen, and alumni from Chamchamal Fine Arts Institute.',
};

export default function StudentsPage() {
  return <StudentsIndexClient />;
}
