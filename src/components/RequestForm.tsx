
import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { getErrorMessage } from '../utils/getErrorMessage';
import { useToast } from '../context/ToastContext';

import {
  REQUEST_CATEGORIES,
  REQUEST_STATUSES,
  type AutomationRequest,
  type RequestFormData,
  type RequestCategory,
  type RequestStatus,
} from '../types/request';

interface Props {
  request?: AutomationRequest | null;
  onSave: (data: RequestFormData) => Promise<void>;
  onClose: () => void;
}

export default function RequestForm({
  request,
  onSave,
  onClose,
}: Props) {
  const { showToast } = useToast();
  const isEditing = Boolean(request);


  const [title, setTitle] = useState(request?.title ?? '');
  const [description, setDescription] = useState(
    request?.description ?? ''
  );
  const [category, setCategory] = useState<RequestCategory>(
    request?.category ?? 'Бот'
  );
  const [status, setStatus] = useState<RequestStatus>(
    request?.status ?? 'Новая'
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    if (!title.trim() || !description.trim()) {
      setError('Заполните все обязательные поля');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        category,
        status: isEditing ? status : 'Новая',
      });
    } catch (err) {
      console.error('Ошибка сохранения заявки:', err);
      showToast(getErrorMessage(err, 'Не удалось сохранить заявку'), 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <section
        className="request-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-form-title"
      >
        <div className="modal-header">
          <h2 id="request-form-title">
            {isEditing ? 'Редактирование заявки' : 'Новая заявка'}
          </h2>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={saving}
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="request-form">
          <label htmlFor="request-title">Название *</label>
          <input
            id="request-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например, автоматизация отчётов"
            maxLength={150}
            required
          />

          <label htmlFor="request-description">
            Описание задачи *
          </label>
          <textarea
            id="request-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опишите, что необходимо автоматизировать..."
            rows={5}
            required
          />

          <label htmlFor="request-category">Категория *</label>
          <select
            id="request-category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as RequestCategory)
            }
            required
          >
            {REQUEST_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {isEditing && (
            <>
              <label htmlFor="request-status">Статус</label>
              <select
                id="request-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as RequestStatus)
                }
              >
                {REQUEST_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </>
          )}

          

          <div className="form-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Отмена
            </button>

            <button
              type="submit"
              className="button-primary"
              disabled={saving}
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
