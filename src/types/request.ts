
export const REQUEST_CATEGORIES = [
  'Бот',
  'Интеграция',
  'Отчёт',
  'Другое',
] as const;

export const REQUEST_STATUSES = [
  'Новая',
  'В работе',
  'Завершена',
] as const;

export type RequestCategory =
  (typeof REQUEST_CATEGORIES)[number];

export type RequestStatus =
  (typeof REQUEST_STATUSES)[number];

export interface AutomationRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: RequestCategory;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export interface RequestFormData {
  title: string;
  description: string;
  category: RequestCategory;
  status: RequestStatus;
}
