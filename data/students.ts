export interface LocalizedString {
  ckb: string;
  ar: string;
  en: string;
}

export interface StudentAwardItem {
  id: string;
  title: string;
  year: string;
  issuer: string;
  description?: string;
}

export type ContactPlatform = 'whatsapp' | 'viber' | 'instagram' | 'phone' | 'email' | 'website';

export interface StudentContactLink {
  id: string;
  platform: ContactPlatform;
  url: string;
  displayLabel: string;
}

export interface StudentArtist {
  id: string;
  slug: string;
  fullName: LocalizedString;
  department: LocalizedString;
  graduationYear: number;
  cohort: LocalizedString;
  avatarUrl: string;
  bio: LocalizedString;
  statement: LocalizedString;
  awards?: (LocalizedString | StudentAwardItem)[];
  contactLinks?: StudentContactLink[];
  artworkSlugs: string[];
  email: string;
  studioLocation: LocalizedString;
  disciplines: LocalizedString[];
}

export const STUDENTS_DATA: StudentArtist[] = [
  {
    id: 'shwan-karim-ahmed',
    slug: 'shwan-karim-ahmed',
    fullName: {
      ckb: 'شوان کەریم ئەحمەد',
      ar: 'شوان كريم أحمد',
      en: 'Shwan Karim Ahmed',
    },
    department: {
      ckb: 'بەشی شێوەکاری هاوچەرخ',
      ar: 'قسم الفن التشكيلي المعاصر',
      en: 'Contemporary Painting Dept.',
    },
    graduationYear: 2018,
    cohort: {
      ckb: 'خولی دەرچووانی ٢٠١٨',
      ar: 'دفعة خريجي عام 2018',
      en: 'Graduating Cohort of 2018',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: {
      ckb: 'شێوەکار و توێژەری ڕەنگ لە سروشتی گەرمیاندا؛ یەکێک لە دەرچووە سەرکەوتووەکانی خولی یەکەمی پەیمانگە کە ئێستا ئەندامی دەستەی وانەبێژانە.',
      ar: 'فنان تشكيلي وباحث لوني في بيئة كرميان؛ من أوائل خريجي المعهد المتميزين وأستاذ مشارك بقسم الرسم.',
      en: 'Painter and chromatic researcher specializing in the Garmian regional terrain; prominent alumnus of the inaugural class and visiting mentor.',
    },
    statement: {
      ckb: 'تابلۆ بۆ من تەنها تۆمارکردنی بینراو نییە، بەڵکو گواستنەوەی هەناسەی گەرمی دەشتەکان و بەردەوامی ژیانە لە نێوان خۆڵ و ڕەنگدا.',
      ar: 'اللوحة بالنسبة لي ليست مجرد توثيق بصري، بل هي استحضار للأنفاس الحارة لسهول كرميان وتحدي الفناء بالألوان الخام.',
      en: 'Painting to me is not merely visual documentation; it is conjuring the incandescent breath of the plains into raw tactile pigments.',
    },
    awards: [
      {
        id: 'shwan-award-1',
        title: 'خەڵاتی یەکەمی بیناڵی نەتەوەیی کوردستان (First Prize • Kurdistan Art Biennial)',
        year: '2021',
        issuer: 'وەزارەتی ڕۆشنبیری و لاوان • Kurdistan Ministry of Culture',
        description: 'بۆ داهێنان لە کێشانی تابلۆی پانۆرامایی و توێژینەوەی ڕەنگ لە سروشتی گەرمیاندا.',
      },
      {
        id: 'shwan-award-2',
        title: 'مەدالیای زێڕینی داهێنانی پەیمانگەی چەمچەماڵ',
        year: '2018',
        issuer: 'Chamchamal Fine Arts Institute',
        description: 'ڕێزلێنان لە خوێندکاری یەکەمی خول بۆ باڵادەستی لە تەکنیکەکانی ڕەنگی زەیتی.',
      },
    ],
    contactLinks: [
      { id: 'c1', platform: 'whatsapp', url: 'https://wa.me/9647701234567', displayLabel: '+964 770 123 4567' },
      { id: 'c2', platform: 'instagram', url: 'https://instagram.com/shwan.fineart', displayLabel: '@shwan.fineart' },
      { id: 'c3', platform: 'email', url: 'mailto:shwan.karim@chamchamal-finearts.edu.krd', displayLabel: 'shwan.karim@edu.krd' },
      { id: 'c4', platform: 'website', url: 'https://shwanart.krd', displayLabel: 'shwanart.krd' },
    ],
    artworkSlugs: ['echoes-of-garmian'],
    email: 'shwan.karim@chamchamal-finearts.edu.krd',
    studioLocation: {
      ckb: 'ئاتلیێی ژمارە ٠١، تەلاری شێوەکاری، چەمچەماڵ',
      ar: 'أتيليه رقم 01، مبنى الفنون التشكيلية، جمجمال',
      en: 'Studio #01, Painting Pavilion, Chamchamal',
    },
    disciplines: [
      { ckb: 'ڕەنگی زەیتی', ar: 'ألوان زيتية', en: 'Oil Painting' },
      { ckb: 'کانڤاسی کەتان', ar: 'قماش الكتان', en: 'Linen Canvas' },
      { ckb: 'ڕەنگسازی', ar: 'التناغم اللوني', en: 'Color Theory' },
    ],
  },
  {
    id: 'rebwar-hussein-baban',
    slug: 'rebwar-hussein-baban',
    fullName: {
      ckb: 'د. ڕێبوار حسێن بابان',
      ar: 'د. ريبوار حسين بابان',
      en: 'Dr. Rebwar Hussein Baban',
    },
    department: {
      ckb: 'بەشی پەیکەرسازی ئەکادیمی',
      ar: 'قسم النحت الأكاديمي',
      en: 'Academic Sculpture Dept.',
    },
    graduationYear: 2016,
    cohort: {
      ckb: 'خولی دەرچووانی ٢٠١٦',
      ar: 'دفعة خريجي عام 2016',
      en: 'Graduating Cohort of 2016',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: {
      ckb: 'پەیکەرسازی نێودەوڵەتی، خاوەنی دەیان پەیکەری مەیدانی لە شارەکانی کوردستان، و بەڕێوەبەری تاقیگەی سکانی سێ ڕەهەندی لە پەیمانگە.',
      ar: 'نحات دولي أشرف على تصميم نصب تذكارية عامة في مدن كردستان، ويدير مختبر التوثيق ثلاثي الأبعاد بالمعهد.',
      en: 'International monumental sculptor responsible for civic monuments across Kurdistan, and Director of the Institute 3D Scan Lab.',
    },
    statement: {
      ckb: 'بەرد یادەوەریی هەزاران ساڵە هەڵدەگرێت؛ پەیکەرساز تەنها ڕێگە بەو شێوەیە دەدات کە لە ناخی بەردەکەدا شاردراوەتەوە تا بێتە دەرەوە.',
      ar: 'يحمل الحجر ذاكرة آلاف السنين، ومهمة النحات هي تحرير الشكل الكامن في أعماقه ليخاطب الأجيال القادمة.',
      en: 'Stone carries millennial memories; the sculptors role is simply liberating the profound form resting inside.',
    },
    awards: [
      {
        id: 'rebwar-award-1',
        title: 'خەڵاتی ڕێزلێنانی مەدالیای بیناڵی ڤینیسیا (Venice Biennial Honors)',
        year: '2022',
        issuer: 'Venice Biennial Middle East Pavilion',
        description: 'بۆ پڕۆژەی پەیکەری ئاشتی و گواستنەوەی پەیامی پێکەوەژیان لە برۆنزی قورسدا.',
      },
      {
        id: 'rebwar-award-2',
        title: 'خەڵاتی پەیکەری ساڵ لە سلێمانی (Sculpture of the Year)',
        year: '2019',
        issuer: 'دەستەی هونەری سلێمانی • Sulaymaniyah Arts Syndicate',
        description: 'بۆ دروستکردنی پەیکەری مەیدانی چەمچەماڵ و مۆنۆمێنتی ئازادی.',
      },
    ],
    contactLinks: [
      { id: 'c5', platform: 'phone', url: 'tel:+9647509876543', displayLabel: '+964 750 987 6543' },
      { id: 'c6', platform: 'viber', url: 'viber://chat?number=+9647509876543', displayLabel: 'Viber Direct' },
      { id: 'c7', platform: 'instagram', url: 'https://instagram.com/rebwar.sculpture', displayLabel: '@rebwar.sculpture' },
      { id: 'c8', platform: 'email', url: 'mailto:rebwar.baban@chamchamal-finearts.edu.krd', displayLabel: 'rebwar.baban@edu.krd' },
    ],
    artworkSlugs: ['chamchamal-freedom-monument'],
    email: 'rebwar.baban@chamchamal-finearts.edu.krd',
    studioLocation: {
      ckb: 'حەوشەی پەیکەرسازی گەورە، پەیمانگەی چەمچەماڵ',
      ar: 'فناء النحت الضخم، معهد جمجمال',
      en: 'Monumental Foundry Atrium, Chamchamal',
    },
    disciplines: [
      { ckb: 'برۆنزی گەرم', ar: 'صب البرونز', en: 'Bronze Casting' },
      { ckb: 'تاشینی بەرد', ar: 'نحت الرخام', en: 'Marble Carving' },
      { ckb: 'فۆتۆگرامەتری ۳D', ar: 'المسح ثلاثي الأبعاد', en: '3D Photogrammetry' },
    ],
  },
  {
    id: 'tara-osman-ali',
    slug: 'tara-osman-ali',
    fullName: {
      ckb: 'تارا عوسمان عەلی',
      ar: 'تارا عثمان علي',
      en: 'Tara Osman Ali',
    },
    department: {
      ckb: 'بەشی سیرامیک و هونەرە ئاگرینەکان',
      ar: 'قسم الخزف والفنون النارية',
      en: 'Ceramics & Fire Arts Dept.',
    },
    graduationYear: 2020,
    cohort: {
      ckb: 'خولی دەرچووانی ٢٠٢٠',
      ar: 'دفعة خريجي عام 2020',
      en: 'Graduating Cohort of 2020',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: {
      ckb: 'هونەرمەندی دەفرسازی و سیرامیک، گرنگیدەر بە بەکارهێنانی کەرەستەی زەوینی و ڕەنگی سروشتی لە پێکهاتەی گڵینەدا.',
      ar: 'خزافة معاصرة تعيد صياغة الأواني التراثية الميزوبوتامية باستخدام طين وخامات ترابية محلية.',
      en: 'Contemporary ceramicist investigating historical vessel typologies and indigenous alluvial clays.',
    },
    statement: {
      ckb: 'هەر پارچە قوڕێک کە دەستەکانی من دەیشێلن لە دڵی چەمچەماڵەوە هاتووە، و ئاگر ناسنامەی کۆتایی پێدەبەخشێت.',
      ar: 'كل قبضة طين تشكلها أصابعي خرجت من رحم وديان جمجمال، والنار وحدها تمنحها هويتها وخلودها.',
      en: 'Every lump of clay centered upon my wheel originates from Chamchamal valleys; fire alone confers its final voice.',
    },
    awards: [
      {
        id: 'tara-award-1',
        title: 'خەڵاتی داهێنانی سیرامیکی هاوچەرخ (Contemporary Ceramic Innovation)',
        year: '2023',
        issuer: 'ناوەندی هونەری هەولێر • Erbil Art Center',
        description: 'بۆ نوێکردنەوەی فۆڕمی گڵینەی دێرینی گەرمیان بە گلازی سروشتی.',
      },
    ],
    contactLinks: [
      { id: 'c9', platform: 'whatsapp', url: 'https://wa.me/9647712345678', displayLabel: '+964 771 234 5678' },
      { id: 'c10', platform: 'instagram', url: 'https://instagram.com/tara.ceramics', displayLabel: '@tara.ceramics' },
      { id: 'c11', platform: 'email', url: 'mailto:tara.osman@chamchamal-finearts.edu.krd', displayLabel: 'tara.osman@edu.krd' },
    ],
    artworkSlugs: ['garmian-earthen-amphora'],
    email: 'tara.osman@chamchamal-finearts.edu.krd',
    studioLocation: {
      ckb: 'گەلەریی ئاتلیێی سیرامیک، ژووری فڕنەکان',
      ar: 'قاعة أتيليه الخزف، جناح الأفران الحرارية',
      en: 'Ceramics Atelier, Kiln Wing, Chamchamal',
    },
    disciplines: [
      { ckb: 'چەرخی گڵینە', ar: 'عجلة الفخار', en: 'Wheel Throwing' },
      { ckb: 'گلازی خۆڵەمێش', ar: 'طلاءات الرماد', en: 'Ash Glazing' },
      { ckb: 'سووتاندنی فڕن', ar: 'الحرق الحراري', en: 'High-Fire Kiln' },
    ],
  },
  {
    id: 'soran-faiq-majeed',
    slug: 'soran-faiq-majeed',
    fullName: {
      ckb: 'سۆران فایەق مەجید',
      ar: 'سوران فائق مجيد',
      en: 'Soran Faiq Majeed',
    },
    department: {
      ckb: 'بەشی گرافیک دیزاین و چاپ',
      ar: 'قسم التصميم الجرافيكي وفنون الطباعة',
      en: 'Graphic Design & Printmaking Dept.',
    },
    graduationYear: 2019,
    cohort: {
      ckb: 'خولی دەرچووانی ٢٠١٩',
      ar: 'دفعة خريجي عام 2019',
      en: 'Graduating Cohort of 2019',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    bio: {
      ckb: 'دیزاینەری گرافیک و چاپکاری دەستی، خاوەنی ستۆدیۆی چاپی هونەری و یەکێک لە توێژەرانی کالیگرافی کوردی.',
      ar: 'مصمم جرافيكي وباحث في الحرف الكردي المعاصر ومؤسس ورشة للطباعة الفنية اليدوية.',
      en: 'Graphic designer and fine art printmaker exploring modern architectural Kurdish letterforms.',
    },
    statement: {
      ckb: 'پیت تەنها دەنگ نییە؛ لە هونەری چاپدا، پیت پەیکەرێکی ڕەش و سپییە لەسەر پەڕە سپییەکە دەژی.',
      ar: 'الحرف ليس مجرد صوت مقروء، بل هو كتلة نحتية حية تعيد رسم بياض الورق بدقة الحبر وعمقه.',
      en: 'A letter is not merely phonetic sound; in relief printmaking, a glyph is a living structural sculpture on paper.',
    },
    awards: [
      {
        id: 'soran-award-1',
        title: 'خەڵاتی یەکەمی تیپۆگرافی بینراو (Visual Typography Triennial)',
        year: '2022',
        issuer: 'کەرکووک • Kirkuk Typography Guild',
        description: 'بۆ پەرەپێدانی فۆنتی ئەندازەیی کوردی لەسەر پەڕەی کەتان.',
      },
    ],
    contactLinks: [
      { id: 'c12', platform: 'instagram', url: 'https://instagram.com/soran.print', displayLabel: '@soran.print' },
      { id: 'c13', platform: 'website', url: 'https://soranprint.krd', displayLabel: 'soranprint.krd' },
      { id: 'c14', platform: 'email', url: 'mailto:soran.faiq@chamchamal-finearts.edu.krd', displayLabel: 'soran.faiq@edu.krd' },
    ],
    artworkSlugs: ['symbols-of-memory-and-resilience'],
    email: 'soran.faiq@chamchamal-finearts.edu.krd',
    studioLocation: {
      ckb: 'ستۆدیۆی چاپی دەستی، قاتی دووەم',
      ar: 'استوديو الطباعة اليدوية، الطابق الثاني',
      en: 'Hand-Printmaking Atelier, Floor 2',
    },
    disciplines: [
      { ckb: 'چاپی لایلۆن', ar: 'طباعة اللينو', en: 'Linocut' },
      { ckb: 'کالیگرافی کوردی', ar: 'الخط الكردي', en: 'Kurdish Lettering' },
      { ckb: 'سیلک سککرین', ar: 'سيلك سكرين', en: 'Screenprinting' },
    ],
  },
  {
    id: 'lava-jamal-qadir',
    slug: 'lava-jamal-qadir',
    fullName: {
      ckb: 'لاڤە جەمال قادر',
      ar: 'لافا جمال قادر',
      en: 'Lava Jamal Qadir',
    },
    department: {
      ckb: 'بەشی شێوەکاری',
      ar: 'قسم الفن التشكيلي',
      en: 'Fine Arts Painting Dept.',
    },
    graduationYear: 2021,
    cohort: {
      ckb: 'خولی دەرچووانی ٢٠٢١',
      ar: 'دفعة خريجي عام 2021',
      en: 'Graduating Cohort of 2021',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    bio: {
      ckb: 'شێوەکار و شارەزای گەڵای زێڕین لە هونەری هاوچەرخدا؛ تابلۆکانی تیشکی ڕۆژ و شاخەکانی پیرەمەگروون بەرجەستە دەکەن.',
      ar: 'فنانة تشكيلية رائدة في توظيف ورق الذهب مع الانطباعية الحديثة في تصوير جبال كردستان.',
      en: 'Painter pioneering the integration of 24K gold leaf into contemporary impressions of Kurdish mountain ranges.',
    },
    statement: {
      ckb: 'تیشکی پاییز کاتێک بەسەر لوتکەکاندا دەنیشێت، زێڕینترین چیرۆکی ئەم نیشتمانەیە؛ ئەرکی من هێنانەدی ئەو تیشکەیە لە هۆڵە تاریکەکاندا.',
      ar: 'حين يهبط ضوء الخريف على قمم الجبال، يروي أثمن قصص هذه الأرض؛ ورسالتي هي إشعال ذلك النور في فضاءات المعارض.',
      en: 'When autumn illumination sweeps mountain ridges, it tells our most radiant story; my mission is preserving that light.',
    },
    awards: [
      {
        id: 'lava-award-1',
        title: 'خەڵاتی لاوانی داهێنەری پەیمانگەکانی کوردستان (Youth Innovation Award)',
        year: '2022',
        issuer: 'وەزارەتی پەروەردە و فێرکردنی باڵا',
        description: 'بۆ پڕۆژەی تێکەڵکردنی گەڵای زێڕین لەگەڵ تابلۆی سروشتی شاخەکان.',
      },
    ],
    contactLinks: [
      { id: 'c15', platform: 'instagram', url: 'https://instagram.com/lava.goldart', displayLabel: '@lava.goldart' },
      { id: 'c16', platform: 'whatsapp', url: 'https://wa.me/9647723456789', displayLabel: '+964 772 345 6789' },
      { id: 'c17', platform: 'email', url: 'mailto:lava.jamal@chamchamal-finearts.edu.krd', displayLabel: 'lava.jamal@edu.krd' },
    ],
    artworkSlugs: ['dance-of-piramagrun-planes'],
    email: 'lava.jamal@chamchamal-finearts.edu.krd',
    studioLocation: {
      ckb: 'هۆڵی نوێنەرایەتی ساڵانەی بیناڵی قوتابیان',
      ar: 'قاعة التمثيل السنوي لبينالي الطلبة',
      en: 'Student Biennial Pavilion, Floor 1',
    },
    disciplines: [
      { ckb: 'گەڵای زێڕین', ar: 'ورق الذهب', en: 'Gold Leafing' },
      { ckb: 'دارگوێز', ar: 'خشب الجوز', en: 'Walnut Panels' },
      { ckb: 'ئیمپرێشنیزم', ar: 'الانطباعية', en: 'Impressionism' },
    ],
  },
  {
    id: 'derin-himdad-najmaddin',
    slug: 'derin-himdad-najmaddin',
    fullName: {
      ckb: 'دێرین هیمداد نەجمەدین',
      ar: 'ديرين هيمداد نجم الدين',
      en: 'Derin Himdad Najmaddin',
    },
    department: {
      ckb: 'بەشی سیرامیک',
      ar: 'قسم الخزف الفني',
      en: 'Ceramics Department',
    },
    graduationYear: 2019,
    cohort: {
      ckb: 'خولی دەرچووانی ٢٠١٩',
      ar: 'دفعة خريجي عام 2019',
      en: 'Graduating Cohort of 2019',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: {
      ckb: 'مامۆستای تەکنیکەکانی ئاگر و سووتاندنی کەرەستەی ئەندامی لە بەشی سیرامیک و توێژەری ڕەنگی مسی لە فڕندا.',
      ar: 'أستاذة تقنيات الحرق العضوي والراكوا بقسم الخزف، وباحثة في بريق أكاسيد النحاس بالاختزال الدخاني.',
      en: 'Ceramics instructor specializing in organic smoke reduction and copper iridescent lustre glazes.',
    },
    statement: {
      ckb: 'دەفرسازی گفتوگۆیە لە نێوان چوار توخمەکە: خاک، ئاو، با و ئاگر. ئێمە تەنها نێوەندگێرین لە نێوانیاندا.',
      ar: 'الخزف حوار كوني بين العناصر الأربعة: التراب، الماء، الهواء والنار. ونحن لسنا سوى وسطاء ينظمون هذا اللقاء.',
      en: 'Ceramics is a dialogue among the four primordial elements: Earth, Water, Air, and Fire. The artist is their humble mediator.',
    },
    awards: [
      {
        id: 'derin-award-1',
        title: 'خەڵاتی زێڕینی پێشانگای هونەری هاوچەرخی سلێمانی (Contemporary Fire Arts)',
        year: '2020',
        issuer: 'Sulaymaniyah Contemporary Arts Center',
        description: 'بۆ داهێنان لە تەکنیکەکانی ئۆکسیدی مس و سووتاندنی دووکەڵی ڕاکۆ.',
      },
    ],
    contactLinks: [
      { id: 'c18', platform: 'viber', url: 'viber://chat?number=+9647512345678', displayLabel: 'Viber Contact' },
      { id: 'c19', platform: 'instagram', url: 'https://instagram.com/derin.ceramics', displayLabel: '@derin.ceramics' },
      { id: 'c20', platform: 'email', url: 'mailto:derin.himdad@chamchamal-finearts.edu.krd', displayLabel: 'derin.himdad@edu.krd' },
    ],
    artworkSlugs: ['solar-ceramic-vessel'],
    email: 'derin.himdad@chamchamal-finearts.edu.krd',
    studioLocation: {
      ckb: 'پێشانگای تاقیکاریی هونەرە ئاگرینەکان',
      ar: 'معرض الفنون النارية التجريبية',
      en: 'Pyrotechnic Arts Workshop, Chamchamal',
    },
    disciplines: [
      { ckb: 'تەکنیکی ڕاکۆ', ar: 'خزف راكوا', en: 'Raku Firing' },
      { ckb: 'ئۆکسیدی مس', ar: 'أكاسيد النحاس', en: 'Copper Lustre' },
      { ckb: 'سووتاندنی دووکەڵ', ar: 'الاختزال بالدخان', en: 'Smoke Reduction' },
    ],
  },
  {
    id: 'halwest-ahmed-aziz',
    slug: 'halwest-ahmed-aziz',
    fullName: {
      ckb: 'هەڵوێست ئەحمەد عەزیز',
      ar: 'هلوست أحمد عزيز',
      en: 'Halwest Ahmed Aziz',
    },
    department: {
      ckb: 'بەشی مۆسیقا',
      ar: 'قسم الموسيقى',
      en: 'Music Department',
    },
    graduationYear: 2020,
    cohort: {
      ckb: 'خولی دەرچووانی ٢٠٢٠',
      ar: 'دفعة خريجي عام 2020',
      en: 'Graduating Cohort of 2020',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    bio: {
      ckb: 'مۆسیقاژەن و مامۆستای ئامێری تاری کوردی؛ توێژەری مەقامە فۆلکلۆرییەکانی گەرمیان لە بەشی مۆسیقا.',
      ar: 'عازف تار ومدرس الآلات الوترية؛ باحث في المقامات التراثية الكردية بقسم الموسيقى.',
      en: 'Lutenist and instructor of Kurdish Tar; researcher in Garmian traditional maqams at the Music Department.',
    },
    statement: {
      ckb: 'تار بۆ من تەنها ئامێرێک نییە، بەڵکو زمانی دەربڕینی هەست و خەم و شادیی هەزاران ساڵەی گەلی کوردە.',
      ar: 'آلة التار ليست مجرد آلة موسيقية، بل هي نبض التاريخ وصدى أفراح وأحزان شعبنا عبر الأجيال.',
      en: 'The Tar is not merely an instrument; it is the historic heartbeat and soul of our regional memories.',
    },
    awards: [
      {
        id: 'halwest-award-1',
        title: 'خەڵاتی یەکەمی فێستیڤاڵی مۆسیقای کوردی (Kurdish Music Festival Prize)',
        year: '2022',
        issuer: 'وەزارەتی ڕۆشنبیری و لاوان',
        description: 'بۆ پێشکەشکردنی باشترین ژەنینی ئامێری تار لە مەقامی بەیاتدا.',
      },
    ],
    contactLinks: [
      { id: 'c21', platform: 'whatsapp', url: 'https://wa.me/9647703456789', displayLabel: '+964 770 345 6789' },
      { id: 'c22', platform: 'email', url: 'mailto:halwest.ahmed@chamchamal-finearts.edu.krd', displayLabel: 'halwest.ahmed@edu.krd' },
    ],
    artworkSlugs: ['garmian-string-reverie'],
    email: 'halwest.ahmed@chamchamal-finearts.edu.krd',
    studioLocation: {
      ckb: 'ستۆدیۆی ژمارە ٢، بەشی مۆسیقا، چەمچەماڵ',
      ar: 'استوديو رقم 2، قسم الموسيقى، جمجمال',
      en: 'Studio #02, Music Pavilion, Chamchamal',
    },
    disciplines: [
      { ckb: 'تاری کوردی', ar: 'التار الكردي', en: 'Kurdish Tar' },
      { ckb: 'مەقاماتی کوردی', ar: 'المقامات الكردية', en: 'Kurdish Maqam' },
    ],
  },
  {
    id: 'diden-mustafa-karim',
    slug: 'diden-mustafa-karim',
    fullName: {
      ckb: 'دیدەن مستەفا کەریم',
      ar: 'ديدن مصطفى كريم',
      en: 'Diden Mustafa Karim',
    },
    department: {
      ckb: 'بەشی شانۆ',
      ar: 'قسم المسرح',
      en: 'Theater Department',
    },
    graduationYear: 2021,
    cohort: {
      ckb: 'خولی دەرچووانی ٢٠٢١',
      ar: 'دفعة خريجي عام 2021',
      en: 'Graduating Cohort of 2021',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: {
      ckb: 'دەرهێنەری شانۆیی و ئەکتەر، خاوەنی چەندین نمایشی شانۆیی بەشداریپێکراو لە فێستیڤاڵەکانی کوردستان و عێراق.',
      ar: 'مخرج وممثل مسرحي، أشرف على عدة عروض مسرحية تجريبية نالت جوائز وطنية.',
      en: 'Theater director and scenographer, creator of award-winning physical and experimental stage productions.',
    },
    statement: {
      ckb: 'سەکۆی شانۆ ئەو شوێنەیە کە مرۆڤ ڕاستییەکانی خۆی تێدا دەبینێتەوە لەژێر تیشکی ڕووناکیدا.',
      ar: 'خشبة المسرح هي المرآة التي يرى فيها الإنسان حقيقته كاملة تحت وهج الأضواء.',
      en: 'The theatrical stage is the sacred space where humanity confronts its deepest truths under luminous light.',
    },
    awards: [
      {
        id: 'diden-award-1',
        title: 'خەڵاتی باشترین دەرهێنانی شانۆیی (Best Stage Direction)',
        year: '2023',
        issuer: 'فێستیڤاڵی نێودەوڵەتی شانۆی هەولێر',
        description: 'بۆ دەرهێنانی شانۆگەری سێبەرەکانی قەڵا بە زمانی جەستە.',
      },
    ],
    contactLinks: [
      { id: 'c23', platform: 'instagram', url: 'https://instagram.com/diden.theater', displayLabel: '@diden.theater' },
      { id: 'c24', platform: 'email', url: 'mailto:diden.mustafa@chamchamal-finearts.edu.krd', displayLabel: 'diden.mustafa@edu.krd' },
    ],
    artworkSlugs: ['shadows-of-the-citadel-stage'],
    email: 'diden.mustafa@chamchamal-finearts.edu.krd',
    studioLocation: {
      ckb: 'هۆڵی مەشقی شانۆ، باڵەخانەی شانۆ و سینۆگرافیا',
      ar: 'قاعة بروفات المسرح، مبنى الدراما والسينوغرافيا',
      en: 'Rehearsal Stage Hall, Theater Wing, Chamchamal',
    },
    disciplines: [
      { ckb: 'دەرهێنانی شانۆیی', ar: 'الإخراج المسرحي', en: 'Stage Direction' },
      { ckb: 'سینۆگرافیا', ar: 'السينوغرافيا', en: 'Scenography' },
    ],
  },
];
