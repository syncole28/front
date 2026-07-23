import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ShoppingCart, Trash2 } from 'lucide-react';
import * as api from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import { formatPrice, productPath } from '@/lib/format';
import { QtyStepper } from '@/components/ui/QtyStepper';
import { StockBadge } from '@/components/ui/StockBadge';
import { BulkOrder } from '@/components/cart/BulkOrder';
import { Seo } from '@/components/ui/Seo';

export function CartPage() {
  const { cart, setCartQty, removeFromCart, clearCart, cartTotal, cartCount } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoiceBusy, setInvoiceBusy] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [invoiceError, setInvoiceError] = useState('');

  const getInvoice = async () => {
    if (invoiceBusy || !cart.length) return; setInvoiceBusy(true); setInvoiceError('');
    try { const { pdf_url } = await api.createInvoice(cart.map((l) => ({ product_id: l.product.id, qty: l.qty })), user?.company ? { org_name: user.company.org_name, inn: user.company.inn } : { name: user?.name ?? 'Гость' }); setInvoiceUrl(pdf_url); } catch { setInvoiceError('Не удалось сформировать счёт. Попробуйте ещё раз.'); } finally { setInvoiceBusy(false); }
  };

  if (!cart.length) return (<div><Seo title="Корзина" /><h1 className="mb-4 text-2xl font-bold">Корзина</h1><div className="mb-4 rounded-lg border border-line bg-surface p-10 text-center"><ShoppingCart size={28} className="mx-auto mb-3 text-muted" /><p className="mb-1 font-medium">Корзина пуста.</p><p className="mb-4 text-sm text-muted">Добавьте товары из каталога или соберите корзину по списку артикулов ниже.</p><Link to="/" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]">Перейти в каталог</Link></div><BulkOrder /></div>);

  return (
    <div>
      <Seo title="Корзина" />
      <div className="mb-4 flex items-baseline justify-between"><h1 className="text-2xl font-bold">Корзина</h1><button type="button" onClick={clearCart} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fault"><Trash2 size={14} />Очистить корзину</button></div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          {cart.map(({ product, qty }) => (
            <article key={product.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface p-3 sm:flex-nowrap sm:gap-4">
              <Link to={productPath(product.id, product.name)} className="block h-20 w-20 shrink-0 overflow-hidden rounded bg-paper"><img src={product.image} alt={product.name} className="h-full w-full object-cover" /></Link>
              <div className="min-w-0 flex-1"><Link to={productPath(product.id, product.name)} className="line-clamp-2 text-sm font-medium hover:text-circuit">{product.name}</Link><p className="mt-0.5 font-mono text-xs text-muted">Арт. {product.sku}</p><StockBadge count={product.stock_count} className="mt-1" /></div>
              <QtyStepper size="sm" value={qty} onChange={(q) => setCartQty(product.id, q)} />
              <p className="w-28 text-right font-mono text-base font-medium">{formatPrice(product.price * qty)}</p>
              <button type="button" onClick={() => removeFromCart(product.id)} aria-label={`Удалить ${product.name} из корзины`} className="flex h-9 w-9 items-center justify-center rounded text-muted hover:text-fault"><Trash2 size={16} /></button>
            </article>
          ))}
          <BulkOrder />
        </div>
        <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:w-80" aria-label="Итог корзины">
          <div className="rounded-lg border border-line bg-surface p-4">
            <div className="mb-1 flex items-baseline justify-between text-sm text-muted"><span>Товаров</span><span className="font-mono">{cartCount} шт.</span></div>
            <div className="mb-4 flex items-baseline justify-between"><span className="font-semibold">Итого</span><span className="font-mono text-2xl font-medium">{formatPrice(cartTotal)}</span></div>
            <p className="mb-3 text-xs text-muted">Доставка рассчитывается при оформлении заказа.</p>
            <button type="button" onClick={() => navigate('/checkout')} className="mb-2 w-full rounded bg-signal py-3 text-sm font-semibold text-[#1B1F24] transition-transform duration-150 hover:-translate-y-px">Оформить заказ</button>
            <button type="button" onClick={getInvoice} disabled={invoiceBusy} className="inline-flex w-full items-center justify-center gap-2 rounded border border-circuit py-3 text-sm font-semibold text-circuit transition-colors hover:bg-circuit/10 disabled:opacity-60"><FileText size={16} />{invoiceBusy ? 'Формируем счёт…' : 'Получить счёт на оплату PDF'}</button>
            {invoiceUrl && <p className="mt-3 rounded border border-breaker/40 bg-breaker/10 p-2.5 text-xs">Счёт сформирован. <a href={invoiceUrl} target="_blank" rel="noreferrer" className="font-medium text-circuit underline">Открыть PDF</a> Оплатите по реквизитам из счёта — заказ можно оформить позже.</p>}
            {invoiceError && <p className="mt-3 text-xs text-fault">{invoiceError}</p>}
            <p className="mt-3 text-xs text-muted">Счёт доступен без оформления заказа — удобно для безналичной оплаты юрлицами.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
