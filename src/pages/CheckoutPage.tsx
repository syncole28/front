import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, CreditCard, Loader2, QrCode, Truck } from 'lucide-react';
import * as api from '@/api/client';
import type { AccountType, DeliveryOption } from '@/api/types';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import { formatPrice } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';

const STEPS = ['Контакты', 'Доставка', 'Оплата', 'Подтверждение'];
interface BuyerForm { account_type: AccountType; name: string; phone: string; email: string; org_name: string; inn: string; }
const inputClass = 'h-10 w-full rounded border border-line bg-paper px-3 text-sm placeholder:text-muted/60';

export function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [buyer, setBuyer] = useState<BuyerForm>({ account_type: 'individual', name: '', phone: '', email: '', org_name: '', inn: '' });
  const [address, setAddress] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[] | null>(null);
  const [deliveryBusy, setDeliveryBusy] = useState(false);
  const [deliveryError, setDeliveryError] = useState('');
  const [delivery, setDelivery] = useState<DeliveryOption | null>(null);
  const [payment, setPayment] = useState<'card' | 'sbp'>('card');
  const [submitBusy, setSubmitBusy] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => { if (!user) return; setBuyer((b) => ({ ...b, account_type: user.account_type, name: user.name, phone: user.phone, email: user.email, org_name: user.company?.org_name ?? '', inn: user.company?.inn ?? '' })); }, [user]);

  if (!cart.length) return (<div className="py-20 text-center"><Seo title="Оформление заказа" /><h1 className="mb-2 text-2xl font-bold">Корзина пуста</h1><p className="mb-6 text-muted">Добавьте товары, чтобы оформить заказ.</p><Link to="/" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]">Перейти в каталог</Link></div>);

  const contactsValid = buyer.phone.trim().length >= 6 && buyer.email.includes('@') && (buyer.account_type === 'individual' ? buyer.name.trim().length > 1 : buyer.org_name.trim().length > 1 && buyer.inn.trim().length >= 10);

  const calcDelivery = async () => {
    if (address.trim().length < 5 || deliveryBusy) return; setDeliveryBusy(true); setDeliveryError(''); setDelivery(null);
    try { const { options } = await api.calculateDelivery(address, cart.map((l) => ({ product_id: l.product.id, qty: l.qty }))); setDeliveryOptions(options); if (!options.length) setDeliveryError('По этому адресу вариантов доставки нет. Уточните адрес.'); } catch { setDeliveryError('Не удалось рассчитать доставку. Попробуйте ещё раз.'); } finally { setDeliveryBusy(false); }
  };

  const submitOrder = async () => {
    if (!delivery || submitBusy) return; setSubmitBusy(true); setSubmitError('');
    try { const res = await api.createOrder({ items: cart.map((l) => ({ product_id: l.product.id, qty: l.qty })), delivery_option: delivery, payment_method: payment, buyer: { name: buyer.account_type === 'individual' ? buyer.name : buyer.org_name, phone: buyer.phone, email: buyer.email, account_type: buyer.account_type }, address }); clearCart(); if (res.payment_redirect_url) { window.location.assign(res.payment_redirect_url); return; } navigate(`/order/${res.order_id}`); } catch { setSubmitError('Не удалось оформить заказ. Проверьте данные и попробуйте ещё раз.'); setSubmitBusy(false); }
  };

  return (
    <div>
      <Seo title="Оформление заказа" />
      <h1 className="mb-5 text-2xl font-bold">Оформление заказа</h1>
      <ol className="mb-6 flex flex-wrap gap-2" aria-label="Шаги оформления">
        {STEPS.map((label, i) => (<li key={label} className="flex items-center gap-2"><button type="button" disabled={i > step} onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${i === step ? 'border-circuit bg-circuit text-white' : i < step ? 'border-breaker/50 bg-breaker/10 text-breaker' : 'border-line bg-surface text-muted'}`}><span className="font-mono text-xs">{i < step ? <Check size={13} /> : i + 1}</span>{label}</button>{i < STEPS.length - 1 && <span className="hidden h-px w-4 bg-line sm:block" aria-hidden />}</li>))}
      </ol>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 rounded-lg border border-line bg-surface p-5">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Контактные данные</h2>
              <div className="flex rounded border border-line p-0.5" role="radiogroup" aria-label="Тип покупателя">{(['individual', 'legal_entity'] as const).map((t) => (<button key={t} type="button" role="radio" aria-checked={buyer.account_type === t} onClick={() => setBuyer({ ...buyer, account_type: t })} className={`flex-1 rounded py-2 text-sm font-medium transition-colors ${buyer.account_type === t ? 'bg-circuit text-white' : 'text-muted hover:text-ink'}`}>{t === 'individual' ? 'Физическое лицо' : 'Юридическое лицо'}</button>))}</div>
              {buyer.account_type === 'individual' ? (<label className="block text-sm"><span className="mb-1 block font-medium">Имя и фамилия</span><input className={inputClass} value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} placeholder="Иван Петров" /></label>) : (
                <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm"><span className="mb-1 block font-medium">Название организации</span><input className={inputClass} value={buyer.org_name} onChange={(e) => setBuyer({ ...buyer, org_name: e.target.value })} placeholder="ООО «Монтажстрой»" /></label><label className="block text-sm"><span className="mb-1 block font-medium">ИНН</span><input className={`${inputClass} font-mono`} value={buyer.inn} onChange={(e) => setBuyer({ ...buyer, inn: e.target.value })} placeholder="7701234567" inputMode="numeric" /></label></div>
              )}
              <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm"><span className="mb-1 block font-medium">Телефон</span><input className={`${inputClass} font-mono`} value={buyer.phone} onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })} placeholder="+7 900 000-00-00" inputMode="tel" /></label><label className="block text-sm"><span className="mb-1 block font-medium">Email</span><input className={inputClass} type="email" value={buyer.email} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} placeholder="mail@example.ru" /></label></div>
              {!user && <p className="text-xs text-muted">Регистрация не обязательна — заказ можно оформить как гость. <Link to="/login" className="text-circuit underline">Войти</Link>, чтобы данные подставились автоматически.</p>}
              <button type="button" disabled={!contactsValid} onClick={() => setStep(1)} className="rounded bg-signal px-5 py-2.5 text-sm font-semibold text-[#1B1F24] disabled:opacity-50">Продолжить</button>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Доставка</h2>
              <label className="block text-sm"><span className="mb-1 block font-medium">Адрес доставки</span><div className="flex gap-2"><input className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Город, улица, дом" /><button type="button" onClick={calcDelivery} disabled={address.trim().length < 5 || deliveryBusy} className="h-10 shrink-0 rounded border border-circuit px-4 text-sm font-semibold text-circuit disabled:opacity-50">{deliveryBusy ? <Loader2 size={16} className="animate-spin" /> : 'Рассчитать'}</button></div></label>
              {deliveryError && <p className="text-sm text-fault">{deliveryError}</p>}
              {deliveryOptions && !deliveryError && (<fieldset className="space-y-2"><legend className="mb-1 text-sm font-medium">Варианты доставки</legend>{deliveryOptions.map((o) => { const selected = delivery === o; return (<label key={`${o.carrier}-${o.service}`} className={`flex cursor-pointer items-center gap-3 rounded border p-3 text-sm transition-colors ${selected ? 'border-circuit bg-circuit/5' : 'border-line hover:border-muted'}`}><input type="radio" name="delivery" checked={selected} onChange={() => setDelivery(o)} className="accent-[#2E6E8E]" /><Truck size={18} className="shrink-0 text-circuit" /><span className="flex-1"><span className="font-medium">{o.carrier}</span><span className="text-muted"> — {o.service}</span></span><span className="text-muted">{o.eta_days} дн.</span><span className="font-mono font-medium">{formatPrice(o.price)}</span></label>); })}</fieldset>)}
              <button type="button" disabled={!delivery} onClick={() => setStep(2)} className="rounded bg-signal px-5 py-2.5 text-sm font-semibold text-[#1B1F24] disabled:opacity-50">Продолжить</button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Способ оплаты</h2>
              <fieldset className="space-y-2"><legend className="sr-only">Способ оплаты</legend>
                <label className={`flex cursor-pointer items-center gap-3 rounded border p-3 text-sm ${payment === 'card' ? 'border-circuit bg-circuit/5' : 'border-line hover:border-muted'}`}><input type="radio" name="payment" checked={payment === 'card'} onChange={() => setPayment('card')} className="accent-[#2E6E8E]" /><CreditCard size={18} className="text-circuit" /><span className="flex-1"><span className="font-medium">Банковская карта</span><span className="block text-xs text-muted">Visa, Mastercard, МИР — оплата на защищённой странице банка</span></span></label>
                <label className={`flex cursor-pointer items-center gap-3 rounded border p-3 text-sm ${payment === 'sbp' ? 'border-circuit bg-circuit/5' : 'border-line hover:border-muted'}`}><input type="radio" name="payment" checked={payment === 'sbp'} onChange={() => setPayment('sbp')} className="accent-[#2E6E8E]" /><QrCode size={18} className="text-circuit" /><span className="flex-1"><span className="font-medium">СБП</span><span className="block text-xs text-muted">Система быстрых платежей — оплата по QR-коду из приложения банка</span></span></label>
              </fieldset>
              <p className="text-xs text-muted">После подтверждения заказа вы перейдёте на страницу оплаты платёжного сервиса.</p>
              <button type="button" onClick={() => setStep(3)} className="rounded bg-signal px-5 py-2.5 text-sm font-semibold text-[#1B1F24]">Продолжить</button>
            </div>
          )}
          {step === 3 && delivery && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Подтверждение заказа</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted">Покупатель</dt><dd className="text-right font-medium">{buyer.account_type === 'individual' ? buyer.name : `${buyer.org_name} (ИНН ${buyer.inn})`}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Контакты</dt><dd className="text-right font-mono">{buyer.phone} · {buyer.email}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Доставка</dt><dd className="text-right">{delivery.carrier} — {delivery.service}, {delivery.eta_days} дн., {formatPrice(delivery.price)}<span className="block text-muted">{address}</span></dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Оплата</dt><dd className="text-right font-medium">{payment === 'card' ? 'Банковская карта' : 'СБП'}</dd></div>
              </dl>
              <ul className="divide-y divide-line rounded border border-line">{cart.map(({ product, qty }) => (<li key={product.id} className="flex items-center gap-3 p-2.5 text-sm"><span className="min-w-0 flex-1 truncate">{product.name}</span><span className="font-mono text-muted">x{qty}</span><span className="w-24 text-right font-mono">{formatPrice(product.price * qty)}</span></li>))}</ul>
              {submitError && <p className="text-sm text-fault">{submitError}</p>}
              <button type="button" onClick={submitOrder} disabled={submitBusy} className="inline-flex items-center gap-2 rounded bg-signal px-6 py-3 text-sm font-semibold text-[#1B1F24] disabled:opacity-60">{submitBusy && <Loader2 size={16} className="animate-spin" />}Оформить заказ</button>
            </div>
          )}
        </div>
        <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:w-80" aria-label="Сводка заказа">
          <div className="rounded-lg border border-line bg-surface p-4 text-sm">
            <h2 className="mb-3 text-base font-bold">Ваш заказ</h2>
            <div className="mb-1 flex justify-between text-muted"><span>Товары ({cart.reduce((s, l) => s + l.qty, 0)} шт.)</span><span className="font-mono">{formatPrice(cartTotal)}</span></div>
            <div className="mb-2 flex justify-between text-muted"><span>Доставка</span><span className="font-mono">{delivery ? formatPrice(delivery.price) : '—'}</span></div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><span>Итого</span><span className="font-mono">{formatPrice(cartTotal + (delivery?.price ?? 0))}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
