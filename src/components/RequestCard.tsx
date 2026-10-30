
import { CalendarDays, Pencil } from 'lucide-react';
import type { AutomationRequest } from '../types/request';

interface Props {
  request: AutomationRequest;
  onEdit: (request: AutomationRequest) => void;
}

export default function RequestCard({ request, onEdit }: Props) {
  const statusClass = {
    'Новая': 'status-new',
    'В работе': 'status-progress',
    'Завершена': 'status-done',
  }[request.status];

  const createdAt = new Date(request.created_at)
    .toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  return (
    <article className="request-card">
      <div className="request-card-top">
        <span className="category-label">{request.category}</span>
        <span className={`status-badge ${statusClass}`}>
          {request.status}
        </span>
      </div>

      <h3>{request.title}</h3>
      <p className="request-description">
        {request.description}
      </p>

      <div className="request-card-bottom">
        <span className="request-date">
          <CalendarDays size={15} />
          {createdAt}
        </span>

        <button
          type="button"
          className="edit-button"
          onClick={() => onEdit(request)}
        >
          <Pencil size={15} />
          Изменить
        </button>
      </div>
    </article>
  );
}
