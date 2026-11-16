/**
 * Initial portfolio content (EN + AR), migrated from the old site,
 * C:\MyProjects, GitHub (Layan-Alwattar) and the certificates folder.
 *
 * Rich text uses a tiny markdown-ish format (see build-seed.mjs):
 *   blank line = new paragraph · "## " = heading · "- " = bullet · **bold**
 *
 * Images live in /public/content/... and can later be replaced from the
 * admin Media library.
 *
 * status: 'draft' items need your review before they go public.
 */

export const settings = {
  full_name: { en: 'Layan Mohammad Alwattar', ar: 'ليان محمد الوتار' },
  headline: { en: 'AI/ML & Software Engineer', ar: 'تعلّم الآلة وهندسة البرمجيات' },
  tagline: {
    en: 'Computer Science graduate from Qatar University building end-to-end machine learning pipelines, predictive analytics, and bilingual, real-time full-stack products.',
    ar: 'خريجة علوم الحاسب من جامعة قطر، أبني مسارات تعلّم آلة متكاملة وتحليلات تنبؤية ومنتجات برمجية ثنائية اللغة تعمل في الوقت الفعلي.',
  },
  location: { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
  availability: { en: 'Available for AI/ML & Software Engineering roles', ar: 'متاحة لفرص تعلّم الآلة وهندسة البرمجيات' },
  show_availability: true,
  hero_tags: [
    { en: 'Machine Learning', ar: 'تعلّم الآلة' },
    { en: 'Deep Learning', ar: 'التعلّم العميق' },
    { en: 'Data Science', ar: 'علم البيانات' },
    { en: 'Python', ar: 'بايثون' },
    { en: 'Geospatial Analytics', ar: 'التحليلات الجغرافية' },
    { en: 'Full-Stack Development', ar: 'تطوير الويب المتكامل' },
  ],
  about_title: { en: 'Hi, I’m Layan', ar: 'أهلاً، أنا ليان' },
  about_story: {
    en: `I’m a Computer Science graduate from Qatar University (Class of 2026) who loves turning ideas into products people actually use — from machine-learning models to real-time mobile apps.

My senior capstone, **Eventura**, taught me what it takes to ship: I built the Flutter app’s backend integration on Supabase — real-time channels, row-level security, database triggers and cron jobs, GPS geofencing and a context-aware notification system — and coordinated it with a web dashboard built by my teammates.

On the AI side, I’ve built ML pipelines on 16,000+ records, reached 99% accuracy classifying brain-tumor MRI scans with transfer learning, and taken part in research programs at the Qatar University Young Scientists Center.

I care about bilingual, accessible design (Arabic and English, full RTL), clear communication, and building things that serve a community — like **Tafheem**, a Qur’anic reflection platform where I lead development.`,
    ar: `تخرّجت في علوم الحاسب من جامعة قطر (دفعة 2026)، وأحب تحويل الأفكار إلى منتجات يستخدمها الناس فعلاً — من نماذج تعلّم الآلة إلى تطبيقات الجوال التي تعمل في الوقت الفعلي.

علّمني مشروع التخرج **إيفنتورا** ما يتطلبه إطلاق منتج حقيقي: بنيت تكامل تطبيق Flutter مع Supabase — القنوات اللحظية، وأمان مستوى الصفوف، والمشغّلات والمهام المجدولة في قاعدة البيانات، والسياج الجغرافي عبر GPS، ونظام إشعارات ذكي — ونسّقته مع لوحة تحكم الويب التي بناها زملائي.

وفي مجال الذكاء الاصطناعي، بنيت مسارات تعلّم آلة على أكثر من 16,000 سجل، ووصلت إلى دقة 99% في تصنيف صور أورام الدماغ باستخدام التعلّم بالنقل، وشاركت في برامج بحثية في مركز جامعة قطر للعلماء الشباب.

أهتم بالتصميم ثنائي اللغة وسهل الوصول (العربية والإنجليزية مع دعم كامل للاتجاه من اليمين لليسار)، وبالتواصل الواضح، وببناء ما يخدم المجتمع — مثل **تفهيم**، منصة التدبّر القرآني التي أقود تطويرها.`,
  },
  interests: [
    { icon: 'brain', label: { en: 'Machine learning', ar: 'تعلّم الآلة' } },
    { icon: 'smartphone', label: { en: 'Mobile apps', ar: 'تطبيقات الجوال' } },
    { icon: 'map', label: { en: 'Geospatial data', ar: 'البيانات الجغرافية' } },
    { icon: 'languages', label: { en: 'Bilingual design', ar: 'التصميم ثنائي اللغة' } },
    { icon: 'book-open', label: { en: 'Teaching Arabic', ar: 'تعليم العربية' } },
  ],
  fun_facts: [
    { emoji: '🎤', text: { en: 'I helped organize Qatar University’s AI Week 2025.', ar: 'شاركت في تنظيم أسبوع الذكاء الاصطناعي 2025 في جامعة قطر.' } },
    { emoji: '📚', text: { en: 'I completed Iqra teacher training for teaching Arabic to native and non-native speakers.', ar: 'أتممت دورة تأهيل المعلمين لمنهاج اقرأ لتعليم العربية للناطقين بها وبغيرها.' } },
    { emoji: '💬', text: { en: 'I took part in QU’s first illustrated story marathon (ComicsThon 2026).', ar: 'شاركت في النسخة الأولى من ماراثون القصص المصورة (كوميكس ثون 2026).' } },
  ],
  stats: [
    { value: 10, suffix: '+', label: { en: 'Projects shipped', ar: 'مشروعاً منجزاً' } },
    { value: 500, suffix: '', label: { en: 'Concurrent users tested on Eventura', ar: 'مستخدم متزامن في اختبار إيفنتورا' } },
    { value: 99, suffix: '%', label: { en: 'Brain-tumor classification accuracy', ar: 'دقة تصنيف أورام الدماغ' } },
    { value: 2, suffix: '', label: { en: 'Research programs', ar: 'برنامجان بحثيان' } },
  ],
  contact_email: 'alwattarlayan@gmail.com',
  contact_intro: {
    en: 'Have a role, a project, or an idea you’d like to build together? I’d love to hear from you.',
    ar: 'هل لديك فرصة عمل أو مشروع أو فكرة نبنيها معاً؟ يسعدني تواصلك.',
  },
  seo_title: { en: 'Layan Alwattar — AI/ML & Software Engineer', ar: 'ليان الوتار — تعلّم الآلة وهندسة البرمجيات' },
  seo_description: {
    en: 'Portfolio of Layan Alwattar: machine learning, data analysis, and bilingual full-stack & mobile apps. Qatar University CS, Class of 2026.',
    ar: 'معرض أعمال ليان الوتار: تعلّم الآلة وتحليل البيانات وتطبيقات الويب والجوال ثنائية اللغة. علوم الحاسب، جامعة قطر، دفعة 2026.',
  },
};

export const socialLinks = [
  { platform: 'github', label: { en: 'GitHub', ar: 'جيت هب' }, url: 'https://github.com/Layan-Alwattar' },
  { platform: 'linkedin', label: { en: 'LinkedIn', ar: 'لينكدإن' }, url: 'https://www.linkedin.com/in/layanalwattar' },
  { platform: 'email', label: { en: 'Email', ar: 'البريد' }, url: 'mailto:alwattarlayan@gmail.com' },
];

export const projectCategories = [
  { slug: 'ai-ml', name: { en: 'AI / ML', ar: 'الذكاء الاصطناعي' } },
  { slug: 'full-stack', name: { en: 'Full-Stack', ar: 'تطوير متكامل' } },
  { slug: 'mobile', name: { en: 'Mobile', ar: 'تطبيقات الجوال' } },
  { slug: 'data', name: { en: 'Data & Databases', ar: 'البيانات وقواعدها' } },
  { slug: 'research', name: { en: 'Research', ar: 'بحث علمي' } },
];

export const projects = [
  {
    slug: 'eventura',
    status: 'published',
    featured: true,
    categories: ['full-stack', 'mobile'],
    title: { en: 'Eventura — Smart Event Management', ar: 'إيفنتورا — إدارة الفعاليات الذكية' },
    label: { en: 'Senior Capstone · Qatar University', ar: 'مشروع التخرج · جامعة قطر' },
    summary: {
      en: 'A web + mobile event platform with QR check-ins under 3 seconds, GPS geofencing, gamified booth challenges and live analytics — load-tested with 500 concurrent users.',
      ar: 'منصة فعاليات للويب والجوال بتسجيل حضور عبر QR في أقل من 3 ثوانٍ، وسياج جغرافي، وتحديات تفاعلية للأجنحة، وتحليلات لحظية — اختُبرت مع 500 مستخدم متزامن.',
    },
    tools: ['Flutter', 'Dart', 'Supabase', 'PostgreSQL', 'Realtime', 'Next.js', 'React', 'Tailwind', 'Leaflet', 'Geofencing'],
    start_date: '2025-09-01',
    end_date: '2026-05-31',
    cover_url: '/content/eventura/poster.webp',
    github_url: null,
    gallery: [
      ['/content/eventura/features.webp', 'Mobile app features', 'مزايا تطبيق الجوال'],
      ['/content/eventura/screen-home.webp', 'Home: live and nearby events', 'الرئيسية: الفعاليات الجارية والقريبة'],
      ['/content/eventura/screen-event.webp', 'Event details and RSVP', 'تفاصيل الفعالية والتسجيل'],
      ['/content/eventura/screen-map.webp', 'Events near me (geolocation)', 'الفعاليات القريبة مني'],
      ['/content/eventura/screen-booths.webp', 'Booths and challenges', 'الأجنحة والتحديات'],
      ['/content/eventura/screen-notifications.webp', 'Geofence-triggered notification', 'إشعار عند دخول نطاق الفعالية'],
      ['/content/eventura/screen-judge.webp', 'Competition judging panel', 'لوحة تحكيم المسابقات'],
      ['/content/eventura/screen-achievements.webp', 'Achievements and badges', 'الإنجازات والأوسمة'],
    ],
    description: {
      en: `Eventura is a modular, cloud-backed event management system for booth-based events — conferences, exhibitions and university expos. Organizers and exhibitors use a web dashboard; visitors use a bilingual (EN/AR) Flutter mobile app. Both share one real-time Supabase backend.

Built by a team of four (Layan Alwattar, Amna Osman, Reem Aladbi, Khawlah Daraan), supervised by Dr. Khaled Shaban and Dr. Saeed Salem.`,
      ar: `إيفنتورا نظام معياري سحابي لإدارة الفعاليات القائمة على الأجنحة — المؤتمرات والمعارض ومعارض الجامعات. يستخدم المنظّمون والعارضون لوحة تحكم على الويب، ويستخدم الزوّار تطبيق جوال ثنائي اللغة مبنياً بـ Flutter، ويتشارك الجميع خلفية Supabase واحدة تعمل لحظياً.

نفّذه فريق من أربع طالبات (ليان الوتار، آمنة عثمان، ريم العدبي، خولة دعران) بإشراف د. خالد شعبان ود. سعيد سالم.`,
    },
    problem: {
      en: `Event platforms tend to be either rigid or complex and costly. Organizers face:

- Long check-in queues and paper sign-ups
- Fragmented tools for registration, badges and surveys
- No real-time view of who is attending, where, and when
- Low attendee engagement during long events`,
      ar: `تميل منصات الفعاليات إلى أن تكون إما جامدة أو معقدة ومكلفة. ويواجه المنظّمون:

- طوابير تسجيل طويلة وأوراق تسجيل يدوية
- أدوات متفرقة للتسجيل والشارات والاستبيانات
- غياب الرؤية اللحظية لمن يحضر وأين ومتى
- ضعف تفاعل الحضور خلال الفعاليات الطويلة`,
    },
    approach: {
      en: `I worked on the Flutter mobile app with my teammate Reem, focusing on the backend and integration side:

- Supabase in depth: schema design, row-level security, real-time channels that push database changes straight into the UI
- Database functions, triggers and scheduled cron jobs for waitlists, event status updates and auto-checkout
- Camera-based QR scanning and QR generation, GPS and geofencing
- A context-aware notification system reacting to geofence transitions, inactivity timers and user roles
- Full Arabic/English support with RTL, plus light and dark themes
- Custom SMTP for transactional email and shared API contracts with the web team`,
      ar: `عملت على تطبيق الجوال المبني بـ Flutter مع زميلتي ريم، مع التركيز على جانب الخلفية والتكامل:

- Supabase بعمق: تصميم المخطط، وأمان مستوى الصفوف، والقنوات اللحظية التي تنقل تغييرات قاعدة البيانات مباشرة إلى الواجهة
- دوال ومشغّلات ومهام مجدولة لقوائم الانتظار وتحديث حالة الفعاليات والخروج التلقائي
- مسح رموز QR بالكاميرا وتوليدها، وGPS والسياج الجغرافي
- نظام إشعارات ذكي يستجيب لدخول النطاقات الجغرافية ومؤقتات الخمول وأدوار المستخدمين
- دعم كامل للعربية والإنجليزية مع الاتجاه من اليمين لليسار، ووضعان فاتح وداكن
- بريد SMTP مخصص وعقود واجهات برمجية مشتركة مع فريق الويب`,
    },
    results: {
      en: `- QR scans respond within **3 seconds**
- Supports **500 concurrent users** without noticeable degradation
- New users completed registration and check-in within minutes, without training
- Live heatmaps, hour-by-hour engagement charts, competition judging and one-click PDF reports for organizers`,
      ar: `- استجابة مسح QR خلال **3 ثوانٍ**
- دعم **500 مستخدم متزامن** دون تراجع ملحوظ في الأداء
- أتمّ المستخدمون الجدد التسجيل وتسجيل الحضور خلال دقائق دون تدريب مسبق
- خرائط حرارية لحظية، ومخططات تفاعل بالساعة، وتحكيم للمسابقات، وتقارير PDF بنقرة واحدة للمنظّمين`,
    },
    learnings: {
      en: `- Plan early and ship iteratively — small, testable slices beat any single tool or framework
- Clear written communication beats a clever solution nobody else understands
- Treat integration as real work, with its own timeline
- Stay adaptable: calmly accepting requirement changes is the real skill

Carrying a project this complete gave me proof that I can take an idea from an empty repository to a working application.`,
      ar: `- خطّط مبكراً وأطلق على مراحل — الأجزاء الصغيرة القابلة للاختبار أفضل من أي أداة أو إطار عمل
- التواصل الكتابي الواضح أهم من حلٍّ ذكي لا يفهمه أحد
- التكامل عمل حقيقي يستحق جدولاً زمنياً خاصاً به
- المرونة: تقبّل تغيّر المتطلبات بهدوء هو المهارة الحقيقية

منحني إنجاز مشروع بهذا الحجم دليلاً على قدرتي على تحويل فكرة من مستودع فارغ إلى تطبيق يعمل.`,
    },
  },
  {
    slug: 'tafheem',
    status: 'published',
    featured: true,
    categories: ['full-stack'],
    title: { en: 'Tafheem — Qur’anic Reflection Platform', ar: 'تفهيم — منصة التدبّر القرآني' },
    label: { en: 'Production app · Lead Developer', ar: 'منصة منشورة · قائدة التطوير' },
    summary: {
      en: 'A Qur’anic reflection and spiritual-connection space. I lead the technical architecture, backend scaling and release schedule, deployed behind Cloudflare CDN for global speed.',
      ar: 'مساحة للتدبّر القرآني والارتباط الروحي. أقود البنية التقنية وتوسيع الخلفية وجدول الإصدارات، مع نشرها عبر شبكة Cloudflare لسرعة عالمية.',
    },
    tools: ['PHP', 'System Architecture', 'Cloudflare CDN', 'API Design', 'Hostinger'],
    is_ongoing: true,
    cover_url: '/content/tafheem/logo.webp',
    github_url: 'https://github.com/Layan-Alwattar/Tafheem',
    demo_url: 'https://tafheem.io',
    description: {
      en: `As Lead Developer, I direct Tafheem’s cloud architecture, backend scaling and release schedule. The platform is deployed securely behind Cloudflare’s CDN for optimized production speed and global caching.`,
      ar: `بصفتي قائدة التطوير، أوجّه البنية السحابية لمنصة تفهيم وتوسيع خلفيتها وجدول إصداراتها. المنصة منشورة بأمان خلف شبكة Cloudflare لتسريع الأداء والتخزين المؤقت عالمياً.`,
    },
  },
  {
    slug: 'video-game-sales-predictor',
    status: 'published',
    categories: ['ai-ml', 'data'],
    title: { en: 'Video Game Sales Predictor', ar: 'التنبؤ بمبيعات ألعاب الفيديو' },
    label: { en: 'Machine Learning', ar: 'تعلّم الآلة' },
    summary: {
      en: 'End-to-end ML pipelines on 16,000+ records using Random Forest and neural networks, with hyperparameter tuning via GridSearchCV.',
      ar: 'مسارات تعلّم آلة متكاملة على أكثر من 16,000 سجل باستخدام الغابات العشوائية والشبكات العصبية، مع ضبط المعاملات عبر GridSearchCV.',
    },
    tools: ['Python', 'Scikit-Learn', 'PyTorch', 'Pandas', 'GridSearchCV'],
    description: {
      en: `Built complete machine-learning pipelines — cleaning, feature engineering, model training and evaluation — on a dataset of 16,000+ video game records, comparing Random Forest and neural-network regressors and tuning them with GridSearchCV.`,
      ar: `بنيت مسارات تعلّم آلة كاملة — التنظيف وهندسة الخصائص والتدريب والتقييم — على مجموعة بيانات تضم أكثر من 16,000 لعبة فيديو، مع مقارنة نماذج الغابات العشوائية والشبكات العصبية وضبطها عبر GridSearchCV.`,
    },
  },
  {
    slug: 'brain-tumor-classification',
    status: 'published',
    categories: ['ai-ml'],
    title: { en: 'Brain Tumor Classification', ar: 'تصنيف أورام الدماغ' },
    label: { en: 'Deep Learning · Computer Vision', ar: 'التعلّم العميق · الرؤية الحاسوبية' },
    summary: {
      en: 'Transfer learning with ResNet50 and MobileNetV2 to classify brain MRI scans, reaching 99% accuracy.',
      ar: 'التعلّم بالنقل باستخدام ResNet50 وMobileNetV2 لتصنيف صور الرنين المغناطيسي للدماغ بدقة 99%.',
    },
    tools: ['TensorFlow', 'Keras', 'CNNs', 'ResNet50', 'MobileNetV2', 'Transfer Learning'],
    description: {
      en: `An image-classification system for brain MRI scans that fine-tunes pretrained CNNs (ResNet50 and MobileNetV2). Transfer learning let the models reach **99% classification accuracy** on the test set.`,
      ar: `نظام لتصنيف صور الرنين المغناطيسي للدماغ يعتمد على ضبط شبكات عصبية التفافية مدرّبة مسبقاً (ResNet50 وMobileNetV2). مكّن التعلّم بالنقل النماذج من الوصول إلى **دقة تصنيف 99%** على بيانات الاختبار.`,
    },
  },
  {
    slug: 'kalimati',
    status: 'published',
    categories: ['mobile'],
    title: { en: 'Kalimati — Language Learning App', ar: 'كلماتي — تطبيق لتعلّم اللغات' },
    label: { en: 'Mobile App · CMPS 312', ar: 'تطبيق جوال · CMPS 312' },
    summary: {
      en: 'A Flutter app that turns teacher-built word packages into flash cards, sentence puzzles and matching games.',
      ar: 'تطبيق Flutter يحوّل حزم الكلمات التي يعدّها المعلم إلى بطاقات تعليمية وألغاز جمل وألعاب مطابقة.',
    },
    tools: ['Flutter', 'Dart', 'SQLite'],
    cover_url: '/content/kalimati/poster.webp',
    gallery: [['/content/kalimati/screens.webp', 'App screens', 'شاشات التطبيق']],
    description: {
      en: `Kalimati helps learners **learn words, play the games and remember more**. Teachers build learning packages (words, definitions, sentences and multimedia links), and students practice through:

- Flash cards
- Unscramble-the-sentence puzzles
- Match word & definition

Built with Team G5 (Layan Alwattar, Maryam Bawazir, Reem Aladbi, Sara Alyahri) for CMPS 312 at Qatar University, including entity and repository class diagrams and full use-case testing.`,
      ar: `يساعد كلماتي المتعلمين على **تعلّم الكلمات واللعب وتذكّر المزيد**. يعدّ المعلمون حزماً تعليمية (كلمات وتعريفات وجمل وروابط وسائط)، ويتدرّب الطلاب من خلال:

- البطاقات التعليمية
- ترتيب الجمل المبعثرة
- مطابقة الكلمة بتعريفها

نُفّذ مع الفريق G5 (ليان الوتار، مريم باوزير، ريم العدبي، سارة اليهري) لمقرر CMPS 312 في جامعة قطر، مع مخططات الكيانات والمستودعات واختبار جميع حالات الاستخدام.`,
    },
  },
  {
    slug: 'mizan',
    status: 'published',
    categories: ['full-stack'],
    title: { en: 'Mizān — Workload Management Web App', ar: 'ميزان — تطبيق ويب لإدارة عبء العمل' },
    label: { en: 'Web App · CMPS 350', ar: 'تطبيق ويب · CMPS 350' },
    summary: {
      en: 'A web app that helps students and instructors balance course workload: assessments, a student calendar, course comments and workload summary reports.',
      ar: 'تطبيق ويب يساعد الطلاب والمدرّسين على موازنة عبء المقررات: التقييمات، وتقويم الطالب، وتعليقات المقررات، وتقارير ملخص العبء.',
    },
    tools: ['JavaScript', 'Node.js', 'REST API', 'HTML', 'CSS'],
    description: {
      en: `Mizān (“balance”) lets instructors add, update and delete assessments, while students see an assessments calendar across their courses. It also supports course comments and a courses workload summary report — designed with entity, repository and service class diagrams and an /api REST layer.

Group project with Amna, Khawlah and Reem.`,
      ar: `يتيح ميزان للمدرّسين إضافة التقييمات وتعديلها وحذفها، بينما يرى الطلاب تقويماً لتقييمات جميع مقرراتهم. كما يدعم تعليقات المقررات وتقريراً لملخص عبء العمل — وصُمّم بمخططات الكيانات والمستودعات والخدمات مع طبقة REST.

مشروع جماعي مع آمنة وخولة وريم.`,
    },
  },
  {
    slug: 'nutrisnap',
    status: 'published',
    categories: ['full-stack'],
    title: { en: 'NutriSnap — Meal Tracking Web App', ar: 'نيوتري سناب — تطبيق لتتبع الوجبات' },
    label: { en: 'Web App · REST API', ar: 'تطبيق ويب · واجهة REST' },
    summary: {
      en: 'A meal-logging web app with a full REST API: CRUD, search, tag and date filters, ratings and a nutrition summary report.',
      ar: 'تطبيق ويب لتسجيل الوجبات مع واجهة REST كاملة: الإضافة والتعديل والحذف، والبحث، والتصفية حسب الوسم والتاريخ، والتقييم، وتقرير ملخص.',
    },
    tools: ['JavaScript', 'Node.js', 'REST API', 'Postman'],
    description: {
      en: `NutriSnap exposes endpoints such as GET/POST/PUT/DELETE /api/meals, filtering by tag or date, rating meals and a /summary report — all tested with Postman — plus a front end with search, inline editing, show/hide descriptions and a summary page.`,
      ar: `يوفّر نيوتري سناب نقاط وصول مثل GET وPOST وPUT وDELETE على ‎/api/meals، والتصفية حسب الوسم أو التاريخ، وتقييم الوجبات، وتقرير ملخص — جميعها مختبرة عبر Postman — إلى جانب واجهة تدعم البحث والتعديل المباشر وعرض الأوصاف وصفحة الملخص.`,
    },
  },
  {
    slug: 'library-organizer',
    status: 'published',
    categories: ['mobile'],
    title: { en: 'Library Organizer — Mobile App', ar: 'منظّم المكتبة — تطبيق جوال' },
    label: { en: 'Mobile App', ar: 'تطبيق جوال' },
    summary: {
      en: 'A mobile app that loads books, members and transactions from an API, with search, overdue filters and borrow/return flows.',
      ar: 'تطبيق جوال يجلب الكتب والأعضاء والمعاملات من واجهة برمجية، مع البحث وتصفية المتأخرات وعمليات الإعارة والإرجاع.',
    },
    tools: ['Flutter', 'Dart', 'REST API'],
    description: {
      en: `Features API data loading for books, members and transactions; search by title, member name or email; filters for transaction status (all / active / overdue) and available books; and complete borrow and return scenarios.`,
      ar: `يتضمن جلب بيانات الكتب والأعضاء والمعاملات من واجهة برمجية، والبحث بالعنوان أو اسم العضو أو بريده، وتصفية المعاملات حسب الحالة (الكل / النشطة / المتأخرة) والكتب المتاحة، وسيناريوهات إعارة وإرجاع كاملة.`,
    },
  },
  {
    slug: 'chef-sana-restaurant',
    status: 'published',
    categories: ['full-stack'],
    title: { en: 'Chef Sana — Restaurant Website', ar: 'الشيف سناء — موقع مطعم' },
    label: { en: 'Website', ar: 'موقع إلكتروني' },
    summary: { en: 'A restaurant website with an online menu, deployed on Vercel.', ar: 'موقع مطعم مع قائمة طعام إلكترونية، منشور على Vercel.' },
    tools: ['JavaScript', 'Vercel'],
    github_url: 'https://github.com/Layan-Alwattar/chef-sana-restaurant',
    demo_url: 'https://chef-sana-restaurant.vercel.app',
  },
  {
    slug: 'qatar-tour-agency-database',
    status: 'published',
    categories: ['data'],
    title: { en: 'Qatar Tour Agency — Database Design', ar: 'وكالة قطر للسياحة — تصميم قاعدة بيانات' },
    label: { en: 'Database Systems', ar: 'نظم قواعد البيانات' },
    summary: {
      en: 'A normalized (3NF) database for a tour agency: packages, bookings and guide assignments, with integrity constraints and a report.',
      ar: 'قاعدة بيانات مطبّعة (3NF) لوكالة سياحية: الباقات والحجوزات وتعيين المرشدين، مع قيود السلامة وتقرير.',
    },
    tools: ['SQL', 'Oracle SQL', 'Java', 'ER Modeling', '3NF'],
    github_url: 'https://github.com/Layan-Alwattar/Qatar-Tour-Agency-QTA-',
  },
  // ---------------------------------------------------- drafts to review
  {
    slug: 'multi-tenant-bilingual-platform',
    status: 'draft',
    categories: ['full-stack'],
    title: { en: 'Multi-Tenant Bilingual Platform', ar: 'منصة متعددة المستأجرين ثنائية اللغة' },
    label: { en: 'System Architecture', ar: 'بنية الأنظمة' },
    summary: {
      en: 'One deployment serving many organizations, with tenant isolation enforced in the database (signed claims + row-level security), full EN/AR RTL mirroring, PDFs, spreadsheets and dashboards.',
      ar: 'نشر واحد يخدم مؤسسات متعددة، مع عزل البيانات على مستوى قاعدة البيانات (مطالبات موقّعة وأمان مستوى الصفوف)، ودعم كامل للعربية والإنجليزية، وملفات PDF وجداول ولوحات تحكم.',
    },
    tools: ['Next.js', 'TypeScript', 'PostgreSQL', 'Row-Level Security', 'Tailwind', 'Serverless'],
    // Images in /private-assets/gci — upload via Admin → Media when approved.
  },
  {
    slug: 'shatharat',
    status: 'draft',
    categories: ['full-stack', 'mobile'],
    title: { en: 'Shatharat — Training Center Platform & Games', ar: 'شذرات — منصة وألعاب لمركز تدريب تربوي' },
    label: { en: 'Web, Mobile & Educational Games', ar: 'ويب وجوال وألعاب تعليمية' },
    summary: {
      en: 'Website planning, a Flutter app prototype (parent, trainer and admin areas) and offline educational web games for Shatharat Educational Training Center.',
      ar: 'تخطيط الموقع الإلكتروني ونموذج تطبيق Flutter (أقسام لولي الأمر والمدرب والإدارة) وألعاب تعليمية على الويب تعمل دون اتصال لمركز شذرات للتدريب التربوي.',
    },
    tools: ['Flutter', 'Dart', 'JavaScript', 'PWA', 'Arabic UX'],
    // Images in /private-assets/shatharat — upload via Admin → Media when approved.
  },
  {
    slug: 'road-accidents-qatar',
    status: 'draft',
    categories: ['ai-ml', 'research'],
    title: { en: 'Road Accidents in Qatar — ML Research', ar: 'حوادث الطرق في قطر — بحث بتعلّم الآلة' },
    label: { en: 'Research · QU Young Scientists Center', ar: 'بحث · مركز جامعة قطر للعلماء الشباب' },
    summary: {
      en: 'Machine-learning research on road accidents across Qatar’s zones, carried out in the Outcomes-Directed Intensive Research Track of SRIP 2024 at the Qatar Transportation and Traffic Safety Center.',
      ar: 'بحث بتعلّم الآلة حول حوادث الطرق في مناطق قطر، ضمن مسار البحث المكثف في برنامج التدريب البحثي الصيفي 2024 بمركز قطر للنقل والسلامة المرورية.',
    },
    tools: ['Python', 'Machine Learning', 'Geospatial Analysis'],
    start_date: '2024-05-26',
    end_date: '2024-06-13',
  },
];

export const skillCategories = [
  {
    key: 'languages',
    icon: 'code',
    name: { en: 'Languages & Frameworks', ar: 'اللغات وأطر العمل' },
    skills: ['Python', 'Java', 'SQL', 'Dart', 'JavaScript', 'TypeScript', 'PHP', 'C++', 'Flutter', 'Next.js', 'React', 'Tailwind CSS'],
  },
  {
    key: 'ai',
    icon: 'brain',
    name: { en: 'AI & Data Science', ar: 'الذكاء الاصطناعي وعلم البيانات' },
    skills: [
      ['Machine Learning', 'تعلّم الآلة'],
      ['Deep Learning', 'التعلّم العميق'],
      'PyTorch',
      'TensorFlow / Keras',
      'Scikit-Learn',
      ['CNNs & Transfer Learning', 'الشبكات الالتفافية والتعلّم بالنقل'],
      ['Exploratory Data Analysis', 'تحليل البيانات الاستكشافي'],
      ['Predictive Analytics', 'التحليلات التنبؤية'],
      ['SPSS & Statistics', 'SPSS والإحصاء'],
      'MATLAB',
    ],
  },
  {
    key: 'cloud',
    icon: 'database',
    name: { en: 'Cloud & Backend', ar: 'السحابة والخلفية' },
    skills: [
      'Supabase',
      'PostgreSQL',
      'Oracle SQL',
      ['REST APIs', 'واجهات REST'],
      ['Realtime subscriptions', 'الاشتراكات اللحظية'],
      ['Row-Level Security', 'أمان مستوى الصفوف'],
      'Prisma',
      'Cloudflare CDN',
    ],
  },
  {
    key: 'product',
    icon: 'smartphone',
    name: { en: 'Mobile & Product', ar: 'الجوال والمنتج' },
    skills: [
      ['GPS & Geofencing', 'GPS والسياج الجغرافي'],
      ['QR systems', 'أنظمة QR'],
      ['Bilingual / RTL UI', 'واجهات ثنائية اللغة'],
      ['UI/UX design', 'تصميم الواجهات وتجربة المستخدم'],
      ['Team coordination', 'تنسيق الفرق'],
    ],
  },
];

export const certificates = [
  {
    slug: 'qu-ysc-research-excellence-2024',
    status: 'published',
    title: { en: 'Research Excellence — Summer Research Internship Program 2024', ar: 'التميّز البحثي — برنامج التدريب البحثي الصيفي 2024' },
    provider: { en: 'Qatar University Young Scientists Center · Qatar Transportation and Traffic Safety Center', ar: 'مركز جامعة قطر للعلماء الشباب · مركز قطر للنقل والسلامة المرورية' },
    issued_on: '2024-06-13',
    image_url: '/content/certificates/qu-ysc-research-2024.webp',
    skills: ['Research Methodology', 'Machine Learning'],
    summary: {
      en: 'Completed the research methodology course with recognized scholarly achievement in the Outcomes-Directed Intensive Research Track (26 May – 13 June 2024).',
      ar: 'إتمام البرنامج التدريبي في منهجية البحث بنجاح وتحقيق إنجاز علمي معترف به في مسار البحث المكثف ذي النتائج الموجّهة (26 مايو – 13 يونيو 2024).',
    },
  },
  {
    slug: 'npc-microsoft-datathon-2025',
    status: 'published',
    title: { en: 'NPC Qatar Datathon 2025', ar: 'داتاثون قطر 2025' },
    provider: { en: 'National Planning Council × Microsoft', ar: 'المجلس الوطني للتخطيط × مايكروسوفت' },
    issued_on: '2025-02-22',
    image_url: '/content/certificates/npc-datathon-2025.webp',
    pdf_url: '/content/certificates/npc-datathon-2025.pdf',
    skills: ['Data Analysis', 'Data Storytelling'],
    summary: {
      en: '“Shaping our future with data” — a national datathon held 15–20 February 2025.',
      ar: '«تشكيل مستقبلنا بالبيانات» — داتاثون وطني أقيم من 15 إلى 20 فبراير 2025.',
    },
  },
  {
    slug: 'ai-week-2025-organizer',
    status: 'published',
    title: { en: 'AI Week 2025 — Organizer', ar: 'أسبوع الذكاء الاصطناعي 2025 — منظِّمة' },
    provider: { en: 'Artificial Intelligence Association, Qatar University', ar: 'رابطة الذكاء الاصطناعي، جامعة قطر' },
    issued_on: '2025-10-30',
    image_url: '/content/certificates/ai-week-2025.webp',
    skills: ['Event Organization', 'Leadership'],
    summary: { en: 'Certificate of appreciation for organizing AI Week 2025 (27–30 October 2025).', ar: 'شهادة تقدير على المشاركة في تنظيم أسبوع الذكاء الاصطناعي 2025 (27–30 أكتوبر 2025).' },
  },
  {
    slug: 'deans-list-spring-2023',
    status: 'published',
    title: { en: 'Certificate of Excellence — Dean’s List (Spring 2023)', ar: 'شهادة تميّز — قائمة العميد (ربيع 2023)' },
    provider: { en: 'College of Engineering, Qatar University', ar: 'كلية الهندسة، جامعة قطر' },
    issued_on: '2024-04-01',
    image_url: '/content/certificates/deans-list-2023.webp',
    skills: [],
  },
  {
    slug: 'matlab-onramp',
    status: 'published',
    title: { en: 'MATLAB Onramp', ar: 'MATLAB Onramp' },
    provider: { en: 'MathWorks', ar: 'MathWorks' },
    issued_on: '2025-06-17',
    image_url: '/content/certificates/matlab-onramp.webp',
    pdf_url: '/content/certificates/matlab-onramp.pdf',
    skills: ['MATLAB'],
    summary: { en: 'Self-paced introduction to MATLAB, completed 100%.', ar: 'مقدمة ذاتية التعلّم في MATLAB، أُنجزت بنسبة 100%.' },
  },
  {
    slug: 'comicsthon-2026',
    status: 'published',
    title: { en: 'ComicsThon — Illustrated Story Marathon 2026', ar: 'كوميكس ثون — ماراثون القصص المصورة 2026' },
    provider: { en: 'Student Activities Department, Qatar University', ar: 'إدارة الأنشطة الطلابية، جامعة قطر' },
    issued_on: '2026-04-19',
    image_url: '/content/certificates/comics-marathon-2026.webp',
    skills: ['Storytelling', 'Creativity'],
    summary: { en: 'Recognized for distinguished participation in the first edition of the illustrated story marathon.', ar: 'تقديراً للمشاركة المتميزة في النسخة الأولى من فعالية ماراثون القصص المصورة.' },
  },
  {
    slug: 'iqra-teacher-training',
    status: 'published',
    title: { en: 'Iqra Curriculum Teacher Training — Teaching Arabic', ar: 'دورة تأهيل المعلمين لمنهاج اقرأ في تعليم اللغة العربية' },
    provider: { en: 'Dar Al Quran (Canada) × Minhaj, hosted by Shatharat Center', ar: 'مؤسسة دار القرآن العالمية بكندا × شركة منهاج، برعاية مركز شذرات' },
    issued_on: '2023-06-14',
    image_url: '/content/certificates/iqra-teacher-training.webp',
    pdf_url: '/content/certificates/iqra-teacher-training.pdf',
    skills: ['Teaching', 'Arabic'],
    summary: {
      en: 'Teacher training in the Iqra curriculum for teaching Arabic to native and non-native speakers.',
      ar: 'تأهيل المعلمين لتدريس منهاج اقرأ في تعليم اللغة العربية للناطقين بها وبغيرها.',
    },
  },
  {
    slug: 'note-taking-workshop',
    status: 'published',
    title: { en: 'Note-Taking & Summarizing Workshop', ar: 'ورشة تدوين الملاحظات وإعداد الملخصات' },
    provider: { en: 'Student Learning Support Center, Qatar University', ar: 'مركز دعم تعلّم الطلاب، جامعة قطر' },
    issued_on: '2022-12-01',
    image_url: '/content/certificates/note-taking-workshop.webp',
    pdf_url: '/content/certificates/note-taking-workshop.pdf',
    skills: ['Study Skills'],
  },
  {
    slug: 'ielts-preparation-workshop',
    status: 'published',
    title: { en: 'How to Prepare for Your IELTS Test (Reading, Listening & Speaking)', ar: 'الاستعداد لاختبار IELTS (القراءة والاستماع والمحادثة)' },
    provider: { en: 'Section of Writing and Language Support, Qatar University', ar: 'قسم دعم الكتابة واللغة، جامعة قطر' },
    issued_on: '2022-12-01',
    image_url: '/content/certificates/ielts-preparation.webp',
    pdf_url: '/content/certificates/ielts-preparation.pdf',
    skills: ['English'],
  },
  {
    slug: 'ielts-writing-task-1',
    status: 'published',
    title: { en: 'IELTS Writing Task 1 — A Practical Guide', ar: 'الكتابة في IELTS (المهمة الأولى) — دليل عملي' },
    provider: { en: 'Section of Writing and Language Support, Qatar University', ar: 'قسم دعم الكتابة واللغة، جامعة قطر' },
    issued_on: '2022-12-01',
    image_url: '/content/certificates/ielts-writing-task1.webp',
    pdf_url: '/content/certificates/ielts-writing-task1.pdf',
    skills: ['English', 'Academic Writing'],
  },
  {
    slug: 'alif-lam-meem-al-baqarah',
    status: 'draft',
    title: { en: 'Qur’an Recitation — Surat Al-Baqarah', ar: 'تسميع سورة البقرة' },
    provider: { en: 'Alif Lam Meem for Islamic Distance Education', ar: 'ألف لام ميم للتعليم الشرعي عن بُعد' },
    issued_on: '2024-03-29',
    // Image in /private-assets — upload via Admin → Media if you publish this.
    skills: [],
  },
];

export const timeline = [
  {
    key: 'qu-bsc',
    kind: 'education',
    icon: 'graduation-cap',
    title: { en: 'B.Sc. in Computer Science', ar: 'بكالوريوس علوم الحاسب' },
    organization: { en: 'Qatar University', ar: 'جامعة قطر' },
    location: { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
    end_date: '2026-06-01',
    date_label: { en: 'Class of 2026', ar: 'دفعة 2026' },
    description: { en: 'GPA 3.34 · Dean’s List, College of Engineering.', ar: 'المعدل 3.34 · قائمة العميد، كلية الهندسة.' },
    highlights: [
      { en: 'Senior capstone: Eventura (smart event management)', ar: 'مشروع التخرج: إيفنتورا (إدارة الفعاليات الذكية)' },
    ],
  },
  {
    key: 'eventura-capstone',
    kind: 'achievement',
    icon: 'rocket',
    title: { en: 'Senior Capstone — Eventura', ar: 'مشروع التخرج — إيفنتورا' },
    organization: { en: 'Computer Science & Engineering, Qatar University', ar: 'قسم علوم وهندسة الحاسب، جامعة قطر' },
    start_date: '2025-09-01',
    end_date: '2026-05-07',
    description: {
      en: 'Real-time web + mobile event platform supporting 500 concurrent users with sub-3-second QR check-ins.',
      ar: 'منصة فعاليات لحظية للويب والجوال تدعم 500 مستخدم متزامن مع تسجيل حضور عبر QR في أقل من 3 ثوانٍ.',
    },
    link_url: '/projects/eventura',
  },
  {
    key: 'srip-2026',
    kind: 'experience',
    icon: 'flask-conical',
    title: { en: 'Research Intern — SRIP 2026', ar: 'متدرّبة بحثية — برنامج التدريب البحثي الصيفي 2026' },
    organization: { en: 'Qatar University Young Scientists Center', ar: 'مركز جامعة قطر للعلماء الشباب' },
    end_date: '2026-05-10',
    date_label: { en: '2026', ar: '2026' },
    description: {
      en: 'Co-authored “AI Simulation Tools in Higher Education: Student Perspectives” — questionnaire design, SPSS analysis and focus groups.',
      ar: 'شاركت في تأليف بحث «أدوات المحاكاة بالذكاء الاصطناعي في التعليم العالي: وجهات نظر الطلاب» — تصميم الاستبيان والتحليل بـ SPSS ومجموعات النقاش.',
    },
    link_url: '/analyses/ai-simulation-tools-higher-education',
  },
  {
    key: 'ai-week-2025',
    kind: 'experience',
    icon: 'sparkles',
    title: { en: 'Organizer — AI Week 2025', ar: 'منظِّمة — أسبوع الذكاء الاصطناعي 2025' },
    organization: { en: 'Artificial Intelligence Association, Qatar University', ar: 'رابطة الذكاء الاصطناعي، جامعة قطر' },
    start_date: '2025-10-27',
    end_date: '2025-10-30',
  },
  {
    key: 'tafheem-lead',
    kind: 'experience',
    icon: 'code',
    title: { en: 'Lead Developer — Tafheem', ar: 'قائدة التطوير — تفهيم' },
    organization: { en: 'Qur’anic reflection platform', ar: 'منصة التدبّر القرآني' },
    is_current: true,
    description: { en: 'Directing cloud architecture, backend scaling and releases.', ar: 'توجيه البنية السحابية وتوسيع الخلفية والإصدارات.' },
    link_url: '/projects/tafheem',
  },
  {
    key: 'npc-datathon',
    kind: 'achievement',
    icon: 'trophy',
    title: { en: 'NPC Qatar Datathon Laureate', ar: 'داتاثون قطر — المجلس الوطني للتخطيط' },
    organization: { en: 'National Planning Council × Microsoft', ar: 'المجلس الوطني للتخطيط × مايكروسوفت' },
    start_date: '2025-02-15',
    end_date: '2025-02-20',
    description: {
      en: 'Invited to present core insights to senior officials at the National Planning Council.',
      ar: 'دُعيت لعرض أبرز النتائج أمام كبار المسؤولين في المجلس الوطني للتخطيط.',
    },
  },
  {
    key: 'hia-research',
    kind: 'achievement',
    icon: 'plane',
    title: { en: 'Research Assistant Certificate', ar: 'شهادة مساعدة باحث' },
    organization: { en: 'Hamad International Airport', ar: 'مطار حمد الدولي' },
    description: {
      en: 'Honored for passenger-choice optimization analytics workflows.',
      ar: 'تكريماً لسير عمل تحليلات تحسين خيارات المسافرين.',
    },
  },
  {
    key: 'srip-2024',
    kind: 'achievement',
    icon: 'award',
    title: { en: 'Research Excellence — SRIP 2024', ar: 'التميّز البحثي — برنامج التدريب البحثي الصيفي 2024' },
    organization: { en: 'QU Young Scientists Center · Qatar Transportation and Traffic Safety Center', ar: 'مركز جامعة قطر للعلماء الشباب · مركز قطر للنقل والسلامة المرورية' },
    start_date: '2024-05-26',
    end_date: '2024-06-13',
  },
  {
    key: 'deans-list',
    kind: 'achievement',
    icon: 'medal',
    title: { en: 'Dean’s List', ar: 'قائمة العميد' },
    organization: { en: 'College of Engineering, Qatar University', ar: 'كلية الهندسة، جامعة قطر' },
    date_label: { en: 'Spring 2023', ar: 'ربيع 2023' },
    end_date: '2023-06-01',
  },
];

/** SRIP 2026 analysis + its reliability chart. */
export const analyses = [
  {
    slug: 'ai-simulation-tools-higher-education',
    status: 'published',
    title: { en: 'AI Simulation Tools in Higher Education: Student Perspectives', ar: 'أدوات المحاكاة بالذكاء الاصطناعي في التعليم العالي: وجهات نظر الطلاب' },
    summary: {
      en: 'A mixed-methods study (SRIP 2026, QU Young Scientists Center) of how undergraduates perceive AI simulation tools — usefulness, problem-solving confidence and engagement.',
      ar: 'دراسة بمنهج مختلط (برنامج التدريب البحثي الصيفي 2026، مركز جامعة قطر للعلماء الشباب) حول نظرة طلاب البكالوريوس إلى أدوات المحاكاة بالذكاء الاصطناعي — الفائدة المدركة والثقة في حل المشكلات والتفاعل.',
    },
    tools: ['SPSS', 'Cronbach’s Alpha', 'Spearman', 'Mann–Whitney U', 'Kruskal–Wallis', 'Thematic analysis'],
    insights: {
      en: `## Question
How do undergraduate students perceive AI simulation tools in higher education — and do perceptions differ across student groups?

## Method
- 15-item questionnaire measuring **Perceived Usefulness**, **Problem-Solving Confidence** and **Engagement & Motivation** (5 items each)
- 103 undergraduate participants from STEM and non-STEM disciplines, plus focus groups with internship students
- Descriptive statistics, Cronbach’s alpha, Spearman correlation, Mann–Whitney U and Kruskal–Wallis tests; thematic analysis of focus groups

## What the reliability analysis shows
All three scales showed **strong internal consistency** (α ≥ .87), so each construct can be summarized with a single score. Normality tests (Kolmogorov–Smirnov and Shapiro–Wilk, p < .001) indicated non-normal distributions, which is why the group comparisons use non-parametric tests.

Co-authored with the SRIP 2026 team under Dr. Jolly Bhadra.`,
      ar: `## السؤال
كيف ينظر طلاب البكالوريوس إلى أدوات المحاكاة بالذكاء الاصطناعي في التعليم العالي، وهل تختلف هذه النظرة بين فئات الطلاب؟

## المنهجية
- استبيان من 15 بنداً يقيس **الفائدة المدركة** و**الثقة في حل المشكلات** و**التفاعل والدافعية** (5 بنود لكل منها)
- 103 مشاركين من تخصصات علمية وغير علمية، إضافة إلى مجموعات نقاش مع طلاب التدريب
- إحصاءات وصفية، ومعامل كرونباخ ألفا، وارتباط سبيرمان، واختبارا مان–ويتني وكروسكال–واليس، وتحليل موضوعي لمجموعات النقاش

## ماذا يُظهر تحليل الثبات
أظهرت المقاييس الثلاثة **اتساقاً داخلياً قوياً** (ألفا ≥ 0.87)، ما يسمح بتلخيص كل مقياس بدرجة واحدة. وأشارت اختبارات التوزيع الطبيعي (كولموغوروف–سميرنوف وشابيرو–ويلك، p < .001) إلى توزيعات غير طبيعية، ولذلك استُخدمت اختبارات لا معلمية لمقارنة المجموعات.

بالمشاركة مع فريق برنامج 2026 بإشراف د. جولي بهادرا.`,
    },
    dataset: {
      name: 'SRIP 2026 — scale reliability',
      columns: [
        { name: 'Construct', type: 'string' },
        { name: 'Cronbach alpha', type: 'number' },
        { name: 'Items', type: 'number' },
      ],
      rows: [
        { Construct: 'Perceived Usefulness', 'Cronbach alpha': 0.912, Items: 5 },
        { Construct: 'Engagement & Motivation', 'Cronbach alpha': 0.899, Items: 5 },
        { Construct: 'Problem-Solving Confidence', 'Cronbach alpha': 0.873, Items: 5 },
      ],
    },
    chart: {
      title: { en: 'Scale reliability (Cronbach’s α)', ar: 'ثبات المقاييس (معامل كرونباخ ألفا)' },
      caption: {
        en: 'All scales exceed 0.80, indicating strong internal consistency (preliminary analysis, n = 87).',
        ar: 'تتجاوز جميع المقاييس 0.80، ما يدل على اتساق داخلي قوي (تحليل أولي، n = 87).',
      },
      chart_type: 'bar',
      x_column: 'Construct',
      y_columns: ['Cronbach alpha'],
      options: { aggregate: 'none', sort: 'none', horizontal: true, xLabel: '', yLabel: '' },
    },
  },
];
