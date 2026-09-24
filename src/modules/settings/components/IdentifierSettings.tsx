import React from 'react';
import { WorkshopSettings } from '../../../types/settings';

interface IdentifierSettingsProps {
  form: WorkshopSettings;
  onChange: (updated: WorkshopSettings) => void;
  onSave: (e: React.FormEvent) => void;
}

export const IdentifierSettings: React.FC<IdentifierSettingsProps> = ({
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
        <h3 className="text-sm font-bold text-neutral-900">
          Identifier Prefixes & Numbering Sequence
        </h3>
        <p className="text-xs text-neutral-500">
          Unique permanent IDs are assigned using sequential prefixes for each workshop
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Customer Prefix</label>
          <input
            type="text"
            value={form.customerPrefix}
            onChange={(e) => onChange({ ...form, customerPrefix: e.target.value })}
            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono font-bold"
          />
          <span className="text-[10px] text-neutral-400 mt-1 block">Example: CUS-000001</span>
        </div>

        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Vehicle Prefix</label>
          <input
            type="text"
            value={form.vehiclePrefix}
            onChange={(e) => onChange({ ...form, vehiclePrefix: e.target.value })}
            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono font-bold"
          />
          <span className="text-[10px] text-neutral-400 mt-1 block">Example: VEH-000001</span>
        </div>

        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Job Card Prefix</label>
          <input
            type="text"
            value={form.jobCardPrefix}
            onChange={(e) => onChange({ ...form, jobCardPrefix: e.target.value })}
            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono font-bold"
          />
          <span className="text-[10px] text-neutral-400 mt-1 block">Example: JOB-000101</span>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-100">
        <button
          type="submit"
          className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-2xs"
        >
          Update Prefix Config
        </button>
      </div>
    </form>
  );
};
