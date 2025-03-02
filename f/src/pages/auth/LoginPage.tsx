import React, { useState, useEffect } from 'react';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Проверяем, авторизован ли пользователь при загрузке компонента
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      console.log('Login successful:', response);

      // Сохраняем токен в localStorage
      localStorage.setItem('token', response.token);

      // Если в ответе есть данные пользователя, сохраняем и их
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Перенаправляем на дашборд
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>SOLAR</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
