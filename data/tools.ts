export type ToolCategory = 'all' | 'painting' | 'sculpture' | 'ceramics' | 'calligraphy';

export interface LocalizedString {
  ckb: string;
  ar: string;
  en: string;
}

export interface AtelierTool {
  id: string;
  slug: string;
  name: LocalizedString;
  category: 'painting' | 'sculpture' | 'ceramics' | 'calligraphy';
  categoryLabel: LocalizedString;
  description: LocalizedString;
  historicalSignificance: LocalizedString;
  bestPractices: LocalizedString;
  materials: LocalizedString;
  origin: LocalizedString;
  glbUrl: string;
  imageUrl: string;
  galleryImages: string[];
  videoUrl: string;
  videoTitle: LocalizedString;
  audioDuration: string;
  usageInstructions: LocalizedString;
  proTips: {
    ckb: string[];
    ar: string[];
    en: string[];
  };
  usedInArtworkSlugs: string[];
}

export interface ToolCategoryOption {
  key: ToolCategory;
  label: LocalizedString;
}

export const TOOL_CATEGORIES: ToolCategoryOption[] = [
  {
    key: 'all',
    label: {
      ckb: 'هەموو کەرەستەکان',
      ar: 'جميع الأدوات',
      en: 'All Instruments',
    },
  },
  {
    key: 'painting',
    label: {
      ckb: 'شێوەکاری و ڕەنگ',
      ar: 'الرسم والتلوين',
      en: 'Painting & Pigments',
    },
  },
  {
    key: 'sculpture',
    label: {
      ckb: 'پەیکەرسازی و بەرد',
      ar: 'النحت وتشكيل الحجر',
      en: 'Sculpture & Stone',
    },
  },
  {
    key: 'ceramics',
    label: {
      ckb: 'سیرامیک و ئاگر',
      ar: 'الخزف والفنون النارية',
      en: 'Ceramics & Kiln',
    },
  },
  {
    key: 'calligraphy',
    label: {
      ckb: 'چاپ و تیپۆگرافی',
      ar: 'الطباعة والخط العربي',
      en: 'Printmaking & Calligraphy',
    },
  },
];

