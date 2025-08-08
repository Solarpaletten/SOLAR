// 🛒 PURCHASES TYPES - На основе Prisma Schema

export type Currency = 'EUR' | 'USD' | 'UAH' | 'AED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
export type DeliveryStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type DocumentStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';
export type PurchaseOperationType = 'PURCHASE' | 'RETURN';

// 🏢 Supplier (Client) Interface
export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  registration_number?: string;
  vat_number?: string;
  is_active: boolean;
}

// 📦 Product Interface
export interface Product {
  id: number;
  code: string;
  name: string;
  unit: string;
  price: number;
  cost_price?: number;
  currency: Currency;
  is_active: boolean;
}

// 🏭 Warehouse Interface
export interface Warehouse {
  id: number;
  name: string;
  code?: string;
  address?: string;
  is_active: boolean;
}

// 👤 User Interface
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

// 📋 Purchase Item Interface
export interface PurchaseItem {
  id?: number;
  purchase_id?: number;
  product_id: number;
  line_number?: number;
  quantity: number;
  unit_price_base: number;
  vat_rate?: number;
  vat_amount?: number;
  line_total: number;
  employee_id?: number;
  notes?: string;
  
  // Relations
  product?: Product;
  employee?: User;
}

// 🛒 Main Purchase Interface
export interface Purchase {
  id: number;
  company_id: number;
  document_number: string;
  document_date: string;
  operation_type: PurchaseOperationType;
  
  supplier_id: number;
  warehouse_id?: number;
  purchase_manager_id?: number;
  
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  currency: Currency;
  
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  document_status: DocumentStatus;
  
  created_by: number;
  created_at: string;
  updated_by?: number;
  updated_at: string;
  
  // Relations
  supplier?: Supplier;
  warehouse?: Warehouse;
  purchase_manager?: User;
  creator?: User;
  modifier?: User;
  items?: PurchaseItem[];
}

// 📊 Statistics Interface
export interface PurchasesStats {
  total: number;
  pending: number;
  paid: number;
  partial: number;
  overdue: number;
  cancelled: number;
  totalSpent: number;
  averageOrderValue: number;
  topSuppliers: number;
}

// 🔍 Filter Interface
export interface PurchasesFilter {
  search?: string;
  status?: PaymentStatus;
  supplier_id?: number;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// 📝 Form Data Interfaces
export interface PurchaseFormData {
  document_number?: string;
  document_date: string;
  operation_type: PurchaseOperationType;
  supplier_id: number;
  warehouse_id?: number;
  purchase_manager_id?: number;
  currency: Currency;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  document_status: DocumentStatus;
  items: PurchaseItem[];
}

// 📡 API Response Interfaces
export interface PurchasesResponse {
  success: boolean;
  purchases: Purchase[];
  total: number;
  page: number;
  limit: number;
  companyId: number;
}

export interface PurchaseResponse {
  success: boolean;
  purchase: Purchase;
  companyId: number;
}

export interface PurchasesStatsResponse {
  success: boolean;
  stats: PurchasesStats;
  companyId: number;
}

export interface CreatePurchaseResponse {
  success: boolean;
  purchase: Purchase;
  message: string;
  companyId: number;
}

// 📋 Constants
export const PAYMENT_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'PAID', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'PARTIAL', label: 'Partial', color: 'bg-blue-100 text-blue-800' },
  { value: 'OVERDUE', label: 'Overdue', color: 'bg-red-100 text-red-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' }
] as const;

export const DELIVERY_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' }
] as const;

export const DOCUMENT_STATUSES = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
] as const;

export const CURRENCIES = [
  { value: 'EUR', label: '€ Euro', symbol: '€' },
  { value: 'USD', label: '$ US Dollar', symbol: '$' },
  { value: 'UAH', label: '₴ Ukrainian Hryvnia', symbol: '₴' },
  { value: 'AED', label: 'د.إ UAE Dirham', symbol: 'د.إ' }
] as const;

