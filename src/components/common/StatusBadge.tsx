import React from 'react';
import { JobCardStatus } from '../../types/jobCard';
import { CustomerStatus } from '../../types/customer';
import { VehicleStatus } from '../../types/vehicle';
import { InspectionSeverity } from '../../types/inspection';
import { RecommendationStatus } from '../../types/recommendation';

interface StatusBadgeProps {
  status:
    | JobCardStatus
    | CustomerStatus
    | VehicleStatus
    | InspectionSeverity
    | RecommendationStatus
    | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status;

  // Determine styles strictly conforming to high-contrast automotive SaaS aesthetics
  let colorStyle = 'bg-neutral-100 text-neutral-700 border-neutral-200';
  let dotColor = 'bg-neutral-500';

  if (s === 'Open' || s === 'Pending' || s === 'Attention') {
    colorStyle = 'bg-amber-50 text-amber-800 border-amber-200/80';
    dotColor = 'bg-amber-500';
  } else if (s === 'In Progress' || s === 'Inspection') {
    colorStyle = 'bg-sky-50 text-sky-800 border-sky-200/80';
    dotColor = 'bg-sky-500';
  } else if (s === 'Waiting Approval' || s === 'Waiting Parts') {
    colorStyle = 'bg-orange-50 text-orange-800 border-orange-200/80';
    dotColor = 'bg-orange-500';
  } else if (s === 'Ready' || s === 'Completed' || s === 'Active' || s === 'Good' || s === 'Approved') {
    colorStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    dotColor = 'bg-emerald-600';
  } else if (s === 'Delivered' || s === 'Closed') {
    colorStyle = 'bg-neutral-100 text-neutral-800 border-neutral-300';
    dotColor = 'bg-neutral-600';
  } else if (s === 'Urgent' || s === 'Declined' || s === 'Inactive') {
    colorStyle = 'bg-rose-50 text-rose-800 border-rose-200/80';
    dotColor = 'bg-rose-600';
  } else if (s === 'Archived' || s === 'No Longer Required') {
    colorStyle = 'bg-neutral-100 text-neutral-500 border-neutral-200';
    dotColor = 'bg-neutral-400';
  }

  const pxPy = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border tracking-tight ${pxPy} ${colorStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};
