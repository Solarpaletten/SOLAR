// f/src/pages/company/purchases/types/purchasesTypes.ts

export interface Purchase {
  id: number;
  company_id: number;
  purchase_number: string;
  date: string;
  supplier: string;
  supplier_id?: number;
  product: string;
  product_id?: number;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  currency: 'EUR' | 'USD' | 'PLN';
  status: 'pending' | 'completed' | 'cancelled' | 'processing';
  description?: string;
  vat_amount?: number;
  vat_rate?: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface PurchasesStats {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  processing: number;
  totalValue: number;
  suppliers: Array<{
    name: string;
    count: number;
    value: number;
  }>;
}

export interface PurchasesResponse {
  success: boolean;
  purchases: Purchase[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  companyId: number;
}

export interface PurchasesStatsResponse {
  success: boolean;
  stats: PurchasesStats;
  companyId: number;
}

export interface PurchasesTableProps {
  purchases: Purchase[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: number) => void;
}

export interface PurchaseFormData {
  purchase_number: string;
  date: string;
  supplier: string;
  supplier_id?: number;
  product: string;
  product_id?: number;
  quantity: number;
  unit: string;
  price: number;
  currency: 'EUR' | 'USD' | 'PLN';
  status: 'pending' | 'completed' | 'cancelled' | 'processing';
  description: string;
  vat_rate: number;
}

export interface PurchasesToolbarProps {
  onAddPurchase: () => void;
  onSearch: (term: string) => void;
  onStatusFilter: (status: string) => void;
  onSupplierFilter: (supplier: string) => void;
  searchTerm: string;
  statusFilter: string;
  supplierFilter: string;
  totalPurchases: number;
}

export interface AddPurchaseModalProps {
  onClose: () => void;
  onSubmit: (formData: PurchaseFormData) => Promise<void>;
}

export interface EditPurchaseModalProps {
  purchase: Purchase;
  onClose: () => void;
  onSubmit: (formData: PurchaseFormData) => Promise<void>;
}