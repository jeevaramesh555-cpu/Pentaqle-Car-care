import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Vehicle } from '../../../types/vehicle';
import { Customer } from '../../../types/customer';
import { formatDate } from '../../../utils/formatters';

interface VehicleSpecificationsProps {
  vehicle: Vehicle;
  customer: Customer | null;
}

export const VehicleSpecifications: React.FC<VehicleSpecificationsProps> = ({
  vehicle,
  customer,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-2">
          Automobile Specifications
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
          <div>
            <dt className="text-neutral-400">Make & Model</dt>
            <dd className="font-semibold text-neutral-900 mt-0.5">
              {vehicle.make} {vehicle.model}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-400">Variant</dt>
            <dd className="font-semibold text-neutral-900 mt-0.5">
              {vehicle.variant || 'Standard'}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-400">Manufacturing Year</dt>
            <dd className="font-mono text-neutral-900 mt-0.5">{vehicle.year}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Fuel & Transmission</dt>
            <dd className="font-semibold text-neutral-900 mt-0.5">
              {vehicle.fuelType} · {vehicle.transmission}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-400">Colour</dt>
            <dd className="font-medium text-neutral-900 mt-0.5">{vehicle.color || '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Insurance Expiry</dt>
            <dd className="font-mono text-neutral-900 mt-0.5">
              {formatDate(vehicle.insuranceExpiry)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-neutral-400">VIN / Chassis Number</dt>
            <dd className="font-mono font-bold text-neutral-900 mt-0.5 select-all">
              {vehicle.vin || '—'}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-neutral-400">Engine Number</dt>
            <dd className="font-mono font-bold text-neutral-900 mt-0.5 select-all">
              {vehicle.engineNumber || '—'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-2">
          Registered Owner Details
        </h3>
        {customer ? (
          <dl className="space-y-3 text-xs">
            <div>
              <dt className="text-neutral-400">Customer Name</dt>
              <dd className="font-semibold text-neutral-900 text-sm mt-0.5">
                {customer.name}
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-neutral-400">Mobile Number</dt>
                <dd className="font-mono font-semibold text-neutral-900 mt-0.5">
                  {customer.mobile}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-400">Alternate Phone</dt>
                <dd className="font-mono text-neutral-700 mt-0.5">
                  {customer.alternateMobile || '—'}
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-neutral-400">Address / City</dt>
              <dd className="text-neutral-800 mt-0.5">
                {customer.address}, {customer.city}
              </dd>
            </div>
            <div>
              <button
                onClick={() => navigate(`/customers/${customer.id}`)}
                className="mt-2 px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors inline-flex items-center gap-1.5"
              >
                <span>View Customer Profile & Other Cars</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </dl>
        ) : (
          <p className="text-xs text-neutral-400">No owner assigned.</p>
        )}

        {vehicle.notes && (
          <div className="pt-3 border-t border-neutral-100">
            <span className="text-[11px] font-semibold text-neutral-500 block mb-1">
              Workshop Internal Notes
            </span>
            <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-2.5 rounded border border-neutral-200">
              {vehicle.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
