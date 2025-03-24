/**
 * Типы статусов закупки
 */
export type PurchaseStatus = 'pending' | 'paid' | 'cancelled' | 'delivered' | 'completed' | 'draft';

/**
 * Типы валют
 */
export type Currency = 'EUR' | 'USD' | 'PLN';

/**
 * Интерфейс отдельной позиции закупки
 */
export interface PurchaseItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  // Опциональные поля
  sku?: string;
  category?: string;
  tax?: number;
  discount?: number;
}

/**
 * Интерфейс закупки
 */
export interface Purchase {
  id: string;
  date: string;
  invoiceNumber: string;
  description?: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: PurchaseStatus;
  createdAt?: string;
  updatedAt?: string;
  // Поле для связи с клиентом (в роли поставщика)
  client_id: number; // Сделаем обязательным, так как это основное поле
  // Опциональные поля
  paymentDate?: string;
  paymentMethod?: string;
  deliveryDate?: string;
  notes?: string;
  attachments?: string[];
  departmentId?: string;
  projectId?: string;
  taxAmount?: number;
  discountAmount?: number;
  currency?: Currency;
  exchangeRate?: number;
  archived?: boolean;
  warehouse_id?: number;
}

/**
 * Интерфейс для фильтрации закупок
 */
export interface PurchaseFilter {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: PurchaseStatus | '';
  client_id?: number;
  sortBy?: keyof Purchase;
  sortOrder?: 'asc' | 'desc';
  minAmount?: number;
  maxAmount?: number;
  departmentId?: string;
  projectId?: string;
  archived?: boolean;
  warehouse_id?: number;
}

/**
 * Интерфейс для создания закупки
 */
export type CreatePurchaseDto = Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Интерфейс для обновления закупки
 */
export type UpdatePurchaseDto = Partial<Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Интерфейс для создания позиции закупки
 */
export type CreatePurchaseItemDto = Omit<PurchaseItem, 'id'>;

/**
 * Интерфейс статистики по закупкам
 */
export interface PurchasesStats {
  totalCount: number;
  totalAmount: number;
  byStatus: Record<PurchaseStatus, { count: number; amount: number }>;
  byMonth: Array<{ month: string; count: number; amount: number }>;
}

/**
 * Перечисление для возможных действий с закупкой
 */
export enum PurchaseAction {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
  CHANGE_STATUS = 'change_status',
  PRINT = 'print',
  EXPORT = 'export',
  DUPLICATE = 'duplicate'
}

/**
 * Настройки печати PDF
 */
export interface PurchasePDFOptions {
  includeItems?: boolean;
  includeTotals?: boolean;
  language?: 'en' | 'ru' | 'de';
}

/**
 * Интерфейс для пропсов строки таблицы закупок
 */
export interface PurchasesRowProps {
  purchase: Purchase;
  supplierName: string;
  expanded?: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  formatDate?: (date: string) => string;
  formatAmount?: (amount: number) => string;
}

/**
 * Интерфейс для пропсов таблицы закупок
 */
export interface PurchasesTableProps {
  purchases: Purchase[];
  isLoading: boolean;
  error: Error | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onSearch?: (term: string) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onSort?: (field: keyof Purchase) => void;
}