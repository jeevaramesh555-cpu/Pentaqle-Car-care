import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  User,
  Gauge,
  Fuel,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { FullJobCardDetail } from '../../../services/jobRepository';
import { JobCardStatus } from '../../../types/jobCard';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatDate, formatOdometer } from '../../../utils/formatters';

interface JobOverviewProps {
  details: FullJobCardDetail;
  canManage: boolean;
  onStatusChange: (status: JobCardStatus) => void;
}

const statuses: JobCardStatus[] = [
  'Open',
  'Inspection',
  'Waiting Approval',
  'In Progress',
  'Waiting Parts',
  'Ready',
  'Delivered',
  'Closed',
];

export const JobOverview: React.FC<JobOverviewProps> = ({
  details,
  canManage,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const { job, customer, vehicle } = details;

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="font-mono font-bold text-xl sm:text-2xl text-neutral-900">{job.id}</span>
            <StatusBadge status={job.status} />
            <span className="font-mono text-xs text-neutral-400">Intake: {formatDate(job.date)}</span>
          </div>

          {/* Quick Vehicle & Customer Overview */}
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 mt-3 text-xs">
            {vehicle && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Car className="w-4 h-4 text-neutral-500 shrink-0" />
                <button
                  onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                  className="font-mono font-bold text-neutral-900 hover:underline flex items-center gap-1"
                >
                  <span>{vehicle.registrationNumber}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </button>
                <span className="text-neutral-500">
                  ({vehicle.make} {vehicle.model} {vehicle.variant})
                </span>
              </div>
            )}

            {customer && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-700">
                <User className="w-4 h-4 text-neutral-400 shrink-0" />
                <button
                  onClick={() => navigate(`/customers/${customer.id}`)}
                  className="font-semibold text-neutral-900 hover:underline"
                >
                  {customer.name}
                </button>
                <span className="font-mono text-neutral-400">({customer.mobile})</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Gauge className="w-4 h-4 text-neutral-400 shrink-0" />
              <span className="font-mono font-bold text-neutral-900 tabular-nums">
                {formatOdometer(job.odometer)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-600">
              <Fuel className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>
                Fuel: <strong>{job.fuelLevel}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Status Changer Dropdown */}
        {canManage && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 bg-neutral-50 rounded-lg border border-neutral-200 w-full sm:w-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Update Status:
            </span>
            <div className="relative w-full sm:w-auto">
              <select
                value={job.status}
                onChange={(e) => onStatusChange(e.target.value as JobCardStatus)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold bg-white border border-neutral-300 rounded-md text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Operational Staff metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-neutral-100 text-xs">
        <div>
          <span className="text-neutral-400 uppercase text-[10px] block">Service Advisor</span>
          <span className="font-semibold text-neutral-800 truncate block">{job.serviceAdvisor}</span>
        </div>
        <div>
          <span className="text-neutral-400 uppercase text-[10px] block">Assigned Technician</span>
          <span className="font-semibold text-neutral-800 truncate block">
            {job.assignedTechnician || 'Unassigned'}
          </span>
        </div>
        <div>
          <span className="text-neutral-400 uppercase text-[10px] block">Expected Delivery</span>
          <span className="text-neutral-800 font-medium block">{formatDate(job.expectedCompletionDate)}</span>
        </div>
        <div>
          <span className="text-neutral-400 uppercase text-[10px] block">Vehicle Lifetime Record</span>
          {vehicle && (
            <button
              onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              className="text-neutral-900 font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
            >
              <span>Lifetime Profile</span>
              <ChevronDown className="w-3 h-3 -rotate-90" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
