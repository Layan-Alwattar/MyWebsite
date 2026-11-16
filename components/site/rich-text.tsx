/**
 * Renders Tiptap/ProseMirror JSON as React elements (server-side, no
 * dangerouslySetInnerHTML). Unknown node types are skipped; links are
 * restricted to safe protocols.
 */
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { hasRichContent } from '@/lib/i18n';

type Mark = { type: string; attrs?: Record<string, unknown> };
type Node = { type: string; text?: string; marks?: Mark[]; attrs?: Record<string, unknown>; content?: Node[] };

const SAFE_URL = /^(https?:|mailto:|\/|#)/i;

function alignStyle(node: Node): CSSProperties | undefined {
  const align = node.attrs?.textAlign;
  if (align === 'center' || align === 'right' || align === 'left' || align === 'justify') {
    // Map left/right to logical values so Arabic content mirrors correctly.
    return { textAlign: align === 'left' ? 'start' : align === 'right' ? 'end' : align };
  }
  return undefined;
}

function renderText(node: Node, key: number): ReactNode {
  let el: ReactNode = node.text ?? '';
  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case 'bold':
        el = <strong>{el}</strong>;
        break;
      case 'italic':
        el = <em>{el}</em>;
        break;
      case 'underline':
        el = <u>{el}</u>;
        break;
      case 'strike':
        el = <s>{el}</s>;
        break;
      case 'code':
        el = <code>{el}</code>;
        break;
      case 'link': {
        const href = String(mark.attrs?.href ?? '');
        if (SAFE_URL.test(href)) {
          const external = /^https?:/i.test(href);
          el = (
            <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {el}
            </a>
          );
        }
        break;
      }
    }
  }
  return <span key={key}>{el}</span>;
}

function renderNode(node: Node, key: number): ReactNode {
  const children = node.content?.map(renderNode);
  switch (node.type) {
    case 'text':
      return renderText(node, key);
    case 'paragraph':
      return <p key={key} style={alignStyle(node)}>{children}</p>;
    case 'heading': {
      const level = node.attrs?.level === 3 ? 3 : 2;
      const Tag = level === 3 ? 'h4' : 'h3'; // page/section titles own h1/h2
      return <Tag key={key} style={alignStyle(node)}>{children}</Tag>;
    }
    case 'bulletList':
      return <ul key={key}>{children}</ul>;
    case 'orderedList':
      return <ol key={key}>{children}</ol>;
    case 'listItem':
      return <li key={key}>{children}</li>;
    case 'blockquote':
      return <blockquote key={key}>{children}</blockquote>;
    case 'codeBlock':
      return (
        <pre key={key} dir="ltr">
          <code>{node.content?.map((n) => n.text).join('')}</code>
        </pre>
      );
    case 'horizontalRule':
      return <hr key={key} />;
    case 'hardBreak':
      return <br key={key} />;
    case 'image': {
      const src = String(node.attrs?.src ?? '');
      if (!SAFE_URL.test(src)) return null;
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary-size content images from the editor
      return <img key={key} src={src} alt={String(node.attrs?.alt ?? '')} loading="lazy" />;
    }
    default:
      return children ? <div key={key}>{children}</div> : null;
  }
}

export function RichText({ doc, className }: { doc: unknown; className?: string }) {
  if (!hasRichContent(doc)) return null;
  return <div className={cn('prose-rich prose-site', className)}>{(doc as Node).content?.map(renderNode)}</div>;
}
