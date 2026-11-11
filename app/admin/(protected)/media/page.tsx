import { MediaLibrary } from '@/components/admin/media-library';
import { PageHeader } from '@/components/admin/page-header';

export const metadata = { title: 'Media' };

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Media" description="Upload, preview and manage images, videos, PDFs and data files." />
      <MediaLibrary />
    </div>
  );
}
