import React from 'react';
import { Tag, Plus } from 'lucide-react';
import { Recommendation } from '../../../types/recommendation';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatOdometer } from '../../../utils/formatters';

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
  canManage: boolean;
  onAddClick: () => void;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendations,
  canManage,
  onAddClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-purple-600 shrink-0" />
          <h2 className="text-sm font-bold text-neutral-900">
            5. Advisor Recommendations for Next Visit ({recommendations.length})
          </h2>
        </div>
        {canManage && (
          <button
            onClick={onAddClick}
            className="px-2.5 py-1 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Recommendation</span>
          </button>
        )}
      </div>

      {recommendations.length === 0 ? (
        <p className="text-xs text-neutral-400 italic py-2">
          No future recommendations recorded for this visit.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((r) => (
            <div
              key={r.id}
              className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <span className="font-semibold text-amber-950">{r.recommendation}</span>
                <div className="shrink-0 self-start sm:self-auto">
                  <StatusBadge status={r.status} size="sm" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-amber-800 text-[11px]">
                <span>Priority: {r.priority}</span>
                {r.recommendedNextKm && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono font-bold">
                      Due @ {formatOdometer(r.recommendedNextKm)}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
