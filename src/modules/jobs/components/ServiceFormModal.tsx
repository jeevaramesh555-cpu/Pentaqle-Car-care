import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ServicePerformed, ServiceStatus } from '../../../types/service';

interface ServiceFormModalProps {
  isOpen: boolean;
  initialData?: ServicePerformed | null;
  onClose: () => void;
  defaultTechnician?: string;
  onSubmit: (data: {
    serviceName: string;
    category: string;
    technician: string;
    status: ServiceStatus;
    notes?: string;
  }) => Promise<void>;
}

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  defaultTechnician = 'Imran Khan',
  onSubmit,
}) => {
  const [srvName, setSrvName] = useState('');
  const [srvCategory, setSrvCategory] = useState('General Maintenance');
  const [srvTech, setSrvTech] = useState(defaultTechnician);
  const [srvStatus, setSrvStatus] = useState<ServiceStatus>('In Progress');
  const [srvNotes, setSrvNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSrvName(initialData.serviceName);
      setSrvCategory(initialData.category);
      setSrvTech(initialData.technician);
      setSrvStatus(initialData.status);
      setSrvNotes(initialData.notes || '');
    } else {
      setSrvName('');
      setSrvCategory('General Maintenance');
      setSrvTech(defaultTechnician);
      setSrvStatus('In Progress');
      setSrvNotes('');
    }
  }, [initialData, isOpen, defaultTechnician]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) return;
    try {
      setIsSubmitting(true);
      await onSubmit({
        serviceName: srvName.trim(),
        category: srvCategory,
        technician: srvTech,
        status: srvStatus,
        notes: srvNotes.trim() || undefined,
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
            {initialData ? 'Edit Work / Service Record' : 'Log Service / Work Performed'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Service / Task Name *</label>
            <input
              type="text"
              value={srvName}
              onChange={(e) => setSrvName(e.target.value)}
              placeholder="e.g. Front Brake Pad Replacement & Disc Bleeding"
              className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Category</label>
              <input
                type="text"
                value={srvCategory}
                onChange={(e) => setSrvCategory(e.target.value)}
                placeholder="e.g. Brakes, Transmission, Engine"
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Technician</label>
              <input
                type="text"
                value={srvTech}
                onChange={(e) => setSrvTech(e.target.value)}
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Status</label>
            <select
              value={srvStatus}
              onChange={(e) => setSrvStatus(e.target.value as ServiceStatus)}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Technician Notes (Optional)</label>
            <textarea
              value={srvNotes}
              onChange={(e) => setSrvNotes(e.target.value)}
              placeholder="Detailed observations or technician remarks"
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
              {isSubmitting ? 'Saving...' : initialData ? 'Update Service Record' : 'Save Service Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
