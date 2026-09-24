import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-xl shadow-xl border border-neutral-200 p-4 sm:p-6 overflow-hidden">
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`p-2.5 rounded-full shrink-0 ${
              isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-normal">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-neutral-400 hover:text-neutral-600 p-1.5 -mr-1 -mt-1 rounded-md"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-neutral-100">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors text-center"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-white rounded-md transition-colors text-center ${
              isDestructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-neutral-900 hover:bg-neutral-800'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
