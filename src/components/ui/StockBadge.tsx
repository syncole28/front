import { stockStatus } from '@/lib/format';
const toneClasses = { ok: 'text-breaker', low: 'text-signal', none: 'text-muted' } as const;
export function StockBadge({ count, className = '' }: { count: number; className?: string }) {
  const { label, tone } = stockStatus(count);
  return (<span className={`inline-flex items-center gap-1.5 text-sm font-medium ${toneClasses[tone]} ${className}`}><span className={`h-1.5 w-1.5 rounded-full ${tone === 'ok' ? 'bg-breaker' : tone === 'low' ? 'bg-signal' : 'bg-muted'}`} />{label}</span>);
}
