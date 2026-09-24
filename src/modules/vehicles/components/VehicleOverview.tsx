import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  ExternalLink,
  Plus,
  Edit,
  Archive,
  AlertCircle,
} from 'lucide-react';
import { Vehicle } from '../../../types/vehicle';
import { Customer } from '../../../types/customer';
import { JobCard } from '../../../types/jobCard';
import { Recommendation } from '../../../types/recommendation';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatOdometer, formatDate, formatIndianRegNumber } from '../../../utils/formatters';

interface VehicleOverviewProps {
  vehicle: Vehicle;
  customer: Customer | null;
  jobCount: number;
  lastJob?: JobCard;
  pendingRecs: Recommendation[];
  canManageJobs: boolean;
  canManageVehicles: boolean;
  onOpenJob: () => void;
  onEditSpec: () => void;
  onArchiveToggle: () => void;
  onViewRecommendations: () => void;
}

export const VehicleOverview: React.FC<VehicleOverviewProps> = ({
  vehicle,
  customer,
  jobCount,
  lastJob,
  pendingRecs,
  canManageJobs,
  canManageVehicles,
  onOpenJob,
  onEditSpec,
  onArchiveToggle,
  onViewRecommendations,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
            <Car className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono font-bold text-2xl tracking-wider text-neutral-900">
                {formatIndianRegNumber(vehicle.registrationNumber)}
              </span>
              <StatusBadge status={vehicle.status} />
              <span className="text-xs font-mono text-neutral-400">ID: {vehicle.id}</span>
            </div>
            <div className="text-base font-semibold text-neutral-700 mt-1">
              {vehicle.make} {vehicle.model} {vehicle.variant && `· ${vehicle.variant}`} (
              {vehicle.year})
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-neutral-500">
              <span>
                Owner:{' '}
                {customer ? (
                  <button
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    className="font-semibold text-neutral-900 hover:underline inline-flex items-center gap-1"
                  >
                    {customer.name}
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </button>
                ) : (
                  'Unknown'
                )}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-semibold text-neutral-800 tabular-nums">
                {formatOdometer(vehicle.currentOdometer)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{jobCount} Total Visits</span>
              {lastJob && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Last Visit: {formatDate(lastJob.date)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
          {canManageJobs && (
            <button
              onClick={onOpenJob}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Open Job Card</span>
            </button>
          )}

          {canManageVehicles && (
            <>
              <button
                onClick={onEditSpec}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Spec</span>
              </button>
              <button
                onClick={onArchiveToggle}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100"
                title={vehicle.status === 'Archived' ? 'Restore Vehicle' : 'Archive Vehicle'}
              >
                <Archive className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pending Recommendations Alert strip */}
      {pendingRecs.length > 0 && (
        <div className="mt-5 p-3.5 bg-amber-50 border border-amber-200/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-start gap-2.5 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                {pendingRecs.length} Outstanding Recommendation
                {pendingRecs.length > 1 ? 's' : ''} on record:
              </span>
              <p className="text-amber-800 mt-0.5">{pendingRecs[0].recommendation}</p>
            </div>
          </div>
          <button
            onClick={onViewRecommendations}
            className="self-start sm:self-auto px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-200/70 hover:bg-amber-200 rounded shrink-0 transition-colors"
          >
            Review Advice
          </button>
        </div>
      )}
    </div>
  );
};
