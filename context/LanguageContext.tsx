'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Locale, Direction, LanguageOption, TranslationsRecord, ArchiveTranslations } from '@/types/localization';

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'ckb',
    label: 'کوردی',
    shortLabel: 'کو',
    dir: 'rtl',
    fontClass: 'font-kurdish',
  },
  {
    code: 'ar',
    label: 'العربية',
    shortLabel: 'عرب',
    dir: 'rtl',
    fontClass: 'font-arabic',
  },
  {
    code: 'en',
    label: 'English',
    shortLabel: 'EN',
    dir: 'ltr',
    fontClass: 'font-sans',
  },
];

export const TRANSLATIONS: TranslationsRecord = {
  ckb: {
    instituteName: 'پەیمانگای هونەرە جوانەکانی چەمچەماڵ',
    instituteSubline: 'ئەرشیفی دیجیتاڵی نەتەوەیی و پاراستنی کەلەپوور',
    archiveBadge: 'ئەرشیفی فەرمی',
    liveArchive: 'ئەرشیفی کراوە',
    searchPlaceholder: 'گەڕان لەناو تابلۆکان، پەیکەرەکان، سکانی سێ ڕەهەندی...',
    nav: {
      gallery: 'پێشانگا',
      scan3d: 'سکانی ۳D',
      tools: 'کەرەستەکان',
      students: 'خوێندکاران',
      faculty: 'دەستەی کارگێڕی',
      collaborators: 'هونەرمەندانی هاوبەش',
    },
    hero: {
      topBadge: 'پاراستنی کەلەپوور و داهێنانی هونەری هاوچەرخ',
      instituteName: 'پەیمانگای هونەرە جوانەکانی چەمچەماڵ',
      subtitle: 'دەروازەی فەرمی ئەرشیفی نیشتمانی و داهێنانی ئەکادیمی',
      description: 'مەڵبەندێکی ڕەسەنی بونیادنانی هونەری هاوچەرخ لە ناوچەی گەرمیان (دامەزراو لە ٢٠٠٨). لێرەدا، مێژووی دەوڵەمەند و داهێنانی خوێندکاران و مامۆستایان بە تەکنەلۆجیای سێ ڕەهەندی و واقیعی زیادکراو دەپارێزرێت و نمایش دەکرێت.',
      scanQr: 'QR سکان بکە 🔍',
      exploreGallery: 'بینینی پێشانگای سەرەکی 🏛️',
      tagline: 'پاراستنی کەلەپوور و داهێنانی هونەری هاوچەرخ',
      headline: 'پەیمانگای هونەرە جوانەکانی چەمچەماڵ',
      subheadline: 'دەروازەی فەرمی ئەرشیفی نیشتمانی و داهێنانی ئەکادیمی',
      view3DArchive: 'گەشتی سێ ڕەهەندی',
      featuredCount: '+١,٤٢٠ بەرهەم',
      scannedArtifacts: '٨٥ سکانی 3D',
      departments: '٣ بەشی زانستی',
    },
    dashboard: {
      academicAnalytics: 'ئامارە فەرمییەکانی ئەکادیمی',
      realtimeBoardTitle: 'دەستەی بەشەکان و ئامارە فەرمییە ڕاستەوخۆکان',
      realtimeBoardSubtitle: 'بەشە ئەکادیمییە مێژووییەکانی پەیمانگای هونەرە جوانەکانی چەمچەماڵ (شێوەکاری، مۆسیقا، شانۆ)',
      totalArtworksPill: 'بەرهەمی کەتەلۆگکراو',
      scansPill: 'سکانی سێ ڕەهەندی',
      departmentsPill: 'بەشی زانستی',
      historicalOverlayArtworks: '+١,٤٢٠ بەرهەمی تۆمارکراو',
      historicalOverlayScans: '٨٥ سکانی سێ ڕەهەندی',
      historicalOverlayDepts: '٣ بەشی زانستی',
      paintingTitle: 'شێوەکاری',
      paintingDesc: 'شێوەکاری ئەکادیمی، پەیکەرسازی، سیرامیک و گرافیک دیزاینی هاوچەرخ',
      musicTitle: 'مۆسیقا',
      musicDesc: 'تۆماری ئاوازە دێرینەکانی گەرمیان، ژەنینی تاری کوردی و مەقاماتی ڕەسەن',
      theaterTitle: 'شانۆ',
      theaterDesc: 'شانۆگەری درامی، نواندنی جەستەیی، دەرهێنان و دیمەنکاری سینۆگرافیا',
      alumniCount: 'دەرچوو',
      worksCount: 'بەرهەم',
      exploreDept: 'گەڕان لە ئەرشیف',
      liveBadge: 'ئاماری ڕاستەوخۆ',
    },
    pwa: {
      installPrompt: 'ئەپەکە دابەزێنە بۆ خێرایی و کارکردنی بەردەوام بەبێ ئینتەرنێت',
      installButton: 'دابەزاندنی ئەپ',
    },
  },
  ar: {
    instituteName: 'معهد الفنون الجميلة في جمجمال',
    instituteSubline: 'الأرشيف الرقمي لحفظ التراث والإبداع الأكاديمي',
    archiveBadge: 'الأرشيف الرسمي',
    liveArchive: 'أرشيف حي ومفتوح',
    searchPlaceholder: 'البحث في الأعمال الفنية، المنحوتات، المسح ثلاثي الأبعاد...',
    nav: {
      gallery: 'المعرض',
      scan3d: 'المسح ثلاثي الأبعاد',
      tools: 'الأدوات',
      students: 'الطلاب',
      faculty: 'الهيئة التدريسية',
      collaborators: 'فنانون زائرون',
    },
    hero: {
      topBadge: 'صون التراث والإبداع التشكيلي المعاصر',
      instituteName: 'معهد الفنون الجميلة في جمجمال',
      subtitle: 'البوابة الرسمية للأرشيف الوطني والإبداع الأكاديمي',
      description: 'صرح أكاديمي عريق لصياغة الفنون المعاصرة في منطقة كرميان (تأسس عام ٢٠٠٨). هنا، يتم حفظ وعرض التاريخ العريق وإبداعات الطلاب والأساتذة بتقنيات ثلاثية الأبعاد والواقع المعزز.',
      scanQr: 'مسح رمز QR 🔍',
      exploreGallery: 'استكشف المعرض الرئيسي 🏛️',
      tagline: 'صون التراث والإبداع التشكيلي المعاصر',
      headline: 'معهد الفنون الجميلة في جمجمال',
      subheadline: 'البوابة الرسمية للأرشيف الوطني والإبداع الأكاديمي',
      view3DArchive: 'الأرشيف ثلاثي الأبعاد',
      featuredCount: '+١,٤٢٠ عمل',
      scannedArtifacts: '٨٥ مسح ثلاثي الأبعاد',
      departments: '٣ أقسام علمية',
    },
    dashboard: {
      academicAnalytics: 'الاحصائيات الأكاديمية الرسمية',
      realtimeBoardTitle: 'لوحة الأقسام والإحصائيات الحية',
      realtimeBoardSubtitle: 'الأقسام الأكاديمية الرسمية لمعهد الفنون الجميلة في جمجمال (الفنون التشكيلية، الموسيقى، المسرح)',
      totalArtworksPill: 'أعمال فنية موثقة',
      scansPill: 'مسح ثلاثي الأبعاد',
      departmentsPill: 'أقسام علمية',
      historicalOverlayArtworks: '+١,٤٢٠ عملاً مسجلاً',
      historicalOverlayScans: '٨٥ مجسماً ثلاثي الأبعاد',
      historicalOverlayDepts: '٣ أقسام علمية',
      paintingTitle: 'الفنون التشكيلية',
      paintingDesc: 'الرسم الأكاديمي، النحت، الخزف وتصميم الجرافيك والطباعة',
      musicTitle: 'الموسيقى',
      musicDesc: 'المقامات الكردية الأصيلة، الآلات الوترية وعزف التار الأكاديمي',
      theaterTitle: 'المسرح',
      theaterDesc: 'الفنون الدرامية، التمثيل المسرحي، الإخراج وسينوغرافيا الخشبة',
      alumniCount: 'خريج',
      worksCount: 'أعمال',
      exploreDept: 'استكشف القسم',
      liveBadge: 'بيانات حية',
    },
    pwa: {
      installPrompt: 'قم بتثبيت التطبيق للاستمتاع بتجربة متحفية سريعة وبدون اتصال',
      installButton: 'تثبيت التطبيق',
    },
  },
  en: {
    instituteName: 'Chamchamal Fine Arts Institute',
    instituteSubline: 'Digital Archive for Cultural Preservation & Academic Fine Arts',
    archiveBadge: 'Official Archive',
    liveArchive: 'Live Curated Archive',
    searchPlaceholder: 'Search oil paintings, sculptures, 3D artifacts...',
    nav: {
      gallery: 'Gallery',
      scan3d: '3D Scan',
      tools: 'Atelier',
      students: 'Artists',
      faculty: 'Faculty',
      collaborators: 'Collaborators',
    },
    hero: {
      topBadge: 'Heritage Preservation & Contemporary Fine Arts',
      instituteName: 'Chamchamal Fine Arts Institute',
      subtitle: 'The Official Gateway to the National Archive & Academic Innovation',
      description: 'Kurdistan’s premier cradle of contemporary visual culture in Garmian (founded in 2008). Here, rich artistic heritage and boundary-pushing explorations of students and master faculty are preserved and exhibited via cutting-edge 3D photogrammetry and augmented reality.',
      scanQr: 'Scan QR Code 🔍',
      exploreGallery: 'Explore Permanent Collection 🏛️',
      tagline: 'Heritage Preservation & Contemporary Fine Arts',
      headline: 'Chamchamal Fine Arts Institute',
      subheadline: 'The Official Gateway to the National Archive & Academic Innovation',
      view3DArchive: 'Enter 3D Chamber',
      featuredCount: '+1,420 Works',
      scannedArtifacts: '85 3D Artifacts',
      departments: '3 Academic Depts',
    },
    dashboard: {
      academicAnalytics: 'Academic Analytics',
      realtimeBoardTitle: 'Academic Departments & Real-Time Analytics',
      realtimeBoardSubtitle: 'Official Academic Tracks of Chamchamal Fine Arts Institute (Painting, Music, Theater)',
      totalArtworksPill: 'Cataloged Works',
      scansPill: 'Interactive 3D Scans',
      departmentsPill: 'Scientific Departments',
      historicalOverlayArtworks: '+1,420 Archived Works',
      historicalOverlayScans: '85 3D Artifact Scans',
      historicalOverlayDepts: '3 Academic Departments',
      paintingTitle: 'Painting',
      paintingDesc: 'Academic Painting, Monumental Sculpture, Ceramics & Graphic Printmaking',
      musicTitle: 'Music',
      musicDesc: 'Traditional Kurdish Maqam, String Instrumentation & Archival Master Audio',
      theaterTitle: 'Theater',
      theaterDesc: 'Dramatic Arts, Expressive Stage Performance, Direction & Scenography',
      alumniCount: 'Alumni',
      worksCount: 'Works',
      exploreDept: 'Explore Archive',
      liveBadge: 'Live Stream',
    },
    pwa: {
      installPrompt: 'Install the PWA for museum-grade offline browsing and haptic navigation',
      installButton: 'Install App',
    },
  },
};

