import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EntityList } from '@/components/admin/entity-list';
import { PageHeader } from '@/components/admin/page-header';
import { getEntity } from '@/lib/admin/entities';
import { loadListRows } from '@/lib/admin/load';

type Props = { params: Promise<{ entity: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entity = getEntity((await params).entity);
  return { title: entity?.label ?? 'Not found' };
}

/** List screen for any content type, e.g. /admin/projects */
export default async function EntityListPage({ params }: Props) {
  const entity = getEntity((await params).entity);
  if (!entity) notFound();

  const { rows, error } = await loadListRows(entity);

  return (
    <div className="space-y-6">
      <PageHeader title={entity.label} description={entity.description} />
      {error && (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">
          Couldn&apos;t load: {error}
        </p>
      )}
      <EntityList
        // Remount when the server sends fresh rows (after router.refresh()).
        key={rows.map((r) => r.id + r.status).join()}
        entityKey={entity.key}
        singular={entity.singular}
        rows={rows}
        sortable={entity.sortable}
        hasStatus={entity.hasStatus}
      />
    </div>
  );
}
