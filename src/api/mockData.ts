import type { Category, ProductDetail, ProductListItem } from '@/api/types';

const IMAGES = [
  'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/577514/pexels-photo-577514.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1435183/pexels-photo-1435183.jpeg?auto=compress&cs=tinysrgb&w=800',
];

interface CategoryDef {
  name: string; slug: string; nameTemplates: string[]; vendors: string[];
  params: { name: string; unit: string | null; values: string[] }[];
  priceRange: [number, number];
}

const CATEGORY_DEFS: CategoryDef[] = [
  { name: 'Кабели и провода', slug: 'kabeli-i-provoda', nameTemplates: ['Кабель ВВГнг(А)-LS {v}', 'Провод ПуГВ {v}', 'Кабель КГтп-ХЛ {v}', 'Кабель NYM {v}'], vendors: ['Кабэкс', 'Севкабель', 'Рыбинсккабель', 'Конкорд'], params: [{ name: 'Сечение жилы', unit: 'мм²', values: ['1.5', '2.5', '4', '6', '10'] }, { name: 'Число жил', unit: null, values: ['2', '3', '4', '5'] }, { name: 'Материал жилы', unit: null, values: ['медь', 'алюминий'] }, { name: 'Исполнение', unit: null, values: ['нг(А)-LS', 'нг(А)-FRLS', 'стандарт'] }], priceRange: [28, 420] },
  { name: 'Розетки и выключатели', slug: 'rozetki-i-vyklyuchateli', nameTemplates: ['Розетка {v} с заземлением', 'Выключатель {v} одноклавишный', 'Выключатель {v} двухклавишный', 'Рамка {v} на 2 поста'], vendors: ['Schneider Electric', 'Legrand', 'IEK', 'EKF', 'Systeme Electric'], params: [{ name: 'Цвет', unit: null, values: ['белый', 'бежевый', 'графит', 'алюминий'] }, { name: 'Степень защиты', unit: null, values: ['IP20', 'IP44', 'IP54'] }, { name: 'Способ монтажа', unit: null, values: ['скрытый', 'открытый'] }, { name: 'Номинальный ток', unit: 'А', values: ['10', '16'] }], priceRange: [95, 2400] },
  { name: 'Освещение', slug: 'osveshchenie', nameTemplates: ['Светильник светодиодный {v}', 'Лампа LED {v} E27', 'Прожектор {v}', 'Светильник ЖКХ {v}'], vendors: ['Gauss', 'Эра', 'Navigator', 'Jazzway', 'Feron'], params: [{ name: 'Мощность', unit: 'Вт', values: ['7', '10', '15', '20', '36', '50'] }, { name: 'Цветовая температура', unit: 'К', values: ['3000', '4000', '6500'] }, { name: 'Световой поток', unit: 'лм', values: ['700', '1000', '1800', '2600', '4500'] }, { name: 'Степень защиты', unit: null, values: ['IP20', 'IP40', 'IP65'] }], priceRange: [65, 5600] },
  { name: 'Автоматические выключатели', slug: 'avtomaticheskie-vyklyuchateli', nameTemplates: ['Автоматический выключатель {v}', 'Автомат модульный {v}'], vendors: ['ABB', 'Schneider Electric', 'IEK', 'EKF', 'DEKraft'], params: [{ name: 'Номинальный ток', unit: 'А', values: ['6', '10', '16', '25', '32', '40', '63'] }, { name: 'Число полюсов', unit: null, values: ['1', '2', '3', '4'] }, { name: 'Характеристика', unit: null, values: ['B', 'C', 'D'] }, { name: 'Отключающая способность', unit: 'кА', values: ['4.5', '6', '10'] }], priceRange: [120, 4800] },
  { name: 'УЗО и дифавтоматы', slug: 'uzo-i-difavtomaty', nameTemplates: ['УЗО {v}', 'Дифференциальный автомат {v}'], vendors: ['ABB', 'Schneider Electric', 'IEK', 'EKF'], params: [{ name: 'Номинальный ток', unit: 'А', values: ['16', '25', '32', '40', '63'] }, { name: 'Ток утечки', unit: 'мА', values: ['10', '30', '100', '300'] }, { name: 'Число полюсов', unit: null, values: ['2', '4'] }, { name: 'Тип', unit: null, values: ['AC', 'A'] }], priceRange: [650, 9800] },
  { name: 'Щиты и боксы', slug: 'shchity-i-boksy', nameTemplates: ['Щит распределительный {v}', 'Бокс пластиковый {v}', 'Корпус металлический {v}'], vendors: ['IEK', 'EKF', 'Tekfor', 'ABB'], params: [{ name: 'Число модулей', unit: null, values: ['4', '8', '12', '18', '24', '36'] }, { name: 'Способ монтажа', unit: null, values: ['встраиваемый', 'навесной'] }, { name: 'Материал', unit: null, values: ['пластик', 'металл'] }, { name: 'Степень защиты', unit: null, values: ['IP31', 'IP41', 'IP65'] }], priceRange: [340, 12500] },
  { name: 'Контакторы и реле', slug: 'kontaktory-i-rele', nameTemplates: ['Контактор модульный {v}', 'Реле промежуточное {v}', 'Реле времени {v}', 'Реле напряжения {v}'], vendors: ['ABB', 'IEK', 'EKF', 'Finder', 'Меандр'], params: [{ name: 'Номинальный ток', unit: 'А', values: ['16', '20', '25', '40', '63'] }, { name: 'Напряжение катушки', unit: 'В', values: ['24', '230'] }, { name: 'Число контактов', unit: null, values: ['2НО', '4НО', '2НО+2НЗ'] }], priceRange: [280, 7400] },
  { name: 'Клеммы и соединители', slug: 'klemmy-i-soediniteli', nameTemplates: ['Клемма {v}', 'Зажим соединительный {v}', 'Гильза ГМЛ {v}', 'Наконечник ТМЛ {v}'], vendors: ['WAGO', 'IEK', 'EKF', 'КВТ'], params: [{ name: 'Сечение', unit: 'мм²', values: ['0.5–2.5', '1.5–4', '2.5–6', '6–25'] }, { name: 'Число проводников', unit: null, values: ['2', '3', '5', '8'] }, { name: 'Тип', unit: null, values: ['пружинная', 'винтовая', 'опрессовка'] }], priceRange: [4, 380] },
  { name: 'Кабель-каналы и гофра', slug: 'kabel-kanaly-i-gofra', nameTemplates: ['Кабель-канал {v}', 'Труба гофрированная ПВХ {v}', 'Лоток перфорированный {v}'], vendors: ['DKC', 'IEK', 'Экопласт', 'Рувинил'], params: [{ name: 'Размер', unit: 'мм', values: ['16x16', '25x16', '40x25', '60x40', '100x60'] }, { name: 'Диаметр', unit: 'мм', values: ['16', '20', '25', '32', '50'] }, { name: 'Материал', unit: null, values: ['ПВХ', 'ПНД', 'металл'] }], priceRange: [18, 940] },
  { name: 'Электромонтажный инструмент', slug: 'instrument', nameTemplates: ['Стриппер {v}', 'Пресс-клещи {v}', 'Бокорезы {v}', 'Отвёртка диэлектрическая {v}', 'Клещи обжимные {v}'], vendors: ['КВТ', 'Knipex', 'IEK', 'Haupa', 'Shtok'], params: [{ name: 'Диапазон сечений', unit: 'мм²', values: ['0.2–6', '0.5–10', '4–50'] }, { name: 'Длина', unit: 'мм', values: ['160', '180', '200', '250'] }, { name: 'Изоляция до', unit: 'В', values: ['1000'] }], priceRange: [240, 18500] },
  { name: 'Измерительные приборы', slug: 'izmeritelnye-pribory', nameTemplates: ['Мультиметр {v}', 'Токовые клещи {v}', 'Индикатор напряжения {v}', 'Мегаомметр {v}'], vendors: ['Fluke', 'UNI-T', 'CEM', 'IEK', 'Testo'], params: [{ name: 'Диапазон напряжения', unit: 'В', values: ['600', '1000'] }, { name: 'Категория безопасности', unit: null, values: ['CAT II', 'CAT III', 'CAT IV'] }, { name: 'True RMS', unit: null, values: ['да', 'нет'] }], priceRange: [380, 46000] },
  { name: 'Крепёж и метизы', slug: 'krepezh-i-metizy', nameTemplates: ['Дюбель-хомут {v}', 'Скоба крепёжная {v}', 'Стяжка кабельная {v}', 'Анкер {v}'], vendors: ['Fortisflex', 'IEK', 'EKF', 'Партнёр'], params: [{ name: 'Размер', unit: 'мм', values: ['100x2.5', '200x3.6', '300x4.8', '5x10', '8x12'] }, { name: 'Материал', unit: null, values: ['нейлон', 'сталь', 'нерж. сталь'] }, { name: 'Упаковка', unit: 'шт', values: ['25', '100', '500'] }], priceRange: [1.5, 260] },
  { name: 'Вентиляция', slug: 'ventilyatsiya', nameTemplates: ['Вентилятор осевой {v}', 'Решётка вентиляционная {v}', 'Воздуховод {v}'], vendors: ['Эра', 'Vents', 'Soler&Palau', 'Домовент'], params: [{ name: 'Диаметр', unit: 'мм', values: ['100', '125', '150'] }, { name: 'Производительность', unit: 'м³/ч', values: ['95', '130', '180', '250'] }, { name: 'Уровень шума', unit: 'дБ', values: ['24', '32', '36'] }], priceRange: [80, 8900] },
  { name: 'Тёплый пол', slug: 'teplyy-pol', nameTemplates: ['Мат нагревательный {v}', 'Кабель нагревательный {v}', 'Терморегулятор {v}'], vendors: ['Devi', 'Rehau', 'Теплолюкс', 'Electrolux'], params: [{ name: 'Мощность', unit: 'Вт', values: ['150', '300', '600', '900', '1200'] }, { name: 'Площадь обогрева', unit: 'м²', values: ['1', '2', '4', '6', '8'] }, { name: 'Управление', unit: null, values: ['механическое', 'электронное', 'Wi-Fi'] }], priceRange: [1200, 24000] },
  { name: 'Умный дом и слаботочка', slug: 'umnyy-dom', nameTemplates: ['Датчик движения {v}', 'Кабель UTP {v}', 'Видеодомофон {v}', 'Wi-Fi реле {v}'], vendors: ['IEK', 'Sonoff', 'Hikvision', 'Cabeus', 'Aqara'], params: [{ name: 'Протокол', unit: null, values: ['Wi-Fi', 'Zigbee', 'проводной'] }, { name: 'Категория', unit: null, values: ['5e', '6'] }, { name: 'Угол обзора', unit: '°', values: ['120', '180', '360'] }], priceRange: [190, 15800] },
];

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PER_CATEGORY = 64;

