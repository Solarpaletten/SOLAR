import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import PurchasesStatusBadge from '../../components/purchases/PurchasesStatusBadge';
import { Purchase, PurchaseStatus } from '../../types/purchasesTypes';
import purchasesService from '../../services/purchasesService';

const PurchasesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null
  );

  // Загрузка данных о закупке
  useEffect(() => {
    const fetchPurchase = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const purchaseData = await purchasesService.getPurchaseById(id);
        setPurchase(purchaseData);
      } catch (err: any) {
        console.error('Ошибка при загрузке данных о закупке:', err);
        setError(err.response?.data?.message || 'Не удалось загрузить данные о закупке');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchase();
  }, [id]);

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Форматирование суммы
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Обработчики действий
  const handleEdit = () => {
    navigate(`/purchases/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Вы уверены, что хотите удалить эту закупку?')) {
      return;
    }
    
    try {
      await purchasesService.deletePurchase(id);
      navigate('/purchases', { state: { message: 'Закупка успешно удалена' } });
    } catch (err: any) {
      console.error('Ошибка при удалении закупки:', err);
      setError(err.response?.data?.message || 'Не удалось удалить закупку');
    }
  };

  const handleChangeStatus = async (newStatus: PurchaseStatus) => {
    if (!id) return;
    
    try {
      const updatedPurchase = await purchasesService.updatePurchaseStatus(id, newStatus);
      setPurchase(updatedPurchase);
      setSuccessMessage('Статус закупки успешно обновлен');
      
      // Скрываем сообщение об успехе через 5 секунд
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      console.error('Ошибка при обновлении статуса закупки:', err);
      setError(err.response?.data?.message || 'Не удалось обновить статус закупки');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Отображение состояния загрузки
  if (isLoading) {
    return (
      <PageContainer
        title="Детали закупки"
        breadcrumbs={[
          { label: 'Главная', path: '/' },
          { label: 'Закупки', path: '/purchases' },
          { label: 'Загрузка...', path: `/purchases/${id}` }
        ]}
      >
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">Загрузка данных...</div>
        </div>
      </PageContainer>
    );
  }

  // Отображение ошибки, если закупка не найдена
  if (!purchase && !isLoading) {
    return (
      <PageContainer
        title="Ошибка"
        breadcrumbs={[
          { label: 'Главная', path: '/' },
          { label: 'Закупки', path: '/purchases' },
          { label: 'Ошибка', path: `/purchases/${id}` }
        ]}
      >
        <div className="p-4 bg-red-50 border border-red-300 rounded-md text-red-800">
          Закупка не найдена или произошла ошибка при загрузке данных.
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/purchases')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800"
          >
            Вернуться к списку закупок
          </button>
        </div>
      </PageContainer>
    );
  }

  // Основной рендер страницы
  return (
    <PageContainer
      title={`Закупка №${purchase?.invoiceNumber}`}
      breadcrumbs={[
        { label: 'Главная', path: '/' },
        { label: 'Закупки', path: '/purchases' },
        { label: `Закупка №${purchase?.invoiceNumber}`, path: `/purchases/${id}` }
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
      
      {/* Панель действий */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <div className="flex items-center">
          {purchase && <PurchasesStatusBadge status={purchase.status} />}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Редактировать
          </button>
          
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Печать
          </button>
          
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Удалить
          </button>
        </div>
      </div>
      
      {/* Выпадающий список для изменения статуса */}
      <div className="mb-6">
        <label htmlFor="status-change" className="block text-sm font-medium text-gray-700 mb-1">
          Изменить статус
        </label>
        <select
          id="status-change"
          value={purchase?.status || ''}
          onChange={(e) => handleChangeStatus(e.target.value as PurchaseStatus)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="pending">В обработке</option>
          <option value="paid">Оплачено</option>
          <option value="delivered">Доставлено</option>
          <option value="completed">Завершено</option>
          <option value="cancelled">Отменено</option>
        </select>
      </div>
      
      {/* Основная информация */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Информация о закупке</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Номер счета</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{purchase?.invoiceNumber}</dd>
            </div>
            <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Дата</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase?.date ? formatDate(purchase.date) : '-'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Поставщик</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{purchase?.vendor}</dd>
            </div>
            <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Статус</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase && <PurchasesStatusBadge status={purchase.status} />}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Общая сумма</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                {purchase ? formatCurrency(purchase.totalAmount) : '-'}
              </dd>
            </div>
            <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Дата создания</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase?.createdAt ? formatDate(purchase.createdAt) : '-'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Дата обновления</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase?.updatedAt ? formatDate(purchase.updatedAt) : '-'}
              </dd>
            </div>
            {purchase?.description && (
              <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Описание</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{purchase.description}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      
      {/* Список позиций */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Позиции закупки</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Описание
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Количество
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена за ед.
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchase?.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                    {item.description}
                    {item.sku && <div className="text-xs text-gray-500">SKU: {item.sku}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}
              {purchase?.items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Нет позиций в закупке
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <th colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  Итого:
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  {purchase ? formatCurrency(purchase.totalAmount) : '-'}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default PurchasesDetailPage;