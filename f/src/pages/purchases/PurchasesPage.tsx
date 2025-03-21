import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import PurchasesTable from '../../components/purchases/PurchasesTable';
import { PurchaseFilter, PurchaseStatus, Purchase } from '../../types/purchasesTypes';
import purchasesService from '../../services/purchasesService';

// Реальные данные с вашими клиентами
const realPurchases = [
  {
    id: '3',
    date: '2023-03-05',
    invoiceNumber: 'INV-003',
    vendor: 'ASSET LOGISTICS GMBH',
    description: 'Логистические услуги',
    items: [],
    totalAmount: 75000.00,
    status: 'delivered' as PurchaseStatus,
    createdAt: '2023-03-05T10:00:00Z',
    updatedAt: '2023-03-05T10:00:00Z',
  },
  {
    id: '2',
    date: '2023-02-20',
    invoiceNumber: 'INV-002',
    vendor: 'SWAPOIL GMBH',
    description: 'Нефтепродукты',
    items: [],
    totalAmount: 5000.00,
    status: 'pending' as PurchaseStatus,
    createdAt: '2023-02-20T10:00:00Z',
    updatedAt: '2023-02-20T10:00:00Z',
  },
  {
    id: '1',
    date: '2023-01-15',
    invoiceNumber: 'INV-001',
    vendor: 'ASSET BILANS SPOLKA Z O O',
    description: 'Консультационные услуги',
    items: [],
    totalAmount: 15000.00,
    status: 'paid' as PurchaseStatus,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  }
];

const PurchasesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Состояние фильтров
  const [filters, setFilters] = useState<PurchaseFilter>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  
  // Состояние загрузки и данных
  const [purchases, setPurchases] = useState<Purchase[]>(realPurchases);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(realPurchases.length);
  
  // Получение сообщения из состояния навигации
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null
  );
  
  // Загрузка данных при монтировании и изменении фильтров
  useEffect(() => {
    const fetchPurchases = async () => {
      setIsLoading(true);
      try {
        // В реальном приложении здесь будет вызов API
        // const response = await purchasesService.getPurchases(filters);
        // setPurchases(response.data);
        // setTotalCount(response.totalCount);
        
        // Для демонстрации используем данные из realPurchases
        console.log('Fetching purchases with filters:', filters);
        
        // Имитация фильтрации
        let filteredData = [...realPurchases];
        
        // Фильтрация по поиску
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(purchase => 
            purchase.vendor.toLowerCase().includes(searchLower) ||
            purchase.invoiceNumber.toLowerCase().includes(searchLower) ||
            (purchase.description?.toLowerCase() || '').includes(searchLower)
          );
        }
        
        // Фильтрация по статусу
        if (filters.status) {
          filteredData = filteredData.filter(purchase => purchase.status === filters.status);
        }
        
        // Фильтрация по датам
        if (filters.startDate && filters.endDate) {
          const startDate = new Date(filters.startDate);
          const endDate = new Date(filters.endDate);
          filteredData = filteredData.filter(purchase => {
            const purchaseDate = new Date(purchase.date);
            return purchaseDate >= startDate && purchaseDate <= endDate;
          });
        }
        
        // Имитация сортировки
        if (filters.sortBy && filters.sortOrder) {
          filteredData.sort((a, b) => {
            const aValue = a[filters.sortBy as keyof Purchase];
            const bValue = b[filters.sortBy as keyof Purchase];
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return filters.sortOrder === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }
            
            if (typeof aValue === 'number' && typeof bValue === 'number') {
              return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            return 0;
          });
        }
        
        setPurchases(filteredData);
        setTotalCount(filteredData.length);
        setError(null);
      } catch (err: any) {
        console.error('Ошибка при загрузке закупок:', err);
        setError(err.message || 'Произошла ошибка при загрузке закупок');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPurchases();
  }, [filters]);
  
  // Функция для повторной загрузки данных
  const refetch = () => {
    // Просто триггерим повторный рендер с тем же фильтром
    setFilters({...filters});
  };
  
  // Очистка сообщения об успехе через 5 секунд
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        
        // Очистка состояния навигации
        if (location.state?.message) {
          navigate(location.pathname, { replace: true });
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate, location]);
  
  // Обработчик изменения фильтров
  const handleFilterChange = (newFilters: Partial<PurchaseFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    // При изменении фильтров сбрасываем на первую страницу
    if (newFilters.search !== undefined || 
        newFilters.startDate !== undefined || 
        newFilters.endDate !== undefined || 
        newFilters.status !== undefined || 
        newFilters.vendor !== undefined) {
      updatedFilters.page = 1;
    }
    
    setFilters(updatedFilters);
  };
  
  // Обработчики действий с закупками
  const handleEdit = (id: string) => {
    navigate(`/warehouse/purchases/edit/${id}`);
  };
  
  const handleView = (id: string) => {
    navigate(`/warehouse/purchases/${id}`);
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту закупку?')) {
      return;
    }
    
    try {
      // В реальном приложении здесь будет вызов API
      // await purchasesService.deletePurchase(id);
      
      // Имитация удаления
      setPurchases(purchases.filter(purchase => purchase.id !== id));
      setTotalCount(prev => prev - 1);
      
      setSuccessMessage('Закупка успешно удалена');
    } catch (err: any) {
      console.error('Ошибка при удалении закупки:', err);
      setError(err.message || 'Не удалось удалить закупку');
    }
  };
  
  // Обработчик экспорта в CSV
  const handleExport = async () => {
    try {
      // В реальном приложении здесь будет вызов API
      // const blob = await purchasesService.exportPurchasesToCSV(filters);
      
      // Имитация экспорта
      console.log('Exporting purchases to CSV with filters:', filters);
      
      setSuccessMessage('Данные успешно экспортированы в CSV');
    } catch (err: any) {
      console.error('Ошибка при экспорте в CSV:', err);
      setError(err.message || 'Не удалось экспортировать данные');
    }
  };
  
  // Обработчик импорта из CSV
  const handleImport = async (file: File) => {
    try {
      // В реальном приложении здесь будет вызов API
      // const result = await purchasesService.importPurchasesFromCSV(file);
      
      // Имитация импорта
      console.log('Importing purchases from CSV:', file.name);
      
      setSuccessMessage(`Импорт успешно завершен. Импортировано записей: 5, ошибок: 0`);
      refetch();
    } catch (err: any) {
      console.error('Ошибка при импорте из CSV:', err);
      setError(err.message || 'Не удалось импортировать данные');
    }
  };
  
  // Фильтр по статусу
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | ''>('');
  
  // Обработчик изменения фильтра по статусу
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as PurchaseStatus | '';
    setStatusFilter(status);
    handleFilterChange({ status });
  };
  
  // Фильтр по периоду
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: ''
  });
  
  // Обработчик изменения фильтра по периоду
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedDateRange = { ...dateRange, [name]: value };
    setDateRange(updatedDateRange);
    
    // Обновляем фильтры только если оба поля заполнены или оба пусты
    if ((updatedDateRange.startDate && updatedDateRange.endDate) || 
        (!updatedDateRange.startDate && !updatedDateRange.endDate)) {
      handleFilterChange(updatedDateRange);
    }
  };
  
  // Сброс всех фильтров
  const handleResetFilters = () => {
    setStatusFilter('');
    setDateRange({ startDate: '', endDate: '' });
    
    const resetFilters: PurchaseFilter = {
      page: 1,
      limit: filters.limit,
      search: '',
      sortBy: 'date',
      sortOrder: 'desc'
    };
    
    setFilters(resetFilters);
  };
  
  return (
    <PageContainer
      title="Закупки"
      breadcrumbs={[
        { label: 'Главная', path: '/' },
        { label: 'Закупки', path: '/warehouse/purchases' }
      ]}
    >
      {/* Сообщение об успехе */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-md text-green-800">
          {successMessage}
        </div>
      )}
      
      {/* Сообщение об ошибке */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-md text-red-800">
          {error}
        </div>
      )}
      
      {/* Фильтры */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="text-lg font-medium mb-3">Фильтры</div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Фильтр по статусу */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Все статусы</option>
              <option value="pending">В обработке</option>
              <option value="paid">Оплачено</option>
              <option value="delivered">Доставлено</option>
              <option value="completed">Завершено</option>
              <option value="cancelled">Отменено</option>
            </select>
          </div>
          
          {/* Фильтр по периоду */}
          <div>
            <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
              Дата с
            </label>
            <input
              type="date"
              id="date-from"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
              Дата по
            </label>
            <input
              type="date"
              id="date-to"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md mr-2"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
      
      {/* Таблица закупок */}
      <PurchasesTable
        purchases={purchases}
        isLoading={isLoading}
        error={error ? new Error(error) : null}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onSearch={(search) => handleFilterChange({ search })}
        onPageChange={(page) => handleFilterChange({ page })}
        onItemsPerPageChange={(limit) => handleFilterChange({ limit })}
        onSort={(field, direction) => handleFilterChange({ 
          sortBy: field as keyof Purchase, 
          sortOrder: direction 
        })}
        currentPage={filters.page || 1}
        totalItems={totalCount}
        itemsPerPage={filters.limit || 10}
        onExport={handleExport}
        onImport={handleImport}
      />
    </PageContainer>
  );
};

export default PurchasesPage;