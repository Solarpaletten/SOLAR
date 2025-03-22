import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import purchasesService from '../../services/purchasesService';
import { Purchase, PurchaseFilter, PurchaseStatus } from '../../types/purchasesTypes';
import PurchasesTable from '../../components/purchases/PurchasesTable';
import PurchasesActions from '../../components/purchases/PurchasesActions';
import PurchasesSearch from '../../components/purchases/PurchasesSearch';
import PurchasesSummary from '../../components/purchases/PurchasesSummary';

const PurchasesPage: React.FC = () => {
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
const [vendorFilter, setVendorFilter] = useState<string>('');
const [vendors, setVendors] = useState<string[]>([]);
const [sortBy, setSortBy] = useState<keyof Purchase>('date');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const navigate = useNavigate();

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
        vendor: vendorFilter,
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
    const fetchVendors = async () => {
      try {
        const vendorsList = await purchasesService.getVendorsList();
        setVendors(vendorsList);
      } catch (err: any) {
        setError(new Error('Не удалось загрузить список поставщиков'));
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [searchTerm, statusFilter, archivedOnly, currentPage, itemsPerPage, startDate, endDate, vendorFilter, sortBy, sortOrder]);
  

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
  
  const handleVendorChange = (vendor: string) => {
    setVendorFilter(vendor);
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
      setSuccessMessage('Экспорт успешно завершён');
    } catch (error) {
      setError(new Error('Не удалось экспортировать данные'));
    }
  };

  const handleImport = async (file: File) => {
    try {
      await purchasesService.importPurchasesFromCSV(file);
      setSuccessMessage('Импорт завершён успешно');
      fetchPurchases();
    } catch (error) {
      setError(new Error('Не удалось импортировать файл'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await purchasesService.deletePurchase(id);
      setSuccessMessage('Закупка удалена');
      fetchPurchases();
    } catch (error) {
      setError(new Error('Ошибка при удалении'));
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
        <PurchasesSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div>
          <label className="text-sm mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="text-sm mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={vendorFilter}
          onChange={(e) => handleVendorChange(e.target.value)}
        >
          <option value="">Все поставщики</option>
          {vendors.map((vendor) => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value as PurchaseStatus | '')}
        >
          <option value="">Все статусы</option>
          <option value="pending">В обработке</option>
          <option value="paid">Оплачено</option>
          <option value="delivered">Доставлено</option>
          <option value="completed">Завершено</option>
          <option value="cancelled">Отменено</option>
          <option value="draft">Черновик</option>
        </select>
        <label className="text-sm flex items-center space-x-1">
          <input type="checkbox" checked={archivedOnly} onChange={() => setArchivedOnly(!archivedOnly)} />
          <span>Показать архивные</span>
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