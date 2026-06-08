import { useState, useCallback } from 'react';

let nextId = 1;

/**
 * useToast – lightweight toast manager hook
 * Returns { toasts, addToast, removeToast }
 */
export default function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
