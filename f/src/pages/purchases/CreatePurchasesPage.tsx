import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import PurchasesForm from '../../components/purchases/PurchasesForm';
import { Purchase, CreatePurchaseDto } from '../../types/purchasesTypes';
import purchasesService from '../../services/purchasesService';

const CreatePurchasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendors, setVendors] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Загрузка списка поставщиков для выпадающего списка
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // Здесь должен быть вызов API для получения списка поставщиков
        // Это заглушка, которую нужно заменить реальным вызовом
        // const response = await vendorService.getVendors();
        // setVendors(response.data);
        
        // Временная заглушка с примерами поставщиков
        setVendors([
          { id: '1', name: 'ООО "ТехноСнаб"' },
          { id: '2', name: 'ИП Иванов А.А.' },
          { id: '3', name: 'АО "Комплект"' },
          { id: '4', name: 'ООО "Офис-Мастер"' }
        ]);
      } catch (err) {
        console.error('Ошибка при загрузке списка поставщиков:', err);
        setError('Не удалось загрузить список поставщиков. Пожалуйста, попробуйте позже.');
      }
    };

    fetchVendors();
  }, []);

  // Обработка отправки формы
  const handleSubmit = async (formData: Purchase) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Преобразуем данные формы в DTO для создания
      const purchaseDto: CreatePurchaseDto = {
        date: formData.date,
        invoiceNumber: formData.invoiceNumber,
        vendor: formData.vendor,
        description: formData.description,
        items: formData.items,
        totalAmount: formData.totalAmount,
        status: formData.status,
        // Дополнительные поля
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        departmentId: formData.departmentId,
        projectId: formData.projectId
      };

      // Вызов сервиса для создания закупки
      const createdPurchase = await purchasesService.createPurchase(purchaseDto);
      
      // Перенаправление на страницу созданной закупки
      navigate(`/purchases/${createdPurchase.id}`, { 
        state: { message: 'Закупка успешно создана' } 
      });
    } catch (err: any) {
      console.error('Ошибка при создании закупки:', err);
      setError(err.response?.data?.message || 'Произошла ошибка при создании закупки. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработка отмены
  const handleCancel = () => {
    navigate('/purchases');
  };

  return (
    <PageContainer
      title="Создание новой закупки"
      breadcrumbs={[
        { label: 'Главная', path: '/' },
        { label: 'Закупки', path: '/purchases' },
        { label: 'Создание закупки', path: '/purchases/create' }
      ]}
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-md text-red-800">
          {error}
        </div>
      )}

      <PurchasesForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        vendors={vendors}
      />
    </PageContainer>
  );
};

export default CreatePurchasesPage;