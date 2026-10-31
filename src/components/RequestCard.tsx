
import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import type { AutomationRequest } from '../types/request';

interface Props {
  request: AutomationRequest;
  onEdit: (request: AutomationRequest) => void;
  onDelete?: (request: AutomationRequest) => void;
  deleteDisabled?: boolean;
}

export default function RequestCard({
  request, onEdit, onDelete, deleteDisabled = false,
}: Props) {
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

        <div className="request-card-actions">
          <button
            type="button"
            className="edit-button"
            onClick={() => onEdit(request)}
          >
            <Pencil size={15} />
            Изменить
          </button>
          {onDelete && (
            <button
              type="button"
              className="delete-button"
              disabled={deleteDisabled}
              aria-label={`Удалить заявку «${request.title}»`}
              onClick={() => onDelete(request)}
            >
              <Trash2 size={16} aria-hidden="true" />
              Удалить
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
