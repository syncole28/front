import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (<div className="flex min-h-screen flex-col"><Header /><main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-8 pt-6"><Outlet /></main><Footer /><MobileNav /></div>);
}
