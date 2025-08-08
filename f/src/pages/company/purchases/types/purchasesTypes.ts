// 🛒 EXTENDED PURCHASES TYPES - v2.0 (Based on competitor analysis)
// f/src/pages/company/purchases/types/purchasesTypes.ts

export type Currency = 'EUR' | 'USD' | 'UAH' | 'AED' | 'PLN' | 'RUB';
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
export type DeliveryStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type DocumentStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED' | 'LOCKED';
export type PurchaseOperationType = 'PURCHASE' | 'RETURN';
export type VATClassification = 'STANDARD' | 'REDUCED' | 'ZERO' | 'EXEMPT';
export type DeliveryMethod = 'PICKUP' | 'DELIVERY' | 'COURIER' | 'POST' | 'DIGITAL';

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
  country?: string;
  city?: string;
  address?: string;
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
  vat_rate?: number;
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

// 📋 Purchase Item Interface - EXTENDED
export interface PurchaseItem {
  id?: number;
  purchase_id?: number;
  product_id: number;
  line_number?: number;
  quantity: number;
  unit_price_base: number;
  
  // 💰 FINANCIAL EXTENDED FIELDS
  advance_payment?: number;
  discount_percent?: number;
  discount_amount?: number;
  vat_rate?: number;
  vat_amount?: number;
  line_total: number;
  
  // 📊 BUSINESS EXTENDED FIELDS  
  business_license_code?: string;
  employee_id?: number;
  notes?: string;
  
  // Relations
  product?: Product;
  employee?: User;
}

// 🛒 Main Purchase Interface - EXTENDED
export interface Purchase {
  id: number;
  company_id: number;
  document_number: string;
  document_date: string;
  due_date?: string;
  operation_type: PurchaseOperationType;
  
  // 🏢 SUPPLIER & LOGISTICS
  supplier_id: number;
  supplier_code?: string;
  warehouse_id?: number;
  purchase_manager_id?: number;
  
  // 💰 FINANCIAL FIELDS
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  total_excl_vat?: number;
  advance_payment?: number;
  discount_percent?: number;
  discount_amount?: number;
  balance_amount?: number;
  currency: Currency;
  exchange_rate?: number;
  
  // 📊 EXTENDED BUSINESS FIELDS
  foreign_currency?: Currency;
  business_license_code?: string;
  estimated_vat?: number;
  vat_classification?: VATClassification;
  vat_date?: string;
  vat_comment?: string;
  
  // 🌍 GEOGRAPHIC & LOGISTICS
  country?: string;
  city?: string;
  delivery_method?: DeliveryMethod;
  
  // 📄 DOCUMENT & FILE MANAGEMENT
  file_count?: number;
  additional_expenses?: number;
  comments?: string;
  rounding_amount?: number;
  
  // 📊 STATUS FIELDS
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  document_status: DocumentStatus;
  locked?: boolean;
  locked_date?: string;
  locked_by?: number;
  
  // 🗓️ AUDIT FIELDS
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
  locker?: User;
  items?: PurchaseItem[];
}

// 📊 Statistics Interface - EXTENDED
export interface PurchasesStats {
  total: number;
  pending: number;
  paid: number;
  partial: number;
  overdue: number;
  cancelled: number;
  locked: number;
  totalSpent: number;
  averageOrderValue: number;
  topSuppliers: number;
  
  // 💰 EXTENDED FINANCIAL STATS
  totalVAT: number;
  totalDiscounts: number;
  advancePayments: number;
  pendingAmount: number;
  
  // 🌍 GEOGRAPHIC BREAKDOWN
  countriesCount: number;
  topCountries: Array<{ country: string; count: number; amount: number }>;
  
  // 📊 OPERATIONAL STATS
  averageProcessingTime: number;
  documentTypes: Array<{ type: string; count: number }>;
}

// 🔍 Extended Filter Interface
export interface PurchasesFilter {
  search?: string;
  status?: PaymentStatus;
  delivery_status?: DeliveryStatus;
  document_status?: DocumentStatus;
  supplier_id?: number;
  warehouse_id?: number;
  country?: string;
  city?: string;
  currency?: Currency;
  vat_classification?: VATClassification;
  date_from?: string;
  date_to?: string;
  amount_from?: number;
  amount_to?: number;
  locked?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// 📝 Extended Form Data Interface
export interface PurchaseFormData {
  document_number?: string;
  document_date: string;
  due_date?: string;
  operation_type: PurchaseOperationType;
  
  // SUPPLIER & LOGISTICS
  supplier_id: number;
  warehouse_id?: number;
  purchase_manager_id?: number;
  
  // FINANCIAL
  currency: Currency;
  foreign_currency?: Currency;
  exchange_rate?: number;
  advance_payment?: number;
  discount_percent?: number;
  
  // GEOGRAPHIC & BUSINESS
  country?: string;
  city?: string;
  business_license_code?: string;
  delivery_method?: DeliveryMethod;
  
  // STATUS
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  document_status: DocumentStatus;
  
