export type ArtworkCategory = 'all' | 'painting' | 'sculpture' | 'ceramics' | 'design' | 'music' | 'theater';

export type ArtworkDepartment = 'painting' | 'sculpture' | 'mixed';

export interface LocalizedString {
  ckb: string;
  ar: string;
  en: string;
}

export const DEPARTMENT_OPTIONS: { key: ArtworkDepartment; label: LocalizedString }[] = [
  {
    key: 'painting',
    label: {
      ckb: 'بەشی وێنەکێشان',
      ar: 'قسم الرسم',
      en: 'Painting Department',
    },
  },
  {
    key: 'sculpture',
    label: {
      ckb: 'بەشی پەیکەرسازی',
      ar: 'قسم النحت',
      en: 'Sculpture Department',
    },
  },
  {
    key: 'mixed',
    label: {
      ckb: 'بابەتی تێکەڵاو',
      ar: 'الوسائط المختلطة',
      en: 'Mixed Media Department',
    },
  },
];

export const DEPARTMENT_LABELS: Record<ArtworkDepartment, LocalizedString> = {
  painting: {
    ckb: 'بەشی وێنەکێشان',
    ar: 'قسم الرسم',
    en: 'Painting Department',
  },
  sculpture: {
    ckb: 'بەشی پەیکەرسازی',
    ar: 'قسم النحت',
    en: 'Sculpture Department',
  },
  mixed: {
    ckb: 'بابەتی تێکەڵاو',
    ar: 'الوسائط المختلطة',
    en: 'Mixed Media Department',
  },
};

export function getArtworkDepartment(art: { department?: ArtworkDepartment | LocalizedString; category?: string }): ArtworkDepartment {
  if (art.department === 'painting' || art.department === 'sculpture' || art.department === 'mixed') {
    return art.department;
  }
  if (typeof art.department === 'object' && art.department) {
    const ckb = (art.department.ckb || '').toLowerCase();
    const en = (art.department.en || '').toLowerCase();
    if (ckb.includes('پەیکەر') || en.includes('sculpt') || art.category === 'sculpture' || art.category === 'ceramics') {
      return 'sculpture';
    }
    if (ckb.includes('تێکەڵ') || en.includes('mixed') || art.category === 'design' || art.category === 'music' || art.category === 'theater') {
      return 'mixed';
    }
    return 'painting';
  }
  if (art.category === 'sculpture' || art.category === 'ceramics') return 'sculpture';
  if (art.category === 'design' || art.category === 'music' || art.category === 'theater') return 'mixed';
  return 'painting';
}

export function getArtworkDepartmentLabel(
  department: ArtworkDepartment | LocalizedString | undefined,
  locale: 'ckb' | 'ar' | 'en' = 'ckb'
): string {
  if (!department) return '';
  if (typeof department === 'string') {
    const label = DEPARTMENT_LABELS[department as ArtworkDepartment];
    return label ? (label[locale] || label.ckb) : department;
  }
  return department[locale] || department.ckb || department.en || '';
}

