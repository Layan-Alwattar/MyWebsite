'use client';

/**
 * Rich-text editor (Tiptap) used for project stories, reflections,
 * certificate reflections and the About story. Stores ProseMirror JSON.
 */
import { EditorContent, useEditor, useEditorState, type Editor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { Locale, RichDoc } from '@/lib/i18n';
import { LOCALE_DIR } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import { MediaPickerModal } from './media-picker';

export function RichTextEditor({
  value,
  onChange,
  locale,
  placeholder,
  id,
}: {
  value: RichDoc;
  onChange: (doc: RichDoc) => void;
  locale: Locale;
  placeholder?: string;
  id?: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const editor = useEditor({
    // Avoid hydration mismatches in Next.js.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder ?? (locale === 'ar' ? 'المحتوى هنا…' : 'Start writing…') }),
    ],
    content: (value as JSONContent | null) ?? '',
    editorProps: {
      attributes: {
        class: 'prose-rich min-h-40 px-4 py-3 text-sm text-ink outline-none',
        dir: LOCALE_DIR[locale],
        lang: locale,
        ...(id ? { id } : {}),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? null : (editor.getJSON() as RichDoc)),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white focus-within:border-blush-500 focus-within:ring-4 focus-within:ring-blush-500/15">
      {editor && <Toolbar editor={editor} onImage={() => setPickerOpen(true)} />}
      <EditorContent editor={editor} />
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        accept="image"
        onPick={(item) =>
          editor?.chain().focus().setImage({ src: item.url, alt: item.alt?.[locale] || item.alt?.en || '' }).run()
        }
      />
    </div>
  );
}

function Toolbar({ editor, onImage }: { editor: Editor; onImage: () => void }) {
  // Tiptap v3 doesn't re-render on every keystroke; subscribe to what the toolbar needs.
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      code: e.isActive('codeBlock'),
      link: e.isActive('link'),
      left: e.isActive({ textAlign: 'left' }),
      center: e.isActive({ textAlign: 'center' }),
      right: e.isActive({ textAlign: 'right' }),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  function setLink() {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL (leave empty to remove)', previous ?? 'https://');
    if (url === null) return;
    if (!url.trim()) chain().extendMarkRange('link').unsetLink().run();
    else chain().extendMarkRange('link').setLink({ href: url.trim() }).run();
  }

  return (
    <div role="toolbar" aria-label="Formatting" className="flex flex-wrap gap-0.5 border-b border-line bg-blush-50/60 p-1.5">
      <Tool label="Bold" active={s.bold} onClick={() => chain().toggleBold().run()}><Bold size={16} /></Tool>
      <Tool label="Italic" active={s.italic} onClick={() => chain().toggleItalic().run()}><Italic size={16} /></Tool>
      <Tool label="Underline" active={s.underline} onClick={() => chain().toggleUnderline().run()}><Underline size={16} /></Tool>
      <Tool label="Strikethrough" active={s.strike} onClick={() => chain().toggleStrike().run()}><Strikethrough size={16} /></Tool>
      <Divider />
      <Tool label="Heading" active={s.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></Tool>
      <Tool label="Subheading" active={s.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></Tool>
      <Tool label="Bullet list" active={s.bullet} onClick={() => chain().toggleBulletList().run()}><List size={16} /></Tool>
      <Tool label="Numbered list" active={s.ordered} onClick={() => chain().toggleOrderedList().run()}><ListOrdered size={16} /></Tool>
      <Tool label="Quote" active={s.quote} onClick={() => chain().toggleBlockquote().run()}><Quote size={16} /></Tool>
      <Tool label="Code block" active={s.code} onClick={() => chain().toggleCodeBlock().run()}><Code2 size={16} /></Tool>
      <Tool label="Divider line" onClick={() => chain().setHorizontalRule().run()}><Minus size={16} /></Tool>
      <Divider />
      <Tool label="Align left" active={s.left} onClick={() => chain().setTextAlign('left').run()}><AlignLeft size={16} /></Tool>
      <Tool label="Align center" active={s.center} onClick={() => chain().setTextAlign('center').run()}><AlignCenter size={16} /></Tool>
      <Tool label="Align right" active={s.right} onClick={() => chain().setTextAlign('right').run()}><AlignRight size={16} /></Tool>
      <Divider />
      <Tool label="Link" active={s.link} onClick={setLink}><Link2 size={16} /></Tool>
      <Tool label="Image" onClick={onImage}><ImageIcon size={16} /></Tool>
      <Divider />
      <Tool label="Undo" disabled={!s.canUndo} onClick={() => chain().undo().run()}><Undo2 size={16} /></Tool>
      <Tool label="Redo" disabled={!s.canRedo} onClick={() => chain().redo().run()}><Redo2 size={16} /></Tool>
    </div>
  );
}

function Tool({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep the editor selection
      onClick={onClick}
      className={cn(
        'grid size-8 place-items-center rounded-lg transition disabled:opacity-30',
        active ? 'bg-blush-700 text-white' : 'text-muted hover:bg-blush-100 hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 my-1.5 w-px bg-line" />;
}
