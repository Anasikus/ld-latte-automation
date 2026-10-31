# Установка и запуск LD LATTE

### Требования

- Node.js и npm.
- Проект Supabase.
- n8n для Telegram-автоматизации.
- Telegram-бот, созданный через BotFather.

### Шаг 1. Клонирование репозитория

```bash
git clone https://github.com/Anasikus/ld-latte-automation.git
cd ld-latte-automation
```

### Шаг 2. Установка зависимостей

```bash
npm install
```

### Шаг 3. Настройка Supabase

Создайте новый проект в [Supabase](https://supabase.com/).

В SQL Editor последовательно выполните:

1. [`supabase/schema.sql`](./supabase/schema.sql) — создание таблиц и настройка RLS.
2. [`supabase/seed.sql`](./supabase/seed.sql) — добавление демонстрационных услуг.

SQL-файлы предназначены для нового проекта Supabase. Не следует выполнять их повторно в существующей рабочей базе без проверки.

**Основные таблицы:**

| Таблица | Назначение |
|---|---|
| `requests` | Пользовательские заявки |
| `services` | Услуги Telegram-бота |

Таблица `requests` связана с Supabase Authentication через `user_id`.

Политики RLS ограничивают доступ пользователей к собственным заявкам. Для `services` разрешено публичное чтение только активных услуг.

В настройках Supabase Authentication необходимо включить Email Authentication и при необходимости настроить подтверждение электронной почты.

### Шаг 4. Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Значения доступны в настройках проекта Supabase.

Используется публичный Publishable Key. Секретные ключи Supabase нельзя добавлять в клиентские переменные `VITE_`.

### Шаг 5. Локальный запуск

```bash
npm run dev
```

Откройте адрес, указанный Vite в терминале.

### Шаг 6. Настройка Telegram-бота в n8n

1. Создайте бота через BotFather.
2. Импортируйте [`n8n/telegram-services.json`](./n8n/telegram-services.json) в n8n.
3. Подключите Telegram Credentials к Telegram Trigger.
4. В обоих узлах Supabase REST API укажите URL проекта и Publishable Key.
5. В узлах `sendMessage` и `answerCallbackQuery` настройте собственный токен Telegram Bot API.
6. Проверьте параметры JSON Body.
7. Опубликуйте workflow.

После публикации отправьте боту `/start` и проверьте получение списка услуг.

Для самостоятельной работы Telegram Trigger необходим доступный извне HTTPS webhook n8n.

**Безопасность:** не публикуйте реальные токены Telegram, секретные ключи Supabase или файлы с приватными данными.