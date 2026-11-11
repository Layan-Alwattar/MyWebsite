import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Dashboard' };

// Tables counted on the dashboard. Doubles as a phase (a) health check:
// if a count fails, that migration hasn't been applied.
const TABLES = [
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['certificates', 'Certificates'],
  ['posts', 'Reflections'],
  ['timeline_items', 'Timeline items'],
  ['analyses', 'Analyses'],
  ['themes', 'Themes'],
  ['sections', 'Sections'],
  ['contact_messages', 'Messages'],
] as const;

export default async function DashboardPage() {
  const supabase = await createClient();

  const counts = await Promise.all(
    TABLES.map(async ([table, label]) => {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      return { label, count, error: error?.message };
    }),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {counts.map(({ label, count, error }) => (
          <li key={label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-[#6E5A70]">{label}</p>
            {error ? (
              <p className="mt-1 text-sm text-rose-700">⚠ {error}</p>
            ) : (
              <p className="mt-1 text-3xl font-semibold">{count ?? 0}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
