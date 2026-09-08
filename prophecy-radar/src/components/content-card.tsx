'use client';

import Link from 'next/link';
import { Eye, CheckCircle2, EyeOff, Type, ImageIcon, ExternalLink } from 'lucide-react';
import { ContentCardData } from '@/lib/types';
import { StatusPill } from './status-pill';
import { accentForCategory } from '@/lib/accent';
import { relativeTime, formatCount, PLATFORM_LABEL } from '@/lib/format';

interface Props {
  content: ContentCardData;
  onStatusChange: (id: string, status: ContentCardData['status']) => void;
}

export function ContentCard({ content, onStatusChange }: Props) {
  const accent = accentForCategory(content.categoryId);

  return (
    <article
      className="bg-base-raised rounded-card border border-border overflow-hidden flex flex-col"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="p-4 flex gap-4">
        {/* Relevance score — the single most important number on the card */}
        <div className="shrink-0 flex flex-col items-center justify-center w-16">
          <span className="font-display text-2xl leading-none">{content.relevanceScore}</span>
          <span className="text-[10px] text-ink-muted mt-1 text-center leading-tight">% relevant</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap text-xs text-ink-muted mb-1.5">
            <span>
              {content.categoryEmoji} {content.categoryName}
            </span>
            <span aria-hidden>·</span>
            <span>{PLATFORM_LABEL[content.platform]}</span>
            <span aria-hidden>·</span>
            <span>{relativeTime(content.publishedAt)}</span>
            <StatusPill status={content.status} />
          </div>

          <Link href={`/content/${content.id}`} className="focus-ring block">
            <h3 className="font-display text-lg leading-snug line-clamp-2 hover:text-signal-gold transition-colors">
              {content.title}
            </h3>
          </Link>

          <p className="text-sm text-ink-muted mt-1">
            {content.creatorName} · <Eye size={12} className="inline -mt-0.5" /> {formatCount(content.viewCount)} views
          </p>

          {(content.peopleMentioned.length > 0 || content.timeframe) && (
            <div className="flex gap-1.5 flex-wrap mt-2">
              {content.peopleMentioned.map((p) => (
                <span key={p} className="text-xs bg-base-overlay text-ink-muted rounded-full px-2 py-0.5">
                  {p}
                </span>
              ))}
              {content.timeframe && (
                <span className="text-xs bg-base-overlay text-ink-muted rounded-full px-2 py-0.5">{content.timeframe}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border px-4 py-2.5 flex items-center gap-1 flex-wrap">
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-card bg-base-overlay hover:bg-border transition-colors"
        >
          <ExternalLink size={13} /> Watch
        </a>
        <button
          onClick={() => onStatusChange(content.id, 'REVIEWED')}
          title="Mark reviewed"
          className="focus-ring flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-card bg-base-overlay hover:bg-border transition-colors"
        >
          Reviewed
        </button>
        <button
          onClick={() => onStatusChange(content.id, 'DONE')}
          title="Mark done"
          className="focus-ring flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-card bg-signal-done/15 text-signal-done hover:bg-signal-done/25 transition-colors"
        >
          <CheckCircle2 size={13} /> Done
        </button>
        <button
          onClick={() => onStatusChange(content.id, 'IGNORED')}
          title="Ignore"
          className="focus-ring flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-card bg-base-overlay hover:bg-border transition-colors"
        >
          <EyeOff size={13} /> Ignore
        </button>
        <Link
          href={`/content/${content.id}?action=titles`}
          className="focus-ring flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-card bg-signal-gold/15 text-signal-gold hover:bg-signal-gold/25 transition-colors ml-auto"
        >
          <Type size={13} /> Titles
        </Link>
        <Link
          href={`/content/${content.id}?action=thumbnails`}
          className="focus-ring flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-card bg-signal-gold/15 text-signal-gold hover:bg-signal-gold/25 transition-colors"
        >
          <ImageIcon size={13} /> Thumbnails
        </Link>
      </div>
    </article>
  );
}
