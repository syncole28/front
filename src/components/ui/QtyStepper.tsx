import { Minus, Plus } from 'lucide-react';
interface QtyStepperProps { value: number; onChange: (value: number) => void; min?: number; size?: 'sm' | 'md'; }
export function QtyStepper({ value, onChange, min = 0, size = 'md' }: QtyStepperProps) {
  const btn = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <div className="inline-flex items-center rounded border border-line bg-surface">
      <button type="button" aria-label="Уменьшить количество" className={`${btn} flex items-center justify-center text-muted transition-colors hover:text-ink disabled:opacity-40`} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}><Minus size={14} /></button>
      <input type="text" inputMode="numeric" aria-label="Количество" className={`${size === 'sm' ? 'h-8 w-10' : 'h-10 w-12'} border-x border-line bg-transparent text-center font-mono text-sm`} value={value} onChange={(e) => { const n = parseInt(e.target.value, 10); if (!Number.isNaN(n)) onChange(Math.max(min, n)); }} />
      <button type="button" aria-label="Увеличить количество" className={`${btn} flex items-center justify-center text-muted transition-colors hover:text-ink`} onClick={() => onChange(value + 1)}><Plus size={14} /></button>
    </div>
  );
}
