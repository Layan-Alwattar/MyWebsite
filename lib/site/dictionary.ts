/**
 * Interface text for the public site (content itself comes from the database).
 */
import type { Locale } from '@/lib/i18n';

const en = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  closeMenu: 'Close menu',
  switchLanguage: 'العربية',
  switchLanguageLabel: 'Switch to Arabic',
  themeLight: 'Switch to light mode',
  themeDark: 'Switch to dark mode',
  contactMe: 'Contact me',
  downloadCv: 'Download CV',
  cvQrTitle: 'Scan for my CV',
  cvQrHint: 'Point your phone camera here to open my CV.',
  cvQrAlt: 'QR code linking to Layan’s CV',
  viewProjects: 'See my work',
  all: 'All',
  featured: 'Featured',
  viewProject: 'View project',
  viewAllProjects: 'All projects',
  noProjects: 'No projects in this category yet.',
  present: 'Present',
  ongoing: 'Ongoing',
  inProgress: 'In progress',
  now: 'Now',
  showMore: 'Show {n} more',
  showLess: 'Show less',
  overview: 'Overview',
  problem: 'The problem',
  approach: 'My approach',
  results: 'Results',
  learnings: 'What I learned',
  toolsUsed: 'Tools & technologies',
  gallery: 'Gallery',
  video: 'Video',
  prototype: 'Interactive prototype',
  dataAnalysis: 'Data & analysis',
  links: 'Links',
  github: 'Source code',
  liveDemo: 'Live demo',
  report: 'Paper / report',
  backToProjects: 'Back to projects',
  nextProject: 'Next project',
  previousProject: 'Previous project',
  readAnalysis: 'Read analysis',
  certificate: 'Certificate',
  issued: 'Issued',
  verify: 'Verify credential',
  viewPdf: 'View PDF',
  courseSummary: 'Course summary',
  whatILearned: 'What I learned',
  whatIGained: 'What I gained',
  skillsCovered: 'Skills',
  readMore: 'Read more',
  allReflections: 'All reflections',
  minRead: 'min read',
  education: 'Education',
  achievement: 'Achievement',
  experience: 'Experience',
  funFacts: 'Fun facts',
  interests: 'Things I love',
  contactName: 'Your name',
  contactEmail: 'Email',
  contactSubject: 'Subject (optional)',
  contactMessage: 'Message',
  send: 'Send message',
  sending: 'Sending…',
  sent: 'Thank you! Your message has been sent ✿',
  sendError: 'Something went wrong. Please try again or email me directly.',
  rateLimited: 'You’ve sent a few messages already — please try again in a few minutes.',
  previewMode: 'Preview mode — drafts are visible.',
  exitPreview: 'Exit preview',
  notFoundTitle: 'Page not found',
  notFoundText: 'The page you’re looking for doesn’t exist or has moved.',
  goHome: 'Back home',
  builtWith: 'Designed & built with love',
  close: 'Close',
  previous: 'Previous',
  next: 'Next',
  openImage: 'Open image',
} as const;

export type Dictionary = { [K in keyof typeof en]: string };

const ar: Dictionary = {
  skipToContent: 'تخطَّ إلى المحتوى',
  menu: 'القائمة',
  closeMenu: 'إغلاق القائمة',
  switchLanguage: 'English',
  switchLanguageLabel: 'التبديل إلى الإنجليزية',
  themeLight: 'الوضع الفاتح',
  themeDark: 'الوضع الداكن',
  contactMe: 'تواصل معي',
  downloadCv: 'تحميل السيرة الذاتية',
  cvQrTitle: 'امسح لسيرتي الذاتية',
  cvQrHint: 'وجّه كاميرا هاتفك إلى الرمز لفتح سيرتي الذاتية.',
  cvQrAlt: 'رمز QR يفتح السيرة الذاتية لليان',
  viewProjects: 'استعرض أعمالي',
  all: 'الكل',
  featured: 'مميز',
  viewProject: 'عرض المشروع',
  viewAllProjects: 'كل المشاريع',
  noProjects: 'لا توجد مشاريع في هذا التصنيف بعد.',
  present: 'حتى الآن',
  ongoing: 'مستمر',
  inProgress: 'قيد التنفيذ',
  now: 'حالياً',
  showMore: 'عرض {n} أخرى',
  showLess: 'عرض أقل',
  overview: 'نظرة عامة',
  problem: 'المشكلة',
  approach: 'منهجيتي',
  results: 'النتائج',
  learnings: 'ماذا تعلّمت',
  toolsUsed: 'الأدوات والتقنيات',
  gallery: 'معرض الصور',
  video: 'فيديو',
  prototype: 'نموذج تفاعلي',
  dataAnalysis: 'البيانات والتحليل',
  links: 'روابط',
  github: 'الشيفرة المصدرية',
  liveDemo: 'تجربة مباشرة',
  report: 'الورقة / التقرير',
  backToProjects: 'العودة إلى المشاريع',
  nextProject: 'المشروع التالي',
  previousProject: 'المشروع السابق',
  readAnalysis: 'اقرأ التحليل',
  certificate: 'شهادة',
  issued: 'تاريخ الإصدار',
  verify: 'التحقق من الشهادة',
  viewPdf: 'عرض PDF',
  courseSummary: 'ملخص الدورة',
  whatILearned: 'ماذا تعلّمت',
  whatIGained: 'ماذا اكتسبت',
  skillsCovered: 'المهارات',
  readMore: 'اقرأ المزيد',
  allReflections: 'كل التأملات',
  minRead: 'دقائق قراءة',
  education: 'تعليم',
  achievement: 'إنجاز',
  experience: 'خبرة',
  funFacts: 'حقائق ممتعة',
  interests: 'أشياء أحبها',
  contactName: 'الاسم',
  contactEmail: 'البريد الإلكتروني',
  contactSubject: 'الموضوع (اختياري)',
  contactMessage: 'الرسالة',
  send: 'إرسال',
  sending: 'جارٍ الإرسال…',
  sent: 'شكراً لك! وصلت رسالتك ✿',
  sendError: 'حدث خطأ. حاول مرة أخرى أو راسلني مباشرة عبر البريد.',
  rateLimited: 'أرسلت عدة رسائل للتو — حاول مجدداً بعد بضع دقائق.',
  previewMode: 'وضع المعاينة — المسودات ظاهرة.',
  exitPreview: 'الخروج من المعاينة',
  notFoundTitle: 'الصفحة غير موجودة',
  notFoundText: 'الصفحة التي تبحث عنها غير موجودة أو نُقلت.',
  goHome: 'العودة للرئيسية',
  builtWith: 'صُمّم وبُني بحب',
  close: 'إغلاق',
  previous: 'السابق',
  next: 'التالي',
  openImage: 'فتح الصورة',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** Localized month + year, e.g. "Sep 2025" / "سبتمبر 2025". */
export function formatMonth(date: string | null | undefined, locale: Locale) {
  if (!date) return '';
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-QA' : 'en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${date.slice(0, 10)}T00:00:00Z`),
  );
}

export function formatDate(date: string | null | undefined, locale: Locale) {
  if (!date) return '';
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-QA' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(date),
  );
}

/** "Sep 2025 – May 2026", "2024 – Present", or a custom label. */
export function formatRange(
  { start, end, current, label }: { start?: string | null; end?: string | null; current?: boolean; label?: string },
  locale: Locale,
) {
  if (label) return label;
  const d = getDictionary(locale);
  const a = formatMonth(start, locale);
  const b = current ? d.present : formatMonth(end, locale);
  return a && b ? `${a} – ${b}` : a || b;
}
