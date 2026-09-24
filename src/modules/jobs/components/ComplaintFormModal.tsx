import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from '../../../types/complaint';

interface ComplaintFormModalProps {
  isOpen: boolean;
  initialData?: Complaint | null;
  onClose: () => void;
  onSubmit: (data: {
    complaint: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    status?: ComplaintStatus;
    relatedPreviousJobId?: string;
    technicianNotes?: string;
  }) => Promise<void>;
}

export const ComplaintFormModal: React.FC<ComplaintFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [compText, setCompText] = useState('');
  const [compCategory, setCompCategory] = useState<ComplaintCategory>('General / Periodic');
  const [compPriority, setCompPriority] = useState<ComplaintPriority>('Medium');
  const [compStatus, setCompStatus] = useState<ComplaintStatus>('Reported');
  const [compRefJob, setCompRefJob] = useState('');
  const [compDiagnosis, setCompDiagnosis] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCompText(initialData.complaint);
      setCompCategory(initialData.category);
      setCompPriority(initialData.priority);
      setCompStatus(initialData.status);
      setCompRefJob(initialData.relatedPreviousJobId || '');
      setCompDiagnosis(initialData.technicianNotes || '');
    } else {
      setCompText('');
      setCompCategory('General / Periodic');
      setCompPriority('Medium');
      setCompStatus('Reported');
      setCompRefJob('');
      setCompDiagnosis('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compText.trim()) return;
    try {
      setIsSubmitting(true);
      await onSubmit({
        complaint: compText.trim(),
        category: compCategory,
        priority: compPriority,
        status: initialData ? compStatus : undefined,
        relatedPreviousJobId: compRefJob.trim() || undefined,
        technicianNotes: compDiagnosis.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border border-neutral-200 p-4 sm:p-6 space-y-4 max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <h3 className="text-base font-bold text-neutral-900">
            {initialData ? 'Edit Customer Complaint' : 'Add Customer Complaint'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Customer Description *</label>
            <textarea
              value={compText}
              onChange={(e) => setCompText(e.target.value)}
              placeholder="e.g. Squeaking noise while braking, steering vibration at 80 km/h"
              rows={2}
              className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              required
            />
          </div>

          <div className={`grid grid-cols-1 sm:${initialData ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Category</label>
              <select
                value={compCategory}
                onChange={(e) => setCompCategory(e.target.value as ComplaintCategory)}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
              >
                <option value="General / Periodic">General / Periodic</option>
                <option value="Brakes">Brakes</option>
                <option value="Engine">Engine</option>
                <option value="Suspension">Suspension</option>
                <option value="Electrical">Electrical</option>
                <option value="Air Conditioning">Air Conditioning</option>
                <option value="Transmission & Clutch">Transmission & Clutch</option>
                <option value="Steering">Steering</option>
                <option value="Body & Trim">Body & Trim</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Priority</label>
              <select
                value={compPriority}
                onChange={(e) => setCompPriority(e.target.value as ComplaintPriority)}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            {initialData && (
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Status</label>
                <select
                  value={compStatus}
                  onChange={(e) => setCompStatus(e.target.value as ComplaintStatus)}
                  className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                >
                  <option value="Reported">Reported</option>
                  <option value="Diagnosed">Diagnosed</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Customer Deferred">Customer Deferred</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Related Previous Job ID (If Repeat Issue)
            </label>
            <input
              type="text"
              placeholder="e.g. JOB-000101"
              value={compRefJob}
              onChange={(e) => setCompRefJob(e.target.value)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Technician Diagnostic Notes</label>
            <textarea
              value={compDiagnosis}
              onChange={(e) => setCompDiagnosis(e.target.value)}
              placeholder="Initial observations by mechanic"
              rows={2}
              className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm focus:outline-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-2 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-3.5 py-2 font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md disabled:opacity-50 transition-colors text-center"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Complaint' : 'Save Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