export interface Artwork {
  id: string;
  slug: string;
  title: LocalizedString;
  artist: LocalizedString;
  artistId: string;
  artistBio: LocalizedString;
  artistGraduationYear: number;
  category: 'painting' | 'sculpture' | 'ceramics' | 'design' | 'music' | 'theater';
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
    count: 3,
  },
  {
    key: 'sculpture',
    label: {
      ckb: 'پەیکەرسازی',
      ar: 'النحت والتجسيم',
      en: 'Sculpture',
    },
    count: 3,
  },
  {
    key: 'ceramics',
    label: {
      ckb: 'سیرامیک',
      ar: 'الخزف الفني',
      en: 'Ceramics',
    },
    count: 2,
  },
  {
    key: 'design',
    label: {
      ckb: 'دیزاین و گرافیک',
      ar: 'التصميم والطباعة',
      en: 'Design & Prints',
    },
    count: 2,
  },
  {
    key: 'music',
    label: {
      ckb: 'مۆسیقا',
      ar: 'الموسيقى',
      en: 'Music',
    },
    count: 1,
  },
  {
    key: 'theater',
    label: {
      ckb: 'شانۆ',
      ar: 'المسرح',
      en: 'Theater',
    },
    count: 1,
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
    categoryLabel: {
      ckb: 'سیرامیک',
      ar: 'الخزف الفني',
      en: 'Ceramics',
    },
    department: 'sculpture',
    departmentLabel: {
      ckb: 'بەشی سیرامیک و هونەرە ئاگرینەکان',
      ar: 'قسم الخزف والفنون النارية',
      en: 'Ceramics & Fire Arts Dept.',
    },
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
    category: 'design',
    categoryLabel: {
      ckb: 'دیزاین و گرافیک',
      ar: 'التصميم والطباعة',
      en: 'Design & Prints',
    },
    department: 'mixed',
    departmentLabel: {
      ckb: 'بابەتی تێکەڵاو',
      ar: 'قسم التصميم الجرافيكي وفنون الطباعة',
      en: 'Graphic Design & Printmaking Dept.',
    },
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
    categoryLabel: {
      ckb: 'سیرامیک',
      ar: 'الخزف الفني',
      en: 'Ceramics',
    },
    department: 'sculpture',
    departmentLabel: {
      ckb: 'بەشی پەیکەرسازی و سیرامیک',
      ar: 'قسم الخزف الفني',
      en: 'Ceramics Department',
    },
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
    category: 'design',
    categoryLabel: {
      ckb: 'دیزاین و گرافیک',
      ar: 'التصميم والطباعة',
      en: 'Design & Prints',
    },
    department: 'mixed',
    departmentLabel: {
      ckb: 'بابەتی تێکەڵاو',
      ar: 'قسم التصميم والاتصال البصري',
      en: 'Design & Visual Communication Dept.',
    },
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
    slug: 'garmian-string-reverie',
    title: {
      ckb: 'ئاوازی تاری گەرمیان • مەقامی بەیات',
      ar: 'أنغام تار كرميان • مقام بيات',
      en: 'Garmian String Reverie • Bayat Maqam',
    },
    artist: {
      ckb: 'هەڵوێست ئەحمەد عەزیز',
      ar: 'هلوست أحمد عزيز',
      en: 'Halwest Ahmed Aziz',
    },
    artistId: 'halwest-ahmed-aziz',
    artistBio: {
      ckb: 'مۆسیقاژەن و ژەنیاری ئامێری تار لە بەشی مۆسیقا؛ خاوەنی توێژینەوەی دەنگی لەسەر فۆلکلۆری ناوچەی چەمچەماڵ.',
      ar: 'عازف تار وباحث في التراث الصوتي والمقامات الكردية في منطقة جمجمال.',
      en: 'Master lutenist and acoustic researcher at the Music Department, specializing in Garmian folklore.',
    },
    artistGraduationYear: 2020,
    category: 'music',
    categoryLabel: {
      ckb: 'مۆسیقا',
      ar: 'الموسيقى',
      en: 'Music',
    },
    department: 'mixed',
    departmentLabel: {
      ckb: 'بەشی مۆسیقا',
      ar: 'قسم الموسيقى',
      en: 'Music Department',
    },
    medium: {
      ckb: 'تۆماری ئاوازی دەنگ و ژەنینی تاری کلاسیکی کوردی',
      ar: 'تسجيل موسيقي حي لآلة التار مع توثيق نغمي',
      en: 'Acoustic Kurdish Tar Performance & Archival Master Audio',
    },
    year: 2023,
    dimensions: 'Audio Recording • 04:05 min',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    has3DModel: false,
    featured: true,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    audioDurationSeconds: 245,
    description: {
      ckb: 'تۆمارێکی زەینی لە مەقامی کوردی بە ئامێری تاری دەستکردی دارگوێز، کە لە ستۆدیۆی تۆمارکردنی پەیمانگە ئەنجامدراوە.',
      ar: 'تسجيل استثنائي للمقامات الكردية بآلة التار المصنوعة يدوياً من خشب الجوز، تم توثيقه في استوديو المعهد.',
      en: 'A sublime recording of Kurdish traditional Maqam performed on a handcrafted walnut Tar, captured in the institute acoustic hall.',
    },
    locationInInstitute: {
      ckb: 'ستۆدیۆی مۆسیقا و دەنگکاری، هۆڵی کۆنسێرت',
      ar: 'استوديو الموسيقى والصوتيات، قاعة الحفلات',
      en: 'Music & Sound Studio, Concert Pavilion',
    },
    provenancePedestal: 'STUDIO-REC-M01',
    physicalPlaqueCode: 'CFA-2023-MU-011',
    atelierTools: [
      { ckb: 'تاری کوردی دارگوێز', ar: 'تار كوردي من خشب الجوز', en: 'Handcrafted Walnut Tar' },
    ],
    toolSlugs: [],
  },
  {
    id: 'art-012',
    slug: 'shadows-of-the-citadel-stage',
    title: {
      ckb: 'شانۆگەری سێبەرەکانی قەڵا',
      ar: 'مسرحية ظلال القلعة',
      en: 'Shadows of the Citadel Stage',
    },
    artist: {
      ckb: 'دیدەن مستەفا کەریم',
      ar: 'ديدن مصطفى كريم',
      en: 'Diden Mustafa Karim',
    },
    artistId: 'diden-mustafa-karim',
    artistBio: {
      ckb: 'دەرهێنەر و ئەکتەری بەشی شانۆ، داهێنەری شێوازی سینۆگرافیای سێبەر و نواندنی جەستەیی لە پەیمانگە.',
      ar: 'مخرج وممثل بقسم المسرح، رائد في السينوغرافيا التعبيرية والمسرح الحركي.',
      en: 'Theatrical director and performer at the Theater Department, pioneering shadow scenography and physical drama.',
    },
    artistGraduationYear: 2021,
    category: 'theater',
    categoryLabel: {
      ckb: 'شانۆ',
      ar: 'المسرح',
      en: 'Theater',
    },
    department: 'mixed',
    departmentLabel: {
      ckb: 'بەشی شانۆ',
      ar: 'قسم المسرح',
      en: 'Theater Department',
    },
    medium: {
      ckb: 'نواندنی شانۆیی زیندوو، سینۆگرافیا و دیزاینی ڕووناکی',
      ar: 'عرض مسرحي حي، سينوغرافيا وتصميم الإضاءة الدرامية',
      en: 'Live Theatrical Performance, Scenography & Expressive Stage Lighting',
    },
    year: 2023,
    dimensions: 'Stage Production • 65 min',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    has3DModel: false,
    featured: true,
    description: {
      ckb: 'شانۆگەرییەکی درامی بەهێز کە لە هۆڵی شانۆی گەورەی پەیمانگە نمایشکرا؛ گێڕانەوەی قوربانیدانی گەلی کورد بە زمانی جەستە و سێبەر.',
      ar: 'عمل مسرحي تعبيري عُرض على مسرح المعهد الرئيسي؛ يجسد ذاكرة الصمود عبر السينوغرافيا الحركية ولغة الإضاءة.',
      en: 'A powerful theatrical production staged at the institute main theater hall; dramatizing historic resilience via expressive scenography and shadow play.',
    },
    locationInInstitute: {
      ckb: 'هۆڵی سەرەکی شانۆی پەیمانگە، سەکۆی ئازادی',
      ar: 'المسرح الرئيسي للمعهد، منصة الحرية',
      en: 'Main Theater Hall, Liberty Proscenium',
    },
    provenancePedestal: 'THEATER-STAGE-T01',
    physicalPlaqueCode: 'CFA-2023-TH-012',
    atelierTools: [
      { ckb: 'ڕووناکی سینۆگرافیای شانۆیی', ar: 'إضاءة مسرحية درامية', en: 'Theatrical Spotlights' },
    ],
    toolSlugs: [],
  },
];
