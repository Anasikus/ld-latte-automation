
import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/getErrorMessage';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const { showToast } = useToast();
  const { user, signUp } = useAuth();

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
    ;

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);

    try {
      await signUp(email.trim(), password);
      showToast(
        'Регистрация выполнена. Если требуется подтверждение почты, проверьте письмо.'
      , 'success');
      } catch (err) {
        console.error('Ошибка регистрации:', err);
        showToast(getErrorMessage(err, 'Не удалось зарегистрироваться'), 'error');
      } finally {
        setLoading(false);
      }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Создать аккаунт</h1>
        <p>Регистрация в LD LATTE Automation</p>

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
          autoComplete="new-password"
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Минимум 6 символов"
        />

        
        

        <button type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </main>
  );
}
