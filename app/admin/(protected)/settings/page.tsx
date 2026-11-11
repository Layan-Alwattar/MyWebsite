import { EntityForm } from '@/components/admin/entity-form';
import { defaultValues } from '@/lib/admin/defaults';
import { SETTINGS_FIELDS } from '@/lib/admin/entities';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Hero & About' };

/** Site-wide text: Hero, About, Contact and SEO (single row). */
export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();

  const values: Record<string, unknown> = { ...defaultValues(SETTINGS_FIELDS) };
  for (const [k, v] of Object.entries(data ?? {})) if (v !== null) values[k] = v;

  return <EntityForm mode={{ kind: 'settings' }} initialValues={values} title="Hero, About & SEO" />;
}
