// Единый слой обращения к REST API (`/api/...`).
// Каталог (категории/товары/поиск/фильтры) уже подключён к реальному
// бэкенду. Авторизация/заказы/доставка/счёт пока на мок-данных в
// localStorage — заменить на fetch по путям в комментариях, когда
// будут готовы соответствующие эндпоинты.

import { MOCK_PRODUCTS, toListItem } from '@/api/mockData';
import type {
  CartItemInput,
  Category,
  CreateOrderPayload,
  DeliveryOption,
  FilterFacet,
  Order,
  OrderStatus,
  ProductDetail,
  ProductListItem,
  ProductListQuery,
  ProductListResponse,
  RegisterPayload,
  User,
} from '@/api/types';

export { toListItem } from '@/api/mockData';

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms + Math.random() * 250));

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api/v1/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `API error ${res.status}`);
  }
  return res.json();
}

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// GET /api/categories
export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('categories');
}

// GET /api/products?category=&page=&per_page=&sort=&filter[param][]=value
export async function getProducts(query: ProductListQuery): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  if (query.category) params.set('category', query.category);
  if (query.page) params.set('page', String(query.page));
  if (query.per_page) params.set('per_page', String(query.per_page));
  if (query.sort) params.set('sort', query.sort);
  if (query.price_min != null) params.set('price_min', String(query.price_min));
  if (query.price_max != null) params.set('price_max', String(query.price_max));
  if (query.in_stock) params.set('in_stock', '1');
  if (query.filters) {
    for (const [name, values] of Object.entries(query.filters)) {
      for (const v of values) params.append(`filter[${name}][]`, v);
    }
  }
  return apiFetch<ProductListResponse>(`products?${params.toString()}`);
}

// GET /api/products/facets?category=
export async function getCategoryFacets(categorySlug: string): Promise<{
  facets: FilterFacet[];
  price_min: number;
  price_max: number;
}> {
  return apiFetch(`products/facets?category=${encodeURIComponent(categorySlug)}`);
}

// GET /api/products/{id}
export async function getProduct(id: number): Promise<ProductDetail | null> {
  try {
    return await apiFetch<ProductDetail>(`products/${id}`);
  } catch {
    return null;
  }
}

// Бэкенд пока не отдаёт товары пачкой по списку id — берём по одному.
// Нормально для корзины (единицы-десятки позиций), но при росте объёма
// стоит завести отдельный эндпоинт вида POST /api/products/batch.
export async function getProductsByIds(ids: number[]): Promise<ProductDetail[]> {
  const results = await Promise.all(ids.map((id) => getProduct(id)));
  return results.filter((p): p is ProductDetail => p !== null);
}

// Отдельного эндпоинта под точный поиск по артикулу нет — используем
// обычный поиск и ищем точное совпадение sku среди результатов.
export async function findProductBySku(sku: string): Promise<ProductListItem | null> {
  const { items } = await searchProducts(sku);
  const q = sku.trim().toLowerCase();
  return items.find((p) => p.sku.toLowerCase() === q) ?? null;
}

// GET /api/search?q=
export async function searchProducts(q: string): Promise<{ items: ProductListItem[] }> {
  const query = q.trim();
  if (!query) return { items: [] };
  return apiFetch(`search?q=${encodeURIComponent(query)}`);
}

// Реальной статистики популярности пока нет — используем сортировку
// по наличию как разумную замену, пока не появится счётчик продаж/просмотров.
export async function getPopularProducts(limit = 8): Promise<ProductListItem[]> {
  const { items } = await getProducts({ per_page: limit, sort: 'stock' });
  return items;
}

// Похожие товары — те же, что и в текущей категории, кроме самого товара.
export async function getRelatedProducts(productId: number, limit = 4): Promise<ProductListItem[]> {
  const product = await getProduct(productId);
  if (!product) return [];
  const { items } = await getProducts({ category: product.category.slug, per_page: limit + 1 });
  return items.filter((p) => p.id !== productId).slice(0, limit);
}

// ---------------- Auth (мок на localStorage) ----------------

const USERS_KEY = 'et_mock_users';
const SESSION_KEY = 'et_mock_session';

type StoredUser = User & { password: string };

export async function register(payload: RegisterPayload): Promise<User> {
  await delay();
  const users = readStore<StoredUser[]>(USERS_KEY, []);
  if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error('Пользователь с таким email уже зарегистрирован');
  }
  const user: StoredUser = {
    id: Date.now(),
    account_type: payload.account_type,
    email: payload.email,
    phone: payload.phone,
    name: payload.account_type === 'individual' ? (payload.name ?? '') : (payload.contact_person ?? ''),
    password: payload.password,
    ...(payload.account_type === 'legal_entity' ? {
      company: {
        org_name: payload.org_name ?? '', inn: payload.inn ?? '', kpp: payload.kpp ?? '',
        legal_address: payload.legal_address ?? '', contact_person: payload.contact_person ?? '',
      },
    } : {}),
  };
  users.push(user);
  writeStore(USERS_KEY, users);
  writeStore(SESSION_KEY, user.id);
  const { password: _pw, ...safe } = user;
  return safe;
}

