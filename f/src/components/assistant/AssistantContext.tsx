import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  AssistantLanguage, 
  AssistantMessageType,
  ConversationStatus,
  AssistantMessage,
  ConversationSession,
  AssistantPreferences,
  AssistantFilter,
  UpdatePreferencesDto,
  WebSocketMessage
} from '../../types/assistantTypes';

// Значения по умолчанию для предпочтений
const defaultPreferences: AssistantPreferences = {
  defaultLanguage: AssistantLanguage.ENGLISH,
  voiceEnabled: true,
  translationEnabled: true,
  autoTranscribe: true
};

// Тип контекста ассистента
interface AssistantContextType {
  // Состояния
  isActive: boolean;
  isConnecting: boolean;
  isRecording: boolean;
  activeSession: ConversationSession | null;
  messages: AssistantMessage[];
  availableSessions: ConversationSession[];
  totalSessions: number;
  preferences: AssistantPreferences;
  userLanguage: AssistantLanguage;
  targetLanguage: AssistantLanguage;
  isTyping: { [userId: number]: boolean };
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  itemsPerPage: number;
  filters: AssistantFilter;
  successMessage: string | null;
  
  // Методы управления ассистентом
  startAssistant: () => Promise<void>;
  stopAssistant: () => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  sendTextMessage: (text: string) => Promise<void>;
  
  // Методы управления сессиями
  createSession: (name: string, clientId?: number) => Promise<number>;
  endSession: (sessionId: number) => Promise<void>;
  joinSession: (sessionId: number) => Promise<void>;
  leaveSession: () => void;
  fetchSessions: () => Promise<void>;
  
  // Методы настроек
  setUserLanguage: (language: AssistantLanguage) => void;
  setTargetLanguage: (language: AssistantLanguage) => void;
  updatePreferences: (prefs: UpdatePreferencesDto) => Promise<void>;
  
  // Методы фильтрации и пагинации
  setFilter: (filter: Partial<AssistantFilter>) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  clearSuccessMessage: () => void;
  
  // Дополнительные методы
  setTypingIndicator: (isTyping: boolean) => void;
}

// Создание контекста
const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

// Провайдер ассистента
export const AssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Состояния
  // Состояния
const [isActive, setIsActive] = useState(false);
const [isConnecting, setIsConnecting] = useState(false);
const [isRecording, setIsRecording] = useState(false);
const [activeSession, setActiveSession] = useState<ConversationSession | null>(null);
const [messages, setMessages] = useState<AssistantMessage[]>([]);
const [availableSessions, setAvailableSessions] = useState<ConversationSession[]>([]);
const [totalSessions, setTotalSessions] = useState(0);
const [preferences, setPreferences] = useState<AssistantPreferences>(defaultPreferences);

const [userLanguage, setUserLanguageState] = useState<AssistantLanguage>(AssistantLanguage.ENGLISH);
const [targetLanguage, setTargetLanguageState] = useState<AssistantLanguage>(AssistantLanguage.RUSSIAN);

