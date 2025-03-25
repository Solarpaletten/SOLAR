// SolarAssistantPage.tsx
import React, { useState, useEffect } from 'react';
import { useAssistant } from '../../components/assistant/AssistantContext';
import { AssistantLanguage } from '../../types/assistantTypes';

const SolarAssistantPage: React.FC = () => {
  const {
    isActive,
    isConnecting,
    isRecording,
    startAssistant,
    stopAssistant,
    startRecording,
    stopRecording,
    sendTextMessage,
    createSession,
    messages,
    activeSession,
    userLanguage,
    targetLanguage,
    setUserLanguage,
    setTargetLanguage,
    error,
    successMessage,
    clearSuccessMessage
  } = useAssistant();
  
  const [inputText, setInputText] = useState('');
  const [sessionName, setSessionName] = useState('Новая сессия');
  
  // Очистка сообщения об успехе через 3 секунды
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);
  
  const handleStartSession = async () => {
    try {
      await createSession(sessionName);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };
  
  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendTextMessage(inputText);
      setInputText('');
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SOLAR Ассистент</h1>
      
      {error && (
        <div className="p-2 mb-4 text-red-700 bg-red-100 border border-red-300 rounded">
          {error.message}
        </div>
      )}
      
      {successMessage && (
        <div className="p-2 mb-4 text-green-700 bg-green-100 border border-green-300 rounded">
          {successMessage}
        </div>
      )}
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Управление ассистентом</h2>
        <div className="flex space-x-2">
          {!isActive ? (
            <button
              onClick={startAssistant}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isConnecting ? 'Подключение...' : 'Запустить ассистента SOLAR'}
            </button>
          ) : (
            <button
              onClick={stopAssistant}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Остановить ассистента
            </button>
          )}
        </div>
      </div>
      
      {isActive && !activeSession && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Создать сессию</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="px-4 py-2 border rounded"
              placeholder="Имя сессии"
            />
            <button
              onClick={handleStartSession}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Создать сессию
            </button>
          </div>
        </div>
      )}
      
      {activeSession && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Активная сессия: {activeSession.name}</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Языки</h3>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm">Ваш язык:</label>
                <select
                  value={userLanguage}
                  onChange={(e) => setUserLanguage(e.target.value as AssistantLanguage)}
                  className="px-2 py-1 border rounded"
                >
                  <option value={AssistantLanguage.ENGLISH}>English</option>
                  <option value={AssistantLanguage.RUSSIAN}>Русский</option>
                  <option value={AssistantLanguage.GERMAN}>Deutsch</option>
                  <option value={AssistantLanguage.POLISH}>Polski</option>
                </select>
              </div>
              <div>
                <label className="block text-sm">Язык собеседника:</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value as AssistantLanguage)}
                  className="px-2 py-1 border rounded"
                >
                  <option value={AssistantLanguage.ENGLISH}>English</option>
                  <option value={AssistantLanguage.RUSSIAN}>Русский</option>
                  <option value={AssistantLanguage.GERMAN}>Deutsch</option>
                  <option value={AssistantLanguage.POLISH}>Polski</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Сообщения</h3>
            <div className="border rounded p-4 h-64 overflow-y-auto mb-2">
              {messages.length === 0 ? (
                <p className="text-gray-500">Нет сообщений</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-2 p-2 rounded ${
                      message.senderType === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                    }`}
                    style={{ maxWidth: '80%' }}
                  >
                    <div className="font-medium">{message.senderType}</div>
                    <div>{message.originalContent}</div>
                    {message.translatedContent && (
                      <div className="text-sm italic text-gray-600">{message.translatedContent}</div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-grow px-4 py-2 border rounded"
                placeholder="Введите сообщение..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Отправить
              </button>
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Запись
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 animate-pulse"
                >
                  Остановить запись
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarAssistantPage;