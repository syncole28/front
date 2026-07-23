import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, PackageCheck } from 'lucide-react';
import * as api from '@/api/client';
import type { Order } from '@/api/types';
import { formatDate, formatPrice, productPath } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';

export function OrderPage() {
  const { id = '' } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => { const orderId = parseInt(id, 10); if (!orderId) { setNotFound(true); return; } api.getOrder(orderId).then((o) => { if (o) setOrder(o); else setNotFound(true); }); }, [id]);

  if (notFound) return (<div className="py-20 text-center"><Seo title="Заказ не найден" /><h1 className="mb-2 text-2xl font-bold">Заказ не найден</h1><p className="mb-6 text-muted">Проверьте номер заказа в личном кабинете.</p><Link to="/account/orders" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]">Мои заказы</Link></div>);
  if (!order) return (<div className="space-y-4"><div className="skeleton h-8 w-64" /><div className="skeleton h-32 w-full" /><div className="skeleton h-48 w-full" /></div>);

  const currentIdx = api.ORDER_STATUS_FLOW.indexOf(order.status);
  return (
    <div className="mx-auto max-w-3xl">
      <Seo title={`Заказ ${order.number}`} />
      <div className="mb-6 flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-breaker/15 text-breaker"><PackageCheck size={22} /></span><div><h1 className="text-2xl font-bold">Заказ <span className="font-mono">{order.number}</span> оформлен</h1><p className="text-sm text-muted">от {formatDate(order.created_at)}. Подтверждение отправлено на email.</p></div></div>
      <section aria-labelledby="status-heading" className="mb-6 rounded-lg border border-line bg-surface p-5">
        <h2 id="status-heading" className="mb-4 text-lg font-bold">Статус заказа</h2>
        <ol className="space-y-0">
          {api.ORDER_STATUS_FLOW.map((status, i) => { const done = i <= currentIdx; const historyEntry = order.status_history.find((h) => h.status === status); return (
            <li key={status} className="relative flex gap-3 pb-6 last:pb-0">
              {i < api.ORDER_STATUS_FLOW.length - 1 && <span className={`absolute left-[11px] top-6 h-full w-0.5 ${done && i < currentIdx ? 'bg-breaker' : 'bg-line'}`} aria-hidden />}
              <span className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${done ? 'border-breaker bg-breaker text-white' : 'border-line bg-surface'}`}>{done && <Check size={13} />}</span>
              <div className="flex-1 pt-0.5"><p className={`text-sm font-medium ${done ? '' : 'text-muted'}`}>{api.ORDER_STATUS_LABELS[status]}</p>{historyEntry && <p className="font-mono text-xs text-muted">{formatDate(historyEntry.at)}</p>}</div>
            </li>
          ); })}
        </ol>
      </section>
      <section aria-labelledby="items-heading" className="mb-6 rounded-lg border border-line bg-surface p-5">
        <h2 id="items-heading" className="mb-3 text-lg font-bold">Состав заказа</h2>
        <ul className="divide-y divide-line">{order.items.map((item) => (<li key={item.product_id} className="flex items-center gap-3 py-2.5 text-sm"><img src={item.image} alt="" className="h-12 w-12 rounded border border-line object-cover" /><div className="min-w-0 flex-1"><Link to={productPath(item.product_id, item.name)} className="line-clamp-1 font-medium hover:text-circuit">{item.name}</Link><p className="font-mono text-xs text-muted">Арт. {item.sku}</p></div><span className="font-mono text-muted">x{item.qty}</span><span className="w-24 text-right font-mono">{formatPrice(item.price * item.qty)}</span></li>))}</ul>
        <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm"><div className="flex justify-between text-muted"><dt>Товары</dt><dd className="font-mono">{formatPrice(order.items_total)}</dd></div><div className="flex justify-between text-muted"><dt>Доставка ({order.delivery.carrier}, {order.delivery.service})</dt><dd className="font-mono">{formatPrice(order.delivery.price)}</dd></div><div className="flex justify-between text-base font-semibold"><dt>Итого</dt><dd className="font-mono">{formatPrice(order.total)}</dd></div></dl>
      </section>
      <section aria-labelledby="delivery-heading" className="rounded-lg border border-line bg-surface p-5"><h2 id="delivery-heading" className="mb-2 text-lg font-bold">Доставка</h2><p className="text-sm">{order.delivery.carrier} — {order.delivery.service}, ориентировочно {order.delivery.eta_days} дн.</p><p className="text-sm text-muted">{order.delivery.address}</p><p className="mt-2 text-sm text-muted">Оплата: {order.payment_method === 'card' ? 'банковская карта' : 'СБП'}</p></section>
      <div className="mt-6 flex gap-3"><Link to="/account/orders" className="rounded border border-line bg-surface px-4 py-2.5 text-sm font-medium hover:border-circuit">Все мои заказы</Link><Link to="/" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]">Продолжить покупки</Link></div>
    </div>
  );
}