const [isTyping, setIsTyping] = useState<{ [userId: number]: boolean }>({});
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [filters, setFilters] = useState<AssistantFilter>({});
const [successMessage, setSuccessMessage] = useState<string | null>(null);
const [socket, setSocket] = useState<WebSocket | null>(null);
const [userId, setUserId] = useState<number | null>(null);
  
  // При монтировании компонента загружаем данные пользователя и настройки
  useEffect(() => {
    fetchUserData();
  }, []);
  
  // Эффект для управления WebSocket соединением
  useEffect(() => {
    if (isActive && !socket) {
      const ws = initializeWebSocket();
      if (ws) {
        setSocket(ws);
      }
    }
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isActive]);
  
  // Загрузка данных пользователя
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error(t('authRequired'));
      }
      
      const response = await fetch('/api/auth/current-user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(t('failedToLoadUserData'));
      }
      
      const userData = await response.json();
      setUserId(userData.id);
      
      // Загрузить предпочтения ассистента
      await fetchUserPreferences(userData.id);
      
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Загрузка предпочтений пользователя
  const fetchUserPreferences = async (userId: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error(t('authRequired'));
      }
      
      const response = await fetch('/api/assistant/preferences', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(t('failedToLoadPreferences'));
      }
      
      const prefsData = await response.json();
      setPreferences(prefsData);
      setUserLanguage(prefsData.defaultLanguage);
      
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Инициализация WebSocket соединения
  const initializeWebSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError(new Error(t('authRequired')));
      return null;
    }
    
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/api/ws?token=${token}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setIsConnecting(false);
      setIsActive(true);
      setError(null);
    };
    
    ws.onmessage = handleWebSocketMessage;
    
    ws.onerror = (event) => {
      setError(new Error(t('webSocketError')));
      setIsConnecting(false);
    };
    
    ws.onclose = () => {
      setIsActive(false);
      setSocket(null);
    };
    
    return ws;
  }, [t]);
  
  // Обработка сообщений WebSocket
  const handleWebSocketMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data) as WebSocketMessage;
      
      switch (data.type) {
        case 'CONNECTION_ESTABLISHED':
          setIsConnecting(false);
          setIsActive(true);
          break;
          
        case 'SESSION_JOINED':
          setActiveSession(data.session);
          setMessages(data.messages);
          break;
          
        case 'NEW_MESSAGE':
          setMessages(prev => [...prev, data.message]);
          
          // Озвучивание перевода, если включено
          if (preferences.voiceEnabled && data.message.senderType !== 'user') {
            const textToSpeak = data.message.translatedContent || data.message.originalContent;
            speakText(textToSpeak, userLanguage);
          }
          break;
          
        case 'NEW_AUDIO_MESSAGE':
          setMessages(prev => [...prev, data.message]);
          break;
          
        case 'TYPING_INDICATOR':
          setIsTyping(prev => ({
            ...prev,
            [data.userId]: data.isTyping
          }));
          break;
          
        case 'ERROR':
          setError(new Error(data.message));
          break;
      }
    } catch (err: any) {
      setError(new Error(t('invalidWebSocketMessage')));
    }
  };
  
  // Функция для синтеза речи
  const speakText = (text: string, language: AssistantLanguage) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    // Получить подходящий голос для языка
    const voices = window.speechSynthesis.getVoices();
    let voice;
    
    switch (language) {
      case AssistantLanguage.ENGLISH:
        voice = voices.find(v => v.lang.includes('en'));
        break;
      case AssistantLanguage.RUSSIAN:
        voice = voices.find(v => v.lang.includes('ru'));
        break;
      case AssistantLanguage.GERMAN:
        voice = voices.find(v => v.lang.includes('de'));
        break;
      case AssistantLanguage.POLISH:
        voice = voices.find(v => v.lang.includes('pl'));
        break;
      default:
        voice = voices.find(v => v.lang.includes('en'));
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };
  
  // Запуск ассистента
  const startAssistant = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const ws = initializeWebSocket();
      if (ws) {
        setSocket(ws);
        setSuccessMessage(t('assistantStarted'));
      }
    } catch (err: any) {
      setError(err);
      setIsConnecting(false);
    }
  };
  
  // Остановка ассистента
  const stopAssistant = () => {
    if (socket) {
      socket.close();
    }
    setIsActive(false);
    setActiveSession(null);
    setMessages([]);
  };
  
  // Начало записи аудио
  const startRecording = async () => {
    try {
      if (!activeSession) {
        throw new Error(t('noActiveSession'));
      }
      
      setIsRecording(true);
      
      // Отправить индикатор печати
      if (socket) {
        socket.send(JSON.stringify({
          type: 'TYPING_INDICATOR',
          sessionId: activeSession.id,
          isTyping: true
        }));
      }
    } catch (err: any) {
      setError(err);
      setIsRecording(false);
    }
  };
  
  // Остановка записи
  const stopRecording = async () => {
    try {
      setIsRecording(false);
      
      // Отключить индикатор печати
      if (socket && activeSession) {
        socket.send(JSON.stringify({
          type: 'TYPING_INDICATOR',
          sessionId: activeSession.id,
          isTyping: false
        }));
      }
    } catch (err: any) {
      setError(err);
    }
  };
  
  // Отправка текстового сообщения
  const sendTextMessage = async (text: string) => {
    try {
      if (!activeSession || !socket) {
        throw new Error(t('noActiveSession'));
      }
      
      // Отправить сообщение через WebSocket
      socket.send(JSON.stringify({
        type: 'TEXT_MESSAGE',
        sessionId: activeSession.id,
        content: text,
        sourceLanguage: userLanguage,
        targetLanguage: targetLanguage
      }));
      
      // Отключить индикатор печати
      socket.send(JSON.stringify({
        type: 'TYPING_INDICATOR',
        sessionId: activeSession.id,
        isTyping: false
      }));
      
    } catch (err: any) {
      setError(err);
    }
  };
  
  // Создание новой сессии
  const createSession = async (name: string, clientId?: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error(t('authRequired'));
      }
      
      const response = await fetch('/api/assistant/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          primaryLanguage: userLanguage,
          secondaryLanguage: targetLanguage,
          clientId
        })
      });
      
      if (!response.ok) {
        throw new Error(t('failedToCreateSession'));
      }
      
      const session = await response.json();
      setSuccessMessage(t('sessionCreated'));
      
      // Автоматически присоединиться к сессии
      await joinSession(session.id);
      
      return session.id;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Завершение метода endSession
