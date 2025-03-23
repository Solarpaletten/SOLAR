import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import PurchasesForm from '../../components/purchases/PurchasesForm';
import { Purchase, UpdatePurchaseDto } from '../../types/purchasesTypes';
import purchasesService from '../../services/purchasesService';

const EditPurchasesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [vendors, setVendors] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          throw new Error('ID закупки не указан');
        }

        const purchaseData = await purchasesService.getPurchaseById(id);
        setPurchase(purchaseData);

        setVendors([
          { id: '1', name: 'ASSET LOGISTICS GMBH' },
          { id: '2', name: 'SWAPOIL GMBH' },
          { id: '3', name: 'ASSET BILANS SPOLKA Z O O' },
          { id: '4', name: 'RAPSOIL OU' }
        ]);
      } catch (err: any) {
        console.error('Ошибка при загрузке данных:', err);
        setError(err.response?.data?.message || 'Произошла ошибка при загрузке данных. Пожалуйста, попробуйте еще раз.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (formData: Purchase) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const purchaseDto: UpdatePurchaseDto = {
        date: formData.date,
        invoiceNumber: formData.invoiceNumber,
        vendorId: formData.vendor,
        description: formData.description,
        items: formData.items,
        totalAmount: formData.totalAmount,
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        departmentId: formData.departmentId,
        projectId: formData.projectId
      };

      const updatedPurchase = await purchasesService.updatePurchase(id, purchaseDto);

      navigate(`/warehouse/purchases/${updatedPurchase.id}`, {
        state: { message: 'Закупка успешно обновлена' }
      });
    } catch (err: any) {
      console.error('Ошибка при обновлении закупки:', err);
      setError(err.response?.data?.message || 'Произошла ошибка при обновлении закупки. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/warehouse/purchases');
  };

  if (isLoading) {
    return (
      <PageContainer
        title="Редактирование закупки"
        breadcrumbs={[
          { label: 'Главная', path: '/' },
          { label: 'Закупки', path: '/warehouse/purchases' },
          { label: 'Редактирование', path: `/warehouse/purchases/edit/${id}` }
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
          { label: 'Ошибка', path: `/warehouse/purchases/edit/${id}` }
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
      title={`Редактирование закупки №${purchase?.invoiceNumber}`}
      breadcrumbs={[
        { label: 'Главная', path: '/' },
        { label: 'Закупки', path: '/warehouse/purchases' },
        { label: `Закупка №${purchase?.invoiceNumber}`, path: `/warehouse/purchases/${id}` },
        { label: 'Редактирование', path: `/warehouse/purchases/edit/${id}` }
      ]}
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-md text-red-800">
          {error}
        </div>
      )}

      {purchase && (
        <PurchasesForm
          initialData={purchase}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          vendors={vendors}
        />
      )}
    </PageContainer>
  );
};

export default EditPurchasesPage;
