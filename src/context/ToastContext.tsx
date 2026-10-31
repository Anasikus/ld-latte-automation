import {
  createContext, useCallback, useContext, useEffect,
  useMemo, useRef, useState, type ReactNode,
} from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import '../styles/toast.scss';

type ToastTone = 'success' | 'error' | 'info';
interface Toast { id: number; tone: ToastTone; message: string }
interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);
const toastLabels: Record<ToastTone, string> = {
  success: 'Успешно', error: 'Ошибка', info: 'Уведомление',
};
const toastIcons = { success: CheckCircle2, error: AlertCircle, info: Info };

function ToastItem({ toast, dismiss }: {
  toast: Toast; dismiss: (id: number) => void;
}) {
  const Icon = toastIcons[toast.tone];
  useEffect(() => {
    const timer = window.setTimeout(
      () => dismiss(toast.id), toast.tone === 'error' ? 8000 : 5000
    );
    return () => window.clearTimeout(timer);
  }, [dismiss, toast.id, toast.tone]);
  return (
    <div className={`toast toast--${toast.tone}`}
      role={toast.tone === 'error' ? 'alert' : 'status'}>
      <Icon size={21} className="toast-icon" aria-hidden="true" />
      <div className="toast-content">
        <strong>{toastLabels[toast.tone]}</strong>
        <p>{toast.message}</p>
      </div>
      <button type="button" className="toast-close"
        onClick={() => dismiss(toast.id)} aria-label="Закрыть уведомление">
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const showToast = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = ++nextId.current;
    setToasts(items => [...items.slice(-3), { id, tone, message }]);
  }, []);
  const dismiss = useCallback((id: number) => {
    setToasts(items => items.filter(item => item.id !== id));
  }, []);
  const value = useMemo(() => ({ showToast }), [showToast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-label="Уведомления">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} dismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast должен быть внутри ToastProvider');
  return ctx;
}