export async function login(email: string, password: string): Promise<User> {
  await delay();
  const users = readStore<StoredUser[]>(USERS_KEY, []);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) throw new Error('Неверный email или пароль');
  writeStore(SESSION_KEY, user.id);
  const { password: _pw, ...safe } = user;
  return safe;
}

export async function getMe(): Promise<User | null> {
  await delay(100);
  const sessionId = readStore<number | null>(SESSION_KEY, null);
  if (!sessionId) return null;
  const users = readStore<StoredUser[]>(USERS_KEY, []);
  const user = users.find((u) => u.id === sessionId);
  if (!user) return null;
  const { password: _pw, ...safe } = user;
  return safe;
}

export async function logout(): Promise<void> {
  localStorage.removeItem(SESSION_KEY);
}

export async function updateProfile(patch: Partial<User>): Promise<User> {
  await delay();
  const sessionId = readStore<number | null>(SESSION_KEY, null);
  const users = readStore<StoredUser[]>(USERS_KEY, []);
  const idx = users.findIndex((u) => u.id === sessionId);
  if (idx === -1) throw new Error('Требуется вход в аккаунт');
  users[idx] = { ...users[idx], ...patch, company: patch.company ?? users[idx].company };
  writeStore(USERS_KEY, users);
  const { password: _pw, ...safe } = users[idx];
  return safe;
}

// ---------------- Счёт, доставка, заказы ----------------

export async function createInvoice(items: CartItemInput[], buyer: Record<string, string>): Promise<{ pdf_url: string }> {
  await delay(700);
  void buyer;
  const n = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
  return { pdf_url: `/api/invoices/${n}.pdf?items=${items.length}` };
}

export async function calculateDelivery(address: string, items: CartItemInput[]): Promise<{ options: DeliveryOption[] }> {
  await delay(600);
  const qty = items.reduce((s, i) => s + i.qty, 0);
  const base = 300 + qty * 12 + Math.min(address.length * 7, 400);
  return {
    options: [
      { carrier: 'Деловые Линии', service: 'До терминала', price: Math.round(base * 0.8), eta_days: 3 },
      { carrier: 'Деловые Линии', service: 'До двери', price: Math.round(base * 1.3), eta_days: 4 },
      { carrier: 'СДЭК', service: 'Склад–дверь', price: Math.round(base * 1.15), eta_days: 2 },
      { carrier: 'ПЭК', service: 'До терминала', price: Math.round(base * 0.72), eta_days: 5 },
    ],
  };
}

const ORDERS_KEY = 'et_mock_orders';

const STATUS_FLOW: OrderStatus[] = ['created', 'confirmed', 'handed_to_delivery', 'in_transit', 'delivered'];

export async function createOrder(payload: CreateOrderPayload): Promise<{ order_id: number; payment_redirect_url?: string }> {
  await delay(800);
  const orders = readStore<Order[]>(ORDERS_KEY, []);
  const id = Date.now();
  const products = MOCK_PRODUCTS.filter((p) => payload.items.some((i) => i.product_id === p.id));
  const items = payload.items.flatMap((i) => {
    const p = products.find((pp) => pp.id === i.product_id);
    if (!p) return [];
    return [{ product_id: p.id, sku: p.sku, name: p.name, price: p.price, qty: i.qty, image: p.images[0] }];
  });
  const items_total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const now = Date.now();
  const order: Order = {
    id,
    number: `ЭТ-${String(id).slice(-6)}`,
    created_at: new Date(now).toISOString(),
    status: 'confirmed',
    status_history: [
      { status: 'created', at: new Date(now).toISOString() },
      { status: 'confirmed', at: new Date(now + 60_000).toISOString() },
    ],
    items,
    items_total,
    delivery: { ...payload.delivery_option, address: payload.address },
    payment_method: payload.payment_method,
    total: items_total + payload.delivery_option.price,
  };
  orders.unshift(order);
  writeStore(ORDERS_KEY, orders);
  return { order_id: id };
}

export async function getOrders(): Promise<Order[]> {
  await delay(300);
  return readStore<Order[]>(ORDERS_KEY, []);
}

export async function getOrder(id: number): Promise<Order | null> {
  await delay(300);
  return readStore<Order[]>(ORDERS_KEY, []).find((o) => o.id === id) ?? null;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  created: 'Оформлен',
  confirmed: 'Подтверждён',
  handed_to_delivery: 'Передан в доставку',
  in_transit: 'В пути',
  delivered: 'Доставлен',
};

export const ORDER_STATUS_FLOW = STATUS_FLOW;
