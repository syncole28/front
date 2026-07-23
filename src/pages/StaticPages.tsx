import { Link } from 'react-router-dom';
import { Banknote, Clock, CreditCard, FileText, Mail, MapPin, Phone, Truck } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl"><Seo title="О компании" description="ЭлектроТорг — поставщик электротехнической и промышленной продукции для монтажных организаций и частных мастеров." /><h1 className="mb-4 text-2xl font-bold">О компании</h1>
      <div className="space-y-4 rounded-lg border border-line bg-surface p-6 text-sm leading-relaxed">
        <p>ЭлектроТорг — поставщик электротехнической продукции для монтажных организаций, подрядчиков и частных мастеров. В каталоге более 18 500 позиций: кабели и провода, электроустановочные изделия, освещение, модульная автоматика, инструмент и расходные материалы.</p>
        <p>Остатки склада и цены синхронизируются с сайтом ежедневно — на сайте показано реальное наличие, а не ориентировочное. Отгружаем со склада в Москве, доставляем транспортными компаниями по всей России.</p>
        <p>Работаем с юридическими лицами: счёт на оплату формируется прямо из корзины, реквизиты сохраняются в личном кабинете, для объёмных заказов действуют оптовые цены. Каталог будет расширяться — к электротехнике добавятся климатическая техника и инструмент новых поставщиков.</p>
      </div>
    </div>
  );
}

export function ContactsPage() {
  return (
    <div className="mx-auto max-w-3xl"><Seo title="Контакты" description="Контакты интернет-магазина ЭлектроТорг: телефон, email, адрес склада и часы работы." /><h1 className="mb-4 text-2xl font-bold">Контакты</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-5"><Phone size={20} className="mb-2 text-circuit" /><h2 className="mb-1 text-sm font-semibold">Телефон</h2><p className="font-mono text-sm">+7 (495) 000-00-00</p><p className="mt-1 text-xs text-muted">Отдел продаж и вопросы по заказам</p></div>
        <div className="rounded-lg border border-line bg-surface p-5"><Mail size={20} className="mb-2 text-circuit" /><h2 className="mb-1 text-sm font-semibold">Email</h2><p className="font-mono text-sm">zakaz@elektrotorg.example</p><p className="mt-1 text-xs text-muted">Заявки, счета, коммерческие предложения</p></div>
        <div className="rounded-lg border border-line bg-surface p-5"><MapPin size={20} className="mb-2 text-circuit" /><h2 className="mb-1 text-sm font-semibold">Склад и самовывоз</h2><p className="text-sm">г. Москва, Складской проезд, 1, стр. 2</p><p className="mt-1 text-xs text-muted">Выдача заказов после подтверждения менеджером</p></div>
        <div className="rounded-lg border border-line bg-surface p-5"><Clock size={20} className="mb-2 text-circuit" /><h2 className="mb-1 text-sm font-semibold">Часы работы</h2><p className="text-sm">Пн–Пт: 8:00–19:00</p><p className="text-sm">Сб: 9:00–16:00, Вс — выходной</p></div>
      </div>
    </div>
  );
}

export function DeliveryPaymentPage() {
  return (
    <div className="mx-auto max-w-3xl"><Seo title="Доставка и оплата" description="Доставка транспортными компаниями по всей России. Оплата картой, СБП или по счёту для юрлиц." /><h1 className="mb-4 text-2xl font-bold">Доставка и оплата</h1>
      <div className="space-y-3">
        <section className="rounded-lg border border-line bg-surface p-5"><div className="mb-2 flex items-center gap-2"><Truck size={20} className="text-circuit" /><h2 className="text-base font-semibold">Доставка транспортными компаниями</h2></div><p className="text-sm leading-relaxed text-muted">Отгружаем Деловыми Линиями, СДЭК и ПЭК — до терминала или до двери. Стоимость и срок рассчитываются автоматически на шаге «Доставка» при оформлении заказа по вашему адресу и составу корзины. Отгрузка со склада — в день подтверждения заказа при оплате до 14:00.</p></section>
        <section className="rounded-lg border border-line bg-surface p-5"><div className="mb-2 flex items-center gap-2"><CreditCard size={20} className="text-circuit" /><h2 className="text-base font-semibold">Банковская карта и СБП</h2></div><p className="text-sm leading-relaxed text-muted">Онлайн-оплата картой (Visa, Mastercard, МИР) или через Систему быстрых платежей по QR-коду. После подтверждения заказа вы перейдёте на защищённую страницу платёжного сервиса — данные карты магазин не обрабатывает и не хранит.</p></section>
        <section className="rounded-lg border border-line bg-surface p-5"><div className="mb-2 flex items-center gap-2"><FileText size={20} className="text-circuit" /><h2 className="text-base font-semibold">Счёт для юридических лиц</h2></div><p className="text-sm leading-relaxed text-muted">Счёт на оплату PDF формируется прямо из корзины — без обязательного оформления заказа. Оплатите по безналу, а доставку согласуем после зачисления. Реквизиты организации подставляются автоматически из личного кабинета.</p></section>
        <section className="rounded-lg border border-line bg-surface p-5"><div className="mb-2 flex items-center gap-2"><Banknote size={20} className="text-circuit" /><h2 className="text-base font-semibold">Оптовые цены</h2></div><p className="text-sm leading-relaxed text-muted">При заказе от 10, 50 и 200 единиц одной позиции действуют сниженные цены — шкала указана на карточке каждого товара. Для постоянных клиентов-юрлиц доступны индивидуальные условия.</p></section>
      </div>
      <p className="mt-4 text-sm text-muted">Остались вопросы — <Link to="/contacts" className="text-circuit underline">свяжитесь с нами</Link>.</p>
    </div>
  );
}
