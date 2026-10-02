import React from 'react';
import { ToastMessage } from '../hooks/useProgress.ts';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-xl border transition-all duration-200 ${
              isSuccess
                ? 'bg-[#121814] border-emerald-500/30 text-emerald-300'
                : isWarning
                ? 'bg-[#1a140d] border-amber-500/30 text-amber-300'
                : 'bg-[#141416] border-zinc-700/60 text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5 text-sm font-medium">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              {!isSuccess && !isWarning && <Info className="w-4 h-4 text-zinc-400 shrink-0" />}
              <span>{toast.text}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
