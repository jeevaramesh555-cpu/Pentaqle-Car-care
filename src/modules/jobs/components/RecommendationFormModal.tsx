import React, { useState } from 'react';
import { X } from 'lucide-react';
import { RecommendationPriority } from '../../../types/recommendation';

interface RecommendationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultNextKm?: number;
  onSubmit: (data: {
    recommendation: string;
    priority: RecommendationPriority;
    recommendedNextKm?: number;
  }) => Promise<void>;
}

export const RecommendationFormModal: React.FC<RecommendationFormModalProps> = ({
  isOpen,
  onClose,
  defaultNextKm = 0,
  onSubmit,
}) => {
  const [recText, setRecText] = useState('');
  const [recPriority, setRecPriority] = useState<RecommendationPriority>('Medium');
  const [recNextKm, setRecNextKm] = useState<number>(defaultNextKm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recText.trim()) return;
    try {
      setIsSubmitting(true);
      await onSubmit({
        recommendation: recText.trim(),
        priority: recPriority,
        recommendedNextKm: recNextKm ? Number(recNextKm) : undefined,
      });
      setRecText('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-neutral-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <h3 className="text-base font-bold text-neutral-900">Add Next Visit Recommendation</h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Recommendation Note *</label>
            <textarea
              value={recText}
              onChange={(e) => setRecText(e.target.value)}
              placeholder="e.g. Transmission fluid flush due at next service; inspect rear suspension bushings"
              rows={2}
              className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Priority</label>
              <select
                value={recPriority}
                onChange={(e) => setRecPriority(e.target.value as RecommendationPriority)}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Target Odometer (km)</label>
              <input
                type="number"
                value={recNextKm}
                onChange={(e) => setRecNextKm(Number(e.target.value))}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 font-semibold text-neutral-700 bg-neutral-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 font-semibold text-white bg-neutral-900 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Recommendation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
