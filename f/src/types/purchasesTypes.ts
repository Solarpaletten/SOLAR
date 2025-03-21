/**
 * Типы статусов закупки
 */
export type PurchaseStatus = 'pending' | 'paid' | 'cancelled' | 'delivered' | 'completed' | 'draft';

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
  vendor: string;
  description?: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: PurchaseStatus;
  createdAt: string;
  updatedAt: string;
  // Опциональные поля
  paymentDate?: string;
  paymentMethod?: string;
  deliveryDate?: string;
  notes?: string;
  attachments?: string[];
  vendorId?: string;
  departmentId?: string;
  projectId?: string;
  taxAmount?: number;
  discountAmount?: number;
  currency?: string;
  exchangeRate?: number;
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
  vendor?: string;
  sortBy?: keyof Purchase;
  sortOrder?: 'asc' | 'desc';
  minAmount?: number;
  maxAmount?: number;
  departmentId?: string;
  projectId?: string;
}

/**
 * Интерфейс для поставщика
 */
export interface Vendor {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  bankDetails?: string;
  notes?: string;
  isActive: boolean;
}

/**
 * Интерфейс для создания закупки (без служебных полей)
 */
export type CreatePurchaseDto = Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Интерфейс для обновления закупки (все поля опциональны)
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
 * Интерфейс событий закупки для журнала
 */
export interface PurchaseEvent {
  id: string;
  purchaseId: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
  };
  type: 'create' | 'update' | 'delete' | 'status_change';
  details: {
    field?: string;
    oldValue?: any;
    newValue?: any;
    message?: string;
  };
}

/**
 * Интерфейс пропсов для компонента PurchasesTable
 */
export interface PurchasesTableProps {
  purchases: Purchase[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onSearch?: (search: string) => void;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onExport?: () => void;
  onImport?: (file: File) => void;
}

/**
 * Интерфейс пропсов для компонента PurchasesRow
 */
export interface PurchasesRowProps {
  purchase: Purchase;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

/**
 * Интерфейс пропсов для компонента PurchasesSearch
 */
export interface PurchasesSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  debounceTime?: number;
}

/**
 * Интерфейс пропсов для компонента PurchasesActions
 */
export interface PurchasesActionsProps {
  onCreateNew: () => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectedItems?: string[];
  hasExportFeature?: boolean;
  hasImportFeature?: boolean;
  hasBulkActions?: boolean;
}

/**
 * Интерфейс пропсов для компонента PurchasesPagination
 */
export interface PurchasesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

/**
 * Интерфейс пропсов для компонента PurchasesSummary
 */
export interface PurchasesSummaryProps {
  totalAmount: number;
  count: number;
  periodStart?: Date;
  periodEnd?: Date;
  currency?: string;
}

/**
 * Интерфейс пропсов для компонента PurchasesStatusBadge
 */
export interface PurchasesStatusBadgeProps {
  status: PurchaseStatus;
}

/**
 * Интерфейс пропсов для компонента PurchasesForm
 */
export interface PurchasesFormProps {
  initialData?: Purchase;
  onSubmit: (data: Purchase) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  vendors?: { id: string; name: string }[];
}

/**
 * Интерфейс пропсов для компонента PurchasesItemRow
 */
export interface PurchasesItemRowProps {
  item: PurchaseItem;
  onItemChange: (itemId: string, field: keyof PurchaseItem, value: any) => void;
  onRemoveItem: (itemId: string) => void;
}

/**
 * Интерфейс результата хука useFetchPurchases
 */
export interface UseFetchPurchasesResult {
  purchases: Purchase[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  fetchPurchases: (filters?: PurchaseFilter) => Promise<void>;
  refetch: () => Promise<void>;
}