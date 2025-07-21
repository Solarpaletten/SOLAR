import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from '../components/common/PageContainer';
import axios from '../api/axios';

const VatPage = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    // Simulate loading time for iframe
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Function to handle communication with the iframe
  const getVATData = () => {
    try {
      const iframeWindow = iframeRef.current?.contentWindow;
      if (iframeWindow && iframeWindow.vatCalculator) {
        return iframeWindow.vatCalculator.exportData();
      } else {
        console.error('VAT Calculator not found in iframe');
        return null;
      }
    } catch (error) {
      console.error('Error accessing VAT data from iframe:', error);
      return null;
    }
  };

  const handleExportPDF = async () => {
    const vatData = getVATData();
    if (!vatData) {
      alert('Unable to access VAT declaration data');
      return;
    }

    try {
      setExportLoading(true);
      const response = await axios.post('/api/vat-report/pdf', vatData, {
        responseType: 'blob'
      });

      // Create a download link for the PDF
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `VAT_Declaration_${vatData.company.name.replace(/\s+/g, '_')}_${vatData.period.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report');
    } finally {
      setExportLoading(false);
    }
  };

  const handleFinancialReportPDF = async () => {
    const vatData = getVATData();
    if (!vatData) {
      alert('Unable to access VAT declaration data');
      return;
    }

    try {
      setExportLoading(true);
      const response = await axios.post('/api/vat-report/financial-pdf', vatData, {
        responseType: 'blob'
      });

      // Create a download link for the Financial PDF Report
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Financial_Report_${vatData.company.name.replace(/\s+/g, '_')}_${vatData.period.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating Financial PDF report:', error);
      alert('Error generating Financial PDF report');
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportExcel = async () => {
    const vatData = getVATData();
    if (!vatData) {
      alert('Unable to access VAT declaration data');
      return;
    }

    try {
      setExportLoading(true);
      const response = await axios.post('/api/vat-report/excel', vatData, {
        responseType: 'blob'
      });

      // Create a download link for the Excel
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `VAT_Declaration_${vatData.company.name.replace(/\s+/g, '_')}_${vatData.period.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Error generating Excel report');
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportJSON = async () => {
    const vatData = getVATData();
    if (!vatData) {
      alert('Unable to access VAT declaration data');
      return;
    }

    try {
      setExportLoading(true);
      const response = await axios.post('/api/vat-report/json', vatData, {
        responseType: 'blob'
      });

      // Create a download link for the JSON
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `VAT_Declaration_${vatData.company.name.replace(/\s+/g, '_')}_${vatData.period.replace(/\s+/g, '_')}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating JSON:', error);
      alert('Error generating JSON report');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <PageContainer title={t('VAT Declaration')}>
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="w-full">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{t('German VAT Declaration (UStVA)')}</h2>
              <p className="text-sm text-gray-600">{t('Complete your VAT declaration and generate reports')}</p>
            </div>

            <button
              onClick={() => setShowExportPanel(!showExportPanel)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {showExportPanel ? t('Hide Export Options') : t('Export Reports')}
            </button>
          </div>

          {showExportPanel && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-3">{t('Export VAT Declaration')}</h3>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleExportPDF}
                  disabled={exportLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                >
                  {exportLoading ? (
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                  {t('Распечатать')}
                </button>

                <button
                  onClick={handleFinancialReportPDF}
                  disabled={exportLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center"
                >
                  {exportLoading ? (
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                  {t('Сформировать финансовый отчёт (PDF)')}
                </button>

                <button
                  onClick={handleExportExcel}
                  disabled={exportLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                >
                  {exportLoading ? (
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                    </svg>
                  )}
                  {t('Export Excel')}
                </button>

                <button
                  onClick={handleExportJSON}
                  disabled={exportLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                >
                  {exportLoading ? (
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  )}
                  {t('Export JSON')}
                </button>
              </div>

              <p className="mt-3 text-sm text-gray-600">
                {t('Generate official reports from your VAT declaration data. Reports will be downloaded automatically.')}
              </p>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow">
            <iframe
              ref={iframeRef}
              src="/vatde/index.html"
              title="VAT Declaration Form"
              className="w-full min-h-screen border-0"
              style={{ height: 'calc(100vh - 250px)' }}
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default VatPage;