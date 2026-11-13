export type ArtworkCategory = 'all' | 'painting' | 'sculpture' | 'ceramics';

export type ArtworkDepartment = 'painting' | 'sculpture' | 'ceramics';

export interface LocalizedString {
  ckb: string;
  ar: string;
  en: string;
}

export const DEPARTMENT_OPTIONS: { key: ArtworkDepartment; label: LocalizedString }[] = [
  {
    key: 'painting',
    label: {
      ckb: 'شێوەکاری',
      ar: 'الفنون التشكيلية',
      en: 'Painting Department',
    },
  },
  {
    key: 'sculpture',
    label: {
      ckb: 'پەیکەرسازی',
      ar: 'قسم النحت',
      en: 'Sculpture Department',
    },
  },
  {
    key: 'ceramics',
    label: {
      ckb: 'سیرامیک',
      ar: 'قسم الخزف والسيراميك',
      en: 'Ceramics Department',
    },
  },
];

export const DEPARTMENT_LABELS: Record<ArtworkDepartment, LocalizedString> = {
  painting: {
    ckb: 'شێوەکاری',
    ar: 'الفنون التشكيلية',
    en: 'Painting Department',
  },
  sculpture: {
    ckb: 'پەیکەرسازی',
    ar: 'قسم النحت',
    en: 'Sculpture Department',
  },
  ceramics: {
    ckb: 'سیرامیک',
    ar: 'قسم الخزف والسيراميك',
    en: 'Ceramics Department',
  },
};

export function getArtworkDepartment(art: { department?: ArtworkDepartment | LocalizedString | string; category?: string } | null | undefined): ArtworkDepartment {
  if (!art) return 'painting';
  if (art.department === 'painting' || art.department === 'sculpture' || art.department === 'ceramics') {
    return art.department;
  }
  if (typeof art.department === 'object' && art.department !== null) {
    const ckb = (art.department?.ckb || '').toLowerCase();
    const en = (art.department?.en || '').toLowerCase();
    const ar = (art.department?.ar || '').toLowerCase();
    if (ckb.includes('سیرامیک') || en.includes('ceramic') || ar.includes('خزف') || art.category === 'ceramics') {
      return 'ceramics';
    }
    if (ckb.includes('پەیکەر') || en.includes('sculpt') || ar.includes('نحت') || art.category === 'sculpture') {
      return 'sculpture';
    }
    return 'painting';
  }
  if (art.category === 'ceramics') return 'ceramics';
  if (art.category === 'sculpture') return 'sculpture';
  return 'painting';
}

export function getArtworkDepartmentLabel(
  department: ArtworkDepartment | LocalizedString | undefined | null,
  locale: 'ckb' | 'ar' | 'en' = 'ckb'
): string {
  if (!department) return '';
  if (typeof department === 'string') {
    const label = DEPARTMENT_LABELS[department as ArtworkDepartment];
    return label ? (label?.[locale] || label?.ckb || '') : department;
  }
  return department?.[locale] || department?.ckb || department?.en || '';
}

export interface Artwork {
  id: string;
  slug: string;
  title: LocalizedString;
  artist: LocalizedString;
  artistId: string;
  artistBio: LocalizedString;
  artistGraduationYear: number;
  category: 'painting' | 'sculpture' | 'ceramics';
  categoryLabel: LocalizedString;
  department: ArtworkDepartment | LocalizedString;
  departmentLabel?: LocalizedString;
  medium: LocalizedString;
  year: number;
  dimensions: string;
  width_cm?: number;
  height_cm?: number;
  imageUrl: string;
  thumbnailUrl?: string;
  aspectRatio: 'portrait' | 'landscape' | 'square' | 'tall';
  has3DModel: boolean;
  modelUrl?: string;
  modelVertices?: string;
  modelPolygons?: string;
  hasPedestal?: boolean;
  modelScale?: number;
  featured?: boolean;
  description: LocalizedString;
  curatorialEssay?: LocalizedString;
  audioUrl?: string;
  audioDurationSeconds?: number;
  videoUrl?: string;
  videoTitle?: LocalizedString;
  curatorialPdfUrl?: string;
  curatorialPdfFileName?: string;
  locationInInstitute: LocalizedString;
  provenancePedestal: string;
  physicalPlaqueCode: string;
  atelierTools: LocalizedString[];
  toolSlugs: string[];
}

export interface CategoryOption {
  key: ArtworkCategory;
  label: LocalizedString;
  count: number;
}

export const CATEGORIES: CategoryOption[] = [
  {
    key: 'all',
    label: {
      ckb: 'هەموو بەرهەمەکان',
      ar: 'جميع الأعمال',
      en: 'All Works',
    },
    count: 12,
  },
  {
    key: 'painting',
    label: {
      ckb: 'شێوەکاری',
      ar: 'الفن التشكيلي',
      en: 'Painting',
    },
    count: 5,
  },
  {
    key: 'sculpture',
    label: {
      ckb: 'پەیکەرسازی',
      ar: 'النحت والتجسيم',
      en: 'Sculpture',
    },
    count: 4,
  },
  {
    key: 'ceramics',
    label: {
      ckb: 'سیرامیک',
      ar: 'الخزف الفني',
      en: 'Ceramics',
    },
    count: 3,
  },
];

