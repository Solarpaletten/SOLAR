import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import purchasesService from '../../services/purchasesService';
import clientsService, {
  Client,
  ClientRole,
} from '../../services/clientsService';
import {
  Purchase,
  PurchaseFilter,
  PurchaseStatus,
} from '../../types/purchasesTypes';
import PurchasesTable from '../../components/purchases/PurchasesTable';
import PurchasesActions from '../../components/purchases/PurchasesActions';
import PurchasesSearch from '../../components/purchases/PurchasesSearch';
import PurchasesSummary from '../../components/purchases/PurchasesSummary';
import { useTranslation } from 'react-i18next';

const PurchasesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | ''>('');
  const [archivedOnly, setArchivedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [supplierFilter, setSupplierFilter] = useState<number | null>(null);
  const [suppliers, setSuppliers] = useState<Client[]>([]);
  const [sortBy, setSortBy] = useState<keyof Purchase>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchPurchases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: PurchaseFilter = {
        search: searchTerm,
        status: statusFilter,
        page: currentPage,
        limit: itemsPerPage,
        startDate: startDate,
        endDate: endDate,
        client_id: supplierFilter || undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };
      const response = await purchasesService.getPurchases(filters);
      console.log('API response:', response);

      const purchaseData = response.data.data || [];
      const filtered = archivedOnly
        ? purchaseData.filter((p) => p.archived)
        : purchaseData.filter((p) => !p.archived);

      setPurchases(filtered);
      setTotalItems(response.data.totalCount || filtered.length);
      const total = filtered.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
      setTotalAmount(total);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliersList = await clientsService.getSuppliersList();
        setSuppliers(suppliersList);
      } catch (err: any) {
        setError(new Error(t('Failed to load suppliers list')));
      }
    };
    fetchSuppliers();
  }, [t]);

  useEffect(() => {
    fetchPurchases();
  }, [
    searchTerm,
    statusFilter,
    archivedOnly,
    currentPage,
    itemsPerPage,
    startDate,
    endDate,
    supplierFilter,
    sortBy,
    sortOrder,
  ]);

  const handleCreate = () => {
    navigate('/warehouse/purchases/create');
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    setCurrentPage(1);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    setCurrentPage(1);
  };

  const handleSupplierChange = (supplierId: string) => {
    setSupplierFilter(supplierId ? parseInt(supplierId) : null);
    setCurrentPage(1);
  };

  const handleSort = (field: keyof Purchase) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      await purchasesService.exportPurchasesToCSV();
      setSuccessMessage(t('exportSuccess'));
    } catch (error) {
      setError(new Error(t('exportError')));
    }
  };

  const handleImport = async (file: File) => {
    try {
      await purchasesService.importPurchasesFromCSV(file);
      setSuccessMessage(t('importSuccess'));
      fetchPurchases();
    } catch (error) {
      setError(new Error(t('importError')));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await purchasesService.deletePurchase(id);
      setSuccessMessage(t('purchaseDeleted'));
      fetchPurchases();
    } catch (error) {
      setError(new Error(t('deleteError')));
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/warehouse/purchases/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/warehouse/purchases/${id}`);
  };

  const handleStatusChange = (status: PurchaseStatus | '') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="p-2 text-sm text-green-700 bg-green-100 border border-green-300 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
          {error.message}
        </div>
      )}
      <PurchasesActions
        onCreateNew={handleCreate}
        onExport={handleExport}
        onImport={handleImport}
      />
      <div className="flex flex-wrap gap-2 items-center">
        <PurchasesSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <div>
          <label className="text-sm mr-2">{t('startDate')}:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="text-sm mr-2">{t('endDate')}:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={supplierFilter || ''}
          onChange={(e) => handleSupplierChange(e.target.value)}
        >
          <option value="">{t('allSuppliers')}</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={statusFilter}
          onChange={(e) =>
            handleStatusChange(e.target.value as PurchaseStatus | '')
          }
        >
          <option value="">{t('allStatuses')}</option>
          <option value="pending">{t('pending')}</option>
          <option value="paid">{t('paid')}</option>
          <option value="delivered">{t('delivered')}</option>
          <option value="completed">{t('completed')}</option>
          <option value="cancelled">{t('cancelled')}</option>
          <option value="draft">{t('draft')}</option>
        </select>
        <label className="text-sm flex items-center space-x-1">
          <input
            type="checkbox"
            checked={archivedOnly}
            onChange={() => setArchivedOnly(!archivedOnly)}
          />
          <span>{t('showArchived')}</span>
        </label>
      </div>
      <PurchasesTable
        purchases={purchases}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onSearch={setSearchTerm}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onSort={handleSort}
      />
      <PurchasesSummary purchases={purchases} />
    </div>
  );
};

export default PurchasesPage;
