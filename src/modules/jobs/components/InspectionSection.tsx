import React from 'react';
import { FileCheck, Plus } from 'lucide-react';
import { InspectionFinding } from '../../../types/inspection';
import { StatusBadge } from '../../../components/common/StatusBadge';

interface InspectionSectionProps {
  inspections: InspectionFinding[];
  canManage: boolean;
  onAddClick: () => void;
}

export const InspectionSection: React.FC<InspectionSectionProps> = ({
  inspections,
  canManage,
  onAddClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <h2 className="text-sm font-bold text-neutral-900">
            2. Inspection & Diagnosis ({inspections.length})
          </h2>
        </div>
        {canManage && (
          <button
            onClick={onAddClick}
            className="px-2.5 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Finding</span>
          </button>
        )}
      </div>

      {inspections.length === 0 ? (
        <p className="text-xs text-neutral-400 italic py-2">No inspection findings logged yet.</p>
      ) : (
        <div className="space-y-2">
          {inspections.map((i) => (
            <div
              key={i.id}
              className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-neutral-900">{i.finding}</span>
                  <StatusBadge status={i.severity} size="sm" />
                </div>
                <div className="text-neutral-500 text-[11px] mt-1">
                  Category: {i.category} · Tech: {i.technician}
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-200/60">
                <span className="text-[10px] text-neutral-400 uppercase inline sm:block mr-1.5 sm:mr-0">Approval:</span>
                <span className="font-semibold text-neutral-800">{i.approvalStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
