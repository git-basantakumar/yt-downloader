import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700/80 text-white text-xs shadow-2xl animate-in slide-in-from-bottom-2 fade-in">
      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
      <span className="max-w-xs">{message}</span>
      <button
        onClick={onDismiss}
        className="p-1 text-neutral-400 hover:text-white rounded transition-colors ml-1"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
