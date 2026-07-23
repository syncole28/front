import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Seo } from '@/components/ui/Seo';
const inputClass = 'h-10 w-full rounded border border-line bg-paper px-3 text-sm placeholder:text-muted/60';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (busy) return; setBusy(true); setError(''); try { await login(email, password); navigate('/account'); } catch (err) { setError(err instanceof Error ? err.message : 'Не удалось войти. Попробуйте ещё раз.'); } finally { setBusy(false); } };
  return (
    <div className="mx-auto max-w-md"><Seo title="Вход в личный кабинет" /><h1 className="mb-5 text-2xl font-bold">Вход в личный кабинет</h1>
      <form onSubmit={submit} className="space-y-4 rounded-lg border border-line bg-surface p-5">
        <label className="block text-sm"><span className="mb-1 block font-medium">Email</span><input type="email" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mail@example.ru" autoComplete="email" /></label>
        <label className="block text-sm"><span className="mb-1 block font-medium">Пароль</span><input type="password" required className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
        {error && <p className="text-sm text-fault">{error}</p>}
        <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded bg-signal py-2.5 text-sm font-semibold text-[#1B1F24] disabled:opacity-60">{busy ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}Войти</button>
        <p className="text-center text-sm text-muted">Нет аккаунта? <Link to="/register" className="font-medium text-circuit hover:underline">Зарегистрироваться</Link></p>
      </form>
    </div>
  );
}
