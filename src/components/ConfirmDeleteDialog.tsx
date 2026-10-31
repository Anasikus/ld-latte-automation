import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  itemType: 'заявку' | 'услугу';
  itemName: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteDialog({
  itemType,
  itemName,
  busy,
  onCancel,
  onConfirm,
}: Props) {
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButton.current?.focus();
  }, []);

  useEffect(() => {
    if (busy) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [busy, onCancel]);

  return (
    <div className="modal-overlay">
      <section
        className="request-modal confirm-delete-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <div className="modal-header">
          <h2 id="confirm-delete-title">
            <AlertTriangle size={22} aria-hidden="true" />
            Удалить {itemType}?
          </h2>
          <button
            className="icon-button"
            type="button"
            aria-label="Закрыть"
            disabled={busy}
            onClick={onCancel}
          >
            <X size={20} />
          </button>
        </div>
        <p id="confirm-delete-description">
          «<strong>{itemName}</strong>» будет удалена без возможности восстановления.
        </p>
        <div className="form-actions">
          <button
            ref={cancelButton}
            type="button"
            className="button-secondary"
            disabled={busy}
            onClick={onCancel}
          >
            Отмена
          </button>
          <button
            type="button"
            className="button-danger"
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? 'Удаление...' : 'Удалить навсегда'}
          </button>
        </div>
      </section>
    </div>
  );
}
