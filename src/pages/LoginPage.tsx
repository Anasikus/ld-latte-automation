
import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function LoginPage() {
  const { user, signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      await signIn(email.trim(), password);
      } catch (err) {
        console.error('Ошибка входа:', err);
        setError(getErrorMessage(err, 'Не удалось войти в аккаунт'));
      } finally {
        setLoading(false);
      }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>С возвращением!</h1>
        <p>Войдите в LD LATTE Automation</p>

        <label htmlFor="email">Электронная почта</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
        />

        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
        />

        {error && <div className="form-error" role="alert">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Выполняется вход...' : 'Войти'}
        </button>

        <p className="auth-footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </main>
  );
}
