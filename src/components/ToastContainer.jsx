import { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const TOAST_ICONS = {
  success: <CheckCircle2 size={18} color="#22C55E" />,
  error:   <XCircle size={18}     color="#C0392B" />,
  warning: <AlertTriangle size={18} color="#C8960C" />,
  info:    <Info size={18}         color="#007AD1" />,
};

export default function ToastContainer({ toasts = [], onRemove }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref.current) ref.current.classList.add('removing');
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration ?? 5000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div ref={ref} className={`toast ${toast.type ?? 'info'}`} role="alert">
      <span className="toast-icon">
        {TOAST_ICONS[toast.type] ?? TOAST_ICONS.info}
      </span>
      <div className="toast-body">
        <div className="toast-title">{toast.title}</div>
        {toast.message && <div className="toast-msg">{toast.message}</div>}
      </div>
      <button
        className="toast-close-btn"
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
