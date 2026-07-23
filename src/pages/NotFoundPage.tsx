import { Link } from 'react-router-dom';
import { Unplug } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';
export function NotFoundPage() {
  return (
    <div className="py-20 text-center"><Seo title="Страница не найдена" /><Unplug size={36} className="mx-auto mb-4 text-muted" /><p className="mb-1 font-mono text-sm text-muted">Ошибка 404</p><h1 className="mb-2 text-2xl font-bold">Такой страницы нет</h1><p className="mb-6 text-muted">Возможно, ссылка устарела или в адресе опечатка. Каталог и поиск помогут найти нужный товар.</p><div className="flex justify-center gap-3"><Link to="/" className="rounded bg-signal px-4 py-2.5 text-sm font-semibold text-[#1B1F24]">На главную</Link><Link to="/search" className="rounded border border-line bg-surface px-4 py-2.5 text-sm font-medium hover:border-circuit">Поиск по каталогу</Link></div></div>
  );
}
