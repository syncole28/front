import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import * as api from '@/api/client';
import { useAuth } from '@/context/AuthContext';
const inputClass = 'h-10 w-full rounded border border-line bg-paper px-3 text-sm';

export function AccountRequisites() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ org_name: user?.company?.org_name ?? '', inn: user?.company?.inn ?? '', kpp: user?.company?.kpp ?? '', legal_address: user?.company?.legal_address ?? '', contact_person: user?.company?.contact_person ?? '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  if (!user) return null;
  if (user.account_type !== 'legal_entity') return (<div className="rounded-lg border border-line bg-surface p-8 text-center"><p className="mb-1 font-medium">Реквизиты доступны аккаунтам юрлиц.</p><p className="text-sm text-muted">Ваш аккаунт — физическое лицо. Для работы с реквизитами и счетами <Link to="/register" className="text-circuit underline">зарегистрируйте юрлицо</Link>.</p></div>);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (busy) return; setBusy(true); setMessage(null); try { await api.updateProfile({ company: form }); await refresh(); setMessage({ tone: 'ok', text: 'Реквизиты сохранены. Они подставятся в счёт и при оформлении.' }); } catch { setMessage({ tone: 'err', text: 'Не удалось сохранить реквизиты. Попробуйте ещё раз.' }); } finally { setBusy(false); } };
  return (
    <form onSubmit={submit} className="max-w-lg space-y-4 rounded-lg border border-line bg-surface p-5">
      <h2 className="text-lg font-bold">Реквизиты юрлица</h2>
      <label className="block text-sm"><span className="mb-1 block font-medium">Название организации</span><input required className={inputClass} value={form.org_name} onChange={(e) => setForm({ ...form, org_name: e.target.value })} /></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm"><span className="mb-1 block font-medium">ИНН</span><input required className={`${inputClass} font-mono`} value={form.inn} onChange={(e) => setForm({ ...form, inn: e.target.value })} inputMode="numeric" /></label><label className="block text-sm"><span className="mb-1 block font-medium">КПП</span><input required className={`${inputClass} font-mono`} value={form.kpp} onChange={(e) => setForm({ ...form, kpp: e.target.value })} inputMode="numeric" /></label></div>
      <label className="block text-sm"><span className="mb-1 block font-medium">Юридический адрес</span><input required className={inputClass} value={form.legal_address} onChange={(e) => setForm({ ...form, legal_address: e.target.value })} /></label>
      <label className="block text-sm"><span className="mb-1 block font-medium">Контактное лицо</span><input required className={inputClass} value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></label>
      {message && <p className={`text-sm ${message.tone === 'ok' ? 'text-breaker' : 'text-fault'}`}>{message.text}</p>}
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded bg-signal px-5 py-2.5 text-sm font-semibold text-[#1B1F24] disabled:opacity-60">{busy && <Loader2 size={15} className="animate-spin" />}Сохранить реквизиты</button>
    </form>
  );
}
