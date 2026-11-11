/**
 * Browser-side helpers for the media library (Supabase Storage bucket "media"
 * + the `media` index table). Only the admin can call these successfully —
 * Storage and table policies reject everyone else.
 */
import { createClient } from '@/lib/supabase/client';
import type { MediaAccept } from '@/lib/admin/fields';

export const MEDIA_BUCKET = 'media';
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // matches the bucket limit

export type MediaKind = 'image' | 'video' | 'pdf' | 'data' | 'other';

export type MediaRow = {
  id: string;
  bucket: string;
  path: string;
  url: string;
  kind: MediaKind;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt: { en: string; ar: string };
  created_at: string;
};

/** <input accept> value for each picker type. */
export const ACCEPT_ATTR: Record<MediaAccept, string> = {
  image: 'image/*',
  video: 'video/*',
  pdf: 'application/pdf',
  data: '.csv,.json,text/csv,application/json',
  any: 'image/*,video/*,application/pdf,.csv,.json',
};

export function kindOf(file: { type: string; name: string }): MediaKind {
  const name = file.name.toLowerCase();
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (name.endsWith('.csv') || name.endsWith('.json')) return 'data';
  return 'other';
}

/** Some systems report CSV as application/vnd.ms-excel; fix the type for Storage. */
function contentTypeOf(file: File) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.csv')) return 'text/csv';
  if (name.endsWith('.json')) return 'application/json';
  return file.type || 'application/octet-stream';
}

export function matchesAccept(kind: MediaKind, accept: MediaAccept) {
  return accept === 'any' || kind === accept;
}

export function formatBytes(bytes: number | null) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

/** Display name: strips the folder and the random prefix added on upload. */
export function displayName(path: string) {
  const file = path.split('/').pop() ?? path;
  return file.replace(/^[0-9a-f]{8}-/, '');
}

async function imageSize(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return { width: null, height: null }; // e.g. SVG
  }
}

/** Uploads one file and records it in the media table. */
export async function uploadMedia(file: File): Promise<MediaRow> {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`${file.name} is larger than 50 MB.`);

  const supabase = createClient();
  const kind = kindOf(file);
  const month = new Date().toISOString().slice(0, 7);
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(-80);
  const path = `${kind}/${month}/${crypto.randomUUID().slice(0, 8)}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: contentTypeOf(file),
    upsert: false,
  });
  if (uploadError) throw new Error(`${file.name}: ${uploadError.message}`);

  const url = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  const { width, height } = kind === 'image' ? await imageSize(file) : { width: null, height: null };

  const { data, error } = await supabase
    .from('media')
    .insert({ bucket: MEDIA_BUCKET, path, url, kind, mime_type: contentTypeOf(file), size_bytes: file.size, width, height })
    .select()
    .single();
  if (error) {
    // Keep Storage and the index in sync.
    await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    throw new Error(`${file.name}: ${error.message}`);
  }
  return data as MediaRow;
}

export async function listMedia(): Promise<MediaRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as MediaRow[];
}

export async function deleteMedia(item: Pick<MediaRow, 'id' | 'bucket' | 'path'>) {
  const supabase = createClient();
  const { error: storageError } = await supabase.storage.from(item.bucket).remove([item.path]);
  if (storageError) throw new Error(storageError.message);
  const { error } = await supabase.from('media').delete().eq('id', item.id);
  if (error) throw new Error(error.message);
}

export async function updateMediaAlt(id: string, alt: { en: string; ar: string }) {
  const supabase = createClient();
  const { error } = await supabase.from('media').update({ alt }).eq('id', id);
  if (error) throw new Error(error.message);
}
