'use client';

import { Fragment, ReactNode } from 'react';
import { X } from 'lucide-react';
import { gsap } from 'gsap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, className = '', maxWidth = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <Fragment>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div
          className={`${maxWidthClasses[maxWidth]} w-full bg-white rounded-xl shadow-lg overflow-hidden`}
          ref={(el) => {
            if (el) {
              gsap.from(el, {
                scale: 0.95,
                opacity: 0,
                duration: 0.15,
                ease: 'power2.out',
              });
            }
          }}
        >
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold text-slate-900">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </Fragment>
  );
}