import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EntityForm } from '@/components/admin/entity-form';
import { getEntity } from '@/lib/admin/entities';
import { loadFieldOptions, loadFormValues } from '@/lib/admin/load';
import { tr } from '@/lib/i18n';

type Props = { params: Promise<{ entity: string; id: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { entity: key, id } = await params;
  const entity = getEntity(key);
  return { title: entity ? (id === 'new' ? `New ${entity.singular}` : `Edit ${entity.singular}`) : 'Not found' };
}

/** Create (/admin/projects/new) or edit (/admin/projects/<uuid>) screen. */
export default async function EntityEditPage({ params }: Props) {
  const { entity: key, id: rawId } = await params;
  const entity = getEntity(key);
  if (!entity) notFound();

  const id = rawId === 'new' ? null : rawId;
  if (id && !UUID_RE.test(id)) notFound();

  const [values, options] = await Promise.all([loadFormValues(entity, id), loadFieldOptions(entity.fields)]);
  if (!values) notFound();

  const title = id ? tr(values[entity.titleColumn], 'en') || `Untitled ${entity.singular}` : `New ${entity.singular}`;

  return (
    <EntityForm
      key={id ?? 'new'}
      mode={{ kind: 'entity', key: entity.key, id }}
      initialValues={values}
      options={options}
      title={title}
    />
  );
}
