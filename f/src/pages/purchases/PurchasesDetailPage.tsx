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

  useEffect(() => {
    const fetchPurchase = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const purchaseData = await purchasesService.getPurchaseById(id);
        setPurchase(purchaseData);
      } catch (err: any) {
        console.error('Error loading purchase data:', err);
        setError(err.response?.data?.message || 'Failed to load purchase data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPurchase();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB').format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleEdit = () => {
    navigate(`/purchases/edit/${id}`);
  };

  const handleArchive = async () => {
    if (!id || !window.confirm('Are you sure you want to archive this purchase?')) return;
    try {
      await purchasesService.updatePurchase(id, { archived: true });
      navigate('/purchases', { state: { message: 'Purchase archived successfully' } });
    } catch (err: any) {
      console.error('Error archiving purchase:', err);
      setError(err.response?.data?.message || 'Failed to archive purchase');
    }
  };

  const handleChangeStatus = async (newStatus: PurchaseStatus) => {
    if (!id) return;
    try {
      const updatedPurchase = await purchasesService.updatePurchaseStatus(id, newStatus);
      setPurchase(updatedPurchase);
      setSuccessMessage('Purchase status updated successfully');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDownloadPDF = async () => {
    if (!id) return;
    try {
      const blob = await purchasesService.downloadPurchasePDF(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `purchase-${id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error downloading PDF:', err);
      setError(err.response?.data?.message || 'Failed to download PDF');
    }
  };

  if (isLoading) {
    return (
      <PageContainer title="Purchase Details" breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Purchases', path: '/purchases' }, { label: 'Loading...', path: `/purchases/${id}` }]}> <div className="flex justify-center items-center p-8"><div className="text-gray-500">Loading data...</div></div></PageContainer>
    );
  }

  if (!purchase && !isLoading) {
    return (
      <PageContainer title="Error" breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Purchases', path: '/purchases' }, { label: 'Error', path: `/purchases/${id}` }]}> <div className="p-4 bg-red-50 border border-red-300 rounded-md text-red-800">Purchase not found or failed to load.</div><div className="mt-4"><button onClick={() => navigate('/purchases')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800">Back to Purchases</button></div></PageContainer>
    );
  }

  return (
    <PageContainer title={`Purchase #${purchase?.invoiceNumber}`} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Purchases', path: '/purchases' }, { label: `Purchase #${purchase?.invoiceNumber}`, path: `/purchases/${id}` }]}> 
      {successMessage && (<div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-md text-green-800">{successMessage}</div>)}
      {error && (<div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-md text-red-800">{error}</div>)}

      <div className="flex gap-2 mb-6">
        <button onClick={handleEdit} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Edit</button>
        <button onClick={handleArchive} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">Archive</button>
        <button onClick={handleDownloadPDF} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md">Download PDF</button>
      </div>

      {/* Additional detail rendering would go here */}
    </PageContainer>
  );
};

export default PurchasesDetailPage;
