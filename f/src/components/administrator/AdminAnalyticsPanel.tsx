import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSessionMetrics, exportSessionMetricsCSV, TimeRange, SessionMetrics, SessionHistoryItem } from '../../services/adminService';

const AdminAnalyticsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<SessionMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('hour');

  // Функция для загрузки данных с учетом timeRange
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await getSessionMetrics(timeRange);
      setMetrics(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching session metrics:', err);
      setError('Failed to load session metrics');
    } finally {
      setLoading(false);
    }
  };
  
  // Функция для экспорта данных в CSV
  const handleExportCSV = () => {
    exportSessionMetricsCSV(timeRange);
  };
  
  // Обработчик изменения временного диапазона
  const handleTimeRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
  };

  // Загрузка данных при монтировании и обновление каждую минуту
  useEffect(() => {
    fetchMetrics();
    
    // Установить интервал обновления данных каждую минуту
    const interval = setInterval(() => {
      fetchMetrics();
    }, 60000); // 60 секунд
    
    // Очистка интервала при размонтировании
    return () => clearInterval(interval);
  }, [timeRange]); // Зависимость от timeRange

  // Форматирование времени для отображения на графике в зависимости от диапазона
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    
    switch (timeRange) {
      case 'day':
        return `${date.getHours()}:00`; // Показываем только часы
      case 'week':
        return `${date.getDate()}/${date.getMonth() + 1}`; // День/Месяц
      case 'hour':
      default:
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`; // Часы:Минуты
    }
  };

  // Подготовка данных для графика с учетом временного диапазона
  const prepareChartData = (history: SessionHistoryItem[]) => {
    return history.map(item => ({
      ...item,
      time: formatTime(item.timestamp)
    }));
  };

  if (loading) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Session Analytics</h2>
        <div className="animate-pulse">Loading session metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Session Analytics</h2>
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Session Analytics</h2>
        <div>No session data available</div>
      </div>
    );
  }

  const chartData = prepareChartData(metrics.history);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Session Analytics</h2>
        <button
          onClick={handleExportCSV}
          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>
      
      {/* Временные фильтры */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => handleTimeRangeChange('hour')}
          className={`px-3 py-1 rounded ${timeRange === 'hour' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Last Hour
        </button>
        <button
          onClick={() => handleTimeRangeChange('day')}
          className={`px-3 py-1 rounded ${timeRange === 'day' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Last 24 Hours
        </button>
        <button
          onClick={() => handleTimeRangeChange('week')}
          className={`px-3 py-1 rounded ${timeRange === 'week' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Last Week
        </button>
      </div>
      
      {/* Метрики в плашках */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-800 text-sm uppercase font-medium">Active Sessions</div>
          <div className="text-3xl font-bold">{metrics.activeSessions}</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="text-amber-800 text-sm uppercase font-medium">Closed Sessions</div>
          <div className="text-3xl font-bold">{metrics.closedSessions}</div>
        </div>
      </div>
      
      {/* График активности */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">
          Activity Timeline 
          {timeRange === 'hour' ? ' (Last Hour)' : 
           timeRange === 'day' ? ' (Last 24 Hours)' : 
           ' (Last Week)'}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="active" 
                name="Active Sessions" 
                stroke="#3b82f6" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="closed" 
                name="Closed Sessions" 
                stroke="#f59e0b" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Time range: {timeRange === 'hour' ? 'Last Hour' : timeRange === 'day' ? 'Last 24 Hours' : 'Last Week'} · 
        Last updated: {new Date().toLocaleTimeString()}
        <button 
          onClick={fetchMetrics}
          className="ml-4 text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default AdminAnalyticsPanel;