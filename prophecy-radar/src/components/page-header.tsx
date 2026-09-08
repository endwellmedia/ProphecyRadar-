export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-4 md:px-6 pt-6 pb-4">
      <h1 className="font-display text-2xl md:text-3xl">{title}</h1>
      {subtitle && <p className="text-ink-muted text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
