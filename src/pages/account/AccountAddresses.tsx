import { useEffect, useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
interface Address { id: number; label: string; address: string; }
const KEY = 'et_addresses';

export function AccountAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(() => { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Address[]; } catch { return []; } });
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(addresses)); }, [addresses]);
  const add = (e: React.FormEvent) => { e.preventDefault(); if (address.trim().length < 5) return; setAddresses([...addresses, { id: Date.now(), label: label.trim() || 'Адрес доставки', address: address.trim() }]); setLabel(''); setAddress(''); };
  return (
    <div className="max-w-lg space-y-4">
      <div className="rounded-lg border border-line bg-surface p-5">
        <h2 className="mb-3 text-lg font-bold">Адреса доставки</h2>
        {addresses.length === 0 ? <p className="text-sm text-muted">Сохранённых адресов нет. Добавьте адрес — он будет под рукой при оформлении заказа.</p> : (
          <ul className="divide-y divide-line">{addresses.map((a) => (<li key={a.id} className="flex items-start gap-3 py-3"><MapPin size={16} className="mt-0.5 shrink-0 text-circuit" /><div className="min-w-0 flex-1"><p className="text-sm font-medium">{a.label}</p><p className="text-sm text-muted">{a.address}</p></div><button type="button" onClick={() => setAddresses(addresses.filter((x) => x.id !== a.id))} aria-label={`Удалить адрес ${a.label}`} className="flex h-8 w-8 items-center justify-center rounded text-muted hover:text-fault"><Trash2 size={15} /></button></li>))}</ul>
        )}
      </div>
      <form onSubmit={add} className="space-y-3 rounded-lg border border-line bg-surface p-5">
        <h3 className="text-sm font-semibold">Добавить адрес</h3>
        <input className="h-10 w-full rounded border border-line bg-paper px-3 text-sm" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Название (например, «Объект на Ленина»)" aria-label="Название адреса" />
        <input className="h-10 w-full rounded border border-line bg-paper px-3 text-sm" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Город, улица, дом" aria-label="Адрес" required />
        <button type="submit" className="inline-flex items-center gap-2 rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]"><Plus size={15} />Сохранить адрес</button>
      </form>
    </div>
  );
}
