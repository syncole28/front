import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface pb-20 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded bg-signal text-[#1B1F24]"><Zap size={17} strokeWidth={2.5} /></span><span className="font-display text-base font-bold">ЭлектроТорг</span></div>
          <p className="text-sm text-muted">Электротехническая и промышленная продукция для монтажных организаций и частных мастеров. 18 500+ позиций, цены и наличие обновляются ежедневно.</p>
        </div>
        <nav aria-label="Покупателям"><h3 className="mb-3 text-sm font-semibold">Покупателям</h3><ul className="space-y-2 text-sm text-muted"><li><Link to="/delivery-payment" className="hover:text-circuit">Доставка и оплата</Link></li><li><Link to="/cart" className="hover:text-circuit">Корзина</Link></li><li><Link to="/favorites" className="hover:text-circuit">Избранное</Link></li><li><Link to="/compare" className="hover:text-circuit">Сравнение товаров</Link></li></ul></nav>
        <nav aria-label="Юридическим лицам"><h3 className="mb-3 text-sm font-semibold">Юридическим лицам</h3><ul className="space-y-2 text-sm text-muted"><li><Link to="/register" className="hover:text-circuit">Регистрация юрлица</Link></li><li><Link to="/cart" className="hover:text-circuit">Счёт на оплату из корзины</Link></li><li><Link to="/cart" className="hover:text-circuit">Заказ по списку артикулов</Link></li></ul></nav>
        <nav aria-label="Компания"><h3 className="mb-3 text-sm font-semibold">Компания</h3><ul className="space-y-2 text-sm text-muted"><li><Link to="/about" className="hover:text-circuit">О компании</Link></li><li><Link to="/contacts" className="hover:text-circuit">Контакты</Link></li></ul><p className="mt-4 font-mono text-sm text-muted">+7 (495) 000-00-00</p><p className="font-mono text-sm text-muted">zakaz@elektrotorg.example</p></nav>
      </div>
      <div className="border-t border-line"><p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted">© {new Date().getFullYear()} ЭлектроТорг. Цены на сайте не являются публичной офертой.</p></div>
    </footer>
  );
}
