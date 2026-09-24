import React from 'react';
import { AlertCircle, Plus, Pencil } from 'lucide-react';
import { Complaint } from '../../../types/complaint';
import { StatusBadge } from '../../../components/common/StatusBadge';

interface ComplaintsSectionProps {
  complaints: Complaint[];
  canManage: boolean;
  onAddClick: () => void;
  onEditClick?: (complaint: Complaint) => void;
}

export const ComplaintsSection: React.FC<ComplaintsSectionProps> = ({
  complaints,
  canManage,
  onAddClick,
  onEditClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <h2 className="text-sm font-bold text-neutral-900">
            1. Customer Complaints ({complaints.length})
          </h2>
        </div>
        {canManage && (
          <button
            onClick={onAddClick}
            className="px-2.5 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Complaint</span>
          </button>
        )}
      </div>

      {complaints.length === 0 ? (
        <p className="text-xs text-neutral-400 italic py-2">No complaints recorded on intake.</p>
      ) : (
        <div className="space-y-2.5">
          {complaints.map((c) => (
            <div key={c.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-2 hover:border-neutral-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="font-semibold text-neutral-900 text-sm leading-snug">{c.complaint}</div>
                <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                  <StatusBadge status={c.status} size="sm" />
                  {canManage && onEditClick && (
                    <button
                      type="button"
                      onClick={() => onEditClick(c)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 rounded transition-colors shadow-2xs"
                      title="Edit Complaint"
                    >
                      <Pencil className="w-3 h-3 text-neutral-500" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-neutral-500 text-[11px]">
                <span className="font-medium text-neutral-700">{c.category}</span>
                <span aria-hidden="true">·</span>
                <span>Priority: {c.priority}</span>
                {c.relatedPreviousJobId && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 font-bold rounded">
                      Repeat Issue (Ref: {c.relatedPreviousJobId})
                    </span>
                  </>
                )}
              </div>
              {c.technicianNotes && (
                <div className="p-2 bg-white rounded border border-neutral-200 text-neutral-700 text-[11px] mt-1">
                  <span className="font-semibold text-neutral-900">Diagnosis: </span>
                  {c.technicianNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
