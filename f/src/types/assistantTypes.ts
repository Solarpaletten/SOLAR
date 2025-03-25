/**
 * Перечисление языков, поддерживаемых ассистентом
 */
export enum AssistantLanguage {
    ENGLISH = 'ENGLISH',
    RUSSIAN = 'RUSSIAN',
    GERMAN = 'GERMAN',
    POLISH = 'POLISH'
  }
  
  /**
   * Перечисление типов сообщений
   */
  export enum AssistantMessageType {
    TEXT = 'TEXT',
    AUDIO = 'AUDIO',
    TRANSLATED = 'TRANSLATED'
  }
  
  /**
   * Перечисление статусов сессии разговора
   */
  export enum ConversationStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED'
  }
  
  /**
   * Интерфейс сообщения ассистента
   */
  export interface AssistantMessage {
    id: number;
    sessionId: number;
    senderType: 'user' | 'client' | 'assistant';
    messageType: AssistantMessageType;
    originalContent: string;
    translatedContent?: string;
    sourceLanguage: AssistantLanguage;
    targetLanguage: AssistantLanguage;
    audioFilePath?: string;
    createdAt: Date;
  }
  
  /**
   * Интерфейс сессии разговора
   */
  export interface ConversationSession {
    id: number;
    name?: string;
    status: ConversationStatus;
    startTime: Date;
    endTime?: Date;
    primaryLanguage: AssistantLanguage;
    secondaryLanguage: AssistantLanguage;
    userId: number;
    clientId?: number;
    client?: {
      id: number;
      name: string;
      email: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  /**
   * Интерфейс предпочтений ассистента
   */
  export interface AssistantPreferences {
    id?: number;
    userId?: number;
    defaultLanguage: AssistantLanguage;
    voiceEnabled: boolean;
    translationEnabled: boolean;
    assistantTheme?: string;
    autoTranscribe: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  /**
   * Интерфейс для фильтрации сессий ассистента
   */
  export interface AssistantFilter {
    page?: number;
    limit?: number;
    search?: string;
    status?: ConversationStatus | '';
    startDate?: string;
    endDate?: string;
    clientId?: number;
    sortBy?: keyof ConversationSession;
    sortOrder?: 'asc' | 'desc';
  }
  
  /**
   * Интерфейс для создания сессии ассистента
   */
  export type CreateSessionDto = Omit<ConversationSession, 'id' | 'createdAt' | 'updatedAt' | 'startTime' | 'status'> & {
    primaryLanguage: AssistantLanguage;
    secondaryLanguage: AssistantLanguage;
    name?: string;
    clientId?: number;
  };
  
  /**
   * Интерфейс для обновления сессии ассистента
   */
  export type UpdateSessionDto = Partial<Omit<ConversationSession, 'id' | 'createdAt' | 'updatedAt'>>;
  
  /**
   * Интерфейс для создания сообщения
   */
  export type CreateMessageDto = Omit<AssistantMessage, 'id' | 'createdAt'>;
  
  /**
   * Интерфейс для обновления предпочтений ассистента
   */
  export type UpdatePreferencesDto = Partial<AssistantPreferences>;
  
  /**
   * Перечисление для возможных действий с сессией ассистента
   */
  export enum AssistantAction {
    JOIN = 'join',
    END = 'end',
    ARCHIVE = 'archive',
    DELETE = 'delete',
    EXPORT = 'export'
  }
  
  /**
   * Интерфейс для пропсов компонента сообщения ассистента
   */
  export interface AssistantMessageProps {
    message: AssistantMessage;
    isCurrentUser: boolean;
    showTranslation: boolean;
    onPlayAudio?: (audioPath: string) => void;
    formatTime?: (date: Date) => string;
  }
  
  /**
   * Интерфейс для пропсов компонента панели ассистента
   */
  export interface AssistantPanelProps {
    isVisible: boolean;
    onClose: () => void;
    onStartSession: (name: string, clientId?: number) => Promise<void>;
    onEndSession: () => Promise<void>;
    availableClients?: { id: number; name: string }[];
    activeSession: ConversationSession | null;
    isRecording: boolean;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onSendMessage: (text: string) => void;
    messages: AssistantMessage[];
    isLoading: boolean;
    error: Error | null;
  }
  
  /**
   * Интерфейс настроек синтеза речи
   */
  export interface SpeechSynthesisOptions {
    voice?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  }
  
  /**
   * Интерфейс настроек распознавания речи
   */
  export interface SpeechRecognitionOptions {
    language: string;
    continuous?: boolean;
    interimResults?: boolean;
  }
  
  /**
   * Интерфейс для WebSocket сообщений
   */
  export interface WebSocketMessage {
    type: string;
    [key: string]: any;
  }
  
  /**
   * Интерфейс для пропсов кнопки ассистента
   */
  export interface AssistantFloatingButtonProps {
    isActive: boolean;
    isConnecting: boolean;
    onActivate: () => void;
    onDeactivate: () => void;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  }