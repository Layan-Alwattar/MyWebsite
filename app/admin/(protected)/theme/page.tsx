import { PageHeader } from '@/components/admin/page-header';
import { createClient } from '@/lib/supabase/server';
import type { Theme } from '@/lib/theme/types';
import { ThemeEditor } from './theme-editor';

export const metadata = { title: 'Theme' };

export default async function ThemePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('themes')
    .select('id, name, is_preset, is_active, colors, fonts, radius, motion_level, cursor_glow')
    .order('is_preset', { ascending: false })
    .order('created_at');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Theme"
        description="Colors, fonts, roundness and animation for the public site. Changes go live when you save the active theme."
      />
      {error ? (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error.message}</p>
      ) : (
        <ThemeEditor themes={(data ?? []) as Theme[]} />
      )}
    </div>
  );
}
