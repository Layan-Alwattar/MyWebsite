/**
 * Portfolio content (EN + AR), migrated from the old site, C:\MyProjects,
 * GitHub (Layan-Alwattar), the certificates folders and Layan's notes.
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

I care about bilingual, accessible design (Arabic and English, full RTL), clear communication, and building things that serve a community — like **Tafheem**, a Qur’anic reflection platform where I lead development.

Right now I’m building the web platform and interactive learning games for **Shatharat Educational Training Center**, and interning with the IT department at Al Arqam Academy for Girls.`,
    ar: `تخرّجت في علوم الحاسب من جامعة قطر (دفعة 2026)، وأحب تحويل الأفكار إلى منتجات يستخدمها الناس فعلاً — من نماذج تعلّم الآلة إلى تطبيقات الجوال التي تعمل في الوقت الفعلي.

علّمني مشروع التخرج **إيفنتورا** ما يتطلبه إطلاق منتج حقيقي: بنيت تكامل تطبيق Flutter مع Supabase — القنوات اللحظية، وأمان مستوى الصفوف، والمشغّلات والمهام المجدولة في قاعدة البيانات، والسياج الجغرافي عبر GPS، ونظام إشعارات ذكي — ونسّقته مع لوحة تحكم الويب التي بناها زملائي.

وفي مجال الذكاء الاصطناعي، بنيت مسارات تعلّم آلة على أكثر من 16,000 سجل، ووصلت إلى دقة 99% في تصنيف صور أورام الدماغ باستخدام التعلّم بالنقل، وشاركت في برامج بحثية في مركز جامعة قطر للعلماء الشباب.

أهتم بالتصميم ثنائي اللغة وسهل الوصول (العربية والإنجليزية مع دعم كامل للاتجاه من اليمين لليسار)، وبالتواصل الواضح، وببناء ما يخدم المجتمع — مثل **تفهيم**، منصة التدبّر القرآني التي أقود تطويرها.

أعمل حالياً على بناء المنصة الإلكترونية والألعاب التعليمية التفاعلية لـ**مركز شذرات للتدريب التربوي**، وأتدرّب في قسم تقنية المعلومات بأكاديمية الأرقم للبنات.`,
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
    { emoji: '🎮', text: { en: 'I design interactive story games that teach children skills like managing anger.', ar: 'أصمّم ألعاباً قصصية تفاعلية تعلّم الأطفال مهارات مثل إدارة الغضب.' } },
    { emoji: '🇹🇷', text: { en: 'Arabic is my native language, I work in English, and I’m learning Turkish (A1, TÖMER).', ar: 'العربية لغتي الأم، وأعمل بالإنجليزية، وأتعلّم التركية (المستوى A1، تومر).' } },
  ],
  stats: [
    { value: 15, suffix: '+', label: { en: 'Projects shipped', ar: 'مشروعاً منجزاً' } },
    { value: 500, suffix: '', label: { en: 'Concurrent users tested on Eventura', ar: 'مستخدم متزامن في اختبار إيفنتورا' } },
    { value: 99, suffix: '%', label: { en: 'Brain-tumor classification accuracy', ar: 'دقة تصنيف أورام الدماغ' } },
    { value: 3, suffix: '', label: { en: 'Research internships', ar: 'تدريبات بحثية' } },
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
- Custom SMTP for transactional email and shared API contracts with the web team

## Smart notifications
Six types of in-app notification, delivered in real time over Supabase channels with a sound alert and a badge on the bell icon:

- **Event starting:** an event you joined is about to begin; tap to open it
- **Nearby event:** you walked into an event’s geofence, so you discover events you didn’t know about
- **Waitlist open:** a spot opened on a full event you RSVPed to
- **Still here?:** after 5 hours without activity, choose “Still here” (resets the timer) or “Check me out”
- **Auto-checkout:** confirms you were checked out after leaving the geofence or not answering the prompt
- **General:** welcomes, system messages and updates

Each one opens its event, can be marked as read individually, or cleared with “Mark all read”.`,
      ar: `عملت على تطبيق الجوال المبني بـ Flutter مع زميلتي ريم، مع التركيز على جانب الخلفية والتكامل:

- Supabase بعمق: تصميم المخطط، وأمان مستوى الصفوف، والقنوات اللحظية التي تنقل تغييرات قاعدة البيانات مباشرة إلى الواجهة
- دوال ومشغّلات ومهام مجدولة لقوائم الانتظار وتحديث حالة الفعاليات والخروج التلقائي
- مسح رموز QR بالكاميرا وتوليدها، وGPS والسياج الجغرافي
- نظام إشعارات ذكي يستجيب لدخول النطاقات الجغرافية ومؤقتات الخمول وأدوار المستخدمين
- دعم كامل للعربية والإنجليزية مع الاتجاه من اليمين لليسار، ووضعان فاتح وداكن
- بريد SMTP مخصص وعقود واجهات برمجية مشتركة مع فريق الويب

## الإشعارات الذكية
ستة أنواع من الإشعارات داخل التطبيق، تصل لحظياً عبر قنوات Supabase مع تنبيه صوتي وشارة على أيقونة الجرس:

- **بدء الفعالية:** فعالية سجّلت فيها على وشك البدء؛ اضغط لفتحها
- **فعالية قريبة:** دخلت النطاق الجغرافي لفعالية، فتكتشف فعاليات لم تكن تعرفها
- **مقعد متاح:** توفّر مكان في فعالية ممتلئة كنت على قائمة انتظارها
- **هل ما زلت هنا؟:** بعد 5 ساعات دون نشاط، اختر «ما زلت هنا» (يعيد ضبط المؤقت) أو «سجّل خروجي»
- **خروج تلقائي:** تأكيد تسجيل خروجك بعد مغادرة النطاق أو عدم الرد على التنبيه
- **عام:** رسائل الترحيب والنظام والتحديثات

يفتح كل إشعار فعاليته، ويمكن تعليمه كمقروء منفرداً أو مسح الجميع بخيار «تعليم الكل كمقروء».`,
    },
    results: {
      en: `- QR scans respond within **3 seconds**
- Supports **500 concurrent users** without noticeable degradation
- New users completed registration and check-in within minutes, without training
- **85%+** positive rating in user testing
- Live heatmaps, hour-by-hour engagement charts, competition judging and one-click PDF reports for organizers`,
      ar: `- استجابة مسح QR خلال **3 ثوانٍ**
- دعم **500 مستخدم متزامن** دون تراجع ملحوظ في الأداء
- أتمّ المستخدمون الجدد التسجيل وتسجيل الحضور خلال دقائق دون تدريب مسبق
- تقييم إيجابي تجاوز **85%** في اختبارات المستخدمين
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
      en: 'A web platform for deeper reflection (tadabbur) on the Qur’an: a word-by-word linguistic study tool, a private/public reflection journal and moderated community features. I own the architecture and backend.',
      ar: 'منصة ويب للتدبّر العميق في القرآن الكريم: أداة لدراسة الكلمات لغوياً كلمةً كلمة، ودفتر تأملات خاص وعام، ومساحة مجتمعية تخضع للإشراف. أتولى البنية التقنية والخلفية.',
    },
    tools: ['Node.js', 'Express', 'MySQL', 'JWT', 'RBAC', 'Quran.com API', 'Cloudflare CDN', 'Hostinger'],
    is_ongoing: true,
    cover_url: '/content/tafheem/logo.webp',
    github_url: 'https://github.com/Layan-Alwattar/Tafheem',
    demo_url: 'https://tafheem.io',
    description: {
      en: `Tafheem helps people engage in deeper, more intentional reflection on the Qur’an. It is built around an intentional **“anti-social-media” philosophy**: no likes, no algorithms and no engagement metrics.

As Lead Developer, I own the technical architecture and backend for Phase 1 (MVP), lead technical decisions (stack, hosting constraints, Arabic/RTL text support), review code and hand designs over to the front-end developer.`,
      ar: `تساعد تفهيم المستخدمين على تدبّر القرآن الكريم بعمق وقصد. وقد بُنيت على **فلسفة مضادة لوسائل التواصل**: لا إعجابات ولا خوارزميات ولا مقاييس تفاعل.

بصفتي قائدة التطوير، أتولى البنية التقنية والخلفية للمرحلة الأولى (MVP)، وأقود القرارات التقنية (اختيار التقنيات وقيود الاستضافة ودعم العربية والكتابة من اليمين لليسار)، وأراجع الشيفرة وأسلّم التصاميم لمطوّر الواجهة.`,
    },
    approach: {
      en: `- Designed the system architecture and the MySQL schema
- Built the Node.js/Express REST API
- JWT authentication with role-based access control (User, Moderator, Admin)
- Integrated the Quran.com API for Qur’anic text and word-level data
- Structured the data layer for the Quranic Arabic Corpus and Lane’s Lexicon, behind the tap-a-word linguistic feature
- Deployed on Hostinger behind Cloudflare’s CDN`,
      ar: `- تصميم بنية النظام ومخطط قاعدة بيانات MySQL
- بناء واجهة REST باستخدام Node.js وExpress
- مصادقة JWT مع صلاحيات حسب الدور (مستخدم، مشرف، مدير)
- التكامل مع واجهة Quran.com لنص القرآن وبيانات الكلمات
- هيكلة طبقة البيانات لمدوّنة القرآن العربية ومعجم لين، لخدمة ميزة الضغط على الكلمة لمعرفة معناها
- النشر على Hostinger خلف شبكة Cloudflare`,
    },
  },
  {
    slug: 'shatharat',
    status: 'published',
    featured: true,
    categories: ['full-stack'],
    title: { en: 'Shatharat — Training Center Platform & Learning Games', ar: 'شذرات — منصة مركز تدريب وألعاب تعليمية' },
    label: { en: 'Software Developer & EdTech Lead · Ongoing', ar: 'مطوّرة برمجيات وقائدة التقنية التعليمية · مستمر' },
    summary: {
      en: 'The official website of Shatharat Educational Training Center (shatharat.qa), interactive story games for children, and a course-management system now in planning.',
      ar: 'الموقع الرسمي لمركز شذرات للتدريب التربوي (shatharat.qa)، وألعاب قصصية تفاعلية للأطفال، ونظام لإدارة الدورات قيد التخطيط.',
    },
    tools: ['Supabase', 'PostgreSQL', 'Cloudflare', 'JavaScript', 'HTML/CSS', 'Arabic UX', 'Game design'],
    is_ongoing: true,
    start_date: '2026-10-04',
    demo_url: 'https://shatharat.qa',
    description: {
      en: `I’m the center’s developer: I built and launched its website on a Qatari .qa domain, behind Cloudflare, with a secure Supabase cloud database. The site introduces the center and its achievements and lets interested families register safely. Visitors to the **Aqwamu Qeela exhibition** will discover the center through it.`,
      ar: `أعمل مطوّرةً للمركز: بنيت موقعه وأطلقته على نطاق قطري ‎.qa خلف Cloudflare مع قاعدة بيانات سحابية آمنة على Supabase. يعرّف الموقع بالمركز وإنجازاته ويتيح للأسر المهتمة التسجيل بأمان، وسيتعرّف زوّار **معرض أقوم قيلا** على المركز من خلاله.`,
    },
    approach: {
      en: `## Interactive games for the exhibition
For the center’s corner at the exhibition, I programmed an interactive game for each training program, shown on an interactive screen:

- **Beautiful & Modest:** teaches children appropriate, modest clothing at home and in public, in a playful, child-friendly way
- **Anger management:** an interactive story where the child is the hero and chooses the path the story takes
- …and several more games for children

## Course-management system (planned in phases)
I ran a requirements survey with the center’s team and turned it into a phased plan:

- **Phase 1:** the public website — programs, schedules, trainers, news and articles
- **Phase 2:** online registration, a database of families, students and courses, an admin dashboard, Excel exports and fee tracking
- **Phase 3:** parent and trainer accounts, attendance and achievement portfolios for every student, reminders, and later a mobile app`,
      ar: `## ألعاب تفاعلية للمعرض
لركن المركز في المعرض، برمجت لعبة تفاعلية لكل حقيبة تدريبية تُعرض على شاشة تفاعلية:

- **جميلة ومحتشمة:** تعلّم الأطفال اللباس المحتشم واللائق في المنزل والأماكن العامة بأسلوب جميل ومناسب لهم
- **إدارة الغضب:** قصة تفاعلية يكون فيها الطفل هو البطل ويختار المسار الذي تسير فيه القصة
- …وألعاب أخرى متعددة للأطفال

## نظام إدارة الدورات (على مراحل)
أجريت استبياناً لاحتياجات فريق المركز وحوّلته إلى خطة مرحلية:

- **المرحلة الأولى:** الموقع العام — البرامج والمواعيد والمدربات والأخبار والمقالات
- **المرحلة الثانية:** التسجيل الإلكتروني، وقاعدة بيانات للأهالي والطلاب والدورات، ولوحة تحكم، وتصدير إلى Excel، ومتابعة الرسوم
- **المرحلة الثالثة:** حسابات للأهالي والمدربات، وملف حضور وإنجاز لكل طالب، وتذكيرات، ثم تطبيق جوال لاحقاً`,
    },
  },
  {
    slug: 'multi-tenant-bilingual-platform',
    status: 'published',
    categories: ['full-stack'],
    title: { en: 'Multi-Tenant Bilingual Business Platform', ar: 'منصة أعمال متعددة المستأجرين ثنائية اللغة' },
    label: { en: 'System Architecture · Full-Stack', ar: 'بنية الأنظمة · تطوير متكامل' },
    summary: {
      en: 'One deployment serving many organizations, with tenant isolation enforced in PostgreSQL row-level security, role-based access, private documents, Excel/PDF pipelines and full EN/AR RTL support.',
      ar: 'نشر واحد يخدم مؤسسات متعددة، مع عزل بيانات كل مؤسسة عبر أمان مستوى الصفوف في PostgreSQL، وصلاحيات حسب الدور، ومستندات خاصة، ومعالجة ملفات Excel وPDF، ودعم كامل للعربية والإنجليزية.',
    },
    tools: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Row-Level Security', 'RBAC', 'Tailwind', 'i18n', 'Vercel'],
    description: {
      en: `A multi-tenant, bilingual (EN/AR + RTL) web platform built end to end:

- PostgreSQL row-level security for tenant isolation
- Role-based access control
- Private document storage with signed URLs
- Excel and PDF pipelines
- Per-organization configuration`,
      ar: `منصة ويب متعددة المستأجرين ثنائية اللغة (عربي/إنجليزي مع دعم الاتجاه من اليمين لليسار)، بنيتها من البداية إلى النهاية:

- عزل بيانات المؤسسات عبر أمان مستوى الصفوف في PostgreSQL
- صلاحيات حسب الدور
- تخزين خاص للمستندات بروابط موقّعة
- معالجة ملفات Excel وPDF
- إعدادات خاصة بكل مؤسسة`,
    },
    // Screenshots in /private-assets/gci — upload via Admin → Media if you want them public.
  },
  {
    slug: 'brain-tumor-classification',
    status: 'published',
    categories: ['ai-ml'],
    title: { en: 'Brain Tumor Classification', ar: 'تصنيف أورام الدماغ' },
    label: { en: 'Deep Learning · Medical Computer Vision', ar: 'التعلّم العميق · الرؤية الحاسوبية الطبية' },
    summary: {
      en: 'Benchmarked ResNet50, VGG16 and MobileNetV2 with transfer learning to classify brain MRI scans. ResNet50 reached about 99% accuracy.',
      ar: 'مقارنة ResNet50 وVGG16 وMobileNetV2 بالتعلّم بالنقل لتصنيف صور الرنين المغناطيسي للدماغ، ووصل ResNet50 إلى دقة تقارب 99%.',
    },
    tools: ['Python', 'TensorFlow', 'Keras', 'CNNs', 'ResNet50', 'VGG16', 'MobileNetV2', 'Transfer Learning'],
    description: {
      en: `An automated image-classification system that detects and classifies brain tumors in MRI scans by fine-tuning pretrained convolutional networks.`,
      ar: `نظام آلي لاكتشاف أورام الدماغ وتصنيفها في صور الرنين المغناطيسي عبر ضبط شبكات عصبية التفافية مدرّبة مسبقاً.`,
    },
    approach: {
      en: `- **Preprocessing:** image standardization, data augmentation against overfitting, label encoding and a train/test split
- **Models:** ResNet50, VGG16 and MobileNetV2 in TensorFlow/Keras
- **Evaluation:** hyperparameter tuning, classification reports, precision/recall and confusion matrices`,
      ar: `- **المعالجة المسبقة:** توحيد الصور، وزيادة البيانات للحد من فرط التخصيص، وترميز التصنيفات، وتقسيم البيانات للتدريب والاختبار
- **النماذج:** ResNet50 وVGG16 وMobileNetV2 باستخدام TensorFlow/Keras
- **التقييم:** ضبط المعاملات، وتقارير التصنيف، والدقة والاستدعاء، ومصفوفات الالتباس`,
    },
    results: {
      en: `- **≈99% accuracy** with ResNet50 on the test set`,
      ar: `- دقة تقارب **99%** باستخدام ResNet50 على بيانات الاختبار`,
    },
  },
  {
    slug: 'video-game-sales-predictor',
    status: 'published',
    categories: ['ai-ml', 'data'],
    title: { en: 'Video Game Sales Prediction', ar: 'التنبؤ بمبيعات ألعاب الفيديو' },
    label: { en: 'Machine Learning · Team project', ar: 'تعلّم الآلة · مشروع جماعي' },
    summary: {
      en: 'Predicting global sales of 16,598 games from platform, year, genre and publisher only, after catching a data-leakage trap. Compared a decision tree, a random forest and a PyTorch neural network.',
      ar: 'التنبؤ بالمبيعات العالمية لـ 16,598 لعبة اعتماداً على المنصة والسنة والنوع والناشر فقط، بعد اكتشاف فخ تسرّب البيانات، مع مقارنة شجرة قرار وغابة عشوائية وشبكة عصبية بـ PyTorch.',
    },
    tools: ['Python', 'Pandas', 'Scikit-Learn', 'PyTorch', 'GridSearchCV', 'RandomizedSearchCV', 'Matplotlib', 'Seaborn'],
    description: {
      en: `Can we predict how many copies a game will sell worldwide? We used a Kaggle dataset of 16,598 games and 11 columns: name, platform, year, genre, publisher and regional sales.`,
      ar: `هل يمكن التنبؤ بعدد النسخ التي ستبيعها لعبة حول العالم؟ استخدمنا بيانات من Kaggle تضم 16,598 لعبة و11 عموداً: الاسم والمنصة والسنة والنوع والناشر والمبيعات حسب المنطقة.`,
    },
    problem: {
      en: `The correlation heatmap showed North American, European, Japanese and other sales correlating almost perfectly (≈1.0) with the target, because **global sales are simply their sum**. Keeping them would have let the model “predict” by adding them up. We removed them (and the derived Rank column), so the real challenge became predicting sales from platform, year, genre and publisher alone.`,
      ar: `أظهرت خريطة الارتباط أن مبيعات أمريكا الشمالية وأوروبا واليابان وغيرها ترتبط ارتباطاً شبه تام (≈1.0) بالهدف، لأن **المبيعات العالمية هي مجموعها ببساطة**. لو أبقيناها لتعلّم النموذج الجمع فقط. فحذفناها (مع عمود الترتيب المشتق منها)، وصار التحدي الحقيقي هو التنبؤ من المنصة والسنة والنوع والناشر فقط.`,
    },
    approach: {
      en: `- EDA: right-skewed sales (a few blockbusters, like Wii Sports at 82M copies), small gaps in Year and Publisher, no duplicates
- 80/20 split, then median/most-frequent imputation, frequency encoding for 578 publishers, one-hot encoding for platform and genre, and scaling
- Models: decision tree, 100-tree random forest, and a PyTorch network (44 → 16 → 8 → 1, ReLU, Adam, MSE)
- Tuning: GridSearchCV, RandomizedSearchCV, dropout and weight decay, and the top 15 features`,
      ar: `- تحليل استكشافي: مبيعات ملتوية لليمين (قلة من الألعاب الضخمة مثل Wii Sports بـ 82 مليون نسخة)، وقيم ناقصة قليلة في السنة والناشر، ولا تكرارات
- تقسيم 80/20، ثم تعويض القيم الناقصة، وترميز تكراري لـ 578 ناشراً، وترميز أحادي للمنصة والنوع، وتوحيد المقاييس
- النماذج: شجرة قرار، وغابة عشوائية من 100 شجرة، وشبكة عصبية بـ PyTorch ‏(44 → 16 → 8 → 1)
- الضبط: GridSearchCV وRandomizedSearchCV والتسرب والتنظيم، واختيار أهم 15 خاصية`,
    },
    results: {
      en: `- The **tuned random forest won**, with test R² = 0.123. Tree ensembles suit tabular data that mixes numbers and categories
- Low scores are expected once the leakage is removed: the remaining features explain little, and rare blockbusters are hard to predict
- Next steps: log-transform the target, try XGBoost/LightGBM and target encoding`,
      ar: `- **فازت الغابة العشوائية بعد الضبط** بمعامل تحديد R² = 0.123 على الاختبار، فمجموعات الأشجار تناسب البيانات الجدولية المختلطة
- الدرجات المنخفضة متوقعة بعد إزالة التسرّب، فالخصائص المتبقية تفسّر القليل، والألعاب الضخمة نادرة يصعب التنبؤ بها
- الخطوات التالية: تحويل لوغاريتمي للهدف، وتجربة XGBoost وLightGBM والترميز حسب الهدف`,
    },
  },
  {
    slug: 'sadeeq-npc-datathon',
    status: 'published',
    categories: ['data'],
    title: { en: 'Sadeeq — Environmental Data for Children', ar: 'صديق — بيانات البيئة للأطفال' },
    label: { en: 'NPC Qatar Datathon 2025 · Team Oxygen', ar: 'داتاثون قطر 2025 · فريق أكسجين' },
    summary: {
      en: 'A playful platform that turns the National Planning Council’s environmental data into child-friendly charts, an interactive map of protected areas and a water-saving game.',
      ar: 'منصة مرحة تحوّل البيانات البيئية للمجلس الوطني للتخطيط إلى رسوم بيانية تناسب الأطفال، وخريطة تفاعلية للمحميات الطبيعية، ولعبة لترشيد المياه.',
    },
    tools: ['Data Analysis', 'Data Visualization', 'UI/UX', 'Gamification'],
    start_date: '2025-02-15',
    end_date: '2025-02-20',
    cover_url: '/content/sadeeq/welcome.webp',
    gallery: [
      ['/content/sadeeq/welcome.webp', 'Welcome screen', 'شاشة الترحيب'],
      ['/content/sadeeq/charts.webp', 'Child-friendly charts: endangered animals and water use', 'رسوم للأطفال: الحيوانات المهددة واستهلاك المياه'],
      ['/content/sadeeq/map.webp', 'Interactive map of protected areas', 'خريطة تفاعلية للمحميات الطبيعية'],
      ['/content/sadeeq/water-game.webp', 'Water-saving game', 'لعبة ترشيد المياه'],
    ],
    description: {
      en: `**Sadeeq** (System for Awareness Development and Environmental Education in Qatar) tells the environment’s story to children through simple visuals and games, supporting the targets of Qatar’s Third National Development Strategy.

Built with Amna Osman and Khawlah Daraan in the Environment track. Our idea was recognized as one of the most creative and unique, and our team was invited to present it to senior officials.`,
      ar: `**صديق** (نظام لتنمية الوعي والتعليم البيئي في قطر) يروي قصة البيئة للأطفال عبر رسوم بسيطة وألعاب، دعماً لأهداف استراتيجية التنمية الوطنية الثالثة.

نفّذته مع آمنة عثمان وخولة دعران في مسار البيئة. اعتُبرت فكرتنا من أكثر الأفكار إبداعاً وتميزاً، ودُعي فريقنا لعرضها أمام كبار المسؤولين.`,
    },
    approach: {
      en: `- Worked through the NPC’s annual bulletins, monthly data and environmental summaries
- Annual data powers the endangered-species charts; monthly data powers the water-consumption chart
- Natural protected areas from the annual summary drive the interactive map
- Simplified each chart to a few variables so children can read it — more like a game or a show than a lesson`,
      ar: `- دراسة النشرات السنوية والبيانات الشهرية والملخصات البيئية للمجلس الوطني للتخطيط
- البيانات السنوية تغذّي رسوم الأنواع المهددة، والشهرية تغذّي رسم استهلاك المياه
- المحميات الطبيعية من الملخص السنوي تشكّل الخريطة التفاعلية
- تبسيط كل رسم إلى متغيرات قليلة ليقرأه الطفل — أقرب إلى لعبة أو عرض منه إلى درس`,
    },
  },
  {
    slug: 'project-silence',
    status: 'published',
    categories: ['ai-ml'],
    title: { en: 'Project S.I.L.E.N.C.E.', ar: 'مشروع S.I.L.E.N.C.E.' },
    label: { en: 'AI & Algorithms Competition 2024 · INHA Publication Inc.', ar: 'مسابقة الذكاء الاصطناعي والخوارزميات 2024' },
    summary: {
      en: 'A multi-stage recovery system for a corrupted sentiment-analysis pipeline, combining GPT-2 with depth-first search, plus an analysis of bias in pretrained classifiers.',
      ar: 'نظام استعادة متعدد المراحل لمسار تحليل مشاعر تعرّض للتلف، يجمع GPT-2 مع البحث بالعمق أولاً، مع تحليل للتحيّز في المصنّفات المدرّبة مسبقاً.',
    },
    tools: ['Python', 'GPT-2', 'NLP', 'Depth-First Search', 'Sentiment Analysis'],
    description: {
      en: `- Designed a recovery system that uses GPT-2 language models with depth-first search to reconstruct corrupted sentiment data
- Identified, measured and mitigated bias in pretrained sentiment classifiers`,
      ar: `- تصميم نظام استعادة يستخدم نماذج GPT-2 مع البحث بالعمق أولاً لإعادة بناء بيانات المشاعر التالفة
- رصد التحيّز في مصنّفات المشاعر المدرّبة مسبقاً وقياسه والحد منه`,
    },
  },
  {
    slug: 'hia-passenger-survey',
    status: 'published',
    categories: ['research', 'data'],
    title: { en: 'Airport Passengers at Hamad International Airport', ar: 'المسافرون في مطار حمد الدولي' },
    label: { en: 'Research · SRIP 2024 · QTTSC', ar: 'بحث · برنامج التدريب البحثي الصيفي 2024' },
    summary: {
      en: 'Profiles, trip and parking characteristics of arriving and departing passengers, from intercept surveys analyzed in SPSS, with recommendations for airport access.',
      ar: 'خصائص المسافرين القادمين والمغادرين ورحلاتهم واستخدامهم للمواقف، من استبيانات ميدانية حُلّلت بـ SPSS، مع توصيات لتحسين الوصول إلى المطار.',
    },
    tools: ['SPSS', 'Excel', 'Descriptive statistics', 'Correlation', 'ANOVA', 'Survey design'],
    start_date: '2024-05-26',
    end_date: '2024-06-13',
    description: {
      en: `At the Qatar Transportation and Traffic Safety Center (mentor: Eng. Deepti Muley), I studied how travelers reach Hamad International Airport and where they park, using intercept surveys of arriving and departing passengers.`,
      ar: `في مركز قطر للنقل والسلامة المرورية (بإشراف م. ديبتي مولي)، درست كيف يصل المسافرون إلى مطار حمد الدولي وأين يركنون سياراتهم، من خلال استبيانات ميدانية للقادمين والمغادرين.`,
    },
    approach: {
      en: `- Reviewed literature on airport passengers’ travel and parking behavior and summarized related papers
- Learned the questionnaire design and data-collection method for both passenger groups
- Coded the dataset and analyzed it in SPSS: descriptive statistics, correlations and ANOVA
- Presented the results on a research poster`,
      ar: `- مراجعة الأدبيات حول سلوك المسافرين في التنقل والمواقف وتلخيص أبحاث ذات صلة
- فهم تصميم الاستبيان وطريقة جمع البيانات لكلا الفئتين
- ترميز البيانات وتحليلها بـ SPSS: إحصاءات وصفية وارتباطات وANOVA
- عرض النتائج في ملصق بحثي`,
    },
    results: {
      en: `- Higher-income travelers tend to use personal vehicles to reach the airport
- Average travel time to the airport: about **33 minutes**
- **75%** of trips had a single traveler
- **68%** of departing passengers were visiting their home country
- Recommendations: free remote parking with a free shuttle, progressive short-term parking fees, and dedicated taxi lanes`,
      ar: `- يميل المسافرون من ذوي الدخل الأعلى إلى استخدام سياراتهم الخاصة للوصول إلى المطار
- متوسط زمن الرحلة إلى المطار نحو **33 دقيقة**
- **75%** من الرحلات لمسافر واحد
- **68%** من المغادرين متجهون لزيارة بلدهم الأم
- التوصيات: مواقف مجانية خارج المطار مع نقل مجاني، وتعرفة تصاعدية للمواقف قصيرة المدى، ومسارات مخصصة لسيارات الأجرة`,
    },
  },
  {
    slug: 'road-accidents-qatar',
    status: 'published',
    categories: ['data'],
    title: { en: 'Traffic Accidents in Qatar, 2021–2024', ar: 'حوادث المرور في قطر 2021–2024' },
    label: { en: 'Data Cleaning & Exploratory Analysis', ar: 'تنظيف البيانات والتحليل الاستكشافي' },
    summary: {
      en: 'Cleaning and exploring about a million accident records from the Ministry of Interior: leakage-safe imputation, winsorized outliers, engineered driver age and zone-level patterns.',
      ar: 'تنظيف قرابة مليون سجل لحوادث المرور من وزارة الداخلية واستكشافها: تعويض القيم دون تسرّب، ومعالجة القيم المتطرفة، واشتقاق عمر السائق، وأنماط على مستوى المناطق.',
    },
    tools: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'Seaborn'],
    description: {
      en: `The dataset comes from Qatar’s Open Data Portal (Ministry of Interior): about 1,000,500 rows and 16 columns covering time, conditions, road type, city, zone and street, driver nationality and birth year, deaths and severity. I translated it from Arabic to English before the analysis.`,
      ar: `البيانات من بوابة البيانات المفتوحة في قطر (وزارة الداخلية): نحو 1,000,500 سجل و16 عموداً تشمل الوقت والظروف ونوع الطريق والمدينة والمنطقة والشارع وجنسية السائق وسنة ميلاده والوفيات ودرجة الخطورة، وقد ترجمتها من العربية إلى الإنجليزية قبل التحليل.`,
    },
    approach: {
      en: `- Split train/test **before** imputation to avoid leakage; dropped columns over 60% missing and filled moderate gaps with “UNKNOWN”
- Standardized text and checked for duplicates and synonym categories
- Deaths and accident counts are extremely skewed (IQR = 0), so I **winsorized at the 99th percentile** instead of deleting fatal accidents, which are real events, not errors
- Engineered driver age (and flagged underage or anomalous drivers), encoded the hour, one-hot encoded categories and scaled on the training data only`,
      ar: `- تقسيم البيانات **قبل** تعويض القيم لتجنب التسرّب، وحذف الأعمدة التي تتجاوز نسبة النقص فيها 60%، وملء النقص المتوسط بقيمة «غير معروف»
- توحيد النصوص وفحص التكرارات والفئات المترادفة
- الوفيات وعدد الحوادث شديدة الالتواء (IQR = 0)، لذلك **حددت القيم عند المئين 99** بدلاً من حذف الحوادث المميتة لأنها أحداث حقيقية وليست أخطاء
- اشتقاق عمر السائق (مع تعليم السائقين دون السن أو الشاذين)، وترميز الساعة والفئات، وتوحيد المقاييس على بيانات التدريب فقط`,
    },
    results: {
      en: `- Severity is heavily imbalanced: about **98%** of accidents are “simple”, and 99.9% have no deaths
- Driver age peaks between 25 and 44; accident times peak at rush hours
- Late-night accidents are rarer but **disproportionately severe**
- Numeric features barely correlate, so time, zone and road type carry the signal. That is why later modeling should use F1-score rather than accuracy`,
      ar: `- عدم توازن كبير في الخطورة: نحو **98%** من الحوادث «بسيطة»، و99.9% بلا وفيات
- ذروة أعمار السائقين بين 25 و44 عاماً، وذروة الحوادث في ساعات الازدحام
- حوادث آخر الليل أقل عدداً لكنها **أشد خطورة بشكل غير متناسب**
- الخصائص الرقمية ضعيفة الارتباط، والإشارة الحقيقية في الوقت والمنطقة ونوع الطريق، ولذلك يُفضَّل استخدام مقياس F1 بدلاً من الدقة عند النمذجة`,
    },
  },
  {
    slug: 'kalimati',
    status: 'published',
    categories: ['mobile'],
    title: { en: 'Kalimati — Language Learning App', ar: 'كلماتي — تطبيق لتعلّم اللغات' },
    label: { en: 'Mobile App · CMPS 312', ar: 'تطبيق جوال · CMPS 312' },
    summary: {
      en: 'An offline-first Flutter app for learning languages through curated vocabulary packages and three mini-games, built with clean architecture and Riverpod.',
      ar: 'تطبيق Flutter يعمل دون اتصال لتعلّم اللغات عبر حزم مفردات منتقاة وثلاث ألعاب مصغّرة، مبني ببنية نظيفة وRiverpod.',
    },
    tools: ['Flutter', 'Dart', 'Riverpod', 'Floor ORM', 'SQLite', 'go_router', 'Clean Architecture'],
    cover_url: '/content/kalimati/poster.webp',
    gallery: [['/content/kalimati/screens.webp', 'App screens', 'شاشات التطبيق']],
    description: {
      en: `Kalimati helps learners **learn words, play the games and remember more**. Users sign in, then browse and create learning packages organized by language, level and category, with words, definitions, example sentences, and image and video resources. Three mini-games reinforce learning:

- Flash cards
- Match the word to its definition
- Unscramble the sentence

Built by Team G5 (Layan Alwattar, Maryam Bawazir, Reem Aladbi, Sara Alyahri) for CMPS 312 at Qatar University.`,
      ar: `يساعد كلماتي المتعلمين على **تعلّم الكلمات واللعب وتذكّر المزيد**. يسجّل المستخدم دخوله ثم يتصفح حزماً تعليمية مصنّفة حسب اللغة والمستوى والفئة وينشئها، وتتضمن كلمات وتعريفات وجملاً وأمثلة وموارد صور وفيديو. وتعزّز ثلاث ألعاب مصغّرة التعلّم:

- البطاقات التعليمية
- مطابقة الكلمة بتعريفها
- ترتيب الجملة المبعثرة

نفّذه الفريق G5 (ليان الوتار، مريم باوزير، ريم العدبي، سارة اليهري) لمقرر CMPS 312 في جامعة قطر.`,
    },
    approach: {
      en: `- Feature-first clean architecture (domain, data and presentation layers)
- Offline-first local database with Floor ORM + SQLite and seeded sample data
- Riverpod state management and go_router navigation
- Full CRUD on packages, words, definitions and sentences`,
      ar: `- بنية نظيفة مقسّمة حسب الميزات (طبقات المجال والبيانات والعرض)
- قاعدة بيانات محلية تعمل دون اتصال باستخدام Floor وSQLite مع بيانات تجريبية
- إدارة الحالة بـ Riverpod والتنقل بـ go_router
- إضافة وتعديل وحذف الحزم والكلمات والتعريفات والجمل`,
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
    title: { en: 'Qatar Tour Agency (QTA) — Booking System', ar: 'وكالة قطر للسياحة — نظام حجوزات' },
    label: { en: 'Database Systems', ar: 'نظم قواعد البيانات' },
    summary: {
      en: 'A tour and reservation management application: a normalized (3NF) Oracle database for packages, bookings and guide assignments, with a Java Swing front end.',
      ar: 'تطبيق لإدارة الرحلات والحجوزات: قاعدة بيانات Oracle مطبّعة (3NF) للباقات والحجوزات وتعيين المرشدين، مع واجهة Java Swing.',
    },
    tools: ['Java', 'Java Swing', 'Oracle SQL', 'PL/SQL', 'ER Modeling', '3NF'],
    github_url: 'https://github.com/Layan-Alwattar/Qatar-Tour-Agency-QTA-',
  },
  {
    slug: 'iqvr-vehicle-registration',
    status: 'published',
    categories: ['data'],
    title: { en: 'IQVR — Vehicle Registration System', ar: 'IQVR — نظام تسجيل المركبات' },
    label: { en: 'Software Engineering', ar: 'هندسة البرمجيات' },
    summary: {
      en: 'A complete vehicle-registration application in Java and SQL: database design, system logic and a Java Swing interface.',
      ar: 'تطبيق متكامل لتسجيل المركبات بلغة Java وSQL: تصميم قاعدة البيانات ومنطق النظام وواجهة Java Swing.',
    },
    tools: ['Java', 'Java Swing', 'SQL'],
  },
];

export const skillCategories = [
  {
    key: 'languages',
    icon: 'code',
    name: { en: 'Languages & Frameworks', ar: 'اللغات وأطر العمل' },
    skills: ['Python', 'Java', 'SQL', 'PL/SQL', 'Dart', 'JavaScript', 'TypeScript', 'PHP', 'C++', 'Flutter', 'Next.js', 'React', 'Node.js / Express', 'Tailwind CSS', 'Riverpod'],
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
      ['NLP (GPT-2)', 'معالجة اللغة الطبيعية (GPT-2)'],
      'OpenCV',
      'Pandas / NumPy',
      'Matplotlib / Seaborn',
      ['Exploratory Data Analysis', 'تحليل البيانات الاستكشافي'],
      ['Feature Engineering', 'هندسة الخصائص'],
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
      'MySQL',
      'Oracle SQL',
      'SQLite',
      ['REST APIs', 'واجهات REST'],
      ['Realtime subscriptions', 'الاشتراكات اللحظية'],
      ['Row-Level Security', 'أمان مستوى الصفوف'],
      ['JWT & RBAC', 'JWT والصلاحيات حسب الدور'],
      'Prisma',
      'Cloudflare CDN',
      'Hostinger',
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
      ['Educational game design', 'تصميم الألعاب التعليمية'],
      ['Requirements analysis', 'تحليل المتطلبات'],
      ['Team coordination', 'تنسيق الفرق'],
    ],
  },
  {
    key: 'it',
    icon: 'wrench',
    name: { en: 'IT Support', ar: 'الدعم التقني' },
    skills: [
      ['Device provisioning & security', 'تجهيز الأجهزة وتأمينها'],
      ['Network configuration', 'إعداد الشبكات'],
      ['Access control & app restrictions', 'التحكم بالوصول وتقييد التطبيقات'],
      ['QR-based ticketing workflows', 'أنظمة بلاغات الأعطال عبر QR'],
      ['Technical support', 'الدعم الفني'],
    ],
  },
  {
    key: 'spoken',
    icon: 'languages',
    name: { en: 'Languages I speak', ar: 'اللغات التي أتحدثها' },
    skills: [
      ['Arabic — native', 'العربية — اللغة الأم'],
      ['English — fluent', 'الإنجليزية — بطلاقة'],
      ['Turkish — A1 (TÖMER)', 'التركية — A1 (تومر)'],
    ],
  },
];

export const certificates = [
  {
    slug: 'sap-dual-study-program-2026',
    status: 'published',
    title: { en: 'SAP Dual Study Program — Participation Diploma', ar: 'برنامج SAP للدراسة المزدوجة — دبلوم مشاركة' },
    provider: { en: 'SAP · Digital Skills Center EMEA', ar: 'SAP · مركز المهارات الرقمية' },
    image_url: '/content/certificates/sap-dual-study-program-2026.webp',
    pdf_url: '/content/certificates/sap-dual-study-program-2026.pdf',
    skills: ['SAP Cloud ERP', 'RISE with SAP', 'SAP S/4HANA Cloud', 'SAP Activate'],
    summary: {
      en: `June – July 2026. Courses:

- Exploring SAP Cloud ERP
- Introducing RISE with SAP Methodology for SAP Partners and Customers
- Implementing SAP S/4HANA Cloud Private Edition`,
      ar: `يونيو – يوليو 2026. المقررات:

- Exploring SAP Cloud ERP
- Introducing RISE with SAP Methodology for SAP Partners and Customers
- Implementing SAP S/4HANA Cloud Private Edition`,
    },
  },
  {
    slug: 'sap-exploring-cloud-erp',
    status: 'published',
    title: { en: 'Exploring SAP Cloud ERP — Course Completion', ar: 'Exploring SAP Cloud ERP — إتمام مقرر' },
    provider: { en: 'SAP Learning · Beginner level', ar: 'SAP Learning · المستوى المبتدئ' },
    issued_on: '2026-07-26',
    credential_url: 'https://badger.learning.sap.com/verify/xigil-hubuc-nuver-lepuh-dypyg',
    image_url: '/content/certificates/sap-exploring-cloud-erp.webp',
    pdf_url: '/content/certificates/sap-exploring-cloud-erp.pdf',
    skills: ['Cloud Technologies', 'SAP Clean Core', 'RISE and GROW with SAP', 'SAP Cloud Suite Portfolio'],
    summary: {
      en: 'Distinguish SAP’s cloud ERP solutions, choose a deployment option for different use cases, and know the tools for application lifecycle management, SAP Best Practices, integration and extensibility.',
      ar: 'التمييز بين حلول SAP السحابية لتخطيط موارد المؤسسات، واختيار خيار النشر المناسب لكل حالة، ومعرفة أدوات إدارة دورة حياة التطبيقات وأفضل ممارسات SAP والتكامل والتوسعة.',
    },
  },
  {
    slug: 'sap-rise-methodology',
    status: 'published',
    title: { en: 'Introducing RISE with SAP Methodology — Course Completion', ar: 'Introducing RISE with SAP Methodology — إتمام مقرر' },
    provider: { en: 'SAP Learning · Beginner level', ar: 'SAP Learning · المستوى المبتدئ' },
    issued_on: '2026-07-26',
    credential_url: 'https://badger.learning.sap.com/verify/xituc-daruc-gyhyp-kotag-pekyb',
    image_url: '/content/certificates/sap-rise-methodology.webp',
    pdf_url: '/content/certificates/sap-rise-methodology.pdf',
    skills: ['Cloud Infrastructure', 'Cloud Strategy', 'RISE and GROW with SAP'],
    summary: {
      en: `- Explain the phases of the RISE with SAP Methodology
- Apply the recommended tools with SAP Activate
- Visualize RISE with SAP outcomes through customer success stories`,
      ar: `- شرح مراحل منهجية RISE with SAP
- تطبيق الأدوات الموصى بها مع SAP Activate
- استعراض نتائج RISE with SAP من خلال قصص نجاح العملاء`,
    },
  },
  {
    slug: 'shell-intilaaqah-2026',
    status: 'published',
    title: { en: 'Shell Intilaaqah — Entrepreneurship Program', ar: 'برنامج انطلاقة من شل — ريادة الأعمال' },
    provider: { en: 'Shell Qatar × Qatar University', ar: 'شل قطر × جامعة قطر' },
    skills: ['Entrepreneurship', 'Business Thinking'],
    summary: {
      en: '“It all starts with a spark.” Completed the Shell Intilaaqah entrepreneurship program with Qatar University in 2026.',
      ar: '«ومضة تكفي لتبدأ رحلتك نحو التألق». أتممت برنامج انطلاقة لريادة الأعمال من شل بالتعاون مع جامعة قطر في 2026.',
    },
    // Ceremony photos in /private-assets/shell-intilaaqah (they show other people).
  },
  {
    slug: 'emotional-intelligence-2026',
    status: 'published',
    title: { en: 'Emotional Intelligence in the Workplace', ar: 'الذكاء العاطفي في بيئة العمل' },
    provider: { en: 'Career Development Center, Qatar University', ar: 'مركز التطوير المهني، جامعة قطر' },
    issued_on: '2026-04-29',
    image_url: '/content/certificates/emotional-intelligence-2026.webp',
    pdf_url: '/content/certificates/emotional-intelligence-2026.pdf',
    skills: ['Emotional Intelligence', 'Communication'],
    summary: {
      en: 'Workshop: How to Understand Yourself and Interact Effectively with Others, presented by corporate and youth coach Yasmin Elballouli.',
      ar: 'ورشة: كيف تفهم نفسك وتتعامل بفعالية مع الآخرين، قدّمتها مدرّبة الشركات والشباب ياسمين البلولي.',
    },
  },
  {
    slug: 'ai-digital-tools-2026',
    status: 'published',
    title: { en: 'AI and Digital Tools Workshop', ar: 'ورشة الذكاء الاصطناعي والأدوات الرقمية' },
    provider: { en: 'Career Development Center, Qatar University', ar: 'مركز التطوير المهني، جامعة قطر' },
    issued_on: '2026-04-01',
    image_url: '/content/certificates/ai-digital-tools-2026.webp',
    pdf_url: '/content/certificates/ai-digital-tools-2026.pdf',
    skills: ['AI Tools', 'Digital Productivity'],
  },
  {
    slug: 'qu-ysc-research-excellence-2024',
    status: 'published',
    title: { en: 'Research Excellence — Summer Research Internship Program 2024', ar: 'التميّز البحثي — برنامج التدريب البحثي الصيفي 2024' },
    provider: { en: 'Qatar University Young Scientists Center · Qatar Transportation and Traffic Safety Center', ar: 'مركز جامعة قطر للعلماء الشباب · مركز قطر للنقل والسلامة المرورية' },
    issued_on: '2024-06-13',
    image_url: '/content/certificates/qu-ysc-research-2024.webp',
    skills: ['Research Methodology', 'SPSS', 'Survey Analysis'],
    summary: {
      en: 'Completed the research methodology course with recognized scholarly achievement in the Outcomes-Directed Intensive Research Track (26 May – 13 June 2024), studying airport passengers at Hamad International Airport.',
      ar: 'إتمام البرنامج التدريبي في منهجية البحث بنجاح وتحقيق إنجاز علمي معترف به في مسار البحث المكثف ذي النتائج الموجّهة (26 مايو – 13 يونيو 2024)، بدراسة المسافرين في مطار حمد الدولي.',
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
    skills: ['Data Analysis', 'Data Visualization', 'Data Storytelling'],
    summary: {
      en: '“Shaping our future with data”, a national datathon held 15–20 February 2025. Our project, Sadeeq, was recognized as one of the most creative ideas.',
      ar: '«تشكيل مستقبلنا بالبيانات»، داتاثون وطني أقيم من 15 إلى 20 فبراير 2025. واعتُبر مشروعنا «صديق» من أكثر الأفكار إبداعاً.',
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
    slug: 'comicsthon-2026',
    status: 'published',
    title: { en: 'ComicsThon — Illustrated Story Marathon 2026', ar: 'كوميكس ثون — ماراثون القصص المصورة 2026' },
    provider: { en: 'Student Activities Department, Qatar University', ar: 'إدارة الأنشطة الطلابية، جامعة قطر' },
    issued_on: '2026-04-19',
    image_url: '/content/certificates/comics-marathon-2026.webp',
    skills: ['Storytelling', 'Creativity'],
    summary: {
      en: 'Recognized for distinguished participation in the first edition. Our team, “Warraqo Al-Khayal”, created *The Magic Lens*: a story about a boy whose teacher’s magic lens shows him how good choices light up the world.',
      ar: 'تقديراً للمشاركة المتميزة في النسخة الأولى. ابتكر فريقنا «ورّاقو الخيال» قصة «العدسة السحرية» عن طفل تكشف له عدسة معلّمه السحرية كيف تملأ الأفعال الطيبة العالم نوراً.',
    },
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
    slug: 'deans-list-spring-2023',
    status: 'published',
    title: { en: 'Certificate of Excellence — Dean’s List (Spring 2023)', ar: 'شهادة تميّز — قائمة العميد (ربيع 2023)' },
    provider: { en: 'College of Engineering, Qatar University', ar: 'كلية الهندسة، جامعة قطر' },
    issued_on: '2024-04-01',
    image_url: '/content/certificates/deans-list-2023.webp',
    skills: [],
  },
  {
    slug: 'shatharat-summer-program-2023',
    status: 'published',
    title: { en: 'Trainer — “Skill & Science” Summer Program 2023', ar: 'مدرّبة — البرنامج الصيفي «مهارة وعلم» 2023' },
    provider: { en: 'Shatharat Educational Training Center (licensed by the Ministry of Education)', ar: 'مركز شذرات للتدريب التربوي (بترخيص وزارة التربية والتعليم)' },
    issued_on: '2023-08-01',
    skills: ['Teaching', 'Workshop Facilitation'],
    summary: {
      en: 'Certificate of attendance and participation for delivering 39 training hours of workshops for children, 2–30 July 2023.',
      ar: 'شهادة حضور ومشاركة لتقديم ورش ومهارات تربوية للأطفال بواقع 39 ساعة تدريبية، من 2 إلى 30 يوليو 2023.',
    },
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
    key: 'shatharat-developer',
    kind: 'experience',
    icon: 'code',
    title: { en: 'Software Developer & EdTech Lead', ar: 'مطوّرة برمجيات وقائدة التقنية التعليمية' },
    organization: { en: 'Shatharat Educational Training Center', ar: 'مركز شذرات للتدريب التربوي' },
    location: { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
    start_date: '2026-10-04',
    is_current: true,
    description: {
      en: 'Built and launched shatharat.qa (Supabase + Cloudflare), programmed interactive learning games for the Aqwamu Qeela exhibition, and am planning the center’s course-management system.',
      ar: 'بنيت موقع shatharat.qa وأطلقته (Supabase وCloudflare)، وبرمجت ألعاباً تعليمية تفاعلية لمعرض أقوم قيلا، وأخطط لنظام إدارة الدورات في المركز.',
    },
    link_url: '/projects/shatharat',
  },
  {
    key: 'al-arqam-it',
    kind: 'experience',
    icon: 'monitor-smartphone',
    title: { en: 'IT Department Intern', ar: 'متدرّبة في قسم تقنية المعلومات' },
    organization: { en: 'Al Arqam Primary Academy for Girls', ar: 'أكاديمية الأرقم الابتدائية للبنات' },
    location: { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
    start_date: '2026-10-12',
    is_current: true,
    description: {
      en: 'Internship running until 17 December 2026 with the IT section of the administration department.',
      ar: 'تدريب يمتد حتى 17 ديسمبر 2026 مع قسم تقنية المعلومات في الإدارة.',
    },
    highlights: [
      { en: 'Reset and configured student tablets for performance, security and privacy', ar: 'إعادة ضبط الأجهزة اللوحية للطالبات وإعدادها لأداء أفضل وأمان وخصوصية أعلى' },
      { en: 'Connected devices to dedicated student networks with safe search and no unauthorized app installs', ar: 'ربط الأجهزة بشبكات مخصصة للطالبات مع بحث آمن ومنع تنزيل التطبيقات غير المصرّح بها' },
      { en: 'Built a QR-code fault-reporting system: teachers scan, enter the device and trolley number and the problem, so faults are classified precisely', ar: 'بناء نظام بلاغات أعطال عبر QR: تمسح المعلمة الرمز وتُدخل رقم الجهاز والعربة والمشكلة، فتُصنَّف الأعطال بدقة' },
      { en: 'Installed the apps teachers requested on the new tablets', ar: 'تثبيت التطبيقات التي طلبتها المعلمات على الأجهزة الجديدة' },
    ],
  },
  {
    key: 'sap-dsp',
    kind: 'education',
    icon: 'cloud',
    title: { en: 'SAP Dual Study Program', ar: 'برنامج SAP للدراسة المزدوجة' },
    organization: { en: 'SAP · Digital Skills Center EMEA', ar: 'SAP · مركز المهارات الرقمية' },
    start_date: '2026-06-01',
    end_date: '2026-07-31',
    description: {
      en: 'SAP Cloud ERP, the RISE with SAP methodology and implementing SAP S/4HANA Cloud Private Edition.',
      ar: 'حلول SAP السحابية، ومنهجية RISE with SAP، وتطبيق SAP S/4HANA Cloud Private Edition.',
    },
    link_url: '/certificates/sap-dual-study-program-2026',
  },
  {
    key: 'qu-bsc',
    kind: 'education',
    icon: 'graduation-cap',
    title: { en: 'B.Sc. in Computer Science', ar: 'بكالوريوس علوم الحاسب' },
    organization: { en: 'Qatar University', ar: 'جامعة قطر' },
    location: { en: 'Doha, Qatar', ar: 'الدوحة، قطر' },
    start_date: '2022-09-01',
    end_date: '2026-06-01',
    date_label: { en: '2022 – 2026', ar: '2022 – 2026' },
    description: { en: 'GPA 3.34 · Honors student · Dean’s List, College of Engineering.', ar: 'المعدل 3.34 · طالبة في برنامج التميّز · قائمة العميد، كلية الهندسة.' },
    highlights: [
      { en: 'Senior capstone: Eventura (smart event management)', ar: 'مشروع التخرج: إيفنتورا (إدارة الفعاليات الذكية)' },
      { en: 'Coursework: data structures & algorithms, databases, software engineering, web & mobile, cybersecurity, data science, machine and deep learning', ar: 'المقررات: هياكل البيانات والخوارزميات، وقواعد البيانات، وهندسة البرمجيات، والويب والجوال، والأمن السيبراني، وعلم البيانات، وتعلّم الآلة والتعلّم العميق' },
    ],
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
      en: 'Track 1: co-authored “AI Simulation Tools in Higher Education: Student Perspectives” — questionnaire design, SPSS analysis and focus groups.',
      ar: 'المسار الأول: شاركت في تأليف بحث «أدوات المحاكاة بالذكاء الاصطناعي في التعليم العالي: وجهات نظر الطلاب» — تصميم الاستبيان والتحليل بـ SPSS ومجموعات النقاش.',
    },
    link_url: '/analyses/ai-simulation-tools-higher-education',
  },
  {
    key: 'shell-intilaaqah',
    kind: 'achievement',
    icon: 'sparkles',
    title: { en: 'Shell Intilaaqah Entrepreneurship Program', ar: 'برنامج انطلاقة لريادة الأعمال' },
    organization: { en: 'Shell Qatar × Qatar University', ar: 'شل قطر × جامعة قطر' },
    date_label: { en: '2026', ar: '2026' },
    end_date: '2026-05-01',
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
    key: 'ai-week-2025',
    kind: 'experience',
    icon: 'sparkles',
    title: { en: 'Organizer — AI Week 2025', ar: 'منظِّمة — أسبوع الذكاء الاصطناعي 2025' },
    organization: { en: 'Artificial Intelligence Association, Qatar University', ar: 'رابطة الذكاء الاصطناعي، جامعة قطر' },
    start_date: '2025-10-27',
    end_date: '2025-10-30',
    description: {
      en: 'Logistics and day-of-event planning, plus a QR-code attendance and booth-tracking system for the exhibitors.',
      ar: 'التخطيط اللوجستي وتجهيزات يوم الفعالية، ونظام حضور وتتبع للأجنحة عبر رموز QR للعارضين.',
    },
  },
  {
    key: 'tafheem-lead',
    kind: 'experience',
    icon: 'code',
    title: { en: 'Lead Developer — Tafheem', ar: 'قائدة التطوير — تفهيم' },
    organization: { en: 'Qur’anic reflection platform', ar: 'منصة التدبّر القرآني' },
    is_current: true,
    description: {
      en: 'Owning the architecture, the Node.js/Express API and the MySQL data layer; reviewing code and planning sprints.',
      ar: 'أتولى البنية التقنية وواجهة Node.js/Express وطبقة بيانات MySQL، وأراجع الشيفرة وأخطط لدورات التطوير.',
    },
    link_url: '/projects/tafheem',
  },
  {
    key: 'npc-datathon',
    kind: 'achievement',
    icon: 'trophy',
    title: { en: 'NPC Qatar Datathon 2025', ar: 'داتاثون قطر 2025' },
    organization: { en: 'National Planning Council × Microsoft', ar: 'المجلس الوطني للتخطيط × مايكروسوفت' },
    start_date: '2025-02-15',
    end_date: '2025-02-20',
    description: {
      en: 'Our project Sadeeq was recognized as one of the most creative and unique ideas; the team was invited to present it to senior officials.',
      ar: 'اعتُبر مشروعنا «صديق» من أكثر الأفكار إبداعاً وتميزاً، ودُعي الفريق لعرضه أمام كبار المسؤولين.',
    },
    link_url: '/projects/sadeeq-npc-datathon',
  },
  {
    key: 'red-crescent',
    kind: 'experience',
    icon: 'heart-handshake',
    title: { en: 'Volunteer — Childhood Support Program', ar: 'متطوعة — برنامج دعم الطفولة' },
    organization: { en: 'Qatar Red Crescent', ar: 'الهلال الأحمر القطري' },
    start_date: '2023-07-01',
    end_date: '2024-12-31',
  },
  {
    key: 'srip-2024',
    kind: 'experience',
    icon: 'plane',
    title: { en: 'Research Intern — Airport Passenger Study (SRIP 2024)', ar: 'متدرّبة بحثية — دراسة المسافرين في المطار (2024)' },
    organization: { en: 'Qatar Transportation and Traffic Safety Center · QU Young Scientists Center', ar: 'مركز قطر للنقل والسلامة المرورية · مركز جامعة قطر للعلماء الشباب' },
    start_date: '2024-05-26',
    end_date: '2024-06-13',
    description: {
      en: 'Analyzed intercept surveys of passengers at Hamad International Airport in SPSS. Awarded the Research Excellence certificate.',
      ar: 'حلّلت استبيانات ميدانية للمسافرين في مطار حمد الدولي باستخدام SPSS، ونلت شهادة التميّز البحثي.',
    },
    link_url: '/projects/hia-passenger-survey',
  },
  {
    key: 'aiqu-events',
    kind: 'experience',
    icon: 'users',
    title: { en: 'Management Member — Events Department', ar: 'عضوة إدارية — قسم الفعاليات' },
    organization: { en: 'Artificial Intelligence Association, Qatar University', ar: 'رابطة الذكاء الاصطناعي، جامعة قطر' },
    start_date: '2023-09-01',
    is_current: true,
    date_label: { en: '2023 – present', ar: '2023 – الآن' },
    description: {
      en: 'Planning, logistics and execution of AI events and workshops for members.',
      ar: 'التخطيط والتنظيم اللوجستي وتنفيذ فعاليات الذكاء الاصطناعي وورش الأعضاء.',
    },
  },
  {
    key: 'shatharat-trainer-2023',
    kind: 'experience',
    icon: 'presentation',
    title: { en: 'Trainer — “Skill & Science” Summer Program', ar: 'مدرّبة — البرنامج الصيفي «مهارة وعلم»' },
    organization: { en: 'Shatharat Educational Training Center', ar: 'مركز شذرات للتدريب التربوي' },
    start_date: '2023-07-02',
    end_date: '2023-07-30',
    description: { en: 'Delivered 39 training hours of educational workshops for children.', ar: 'قدّمت 39 ساعة تدريبية من الورش التربوية للأطفال.' },
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
  {
    key: 'high-school',
    kind: 'education',
    icon: 'school',
    title: { en: 'High School Diploma', ar: 'شهادة الثانوية العامة' },
    organization: { en: 'Zubaida Secondary School for Girls', ar: 'مدرسة زبيدة الثانوية للبنات' },
    location: { en: 'Qatar', ar: 'قطر' },
    end_date: '2022-06-01',
    date_label: { en: '2022', ar: '2022' },
  },
];

/** Timeline keys an earlier seed added that are no longer used. */
export const removedTimelineKeys = ['hia-research'];

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
