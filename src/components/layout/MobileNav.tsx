import { NavLink, useNavigate } from 'react-router-dom';
import { Heart, LayoutGrid, Search, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
export function MobileNav() {
  const { cartCount } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const itemClass = ({ isActive }: { isActive: boolean }) => `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${isActive ? 'text-circuit' : 'text-muted'}`;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface/95 backdrop-blur md:hidden" aria-label="Мобильная навигация">
      <NavLink to="/" end className={itemClass}><LayoutGrid size={20} />Каталог</NavLink>
      <button type="button" onClick={() => navigate('/search')} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-muted"><Search size={20} />Поиск</button>
      <NavLink to="/cart" className={itemClass}><span className="relative"><ShoppingCart size={20} />{cartCount > 0 && <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-signal px-0.5 font-mono text-[10px] font-semibold text-[#1B1F24]">{cartCount}</span>}</span>Корзина</NavLink>
      <NavLink to="/favorites" className={itemClass}><Heart size={20} />Избранное</NavLink>
      <NavLink to={user ? '/account' : '/login'} className={itemClass}><User size={20} />Кабинет</NavLink>
    </nav>
  );
}
