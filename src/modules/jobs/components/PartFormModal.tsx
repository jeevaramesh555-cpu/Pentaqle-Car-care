import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PartAction, PartUsage } from '../../../types/part';

interface PartFormModalProps {
  isOpen: boolean;
  initialData?: PartUsage | null;
  onClose: () => void;
  onSubmit: (data: {
    partName: string;
    brand: string;
    partNumber?: string;
    quantity: number;
    action: PartAction;
    warrantyNotes?: string;
    notes?: string;
  }) => Promise<void>;
}

export const PartFormModal: React.FC<PartFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [partName, setPartName] = useState('');
  const [partBrand, setPartBrand] = useState('OEM Genuine');
  const [partNumber, setPartNumber] = useState('');
  const [partQty, setPartQty] = useState(1);
  const [partAction, setPartAction] = useState<PartAction>('Replaced');
  const [partWarranty, setPartWarranty] = useState('6 Months / 10,000 km');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setPartName(initialData.partName);
      setPartBrand(initialData.brand);
      setPartNumber(initialData.partNumber || '');
      setPartQty(initialData.quantity);
      setPartAction(initialData.action);
      setPartWarranty(initialData.warrantyNotes || '');
      setNotes(initialData.notes || '');
    } else {
      setPartName('');
      setPartBrand('OEM Genuine');
      setPartNumber('');
      setPartQty(1);
      setPartAction('Replaced');
      setPartWarranty('6 Months / 10,000 km');
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName.trim()) return;
    try {
      setIsSubmitting(true);
      await onSubmit({
        partName: partName.trim(),
        brand: partBrand.trim(),
        partNumber: partNumber.trim() || undefined,
        quantity: Math.max(1, Number(partQty) || 1),
        action: partAction,
        warrantyNotes: partWarranty.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-neutral-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <h3 className="text-base font-bold text-neutral-900">
            {initialData ? 'Edit Part Usage / Replacement' : 'Record Part Usage / Replacement'}
          </h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Part Description *</label>
            <input
              type="text"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              placeholder="e.g. Front Ceramic Brake Pads (Set of 4)"
              className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Brand *</label>
              <input
                type="text"
                value={partBrand}
                onChange={(e) => setPartBrand(e.target.value)}
                placeholder="e.g. Brembo, Bosch, Toyota OEM"
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Part / SKU Number</label>
              <input
                type="text"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="e.g. BR-P83109"
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Quantity</label>
              <input
                type="number"
                value={partQty}
                onChange={(e) => setPartQty(Number(e.target.value))}
                min="1"
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Action</label>
              <select
                value={partAction}
                onChange={(e) => setPartAction(e.target.value as PartAction)}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
              >
                <option value="Replaced">Replaced (New)</option>
                <option value="Repaired">Repaired</option>
                <option value="Cleaned">Cleaned</option>
                <option value="Adjusted">Adjusted</option>
                <option value="Refitted">Refitted</option>
                <option value="Inspected">Inspected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Warranty Details</label>
            <input
              type="text"
              value={partWarranty}
              onChange={(e) => setPartWarranty(e.target.value)}
              placeholder="e.g. 1 Year / 20,000 km warranty"
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Notes / Serial (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Batch number, supplier details, or installation notes"
              rows={2}
              className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Part Record' : 'Save Part Usage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
