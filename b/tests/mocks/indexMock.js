// Мок для src/index.js
// Предотвращает запуск сервера при тестах

// Экспортируем пустую функцию вместо запуска сервера
module.exports = {
  webSocketService: () => ({}),
  getWebSocketService: () => ({})
};