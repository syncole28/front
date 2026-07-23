import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, GitCompare, Heart, Menu, Monitor, Moon, ScanBarcode, Search, ShoppingCart, Sun, User, X, Zap } from 'lucide-react';
import * as api from '@/api/client';
import type { Category } from '@/api/types';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import { useTheme, type ThemeMode } from '@/context/ThemeContext';
import { productPath } from '@/lib/format';

const THEME_OPTIONS: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
  { mode: 'light', icon: Sun, label: 'Светлая тема' },
  { mode: 'system', icon: Monitor, label: 'Системная тема' },
  { mode: 'dark', icon: Moon, label: 'Тёмная тема' },
];

function ThemeSwitcher() {
  const { mode, setMode } = useTheme();
  return (
    <div className="flex items-center rounded border border-line p-0.5" role="radiogroup" aria-label="Тема оформления">
      {THEME_OPTIONS.map(({ mode: m, icon: Icon, label }) => (
        <button key={m} type="button" role="radio" aria-checked={mode === m} aria-label={label} title={label} onClick={() => setMode(m)} className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${mode === m ? 'bg-circuit/15 text-circuit' : 'text-muted hover:text-ink'}`}><Icon size={14} /></button>
      ))}
    </div>
  );
}

function SkuQuickOrder() {
  const [open, setOpen] = useState(false);
  const [sku, setSku] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!open) return; const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }; document.addEventListener('mousedown', onClick); return () => document.removeEventListener('mousedown', onClick); }, [open]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!sku.trim() || busy) return; setBusy(true); setError('');
    try { const found = await api.findProductBySku(sku); if (found) { setOpen(false); setSku(''); navigate(productPath(found.id, found.name)); } else setError(`Товар с артикулом «${sku.trim()}» не найден`); } finally { setBusy(false); }
  };
  return (
    <div className="relative hidden lg:block" ref={ref}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex h-9 items-center gap-2 rounded border border-line px-3 text-sm text-muted transition-colors hover:text-ink"><ScanBarcode size={16} />По артикулу</button>
      {open && (
        <form onSubmit={submit} className="absolute right-0 top-11 z-40 w-72 rounded-lg border border-line bg-surface p-3 shadow-lg">
          <label htmlFor="sku-quick" className="mb-1.5 block text-xs font-medium text-muted">Быстрый заказ по артикулу</label>
          <div className="flex gap-2">
            <input id="sku-quick" autoFocus value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Например, ET-011024" className="h-9 flex-1 rounded border border-line bg-paper px-2 font-mono text-sm placeholder:text-muted/60" />
            <button type="submit" disabled={busy} className="h-9 rounded bg-signal px-3 text-sm font-semibold text-[#1B1F24] disabled:opacity-60">{busy ? '...' : 'Найти'}</button>
          </div>
          {error && <p className="mt-2 text-xs text-fault">{error}</p>}
        </form>
      )}
    </div>
  );
}

export function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { cartCount } = useShop();
  const { user } = useAuth();
  const catalogRef = useRef<HTMLDivElement>(null);
  useEffect(() => { api.getCategories().then(setCategories).catch(() => setCategories([])); }, []);
  useEffect(() => {
    if (!catalogOpen) return;
    const onClick = (e: MouseEvent) => { if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) setCatalogOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCatalogOpen(false);
    document.addEventListener('mousedown', onClick); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [catalogOpen]);
  const submitSearch = (e: React.FormEvent) => { e.preventDefault(); if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`); };
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="ЭлектроТорг — на главную"><span className="flex h-9 w-9 items-center justify-center rounded bg-signal text-[#1B1F24]"><Zap size={20} strokeWidth={2.5} /></span><span className="hidden font-display text-lg font-bold tracking-tight sm:block">Электро<span className="text-circuit">Торг</span></span></Link>
        <div className="relative" ref={catalogRef}>
          <button type="button" onClick={() => setCatalogOpen((v) => !v)} aria-expanded={catalogOpen} className="inline-flex h-10 items-center gap-2 rounded bg-circuit px-3 text-sm font-semibold text-white transition-colors hover:bg-circuit/90 lg:px-4">{catalogOpen ? <X size={17} /> : <Menu size={17} />}<span className="hidden sm:inline">Каталог</span><ChevronDown size={14} className={`transition-transform ${catalogOpen ? 'rotate-180' : ''}`} /></button>
          {catalogOpen && (
            <nav aria-label="Категории каталога" className="absolute left-0 top-12 z-40 max-h-[70vh] w-[19rem] overflow-y-auto rounded-lg border border-line bg-surface py-2 shadow-xl">
              {categories.map((c) => (<Link key={c.id} to={`/catalog/${c.slug}`} onClick={() => setCatalogOpen(false)} className="flex items-baseline justify-between gap-2 px-4 py-2 text-sm transition-colors hover:bg-paper hover:text-circuit">{c.name}<span className="font-mono text-xs text-muted">{c.product_count}</span></Link>))}
            </nav>
          )}
        </div>
        <form onSubmit={submitSearch} className="relative min-w-0 flex-1" role="search">
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по названию, артикулу, производителю" aria-label="Поиск по каталогу" className="h-10 w-full rounded border border-line bg-paper pl-3 pr-10 text-sm placeholder:text-muted/70" />
          <button type="submit" aria-label="Найти" className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-ink"><Search size={17} /></button>
        </form>
        <SkuQuickOrder />
        <div className="hidden md:block"><ThemeSwitcher /></div>
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Быстрые действия">
          <NavLink to="/favorites" className="flex h-10 w-10 items-center justify-center rounded text-muted transition-colors hover:text-ink" aria-label="Избранное"><Heart size={19} /></NavLink>
          <NavLink to="/compare" className="flex h-10 w-10 items-center justify-center rounded text-muted transition-colors hover:text-ink" aria-label="Сравнение"><GitCompare size={19} /></NavLink>
          <NavLink to={user ? '/account' : '/login'} className="flex h-10 w-10 items-center justify-center rounded text-muted transition-colors hover:text-ink" aria-label={user ? 'Личный кабинет' : 'Войти'}><User size={19} /></NavLink>
        </nav>
        <Link to="/cart" className="relative flex h-10 items-center gap-2 rounded border border-line px-3 text-sm font-medium transition-colors hover:border-signal" aria-label={`Корзина, товаров: ${cartCount}`}><ShoppingCart size={18} /><span className="hidden lg:inline">Корзина</span>{cartCount > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-signal px-1 font-mono text-[11px] font-semibold text-[#1B1F24]">{cartCount}</span>}</Link>
      </div>
    </header>
  );
}
