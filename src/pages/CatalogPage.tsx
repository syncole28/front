import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import * as api from '@/api/client';
import type { Category, FilterFacet, ProductListResponse } from '@/api/types';
import { Filters, type FilterState } from '@/components/catalog/Filters';
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard';
import { Seo } from '@/components/ui/Seo';

const SORT_OPTIONS = [{ value: 'popular', label: 'По популярности' }, { value: 'price_asc', label: 'Сначала дешевле' }, { value: 'price_desc', label: 'Сначала дороже' }, { value: 'stock', label: 'По наличию' }] as const;
const EMPTY_FILTERS: FilterState = { params: {}, priceMin: '', priceMax: '', inStock: false };

export function CatalogPage() {
  const { categorySlug = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [facets, setFacets] = useState<FilterFacet[]>([]);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 100000 });
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [view, setView] = useState<'grid' | 'list'>(() => (localStorage.getItem('et_view') as 'grid' | 'list') || 'grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const sort = (searchParams.get('sort') ?? 'popular') as (typeof SORT_OPTIONS)[number]['value'];

  useEffect(() => {
    setNotFound(false); setFilters(EMPTY_FILTERS); setData(null);
    api.getCategories().then((cats) => { const found = cats.find((c) => c.slug === categorySlug) ?? null; setCategory(found); if (!found) setNotFound(true); });
    api.getCategoryFacets(categorySlug).then(({ facets, price_min, price_max }) => { setFacets(facets); setPriceBounds({ min: price_min, max: price_max }); });
  }, [categorySlug]);

  useEffect(() => {
    let cancelled = false; setLoading(true);
    api.getProducts({ category: categorySlug, page, per_page: 24, sort, filters: filters.params, price_min: filters.priceMin ? Number(filters.priceMin) : undefined, price_max: filters.priceMax ? Number(filters.priceMax) : undefined, in_stock: filters.inStock || undefined })
      .then((res) => { if (!cancelled) setData(res); }).catch(() => { if (!cancelled) setData({ items: [], total: 0, page: 1, per_page: 24 }); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [categorySlug, page, sort, filters]);

  const totalPages = useMemo(() => (data ? Math.ceil(data.total / data.per_page) : 0), [data]);
  const setPage = (p: number) => { const next = new URLSearchParams(searchParams); if (p <= 1) next.delete('page'); else next.set('page', String(p)); setSearchParams(next); window.scrollTo({ top: 0 }); };
  const applyFilters = (next: FilterState) => { setFilters(next); const sp = new URLSearchParams(searchParams); sp.delete('page'); setSearchParams(sp, { replace: true }); };
  const changeView = (v: 'grid' | 'list') => { setView(v); localStorage.setItem('et_view', v); };

  if (notFound) return (<div className="py-20 text-center"><Seo title="Категория не найдена" /><h1 className="mb-2 text-2xl font-bold">Такой категории нет</h1><p className="mb-6 text-muted">Возможно, ссылка устарела. Каталог доступен с главной страницы.</p><Link to="/" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]">Перейти в каталог</Link></div>);

  const filtersPanel = <Filters facets={facets} priceBounds={priceBounds} value={filters} onChange={applyFilters} onReset={() => applyFilters(EMPTY_FILTERS)} />;

  return (
    <div>
      <Seo title={category ? `${category.name} — купить в интернет-магазине` : 'Каталог'} description={category ? `${category.name}: ${category.product_count} позиций в наличии. Цены обновляются ежедневно, доставка транспортными компаниями, счёт для юрлиц.` : undefined} />
      <nav aria-label="Хлебные крошки" className="mb-3 text-sm text-muted"><Link to="/" className="hover:text-circuit">Главная</Link><span className="mx-1.5">/</span><span className="text-ink">{category?.name ?? '…'}</span></nav>
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1"><h1 className="text-2xl font-bold">{category?.name ?? 'Каталог'}</h1>{data && <p className="font-mono text-sm text-muted">{data.total} поз.</p>}</div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setMobileFiltersOpen(true)} className="inline-flex h-9 items-center gap-2 rounded border border-line bg-surface px-3 text-sm font-medium lg:hidden"><SlidersHorizontal size={15} />Фильтры</button>
        <label className="flex items-center gap-2 text-sm text-muted"><span className="hidden sm:inline">Сортировка:</span><select value={sort} onChange={(e) => { const sp = new URLSearchParams(searchParams); sp.set('sort', e.target.value); sp.delete('page'); setSearchParams(sp); }} className="h-9 rounded border border-line bg-surface px-2 text-sm text-ink">{SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
        <div className="ml-auto flex items-center rounded border border-line bg-surface p-0.5" role="radiogroup" aria-label="Вид списка">
          <button type="button" role="radio" aria-checked={view === 'grid'} aria-label="Плитка" onClick={() => changeView('grid')} className={`flex h-8 w-8 items-center justify-center rounded ${view === 'grid' ? 'bg-circuit/15 text-circuit' : 'text-muted'}`}><LayoutGrid size={16} /></button>
          <button type="button" role="radio" aria-checked={view === 'list'} aria-label="Список" onClick={() => changeView('list')} className={`flex h-8 w-8 items-center justify-center rounded ${view === 'list' ? 'bg-circuit/15 text-circuit' : 'text-muted'}`}><List size={16} /></button>
        </div>
      </div>
      <div className="flex gap-6">
        <aside className="hidden w-64 shrink-0 lg:block" aria-label="Фильтры"><div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg border border-line bg-surface p-4">{filtersPanel}</div></aside>
        <div className="min-w-0 flex-1">
          {loading ? (<div className={view === 'grid' ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4' : 'space-y-3'}>{Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} view={view} />)}</div>) : data && data.items.length > 0 ? (
            <>
              <div className={view === 'grid' ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4' : 'space-y-3'}>{data.items.map((p) => <ProductCard key={p.id} product={p} view={view} />)}</div>
              {totalPages > 1 && (
                <nav aria-label="Пагинация" className="mt-6 flex items-center justify-center gap-1.5">
                  <button type="button" onClick={() => setPage(page - 1)} disabled={page <= 1} aria-label="Предыдущая страница" className="flex h-9 w-9 items-center justify-center rounded border border-line bg-surface disabled:opacity-40"><ChevronLeft size={16} /></button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2).reduce<(number | '…')[]>((acc, p, i, arr) => { if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('…'); acc.push(p); return acc; }, []).map((p, i) => p === '…' ? <span key={`gap-${i}`} className="px-1 text-muted">…</span> : <button key={p} type="button" onClick={() => setPage(p)} aria-current={p === page ? 'page' : undefined} className={`h-9 min-w-[2.25rem] rounded border px-2 font-mono text-sm ${p === page ? 'border-circuit bg-circuit text-white' : 'border-line bg-surface hover:border-circuit'}`}>{p}</button>)}
                  <button type="button" onClick={() => setPage(page + 1)} disabled={page >= totalPages} aria-label="Следующая страница" className="flex h-9 w-9 items-center justify-center rounded border border-line bg-surface disabled:opacity-40"><ChevronRight size={16} /></button>
                </nav>
              )}
            </>
          ) : (<div className="rounded-lg border border-line bg-surface p-10 text-center"><p className="mb-2 font-medium">По выбранным фильтрам ничего не найдено.</p><p className="mb-4 text-sm text-muted">Попробуйте изменить или сбросить фильтры.</p><button type="button" onClick={() => applyFilters(EMPTY_FILTERS)} className="rounded border border-line bg-paper px-4 py-2 text-sm font-medium hover:border-circuit">Сбросить фильтры</button></div>)}
        </div>
      </div>
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Фильтры">
          <button type="button" aria-label="Закрыть фильтры" className="absolute inset-0 bg-ink/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface p-4 pb-8">
            <div className="mb-2 flex items-center justify-between"><span className="mx-auto h-1 w-10 rounded-full bg-line" aria-hidden /></div>
            <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">Фильтры</h2><button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Закрыть" className="flex h-9 w-9 items-center justify-center rounded text-muted"><X size={18} /></button></div>
            {filtersPanel}
            <button type="button" onClick={() => setMobileFiltersOpen(false)} className="mt-4 w-full rounded bg-signal py-3 text-sm font-semibold text-[#1B1F24]">Показать {data?.total ?? 0} товаров</button>
          </div>
        </div>
      )}
    </div>
  );
}
