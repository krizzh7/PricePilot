'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: { type?: ToastType; title: string; message?: string; duration?: number }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      type = 'info',
      title,
      message,
      duration = 3000,
    }: {
      type?: ToastType;
      title: string;
      message?: string;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      {/* Toast Container - fixed bottom right */}
      <div
        className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-saas backdrop-blur-md transition-all duration-300 animate-slide-in',
              item.type === 'success' && 'border-emerald-500/30 bg-emerald-50/95 text-emerald-950 dark:bg-emerald-950/90 dark:text-emerald-50 dark:border-emerald-500/40',
              item.type === 'error' && 'border-rose-500/30 bg-rose-50/95 text-rose-950 dark:bg-rose-950/90 dark:text-rose-50 dark:border-rose-500/40',
              item.type === 'info' && 'border-blue-500/30 bg-blue-50/95 text-blue-950 dark:bg-blue-950/90 dark:text-blue-50 dark:border-blue-500/40'
            )}
          >
            {/* Icon */}
            <div className="shrink-0 pt-0.5">
              {item.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
              {item.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
              {item.type === 'info' && <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold leading-tight">{item.title}</h5>
              {item.message && (
                <p className="mt-1 text-xs opacity-90 leading-relaxed">{item.message}</p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(item.id)}
              className="shrink-0 -mr-1 -mt-1 p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
