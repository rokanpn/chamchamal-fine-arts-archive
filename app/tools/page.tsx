import { Metadata } from 'next';
import { ToolsIndexClient } from '@/components/tools/ToolsIndexClient';

export const metadata: Metadata = {
  title: 'Atelier Instruments & Material Encyclopedia | ئامرازەکانی ئاتلیێ | Chamchamal Fine Arts',
  description: 'The encyclopedia of fine art instruments, sculpting chisels, alluvial terracotta clays, and linocut gouges curated at Chamchamal Fine Arts Institute.',
};

export default function ToolsPage() {
  return <ToolsIndexClient />;
}