function buildProducts(): ProductDetail[] {
  const products: ProductDetail[] = [];
  let id = 1000;
  CATEGORY_DEFS.forEach((def, ci) => {
    const rnd = mulberry32(ci * 7919 + 13);
    for (let i = 0; i < PER_CATEGORY; i++) {
      const vendor = def.vendors[Math.floor(rnd() * def.vendors.length)];
      const template = def.nameTemplates[i % def.nameTemplates.length];
      const params = def.params.map((p) => ({ name: p.name, value: p.values[Math.floor(rnd() * p.values.length)], unit: p.unit }));
      const variant = params[0] ? `${params[0].value}${params[0].unit ? ` ${params[0].unit}` : ''}` : '';
      const name = `${template.replace('{v}', variant)} ${vendor}`;
      const [lo, hi] = def.priceRange;
      const price = Math.round((lo + rnd() * (hi - lo)) * 100) / 100;
      const stockRoll = rnd();
      const stock_count = stockRoll < 0.12 ? 0 : stockRoll < 0.3 ? Math.ceil(rnd() * 5) : Math.ceil(rnd() * 480);
      const img = IMAGES[(ci + i) % IMAGES.length];
      id += 1;
      products.push({
        id, sku: `ET-${String(ci + 1).padStart(2, '0')}${String(id).slice(-4)}`, name, vendor, price, stock_count,
        description: `${name}. Сертифицированная продукция для профессионального электромонтажа. Соответствует ГОСТ и ТУ производителя, поставляется с паспортом изделия. Цены и наличие обновляются ежедневно.`,
        weight: Math.round(rnd() * 5000) / 1000,
        dimensions: { l: Math.ceil(rnd() * 400), w: Math.ceil(rnd() * 200), h: Math.ceil(rnd() * 120) },
        images: [img, IMAGES[(ci + i + 2) % IMAGES.length], IMAGES[(ci + i + 4) % IMAGES.length]],
        params: [...params, { name: 'Производитель', value: vendor, unit: null }],
        category: { id: ci + 1, name: def.name, slug: def.slug },
        warehouse: { id: 1, city: 'Москва', name: 'Основной склад' },
        volume_prices: [
          { min_qty: 10, price: Math.round(price * 0.97 * 100) / 100 },
          { min_qty: 50, price: Math.round(price * 0.94 * 100) / 100 },
          { min_qty: 200, price: Math.round(price * 0.9 * 100) / 100 },
        ],
      });
    }
  });
  return products;
}

export const MOCK_PRODUCTS: ProductDetail[] = buildProducts();

export const MOCK_CATEGORIES: Category[] = CATEGORY_DEFS.map((def, i) => ({
  id: i + 1, name: def.name, slug: def.slug, sort_order: i + 1,
  product_count: MOCK_PRODUCTS.filter((p) => p.category.slug === def.slug).length,
}));

export function toListItem(p: ProductDetail): ProductListItem {
  return { id: p.id, sku: p.sku, name: p.name, price: p.price, stock_count: p.stock_count, image: p.images[0], category_slug: p.category.slug };
}
