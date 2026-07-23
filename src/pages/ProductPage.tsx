import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GitCompare, Heart, ShoppingCart, ZoomIn } from 'lucide-react';
import * as api from '@/api/client';
import type { ProductDetail, ProductListItem } from '@/api/types';
import { useShop } from '@/context/ShopContext';
import { formatPrice } from '@/lib/format';
import { Nameplate } from '@/components/ui/Nameplate';
import { StockBadge } from '@/components/ui/StockBadge';
import { QtyStepper } from '@/components/ui/QtyStepper';
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard';
import { Seo } from '@/components/ui/Seo';

function Gallery({ product }: { product: ProductDetail }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => setActive(0), [product.id]);
  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-line bg-surface">
        <button type="button" onClick={() => setZoomed(true)} className="group block aspect-square w-full cursor-zoom-in" aria-label="Увеличить фото"><img src={product.images[active]} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /></button>
        <Nameplate sku={product.sku} className="absolute left-3 top-3" />
        <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded bg-surface/80 text-muted"><ZoomIn size={16} /></span>
      </div>
      <div className="mt-3 flex gap-2">{product.images.map((img, i) => (<button key={i} type="button" onClick={() => setActive(i)} aria-label={`Фото ${i + 1}`} aria-current={i === active} className={`h-16 w-16 overflow-hidden rounded border transition-colors ${i === active ? 'border-circuit' : 'border-line hover:border-muted'}`}><img src={img} alt="" className="h-full w-full object-cover" /></button>))}</div>
      {zoomed && (<div role="dialog" aria-modal="true" aria-label="Фото товара" className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-ink/80 p-4" onClick={() => setZoomed(false)}><img src={product.images[active]} alt={product.name} className="max-h-full max-w-full rounded object-contain" /></div>)}
    </div>
  );
}

function RecentlyViewed({ excludeId }: { excludeId: number }) {
  const { recentlyViewed } = useShop();
  const [items, setItems] = useState<ProductListItem[]>([]);
  const ids = useMemo(() => recentlyViewed.filter((id) => id !== excludeId).slice(0, 6), [recentlyViewed, excludeId]);
  useEffect(() => { if (!ids.length) return; api.getProductsByIds(ids).then((list) => setItems(ids.map((id) => list.find((p) => p.id === id)).filter((p): p is ProductDetail => Boolean(p)).map((p) => ({ id: p.id, sku: p.sku, name: p.name, price: p.price, stock_count: p.stock_count, image: p.images[0], category_slug: p.category.slug })))); }, [ids]);
  if (!items.length) return null;
  return (<section aria-labelledby="recent-heading" className="mt-12"><h2 id="recent-heading" className="mb-4 text-xl font-bold">Недавно просмотренные</h2><div className="flex gap-3 overflow-x-auto pb-2">{items.map((p) => (<div key={p.id} className="w-56 shrink-0"><ProductCard product={p} /></div>))}</div></section>);
}