interface LanguageContextType {
  locale: Locale;
  direction: Direction;
  isRTL: boolean;
  t: ArchiveTranslations;
  setLocale: (locale: Locale) => void;
  currentOption: LanguageOption;
  availableLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'chamchamal_art_locale';

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to Kurdish Sorani ('ckb')
  const [locale, setLocaleState] = useState<Locale>('ckb');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    // Read persisted choice or fallback to Kurdish
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && (saved === 'ckb' || saved === 'ar' || saved === 'en')) {
        setLocaleState(saved);
      }
    } catch {
      // Ignore storage access errors in restricted sandboxes
    }
    setMounted(true);
  }, []);

  const direction: Direction = useMemo(() => {
    return locale === 'en' ? 'ltr' : 'rtl';
  }, [locale]);

  const currentOption = useMemo(() => {
    return LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];
  }, [locale]);

  // Synchronize document attributes dynamically
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.dir = direction;
      root.lang = locale;

      // Update body font classes
      root.classList.remove('font-kurdish', 'font-arabic', 'font-sans');
      root.classList.add(currentOption.fontClass);
    }
  }, [locale, direction, currentOption]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      // Also set cookie for SSR headers if desired
      document.cookie = `${STORAGE_KEY}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // LocalStorage fail-safe
    }
  };

  const contextValue: LanguageContextType = {
    locale,
    direction,
    isRTL: direction === 'rtl',
    t: TRANSLATIONS[locale],
    setLocale,
    currentOption,
    availableLanguages: LANGUAGES,
  };

  // Prevent flash of incorrect direction during hydration
  return (
    <LanguageContext.Provider value={contextValue}>
      <div
        dir={mounted ? direction : 'rtl'}
        lang={mounted ? locale : 'ckb'}
        className={`min-h-screen bg-obsidian text-parchment ${currentOption.fontClass} antialiased selection:bg-gold/30 selection:text-gold-shimmer`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
