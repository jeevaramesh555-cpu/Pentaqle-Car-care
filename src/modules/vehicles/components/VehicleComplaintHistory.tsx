import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Complaint } from '../../../types/complaint';
import { StatusBadge } from '../../../components/common/StatusBadge';

interface VehicleComplaintHistoryProps {
  complaints: Complaint[];
}

export const VehicleComplaintHistory: React.FC<VehicleComplaintHistoryProps> = ({ complaints }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-neutral-200">
        <h3 className="text-sm font-bold text-neutral-900">
          Customer Complaint & Symptom History
        </h3>
        <p className="text-xs text-neutral-500">
          Every complaint logged across visits with repeat problem tracking
        </p>
      </div>

      {complaints.length === 0 ? (
        <div className="p-12 text-center">
          <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <p className="text-xs text-neutral-500">No complaints logged for this vehicle.</p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="p-4 sm:p-5 hover:bg-neutral-50/70 transition-colors text-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900 text-sm">{c.complaint}</span>
                      {c.relatedPreviousJobId && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded border border-rose-200">
                          Repeat Issue (Ref: {c.relatedPreviousJobId})
                        </span>
                      )}
                    </div>
                    <div className="text-neutral-500 mt-1 flex items-center gap-2">
                      <span className="font-mono">{c.id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-neutral-700">{c.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Job Card: </span>
                      <button
                        onClick={() => navigate(`/jobs/${c.jobId}`)}
                        className="font-mono text-neutral-900 hover:underline"
                      >
                        {c.jobId}
                      </button>
                    </div>
                  </div>
                </div>
                <StatusBadge status={c.status} size="sm" />
              </div>

              {c.technicianNotes && (
                <div className="ml-6 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-neutral-700">
                  <span className="font-semibold text-neutral-900 block mb-0.5">
                    Technician Diagnosis:
                  </span>
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
