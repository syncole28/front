export function Nameplate({ sku, className = '' }: { sku: string; className?: string }) {
  return (
    <span className={`relative inline-flex items-center border border-line bg-surface/95 px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted ${className}`}>
      <span className="absolute left-[3px] top-[3px] h-[3px] w-[3px] rounded-full bg-line" aria-hidden />
      <span className="absolute right-[3px] top-[3px] h-[3px] w-[3px] rounded-full bg-line" aria-hidden />
      <span className="absolute bottom-[3px] left-[3px] h-[3px] w-[3px] rounded-full bg-line" aria-hidden />
      <span className="absolute bottom-[3px] right-[3px] h-[3px] w-[3px] rounded-full bg-line" aria-hidden />
      {sku}
    </span>
  );
}
