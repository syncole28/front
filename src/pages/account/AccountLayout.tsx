import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Building2, LogOut, MapPin, Package, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Seo } from '@/components/ui/Seo';
const NAV = [{ to: 'orders', icon: Package, label: 'Мои заказы' }, { to: 'profile', icon: UserCircle, label: 'Профиль' }, { to: 'requisites', icon: Building2, label: 'Реквизиты' }, { to: 'addresses', icon: MapPin, label: 'Адреса доставки' }];

export function AccountLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  if (loading) return <div className="skeleton h-64 w-full" />;
  if (!user) return (<div className="py-20 text-center"><Seo title="Личный кабинет" /><h1 className="mb-2 text-2xl font-bold">Требуется вход</h1><p className="mb-6 text-muted">Войдите в аккаунт, чтобы открыть личный кабинет.</p><Link to="/login" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]">Войти</Link></div>);
  return (
    <div><Seo title="Личный кабинет" />
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2"><h1 className="text-2xl font-bold">Личный кабинет</h1><p className="text-sm text-muted">{user.account_type === 'legal_entity' ? user.company?.org_name : user.name}<span className="ml-2 rounded border border-line px-1.5 py-0.5 text-xs">{user.account_type === 'legal_entity' ? 'Юрлицо' : 'Физлицо'}</span></p></div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <nav className="flex gap-1 overflow-x-auto lg:w-56 lg:shrink-0 lg:flex-col" aria-label="Разделы кабинета">
          {NAV.map(({ to, icon: Icon, label }) => (<NavLink key={to} to={to} className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-circuit/10 text-circuit' : 'text-muted hover:text-ink'}`}><Icon size={16} />{label}</NavLink>))}
          <button type="button" onClick={async () => { await logout(); navigate('/'); }} className="flex shrink-0 items-center gap-2 rounded px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fault"><LogOut size={16} />Выйти</button>
        </nav>
        <div className="min-w-0 flex-1"><Outlet /></div>
      </div>
    </div>
  );
}
