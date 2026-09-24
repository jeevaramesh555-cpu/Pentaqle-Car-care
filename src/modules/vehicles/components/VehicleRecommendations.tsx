import React from 'react';
import { Recommendation } from '../../../types/recommendation';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatOdometer, formatDate } from '../../../utils/formatters';

interface VehicleRecommendationsProps {
  recommendations: Recommendation[];
}

export const VehicleRecommendations: React.FC<VehicleRecommendationsProps> = ({
  recommendations,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-neutral-200">
        <h3 className="text-sm font-bold text-neutral-900">
          Future Service Advice & Recommendations
        </h3>
        <p className="text-xs text-neutral-500">
          Prescriptions recorded by technicians for future maintenance milestones
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="p-12 text-center text-xs text-neutral-400">
          No recommendations recorded for this vehicle.
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {recommendations.map((r) => (
            <div
              key={r.id}
              className="p-4 sm:p-5 hover:bg-neutral-50/70 transition-colors text-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900 text-sm">
                      {r.recommendation}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                        r.priority === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {r.priority} Priority
                    </span>
                  </div>
                  <div className="text-neutral-500 mt-1 flex items-center gap-2">
                    <span>Prescribed on: {formatDate(r.recommendedDate)}</span>
                    {r.recommendedNextKm && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-neutral-800 font-medium">
                          Target: {formatOdometer(r.recommendedNextKm)}
                        </span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>Job: {r.jobId}</span>
                  </div>
                </div>
                <StatusBadge status={r.status} size="sm" />
              </div>

              {r.resolutionNotes && (
                <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                  <strong className="font-semibold">Resolution: </strong>
                  {r.resolutionNotes} (Resolved in Job {r.resolvedInJobId})
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
