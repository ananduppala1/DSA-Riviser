import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onClose, onConfirm }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#121C2B] border border-[#304055] rounded-xl p-6 shadow-2xl relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7F90A6] hover:text-[#E7EDF5] p-1 rounded-lg hover:bg-[#202F43] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-[#402B33] border border-[#5C3A46] text-[#E18B91]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 id="reset-modal-title" className="text-lg font-semibold text-[#E7EDF5]">
            Reset All Progress
          </h2>
        </div>

        <p className="text-sm text-[#A6B3C5] leading-relaxed mb-6">
          Are you sure? This will mark all 98 problems as unsolved and reset your progress statistics, streaks, and completion history. Your curriculum structure will remain intact.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#A6B3C5] hover:text-[#E7EDF5] bg-[#182436] hover:bg-[#202F43] border border-[#304055] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-[#5C3A46] hover:bg-[#734455] border border-[#E18B91]/40 rounded-lg shadow-sm transition-colors"
          >
            Reset Everything
          </button>
        </div>
      </div>
    </div>
  );
};
