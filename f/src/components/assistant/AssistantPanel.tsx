// src/components/assistant/AssistantPanel.tsx
import React, { useState } from 'react';
import { useAssistant } from './AssistantContext';
import { AssistantLanguage } from '../../types/assistantTypes';
import {
  FaGlobe,
  FaRegTimesCircle,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPaperPlane,
} from 'react-icons/fa';

const AssistantPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  } = useAssistant();

  const [inputText, setInputText] = useState('');
  const [sessionName, setSessionName] = useState('Новая сессия');

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !isActive) {
      startAssistant();
    }
  };

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Плавающая кнопка ассистента */}
      <button
        onClick={togglePanel}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-colors z-50 ${
          isActive
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        <FaGlobe className="text-white text-2xl" />
      </button>

      {/* Панель ассистента */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
            {/* Шапка панели */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">SOLAR Ассистент</h2>
              <button
                onClick={togglePanel}
                className="text-white hover:text-gray-200"
              >
                <FaRegTimesCircle className="text-xl" />
              </button>
            </div>

            {/* Основное содержимое */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col">
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

              {!isActive ? (
                <div className="flex-1 flex items-center justify-center">
                  <button
                    onClick={startAssistant}
                    disabled={isConnecting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-lg"
                  >
                    {isConnecting
                      ? 'Подключение...'
                      : 'Запустить ассистента SOLAR'}
                  </button>
                </div>
              ) : !activeSession ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-semibold mb-4">
                    Создать новую сессию
                  </h3>
                  <div className="w-full max-w-md">
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Название сессии
                      </label>
                      <input
                        type="text"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Название сессии"
                      />
                    </div>
                    <button
                      onClick={handleStartSession}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Создать сессию
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Сессия: {activeSession.name}
                    </h3>
                    <div className="flex space-x-4">
                      <div>
                        <label className="block text-sm text-gray-600">
                          Ваш язык:
                        </label>
                        <select
                          value={userLanguage}
                          onChange={(e) =>
                            setUserLanguage(e.target.value as AssistantLanguage)
                          }
                          className="px-2 py-1 border rounded"
                        >
                          <option value={AssistantLanguage.ENGLISH}>
                            English
                          </option>
                          <option value={AssistantLanguage.RUSSIAN}>
                            Русский
                          </option>
                          <option value={AssistantLanguage.GERMAN}>
                            Deutsch
                          </option>
                          <option value={AssistantLanguage.POLISH}>
                            Polski
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">
                          Язык собеседника:
                        </label>
                        <select
                          value={targetLanguage}
                          onChange={(e) =>
                            setTargetLanguage(
                              e.target.value as AssistantLanguage
                            )
                          }
                          className="px-2 py-1 border rounded"
                        >
                          <option value={AssistantLanguage.ENGLISH}>
                            English
                          </option>
                          <option value={AssistantLanguage.RUSSIAN}>
                            Русский
                          </option>
                          <option value={AssistantLanguage.GERMAN}>
                            Deutsch
                          </option>
                          <option value={AssistantLanguage.POLISH}>
                            Polski
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Область сообщений */}
                  <div className="flex-1 border rounded-lg p-4 mb-4 overflow-y-auto bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        Начните разговор! SOLAR переведет ваши сообщения.
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-3">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.senderType === 'user'
                                ? 'bg-blue-100 ml-auto rounded-tr-none'
                                : 'bg-gray-100 rounded-tl-none'
                            }`}
                          >
                            <div className="font-medium text-xs text-gray-700 mb-1">
                              {message.senderType === 'user'
                                ? 'Вы'
                                : 'Собеседник'}
                            </div>
                            <div className="text-gray-800">
                              {message.originalContent}
                            </div>
                            {message.translatedContent && (
                              <div className="text-sm mt-1 text-gray-600 italic">
                                {message.translatedContent}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Панель ввода */}
            {activeSession && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-2">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Введите сообщение..."
                    rows={1}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
                  >
                    <FaPaperPlane className="mr-2" />
                    Отправить
                  </button>
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                    >
                      <FaMicrophone className="mr-2" />
                      Запись
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 animate-pulse flex items-center"
                    >
                      <FaMicrophoneSlash className="mr-2" />
                      Остановить
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantPanel;
