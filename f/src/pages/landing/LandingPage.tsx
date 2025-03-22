import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Навигационная панель */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          LEANID SOLAR
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-blue-600">Продукт</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Интеграции</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Обучение</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Цены</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Бухгалтерские компании</a>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Войти
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Регистрация
          </button>
        </div>
      </nav>

      {/* Главный заголовок */}
      <div className="flex items-center justify-between p-10 bg-blue-500 text-white">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-4">
            Бухгалтерская программа в облаке, которая объединяет бухгалтера и директора
          </h1>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Начать использовать
          </button>
          <p className="mt-2 text-sm">30 дней бесплатного пробного периода</p>
        </div>
        {/* Здесь можно добавить иллюстрацию с людьми */}
        <div className="w-1/2">
          {/* <img src="path-to-illustration.png" alt="People discussing" /> */}
        </div>
      </div>

      {/* Секция "Распознавание счетов" */}
      <div className="p-10 bg-white flex items-center justify-between">
        <div className="max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Распознавание счетов за 30 секунд</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Полное распознавание за 30 секунд;</li>
            <li>Распознавание нестандартных счетов;</li>
            <li>Массовая обработка счетов одним кликом;</li>
            <li>Автоматическая загрузка счета в хранилище.</li>
          </ul>
          <button
            onClick={() => navigate('/register')}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Попробовать распознавание
          </button>
        </div>
        {/* Здесь можно добавить иллюстрацию с ноутбуком и графиками */}
        <div className="w-1/3">
          {/* <img src="path-to-laptop-illustration.png" alt="Laptop with charts" /> */}
        </div>
      </div>

      {/* Секция с котиком */}
      <div className="p-4 bg-gray-100 flex justify-end">
        <div className="max-w-xs p-4 bg-blue-200 rounded flex items-center space-x-2">
          <div>
            <p className="text-sm">
              Наш котёнок любит печенье (как и мы), поэтому он использует B1.lt
            </p>
            <p className="text-sm font-bold">Я ПОДДЕРЖИВАЮ КОТЁНКА</p>
          </div>
          {/* Здесь можно добавить иллюстрацию котика */}
          {/* <img src="path-to-kitten.png" alt="Kitten" className="w-16 h-16" /> */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;