export function ProductPage() {
  const { idSlug = '' } = useParams();
  const id = parseInt(idSlug, 10);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated] = useState<ProductListItem[] | null>(null);
  const { cart, addToCart, setCartQty, favorites, toggleFavorite, compare, toggleCompare, markViewed } = useShop();

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    setProduct(null); setNotFound(false); setRelated(null);
    api.getProduct(id).then((p) => { if (!p) { setNotFound(true); return; } setProduct(p); markViewed(p.id); });
    api.getRelatedProducts(id, 4).then(setRelated).catch(() => setRelated([]));
  }, [id, markViewed]);

  if (notFound) return (<div className="py-20 text-center"><Seo title="Товар не найден" /><h1 className="mb-2 text-2xl font-bold">Товар не найден</h1><p className="mb-6 text-muted">Возможно, позиция снята с продажи или ссылка устарела.</p><Link to="/" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]">Перейти в каталог</Link></div>);
  if (!product) return (<div className="grid gap-8 lg:grid-cols-2"><div className="skeleton aspect-square" /><div className="space-y-3"><div className="skeleton h-8 w-3/4" /><div className="skeleton h-5 w-40" /><div className="skeleton h-10 w-48" /><div className="skeleton h-40 w-full" /></div></div>);

  const inCart = cart.find((l) => l.product.id === product.id);
  const isFav = favorites.includes(product.id);
  const isCompared = compare.includes(product.id);
  const listItem: ProductListItem = { id: product.id, sku: product.sku, name: product.name, price: product.price, stock_count: product.stock_count, image: product.images[0], category_slug: product.category.slug };

  return (
    <div>
      <Seo title={`${product.name} — купить, цена ${formatPrice(product.price)}`} description={`${product.name}, артикул ${product.sku}. ${product.description.slice(0, 140)}`} />
      <nav aria-label="Хлебные крошки" className="mb-4 text-sm text-muted"><Link to="/" className="hover:text-circuit">Главная</Link><span className="mx-1.5">/</span><Link to={`/catalog/${product.category.slug}`} className="hover:text-circuit">{product.category.name}</Link><span className="mx-1.5">/</span><span className="text-ink">{product.name}</span></nav>
      <div className="grid gap-8 lg:grid-cols-2">
        <Gallery product={product} />
        <div>
          <h1 className="mb-2 text-2xl font-bold leading-tight">{product.name}</h1>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted"><span className="font-mono">Арт. {product.sku}</span><span>Производитель: {product.vendor}</span><span>Склад: {product.warehouse.city}</span></div>
          <div className="mb-4 rounded-lg border border-line bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-3xl font-medium">{formatPrice(product.price)}</p><StockBadge count={product.stock_count} /></div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {inCart ? (<><QtyStepper value={inCart.qty} onChange={(q) => setCartQty(product.id, q)} /><Link to="/cart" className="inline-flex h-10 items-center rounded border border-line px-4 text-sm font-medium hover:border-circuit">Перейти в корзину</Link></>) : (<button type="button" onClick={() => addToCart(listItem)} className="inline-flex h-11 items-center gap-2 rounded bg-signal px-5 text-sm font-semibold text-[#1B1F24] transition-transform duration-150 hover:-translate-y-px"><ShoppingCart size={17} />Добавить в корзину</button>)}
              <button type="button" onClick={() => toggleFavorite(product.id)} aria-pressed={isFav} className={`inline-flex h-11 items-center gap-2 rounded border border-line px-3 text-sm font-medium transition-colors ${isFav ? 'text-fault' : 'text-muted hover:text-ink'}`}><Heart size={17} fill={isFav ? 'currentColor' : 'none'} />{isFav ? 'В избранном' : 'В избранное'}</button>
              <button type="button" onClick={() => toggleCompare(product.id)} aria-pressed={isCompared} className={`inline-flex h-11 items-center gap-2 rounded border border-line px-3 text-sm font-medium transition-colors ${isCompared ? 'text-circuit' : 'text-muted hover:text-ink'}`}><GitCompare size={17} />{isCompared ? 'В сравнении' : 'Сравнить'}</button>
            </div>
          </div>
          <div className="mb-4 rounded-lg border border-line bg-surface p-4">
            <h2 className="mb-2 text-sm font-semibold">Цена зависит от объёма</h2>
            <table className="w-full text-sm"><tbody>
              <tr className="border-b border-line"><td className="py-1.5 text-muted">От 1 шт.</td><td className="py-1.5 text-right font-mono">{formatPrice(product.price)}</td></tr>
              {product.volume_prices.map((vp) => (<tr key={vp.min_qty} className="border-b border-line last:border-0"><td className="py-1.5 text-muted">От {vp.min_qty} шт.</td><td className="py-1.5 text-right font-mono text-breaker">{formatPrice(vp.price)}</td></tr>))}
            </tbody></table>
            <p className="mt-2 text-xs text-muted">Оптовые цены действуют для юрлиц и применяются автоматически при оформлении.</p>
          </div>
          <section aria-labelledby="params-heading"><h2 id="params-heading" className="mb-2 text-lg font-bold">Характеристики</h2><table className="w-full text-sm"><tbody>
            {product.params.map((p) => (<tr key={p.name} className="border-b border-line"><td className="py-2 pr-4 text-muted">{p.name}</td><td className="py-2 font-mono">{p.value}{p.unit ? ` ${p.unit}` : ''}</td></tr>))}
            <tr className="border-b border-line"><td className="py-2 pr-4 text-muted">Вес</td><td className="py-2 font-mono">{product.weight} кг</td></tr>
            <tr><td className="py-2 pr-4 text-muted">Габариты (ДxШxВ)</td><td className="py-2 font-mono">{product.dimensions.l}x{product.dimensions.w}x{product.dimensions.h} мм</td></tr>
          </tbody></table></section>
          <section aria-labelledby="desc-heading" className="mt-6"><h2 id="desc-heading" className="mb-2 text-lg font-bold">Описание</h2><p className="text-sm leading-relaxed text-muted">{product.description}</p></section>
        </div>
      </div>
      <section aria-labelledby="related-heading" className="mt-12"><h2 id="related-heading" className="mb-4 text-xl font-bold">С этим товаром покупают</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{!related ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) : related.map((p) => <ProductCard key={p.id} product={p} />)}</div></section>
      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}
