'use client';

import { UploadCloud } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Drag-and-drop (or click / keyboard) file picker.
 * Calls onFiles with the chosen files; uploading is the parent's job.
 */
export function Dropzone({
  accept,
  multiple = true,
  onFiles,
  busy,
  hint,
  compact,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  busy?: boolean;
  hint?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const id = useId();

  const handle = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handle(e.dataTransfer.files);
      }}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-center transition',
        compact ? 'p-4' : 'p-8',
        dragging ? 'border-blush-500 bg-blush-100' : 'border-blush-200 bg-blush-50/60 hover:bg-blush-50',
        busy && 'pointer-events-none opacity-60',
      )}
    >
      <UploadCloud className="text-blush-600" size={compact ? 22 : 30} aria-hidden />
      <p className="text-sm text-ink">
        {busy ? (
          'Uploading…'
        ) : (
          <>
            Drag & drop, or{' '}
            <label htmlFor={id} className="cursor-pointer font-semibold text-blush-700 underline underline-offset-2">
              browse
            </label>
          </>
        )}
      </p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
