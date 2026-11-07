import { FacultyMember } from '@/types/faculty';

export const FACULTY_DATA: FacultyMember[] = [
  {
    id: 'zryan-barzanji',
    slug: 'zryan-barzanji',
    name: {
      ckb: 'مامۆستا زریان بەرزنجی',
      ar: 'أ.د. زريان البرزنجي',
      en: 'Prof. Zryan Barzanji',
    },
    role: {
      ckb: 'ڕاگری پەیمانگەی هونەرە جوانەکانی چەمچەماڵ',
      ar: 'عميد معهد الفنون الجميلة بجمجمال',
      en: 'Dean of Chamchamal Fine Arts Institute',
    },
    department: {
      ckb: 'دەستەی کارگێڕی و سەرپەرشتیاری گشتی',
      ar: 'مجلس الإدارة والإشراف العام',
      en: 'Executive Board & Deanery',
    },
    bio: {
      ckb: 'پەروەردەکار و شێوەکاری دێرینی کوردستان؛ خاوەنی زیاتر لە ٢٥ ساڵ ئەزموون لە بەڕێوەبردنی ئەکادیمی و پێشەنگایەتی دامەزراندنی ناوەندی ئەرشیفی دیجیتاڵی چەمچەماڵ.',
      ar: 'أكاديمي وفنان تشكيلي مخضرم؛ يمتلك أكثر من 25 عاماً من الخبرة في الإدارة الأكاديمية وقيادة التحول الرقمي بالمعهد.',
      en: 'Senior academic and painter with over 25 years of institutional leadership, instrumental in the founding of the Chamchamal Digital Archive.',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    academicDegrees: [
      {
        ckb: 'ماستەر لە هونەرە جوانەکان و مێژووی شێوەکاری - زانکۆی بەغدا',
        ar: 'ماجستير الفنون الجميلة وتاريخ الرسم - جامعة بغداد',
        en: 'Master of Fine Arts & Art History • University of Baghdad',
      },
      {
        ckb: 'دبلۆمی باڵا لە بەڕێوەبردنی مۆزەخانە هونەرییەکان',
        ar: 'دبلوم عال في إدارة المتاحف الفنية',
        en: 'Postgraduate Diploma in Curatorial Management',
      },
    ],
    contactEmail: 'zryan.barzanji@cfa-chamchamal.edu.krd',
    officeLocation: {
      ckb: 'باڵەخانەی کارگێڕی سەرەکی، ژووری ڕاگر (A-101)',
      ar: 'مبنى الإدارة الرئيسي، مكتب العميد (A-101)',
      en: 'Main Administrative Wing, Dean Suite A-101',
    },
    order: 1,
  },
  {
    id: 'nermin-omer-faraj',
    slug: 'nermin-omer-faraj',
    name: {
      ckb: 'د. نەرمین عومەر فەرەج',
      ar: 'د. نرمين عمر فرج',
      en: 'Dr. Nermin Omer Faraj',
    },
    role: {
      ckb: 'جێگری ڕاگر بۆ کاروباری ئەکادیمی و پرۆگرامەکان',
      ar: 'معاون العميد للشؤون الأكاديمية والمناهج',
      en: 'Vice Dean for Academic Affairs & Curricula',
    },
    department: {
      ckb: 'دەستەی کارگێڕی و توێژینەوەی ئەکادیمی',
      ar: 'الإدارة والبحث الأكاديمي',
      en: 'Academic Affairs & Research',
    },
    bio: {
      ckb: 'توێژەر و مێژوونووسی هونەری کوردی؛ سەرپەرشتیاری تێزەکانی دەرچوون و گەشەپێدەری پرۆگرامی شیکاری ڕەخنەیی هاوچەرخ لە پەیمانگە.',
      ar: 'باحثة ومؤرخة للفن الكردي المعاصر؛ مشرفة على أطروحات التخرج وتطوير مناهج النقد الفني.',
      en: 'Kurdish art historian and researcher; oversees graduation theses and contemporary critical curricula.',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    academicDegrees: [
      {
        ckb: 'دکتۆرا لە مێژوو و تیۆری هونەر - زانکۆی تاران',
        ar: 'دكتوراه في تاريخ ونظريات الفن - جامعة طهران',
        en: 'Ph.D. in Art Theory & Aesthetics • University of Tehran',
      },
    ],
    contactEmail: 'nermin.faraj@cfa-chamchamal.edu.krd',
    officeLocation: {
      ckb: 'باڵەخانەی کارگێڕی، ژووری کاروباری ئەکادیمی (A-104)',
      ar: 'مبنى الإدارة، مكتب الشؤون الأكاديمية (A-104)',
      en: 'Academic Affairs Suite A-104',
    },
    order: 2,
  },
  {
    id: 'arian-raza-karim',
    slug: 'arian-raza-karim',
    name: {
      ckb: 'مامۆستا ئاریان ڕەزا کەریم',
      ar: 'أ. آريان رضا كريم',
      en: 'Prof. Arian Raza Karim',
    },
    role: {
      ckb: 'سەرۆکی بەشی شێوەکاری و ڕەنگناسی',
      ar: 'رئيس قسم الرسم والتلوين',
      en: 'Head of Painting & Chromatic Studies',
    },
    department: {
      ckb: 'بەشی شێوەکاری',
      ar: 'قسم الفن التشكيلي',
      en: 'Painting Department',
    },
    bio: {
      ckb: 'شێوەکار و شارەزای بەرهەمهێنانی ڕەنگی سروشتی لە کانزاکانی دەشتی چەمچەماڵ؛ ڕاهێنەری باڵای ئاتلیێی ڕۆنی و تێکەڵاو.',
      ar: 'فنان تشكيلي وباحث في استخلاص الصبغات الطبيعية؛ المشرف العام على محترفات الرسم الزيتي والتقنيات المختلطة.',
      en: 'Master painter specialized in indigenous Garmian mineral pigments; leads oil and mixed-media ateliers.',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    academicDegrees: [
      {
        ckb: 'ماستەر لە شێوەکاری هاوچەرخ - زانکۆی سەلاحەدین',
        ar: 'ماجستير في الرسم المعاصر - جامعة صلاح الدين',
        en: 'MFA in Contemporary Painting • Salahaddin University',
      },
    ],
    contactEmail: 'arian.karim@cfa-chamchamal.edu.krd',
    officeLocation: {
      ckb: 'ستۆدیۆی شێوەکاری ژمارە ٣، قاتی دووەم',
      ar: 'استوديو الرسم رقم 3، الطابق الثاني',
      en: 'Atelier Pavilion, Studio 3',
    },
    order: 3,
  },
  {
    id: 'dler-qadir-abdullah',
    slug: 'dler-qadir-abdullah',
    name: {
      ckb: 'مامۆستا دلێر قادر عەبدوڵڵا',
      ar: 'أ. دلير قادر عبد الله',
      en: 'Prof. Dler Qadir Abdullah',
    },
    role: {
      ckb: 'سەرۆکی بەشی پەیکەرسازی و تاشینی بەرد',
      ar: 'رئيس قسم النحت وتشكيل المجسمات',
      en: 'Head of Sculpture & Monumental Forms',
    },
    department: {
      ckb: 'بەشی پەیکەرسازی',
      ar: 'قسم النحت',
      en: 'Sculpture Department',
    },
    bio: {
      ckb: 'پەیکەرسازی نیشتمانی و خاوەنی چەندین یادگاری فەرمی لە کەرکووک و سلێمانی؛ پسپۆڕی فۆڕمی بڕۆنزی و مەڕمەڕی سروشتی کوردستان.',
      ar: 'نحات ومصمم نصب تذكارية عامة؛ خبير صب البرونز ونحت الرخام الطبيعي في كردستان.',
      en: 'Monumental sculptor with public installations across Kurdistan; expert in bronze casting and native marble carving.',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    academicDegrees: [
      {
        ckb: 'بەکالۆریۆس لە پەیکەرسازی - زانکۆی سلێمانی',
        ar: 'بكالوريوس نحت - جامعة السليمانية',
        en: 'BFA in Sculpture • University of Sulaimani',
      },
    ],
    contactEmail: 'dler.sculpture@cfa-chamchamal.edu.krd',
    officeLocation: {
      ckb: 'کارگەی پەیکەرسازی و تاوێری برۆنز (C-10)',
      ar: 'ورشة النحت وسباكة البرونز (C-10)',
      en: 'Heavy Sculpture Foundry C-10',
    },
    order: 4,
  },
  {
    id: 'chiman-fatah-ahmed',
    slug: 'chiman-fatah-ahmed',
    name: {
      ckb: 'مامۆستا چیمەن فەتاح ئەحمەد',
      ar: 'أ. چيمن فتاح أحمد',
      en: 'Prof. Chiman Fatah Ahmed',
    },
    role: {
      ckb: 'سەرۆکی بەشی سیرامیک و کورەی شوشە',
      ar: 'رئيسة قسم الخزف والفنون النارية',
      en: 'Head of Ceramics & Glass Arts',
    },
    department: {
      ckb: 'بەشی سیرامیک',
      ar: 'قسم الخزف',
      en: 'Ceramics Department',
    },
    bio: {
      ckb: 'هونەرمەندی سیرامیک و خاوەنی خەڵاتی داهێنانی کەرەستەی خاو؛ یەکەم کەس کە کورەی غازیی پلەبەرزی پێشکەوتووی لە پەیمانگە دامەزراند.',
      ar: 'خزافة حائزة على جوائز ابتكار الخامات؛ رائدة تأسيس أفران الحرق الغازية الحديثة بالمعهد.',
      en: 'Ceramicist and kiln specialist; pioneered high-fire reduction and raku firing techniques in the regional atelier.',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    academicDegrees: [
      {
        ckb: 'ماستەر لە سیرامیک و شوشەسازی - زانکۆی بەغدا',
        ar: 'ماجستير في الخزف والزجاج - جامعة بغداد',
        en: 'MFA in Ceramic Arts & Kilncraft • University of Baghdad',
      },
    ],
    contactEmail: 'chiman.ceramics@cfa-chamchamal.edu.krd',
    officeLocation: {
      ckb: 'هۆڵی کورەکان و کۆگای گلێنە (D-02)',
      ar: 'قاعة الأفران ومستودع الفخار (D-02)',
      en: 'Kiln Facility D-02',
    },
    order: 5,
  },
  {
    id: 'hemin-sardar-ali',
    slug: 'hemin-sardar-ali',
    name: {
      ckb: 'مامۆستا هێمن سەردار عەلی',
      ar: 'أ. هيمن سردار علي',
      en: 'Prof. Hemin Sardar Ali',
    },
    role: {
      ckb: 'سەرۆکی بەشی دیزاین، گرافیک و چاپ',
      ar: 'رئيس قسم التصميم، الجرافيك وفنون الطباعة',
      en: 'Head of Design, Printmaking & Typography',
    },
    department: {
      ckb: 'بەشی دیزاین و چاپ',
      ar: 'قسم التصميم والطباعة',
      en: 'Design & Printmaking Dept.',
    },
    bio: {
      ckb: 'دیزاینەر و تایپۆگرافەری پیتە کوردییەکان؛ سەرپەرشتیاری تاقیگەی چاپی دار و ئیتچینگ و ڕابەری تەکنەلۆژیای دیجیتاڵ لە پەیمانگە.',
      ar: 'مصمم جرافيكي وباحث في التايبوغرافي الكردي؛ المشرف على مختبر الطباعة اليدوية والرقمية.',
      en: 'Graphic designer and Kurdish typography researcher; directs printmaking, serigraphy, and digital design ateliers.',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    academicDegrees: [
      {
        ckb: 'ماستەر لە دیزاینی پەیوەندییە بینراوەکان - زانکۆی ئیستەنبوڵ',
        ar: 'ماجستير في التصميم البصري - جامعة إسطنبول',
        en: 'Master in Visual Communication Design • Istanbul University',
      },
    ],
    contactEmail: 'hemin.design@cfa-chamchamal.edu.krd',
    officeLocation: {
      ckb: 'تاقیگەی دیجیتاڵ و چاپەمەنی (B-205)',
      ar: 'مختبر الطباعة والتصميم الرقمي (B-205)',
      en: 'Digital Media Lab B-205',
    },
    order: 6,
  },
];
