import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import * as api from '@/api/client';
import type { ProductListItem } from '@/api/types';
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard';
import { Seo } from '@/components/ui/Seo';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [input, setInput] = useState(q);
  const [items, setItems] = useState<ProductListItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setInput(q); if (!q.trim()) { setItems(null); return; }
    let cancelled = false; setLoading(true);
    api.searchProducts(q).then((res) => { if (!cancelled) setItems(res.items); }).catch(() => { if (!cancelled) setItems([]); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [q]);
  return (
    <div>
      <Seo title={q ? `Поиск: ${q}` : 'Поиск по каталогу'} />
      <h1 className="mb-4 text-2xl font-bold">Поиск по каталогу</h1>
      <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) setSearchParams({ q: input.trim() }); }} className="mb-6 flex max-w-xl gap-2" role="search">
        <input type="search" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Название, артикул или производитель" aria-label="Поисковый запрос" className="h-11 flex-1 rounded border border-line bg-surface px-3 text-sm" />
        <button type="submit" className="inline-flex h-11 items-center gap-2 rounded bg-signal px-4 text-sm font-semibold text-[#1B1F24]"><Search size={16} />Найти</button>
      </form>
      {loading ? (<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>) : items && items.length > 0 ? (<><p className="mb-3 text-sm text-muted">Найдено: <span className="font-mono">{items.length}</span></p><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div></>) : items ? (<div className="rounded-lg border border-line bg-surface p-10 text-center"><p className="mb-1 font-medium">Ничего не найдено по запросу «{q}».</p><p className="text-sm text-muted">Проверьте написание или попробуйте искать по артикулу либо производителю.</p></div>) : (<p className="text-sm text-muted">Введите запрос — ищем по названию, артикулу и производителю среди 18 500+ позиций.</p>)}
    </div>
  );
}
