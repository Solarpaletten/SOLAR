import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../components/common/PageContainer';
import axios from '../api/axios';

const VatReportPage = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: {
      name: 'ASSET LOGISTICS GMBH',
      address: 'Kurze Straße 6, 06366 Köthen',
      hrb: '34481',
      steuernummer: 'DE453202061'
    },
    period: 'März 2025',
    data: {
      field10: 0,
      field81a: 0.00,
      field81b: 133.56,
      field81: 133.56,
      field81c: 0.00,
      field41a: 18400.00,
      field41b: 0.00,
      field41: 18400.00,
      field41c: 0.00,
      field43: 0.00,
      field66: 25.38,
      field62: 3085.59,
      field67: 0.00,
      field83: -3110.97,
      plannedProfit: 18266.44
    }
  });

  useEffect(() => {
    // Load VAT data if needed
    const loadVatData = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with actual API call in production
        // const response = await axios.get('/api/vat-report');
        // setFormData(response.data);

        // Simulating API delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading VAT data:', error);
        setIsLoading(false);
      }
    };

    loadVatData();
  }, []);

  const handleExportPDF = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/vat-report/pdf', formData, {
        responseType: 'blob'
      });
      
      // Create a download link for the PDF
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `VAT_Declaration_${formData.company.name.replace(/\s+/g, '_')}_${formData.period.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/vat-report/excel', formData, {
        responseType: 'blob'
      });
      
      // Create a download link for the CSV
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `VAT_Declaration_${formData.company.name.replace(/\s+/g, '_')}_${formData.period.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating Excel:', error);
      setIsLoading(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/vat-report/json', formData, {
        responseType: 'blob'
      });
      
      // Create a download link for the JSON
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `VAT_Declaration_${formData.company.name.replace(/\s+/g, '_')}_${formData.period.replace(/\s+/g, '_')}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating JSON:', error);
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title={t('VAT Report')}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">{t('VAT Declaration Report')}</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">{t('Company Information')}</h3>
                <p><strong>{t('Company')}:</strong> {formData.company.name}</p>
                <p><strong>{t('Address')}:</strong> {formData.company.address}</p>
                <p><strong>{t('HRB')}:</strong> {formData.company.hrb}</p>
                <p><strong>{t('Steuernummer')}:</strong> {formData.company.steuernummer}</p>
                <p><strong>{t('Period')}:</strong> {formData.period}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">{t('Summary')}</h3>
                <p>
                  <strong>{t('Total Sales (41)')}:</strong> 
                  <span className="text-green-600 font-semibold"> {formData.data.field41.toFixed(2)} €</span>
                </p>
                <p>
                  <strong>{t('Total Costs (81)')}:</strong> 
                  <span className="text-red-600 font-semibold"> {formData.data.field81.toFixed(2)} €</span>
                </p>
                <p>
                  <strong>{t('Planned Profit')}:</strong> 
                  <span className={`font-semibold ${formData.data.plannedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.data.plannedProfit.toFixed(2)} €
                  </span>
                </p>
                <p>
                  <strong>{t('VAT Balance (83)')}:</strong> 
                  <span className={`font-semibold ${formData.data.field83 >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formData.data.field83.toFixed(2)} €
                  </span>
                  {formData.data.field83 >= 0 ? 
                    <span className="text-red-600"> ({t('To Pay')})</span> : 
                    <span className="text-green-600"> ({t('To Receive')})</span>
                  }
                </p>
              </div>
            </div>

            <div className="mt-8 mb-4">
              <h3 className="text-lg font-semibold">{t('VAT Declaration Data')}</h3>
              
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Code</th>
                      <th className="py-2 px-4 border-b text-left">Description</th>
                      <th className="py-2 px-4 border-b text-right">Amount (€)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="py-2 px-4 border-b font-medium" colSpan={3}>Steuerpflichtige Umsätze (19%)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">81a</td>
                      <td className="py-2 px-4 border-b">Товары/услуги С НДС (сумма без НДС)</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field81a.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">81b</td>
                      <td className="py-2 px-4 border-b">Товары/услуги БЕЗ НДС</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field81b.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-gray-100 font-semibold">
                      <td className="py-2 px-4 border-b">81</td>
                      <td className="py-2 px-4 border-b">ИТОГО код 81</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field81.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">81c</td>
                      <td className="py-2 px-4 border-b">НДС81 - Начисленный НДС с кода 81</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field81c.toFixed(2)}</td>
                    </tr>
                    
                    <tr className="bg-gray-50">
                      <td className="py-2 px-4 border-b font-medium" colSpan={3}>Поставки клиентам</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">41a</td>
                      <td className="py-2 px-4 border-b">Внутриевропейские поставки (0%)</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field41a.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">41b</td>
                      <td className="py-2 px-4 border-b">Внутренние поставки с НДС (без НДС)</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field41b.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-gray-100 font-semibold">
                      <td className="py-2 px-4 border-b">41</td>
                      <td className="py-2 px-4 border-b">ИТОГО код 41</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field41.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">41c</td>
                      <td className="py-2 px-4 border-b">НДС41 - Начисленный НДС с кода 41</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field41c.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">43</td>
                      <td className="py-2 px-4 border-b">Экспорт в третьи страны (0%)</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field43.toFixed(2)}</td>
                    </tr>
                    
                    <tr className="bg-gray-50">
                      <td className="py-2 px-4 border-b font-medium" colSpan={3}>Abziehbare Vorsteuerbeträge (Зачетный НДС)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">66</td>
                      <td className="py-2 px-4 border-b">НДС по счетам поставщиков</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field66.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">62</td>
                      <td className="py-2 px-4 border-b">Уплаченный импортный НДС</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field62.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">67</td>
                      <td className="py-2 px-4 border-b">НДС по внутриевропейским приобретениям</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field67.toFixed(2)}</td>
                    </tr>
                    
                    <tr className="bg-gray-50">
                      <td className="py-2 px-4 border-b font-medium" colSpan={3}>Итоги</td>
                    </tr>
                    <tr className="bg-green-50 font-semibold">
                      <td className="py-2 px-4 border-b">PROFIT</td>
                      <td className="py-2 px-4 border-b">Плановая прибыль</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.plannedProfit.toFixed(2)}</td>
                    </tr>
                    <tr className={`font-semibold ${formData.data.field83 >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                      <td className="py-2 px-4 border-b">83</td>
                      <td className="py-2 px-4 border-b">К доплате (+) / К возврату (-)</td>
                      <td className="py-2 px-4 border-b text-right">{formData.data.field83.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <button 
                onClick={handleExportPDF}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path>
                </svg>
                {t('Export PDF')}
              </button>
              
              <button 
                onClick={handleExportExcel}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                {t('Export Excel')}
              </button>
              
              <button 
                onClick={handleExportJSON}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                {t('Export JSON')}
              </button>
              
              <a 
                href="/vat-declaration/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                </svg>
                {t('Open VAT Form')}
              </a>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default VatReportPage;