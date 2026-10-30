-- LD LATTE: demonstration services. Run after schema.sql.
-- No user accounts or private requests are included.

insert into public.services (name, active) values
    ('Создание Telegram-бота', true),
    ('Интеграция CRM', true),
    ('Автоматизация отчётов', false),
    ('Интеграция Google Sheets', true),
    ('Настройка уведомлений', false),
    ('Разработка веб-приложения', true),
    ('Интеграция Telegram и CRM', true),
    ('Автоматизация обработки заявок', true),
    ('Настройка API-интеграций', true);
