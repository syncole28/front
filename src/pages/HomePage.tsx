import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Cable, Fan, Gauge, Home, Layers, Lightbulb, Link2, PanelTop, Percent, Plug, RefreshCcw, Route, ShieldCheck, Thermometer, ToggleRight, Truck, Wrench, Zap, type LucideIcon } from 'lucide-react';
import * as api from '@/api/client';
import type { Category, ProductListItem } from '@/api/types';
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard';
import { Seo } from '@/components/ui/Seo';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'kabeli-i-provoda': Cable, 'rozetki-i-vyklyuchateli': Plug, osveshchenie: Lightbulb,
  'avtomaticheskie-vyklyuchateli': ToggleRight, 'uzo-i-difavtomaty': ShieldCheck,
  'shchity-i-boksy': PanelTop, 'kontaktory-i-rele': Zap, 'klemmy-i-soediniteli': Link2,
  'kabel-kanaly-i-gofra': Route, instrument: Wrench, 'izmeritelnye-pribory': Gauge,
  'krepezh-i-metizy': Layers, ventilyatsiya: Fan, 'teplyy-pol': Thermometer, 'umnyy-dom': Home,
};

const ADVANTAGES = [
  { icon: RefreshCcw, title: 'Цены и наличие — ежедневно', text: 'Остатки склада синхронизируются с сайтом каждый день. Что видите — то и отгрузим.' },
  { icon: Truck, title: 'Доставка транспортными компаниями', text: 'Деловые Линии, СДЭК, ПЭК — расчёт стоимости и срока прямо при оформлении.' },
  { icon: Building2, title: 'Работаем с юрлицами', text: 'Счёт на оплату прямо из корзины, реквизиты в кабинете, заказ по списку артикулов.' },
];

export function HomePage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [popular, setPopular] = useState<ProductListItem[] | null>(null);
  useEffect(() => { api.getCategories().then(setCategories).catch(() => setCategories([])); api.getPopularProducts(8).then(setPopular).catch(() => setPopular([])); }, []);
  return (
    <div className="space-y-12">
      <Seo title="Электротехника и промышленное оборудование" description="Интернет-магазин электротехнической продукции: кабели, автоматика, освещение, инструмент. 18 500+ позиций, работа с юрлицами, счёт из корзины." />
      <section aria-labelledby="home-categories">
        <div className="mb-4 flex items-baseline justify-between"><h1 id="home-categories" className="text-2xl font-bold">Каталог электротехники</h1><p className="hidden font-mono text-sm text-muted sm:block">18 500+ SKU</p></div>
        {!categories ? (<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 15 }).map((_, i) => <div key={i} className="skeleton h-24" />)}</div>) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => { const Icon = CATEGORY_ICONS[c.slug] ?? Zap; return (
              <Link key={c.id} to={`/catalog/${c.slug}`} className="group flex flex-col gap-2 rounded-lg border border-line bg-surface p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-circuit"><Icon size={22} className="text-circuit" /><span className="text-sm font-medium leading-snug">{c.name}</span><span className="mt-auto font-mono text-xs text-muted">{c.product_count} поз.</span></Link>
            ); })}
          </div>
        )}
      </section>
      <section aria-labelledby="home-popular">
        <h2 id="home-popular" className="mb-4 text-xl font-bold">Хиты продаж</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{!popular ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />) : popular.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>
      <section aria-label="Акция" className="flex flex-col items-start gap-3 rounded-lg border border-signal/50 bg-signal/10 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-signal text-[#1B1F24]"><Percent size={22} /></span><div><h2 className="text-lg font-bold">Оптовые цены для юрлиц</h2><p className="text-sm text-muted">Скидка до 10% при заказе от 200 единиц одной позиции — цены видны на карточке товара.</p></div></div>
        <Link to="/register" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24] transition-transform duration-150 hover:-translate-y-px">Зарегистрировать юрлицо</Link>
      </section>
      <section aria-label="Преимущества" className="grid gap-3 sm:grid-cols-3">
        {ADVANTAGES.map(({ icon: Icon, title, text }) => (<div key={title} className="rounded-lg border border-line bg-surface p-5"><Icon size={22} className="mb-3 text-circuit" /><h3 className="mb-1.5 text-base font-semibold">{title}</h3><p className="text-sm text-muted">{text}</p></div>))}
      </section>
    </div>
  );
}
