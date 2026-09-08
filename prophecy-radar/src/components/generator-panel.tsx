'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Sparkles, Check } from 'lucide-react';

type GeneratorKind = 'titles' | 'thumbnails' | 'viral-package';

interface Props {
  contentId: string;
  kind: GeneratorKind;
  label: string;
  autoRun?: boolean;
}

export function GeneratorPanel({ contentId, kind, label, autoRun }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const run = async () => {
    setLoading(true);
    const res = await fetch(`/api/content/${contentId}/${kind}`, { method: 'POST' });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  };

  useEffect(() => {
    if (autoRun) {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div ref={containerRef} className={`bg-base-raised border rounded-card p-4 transition-colors ${autoRun ? 'border-signal-gold/50' : 'border-border'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-base">{label}</h3>
        <button
          onClick={run}
          disabled={loading}
          className="focus-ring flex items-center gap-1.5 text-xs font-medium bg-signal-gold/15 text-signal-gold px-3 py-1.5 rounded-card hover:bg-signal-gold/25 transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
          {result ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      {!result && !loading && <p className="text-sm text-ink-muted">Click generate to produce ideas grounded only in this item's extracted content.</p>}

      {result?.error && <p className="text-sm text-signal-alert mb-2">{result.error}</p>}

      {result?.demo && (
        <p className="text-xs text-signal-info mb-3">Showing template output — set AI_API_KEY in Settings for AI-generated ideas.</p>
      )}

      {kind === 'titles' && result && (
        <ul className="space-y-1.5">
          {result.titles.map((t: string) => (
            <li key={t} className="flex items-center gap-2">
              <button
                onClick={() => copy(t)}
                className={`focus-ring flex-1 text-left text-sm px-3 py-2 rounded-card transition-colors ${
                  t === result.bestTitle ? 'bg-signal-gold/15 text-signal-gold font-medium' : 'bg-base-overlay hover:bg-border'
                }`}
              >
                {t === result.bestTitle && '★ '}
                {t}
              </button>
              {copied === t && <Check size={14} className="text-signal-done shrink-0" />}
            </li>
          ))}
        </ul>
      )}

      {kind === 'thumbnails' && result && (
        <ul className="grid grid-cols-2 gap-1.5">
          {result.captions.map((c: string) => (
            <li key={c}>
              <button
                onClick={() => copy(c)}
                className={`focus-ring w-full text-left text-sm px-3 py-2 rounded-card transition-colors ${
                  c === result.bestCaption ? 'bg-signal-gold/15 text-signal-gold font-medium' : 'bg-base-overlay hover:bg-border'
                }`}
              >
                {c === result.bestCaption && '★ '}
                {c}
              </button>
            </li>
          ))}
        </ul>
      )}

      {kind === 'viral-package' && result && !result.error && (
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-ink-muted mb-1">Best title</p>
            <button onClick={() => copy(result.bestTitle)} className="focus-ring w-full text-left bg-signal-gold/15 text-signal-gold font-medium px-3 py-2 rounded-card">
              {result.bestTitle}
            </button>
          </div>
          <div>
            <p className="text-xs text-ink-muted mb-1">Best thumbnail caption</p>
            <button onClick={() => copy(result.bestCaption)} className="focus-ring w-full text-left bg-signal-gold/15 text-signal-gold font-medium px-3 py-2 rounded-card">
              {result.bestCaption}
            </button>
          </div>
          <div>
            <p className="text-xs text-ink-muted mb-1">Alternative titles</p>
            <div className="flex flex-col gap-1">
              {result.altTitles.map((t: string) => (
                <button key={t} onClick={() => copy(t)} className="focus-ring text-left bg-base-overlay hover:bg-border px-3 py-2 rounded-card">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-ink-muted mb-1">Alternative captions</p>
            <div className="grid grid-cols-2 gap-1.5">
              {result.altCaptions.map((c: string) => (
                <button key={c} onClick={() => copy(c)} className="focus-ring text-left bg-base-overlay hover:bg-border px-3 py-2 rounded-card">
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border pt-3 space-y-1.5">
            <p><span className="text-ink-muted">Thumbnail concept: </span>{result.thumbnailConcept}</p>
            <p><span className="text-ink-muted">Feature: </span>{result.peopleToFeature.join(', ')}</p>
            <p><span className="text-ink-muted">Emotion: </span>{result.emotion}</p>
            <p><span className="text-ink-muted">Visual hierarchy: </span>{result.visualHierarchy}</p>
          </div>
        </div>
      )}
    </div>
  );
}
