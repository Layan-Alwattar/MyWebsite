'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function setMessageRead(id: string, isRead: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', id);
  if (error) return { ok: false as const, message: error.message };
  revalidatePath('/admin', 'layout'); // refresh unread badge
  return { ok: true as const };
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) return { ok: false as const, message: error.message };
  revalidatePath('/admin', 'layout');
  return { ok: true as const };
}