export const ARTWORKS_DATA: Artwork[] = [
  {
    id: 'art-001',
    slug: 'echoes-of-garmian',
    title: {
      ckb: 'دوو ژن • شینایی شارباژێڕ و گەرمیان',
      ar: 'امرأتان • أصداء كرميان وشارباژير',
      en: 'Two Women • Echoes of Garmian & Sharbazher',
    },
    artist: {
      ckb: 'شوان کەریم ئەحمەد',
      ar: 'شوان كريم أحمد',
      en: 'Shwan Karim Ahmed',
    },
    artistId: 'shwan-karim-ahmed',
    artistBio: {
      ckb: 'شێوەکار و مامۆستای بەشی شێوەکاری، دەرچووی خولی یەکەمی پەیمانگەی هونەرە جوانەکانی چەمچەماڵ.',
      ar: 'فنان تشكيلي وأستاذ بقسم الرسم، خريج الدورة الأولى لمعهد الفنون الجميلة في جمجمال.',
      en: 'Painter and faculty member at Chamchamal Fine Arts Institute, Class of 2018.',
    },
    artistGraduationYear: 2018,
    category: 'painting',
    categoryLabel: {
      ckb: 'شێوەکاری',
      ar: 'الفن التشكيلي',
      en: 'Painting',
    },
    department: 'painting',
    departmentLabel: {
      ckb: 'بەشی وێنەکێشان',
      ar: 'قسم الفن التشكيلي المعاصر',
      en: 'Contemporary Painting Dept.',
    },
    medium: {
      ckb: 'زەیتی لەسەر قوماشی سروشتی (کانڤاس)',
      ar: 'زيت على قماش خام محلي',
      en: 'Oil on local raw linen canvas',
    },
    year: 2023,
    dimensions: '140 × 110 cm',
    width_cm: 140,
    height_cm: 110,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    has3DModel: false,
    featured: true,
    description: {
      ckb: 'لێکۆڵینەوەیەکی ڕەنگسازی قووڵ لەسەر کارەساتی وشکەساڵی و ژیانەوەی زەوی لە دەشتەکانی چەمچەماڵ و دەوروبەری.',
      ar: 'دراسة لونية عميقة تبحث في ثنائية الجفاف وتجدد الحياة في سهول جمجمال والمناطق المحيطة.',
      en: 'A profound chromatic exploration examining drought and terrestrial rebirth across the Chamchamal plains.',
    },
    locationInInstitute: {
      ckb: 'هۆڵی سەرەکی پێشانگای هەمیشەیی، قاتی یەکەم',
      ar: 'القاعة الكبرى للمقتنيات الدائمة، الطابق الأول',
      en: 'Main Permanent Gallery Hall, Floor 1',
    },
    provenancePedestal: 'WALL-SECTION-A1',
    physicalPlaqueCode: 'CFA-2023-PT-001',
    atelierTools: [
      { ckb: 'فڵچەی مووی ئەسپ ژمارە ١٢', ar: 'فرشاة شعر الخيل رقم 12', en: 'Horsehair Filbert Brush #12' },
      { ckb: 'سکینی تێکەڵکردنی ڕەنگی زەیتی', ar: 'سكين مزج الألوان الزيتية', en: 'Italian Palette Knife' },
    ],
    toolSlugs: ['horsehair-filbert-brush', 'italian-palette-knives'],
  },
  {
    id: 'art-002',
    slug: 'chamchamal-freedom-monument',
    title: {
      ckb: 'پەیکەری بەرخودانی چەمچەماڵ',
      ar: 'نصب الصمود والحرية في جمجمال',
      en: 'Chamchamal Resilience Monument',
    },
    artist: {
      ckb: 'د. ڕێبوار حسێن بابان',
      ar: 'د. ريبوار حسين بابان',
      en: 'Dr. Rebwar Hussein Baban',
    },
    artistId: 'rebwar-hussein-baban',
    artistBio: {
      ckb: 'پەیکەرسازی نێودەوڵەتی و بەرپرسی تاقیگەی فۆتۆگرامەتری و سێ ڕەهەندی پەیمانگە.',
      ar: 'نحات دولي ومسؤول مختبر الفحص والتوثيق ثلاثي الأبعاد بمعهد جمجمال.',
      en: 'Acclaimed Kurdish sculptor and director of the Institute 3D Photogrammetry Atelier.',
    },
    artistGraduationYear: 2016,
    category: 'sculpture',
    categoryLabel: {
      ckb: 'پەیکەرسازی',
      ar: 'النحت والتجسيم',
      en: 'Sculpture',
    },
    department: 'sculpture',
    departmentLabel: {
      ckb: 'بەشی پەیکەرسازی',
      ar: 'قسم النحت الأكاديمي',
      en: 'Academic Sculpture Dept.',
    },
    medium: {
      ckb: 'برۆنزی ئۆکسیدکراو و بەردی مەڕمەڕی ناوچەیی',
      ar: 'برونز معالج بالأكسدة مع رخام محلي',
      en: 'Patinated Bronze & Local Chamchamal Marble',
    },
    year: 2022,
    dimensions: '185 × 90 × 75 cm',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'tall',
    has3DModel: true,
    hasPedestal: false,
    modelScale: 2.2,
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
    modelVertices: '480,240 Vertices',
    modelPolygons: '960,400 Triangles',
    featured: true,
    description: {
      ckb: 'پەیکەرێکی مۆنۆمێنتال کە بە ٤٨٠ وێنەی فۆتۆگرامەتری بەرزە-وردبینی سێ ڕەهەندی تۆمارکراوە بۆ ئەرشیفی دیجیتاڵی نەتەوەیی.',
      ar: 'عمل نحتي مونوغرافي موثق عبر 480 لقطة فوتوغرامترية فائقة الدقة ليتم استعراضه ثلاثي الأبعاد.',
      en: 'A monumentally scaled sculpture documented through 480 high-resolution photogrammetry captures for full 3D interactive archival preservation.',
    },
    locationInInstitute: {
      ckb: 'باخچەی پەیکەرە دەرەکییەکان، مەیانی سەنتەر',
      ar: 'حديقة المنحوتات الخارجية، الساحة المركزية',
      en: 'Open Sculpture Courtyard, Central Atrium',
    },
    provenancePedestal: 'PEDESTAL-CENTRAL-01',
    physicalPlaqueCode: 'CFA-2022-SC-002',
    atelierTools: [
      { ckb: 'کۆمەڵە قەڵەمی نەخشاندنی پۆڵا', ar: 'مجموعة أزاميل الحفر الفولاذية', en: 'Hardened Steel Chisels' },
    ],
    toolSlugs: ['hardened-steel-chisels'],
  },
  {
    id: 'art-003',
    slug: 'garmian-earthen-amphora',
    title: {
      ckb: 'کەشکۆڵی گڵینەی گەرمیان',
      ar: 'أمفورا خزفية من طين كرميان',
      en: 'Garmian Earthen Amphora',
    },
    artist: {
      ckb: 'تارا عوسمان عەلی',
      ar: 'تارا عثمان علي',
      en: 'Tara Osman Ali',
    },
    artistId: 'tara-osman-ali',
    artistBio: {
      ckb: 'هونەرمەندی سیرامیک، تایبەتمەند لە زیندووکردنەوەی کەلەپووری گڵینەسازی دێرینی میزۆپۆتامیا.',
      ar: 'فنانة خزف متخصصة في إحياء التراث الطيني لبلاد الرافدين.',
      en: 'Ceramicist specializing in historic Mesopotamian and Median earthen vessels.',
    },
    artistGraduationYear: 2020,
    category: 'ceramics',
    categoryLabel: DEPARTMENT_LABELS.ceramics,
    department: 'ceramics',
    departmentLabel: DEPARTMENT_LABELS.ceramics,
    medium: {
      ckb: 'قوڕی گەرمیان، سوورکراوە لە پلەی ١٢٠٠°C بە ڕەنگی خۆڵەمێش',
      ar: 'طين كرميان المعالج، حرق بدرجة 1200 مئوية مع طلاء الرماد',
      en: 'Fired Garmian clay with organic wood-ash glaze',
    },
    year: 2023,
    dimensions: '65 × 42 × 42 cm',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    has3DModel: true,
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/WaterBottle/glTF-Binary/WaterBottle.glb',
    modelVertices: '245,100 Vertices',
    modelPolygons: '490,000 Triangles',
    featured: false,
    description: {
      ckb: 'زیندووکردنەوەی شێوازی دەفرسازی سۆمەری و ماددی کۆن بە کەرەستەی خاوی چەمچەماڵ.',
      ar: 'إحياء لتقنيات صناعة الفخار الميدي والسومري القديم باستخدام المواد الخام المحلية.',
      en: 'A revival of ancient Median and Sumerian vessel crafting utilizing indigenous mineral clays from Chamchamal.',
    },
    locationInInstitute: {
      ckb: 'گەلەریی ئاتلیێی سیرامیک، کابینەی A-14',
      ar: 'معرض أتيليه الخزف، خزانة العرض A-14',
      en: 'Ceramics Atelier Showcase, Cabinet A-14',
    },
    provenancePedestal: 'SHOWCASE-CERAMIC-A14',
    physicalPlaqueCode: 'CFA-2023-CR-003',
    atelierTools: [
      { ckb: 'قوڕی سووری کانزایی چەمچەماڵ', ar: 'طين كرميان الأحمر الغني بالمعادن', en: 'Garmian Mineral Terracotta Clay' },
    ],
    toolSlugs: ['chamchamal-mineral-clay'],
  },
  {
    id: 'art-004',
    slug: 'symbols-of-memory-and-resilience',
    title: {
      ckb: 'هێماکانی ئەنفال و نەمان',
      ar: 'رموز الذاكرة والصمود التيبوغرافي',
      en: 'Symbols of Memory & Resilience',
    },
    artist: {
      ckb: 'سۆران فایەق مەجید',
      ar: 'سوران فائق مجيد',
      en: 'Soran Faiq Majeed',
    },
    artistId: 'soran-faiq-majeed',
    artistBio: {
      ckb: 'دیزاینەری گرافیک و چاپکاری دەستی، خاوەنی خەڵاتی داهێنانی بیناڵی هەولێر.',
      ar: 'مصمم جرافيكي وطباع يدوي، حاصل على جائزة الإبداع في بينالي أربيل.',
      en: 'Printmaker and typography artist, recipient of the Erbil Biennial Innovation Award.',
    },
    artistGraduationYear: 2019,
    category: 'painting',
    categoryLabel: DEPARTMENT_LABELS.painting,
    department: 'painting',
    departmentLabel: DEPARTMENT_LABELS.painting,
    medium: {
      ckb: 'چاپکردنی لایلۆن و کالیگرافی کوردی لەسەر پەڕەی کەتان',
      ar: 'طباعة اللينوليوم مع خط كوردي على ورق الكتان المعتق',
      en: 'Linocut relief print with Kurdish typography on handmade rag paper',
    },
    year: 2024,
    dimensions: '90 × 60 cm',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    has3DModel: false,
    featured: false,
    description: {
      ckb: 'بەکارهێنانی پیتەکانی ئەلفوبێی کوردی وەک هێمایەکی بینراو بۆ گێڕانەوەی یادەوەریی بەکۆمەڵی گەلی کورد.',
      ar: 'توظيف الحروف الكردية كعلامات بصرية سردية تعبر عن الذاكرة الجمعية وتحدي المحو.',
      en: 'Harnessing Kurdish letterforms as profound visual motifs commemorating collective historic memory and persistence.',
    },
    locationInInstitute: {
      ckb: 'کۆکراوەی چاپی هونەری، هۆڵی بەڵگەنامەسازی',
      ar: 'مجموعة المطبوعات الفنية، قاعة الأرشيف والتوثيق',
      en: 'Fine Print Archive, Documentation Wing',
    },
    provenancePedestal: 'PRINT-BAY-B2',
    physicalPlaqueCode: 'CFA-2024-DS-004',
    atelierTools: [
      { ckb: 'تاشەرە گۆشەییەکانی لایلۆن (Gouges)', ar: 'أزاميل الحفر على اللينوليوم', en: 'Linocut & Relief Gouges' },
    ],
    toolSlugs: ['pfeil-linocut-gouges'],
  },
  {
    id: 'art-005',
    slug: 'dance-of-piramagrun-planes',
    title: {
      ckb: 'سەمای چنارەکانی پیرەمەگروون',
      ar: 'رقصة أشجار الدلب في سفح بيرامكرون',
      en: 'Dance of Piramagrun Planes',
    },
    artist: {
      ckb: 'لاڤە جەمال قادر',
      ar: 'لافا جمال قادر',
      en: 'Lava Jamal Qadir',
    },
    artistId: 'lava-jamal-qadir',
    artistBio: {
      ckb: 'شێوەکار و توێژەری ڕەنگ لە سروشتی شاخاوی باشووری کوردستاندا.',
      ar: 'فنانة تشكيلية وباحثة في التناغم اللوني للمشهد الجبلي في كردستان.',
      en: 'Visual artist and natural pigment researcher exploring southern Kurdistan alpine landscapes.',
    },
    artistGraduationYear: 2021,
    category: 'painting',
    categoryLabel: {
      ckb: 'شێوەکاری',
      ar: 'الفن التشكيلي',
      en: 'Painting',
    },
    department: 'painting',
    departmentLabel: {
      ckb: 'بەشی وێنەکێشان',
      ar: 'قسم الفن التشكيلي',
      en: 'Fine Arts Painting Dept.',
    },
    medium: {
      ckb: 'ئەکرلیک و گەڵای زێڕین لەسەر تەختەی دارگوێز',
      ar: 'أكريليك وورق الذهب الخالص على خشب الجوز الكردي',
      en: 'Acrylic & 24K Gold Leaf on Kurdish Walnut Wood Panel',
    },
    year: 2023,
    dimensions: '160 × 120 cm',
    imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    has3DModel: false,
    featured: true,
    description: {
      ckb: 'تێکەڵکردنی ڕێبازی ئیمپرێشنیزمی کوردی لەگەڵ تیشکی زێڕینی پاییز بەسەر شاخەکانی کوردستاندا.',
      ar: 'دمج التأثيرية الكردية بنقاء النور الذهبي الخريفي المتدفق على المنحدرات الجبلية.',
      en: 'Blending Kurdish impressionism with radiant autumn gold leaf lighting streaming down the mountain ridges.',
    },
    locationInInstitute: {
      ckb: 'هۆڵی نوێنەرایەتی ساڵانەی بیناڵی قوتابیان',
      ar: 'قاعة التمثيل السنوي لبينالي الطلبة',
      en: 'Annual Student Biennial Pavilion',
    },
    provenancePedestal: 'WALL-ATRIUM-EAST',
    physicalPlaqueCode: 'CFA-2023-PT-005',
    atelierTools: [
      { ckb: 'سکینی شێوەکاری ئیتاڵی', ar: 'سكين مزج الألوان الزيتية', en: 'Italian Palette Knife' },
    ],
    toolSlugs: ['italian-palette-knives'],
  },
  {
    id: 'art-006',
    slug: 'bust-of-the-nomad-weaver',
    title: {
      ckb: 'سەری ژنە ڕێبوارەکە',
      ar: 'تمثال نصفي للنساجة الرحالة',
      en: 'Bust of the Nomad Weaver',
    },
    artist: {
      ckb: 'کامەران ڕەئووف مەحموود',
      ar: 'كامران رؤوف محمود',
      en: 'Kamaran Raouf Mahmood',
    },
    artistId: 'rebwar-hussein-baban',
    artistBio: {
      ckb: 'پەیکەرساز، پسپۆڕ لە تاواندنی گەچ و تاشینی بەردی قەوقازی و کوردستانی.',
      ar: 'نحات متخصص في نحت الحجر الكلسي والقوالب الجصية الأكاديمية.',
      en: 'Sculptor specializing in regional Kurdistan limestone and classical plaster casting.',
    },
    artistGraduationYear: 2017,
    category: 'sculpture',
    categoryLabel: {
      ckb: 'پەیکەرسازی',
      ar: 'النحت والتجسيم',
      en: 'Sculpture',
    },
    department: 'sculpture',
    departmentLabel: {
      ckb: 'بەشی پەیکەرسازی',
      ar: 'قسم النحت',
      en: 'Sculpture Dept.',
    },
    medium: {
      ckb: 'بەردی کلس و گەچی داتاشراوی کوێستانی',
      ar: 'حجر الكلس والجبس المنحوت يدوياً',
      en: 'Carved Mountain Limestone & Fine Stucco',
    },
    year: 2022,
    dimensions: '58 × 34 × 28 cm',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'tall',
    has3DModel: true,
    hasPedestal: false,
    modelScale: 1.2,
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
    modelVertices: '310,000 Vertices',
    modelPolygons: '620,000 Triangles',
    featured: false,
    description: {
      ckb: 'سیمای ژنە کۆچەرییەکی قەرەداغ لە کاتی چنینی مافووری کوردی؛ سکانکراو بە لەیزەری مۆبایل و تەکنیکی LiDAR.',
      ar: 'ملامح سيدة بدوية من منطقة قرداغ أثناء حياكة السجاد الكردي، تم مسحها بتقنية LiDAR.',
      en: 'Depicting a Qaradagh nomadic master rug weaver, digitally digitized via high-precision mobile LiDAR scanning.',
    },
    locationInInstitute: {
      ckb: 'هۆڵی پەیکەری بچووک، ژووری ژمارە ٠٤',
      ar: 'قاعة المنحوتات المصغرة، غرفة رقم 04',
      en: 'Chamber Sculptures Salon, Room 04',
    },
    provenancePedestal: 'PEDESTAL-CHAMBER-04',
    physicalPlaqueCode: 'CFA-2022-SC-006',
    atelierTools: [
      { ckb: 'کۆمەڵە قەڵەمی نەخشاندنی پۆڵا', ar: 'مجموعة أزاميل الحفر الفولاذية', en: 'Hardened Steel Chisels' },
    ],
    toolSlugs: ['hardened-steel-chisels'],
  },
  {
    id: 'art-007',
    slug: 'solar-ceramic-vessel',
    title: {
      ckb: 'قاپوورەی ئاگرین',
      ar: 'الإناء الخزفي الناري الشمسي',
      en: 'Solar Ceramic Vessel',
    },
    artist: {
      ckb: 'دێرین هیمداد نەجمەدین',
      ar: 'ديرين هيمداد نجم الدين',
      en: 'Derin Himdad Najmaddin',
    },
    artistId: 'derin-himdad-najmaddin',
    artistBio: {
      ckb: 'مامۆستای تەکنیکەکانی ئاگر و سووتاندنی کەرەستەی ئەندامی لە بەشی سیرامیک.',
      ar: 'أستاذ تقنيات الحرق العضوي والحراري في قسم الخزف.',
      en: 'Instructor of pyrotechnic glazes and organic wood smoke reduction in ceramics.',
    },
    artistGraduationYear: 2019,
    category: 'ceramics',
    categoryLabel: DEPARTMENT_LABELS.ceramics,
    department: 'ceramics',
    departmentLabel: DEPARTMENT_LABELS.ceramics,
    medium: {
      ckb: 'تەکنیکی ڕاکۆ (Raku) لەگەڵ جامی مسین',
      ar: 'خزف راكو المختزل حرارياً مع بريق النحاس',
      en: 'Raku-fired reduction stoneware with copper lustre glaze',
    },
    year: 2024,
    dimensions: '45 × 40 × 40 cm',
    imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    has3DModel: true,
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/WaterBottle/glTF-Binary/WaterBottle.glb',
    modelVertices: '190,000 Vertices',
    modelPolygons: '380,000 Triangles',
    featured: false,
    description: {
      ckb: 'شاکارێکی تاقیکاری بە سووتاندنی دووکەڵی چڵەبەڕووەکانی دەوروبەری چەمچەماڵ کە ڕەنگێکی شین و برۆنزی دەگمەن بەخشیوە.',
      ar: 'عمل تجريبي أُحرق بأغصان البلوط الكردي ليمنح الإناء بريقاً أزرق ونحاسياً فريداً.',
      en: 'An experimental vessel reduced with local Kurdish oak branches producing an iridescent bronze-blue sheen.',
    },
    locationInInstitute: {
      ckb: 'پێشانگای تاقیکاریی هونەرە ئاگرینەکان',
      ar: 'معرض الفنون النارية التجريبية',
      en: 'Pyrotechnic & Experimental Arts Gallery',
    },
    provenancePedestal: 'PEDESTAL-FIRE-02',
    physicalPlaqueCode: 'CFA-2024-CR-007',
    atelierTools: [
      { ckb: 'گازەی درێژی دەرهێنانی ڕاکۆ لە فڕن', ar: 'كماشة الراكوا الفولاذية الطويلة', en: 'Heavy-Duty Raku Tongs' },
      { ckb: 'قوڕی سووری کانزایی چەمچەماڵ', ar: 'طين كرميان الأحمر', en: 'Garmian Mineral Clay' },
    ],
    toolSlugs: ['raku-heavy-tongs', 'chamchamal-mineral-clay'],
  },
  {
    id: 'art-008',
    slug: 'kurdish-geometric-disruption',
    title: {
      ckb: 'دابڕانی ئەندازەیی کالیگرافی',
      ar: 'التصدع الهندسي المعاصر للحروفية',
      en: 'Geometric Disruption in Kurdish Calligraphy',
    },
    artist: {
      ckb: 'ئاراس بەختیار سەڵاح',
      ar: 'آراس بختيار صلاح',
      en: 'Aras Bakhtiar Salah',
    },
    artistId: 'soran-faiq-majeed',
    artistBio: {
      ckb: 'کالیگراف و دیزاینەری هاوچەرخ، داهێنەری مۆدێلی تیپۆگرافی نوێی کوردی.',
      ar: 'خطاط ومصمم معاصر، مبتكر أنماط تيبوغرافية كردية حديثة.',
      en: 'Calligrapher and visual systems designer exploring modern Kurdish typography.',
    },
    artistGraduationYear: 2022,
    category: 'painting',
    categoryLabel: DEPARTMENT_LABELS.painting,
    department: 'painting',
    departmentLabel: DEPARTMENT_LABELS.painting,
    medium: {
      ckb: 'سیلک سککرین فرەڕەنگ لەسەر کاغەزی ئاوریشم',
      ar: 'طباعة سيلك سكرين متعددة الطبقات على ورق حريري',
      en: 'Multi-layer screenprint on Japanese silk paper',
    },
    year: 2024,
    dimensions: '100 × 70 cm',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    has3DModel: false,
    featured: true,
    description: {
      ckb: 'شیکردنەوەی ئەندازەیی هێڵکارییە دێرینەکانی قەڵای شێروانە و چەمچەماڵ لە ڕوانگەیەکی باوهاوس (Bauhaus)ی نوێدا.',
      ar: 'تفكيك هندسي للزخارف المعمارية في قلعة شيروانة وجمجمال من منظور باوهاوس المعاصر.',
      en: 'A geometric deconstruction of ancient regional citadel ornaments filtered through contemporary neo-Bauhaus sensibilities.',
    },
    locationInInstitute: {
      ckb: 'هۆڵی دیزاینی هاوچەرخ، کۆلێکشنەکانی چاپ',
      ar: 'قاعة التصميم المعاصر، خزانة الطباعة',
      en: 'Contemporary Design Wing, Print Collections',
    },
    provenancePedestal: 'WALL-DESIGN-GALLERY-D1',
    physicalPlaqueCode: 'CFA-2024-DS-008',
    atelierTools: [
      { ckb: 'تاشەرە گۆشەییەکانی لایلۆن (Gouges)', ar: 'أزاميل الحفر على اللينوليوم', en: 'Linocut & Relief Gouges' },
    ],
    toolSlugs: ['pfeil-linocut-gouges'],
  },
  {
    id: 'art-009',
    slug: 'motherhood-and-rebirth',
    title: {
      ckb: 'دایک و ئاوەدانکردنەوە',
      ar: 'الأمومة وإعادة الإعمار',
      en: 'Motherhood & Rebirth',
    },
    artist: {
      ckb: 'سروشت ئازاد نەوزاد',
      ar: 'سروشت آزاد نوزاد',
      en: 'Srusht Azad Nawzad',
    },
    artistId: 'lava-jamal-qadir',
    artistBio: {
      ckb: 'شێوەکار و چالاکوانی هونەری، گرنگیدەر بە پرسی ژنان و زیندووکردنەوەی مێژووی زارەکی.',
      ar: 'فنانة تشكيلية وناشطة ثقافية، تركز على القضايا الإنسانية والذاكرة الشفاهية.',
      en: 'Painter and cultural archivist focusing on oral histories and matrilineal preservation.',
    },
    artistGraduationYear: 2021,
    category: 'painting',
    categoryLabel: {
      ckb: 'شێوەکاری',
      ar: 'الفن التشكيلي',
      en: 'Painting',
    },
    department: 'painting',
    departmentLabel: {
      ckb: 'بەشی وێنەکێشان',
      ar: 'قسم الفن التشكيلي',
      en: 'Fine Arts Painting Dept.',
    },
    medium: {
      ckb: 'تێکەڵەی زەیتی و قوماش لەسەر بۆرد',
      ar: 'ألوان زيتية ومواد مختلطة على خشب مضغوط',
      en: 'Mixed Media & Oil on Specially Primed Panel',
    },
    year: 2023,
    dimensions: '150 × 120 cm',
    imageUrl: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    has3DModel: false,
    featured: false,
    description: {
      ckb: 'گێڕانەوەیەکی هەستیار بۆ هێزی دایکە کوردەکان لە ئاوەدانکردنەوەی ماڵە کاولبووەکان و چاندنی هیوا لە دڵی نەوەی نوێدا.',
      ar: 'لوحة تعبيرية تمجد دور الأمهات في إعادة بناء البيوت وغرس بذور الأمل للأجيال القادمة.',
      en: 'An evocative portrayal of matriarchal fortitude rebuilding home hearths and nurturing upcoming generations.',
    },
    locationInInstitute: {
      ckb: 'گەلەریی شێوەکاری، هۆڵی ڕۆژئاوا',
      ar: 'معرض الفن التشكيلي، الجناح الغربي',
      en: 'Painting Salon, West Pavilion',
    },
    provenancePedestal: 'WALL-WEST-PAVILION-03',
    physicalPlaqueCode: 'CFA-2023-PT-009',
    atelierTools: [
      { ckb: 'فڵچەی مووی ئەسپ ژمارە ١٢', ar: 'فرشاة شعر الخيل رقم 12', en: 'Horsehair Filbert Brush #12' },
    ],
    toolSlugs: ['horsehair-filbert-brush'],
  },
  {
    id: 'art-010',
    slug: 'dove-of-tangisar-steel-sculpture',
    title: {
      ckb: 'کۆتری ئاشتی لە کێوەکانەوە',
      ar: 'حمامة السلام من قمم الجبال',
      en: 'Dove of Mountain Peace',
    },
    artist: {
      ckb: 'زانا فەرهاد حەمەساڵح',
      ar: 'زانا فرهاد حمة صالح',
      en: 'Zana Farhad Hama-Salih',
    },
    artistId: 'rebwar-hussein-baban',
    artistBio: {
      ckb: 'پەیکەرسازی پۆڵا و کەرەستەی پیشەسازی، بەکارهێنەری کەرەستەی بەجێماوی جەنگ بۆ دروستکردنی پەیکەری ئاشتی.',
      ar: 'نحات معادن وفولاذ صناعي، يعيد تدوير بقايا الحروب لصناعة رموز السلام.',
      en: 'Metalsmith and sculptor transforming industrial reclaimed steel into enduring monuments of peace.',
    },
    artistGraduationYear: 2018,
    category: 'sculpture',
    categoryLabel: {
      ckb: 'پەیکەرسازی',
      ar: 'النحت والتجسيم',
      en: 'Sculpture',
    },
    department: 'sculpture',
    departmentLabel: {
      ckb: 'بەشی پەیکەرسازی',
      ar: 'قسم النحت',
      en: 'Sculpture Dept.',
    },
    medium: {
      ckb: 'پۆڵای گەرمکراو و لولپێچی فافۆن بە دەستچن',
      ar: 'فولاذ مشكّل حرارياً مع تطعيمات النحاس الأصفر',
      en: 'Forged Heat-Treated Steel with Brass Inlays',
    },
    year: 2024,
    dimensions: '110 × 75 × 60 cm',
    imageUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    has3DModel: true,
    hasPedestal: false,
    modelScale: 1.5,
    modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
    modelVertices: '410,000 Vertices',
    modelPolygons: '820,000 Triangles',
    featured: false,
    description: {
      ckb: 'پەیکەرێکی مۆدێرن بە بەکارهێنانی کەرەستەی پیشەسازی و پارچە ئاسنی بەجێماو بۆ دروستکردنی شێوەی باڵندەیەکی باڵکراوە.',
      ar: 'منحوتة معاصرة تعيد تدوير الفولاذ الصناعي لتشكيل طائر ينبسط جناحاه نحو أفق السلام.',
      en: 'A contemporary kinetic-feeling sculpture re-forging industrial steel fragments into an outstretched bird soaring toward enduring peace.',
    },
    locationInInstitute: {
      ckb: 'هۆڵی چوونەژوورەوەی سەرەکی پەیمانگە',
      ar: 'بهو الاستقبال الرئيسي للمعهد',
      en: 'Institute Grand Entrance Foyer',
    },
    provenancePedestal: 'FOYER-MAIN-ENTRY',
    physicalPlaqueCode: 'CFA-2024-SC-010',
    atelierTools: [
      { ckb: 'کۆمەڵە قەڵەمی نەخشاندنی پۆڵا', ar: 'أزاميل الحفر الفولاذية', en: 'Hardened Steel Chisels' },
    ],
    toolSlugs: ['hardened-steel-chisels'],
  },
  {
    id: 'art-011',
    slug: 'garmian-ceramic-amphora',
    title: {
      ckb: 'کوزەی دێرینی گەرمیان',
      ar: 'جرة كرميان الخزفية',
      en: 'Garmian Ceramic Amphora',
    },
    artist: {
      ckb: 'هەڵوێست ئەحمەد عەزیز',
      ar: 'هلوست أحمد عزيز',
      en: 'Halwest Ahmed Aziz',
    },
    artistId: 'halwest-ahmed-aziz',
    artistBio: {
      ckb: 'خوێندکاری بەشی سیرامیک؛ خاوەنی توێژینەوە لەسەر قوڕ و کانزاکانی ناوچەی چەمچەماڵ و شێوازی نەریتی سوورکردنەوەی گڵینە.',
      ar: 'فنان وباحث في قسم الخزف والسيراميك، متخصص في استخراج الطين المحلي وتقنيات الحرق التقليدي.',
      en: 'Ceramicist and materials researcher exploring local Garmian clays and traditional kiln reduction techniques.',
    },
    artistGraduationYear: 2020,
    category: 'ceramics',
    categoryLabel: DEPARTMENT_LABELS.ceramics,
    department: 'ceramics',
    departmentLabel: DEPARTMENT_LABELS.ceramics,
    medium: {
      ckb: 'قوڕی سوورەوەکراوی ناوچەی گەرمیان، لەعاب و جامی نەریتی',
      ar: 'طين محلي محروق مع طبقة تزجيج حرارية تقليدية',
      en: 'Fired terracotta clay, mineral glaze reduction',
    },
    year: 2023,
    dimensions: '42 × 30 × 30 cm',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    has3DModel: false,
    featured: true,
    description: {
      ckb: 'کوزەیەکی هونەری تایبەت لە قوڕی سووری گەرمیان، بە شێوازی نەریتی لە کورەی پەیمانگەدا بە پلەی گەرمیی بەرز سوورکراوەتەوە.',
      ar: 'جرة خزفية فنية مستوحاة من أواني كرميان التاريخية، نُفذت في أفران المعهد بدرجات حرارة عالية.',
      en: 'An artistic ceramic amphora crafted from indigenous Garmian red clay, fired in the institute kiln at high temperature.',
    },
    locationInInstitute: {
      ckb: 'ستۆدیۆی سیرامیک، هۆڵی پێشانگەی گڵینەکان',
      ar: 'استوديو الخزف، قاعة معروضات الطين',
      en: 'Ceramics Atelier, Pottery Display Gallery',
    },
    provenancePedestal: 'CERAMICS-VASE-C01',
    physicalPlaqueCode: 'CFA-2023-CR-011',
    atelierTools: [
      { ckb: 'چەرخی سفالگەری و دەفرسازی', ar: 'عجلة الخزف اليدوية', en: 'Pottery Kick Wheel' },
      { ckb: 'کورەی گەرمیی سوورکردنەوە', ar: 'فرن حرق الخزف الحراري', en: 'High-Temperature Kiln' },
    ],
    toolSlugs: [],
  },
  {
    id: 'art-012',
    slug: 'terracotta-sun-mask',
    title: {
      ckb: 'پەیکەری تیشکی خۆری قەڵا',
      ar: 'منحوتة شمس القلعة التعبيرية',
      en: 'Citadel Sun Terracotta Mask',
    },
    artist: {
      ckb: 'دیدەن مستەفا کەریم',
      ar: 'ديدن مصطفى كريم',
      en: 'Diden Mustafa Karim',
    },
    artistId: 'diden-mustafa-karim',
    artistBio: {
      ckb: 'پەیکەرساز لە بەشی پەیکەرسازی؛ داهێنەری شێوازی تێکەڵکردنی برۆنز و گڵینەی نەریتی لە پەیمانگە.',
      ar: 'نحات بقسم النحت، رائد في المزج بين البرونز والطين النضيج في المعهد.',
      en: 'Sculptor at the Sculpture Department, pioneering mixed bronze and terracotta forms.',
    },
    artistGraduationYear: 2021,
    category: 'sculpture',
    categoryLabel: DEPARTMENT_LABELS.sculpture,
    department: 'sculpture',
    departmentLabel: DEPARTMENT_LABELS.sculpture,
    medium: {
      ckb: 'پەیکەری برۆنز و بەردی بازاڵتی سروشتی',
      ar: 'برونز مصبوب وقاعدة من حجر البازلت الطبيعي',
      en: 'Cast Bronze on Natural Basalt Plinth',
    },
    year: 2023,
    dimensions: '75 × 45 × 35 cm',
    imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    has3DModel: false,
    featured: true,
    description: {
      ckb: 'پەیکەرێکی مۆدێرن کە گێڕانەوەی ڕووناکی و قوربانیدانی مێژوویی ناوچەکەیە لە ڕێگەی فۆرمی برۆنزی ئاڵۆز و بەردی سروشتی.',
      ar: 'منحوتة برونزية تعبيرية تجسد ثيمات النور والذاكرة التاريخية من خلال تشكيلات بصرية حرة.',
      en: 'An expressive cast bronze sculpture capturing motifs of illumination and historic memory on a raw basalt base.',
    },
    locationInInstitute: {
      ckb: 'هۆڵی سەرەکی پەیکەرسازی، سەکۆی ئازادی',
      ar: 'قاعة النحت الكبرى، منصة الحرية',
      en: 'Sculpture Grand Gallery, Freedom Plinth',
    },
    provenancePedestal: 'SCULPTURE-PLINTH-S03',
    physicalPlaqueCode: 'CFA-2023-SC-012',
    atelierTools: [
      { ckb: 'چەکوشی پەیکەرسازی و سکارپێل', ar: 'أزاميل النحت الاحترافية', en: 'Sculpting Chisels' },
    ],
    toolSlugs: [],
  },
];
