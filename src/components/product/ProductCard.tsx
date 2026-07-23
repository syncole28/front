import { Link } from 'react-router-dom';
import { GitCompare, Heart, ShoppingCart } from 'lucide-react';
import type { ProductListItem } from '@/api/types';
import { useShop } from '@/context/ShopContext';
import { formatPrice, productPath } from '@/lib/format';
import { Nameplate } from '@/components/ui/Nameplate';
import { StockBadge } from '@/components/ui/StockBadge';
import { QtyStepper } from '@/components/ui/QtyStepper';

interface ProductCardProps { product: ProductListItem; view?: 'grid' | 'list'; }

export function ProductCard({ product, view = 'grid' }: ProductCardProps) {
  const { cart, addToCart, setCartQty, favorites, toggleFavorite, compare, toggleCompare } = useShop();
  const inCart = cart.find((l) => l.product.id === product.id);
  const isFav = favorites.includes(product.id);
  const isCompared = compare.includes(product.id);
  const href = productPath(product.id, product.name);

  const actions = (
    <div className="flex items-center gap-1">
      <button type="button" aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'} aria-pressed={isFav} onClick={() => toggleFavorite(product.id)} className={`flex h-9 w-9 items-center justify-center rounded transition-colors ${isFav ? 'text-fault' : 'text-muted hover:text-ink'}`}><Heart size={18} fill={isFav ? 'currentColor' : 'none'} /></button>
      <button type="button" aria-label={isCompared ? 'Убрать из сравнения' : 'Добавить к сравнению'} aria-pressed={isCompared} onClick={() => toggleCompare(product.id)} className={`flex h-9 w-9 items-center justify-center rounded transition-colors ${isCompared ? 'text-circuit' : 'text-muted hover:text-ink'}`}><GitCompare size={18} /></button>
    </div>
  );

  const cartControl = inCart ? <QtyStepper size="sm" value={inCart.qty} onChange={(q) => setCartQty(product.id, q)} /> : (
    <button type="button" onClick={() => addToCart(product)} className="inline-flex h-9 items-center gap-2 rounded bg-signal px-3 text-sm font-semibold text-[#1B1F24] transition-transform duration-150 hover:-translate-y-px"><ShoppingCart size={16} />В корзину</button>
  );

  if (view === 'list') {
    return (
      <article className="flex gap-4 rounded-lg border border-line bg-surface p-4 transition-transform duration-150 hover:-translate-y-0.5">
        <Link to={href} className="relative block h-28 w-28 shrink-0 overflow-hidden rounded bg-paper"><img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" /></Link>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5"><Nameplate sku={product.sku} className="self-start" /><Link to={href} className="font-medium leading-snug hover:text-circuit">{product.name}</Link><StockBadge count={product.stock_count} /></div>
        <div className="flex flex-col items-end justify-between gap-2"><p className="font-mono text-lg font-medium">{formatPrice(product.price)}</p><div className="flex items-center gap-2">{actions}{cartControl}</div></div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col rounded-lg border border-line bg-surface transition-transform duration-150 hover:-translate-y-0.5">
      <Link to={href} className="relative block aspect-square overflow-hidden rounded-t-lg bg-paper"><img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" /><Nameplate sku={product.sku} className="absolute left-2 top-2" /></Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link to={href} className="line-clamp-2 min-h-[2.6em] text-sm font-medium leading-snug hover:text-circuit">{product.name}</Link>
        <StockBadge count={product.stock_count} />
        <div className="mt-auto flex items-center justify-between gap-2 pt-1"><p className="font-mono text-lg font-medium">{formatPrice(product.price)}</p>{actions}</div>
        {cartControl}
      </div>
    </article>
  );
}

export function ProductCardSkeleton({ view = 'grid' }: { view?: 'grid' | 'list' }) {
  if (view === 'list') return (<div className="flex gap-4 rounded-lg border border-line bg-surface p-4"><div className="skeleton h-28 w-28 shrink-0" /><div className="flex-1 space-y-2 py-1"><div className="skeleton h-4 w-24" /><div className="skeleton h-4 w-3/4" /><div className="skeleton h-4 w-32" /></div><div className="skeleton h-6 w-24" /></div>);
  return (<div className="flex flex-col rounded-lg border border-line bg-surface"><div className="skeleton aspect-square rounded-b-none" /><div className="space-y-2 p-3"><div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-2/3" /><div className="skeleton h-6 w-24" /><div className="skeleton h-9 w-full" /></div></div>);
}
