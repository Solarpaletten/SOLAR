module.exports = {
  testEnvironment: 'node', // Среда выполнения тестов (Node.js)
  setupFilesAfterEnv: ['./tests/setup.js'], // Указать путь до setup-файла
  testMatch: ['**/tests/**/*.test.js'], // Паттерн поиска тестов
  // Не запускать реальный сервер
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  // Игнорируем модули, которые могут пытаться запустить сервер
  modulePathIgnorePatterns: ['<rootDir>/src/index.js'],
  // Запрещаем автоматическую загрузку модулей, не указанных явно в тестах
  automock: false,
};
