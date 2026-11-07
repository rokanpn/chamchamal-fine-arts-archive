import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LanguageProvider } from '@/context/LanguageContext';
import { ArchiveProvider } from '@/context/ArchiveContext';
import { NavigationTransitionProvider } from '@/context/NavigationTransitionContext';
import { AppShell } from '@/components/layout/AppShell';

// Primary typography variables for bi-directional Kurdish, Arabic & Latin editorial styles
const vazirmatn = { variable: 'var(--font-vazirmatn)' };
const cormorant = { variable: 'var(--font-cormorant)' };
const cinzel = { variable: 'var(--font-cinzel)' };
const inter = { variable: 'var(--font-inter)' };

// Enforce real-time dynamic rendering & disable static HTML caching across all devices
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// PWA Viewport Configuration: 100dvh optimization & notch safe-area
export const viewport: Viewport = {
  themeColor: '#F8F7F4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

// Museum Curatorial Metadata & PWA Inscription
export const metadata: Metadata = {
  title: {
    default: 'Chamchamal Fine Arts Institute Digital Archive | ئەرشیفی پەیمانگەی هونەرە جوانەکانی چەمچەماڵ',
    template: '%s | Chamchamal Fine Arts Archive',
  },
  description: 'The official digital archive, student biennial repository, and 3D photogrammetric artifact collection for Chamchamal Fine Arts Institute (پەیمانگەی هونەرە جوانەکانی چەمچەماڵ).',
  applicationName: 'Chamchamal Fine Arts Archive',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Chamchamal Arts',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ckb_IQ',
    alternateLocale: ['ar_IQ', 'en_US'],
    url: 'https://archive.chamchamal-finearts.edu.krd',
    siteName: 'Chamchamal Fine Arts Institute Digital Archive',
    title: 'Chamchamal Fine Arts Institute Digital Archive',
    description: 'Documenting Kurdish contemporary fine arts, classical sculpture, and academic heritage.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ckb"
      dir="rtl"
      className={`${vazirmatn.variable} ${cormorant.variable} ${cinzel.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-obsidian text-parchment font-kurdish antialiased min-h-screen selection:bg-gold/30 selection:text-gold-shimmer">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>
            <ArchiveProvider>
              <NavigationTransitionProvider>
                <AppShell>
                  {children}
                </AppShell>
              </NavigationTransitionProvider>
            </ArchiveProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
