import { Metadata } from 'next';
import { CollaboratorsClient } from '@/components/collaborators/CollaboratorsClient';

export const metadata: Metadata = {
  title: 'Visiting Artists & Cultural Collaborators | Chamchamal Fine Arts Archive',
  description: 'Archival timeline celebrating master guest artists, residency workshops, and international cultural collaborations with Chamchamal Fine Arts Institute.',
  openGraph: {
    title: 'Visiting Artists & Cultural Collaborators | Chamchamal Fine Arts Archive',
    description: 'Archival timeline celebrating master guest artists, residency workshops, and international cultural collaborations with Chamchamal Fine Arts Institute.',
  },
};

export default function CollaboratorsPage() {
  return <CollaboratorsClient />;
}
