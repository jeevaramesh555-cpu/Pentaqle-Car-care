import React from 'react';
import { Package, Plus, Pencil } from 'lucide-react';
import { PartUsage } from '../../../types/part';

interface PartsSectionProps {
  parts: PartUsage[];
  canManage: boolean;
  onAddClick: () => void;
  onEditClick?: (part: PartUsage) => void;
}

export const PartsSection: React.FC<PartsSectionProps> = ({
  parts,
  canManage,
  onAddClick,
  onEditClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-600 shrink-0" />
          <h2 className="text-sm font-bold text-neutral-900">
            4. Parts & Replacements ({parts.length})
          </h2>
        </div>
        {canManage && (
          <button
            onClick={onAddClick}
            className="px-2.5 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Part</span>
          </button>
        )}
      </div>

      {parts.length === 0 ? (
        <p className="text-xs text-neutral-400 italic py-2">No replacement parts used in this visit.</p>
      ) : (
        <div className="space-y-2">
          {parts.map((p) => (
            <div
              key={p.id}
              className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 hover:border-neutral-300 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-neutral-900 leading-snug">
                  {p.quantity}x {p.partName}
                </div>
                <div className="text-neutral-500 text-[11px] mt-0.5">
                  Brand: <strong className="text-neutral-700">{p.brand}</strong>{' '}
                  {p.partNumber && `(${p.partNumber})`} · Action: {p.action}
                </div>
                {p.warrantyNotes && (
                  <div className="text-neutral-500 text-[11px]">Warranty: {p.warrantyNotes}</div>
                )}
                {p.notes && (
                  <div className="text-neutral-600 text-[11px] mt-0.5 italic">Note: {p.notes}</div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-200/60 w-full sm:w-auto justify-between sm:justify-end">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-200 text-neutral-800">
                  {p.action}
                </span>
                {canManage && onEditClick && (
                  <button
                    type="button"
                    onClick={() => onEditClick(p)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 rounded transition-colors shadow-2xs"
                    title="Edit Part Record"
                  >
                    <Pencil className="w-3 h-3 text-neutral-500" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
