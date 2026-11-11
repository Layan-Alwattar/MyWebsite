'use client';

import type { MediaAccept } from '@/lib/admin/fields';
import type { MediaRow } from '@/lib/media';
import { Modal } from '@/components/ui/misc';
import { MediaLibrary } from './media-library';

const TITLES: Record<MediaAccept, string> = {
  image: 'Choose an image',
  video: 'Choose a video',
  pdf: 'Choose a PDF',
  data: 'Choose a data file',
  any: 'Choose a file',
};

/** Modal wrapper around the media library in "pick" mode. */
export function MediaPickerModal({
  open,
  onClose,
  accept,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  accept: MediaAccept;
  onPick: (item: MediaRow) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={TITLES[accept]} wide>
      <MediaLibrary
        accept={accept}
        onPick={(item) => {
          onPick(item);
          onClose();
        }}
      />
    </Modal>
  );
}
