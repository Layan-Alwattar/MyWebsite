import { notFound } from 'next/navigation';
import { About } from '@/components/site/sections/about';
import { Analyses, Certificates, Projects, Reflections } from '@/components/site/sections/collections';
import { CvQr, cvUrl } from '@/components/site/cv-qr';
import { ContactForm } from '@/components/site/sections/contact';
import { Hero } from '@/components/site/sections/hero';
import { Skills } from '@/components/site/sections/skills';
import { Timeline } from '@/components/site/sections/timeline';
import { Reveal } from '@/components/site/motion';
import { Blobs, Section, SectionHeading, SocialLinks } from '@/components/site/ui';
import { isLocale, tr } from '@/lib/i18n';
import {
  getAnalyses,
  getCategories,
  getCertificates,
  getPosts,
  getProjects,
  getSections,
  getSettings,
  getSkills,
  getSocialLinks,
  getTimeline,
} from '@/lib/site/data';
import { getDictionary } from '@/lib/site/dictionary';

// Rebuilt on demand when content changes in the admin; hourly as a fallback.
export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const [settings, sections, socials, projects, categories, skills, certificates, posts, timeline, analyses] = await Promise.all([
    getSettings(),
    getSections(),
    getSocialLinks(),
    getProjects(),
    getCategories(),
    getSkills(),
    getCertificates(),
    getPosts(),
    getTimeline(),
    getAnalyses(),
  ]);

  if (!settings) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-display text-3xl">Site is being set up ✿</h1>
        <p className="mt-3 text-fg-muted">Content will appear here once the database is connected.</p>
      </div>
    );
  }

  const visible = sections.filter((s) => s.visible);
  const hasContact = visible.some((s) => s.key === 'contact');

  const render = (key: string, label: string) => {
    switch (key) {
      case 'hero':
        return <Hero key={key} settings={settings} socials={socials} locale={locale} dict={dict} hasContact={hasContact} />;
      case 'about':
        return <About key={key} settings={settings} label={label} locale={locale} dict={dict} />;
      case 'skills':
        return <Skills key={key} categories={skills} label={label} locale={locale} />;
      case 'projects':
        return <Projects key={key} projects={projects} categories={categories} label={label} locale={locale} dict={dict} limit={9} />;
      case 'analyses':
        return <Analyses key={key} analyses={analyses} label={label} locale={locale} dict={dict} />;
      case 'certificates':
        return <Certificates key={key} certificates={certificates} label={label} locale={locale} />;
      case 'reflections':
        return <Reflections key={key} posts={posts} label={label} locale={locale} dict={dict} />;
      case 'timeline':
        return <Timeline key={key} items={timeline} label={label} locale={locale} dict={dict} />;
      case 'contact':
        return (
          <Section key={key} id="contact" className="overflow-hidden">
            <Blobs className="opacity-60" />
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <SectionHeading
                  id="contact"
                  eyebrow={label}
                  title={locale === 'ar' ? 'لنبنِ شيئاً جميلاً معاً' : 'Let’s build something lovely'}
                  intro={tr(settings.contact_intro, locale)}
                />
                <SocialLinks links={socials} locale={locale} />
                {cvUrl(settings, locale) && <CvQr locale={locale} dict={dict} />}
              </div>
              <Reveal className="relative rounded-theme bg-[color-mix(in_srgb,var(--c-surface)_75%,transparent)] p-6 shadow-sm backdrop-blur md:p-8">
                <ContactForm locale={locale} dict={dict} email={settings.contact_email} />
              </Reveal>
            </div>
          </Section>
        );
      default:
        return null;
    }
  };

  return <>{visible.map((s) => render(s.key, tr(s.label, locale)))}</>;
}
