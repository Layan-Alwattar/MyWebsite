import { PageHeader } from '@/components/admin/page-header';
import { createClient } from '@/lib/supabase/server';
import type { SectionRow } from './actions';
import { SectionsManager } from './sections-manager';

export const metadata = { title: 'Homepage sections' };

export default async function SectionsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('sections').select('key, label, visible').order('position');

  return (
    <div className="space-y-6">
      <PageHeader title="Homepage sections" description="Drag to reorder, switch off to hide, and rename the menu labels." />
      {error ? (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error.message}</p>
      ) : (
        <SectionsManager initial={(data ?? []) as SectionRow[]} />
      )}
    </div>
  );
}
