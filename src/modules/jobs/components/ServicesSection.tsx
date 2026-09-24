import React, { useState } from 'react';
import { Wrench, Plus, Pencil, ChevronDown, Check } from 'lucide-react';
import { ServicePerformed, ServiceStatus } from '../../../types/service';
import { StatusBadge } from '../../../components/common/StatusBadge';

interface ServicesSectionProps {
  services: ServicePerformed[];
  canManage: boolean;
  onAddClick: () => void;
  onEditClick?: (service: ServicePerformed) => void;
  onStatusChange?: (serviceId: string, newStatus: ServiceStatus) => void;
}

const SERVICE_STATUS_OPTIONS: { value: ServiceStatus; label: string; dotColor: string }[] = [
  { value: 'Pending', label: 'Pending', dotColor: 'bg-amber-500' },
  { value: 'In Progress', label: 'In Progress', dotColor: 'bg-sky-500' },
  { value: 'Completed', label: 'Completed', dotColor: 'bg-emerald-600' },
  { value: 'Cancelled', label: 'Cancelled', dotColor: 'bg-rose-600' },
];

const getStatusBadgeStyle = (status: ServiceStatus) => {
  switch (status) {
    case 'Pending':
      return {
        colorStyle: 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100/70',
        dotColor: 'bg-amber-500',
      };
    case 'In Progress':
      return {
        colorStyle: 'bg-sky-50 text-sky-800 border-sky-200/80 hover:bg-sky-100/70',
        dotColor: 'bg-sky-500',
      };
    case 'Completed':
      return {
        colorStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70',
        dotColor: 'bg-emerald-600',
      };
    case 'Cancelled':
      return {
        colorStyle: 'bg-rose-50 text-rose-800 border-rose-200/80 hover:bg-rose-100/70',
        dotColor: 'bg-rose-600',
      };
    default:
      return {
        colorStyle: 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200/70',
        dotColor: 'bg-neutral-500',
      };
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  canManage,
  onAddClick,
  onEditClick,
  onStatusChange,
}) => {
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-neutral-900">
            3. Work / Services Performed ({services.length})
          </h2>
        </div>
        {canManage && (
          <button
            onClick={onAddClick}
            className="px-2.5 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Service</span>
          </button>
        )}
      </div>

      {services.length === 0 ? (
        <p className="text-xs text-neutral-400 italic py-2">No service work records added yet.</p>
      ) : (
        <div className="space-y-2">
          {services.map((s) => {
            const statusStyle = getStatusBadgeStyle(s.status);
            const isDropdownOpen = openStatusDropdownId === s.id;

            return (
              <div
                key={s.id}
                className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs flex items-center justify-between gap-3 hover:border-neutral-300 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-neutral-900 leading-snug">{s.serviceName}</div>
                  <div className="text-neutral-500 text-[11px] mt-0.5">
                    {s.category} · Assigned: {s.technician}
                    {s.notes && (
                      <span className="block text-neutral-600 mt-1 italic font-normal">
                        Note: {s.notes}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Status Dropdown / Badge */}
                  {canManage && onStatusChange ? (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenStatusDropdownId(isDropdownOpen ? null : s.id)}
                        className={`inline-flex items-center gap-1.5 font-medium rounded-md border tracking-tight px-2 py-0.5 text-[11px] cursor-pointer transition-colors shadow-2xs focus:outline-none focus:ring-1 focus:ring-neutral-400 ${statusStyle.colorStyle}`}
                        title="Click to change status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusStyle.dotColor}`}
                          aria-hidden="true"
                        />
                        <span>{s.status}</span>
                        <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
                      </button>

                      {isDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setOpenStatusDropdownId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-38 bg-white rounded-lg shadow-xl border border-neutral-200 py-1 z-30 animate-in fade-in duration-100">
                            <div className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                              Change Status
                            </div>
                            {SERVICE_STATUS_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setOpenStatusDropdownId(null);
                                  if (opt.value !== s.status) {
                                    onStatusChange(s.id, opt.value);
                                  }
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left hover:bg-neutral-100 transition-colors ${
                                  opt.value === s.status
                                    ? 'font-semibold text-neutral-900 bg-neutral-50'
                                    : 'text-neutral-700'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${opt.dotColor}`} />
                                  <span>{opt.label}</span>
                                </span>
                                {opt.value === s.status && (
                                  <Check className="w-3 h-3 text-neutral-800" />
                                )}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <StatusBadge status={s.status} size="sm" />
                  )}

                  {canManage && onEditClick && (
                    <button
                      type="button"
                      onClick={() => onEditClick(s)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 rounded transition-colors shadow-2xs"
                      title="Edit Service Record"
                    >
                      <Pencil className="w-3 h-3 text-neutral-500" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
