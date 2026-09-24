import React from 'react';
import { WorkshopSettings } from '../../../types/settings';

interface WorkshopProfileSettingsProps {
  form: WorkshopSettings;
  onChange: (updated: WorkshopSettings) => void;
  onSave: (e: React.FormEvent) => void;
}

export const WorkshopProfileSettings: React.FC<WorkshopProfileSettingsProps> = ({
  form,
  onChange,
  onSave,
}) => {
  return (
    <form
      onSubmit={onSave}
      className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-4 sm:p-6 space-y-4 sm:space-y-5"
    >
      <div className="border-b border-neutral-100 pb-3">
        <h3 className="text-sm font-bold text-neutral-900">Workshop Company Profile</h3>
        <p className="text-xs text-neutral-500">
          Customize company details printed on job sheets, customer receipts, and digital service logs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Workshop Name *</label>
          <input
            type="text"
            value={form.workshopName}
            onChange={(e) => onChange({ ...form, workshopName: e.target.value })}
            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-semibold text-sm"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Tagline</label>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => onChange({ ...form, tagline: e.target.value })}
            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-neutral-700 mb-1">
            Physical Street Address
          </label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => onChange({ ...form, address: e.target.value })}
            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-neutral-700 mb-1">City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => onChange({ ...form, city: e.target.value })}
            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => onChange({ ...form, state: e.target.value })}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm"
            />
          </div>
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Postal PIN</label>
            <input
              type="text"
              value={form.pin}
              onChange={(e) => onChange({ ...form, pin: e.target.value })}
              className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Primary Phone</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => onChange({ ...form, phone: e.target.value })}
            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block font-semibold text-neutral-700 mb-1">WhatsApp Business</label>
          <input
            type="text"
            value={form.whatsApp}
            onChange={(e) => onChange({ ...form, whatsApp: e.target.value })}
            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange({ ...form, email: e.target.value })}
            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm"
          />
        </div>
        <div>
          <label className="block font-semibold text-neutral-700 mb-1">GSTIN / Tax ID</label>
          <input
            type="text"
            value={form.gstin || ''}
            onChange={(e) => onChange({ ...form, gstin: e.target.value })}
            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono text-sm uppercase"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-100">
        <button
          type="submit"
          className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-2xs"
        >
          Save Workshop Profile
        </button>
      </div>
    </form>
  );
};
