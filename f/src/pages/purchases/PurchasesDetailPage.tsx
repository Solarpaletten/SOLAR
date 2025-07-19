import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import PurchasesStatusBadge from '../../components/purchases/PurchasesStatusBadge';
import { Purchase, PurchaseStatus } from '../../types/purchasesTypes';
import purchasesService from '../../services/purchasesService';
import clientsService from '../../services/clientsService';

const PurchasesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [supplierName, setSupplierName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null
  );

  useEffect(() => {
    const fetchPurchase = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const purchaseData = await purchasesService.getPurchaseById(id);
        setPurchase(purchaseData);

        // Получаем имя поставщика через client_id
        if (purchaseData.client_id) {
          try {
            const supplierData = await clientsService.getClientById(
              purchaseData.client_id
            );
            setSupplierName(
              supplierData ? supplierData.name : 'Неизвестный поставщик'
            );
          } catch (supplierErr) {
            console.error('Error loading supplier data:', supplierErr);
            setSupplierName('Неизвестный поставщик');
          }
        } else {
          setSupplierName('Неизвестный поставщик');
        }
      } catch (err: any) {
        console.error('Error loading purchase data:', err);
        setError(
          err.response?.data?.message || 'Не удалось загрузить данные закупки'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPurchase();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU').format(date);
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleEdit = () => {
    navigate(`/warehouse/purchases/edit/${id}`);
  };

  const handleArchive = async () => {
    if (
      !id ||
      !window.confirm('Вы уверены, что хотите архивировать эту закупку?')
    )
      return;
    try {
      await purchasesService.updatePurchase(id, { archived: true });
      navigate('/warehouse/purchases', {
        state: { message: 'Закупка успешно перемещена в архив' },
      });
    } catch (err: any) {
      console.error('Error archiving purchase:', err);
      setError(
        err.response?.data?.message || 'Не удалось архивировать закупку'
      );
    }
  };

  const handleChangeStatus = async (newStatus: PurchaseStatus) => {
    if (!id) return;
    try {
      const updatedPurchase = await purchasesService.updatePurchaseStatus(
        id,
        newStatus
      );
      setPurchase(updatedPurchase);
      setSuccessMessage('Статус закупки успешно обновлен');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || 'Не удалось обновить статус');
    }
  };

  const handleDownloadPDF = async () => {
    if (!id) return;
    try {
      const blob = await purchasesService.downloadPurchasePDF(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `закупка-${id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error downloading PDF:', err);
      setError(err.response?.data?.message || 'Не удалось скачать PDF');
    }
  };

  if (isLoading) {
    return (
      <PageContainer
        title="Детали закупки"
        breadcrumbs={[
          { label: 'Главная', path: '/' },
          { label: 'Закупки', path: '/warehouse/purchases' },
          { label: 'Загрузка...', path: `/warehouse/purchases/${id}` },
        ]}
      >
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">Загрузка данных...</div>
        </div>
      </PageContainer>
    );
  }

  if (!purchase && !isLoading) {
    return (
      <PageContainer
        title="Ошибка"
        breadcrumbs={[
          { label: 'Главная', path: '/' },
          { label: 'Закупки', path: '/warehouse/purchases' },
          { label: 'Ошибка', path: `/warehouse/purchases/${id}` },
        ]}
      >
        <div className="p-4 bg-red-50 border border-red-300 rounded-md text-red-800">
          Закупка не найдена или произошла ошибка при загрузке данных.
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/warehouse/purchases')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800"
          >
            Вернуться к списку закупок
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Закупка №${purchase?.invoiceNumber}`}
      breadcrumbs={[
        { label: 'Главная', path: '/' },
        { label: 'Закупки', path: '/warehouse/purchases' },
        {
          label: `Закупка №${purchase?.invoiceNumber}`,
          path: `/warehouse/purchases/${id}`,
        },
      ]}
    >
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-md text-green-800">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-md text-red-800">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Информация о закупке
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Подробные данные и статус документа
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Номер счета</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase?.invoiceNumber}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Поставщик</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {supplierName}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Дата</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase?.date ? formatDate(purchase.date) : '—'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Сумма</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase
                  ? formatCurrency(purchase.totalAmount, purchase.currency)
                  : '—'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Статус</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase?.status && (
                  <PurchasesStatusBadge status={purchase.status} />
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Описание</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase?.description || 'Нет описания'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Редактировать
        </button>
        <button
          onClick={handleArchive}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
        >
          Архивировать
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
        >
          Скачать PDF
        </button>
      </div>

      {purchase?.items && purchase.items.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Позиции закупки
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Описание
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Количество
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Цена
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Сумма
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchase.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(item.unitPrice, purchase.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(item.totalPrice, purchase.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-right text-sm font-medium text-gray-900"
                  >
                    Итого:
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {formatCurrency(purchase.totalAmount, purchase.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default PurchasesDetailPage;
