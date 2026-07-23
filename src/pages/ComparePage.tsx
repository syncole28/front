import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, ShoppingCart, X } from 'lucide-react';
import * as api from '@/api/client';
import type { ProductDetail } from '@/api/types';
import { useShop } from '@/context/ShopContext';
import { toListItem } from '@/api/client';
import { formatPrice, productPath, stockStatus } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';

export function ComparePage() {
  const { compare, toggleCompare, addToCart } = useShop();
  const [items, setItems] = useState<ProductDetail[] | null>(null);
  useEffect(() => { if (!compare.length) { setItems([]); return; } api.getProductsByIds(compare).then(setItems).catch(() => setItems([])); }, [compare]);
  const paramNames = useMemo(() => { if (!items) return []; const names = new Set<string>(); items.forEach((p) => p.params.forEach((pp) => names.add(pp.name))); return [...names]; }, [items]);
  if (!items) return (<div><Seo title="Сравнение товаров" /><h1 className="mb-4 text-2xl font-bold">Сравнение товаров</h1><div className="skeleton h-64 w-full" /></div>);
  if (!items.length) return (<div><Seo title="Сравнение товаров" /><h1 className="mb-4 text-2xl font-bold">Сравнение товаров</h1><div className="rounded-lg border border-line bg-surface p-10 text-center"><GitCompare size={28} className="mx-auto mb-3 text-muted" /><p className="mb-1 font-medium">Список сравнения пуст.</p><p className="mb-4 text-sm text-muted">Добавьте до 4 товаров по значку сравнения на карточке, чтобы сопоставить характеристики.</p><Link to="/" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]">Перейти в каталог</Link></div></div>);
  return (
    <div>
      <Seo title="Сравнение товаров" />
      <h1 className="mb-4 text-2xl font-bold">Сравнение товаров</h1>
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[40rem] text-sm">
          <thead><tr className="border-b border-line align-top"><th className="w-44 p-3 text-left font-medium text-muted">Товар</th>{items.map((p) => (<th key={p.id} className="min-w-[12rem] p-3 text-left font-normal"><div className="relative"><button type="button" onClick={() => toggleCompare(p.id)} aria-label={`Убрать ${p.name} из сравнения`} className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded text-muted hover:text-fault"><X size={15} /></button><Link to={productPath(p.id, p.name)}><img src={p.images[0]} alt={p.name} className="mb-2 h-24 w-24 rounded border border-line object-cover" /><span className="font-medium leading-snug hover:text-circuit">{p.name}</span></Link></div></th>))}</tr></thead>
          <tbody>
            <tr className="border-b border-line"><td className="p-3 text-muted">Артикул</td>{items.map((p) => <td key={p.id} className="p-3 font-mono">{p.sku}</td>)}</tr>
            <tr className="border-b border-line"><td className="p-3 text-muted">Цена</td>{items.map((p) => <td key={p.id} className="p-3 font-mono text-base font-medium">{formatPrice(p.price)}</td>)}</tr>
            <tr className="border-b border-line"><td className="p-3 text-muted">Наличие</td>{items.map((p) => { const s = stockStatus(p.stock_count); return <td key={p.id} className={`p-3 ${s.tone === 'ok' ? 'text-breaker' : s.tone === 'low' ? 'text-signal' : 'text-muted'}`}>{s.label}</td>; })}</tr>
            {paramNames.map((name) => (<tr key={name} className="border-b border-line"><td className="p-3 text-muted">{name}</td>{items.map((p) => { const param = p.params.find((pp) => pp.name === name); return <td key={p.id} className="p-3 font-mono">{param ? `${param.value}${param.unit ? ` ${param.unit}` : ''}` : '—'}</td>; })}</tr>))}
            <tr><td className="p-3" />{items.map((p) => (<td key={p.id} className="p-3"><button type="button" onClick={() => addToCart(toListItem(p))} className="inline-flex h-9 items-center gap-2 rounded bg-signal px-3 text-sm font-semibold text-[#1B1F24]"><ShoppingCart size={15} />В корзину</button></td>))}</tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
