import React from 'react';
import { Package, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { useSettings } from '../../context/SettingsContext';

export const InventoryPlaceholderPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory & Parts Catalog"
        subtitle="Independent modular stockroom management and supplier ledger"
        badge={
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${
              settings.modules.inventory
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {settings.modules.inventory ? 'Module Active' : 'Module Standby'}
          </span>
        }
      />

      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-8 max-w-3xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Spare Parts & Stockroom Ledger
            </h2>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              In <strong>{settings.workshopName.split('–')[0].trim()}</strong>, parts recorded on Job Cards directly populate the vehicle's permanent
              replacement history without requiring an active warehouse stock module.
            </p>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-3">
          <span className="font-bold text-neutral-900 block">
            Modular Capabilities:
          </span>
          <div className="space-y-2 text-neutral-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Parts Tracking Active:</strong> Technicians record replacement parts, OEM/aftermarket brands, and warranty terms directly into the vehicle's lifetime record.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Optional Stock Subsystem:</strong> Can be activated in Settings when warehouse supplier tracking is required.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
