import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import * as api from '@/api/client';
import type { ProductListItem } from '@/api/types';
import { useShop } from '@/context/ShopContext';
import { toListItem } from '@/api/client';
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard';
import { Seo } from '@/components/ui/Seo';

export function FavoritesPage() {
  const { favorites } = useShop();
  const [items, setItems] = useState<ProductListItem[] | null>(null);
  useEffect(() => { if (!favorites.length) { setItems([]); return; } api.getProductsByIds(favorites).then((list) => setItems(list.map(toListItem))).catch(() => setItems([])); }, [favorites]);
  return (
    <div>
      <Seo title="Избранное" />
      <h1 className="mb-4 text-2xl font-bold">Избранное</h1>
      {!items ? (<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>) : items.length > 0 ? (<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>) : (
        <div className="rounded-lg border border-line bg-surface p-10 text-center"><Heart size={28} className="mx-auto mb-3 text-muted" /><p className="mb-1 font-medium">В избранном пока пусто.</p><p className="mb-4 text-sm text-muted">Добавляйте товары по значку сердца на карточке — они сохранятся здесь.</p><Link to="/" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]">Перейти в каталог</Link></div>
      )}
    </div>
  );
}
