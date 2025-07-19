import { api } from '../api/axios';

// Типы временных диапазонов
export type TimeRange = 'hour' | 'day' | 'week';

export interface SessionMetrics {
  activeSessions: number;
  closedSessions: number;
  history: SessionHistoryItem[];
  timeRange?: TimeRange;
}

export interface SessionHistoryItem {
  timestamp: string;
  active: number;
  closed: number;
  time?: string; // для отображения на графике
}

export interface Company {
  id: number;
  code: string;
  name: string;
  director_name: string;
  user_id: number;
  is_active: boolean;
  setup_completed: boolean;
  is_email_confirmed: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    email: string;
    email_verified: boolean;
    username: string;
  };
}

export interface DetailedSessionStats extends SessionMetrics {
  clientsInfo: ClientInfo[];
  currentTime: string;
}

export interface ClientInfo {
  userId: number;
  lastActiveAt: number;
  inactiveFor: number | null;
}

// Получение метрик активности по сессиям
export const getSessionMetrics = async (
  timeRange: TimeRange = 'hour'
): Promise<SessionMetrics> => {
  const response = await api.get<SessionMetrics>(
    `/admin/sessions/metrics?timeRange=${timeRange}`
  );
  return response.data;
};

// Экспорт метрик в CSV формате
export const exportSessionMetricsCSV = (
  timeRange: TimeRange = 'hour'
): void => {
  // Используем window.open для скачивания файла
  window.open(
    `${api.defaults.baseURL}/admin/sessions/metrics/export-csv?timeRange=${timeRange}`,
    '_blank'
  );
};

// Получение детальной статистики по сессиям
export const getDetailedSessionStats =
  async (): Promise<DetailedSessionStats> => {
    const response = await api.get<DetailedSessionStats>(
      '/admin/sessions/detailed'
    );
    return response.data;
  };

// Получение списка компаний с их статусом email-подтверждения
export const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await api.get<Company[]>('/admin/companies');
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw new Error('Failed to fetch companies');
  }
};
