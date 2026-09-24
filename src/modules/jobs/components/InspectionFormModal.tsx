import React, { useState } from 'react';
import { X } from 'lucide-react';
import { InspectionSeverity, CustomerApprovalStatus } from '../../../types/inspection';

interface InspectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: string;
    finding: string;
    severity: InspectionSeverity;
    approvalStatus: CustomerApprovalStatus;
  }) => Promise<void>;
}

export const InspectionFormModal: React.FC<InspectionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [insCategory, setInsCategory] = useState('Brakes & Safety');
  const [insFinding, setInsFinding] = useState('');
  const [insSeverity, setInsSeverity] = useState<InspectionSeverity>('Attention');
  const [insApproval, setInsApproval] = useState<CustomerApprovalStatus>('Pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insFinding.trim()) return;
    try {
      setIsSubmitting(true);
      await onSubmit({
        category: insCategory,
        finding: insFinding.trim(),
        severity: insSeverity,
        approvalStatus: insApproval,
      });
      setInsFinding('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-neutral-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <h3 className="text-base font-bold text-neutral-900">Record Inspection Finding</h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Inspection Finding *</label>
            <textarea
              value={insFinding}
              onChange={(e) => setInsFinding(e.target.value)}
              placeholder="e.g. Front brake pads at 2.5mm thickness, replacement recommended"
              rows={2}
              className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Severity</label>
              <select
                value={insSeverity}
                onChange={(e) => setInsSeverity(e.target.value as InspectionSeverity)}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
              >
                <option value="Good">Good</option>
                <option value="Attention">Attention Needed</option>
                <option value="Urgent">Urgent / Safety Critical</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Customer Approval</label>
              <select
                value={insApproval}
                onChange={(e) => setInsApproval(e.target.value as CustomerApprovalStatus)}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
              >
                <option value="Not Required">Not Required</option>
                <option value="Pending">Pending Approval</option>
                <option value="Approved">Customer Approved</option>
                <option value="Declined">Customer Declined</option>
              </select>
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
              {isSubmitting ? 'Saving...' : 'Save Finding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
