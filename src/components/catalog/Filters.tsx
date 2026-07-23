import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { FilterFacet } from '@/api/types';

export interface FilterState { params: Record<string, string[]>; priceMin: string; priceMax: string; inStock: boolean; }
interface FiltersProps { facets: FilterFacet[]; priceBounds: { min: number; max: number }; value: FilterState; onChange: (next: FilterState) => void; onReset: () => void; }

function FacetGroup({ facet, selected, onToggle }: { facet: FilterFacet; selected: string[]; onToggle: (value: string) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-line py-3">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between text-sm font-semibold">{facet.name}<ChevronDown size={15} className={`text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} /></button>
      <div className={`grid transition-[grid-template-rows] duration-200 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <ul className="mt-2 max-h-48 space-y-1.5 overflow-y-auto pr-1">
            {facet.values.map(({ value, count }) => (<li key={value}><label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)} className="h-4 w-4 rounded border-line accent-[#2E6E8E]" /><span className="flex-1">{value}</span><span className="font-mono text-xs text-muted">{count}</span></label></li>))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Filters({ facets, priceBounds, value, onChange, onReset }: FiltersProps) {
  const toggleParam = (param: string, v: string) => { const current = value.params[param] ?? []; const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v]; onChange({ ...value, params: { ...value.params, [param]: next } }); };
  const hasActive = value.inStock || value.priceMin !== '' || value.priceMax !== '' || Object.values(value.params).some((v) => v.length > 0);
  return (
    <div className="text-ink">
      <div className="flex items-center justify-between pb-2"><h2 className="text-base font-bold">Фильтры</h2>{hasActive && <button type="button" onClick={onReset} className="inline-flex items-center gap-1 text-xs font-medium text-circuit hover:underline"><X size={12} />Сбросить</button>}</div>
      <div className="border-b border-line py-3"><p className="mb-2 text-sm font-semibold">Цена, ₽</p><div className="flex items-center gap-2"><input type="number" inputMode="decimal" placeholder={String(priceBounds.min)} aria-label="Цена от" value={value.priceMin} onChange={(e) => onChange({ ...value, priceMin: e.target.value })} className="h-9 w-full rounded border border-line bg-paper px-2 font-mono text-sm" /><span className="text-muted">—</span><input type="number" inputMode="decimal" placeholder={String(priceBounds.max)} aria-label="Цена до" value={value.priceMax} onChange={(e) => onChange({ ...value, priceMax: e.target.value })} className="h-9 w-full rounded border border-line bg-paper px-2 font-mono text-sm" /></div></div>
      <div className="border-b border-line py-3"><label className="flex cursor-pointer items-center gap-2 text-sm font-medium"><input type="checkbox" checked={value.inStock} onChange={(e) => onChange({ ...value, inStock: e.target.checked })} className="h-4 w-4 accent-[#2E6E8E]" />Только в наличии</label></div>
      {facets.map((facet) => (<FacetGroup key={facet.name} facet={facet} selected={value.params[facet.name] ?? []} onToggle={(v) => toggleParam(facet.name, v)} />))}
    </div>
  );
}
