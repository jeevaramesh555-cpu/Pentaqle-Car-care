import React from 'react';
import { Receipt, CheckCircle, Sliders, ExternalLink } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { useSettings } from '../../context/SettingsContext';

export const BillingPlaceholderPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Invoicing"
        subtitle="Independent optional commercial module designed to integrate or remain decoupled"
        badge={
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${
              settings.modules.billing
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {settings.modules.billing ? 'Module Active' : 'Module Standby'}
          </span>
        }
      />

      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-8 max-w-3xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Decoupled Billing Architecture
            </h2>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              As required by the specification, <strong>{settings.workshopName.split('–')[0].trim()}</strong> core workflow is
              exclusively focused on maintaining the <em>lifetime digital service history</em> of
              every vehicle. The workshop deployment can utilize a separate external billing
              system or enable the built-in module when needed.
            </p>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-3">
          <span className="font-bold text-neutral-900 block">
            Architectural Guarantees Built Into This Codebase:
          </span>
          <div className="space-y-2 text-neutral-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Pricing In Core Flow:</strong> Job Cards, Inspections, Services
                Performed, and Parts Replacements operate completely free of billing dependencies.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Repository Independence:</strong> When billing is connected to an external
                accounting suite (like Tally, QuickBooks, or Zoho) via Google Apps Script, no changes
                to vehicle or job card schemas will be required.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Feature Flag Isolation:</strong> Can be turned ON/OFF in Workshop Settings
                without altering any customer or vehicle data.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
