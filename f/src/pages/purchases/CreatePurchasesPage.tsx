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

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setVendors([
          { id: '1', name: 'ASSET LOGISTICS GMBH' },
          { id: '2', name: 'SWAPOIL GMBH' },
          { id: '3', name: 'ASSET BILANS SPOLKA Z O O' },
          { id: '4', name: 'RAPSOIL OU' }
        ]);
      } catch (err) {
        console.error('Ошибка при загрузке списка поставщиков:', err);
        setError('Не удалось загрузить список поставщиков. Пожалуйста, попробуйте позже.');
      }
    };
    fetchVendors();
  }, []);

  const handleSubmit = async (formData: Purchase) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const purchaseDto: CreatePurchaseDto = {
        date: formData.date,
        invoiceNumber: formData.invoiceNumber,
        vendor: formData.vendor,
        description: formData.description,
        items: formData.items,
        totalAmount: formData.totalAmount,
        status: formData.status,
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
        vendors={vendors}
      />
    </PageContainer>
  );
};

export default CreatePurchasesPage;
