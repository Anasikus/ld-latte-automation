
export function getErrorMessage(
  error: unknown,
  fallback = 'Не удалось выполнить операцию. Попробуйте ещё раз.'
): string {
  const message =
    error instanceof Error ? error.message : String(error);

  const normalized = message.toLowerCase();

  if (
    normalized.includes('failed to fetch') ||
    normalized.includes('network') ||
    normalized.includes('fetch failed')
  ) {
    return 'Не удалось подключиться к серверу. Проверьте интернет-соединение.';
  }

  if (normalized.includes('invalid login credentials')) {
    return 'Неверный email или пароль.';
  }

  if (normalized.includes('email not confirmed')) {
    return 'Подтвердите адрес электронной почты.';
  }

  if (normalized.includes('user already registered')) {
    return 'Пользователь с таким email уже зарегистрирован.';
  }

  if (normalized.includes('password should be')) {
    return 'Пароль не соответствует требованиям безопасности.';
  }

  if (normalized.includes('email rate limit exceeded')) {
    return 'Слишком много запросов. Попробуйте позже.';
  }

  return fallback;
}
