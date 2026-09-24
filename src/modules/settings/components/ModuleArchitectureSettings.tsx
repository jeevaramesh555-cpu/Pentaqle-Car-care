import React from 'react';
import { Lock } from 'lucide-react';
import { WorkshopSettings } from '../../../types/settings';

interface ModuleArchitectureSettingsProps {
  form: WorkshopSettings;
  onToggle: (moduleKey: keyof WorkshopSettings['modules']) => void;
}

export const ModuleArchitectureSettings: React.FC<ModuleArchitectureSettingsProps> = ({
  form,
  onToggle,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-6 space-y-6">
      <div className="border-b border-neutral-100 pb-3">
        <h3 className="text-sm font-bold text-neutral-900">
          Modular Architecture & Optional Capabilities
        </h3>
        <p className="text-xs text-neutral-500">
          Toggle optional modules per workshop contract. The core service history and job cards
          operate independently regardless of billing state.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Workshop */}
        <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-50/70 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900">
                Core Digital Service History
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-200 text-neutral-800 rounded flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Essential Core
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Customer directory, vehicle specifications, intake job cards, technician diagnosis,
              parts replacement log, and recommendations.
            </p>
          </div>
          <div className="w-10 h-6 bg-neutral-900 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
        </div>

        {/* Billing Module */}
        <div className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start justify-between hover:border-neutral-300 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900">Billing & Invoicing</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                Optional
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Invoice generation, tax computation, and parts cost calculations. Keep disabled if the
              workshop uses an external accounting system (e.g. Tally, Zoho).
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggle('billing')}
            className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${
              form.modules.billing ? 'bg-neutral-900 justify-end' : 'bg-neutral-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-2xs" />
          </button>
        </div>

        {/* Inventory Module */}
        <div className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start justify-between hover:border-neutral-300 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900">Inventory Management</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-100 text-neutral-600 rounded">
                Optional
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Stock levels, supplier purchase orders, low stock warnings, and parts catalog.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggle('inventory')}
            className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${
              form.modules.inventory
                ? 'bg-neutral-900 justify-end'
                : 'bg-neutral-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-2xs" />
          </button>
        </div>

        {/* WhatsApp Integration */}
        <div className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start justify-between hover:border-neutral-300 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900">WhatsApp Notifications</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                Optional
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Automated job card intake receipts, estimate approvals, and ready-for-delivery alerts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggle('whatsAppNotifications')}
            className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${
              form.modules.whatsAppNotifications
                ? 'bg-neutral-900 justify-end'
                : 'bg-neutral-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-2xs" />
          </button>
        </div>

        {/* Service Reminders */}
        <div className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start justify-between hover:border-neutral-300 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900">Service Reminders</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-100 text-neutral-600 rounded">
                Optional
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Automated outreach to car owners when their odometer interval or 6-month period is due.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggle('serviceReminders')}
            className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${
              form.modules.serviceReminders
                ? 'bg-neutral-900 justify-end'
                : 'bg-neutral-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-2xs" />
          </button>
        </div>

        {/* Customer Portal */}
        <div className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start justify-between hover:border-neutral-300 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900">Customer Digital Portal</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-100 text-neutral-600 rounded">
                Optional
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Online self-service portal where car owners can look up their own lifetime digital service book.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggle('customerPortal')}
            className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ${
              form.modules.customerPortal
                ? 'bg-neutral-900 justify-end'
                : 'bg-neutral-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-2xs" />
          </button>
        </div>
      </div>
    </div>
  );
};
