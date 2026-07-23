import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import * as api from '@/api/client';
import type { Order } from '@/api/types';
import { formatDate, formatPrice } from '@/lib/format';

export function AccountOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => { api.getOrders().then(setOrders).catch(() => setOrders([])); }, []);
  if (!orders) return (<div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-20 w-full" />)}</div>);
  if (!orders.length) return (<div className="rounded-lg border border-line bg-surface p-10 text-center"><Package size={28} className="mx-auto mb-3 text-muted" /><p className="mb-1 font-medium">Заказов пока нет.</p><p className="mb-4 text-sm text-muted">Оформленные заказы и их статусы появятся здесь.</p><Link to="/" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]">Перейти в каталог</Link></div>);
  return (
    <div className="space-y-3">{orders.map((o) => (<Link key={o.id} to={`/order/${o.id}`} className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-circuit"><div className="min-w-0 flex-1"><p className="font-mono text-sm font-semibold">{o.number}</p><p className="text-xs text-muted">{formatDate(o.created_at)} · позиций: {o.items.length}</p></div><span className="rounded-full bg-circuit/10 px-2.5 py-1 text-xs font-medium text-circuit">{api.ORDER_STATUS_LABELS[o.status]}</span><span className="font-mono font-medium">{formatPrice(o.total)}</span></Link>))}</div>
  );
}
