import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ProductListItem } from '@/api/types';

export interface CartLine { product: ProductListItem; qty: number; }

interface ShopContextValue {
  cart: CartLine[]; addToCart: (product: ProductListItem, qty?: number) => void;
  setCartQty: (productId: number, qty: number) => void; removeFromCart: (productId: number) => void; clearCart: () => void;
  cartCount: number; cartTotal: number;
  favorites: number[]; toggleFavorite: (id: number) => void;
  compare: number[]; toggleCompare: (id: number) => void;
  recentlyViewed: number[]; markViewed: (id: number) => void;
}
const ShopContext = createContext<ShopContextValue | null>(null);

function usePersistedState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}

const COMPARE_LIMIT = 4;

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersistedState<CartLine[]>('et_cart', []);
  const [favorites, setFavorites] = usePersistedState<number[]>('et_favorites', []);
  const [compare, setCompare] = usePersistedState<number[]>('et_compare', []);
  const [recentlyViewed, setRecentlyViewed] = usePersistedState<number[]>('et_recent', []);

  const addToCart = useCallback((product: ProductListItem, qty = 1) => {
    setCart((prev) => { const ex = prev.find((l) => l.product.id === product.id); if (ex) return prev.map((l) => l.product.id === product.id ? { ...l, qty: l.qty + qty } : l); return [...prev, { product, qty }]; });
  }, [setCart]);
  const setCartQty = useCallback((productId: number, qty: number) => {
    setCart((prev) => qty <= 0 ? prev.filter((l) => l.product.id !== productId) : prev.map((l) => l.product.id === productId ? { ...l, qty } : l));
  }, [setCart]);
  const removeFromCart = useCallback((productId: number) => setCart((prev) => prev.filter((l) => l.product.id !== productId)), [setCart]);
  const clearCart = useCallback(() => setCart([]), [setCart]);
  const toggleFavorite = useCallback((id: number) => setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]), [setFavorites]);
  const toggleCompare = useCallback((id: number) => setCompare((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev.slice(-(COMPARE_LIMIT - 1)), id]), [setCompare]);
  const markViewed = useCallback((id: number) => setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 12)), [setRecentlyViewed]);

  const value = useMemo<ShopContextValue>(() => ({
    cart, addToCart, setCartQty, removeFromCart, clearCart,
    cartCount: cart.reduce((s, l) => s + l.qty, 0), cartTotal: cart.reduce((s, l) => s + l.product.price * l.qty, 0),
    favorites, toggleFavorite, compare, toggleCompare, recentlyViewed, markViewed,
  }), [cart, favorites, compare, recentlyViewed, addToCart, setCartQty, removeFromCart, clearCart, toggleFavorite, toggleCompare, markViewed]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() { const ctx = useContext(ShopContext); if (!ctx) throw new Error('useShop must be used within ShopProvider'); return ctx; }