  // ADDITIONAL
  comments?: string;
  additional_expenses?: number;
  vat_classification?: VATClassification;
  
  items: PurchaseItem[];
}

// 🏗️ TABLE COLUMN CONFIGURATION
export interface PurchaseTableColumn {
  key: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: number;
  type: 'text' | 'number' | 'date' | 'currency' | 'status' | 'actions';
}

// 📋 DEFAULT COLUMNS CONFIGURATION
export const DEFAULT_PURCHASE_COLUMNS: PurchaseTableColumn[] = [
  { key: 'document_date', label: 'Purchase date', visible: true, sortable: true, type: 'date' },
  { key: 'due_date', label: 'Due date', visible: true, sortable: true, type: 'date' },
  { key: 'document_number', label: 'Number', visible: true, sortable: true, type: 'text' },
  { key: 'supplier', label: 'Supplier', visible: true, sortable: true, type: 'text' },
  { key: 'warehouse', label: 'Warehouse', visible: true, sortable: false, type: 'text' },
  { key: 'supplier_code', label: 'Supplier code', visible: true, sortable: true, type: 'text' },
  { key: 'total_incl_vat', label: 'Total incl. VAT', visible: true, sortable: true, type: 'currency' },
  { key: 'total_excl_vat', label: 'Total excl. VAT', visible: false, sortable: true, type: 'currency' },
  { key: 'vat_amount', label: 'VAT, €', visible: false, sortable: true, type: 'currency' },
  { key: 'advance_payment', label: 'Adv. payment date', visible: false, sortable: true, type: 'date' },
  { key: 'discount_percent', label: 'Discount, %', visible: false, sortable: true, type: 'number' },
  { key: 'discount_amount', label: 'Discount, €', visible: false, sortable: true, type: 'currency' },
  { key: 'vat_date', label: 'VAT date', visible: false, sortable: true, type: 'date' },
  { key: 'vat_comment', label: 'VAT comment', visible: false, sortable: false, type: 'text' },
  { key: 'vat_classification', label: 'VAT classification', visible: false, sortable: true, type: 'text' },
  { key: 'balance_amount', label: 'Balance, €', visible: true, sortable: true, type: 'currency' },
  { key: 'exchange_rate', label: 'Exchange rate', visible: false, sortable: true, type: 'number' },
  { key: 'business_license_code', label: 'Business license', visible: true, sortable: false, type: 'text' },
  { key: 'comments', label: 'Comments', visible: false, sortable: false, type: 'text' },
  { key: 'locked', label: 'Locked', visible: false, sortable: true, type: 'status' },
  { key: 'payment_status', label: 'Status', visible: false, sortable: true, type: 'status' },
  { key: 'country', label: 'Country', visible: false, sortable: true, type: 'text' },
  { key: 'city', label: 'City', visible: false, sortable: true, type: 'text' },
  { key: 'file_count', label: 'File count', visible: false, sortable: true, type: 'number' },
  { key: 'additional_expenses', label: 'Additional expenses', visible: false, sortable: true, type: 'currency' },
  { key: 'estimated_vat', label: 'Estimated VAT', visible: false, sortable: true, type: 'currency' },
  { key: 'delivery_method', label: 'GPAIS delivery method', visible: false, sortable: false, type: 'text' },
  { key: 'rounding_amount', label: 'Rounding amount', visible: false, sortable: true, type: 'currency' },
  { key: 'actions', label: 'Actions', visible: true, sortable: false, type: 'actions' }
];

// 📋 EXTENDED CONSTANTS
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
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'LOCKED', label: 'Locked', color: 'bg-purple-100 text-purple-800' }
] as const;

export const CURRENCIES = [
  { value: 'EUR', label: '€ Euro', symbol: '€' },
  { value: 'USD', label: '$ US Dollar', symbol: '$' },
  { value: 'UAH', label: '₴ Ukrainian Hryvnia', symbol: '₴' },
  { value: 'AED', label: 'د.إ UAE Dirham', symbol: 'د.إ' },
  { value: 'PLN', label: 'zł Polish Zloty', symbol: 'zł' },
  { value: 'RUB', label: '₽ Russian Ruble', symbol: '₽' }
] as const;

export const VAT_CLASSIFICATIONS = [
  { value: 'STANDARD', label: 'Standard Rate', description: 'Standard VAT rate' },
  { value: 'REDUCED', label: 'Reduced Rate', description: 'Reduced VAT rate' },
  { value: 'ZERO', label: 'Zero Rate', description: 'Zero-rated VAT' },
  { value: 'EXEMPT', label: 'Exempt', description: 'VAT exempt' }
] as const;

export const DELIVERY_METHODS = [
  { value: 'PICKUP', label: 'Pickup', icon: '🏪' },
  { value: 'DELIVERY', label: 'Delivery', icon: '🚚' },
  { value: 'COURIER', label: 'Courier', icon: '🏃‍♂️' },
  { value: 'POST', label: 'Post', icon: '📮' },
  { value: 'DIGITAL', label: 'Digital', icon: '💻' }
] as const;

// 📡 API Response Interfaces (unchanged but extended)
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