export const TOOLS_DATA: AtelierTool[] = [
  {
    id: 'tool-001',
    slug: 'horsehair-filbert-brush',
    name: {
      ckb: 'فڵچەی مووی ئەسپی فیلبێرت (Filbert #12)',
      ar: 'فرشاة شعر الخيل البيضاوية (فيلبرت 12)',
      en: 'Horsehair Filbert Archival Brush (#12)',
    },
    category: 'painting',
    categoryLabel: {
      ckb: 'شێوەکاری و ڕەنگ',
      ar: 'الرسم والتلوين',
      en: 'Painting',
    },
    description: {
      ckb: 'فڵچەیەکی سەر-هێلکەیی تایبەت بە کێشانی ڕەنگی زەیتی چڕ؛ مووەکانی لە یەکی ئەسپی خۆماڵی کوردستان دروست دەکرێت بۆ پاراستنی چەماوەیی و درەوشاوەیی ڕەنگ.',
      ar: 'فرشاة بيضاوية الرأس مصنوعة من شعر الخيل الكردي الطبيعي، تمنح الفنان مرونة عالية في دمج طبقات الزيت السميكة.',
      en: 'An oval-crowned archival brush hand-crafted from indigenous Kurdish horsehair, renowned for structural resilience under heavy impasto.',
    },
    historicalSignificance: {
      ckb: 'لەوەتەی دامەزراندنی پەیمانگەی چەمچەماڵەوە لە ساڵی ٢٠٠٠، ئەم جۆرە فڵچەیە بووەتە نیشانەی باڵای بەشی شێوەکاری لە کێشانی کەشوهەوای سروشتی گەرمیاندا.',
      ar: 'منذ تأسيس معهد جمجمال، مثلت هذه الفرشاة حجر زاوية في تدريب الطلبة على التقاط تضاريس وسماء كرميان الوعرة.',
      en: 'Since the founding of the Chamchamal Institute, this brush model has symbolized the academic lineage of capturing Garmian atmospheric light.',
    },
    bestPractices: {
      ckb: 'پێویستە پاش هەر دانیشتنێکی شێوەکاری بە سابوونی زەیتی زەیتوونی چەمچەماڵ و ئاوی شلەتێن بشۆردرێت بۆ ئەوەی ڕەق نەبێت.',
      ar: 'يُنصح بتنظيفها فور الانتهاء باستخدام صابون زيت الزيتون الطبيعي والماء الفاتر للحفاظ على ليونة الشعيرات الطبيعية.',
      en: 'Always clean immediately after sessions using natural olive oil soap and lukewarm water to preserve hair springiness.',
    },
    materials: {
      ckb: 'مووی ئەسپی خۆماڵی، تەوقەی مسین، دەسکی دارگوێز',
      ar: 'شعر خيل طبيعي، حلقة تثبيت نحاسية، مقبض من خشب الجوز',
      en: 'Kurdish horsehair, seamless brass ferrule, oiled walnut handle',
    },
    origin: {
      ckb: 'ئاتلیێی کەرەستەسازی پەیمانگەی چەمچەماڵ',
      ar: 'ورشة صناعة الأدوات - معهد جمجمال',
      en: 'Institute Artisan Atelier, Chamchamal',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'وانەی پراکتیکی: تەکنیکەکانی بەکارهێنانی فڵچەی فیلبێرت لە سروشتدا',
      ar: 'درس تطبيقي: أساليب استخدام فرشاة الفيلبرت في المناظر الطبيعية',
      en: 'Masterclass: Impasto & Blending with the Filbert Archival Brush',
    },
    audioDuration: '2:40',
    usageInstructions: {
      ckb: 'فڵچەکە بە گۆشەی ٣٠ پلە لەسەر قوماشەکە ڕابکێشە بۆ ئەوەی هێڵی پان دروست ببێت، و بۆ وردەکاری لێواری سەرەوەی بەکاربهێنە.',
      ar: 'اسحب الفرشاة بزاوية 30 درجة لإنشاء مساحات لونية عريضة، واستخدم الحافة المقوسة العليا للتفاصيل الدقيقة.',
      en: 'Drag at a 30-degree bevel across linen for broad chromatic strokes; rotate onto the crest for razor-thin contouring.',
    },
    proTips: {
      ckb: [
        'هەرگیز فڵچەکە لە ناو ڕۆندا بۆ ماوەی درێژ جێمەهێڵە تا دەسکەکەی نەئاوسێت.',
        'بە پەڕۆی لۆکە وشکی بکەرەوە و سەرەکەی بە پەنجە ڕێکبخەرەوە پێش هەڵگرتن.',
      ],
      ar: [
        'لا تترك الفرشاة منقوعة في المذيب لفترات طويلة لتجنب تآكل الصمغ الداخلي.',
        'أعد تشكيل الرأس المقوس بأصابعك بعد التجفيف وقبل الحفظ في الحافظة الخشبية.',
      ],
      en: [
        'Never soak suspended in turpentine overnight; solvent weakens internal epoxy resin.',
        'Reshape the wet dome between thumb and forefinger before horizontal curing.',
      ],
    },
    usedInArtworkSlugs: ['echoes-of-garmian', 'motherhood-and-rebirth'],
  },
  {
    id: 'tool-002',
    slug: 'hardened-steel-chisels',
    name: {
      ckb: 'کۆمەڵە قەڵەمی نەخشاندنی پۆڵای پەیکەرسازی',
      ar: 'أزاميل الحفر والنحت من الفولاذ المقسى',
      en: 'Hardened Steel Sculptor Chisel Suite',
    },
    category: 'sculpture',
    categoryLabel: {
      ckb: 'پەیکەرسازی و بەرد',
      ar: 'النحت وتشكيل الحجر',
      en: 'Sculpture',
    },
    description: {
      ckb: 'کۆمەڵە قەڵەمێکی پۆڵایینی گەرمکراو بە ئاگر بۆ تاشین و وردەکاریی بەردی کلس و مەڕمەڕی شاخەکانی دەوروبەری چەمچەماڵ.',
      ar: 'مجموعة أزاميل مطروقة يدوياً من الفولاذ الكربوني الصلب، مخصصة لنحت صخور الكلس والرخام الجبلي المتين.',
      en: 'Hand-forged carbon steel chisels heat-treated specifically for sculpting dense mountain limestone and regional alabaster.',
    },
    historicalSignificance: {
      ckb: 'شێوازی تاشینی ئاشووری و ماددی لە چیاکانی سلێمانی و کەرکووک بە پێشەنگی ئەم جۆرە ئامرازە گەیشتووەتە ئەمڕۆ.',
      ar: 'تستند هذه الأزاميل إلى التقاليد الميدية والآشورية القديمة في نحت الصخور والمنحوتات الجدارية التاريخية.',
      en: 'Rooted in ancient Median and Assyrian stone-carving traditions revived for modern public monumental sculpture.',
    },
    bestPractices: {
      ckb: 'بە گۆشەی ٤٥ پلە بەکاربهێنرێت لەگەڵ مارتۆڵی داردار بۆ ڕێگریکردن لە شەقبوونی کتوپڕی بلوری بەردەکە.',
      ar: 'تُضرب بزاوية 45 درجة بواسطة مطرقة خشبية لامتصاص الصدمات وتجنب تصدع البنية البلورية للحجر.',
      en: 'Strike at a disciplined 45-degree angle with wooden mallets to prevent shock cracking within regional limestone.',
    },
    materials: {
      ckb: 'پۆڵای کاربۆنی T10، ڕووی ئۆکسیدکراو',
      ar: 'فولاذ كربوني T10 معالج بالحرارة',
      en: 'High-carbon T10 tool steel with oxide patina finish',
    },
    origin: {
      ckb: 'ئاسنگەری تەقلیدی قەزای چەمچەماڵ',
      ar: 'حدادة جمجمال الحرفية التراثية',
      en: 'Chamchamal Traditional Blacksmith Guild',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1561839561-b13bcfe95249?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'تاشینی بەردی مەڕمەڕ بە قەڵەمی دەستی',
      ar: 'تقنيات نحت الصخور الجبلية بالأزاميل الفولاذية',
      en: 'Architectural Stone Carving with Hand-Forged Chisels',
    },
    audioDuration: '3:15',
    usageInstructions: {
      ckb: 'بە دەستی چەپ قەڵەمەکە لە خاڵی مەبەست جێگیر بکە و بە مارتۆڵی کێش مامناوەند بە لێدانی هاوسەنگ لە تەوقەکەی بدە.',
      ar: 'ثبت رأس الإزميل بإحكام على نقطة النحت واضرب بمطرقة النحت بضربات موزونة ومتكررة.',
      en: 'Index the tungsten carbide tip against bedding planes; strike with consistent cadences using beechwood mallets.',
    },
    proTips: {
      ckb: [
        'پێش دەستپێکردن بە بەردی نەوتینە دەمەکەی تیژ بکەرەوە.',
        'هەمیشە چاویلکەی پارێزەر بەکاربهێنە لە کاتی تاشینی بەرددا.',
      ],
      ar: [
        'اشحذ النصل بحجر الزيت الطبيعي قبل كل جلسة عمل.',
        'ارتدِ نظارات السلامة الواقية دائماً لتجنب الشظايا الحجرية المتطايرة.',
      ],
      en: [
        'Dress chisel bevels with Arkansas oilstones prior to precision letter carving.',
        'Always equip impact goggles to defend against quartz micro-spalling.',
      ],
    },
    usedInArtworkSlugs: ['chamchamal-freedom-monument', 'bust-of-the-nomad-weaver'],
  },
  {
    id: 'tool-003',
    slug: 'chamchamal-mineral-clay',
    name: {
      ckb: 'قوڕی سووری کانزایی چەمچەماڵ و گەرمیان',
      ar: 'طين كرميان الأحمر الغني بالمعادن',
      en: 'Garmian Mineral Terracotta Clay',
    },
    category: 'ceramics',
    categoryLabel: {
      ckb: 'سیرامیک و ئاگر',
      ar: 'الخزف والفنون النارية',
      en: 'Ceramics',
    },
    description: {
      ckb: 'قوڕێکی سروشتیی دەوڵەمەند بە ئۆکسیدی ئاسن و مەگنسیۆم کە لە ڕووباری باسەڕە و دۆڵەکانی چەمچەماڵ بە پاککراوەیی دەردەهێنرێت و ٩٠ ڕۆژ دەمێنێتەوە بۆ پێگەیشتن.',
      ar: 'طين طبيعي غني بأكاسيد الحديد والمغنيسيوم يُستخرج من وديان جمجمال بعد تصفيته وتخميره لمدة 90 يوماً.',
      en: 'A natural sedimentary red clay packed with iron oxides harvested from Basara river valley deposits, aged for 90 days in stone vats.',
    },
    historicalSignificance: {
      ckb: 'کەلەپووری گڵینەی گەرمیان زیاتر لە سێ هەزار ساڵە بەم خاکە سوورە ئاوێتە کراوە و لە ئەرشیفی پەیمانگەدا بە زیندوویی دەپارێزرێت.',
      ar: 'يعود استخدام هذا الطين إلى أكثر من ثلاثة آلاف عام في حضارات بلاد ميزوبوتاميا، ويُعتمد رسمياً في تدريس الخزف.',
      en: 'Carries a continuous 3,000-year ceramic heritage across Mesopotamian foothills, preserved through institute studio curricula.',
    },
    bestPractices: {
      ckb: 'دەبێت لە پلەی ٩٥٠ پلەی سەدی بسووتێنرێت بۆ پڕوژاندن (بیسکوییت)، پاشان تا ١٢٠٠ پلە بە خۆڵەمێش بگەیەنرێتە بریقەی شووشەیی.',
      ar: 'يُحرق حرقاً أولياً عند 950 مئوية، ثم يُرفع مع طلاء الرماد العضوي إلى 1200 مئوية لمنع التشققات.',
      en: 'Bisque fire at 950°C slowly, followed by high-fire glaze firing to 1200°C for impervious vitrification.',
    },
    materials: {
      ckb: 'خاکی سوور، گڵی کەناراو، ئۆکسیدی ئاسنی سروشتی',
      ar: 'سيليكات الألمنيوم الطبيعية مع شوائب أكاسيد الحديد',
      en: 'Pure iron-rich alluvial secondary clay body',
    },
    origin: {
      ckb: 'دۆڵی باسەڕە، چەمچەماڵ',
      ar: 'وادي باصرة، جمجمال',
      en: 'Basara Valley, Chamchamal',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/WaterBottle/glTF-Binary/WaterBottle.glb',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'شێلانی قوڕ و دروستکردنی کەشکۆڵی گڵینە لەسەر چەرخ',
      ar: 'عجن وتخمير طين كرميان وتشكيل الأواني الخزفية',
      en: 'Harvesting, Wedging & Throwing Local Basara Terracotta',
    },
    audioDuration: '2:15',
    usageInstructions: {
      ckb: 'قوڕەکە بە شێوازی سەری گوڵەبەڕۆژە بە باشی بشێلە تاوەکو هەموو تڵقە هەواکانی ناوی دەربچن و لە ناو فڕندا نەتەقێت.',
      ar: 'قم بعجن الطين بطريقة حلزونية لطرد فقاعات الهواء العالقة تماماً ومنع انفجار الآنية في الفرن.',
      en: 'Spiral wedge the clay mass for a minimum of 80 folds to purge entrapped micro-air voids prior to centering.',
    },
    proTips: {
      ckb: [
        'قوڕەکە لە شوێنی شێدار لە ژێر پەڕۆی تەڕدا هەڵبگرە تا کاتی بەکارهێنان.',
        'لە کاتی کارکردن لەسەر چەرخ ئاوی زۆر بەکارمەهێنە تا دیواری دەفرەکە داڕمان نەکات.',
      ],
      ar: [
        'احفظ الطين ملفوفاً بأقمشة رطبة في حاويات محكمة الإغلاق للحفاظ على لدونته.',
        'قلل استخدام الماء أثناء التشكيل على العجلة لتجنب تشبع الجدران الخزفية وهبوطها.',
      ],
      en: [
        'Store wrapped under damp linen in sealed zinc bins to optimize plastic microbial ripening.',
        'Minimize lubricative slip water on the wheel to forestall premature wall fatigue.',
      ],
    },
    usedInArtworkSlugs: ['garmian-earthen-amphora', 'solar-ceramic-vessel'],
  },
  {
    id: 'tool-004',
    slug: 'pfeil-linocut-gouges',
    name: {
      ckb: 'تاشەرە گۆشەییەکانی لایلۆن و چاپی دەستی (Gouges)',
      ar: 'أزاميل الحفر على اللينوليوم والخشب للطباعة اليدوية',
      en: 'Precision Linocut & Woodblock Relief Gouges',
    },
    category: 'calligraphy',
    categoryLabel: {
      ckb: 'چاپ و تیپۆگرافی',
      ar: 'الطباعة والخط العربي',
      en: 'Printmaking',
    },
    description: {
      ckb: 'ئامرازی زۆر وردی هەڵکۆڵینی شێوە V و U لەسەر تەختە و لایلۆن بۆ بەرهەمهێنانی چاپی کالیگرافی و دیزاینی بینراو.',
      ar: 'أدوات حفر فائقة الحدة على شكل V و U لقطع صفائح اللينوليوم وتشكيل الحروفية الكردية بطباعة الإغاثة.',
      en: 'Ultra-sharp micro V and U profile carving gouges for executing intricate Kurdish typography into linoleum relief blocks.',
    },
    historicalSignificance: {
      ckb: 'لە ڕۆژنامەگەری و مێژووی پۆستەری سیاسی و شۆڕشگێڕیی کوردیدا، چاپی لایلۆن بەهێزترین چەکی بینراوی شێوەکاران بووە.',
      ar: 'شكّل الحفر على اللينوليوم الوسيط البصري الأقوى للملصقات الثقافية والثورية في تاريخ الفن الكردي الحديث.',
      en: 'The definitive graphic medium of 20th-century Kurdish cultural and literary posters throughout historical publishing eras.',
    },
    bestPractices: {
      ckb: 'هەمیشە دەستەکەی ترت لە پشت ئاراستەی تاشینەکە بێت بۆ پاراستنی پەنجەکان؛ لایلۆنەکە کەمێک گەرم بکە پێش تاشین.',
      ar: 'احرص على إبقاء اليد الحرة خلف اتجاه الحفر دائماً، وقم بتدفئة لوح اللينوليوم قليلاً لتسهيل الانزلاق.',
      en: 'Always keep your non-dominant hand behind the cutting vector; warm linoleum slightly before fine lettering passes.',
    },
    materials: {
      ckb: 'پۆڵای بەهێزکراوی سویسری، دەسکی دارقەزوان',
      ar: 'فولاذ كرومي سويسري مقسى، مقبض من خشب الكمثرى',
      en: 'Swiss tempered alloy steel, ergonomic pearwood mushroom handle',
    },
    origin: {
      ckb: 'بەشی دیزاین و پەیوەندییە بینراوەکان، چەمچەماڵ',
      ar: 'قسم التصميم والطباعة، جمجمال',
      en: 'Graphic Arts Atelier, Chamchamal',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenCloth/glTF-Binary/SheenCloth.glb',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'تاشینی کالیگرافی کوردی لەسەر لایلۆن و چاپی دەستی',
      ar: 'حفر الخط الكردي المعاصر على ألواح اللينوليوم',
      en: 'Relief Typography Carving & Proofing Techniques',
    },
    audioDuration: '1:50',
    usageInstructions: {
      ckb: 'دەسکی تاشەرەکە لە ناودەستت دابنێ و پەنجەی ئاماژەت لەسەر پشتی پۆڵاکە بێت بۆ کۆنتڕۆڵکردنی قووڵیی بڕینەکە.',
      ar: 'ضع المقبض في راحة يدك ووجه نصل الحفر بسبابتك للتحكم في عمق الخطوط المحفورة بدقة.',
      en: 'Seat the mushroom grip in your palm; brace index finger along the blade spine to govern micro-groove depth.',
    },
    proTips: {
      ckb: [
        'بۆ هێڵی زۆر باریک تاشەری V بەکاربهێنە، و بۆ چۆڵکردنی پاشبنەما تاشەری شێوە U.',
        'پێش چاپکردن بە ڕەنگی ڕەش، سەیری تابلێتەکەت بکە لە ژێر تیشکی لاری لامپادا.',
      ],
      ar: [
        'استخدم شفرة V للتفاصيل الدقيقة والخطوط الحادة، وشفرة U لتفريغ المساحات الكبيرة.',
        'افحص القالب تحت إضاءة مائلة للتأكد من نظافة الحواف قبل توزيع الحبر.',
      ],
      en: [
        'Reserve tight 60° V-tools for delicate diacritics; deploy broad U-gouges for negative ground clearing.',
        'Inspect relief blocks under raking sidelight to detect un-cleared burrs before inking.',
      ],
    },
    usedInArtworkSlugs: ['symbols-of-memory-and-resilience', 'kurdish-geometric-disruption'],
  },
  {
    id: 'tool-005',
    slug: 'italian-palette-knives',
    name: {
      ckb: 'سکینی شێوەکاری ئیتاڵی (Spring Palette Knife)',
      ar: 'سكين مزج وتطبيق الألوان الزيتية المرنة',
      en: 'Forged Italian Spring Palette Knife',
    },
    category: 'painting',
    categoryLabel: {
      ckb: 'شێوەکاری و ڕەنگ',
      ar: 'الرسم والتلوين',
      en: 'Painting',
    },
    description: {
      ckb: 'سکینێکی پەڕی پۆڵای بەهێز و گەڕاوە بۆ لێدانی ڕەنگی تەخت و دروستکردنی چینە زبرەکانی تابلۆ هاوچەرخەکان.',
      ar: 'نصل فولاذي مرن يسمح بتطبيق طبقات زيتية مسطحة وبارزة (إمباستو) بدقة ودون تشويه تدرج اللون.',
      en: 'Single-piece forged spring blade allowing dramatic architectural impasto applications across primed linen panels.',
    },
    historicalSignificance: {
      ckb: 'ئەم ئامرازە بووەتە هێمای گۆڕانی شێوەکاریی کلاسیک بۆ ڕێبازی تەعبیری و ئیمپرێشنیزمی هاوچەرخی پەیمانگە.',
      ar: 'يمثل هذا السكين تحول معهد جمجمال من الأسلوب الأكاديمي الكلاسيكي إلى التعبيرية والتركيب اللوني الجريء.',
      en: 'Represents the modern pedagogical shift at Chamchamal from strict academic realism toward expressive chromatic structures.',
    },
    bestPractices: {
      ckb: 'پێش گۆڕینی ڕەنگ لە تەشتەکەدا، دەمەکەی بە پەڕۆی کەتان بەتەواوی پاکبکەرەوە تاوەکو درەوشاوەیی ڕەنگەکان پارێزراو بێت.',
      ar: 'امسح النصل بقطعة قماش قطنية بين كل مسحة وأخرى للحفاظ على نقاء الألوان وتجنب عتامة الطبقات.',
      en: 'Wipe blade clean with lint-free cotton between color transitions to maintain luminous color boundaries.',
    },
    materials: {
      ckb: 'پۆڵای پەڕی نەرم، ملپێچی مس، دارگوێزی پۆڵیشکراو',
      ar: 'فولاذ نابضي مقاوم للصدأ، مقبض جوز مريح',
      en: 'Flexible stainless spring steel, brass collar, contoured walnut handle',
    },
    origin: {
      ckb: 'هاوردەکراو و تایبەتکراو لە ئاتلیێی پەیمانگە',
      ar: 'مستورد ومعدل في أتيليه المعهد',
      en: 'Fine Arts Studio Imports, Chamchamal',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxVertexColors/glTF-Binary/BoxVertexColors.glb',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'تەکنیکی ئیمپاستۆ و دروستکردنی چینەکانی ڕەنگ بە سکینی شێوەکاری',
      ar: 'تقنية الإمباستو وبناء الملامس اللونية البارزة بالسكين',
      en: 'Impasto Architecture: Structuring Heavy Oils with the Palette Knife',
    },
    audioDuration: '2:05',
    usageInstructions: {
      ckb: 'ڕەنگەکە لەسەر پشتی سکینەکە هەڵبگرە و بە گۆشەیەکی نەرم بەسەر کانڤاسەکەدا بێ پەستانێکی زۆر پەخشی بکەرەوە.',
      ar: 'التقط كتلة اللون على ظهر النصل ومررها بنعومة وانسيابية فوق القماش دون ضغط زائد.',
      en: 'Load butter-thick paint solely onto the blade underbelly; skim flush across the canvas with zero perpendicular pressure.',
    },
    proTips: {
      ckb: [
        'دەتوانیت لێواری تیژی سکینەکە بۆ کێشانی هێڵی ڕاست و چڵەدارەکان بەکاربهێنیت.',
        'هەمیشە دەمەکەی لە کێشانی ڕەنگدا نەرمی خۆی دەپارێزێت ئەگەر پەستانی زۆری لێ نەکەیت.',
      ],
      ar: [
        'استخدم الحافة الجانبية الحادة للنصل لرسم الخطوط الهندسية الرفيعة والأغصان.',
        'حافظ على مرونة النصل بتجنب ثنيه إلى زوايا حادة تتجاوز مرونته الطبيعية.',
      ],
      en: [
        'Utilize the razor edge like a mechanical ruling pen for crisp structural vertical lines.',
        'Avoid extreme 90-degree flexure that risks permanent blade warpage.',
      ],
    },
    usedInArtworkSlugs: ['echoes-of-garmian', 'dance-of-piramagrun-planes'],
  },
  {
    id: 'tool-006',
    slug: 'raku-heavy-tongs',
    name: {
      ckb: 'گازەی درێژی دەرهێنانی ڕاکۆ لە فڕن (Raku Tongs)',
      ar: 'كماشة الراكوا الفولاذية العازلة للحرارة العالية',
      en: 'Heavy-Duty 1000°C Raku Firing Tongs',
    },
    category: 'ceramics',
    categoryLabel: {
      ckb: 'سیرامیک و ئاگر',
      ar: 'الخزف والفنون النارية',
      en: 'Ceramics',
    },
    description: {
      ckb: 'ئامرازێکی درێژی پۆڵایین بۆ گرتنی دەفرە سوورکراوە گەرمەکان لە نێو فڕنی ١٠٠٠ پلە و خستنە نێو دووکەڵی چڵەدارەکان.',
      ar: 'كماشة فولاذية بطول متر كامل للتعامل مع الآنية الخزفية وهي تتوهج عند 1000 مئوية ونقلها لبراميل الاختزال بالدخان.',
      en: 'One-meter long forged steel tongs engineered to seize incandescent 1000°C vessels directly from open kilns into reduction bins.',
    },
    historicalSignificance: {
      ckb: 'بەکارهێنانی ئەم گازەیە بۆ یەکەمجار لە ساڵی ٢٠١٩ لە بەشی سیرامیک تەکنیکی ڕاکۆی ئۆرگانیکی هێنایە ناو پەروەردەی هونەری چەمچەماڵ.',
      ar: 'أدخل هذا الأسلوب تقنيات الراكوا اليابانية الممزوجة بالدخان الكردي لأول مرة في مناهج المعهد سنة 2019.',
      en: 'Catalyzed the landmark 2019 introduction of pyrotechnic Raku firing using Kurdish mountain oak smoke reduction.',
    },
    bestPractices: {
      ckb: 'هەمیشە دەستکێشی چەرمی ئەستووری کەڤلەر بەکاربهێنە؛ دەفرەکە تەنها لە قەراغە ئەستوورەکانەوە بگرە.',
      ar: 'ارتدِ قفازات الكيفلار العازلة للحرارة، وتجنب الإمساك بالحواف الرقيقة للآنية وهي متوهجة بالحرارة.',
      en: 'Always pair with high-grade Kevlar gauntlets; grasp vessels only by structural feet or reinforced rims.',
    },
    materials: {
      ckb: 'پۆڵای ئەستووری چەماوەی گەرمی، دەسکی دابڕاو',
      ar: 'فولاذ صناعي مطروق ومقاوم للصدمات الحرارية',
      en: 'Heavy-gauge forged wrought steel with insulated leather grip',
    },
    origin: {
      ckb: 'کارگەی ئامێرسازیی پەیمانگە',
      ar: 'ورشة الميكانيك والتجهيز - معهد جمجمال',
      en: 'Institute Fabrication Shop, Chamchamal',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Lantern/glTF-Binary/Lantern.glb',
    imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'سووتاندنی ڕاکۆ لە پلەی هەزار پلە و دووکەڵکاری لە پەیمانگەدا',
      ar: 'حرق الراكوا المباشر وتقنيات الاختزال بالدخان',
      en: 'Thermal Shock & Lustre: Live 1000°C Raku Reduction',
    },
    audioDuration: '2:30',
    usageInstructions: {
      ckb: 'کاتێک گلازەکە لە فڕندا دەتوێتەوە و دەبریسکێتەوە، فڕنەکە بکەرەوە و بە گازەکە بە هێمنی دەفرەکە دەربێنە و بیخەرە ناو بەرمیلی چڵەدارەکان.',
      ar: 'عند ذوبان الطلاء وتوهجه داخل الفرن، افتح الغطاء وأحكم قبضة الكماشة حول قاعدة الإناء وانقله مباشرة لحاوية الدخان.',
      en: 'When the glaze reflects like liquid mirror in the kiln chamber, unseat the lid and cradle the base securely into the oak chaff vat.',
    },
    proTips: {
      ckb: [
        'دەفرەکە بۆ ماوەی دە چرکە لە هەوادا ڕابگرە پێش خستنە ناو دووکەڵ بۆ دروستبوونی تۆڕی شکان.',
        'قەپاغی بەرمیلەکە خێرا دابخە بۆ ئەوەی ئۆکسجین نەمێنێت و ڕەنگی مسین بەدەست بێت.',
      ],
      ar: [
        'عرض الإناء للهواء لمدة 10 ثوانٍ لتعزيز التصدعات الجمالية قبل إدخاله في الدخان.',
        'أغلق غطاء برميل الاختزال فوراً لحرمان القطعة من الأكسجين وإبراز بريق النحاس.',
      ],
      en: [
        'Hold the incandescent vessel in ambient air for 8 seconds to promote fine craquelure before quenching.',
        'Seal reduction lids instantly to starve combustion of oxygen and yield saturated copper luster.',
      ],
    },
    usedInArtworkSlugs: ['solar-ceramic-vessel'],
  },
  {
    id: 'tool-007',
    slug: 'kurdish-natural-pigments',
    name: {
      ckb: 'ڕەنگدانە کانزایی و سروشتییەکانی کوردستان (Ochres & Lapis)',
      ar: 'الأكاسيد والأصباغ المعدنية الطبيعية الكردية',
      en: 'Indigenous Kurdistan Mineral Ochres & Pigments',
    },
    category: 'painting',
    categoryLabel: {
      ckb: 'شێوەکاری و ڕەنگ',
      ar: 'الرسم والتلوين',
      en: 'Painting',
    },
    description: {
      ckb: 'کۆکراوەی بەردی ئۆکسیدی ئاسن، زەردی ئۆکەر، و لاپیسی شاخەکانی قەرەداغ و پێنجوێن کە بە دەستاڕی بەردین دەهاڕدرێن بۆ دروستکردنی ڕەنگی زەیتی نەمر.',
      ar: 'مجموعة من الأكاسيد الطبيعية المستخرجة من جبال قره داغ وبينجوين، تُطحن بحجر الصوان لإنتاج أصباغ زيتية نقية وعالية الثبات.',
      en: 'Raw iron oxide earth, yellow ochres, and pulverized mineral lapis harvested from Qaradagh and Penjwen cliffs, ground with stone mullers.',
    },
    historicalSignificance: {
      ckb: 'شێوەکارانی کلاسیکی کورد بەر لە دروستبوونی کارگەکانی ڕەنگ لە ئەوروپا، بەم بەردە کانزاییانە کێشانی دیواربەندی مزگەوت و دێرەکانیان نەخشاندووە.',
      ar: 'اعتمد عليها فنانو وخطاطو كردستان لقرون في تلوين المخطوطات والمنمنمات قبل وصول الأصباغ الصناعية الحديثة.',
      en: 'Historic Kurdish manuscript illuminators and muralists utilized these indigenous pulverized minerals centuries before industrialized pigments.',
    },
    bestPractices: {
      ckb: 'بە دەستاڕی شووشەیی لەسەر مەڕمەڕ لەگەڵ ڕۆنی کەتانی چەمچەماڵ بهاڕدرێت تا نەرمی وەک هەویر دەبێت.',
      ar: 'تُطحن يدوياً بمدقة زجاجية مسطحة فوق لوح رخامي مع زيت الكتان الصافي حتى تصبح كالمعجون الحريري.',
      en: 'Mull on a chilled granite slab with cold-pressed linseed oil until an ultra-fine buttery suspension is achieved.',
    },
    materials: {
      ckb: 'ئۆکسیدی ئاسنی سوور و زەرد، بەردی شینایی، ڕۆنی کەتان',
      ar: 'أكاسيد حديدية صفراء وحمراء، حجر اللازورد، زيت الكتان',
      en: 'Crushed ferrous ochre, lapis lazuli shale, raw cold-pressed linseed oil',
    },
    origin: {
      ckb: 'شاخەکانی قەرەداغ و پێنجوێن',
      ar: 'جبال قره داغ وبينجوين',
      en: 'Qaradagh & Penjwen Ridges, Kurdistan',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Avocado/glTF-Binary/Avocado.glb',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'هاڕین و دروستکردنی ڕەنگی زەیتی بە بەردی سروشتی',
      ar: 'طحن الأصباغ الطبيعية وتحضير الألوان الزيتية التراثية',
      en: 'Stone Milling & Hand-Crafting Historical Oil Pigments',
    },
    audioDuration: '3:00',
    usageInstructions: {
      ckb: 'کەمێک تۆزی ڕەنگەکە لە ناوەڕاستی مەڕمەڕەکە دابنێ، کونێک لە ناوەڕاستی بکە و دڵۆپ دڵۆپ ڕۆنی تێبکە پێش هاڕین.',
      ar: 'اصنع فوهة بركانية صغيرة في كومة الصباغ المسحوق وأضف زيت الكتان قطرة بقطرة أثناء الطحن الدائري.',
      en: 'Form a crater in the dry pigment mound; introduce linseed oil dropwise while grinding in rhythmic figure-eight strokes.',
    },
    proTips: {
      ckb: [
        'ڕەنگی خۆماڵی بەرگرییەکی بێوێنەی هەیە بەرامبەر تیشکی خۆر و ڕووناکی مۆزەخانە.',
        'ڕۆنی کەتانی پاڵفتەکراو ڕێگری دەکات لە زەردبوونی ڕەنگە سپی و شینەکان لە داهاتوودا.',
      ],
      ar: [
        'تتميز الأصباغ الحجرية الطبيعية بثبات ضوئي فائق لا يتأثر بإضاءة المعارض لعقود.',
        'استخدم زيت الجوز مع الألوان الفاتحة وزيت الكتان مع الألوان الترابية الداكنة.',
      ],
      en: [
        'Mineral-origin ochres demonstrate absolute archival lightfastness rating (ASTM I).',
        'Employ walnut oil rather than flax oil for whites and blues to avert decadal yellowing.',
      ],
    },
    usedInArtworkSlugs: ['echoes-of-garmian', 'motherhood-and-rebirth'],
  },
  {
    id: 'tool-008',
    slug: 'vine-charcoal-sticks',
    name: {
      ckb: 'خەڵووزی دارینەی بێدەنگی کێشانی هێڵکاری (Willow Vine Charcoal)',
      ar: 'أفحام الصفصاف الطبيعية للرسم الأكاديمي التأسيسي',
      en: 'Kiln-Fired Natural Willow Vine Charcoal',
    },
    category: 'painting',
    categoryLabel: {
      ckb: 'شێوەکاری و ڕەنگ',
      ar: 'الرسم والتلوين',
      en: 'Painting',
    },
    description: {
      ckb: 'چڵەداری بیی و دارگوێزی سوورکراوە لە فڕنی داخراودا بەبێ ئۆکسجین؛ خەڵووزێکی نەرم و دڵڕفێن بەرهەم دێنێت بۆ دیاریکردنی پرۆپۆرشن لە بەشی شێوەکاری.',
      ar: 'أغصان الصفصاف المحروقة ببطء في أفران معزولة عن الهواء لتنتج فحماً مخملي السواد يسهل مسحه وتعديله.',
      en: 'Slender willow and walnut twigs carbonized in airtight kilns, yielding velvety, easily liftable tonal shading sticks.',
    },
    historicalSignificance: {
      ckb: 'یەکەم وانەی هەموو قوتابییەکی پەیمانگە لە هۆڵی مۆدێلی زیندودا بەم خەڵووزە دەستپێدەکات بۆ فێربوونی بەهای تاریکی و ڕووناکی.',
      ar: 'الخطوة الأولى لكل طالب فن تشكيلي في دراسة التشريح والنسب الأكاديمية والظل والنور.',
      en: 'The primordial foundational medium introduced to all first-year atelier students examining live figure anatomy and chiaroscuro.',
    },
    bestPractices: {
      ckb: 'بە پەڕۆی شامۆکس یان نانی سپی بسڕدرێتەوە بۆ دەرخستنی ڕووناکی بەبێ زیانگەیاندن بە پەڕەی کەتان.',
      ar: 'يُمسح بجلد الشامواه الطبيعي أو ممحاة الفحم العجينية لإبراز بقع الضوء النقي دون إتلاف الورق.',
      en: 'Lift highlights with natural chamois leather or kneaded dough erasers to preserve delicate rag paper tooth.',
    },
    materials: {
      ckb: 'داربیی چەمچەماڵ، کاربۆنی سروشتی',
      ar: 'أغصان صفصاف طبيعي محروقة لا هوائياً',
      en: 'Pure pyrolyzed Kurdish willow twigs, zero binders',
    },
    origin: {
      ckb: 'فڕنی خەڵووزسازیی پەیمانگە',
      ar: 'فرن تفحيم الخشب - معهد جمجمال',
      en: 'Institute Wood Charcoal Kiln, Chamchamal',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BarramundiFish/glTF-Binary/BarramundiFish.glb',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'هێڵکاریی فیگەر بە خەڵووزی دارینەی سروشتی',
      ar: 'الرسم الأكاديمي الحي وتوزيع الظلال بالفحم النباتي',
      en: 'Atmospheric Figure Drawing & Smudge Tonal Rendering',
    },
    audioDuration: '1:45',
    usageInstructions: {
      ckb: 'بە لای تەختی خەڵووزەکە ڕووبەری سێبەری گەورە دابپۆشە و بە پەنجە یان سڕەرەوەی پێچراو نەرمی بکەرەوە.',
      ar: 'استخدم الجانب العريض لعصا الفحم لتغطية الكتل الظلية الكبيرة، وادمجها برفق بطرف إصبعك أو بأداة الدمج الورقية.',
      en: 'Lay the charcoal stick flat along its flank for broad atmospheric transitions; blend with paper tortillons.',
    },
    proTips: {
      ckb: [
        'پێش کارکردنی زەیتی بە فیکساتیڤی سروشتی ڕەنگەکە لەسەر کانڤاس جێگیر بکە.',
        'فشاری زۆر مەکە چونکە چڵەدارەکە ناسکە و زوو دەشکێت.',
      ],
      ar: [
        'ثبت الرسم التأسيسي ببخاخ الورنيش المثبت الشفاف قبل البدء بالتلوين الزيتي.',
        'تعامل بخفة مع العيدان لأنها نقية وهشة بدون أي مواد كيميائية رابطة.',
      ],
      en: [
        'Atomize a light mist of natural shellac fixative over charcoal block-ins prior to oil glazes.',
        'Maintain delicate hand pressure; pure willow carbon lacks plasticizing waxes.',
      ],
    },
    usedInArtworkSlugs: ['echoes-of-garmian', 'dance-of-piramagrun-planes'],
  },
  {
    id: 'tool-009',
    slug: 'kurdish-bamboo-qalam',
    name: {
      ckb: 'قەڵەمی قامیشی دەستتاشراوی کالیگرافی (Reeds Qalam)',
      ar: 'أقلام القصب والخيرزان المقطوعة يدوياً للخط العربي والكردي',
      en: 'Hand-Cut Kurdistan River Reed Calligraphy Qalam',
    },
    category: 'calligraphy',
    categoryLabel: {
      ckb: 'چاپ و تیپۆگرافی',
      ar: 'الطباعة والخط العربي',
      en: 'Calligraphy',
    },
    description: {
      ckb: 'قامیشی ڕەقکراوی لێواری ڕووبارەکانی کوردستان کە بە چەقۆی قەڵەمتاشی مەڕمەڕی بە گۆشەی تایبەتی خەتی کوردی دەتاشرێت.',
      ar: 'قصب جاف معالج ومقطوع بزاوية حادة تناسب انسيابية الخط الكردي والأحرف المركبة.',
      en: 'Seasoned wetland river reed cured for 24 months, cleaved with razor penknives at specific angles for Kurdish script calligraphy.',
    },
    historicalSignificance: {
      ckb: 'تەواوی شێعرەکانی نالی و مەحوی و بەڵگەنامە مێژووییەکانی ناوچەی چەمچەماڵ و بابان بەم جۆرە قەڵەمە نووسراونەتەوە.',
      ar: 'الوسيلة التراثية الخالدة التي خط بها شعراء كردستان الكبار دواوينهم ومخطوطاتهم الأدبية عبر القرون.',
      en: 'The definitive physical instrument responsible for transcribing classical Kurdish poetry and historic Baban manuscripts.',
    },
    bestPractices: {
      ckb: 'دەبێت لە کاتی تاشیندا درزێکی زۆر باریک لە ناوەڕاستی دەمەکەی دروست بکرێت بۆ ڕاگرتنی مەرەکەب.',
      ar: 'يجب شق لسان القلم شقاً دقيقاً في المنتصف (الشق) لتخزين وتدفق الحبر بانتظام أثناء الكتابة.',
      en: 'Execute a precision axial slit (al-Shaqq) down the nib center to create capillary reservoir tension for ink flow.',
    },
    materials: {
      ckb: 'قامیشی زەردکراوی کەنار ڕووبار، کەرەی خۆماڵی بۆ نەرمکردنەوە',
      ar: 'قصب أهوار مجفف ومعالج بزيوت طبيعية',
      en: 'Sun-cured river reed, hardened with local beeswax polish',
    },
    origin: {
      ckb: 'کەنارەکانی ڕووباری باسەڕە، چەمچەماڵ',
      ar: 'ضفاف أنهار كرميان وجمجمال',
      en: 'Basara River Wetlands, Chamchamal',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/OrientationTest/glTF-Binary/OrientationTest.glb',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'فێرکاری تاشینی قەڵەمی قامیش و ڕاگرتنی لە خەتی نەستەعلیقدا',
      ar: 'طريقة قط وقص أقلام القصب وأسرار الكتابة بخط النستعليق',
      en: 'Cleaving, Slitting & Tuning Traditional Reed Pens',
    },
    audioDuration: '2:50',
    usageInstructions: {
      ckb: 'قەڵەمەکە بە گۆشەی ٦٥ پلە بەرامبەر کاغەزەکە ڕابگرە تا هەردوو لێواری باریک و پڕ بە تەواوی بنووسن.',
      ar: 'أمسك القلم بزاوية ميلان 65 درجة لضمان تلامس كامل لقطعة النصل مع الورق المقهر.',
      en: 'Hold the qalam at a disciplined 65-degree trajectory relative to the paper line for optimal thick-to-thin transitions.',
    },
    proTips: {
      ckb: [
        'مەرەکەبی دۆشاوی سروشتی یان دووکەڵ بەکاربهێنە بۆ پاراستنی دەمی قامیشەکە.',
        'کاتێک دەمەکەی کوول دەبێت، تەنها میلیمیترێکی سەرەوەی بە قەڵەمتاش ببڕەوە.',
      ],
      ar: [
        'استخدم الحبر الكربوني المصنوع من سخام المصابيح لضمان دوام النصل.',
        'أعد قط رأس القلم بدقة متناهية متى شعرت بخشونة في ملمس الورق.',
      ],
      en: [
        'Pair with soot-based carbon inks to avoid acid degradation of the reed fibers.',
        'Re-cleave with a single decisive scalpel cut across a bone cutting board when tooth blunts.',
      ],
    },
    usedInArtworkSlugs: ['symbols-of-memory-and-resilience', 'kurdish-geometric-disruption'],
  },
  {
    id: 'tool-010',
    slug: 'boxwood-pottery-ribs',
    name: {
      ckb: 'ئامرازی دارینی تاشین و لووسکردنی گڵینە (Pottery Ribs)',
      ar: 'أضلاع الخشب المصقولة لتشكيل وتسوية جدران الفخار',
      en: 'Kurdish Boxwood & Walnut Pottery Finishing Ribs',
    },
    category: 'ceramics',
    categoryLabel: {
      ckb: 'سیرامیک و ئاگر',
      ar: 'الخزف والفنون النارية',
      en: 'Ceramics',
    },
    description: {
      ckb: 'پارچە دارێکی دارقەزوان و گوێزی چەمچەماڵ کە بە شێوەی کەوانە داتاشراوە بۆ لووسکردنی ناوەوە و دەرەوەی دەفرەکان لە کاتی خولانەوە لەسەر چەرخ.',
      ar: 'أدوات خشبية مصممة بأقواس هندسية انسيابية لضغط وضبط استقامة جدران الآنية وتفريغ الماء الزائد.',
      en: 'Custom-contoured dense boxwood and walnut ribs used on revolving wheels to compress clay platelets and eliminate rotational water rings.',
    },
    historicalSignificance: {
      ckb: 'شێوەی ئەم کەوانە دارینانە لەسەر شێوازی دەفرە مێژووییەکانی دۆڵی شارەزوور لە سەردەمی ساسانییەکان وەرگیراوە.',
      ar: 'مستوحاة من أشكال القوالب الخزفية التراثية المكتشفة في سهول شهرزور والمواقع الأثرية المحيطة.',
      en: 'Directly mirrors the arc profiles of historic Sasanian and Median ceramic amphorae discovered in regional excavations.',
    },
    bestPractices: {
      ckb: 'بە گۆشەی ڕاست لەگەڵ دیواری دەفرەکە ڕابگیرێت و بە نەرمی پەستانی لێبکرێت لە کاتێکدا دەستەکەی ترت لە ناوەوە پشتیوانی دەکات.',
      ar: 'ثبت الضلع عمودياً بزاوية قائمة مع جدار الإناء الخارجي مع إسناد الجدار الداخلي بأصابع اليد الأخرى.',
      en: 'Press the outer curvature flush against exterior walls while your internal hand provides complementary opposing support.',
    },
    materials: {
      ckb: 'دارگوێزی کوێستانی، ڕۆنی کەرەی ڕووەکی',
      ar: 'خشب الجوز المعتق، زيوت طبيعية نباتية',
      en: 'Fine-grained Kurdish mountain walnut, conditioned in mineral oil',
    },
    origin: {
      ckb: 'ئاتلیێی دارتاشی پەیمانگەی چەمچەماڵ',
      ar: 'ورشة النجارة الفنية - معهد جمجمال',
      en: 'Woodcraft Atelier, Chamchamal',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'لووسکردنی دیواری کەشکۆڵ لەسەر چەرخی گڵینە بە کەوانەی دارین',
      ar: 'استخدام أضلاع الخشب في صقل واستقامة الأواني الخزفية',
      en: 'Wall Compression & Trimming with Hardwood Ribs',
    },
    audioDuration: '2:10',
    usageInstructions: {
      ckb: 'کاتێک دەفرەکە گەیشتە بەرزایی تەواو، کەوانەکە بە لای دەرەوەدا بەسەرەوژوور ڕابکێشە بۆ دەرهێنانی ئاوی زیادە و چڕکردنەوەی قوڕەکە.',
      ar: 'عند اكتمال ارتفاع الإناء، اسحب الضلع الخشبي من الأسفل للأعلى لضغط مسام الطين وتفريغ طبقة الماء الخارجية.',
      en: 'Draw the rib smoothly upward from base to rim at a 45-degree tangent to compress exterior silicate platelets.',
    },
    proTips: {
      ckb: [
        'پاش کارکردن بە ئاو بیشۆ و لە بەر خۆر بەجێی مەهێڵە تا دارەکە شەق نەبات.',
        'ڕۆنی زەیتوون یان کەتانی لێبدە هەموو مانگێک بۆ پاراستنی نەرمی ڕووەکەی.',
      ],
      ar: [
        'جفف الأدوات الخشبية فور الانتهاء ولا تتركها مغمورة بالماء لتجنب التواء الخشب.',
        'امسحها بزيت الزيتون دورياً لحماية الألياف الخشبية من الجفاف والتشقق.',
      ],
      en: [
        'Never soak wood ribs in slurry water basins; wipe clean and horizontal dry.',
        'Treat with pure beeswax balm monthly to preserve water-repellent satin finish.',
      ],
    },
    usedInArtworkSlugs: ['garmian-earthen-amphora'],
  },
  {
    id: 'tool-011',
    slug: 'blacksmith-anvil-mallet',
    name: {
      ckb: 'سندان و مارتۆڵی ئاسنگەری پەیکەری پۆڵا (Anvil & Ball-Peen)',
      ar: 'سندان ومطرقة الحدادة الفنية لتشكيل المنحوتات المعدنية',
      en: 'Forging Anvil & Cross-Peen Sculptor Mallet',
    },
    category: 'sculpture',
    categoryLabel: {
      ckb: 'پەیکەرسازی و بەرد',
      ar: 'النحت وتشكيل الحجر',
      en: 'Sculpture',
    },
    description: {
      ckb: 'سندانێکی ٨٠ کیلۆگرامی پۆڵای بەهێز لەگەڵ چەکوشی قۆقز بۆ دانانی شێوە و چەماندنەوەی ئاسنی گەرمکراوی پەیکەرە مۆدێرنەکانی پەیمانگە.',
      ar: 'سندان فولاذي ضخم بوزن 80 كغ مع مطرقة تشكيل دقيقة لطرق وتطويع صفائح الفولاذ والبرونز المصهور.',
      en: 'Heavy 80kg hardened steel anvil paired with balanced cross-peen hammers for hot-forging steel armatures and public sculpture forms.',
    },
    historicalSignificance: {
      ckb: 'ئاسنگەری پەیکەرسازی لە چەمچەماڵ مێژوویەکی دەوڵەمەندی هەیە لە گۆڕینی کەلوپەلی ئاسنی بەجێماو بۆ هێمای ئاشتی و تەلارسازی هونەری.',
      ar: 'تراث أصيل في جمجمال لتحويل بقايا الحديد الصناعي إلى أعمال نحتية رمزية تنبض بالجمال والسلام.',
      en: 'Underpins the distinctive Chamchamal civic school of forging reclaimed industrial scrap steel into monumental peace sculptures.',
    },
    bestPractices: {
      ckb: 'ئاسنەکە دەبێت لە فڕنی ئاگردا تا پلەی زەردباو (١٠٠٠ پلە) سوور بێتەوە پێش ئەوەی لەسەر سندانەکە دابنرێت بۆ لێدان.',
      ar: 'يجب تسخين الفولاذ حتى التوهج الأصفر المائل للبياض (1000 مئوية) قبل البدء بالطرق لتجنب الشروخ المعدنية.',
      en: 'Heat structural steel until a radiant bright yellow luminescence (1050°C) is reached before anvil striking.',
    },
    materials: {
      ckb: 'پۆڵای داڕێژراوی نایترۆجینی، داردارەوانی ئەمریکی',
      ar: 'فولاذ صناعي مصبوب عالي الصلابة، خشب الزان الصلب',
      en: 'Cast tool steel anvil face (58 HRC), shock-absorbing hickory mallet handle',
    },
    origin: {
      ckb: 'بەشی پەیکەرسازی، پەیمانگەی چەمچەماڵ',
      ar: 'قسم النحت والسباكة - معهد جمجمال',
      en: 'Sculpture Foundry, Chamchamal',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF-Binary/Suzanne.glb',
    imageUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1561839561-b13bcfe95249?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'ئاگرکاری و لێدانی پەیکەری پۆڵایین لەسەر سندان',
      ar: 'الحدادة الفنية وتطويع الفولاذ للمنحوتات المونومنتالية',
      en: 'Anvil Shaping & Hot Forging of Sculpture Armatures',
    },
    audioDuration: '3:10',
    usageInstructions: {
      ckb: 'مارتۆڵەکە بە هێزی کێشی خۆی بەرداوەتە سەر ئاسنەکە بێ ئەوەی دەستت زیاد لە پێویست ماندوو بکەیت؛ شاخی سندانەکە بۆ چەماندنەوە بەکاربهێنە.',
      ar: 'دع ثقل المطرقة يقوم بالعمل الأساسي دون إجهاد المعصم، واستخدم قرن السندان المستدير لتشكيل الانحناءات.',
      en: 'Let hammer momentum execute the work rather than strained wrist tendons; utilize the horn horn bick for sweeping radii.',
    },
    proTips: {
      ckb: [
        'دەنگی زەنگین و سافی لێدانی سندان نیشانەی کواڵیتی باڵای پۆڵاکەیە.',
        'پێش ساردبوونەوە چەکوشکاری ڕابگرە تا پۆڵاکە نەشکێت.',
      ],
      ar: [
        'رنين السندان الصافي دليل على خلوه من الفراغات الهوائية الداخلية وقوة ارتداده.',
        'توقف عن الطرق فور تحول لون الفولاذ إلى الأحمر القاتم لتجنب التشقق الداخلي.',
      ],
      en: [
        'A high ringing pitch with lively rebound signifies true homogeneous anvil temper.',
        'Cease hammering immediately when workpieces fade to dull cherry red (below 750°C).',
      ],
    },
    usedInArtworkSlugs: ['dove-of-tangisar-steel-sculpture'],
  },
  {
    id: 'tool-012',
    slug: 'boxwood-sculpting-rasps',
    name: {
      ckb: 'سوهانی دەستیی نەخشاندنی بەرد و گەچ (Italian Stone Rifflers)',
      ar: 'مبارد النحت الدقيقة لتشطيب صخور الرخام والجبس',
      en: 'Hand-Stitched Italian Stone Sculpting Rifflers',
    },
    category: 'sculpture',
    categoryLabel: {
      ckb: 'پەیکەرسازی و بەرد',
      ar: 'النحت وتشكيل الحجر',
      en: 'Sculpture',
    },
    description: {
      ckb: 'کۆمەڵە سوهانێکی دووسەرەی پۆڵای بەرزە-وردبینی کە ددانەکانی بە دەست کوتراون؛ تایبەتە بە لووسکردن و نەخشاندنی شوێنە دەستپێنەگەیشتووەکانی پەیکەری بەردین.',
      ar: 'مبارد دقيقة ذات طرفين مسننة يدوياً، مخصصة لنحت وصقل المنحنيات الغائرة والزوايا الضيقة في تماثيل الرخام.',
      en: 'Double-ended curved rasps with hand-stitched teeth tailored for smoothing intricate concave anatomical features in marble and stucco.',
    },
    historicalSignificance: {
      ckb: 'لە تاشینی ڕوخسار و چاو و پرچی پەیکەرە کلاسیکییەکانی هۆڵی پەیمانگە لە ساڵی ٢٠١٠وە ئەم سوهانانە دەستی یەکەمن.',
      ar: 'الأداة الأساسية لطلبة قسم النحت في تشكيل تفاصيل الوجه، العيون، وخصلات الشعر في التماثيل الكلاسيكية.',
      en: 'The definitive tool in the academic sculpture syllabus for modeling delicate facial physiognomy, eyelids, and drapery.',
    },
    bestPractices: {
      ckb: 'تەنها لە یەک ئاراستەدا ڕابکێشرێت (بەرەو پێش)؛ گەڕاندنەوەی بەسەر بەردەکەدا ددانەکانی سوهانەکە لەناو دەبات.',
      ar: 'ابرد في اتجاه واحد للأمام فقط وتجنب الفرك جيئة وذهاباً للحفاظ على حدة أسنان المبرد.',
      en: 'Push forward in fluid single-direction strokes; drawing backward under load dulls hand-stitched tooth crests.',
    },
    materials: {
      ckb: 'پۆڵای کڕۆمی گەرمکراو، ددانی دەستچن',
      ar: 'فولاذ كرومي مقسى بأسنان مشغولة يدوياً',
      en: 'Drop-forged Swedish tool steel, hand-punched rasps',
    },
    origin: {
      ckb: 'کۆکراوەی ئامرازی بەشی پەیکەرسازی',
      ar: 'مجموعة أدوات قسم النحت - معهد جمجمال',
      en: 'Sculpture Department Reserve, Chamchamal',
    },
    glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Corset/glTF-Binary/Corset.glb',
    imageUrl: 'https://images.unsplash.com/photo-1561839561-b13bcfe95249?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1561839561-b13bcfe95249?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: {
      ckb: 'لووسکردنی کەوانە و وردەکاریی پەیکەری مەڕمەڕ بە سوهانی ڕیفڵەر',
      ar: 'تشطيب وصقل ثنايا المنحوتات الرخامية بمبارد الرفلر',
      en: 'Anatomical Precision Finishing with Hand-Stitched Rifflers',
    },
    audioDuration: '2:20',
    usageInstructions: {
      ckb: 'سوهانەکە بە پەنجەی ئاماژە و گەورە لە نزیک لایە کەوانەییەکە بگرە و بە پەستانی نەرم بەسەر ڕووی بەردەکەدا بیخلیسکێنە.',
      ar: 'أمسك المبرد قرب رأسه المقوس بأصابعك ومرره بضغط خفيف ومتحكم به فوق منحنيات الحجر.',
      en: 'Choke up on the curved shank with thumb and forefinger; execute feathered passes across concave marble planes.',
    },
    proTips: {
      ckb: [
        'بە فڵچەی مسین تۆزی بەردی نێوان ددانەکان پاکبکەرەوە تاوەکو بەردەکە بریندار نەکات.',
        'پاش سوهانکاری، کاغەزی شووشەیی پلە ٤٠٠ بەکاربهێنە بۆ درەوشاوەیی نایاب.',
      ],
      ar: [
        'نظف أسنان المبرد بفرشاة سلكية نحاسية بانتظام لمنع تراكم الغبار الحجري.',
        'اتبع الفرك بورق الصنفرة الحبيبي (درجة 400 و 800) للوصول للنعومة الرخامية الفائقة.',
      ],
      en: [
        'Clean teeth periodically with a brass wire file card to prevent packed stone dusting.',
        'Follow riffler work with wet 400-grit silicon carbide paper to eliminate stroke flats.',
      ],
    },
    usedInArtworkSlugs: ['bust-of-the-nomad-weaver', 'chamchamal-freedom-monument'],
  },
];
