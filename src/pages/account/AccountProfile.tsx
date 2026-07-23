import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import * as api from '@/api/client';
import { useAuth } from '@/context/AuthContext';
const inputClass = 'h-10 w-full rounded border border-line bg-paper px-3 text-sm';

export function AccountProfile() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '', email: user?.email ?? '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  if (!user) return null;
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (busy) return; setBusy(true); setMessage(null); try { await api.updateProfile(form); await refresh(); setMessage({ tone: 'ok', text: 'Профиль сохранён.' }); } catch { setMessage({ tone: 'err', text: 'Не удалось сохранить изменения. Попробуйте ещё раз.' }); } finally { setBusy(false); } };
  return (
    <form onSubmit={submit} className="max-w-lg space-y-4 rounded-lg border border-line bg-surface p-5">
      <h2 className="text-lg font-bold">Профиль</h2>
      <label className="block text-sm"><span className="mb-1 block font-medium">{user.account_type === 'legal_entity' ? 'Контактное лицо' : 'Имя и фамилия'}</span><input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm"><span className="mb-1 block font-medium">Телефон</span><input required type="tel" className={`${inputClass} font-mono`} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label className="block text-sm"><span className="mb-1 block font-medium">Email</span><input required type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label></div>
      {message && <p className={`text-sm ${message.tone === 'ok' ? 'text-breaker' : 'text-fault'}`}>{message.text}</p>}
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded bg-signal px-5 py-2.5 text-sm font-semibold text-[#1B1F24] disabled:opacity-60">{busy && <Loader2 size={15} className="animate-spin" />}Сохранить изменения</button>
    </form>
  );
}
