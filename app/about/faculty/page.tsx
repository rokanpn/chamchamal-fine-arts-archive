import { Metadata } from 'next';
import { FacultyClient } from '@/components/about/FacultyClient';

export const metadata: Metadata = {
  title: 'Administration & Academic Faculty | Chamchamal Fine Arts Archive',
  description: 'Leadership, department heads, and distinguished professors cultivating fine arts at Chamchamal Fine Arts Institute.',
  openGraph: {
    title: 'Administration & Academic Faculty | Chamchamal Fine Arts Archive',
    description: 'Leadership, department heads, and distinguished professors cultivating fine arts at Chamchamal Fine Arts Institute.',
  },
};

export default function FacultyPage() {
  return <FacultyClient />;
}