const endSession = async (sessionId: number) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error(t('authRequired'));
    }
    
    const response = await fetch(`/api/assistant/session/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: ConversationStatus.COMPLETED,
        endTime: new Date()
      })
    });
    
    if (!response.ok) {
      throw new Error(t('failedToEndSession'));
    }
    
    // Если активная сессия была завершена, покинуть её
    if (activeSession && activeSession.id === sessionId) {
      leaveSession();
    }
    
    setSuccessMessage(t('sessionEnded'));
    
    // Обновить список сессий
    await fetchSessions();
    
  } catch (err: any) {
    setError(err);
  } finally {
    setIsLoading(false);
  }
};

// Присоединение к существующей сессии
const joinSession = async (sessionId: number) => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Убедиться, что ассистент активен
    if (!isActive) {
      await startAssistant();
    }
    
    // Проверить соединение
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error(t('noActiveConnection'));
    }
    
    // Отправить запрос на присоединение к сессии
    socket.send(JSON.stringify({
      type: 'JOIN_SESSION',
      sessionId
    }));
    
    setSuccessMessage(t('joiningSession'));
    
  } catch (err: any) {
    setError(err);
  } finally {
    setIsLoading(false);
  }
};

// Покинуть сессию
const leaveSession = () => {
  if (activeSession && socket && socket.readyState === WebSocket.OPEN) {
    // Отправить запрос на выход из сессии
    socket.send(JSON.stringify({
      type: 'LEAVE_SESSION',
      sessionId: activeSession.id
    }));
    
    setActiveSession(null);
    setMessages([]);
  }
};

// Загрузка списка сессий
const fetchSessions = async () => {
  try {
    setIsLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error(t('authRequired'));
    }
    
    // Подготовка параметров запроса с учетом фильтров
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.clientId) queryParams.append('clientId', filters.clientId.toString());
    
    const response = await fetch(`/api/assistant/sessions?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(t('failedToLoadSessions'));
    }
    
    const data = await response.json();
    setAvailableSessions(data.sessions || []);
    setTotalSessions(data.totalCount || 0);
    
  } catch (err: any) {
    setError(err);
  } finally {
    setIsLoading(false);
  }
};

// Обновление предпочтений пользователя
const updatePreferences = async (prefs: UpdatePreferencesDto) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error(t('authRequired'));
    }
    
    const response = await fetch('/api/assistant/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(prefs)
    });
    
    if (!response.ok) {
      throw new Error(t('failedToUpdatePreferences'));
    }
    
    const updatedPrefs = await response.json();
    setPreferences(updatedPrefs);
    
    if (prefs.defaultLanguage) {
      setUserLanguage(prefs.defaultLanguage);
    }
    
    setSuccessMessage(t('preferencesUpdated'));
    
  } catch (err: any) {
    setError(err);
  } finally {
    setIsLoading(false);
  }
};

// Переименуйте функции или используйте другие имена для state-сеттеров
const setUserLanguage = (language: AssistantLanguage) => {
  setUserLanguageState(language);
};

const setTargetLanguage = (language: AssistantLanguage) => {
  setTargetLanguageState(language);
};

// Обновление фильтра
const setFilter = (filter: Partial<AssistantFilter>) => {
  setFilters(prev => ({ ...prev, ...filter }));
  setCurrentPage(1); // Сброс на первую страницу при изменении фильтра
};

// Обновление текущей страницы
const setCurrentPageHandler = (page: number) => {
  setCurrentPage(page);
};

// Обновление количества элементов на странице
const setItemsPerPageHandler = (count: number) => {
  setItemsPerPage(count);
  setCurrentPage(1); // Сброс на первую страницу
};

// Очистка сообщения об успешной операции
const clearSuccessMessage = () => {
  setSuccessMessage(null);
};

// Установка индикатора печати
const setTypingIndicator = (isTyping: boolean) => {
  if (activeSession && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'TYPING_INDICATOR',
      sessionId: activeSession.id,
      isTyping
    }));
  }
};

// Формирование значения контекста
const contextValue: AssistantContextType = {
  // Состояния
  isActive,
  isConnecting,
  isRecording,
  activeSession,
  messages,
  availableSessions,
  totalSessions,
  preferences,
  userLanguage,
  targetLanguage,
  isTyping,
  isLoading,
  error,
  currentPage,
  itemsPerPage,
  filters,
  successMessage,
  
  // Методы управления ассистентом
  startAssistant,
  stopAssistant,
  startRecording,
  stopRecording,
  sendTextMessage,
  
  // Методы управления сессиями
  createSession,
  endSession,
  joinSession,
  leaveSession,
  fetchSessions,
  
  // Методы настроек
  setUserLanguage,
  setTargetLanguage,
  updatePreferences,
  
  // Методы фильтрации и пагинации
  setFilter,
  setCurrentPage: setCurrentPageHandler,
  setItemsPerPage: setItemsPerPageHandler,
  clearSuccessMessage,
  
  // Дополнительные методы
  setTypingIndicator
};

return (
  <AssistantContext.Provider value={contextValue}>
    {children}
  </AssistantContext.Provider>
);
};

// Хук для использования контекста ассистента
export const useAssistant = () => {
  const context = useContext(AssistantContext);
  
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  
  return context;
};

export default AssistantContext;