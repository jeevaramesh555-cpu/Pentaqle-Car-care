import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { Customer, CustomerStatus } from '../../types/customer';
import { customerRepository } from '../../services/customerRepository';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (customer: Customer) => void;
  editingCustomer?: Customer;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  editingCustomer,
}) => {
  const { currentUser } = useAuth();
  const { notify } = useNotification();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [alternateMobile, setAlternateMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setMobile(editingCustomer.mobile);
      setAlternateMobile(editingCustomer.alternateMobile || '');
      setEmail(editingCustomer.email || '');
      setAddress(editingCustomer.address || '');
      setCity(editingCustomer.city);
      setNotes(editingCustomer.notes || '');
      setStatus(editingCustomer.status);
    } else {
      setName('');
      setMobile('+91 ');
      setAlternateMobile('');
      setEmail('');
      setAddress('');
      setCity('Bengaluru');
      setNotes('');
      setStatus('Active');
    }
  }, [editingCustomer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !city.trim()) {
      notify('Please fill customer name, mobile number, and city', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCustomer) {
        const updated = await customerRepository.update(
          editingCustomer.id,
          {
            name,
            mobile,
            alternateMobile,
            email,
            address,
            city,
            notes,
            status,
          },
          currentUser.name
        );
        notify(`Customer ${updated.name} updated!`);
        onSaved(updated);
      } else {
        const created = await customerRepository.create(
          {
            name,
            mobile,
            alternateMobile,
            email,
            address,
            city,
            notes,
            status,
          },
          currentUser.name
        );
        notify(`Customer ${created.name} registered!`);
        onSaved(created);
      }
      onClose();
    } catch (err: any) {
      notify(err.message || 'Operation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-neutral-900 text-white flex items-center justify-center font-bold shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                {editingCustomer ? 'Edit Customer Profile' : 'Register New Customer'}
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-500">Workshop customer contact and address details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Customer Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Number *</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Alternate Phone</label>
              <input
                type="text"
                placeholder="+91 98765 00000"
                value={alternateMobile}
                onChange={(e) => setAlternateMobile(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="ramesh@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Street Address</label>
              <input
                type="text"
                placeholder="42, 1st Cross, Indiranagar"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Customer Notes / Preferences</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Regular VIP customer, preferred contact via WhatsApp"
              rows={2}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CustomerStatus)}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-md transition-colors shadow-xs text-center"
            >
              {isSubmitting ? 'Saving...' : editingCustomer ? 'Update Customer' : 'Register Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
