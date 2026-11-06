import type { Metadata, Viewport } from 'next';
import { Vazirmatn, Cormorant_Garamond, Cinzel, Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ArchiveProvider } from '@/context/ArchiveContext';
import { NavigationTransitionProvider } from '@/context/NavigationTransitionContext';
import { AppShell } from '@/components/layout/AppShell';

// Primary typography for Kurdish (Sorani) and Arabic
const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// Editorial luxury serif for Western classical gallery titles
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// High-end Roman inscription display font for brand seals and monograms
const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

// Modern neutral sans-serif for UI labels and tabular numerical indices
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// PWA Viewport Configuration: 100dvh optimization & notch safe-area
export const viewport: Viewport = {
  themeColor: '#0A0A0C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

// Museum Curatorial Metadata & PWA Inscription
export const metadata: Metadata = {
  title: {
    default: 'Chamchamal Fine Arts Institute Digital Archive | ئەرشیفی پەیمانگای هونەرە جوانەکانی چەمچەماڵ',
    template: '%s | Chamchamal Fine Arts Archive',
  },
  description: 'The official digital archive, student biennial repository, and 3D photogrammetric artifact collection for Chamchamal Fine Arts Institute (پەیمانگای هونەرە جوانەکانی چەمچەماڵ).',
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
        <LanguageProvider>
          <ArchiveProvider>
            <NavigationTransitionProvider>
              <AppShell>
                {children}
              </AppShell>
            </NavigationTransitionProvider>
          </ArchiveProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
