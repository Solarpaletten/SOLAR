import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import PurchasesForm from '../../components/purchases/PurchasesForm';
import { Purchase, CreatePurchaseDto } from '../../types/purchasesTypes';
import purchasesService from '../../../../services/purchasesService';
import clientsService, { Client } from '../../../../services/clientsService';

const CreatePurchasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Загружаем только поставщиков (роль SUPPLIER)
        const suppliersList = await clientsService.getSuppliersList();
        setSuppliers(suppliersList);
      } catch (err) {
        console.error('Ошибка при загрузке списка поставщиков:', err);
        setError('Не удалось загрузить список поставщиков. Пожалуйста, попробуйте позже.');
      }
    };
    fetchSuppliers();
  }, []);

  const handleSubmit = async (formData: Purchase) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const purchaseDto: CreatePurchaseDto = {
        date: formData.date,
        invoiceNumber: formData.invoiceNumber,
        client_id: formData.client_id,
        description: formData.description,
        items: formData.items || [],
        totalAmount: formData.totalAmount,
        status: formData.status,
        currency: formData.currency,
        // Опциональные поля
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        departmentId: formData.departmentId,
        projectId: formData.projectId
      };

      const createdPurchase = await purchasesService.createPurchase(purchaseDto);

      navigate(`/warehouse/purchases/${createdPurchase.id}`, {
        state: { message: 'Закупка успешно создана' }
      });
    } catch (err: any) {
      console.error('Ошибка при создании закупки:', err);
      setError(
        err.response?.data?.message ||
          'Произошла ошибка при создании закупки. Пожалуйста, попробуйте еще раз.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/warehouse/purchases');
  };

  return (
    <PageContainer
      title="Создание новой закупки"
      breadcrumbs={[
        { label: 'Главная', path: '/' },
        { label: 'Закупки', path: '/warehouse/purchases' },
        { label: 'Создание закупки', path: '/warehouse/purchases/create' }
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
        suppliers={suppliers}
      />
    </PageContainer>
  );
};

export default CreatePurchasesPage;