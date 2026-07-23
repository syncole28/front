import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, UserPlus } from 'lucide-react';
import type { AccountType } from '@/api/types';
import { useAuth } from '@/context/AuthContext';
import { Seo } from '@/components/ui/Seo';
const inputClass = 'h-10 w-full rounded border border-line bg-paper px-3 text-sm placeholder:text-muted/60';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState<AccountType>('individual');
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', org_name: '', inn: '', kpp: '', legal_address: '', contact_person: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (busy) return; setBusy(true); setError(''); try { await register({ account_type: type, email: form.email, phone: form.phone, password: form.password, ...(type === 'individual' ? { name: form.name } : { org_name: form.org_name, inn: form.inn, kpp: form.kpp, legal_address: form.legal_address, contact_person: form.contact_person }) }); navigate('/account'); } catch (err) { setError(err instanceof Error ? err.message : 'Не удалось зарегистрироваться.'); } finally { setBusy(false); } };

  return (
    <div className="mx-auto max-w-lg"><Seo title="Регистрация" /><h1 className="mb-5 text-2xl font-bold">Регистрация</h1>
      <form onSubmit={submit} className="space-y-4 rounded-lg border border-line bg-surface p-5">
        <div className="flex rounded border border-line p-0.5" role="radiogroup" aria-label="Тип аккаунта">{(['individual', 'legal_entity'] as const).map((t) => (<button key={t} type="button" role="radio" aria-checked={type === t} onClick={() => setType(t)} className={`flex-1 rounded py-2 text-sm font-medium transition-colors ${type === t ? 'bg-circuit text-white' : 'text-muted hover:text-ink'}`}>{t === 'individual' ? 'Физическое лицо' : 'Юридическое лицо'}</button>))}</div>
        {type === 'individual' ? (<label className="block text-sm"><span className="mb-1 block font-medium">Имя и фамилия</span><input required className={inputClass} value={form.name} onChange={set('name')} placeholder="Иван Петров" /></label>) : (
          <>
            <label className="block text-sm"><span className="mb-1 block font-medium">Название организации</span><input required className={inputClass} value={form.org_name} onChange={set('org_name')} placeholder="ООО «Монтажстрой»" /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm"><span className="mb-1 block font-medium">ИНН</span><input required className={`${inputClass} font-mono`} value={form.inn} onChange={set('inn')} placeholder="7701234567" inputMode="numeric" minLength={10} /></label><label className="block text-sm"><span className="mb-1 block font-medium">КПП</span><input required className={`${inputClass} font-mono`} value={form.kpp} onChange={set('kpp')} placeholder="770101001" inputMode="numeric" /></label></div>
            <label className="block text-sm"><span className="mb-1 block font-medium">Юридический адрес</span><input required className={inputClass} value={form.legal_address} onChange={set('legal_address')} placeholder="г. Москва, ул. Примерная, д. 1" /></label>
            <label className="block text-sm"><span className="mb-1 block font-medium">Контактное лицо</span><input required className={inputClass} value={form.contact_person} onChange={set('contact_person')} placeholder="Иван Петров" /></label>
          </>
        )}
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm"><span className="mb-1 block font-medium">Телефон</span><input required type="tel" className={`${inputClass} font-mono`} value={form.phone} onChange={set('phone')} placeholder="+7 900 000-00-00" /></label><label className="block text-sm"><span className="mb-1 block font-medium">Email</span><input required type="email" className={inputClass} value={form.email} onChange={set('email')} placeholder="mail@example.ru" autoComplete="email" /></label></div>
        <label className="block text-sm"><span className="mb-1 block font-medium">Пароль</span><input required type="password" minLength={6} className={inputClass} value={form.password} onChange={set('password')} autoComplete="new-password" /></label>
        {type === 'legal_entity' && <p className="rounded border border-circuit/30 bg-circuit/5 p-2.5 text-xs text-muted">Аккаунт юрлица открывает счёт на оплату из корзины, автоподстановку реквизитов при оформлении и оптовые цены.</p>}
        {error && <p className="text-sm text-fault">{error}</p>}
        <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded bg-signal py-2.5 text-sm font-semibold text-[#1B1F24] disabled:opacity-60">{busy ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}Зарегистрироваться</button>
        <p className="text-center text-sm text-muted">Уже есть аккаунт? <Link to="/login" className="font-medium text-circuit hover:underline">Войти</Link></p>
      </form>
    </div>
  );
}
