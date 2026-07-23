export interface Category { id: number; name: string; slug: string; sort_order: number; product_count: number; }
export interface ProductListItem { id: number; sku: string; name: string; price: number; stock_count: number; image: string; category_slug: string; }
export interface ProductParam { name: string; value: string; unit: string | null; }
export interface ProductDetail {
  id: number; sku: string; name: string; vendor: string; price: number; stock_count: number;
  description: string; weight: number; dimensions: { l: number; w: number; h: number };
  images: string[]; params: ProductParam[];
  category: { id: number; name: string; slug: string };
  warehouse: { id: number; city: string; name: string };
  volume_prices: { min_qty: number; price: number }[];
}
export interface ProductListResponse { items: ProductListItem[]; total: number; page: number; per_page: number; }
export interface ProductListQuery {
  category?: string; page?: number; per_page?: number;
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'stock';
  filters?: Record<string, string[]>; price_min?: number; price_max?: number; in_stock?: boolean;
}
export interface FilterFacet { name: string; values: { value: string; count: number }[]; }
export type AccountType = 'individual' | 'legal_entity';
export interface User {
  id: number; account_type: AccountType; email: string; phone: string; name: string;
  company?: { org_name: string; inn: string; kpp: string; legal_address: string; contact_person: string; };
}
export interface CartItemInput { product_id: number; qty: number; }
export interface DeliveryOption { carrier: string; service: string; price: number; eta_days: number; }
export type OrderStatus = 'created' | 'confirmed' | 'handed_to_delivery' | 'in_transit' | 'delivered';
export interface OrderItem { product_id: number; sku: string; name: string; price: number; qty: number; image: string; }
export interface Order {
  id: number; number: string; created_at: string; status: OrderStatus;
  status_history: { status: OrderStatus; at: string }[];
  items: OrderItem[]; items_total: number;
  delivery: DeliveryOption & { address: string };
  payment_method: 'card' | 'sbp'; total: number;
}
export interface RegisterPayload {
  account_type: AccountType; email: string; phone: string; password: string;
  name?: string; org_name?: string; inn?: string; kpp?: string; legal_address?: string; contact_person?: string;
}
export interface CreateOrderPayload {
  items: CartItemInput[]; delivery_option: DeliveryOption; payment_method: 'card' | 'sbp';
  buyer: { name: string; phone: string; email: string; account_type: AccountType }; address: string;
}
