import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/axios';

interface RegisterFormData {
  email: string;
  phone: string;
  name: string;
  surname: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    phone: '',
    name: '',
    surname: '',
    password: '',
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setError('Пожалуйста, согласитесь с правилами LEANID SOLAR');
      return;
    }
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await register(formData.email, formData.password, formData.name);
      // Сохраняем данные в localStorage для использования на странице онбординга
      localStorage.setItem('companyName', formData.name);
      localStorage.setItem('email', formData.email);
      localStorage.setItem('phone', formData.phone);
      setSuccessMessage(`Регистрация успешна! Ваш логин: ${response.login}, пароль: ${formData.password}`);
      setTimeout(() => {
        navigate('/onboarding');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Не удалось зарегистрироваться');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Навигационная панель */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">LEANID SOLAR</div>
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

      {/* Форма регистрации */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">Регистрация в IT Бухгалтерии</h1>
          <div className="flex justify-center space-x-2 mb-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Facebook</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded">Google</button>
          </div>
          <p className="text-center text-gray-600 mb-4">Или заполните форму регистрации</p>
          {successMessage && (
            <div className="p-2 text-sm text-green-700 bg-green-100 border border-green-300 rounded mb-4">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Телефон *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Имя *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Фамилия *</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Пароль *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-600">
                Я согласен с <a href="#" className="text-blue-500 hover:underline">правилами LEANID SOLAR</a>
              </label>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Регистрация
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;