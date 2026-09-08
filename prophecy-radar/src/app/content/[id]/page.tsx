'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle2, EyeOff, Eye } from 'lucide-react';
import { ContentCardData, ContentStatus } from '@/lib/types';
import { StatusPill } from '@/components/status-pill';
import { GeneratorPanel } from '@/components/generator-panel';
import { relativeTime, formatCount, PLATFORM_LABEL } from '@/lib/format';

export default function ContentDetailPage() {
  return (
    <Suspense fallback={<div className="p-6 text-ink-muted">Loading…</div>}>
      <ContentDetailPageInner />
    </Suspense>
  );
}

function ContentDetailPageInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const action = searchParams.get('action'); // 'titles' | 'thumbnails', set by the card's shortcut buttons
  const [content, setContent] = useState<ContentCardData | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/content/${id}`)
      .then((r) => r.json())
      .then((json) => {
        setContent(json.item ?? null);
        setNotes(json.item?.notes ?? '');
      });
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (status: ContentStatus) => {
    setContent((prev) => (prev ? { ...prev, status } : prev));
    await fetch(`/api/content/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    await fetch(`/api/content/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    setSavingNotes(false);
  };

  if (!content) {
    return <div className="p-6 text-ink-muted">Loading…</div>;
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-3xl">
      <Link href="/" className="focus-ring inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-4">
        <ArrowLeft size={15} /> Back
      </Link>

      <div className="flex items-center gap-2 flex-wrap text-xs text-ink-muted mb-2">
        <span>{content.categoryEmoji} {content.categoryName}</span>
        <span aria-hidden>·</span>
        <span>{PLATFORM_LABEL[content.platform]}</span>
        <span aria-hidden>·</span>
        <span>{relativeTime(content.publishedAt)}</span>
        <StatusPill status={content.status} />
      </div>

      <h1 className="font-display text-2xl leading-snug mb-2">{content.title}</h1>
      <p className="text-sm text-ink-muted mb-4">
        {content.creatorName} · <Eye size={12} className="inline -mt-0.5" /> {formatCount(content.viewCount)} views
      </p>

      <div className="flex items-center gap-2 flex-wrap mb-6">
        <a href={content.url} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-card bg-base-overlay hover:bg-border transition-colors">
          <ExternalLink size={14} /> Watch original
        </a>
        <button onClick={() => updateStatus('REVIEWED')} className="focus-ring text-sm font-medium px-3 py-2 rounded-card bg-base-overlay hover:bg-border transition-colors">
          Mark reviewed
        </button>
        <button onClick={() => updateStatus('DONE')} className="focus-ring flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-card bg-signal-done/15 text-signal-done hover:bg-signal-done/25 transition-colors">
          <CheckCircle2 size={14} /> Done
        </button>
        <button onClick={() => updateStatus('IGNORED')} className="focus-ring flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-card bg-base-overlay hover:bg-border transition-colors">
          <EyeOff size={14} /> Ignore
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1 bg-base-raised border border-border rounded-card p-4 text-center">
          <p className="font-display text-4xl">{content.relevanceScore}</p>
          <p className="text-xs text-ink-muted mt-1">% relevant</p>
        </div>
        <div className="md:col-span-2 bg-base-raised border border-border rounded-card p-4">
          <p className="text-xs text-ink-muted uppercase tracking-wide mb-1.5">Why this was recommended</p>
          <p className="text-sm">{content.relevanceReason}</p>
        </div>
      </div>

      <div className="bg-base-raised border border-border rounded-card p-4 mb-6 space-y-3">
        <h2 className="font-display text-base mb-1">Analysis</h2>
        <DetailRow label="Prophecy topic" value={content.prophecyTopic} />
        <DetailRow label="Prophecy type" value={content.prophecyType} />
        <DetailRow label="People mentioned" value={content.peopleMentioned.join(', ') || null} />
        <DetailRow label="Locations" value={content.locations.join(', ') || null} />
        <DetailRow label="Timeframe" value={content.timeframe} />
        <DetailRow label="Key claim" value={content.keyClaim} />
        <DetailRow label="Keywords" value={content.keywords.join(', ') || null} />
        {content.summary && (
          <div>
            <p className="text-xs text-ink-muted uppercase tracking-wide mb-1">Summary</p>
            <p className="text-sm">{content.summary}</p>
          </div>
        )}
        <p className="text-xs text-ink-faint pt-2 border-t border-border">
          Prophecy Radar is a discovery and research tool — it does not verify or claim the truth of any prophecy.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <GeneratorPanel contentId={content.id} kind="titles" label="🚀 Generate viral titles" autoRun={action === 'titles'} />
        <GeneratorPanel contentId={content.id} kind="thumbnails" label="🖼 Generate thumbnail captions" autoRun={action === 'thumbnails'} />
        <GeneratorPanel contentId={content.id} kind="viral-package" label="🚀 Viral package (title + thumbnail combo)" />
      </div>

      <div className="bg-base-raised border border-border rounded-card p-4">
        <h2 className="font-display text-base mb-2">My notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
          rows={3}
          placeholder="React to this tomorrow. Compare with the previous prophecy…"
          className="focus-ring w-full bg-base-overlay border border-border rounded-card px-3 py-2.5 text-sm placeholder:text-ink-faint"
        />
        {savingNotes && <p className="text-xs text-ink-faint mt-1">Saving…</p>}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right">{value ?? '—'}</span>
    </div>
  );
}
