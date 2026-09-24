import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { VehicleJobCardSummary } from '../../../services/vehicleRepository';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatDate, formatOdometer } from '../../../utils/formatters';

interface VehicleHistoryTimelineProps {
  jobCards: VehicleJobCardSummary[];
  onOpenFirstJob: () => void;
}

export const VehicleHistoryTimeline: React.FC<VehicleHistoryTimelineProps> = ({
  jobCards,
  onOpenFirstJob,
}) => {
  const navigate = useNavigate();

  if (jobCards.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-dashed border-neutral-300">
        <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-neutral-800">No Workshop Visits Recorded</h3>
        <p className="text-xs text-neutral-500 mt-1 mb-4">
          Open a job card to begin building the lifetime service history for this vehicle.
        </p>
        <button
          onClick={onOpenFirstJob}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-md"
        >
          Open First Job Card
        </button>
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200">
      {jobCards.map((item) => {
        const { job, complaints, services, parts, recommendations } = item;
        return (
          <div key={job.id} className="relative group">
            {/* Timeline Node Dot */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-neutral-900" />
            </div>

            {/* Timeline Visit Card */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
              {/* Visit Header */}
              <div className="p-4 sm:p-5 bg-neutral-50/70 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="font-mono font-bold text-sm text-neutral-900 hover:underline flex items-center gap-1"
                    >
                      <span>{job.id}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    </button>
                    <StatusBadge status={job.status} size="sm" />
                    <span className="font-mono font-bold text-sm bg-neutral-200/80 px-2 py-0.5 rounded text-neutral-800">
                      {formatOdometer(job.odometer)}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                    <span>
                      Visit Date: <strong>{formatDate(job.date)}</strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Advisor: {job.serviceAdvisor}</span>
                    <span aria-hidden="true">·</span>
                    <span>Technician: {job.assignedTechnician}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors shadow-2xs shrink-0 self-start sm:self-center"
                >
                  View Full Job Card
                </button>
              </div>

              {/* Visit Details: Complaints, Services Performed, Parts Replaced */}
              <div className="p-4 sm:p-5 space-y-4 text-xs">
                {/* Complaints */}
                {complaints.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Reported Complaints & Symptoms
                    </span>
                    <div className="space-y-1.5">
                      {complaints.map((c) => (
                        <div
                          key={c.id}
                          className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 flex items-start gap-2"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-neutral-900">{c.complaint}</span>
                              {c.relatedPreviousJobId && (
                                <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-rose-100 text-rose-700 rounded">
                                  Repeat Issue (Ref: {c.relatedPreviousJobId})
                                </span>
                              )}
                            </div>
                            {c.technicianNotes && (
                              <p className="text-neutral-500 text-[11px] mt-0.5">
                                Diagnosis: {c.technicianNotes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services Performed */}
                {services.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Services & Operations Executed
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {services.map((s) => (
                        <div
                          key={s.id}
                          className="p-2.5 rounded-lg border border-neutral-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <div>
                              <div className="font-semibold text-neutral-800">{s.serviceName}</div>
                              <div className="text-[11px] text-neutral-400">
                                {s.category} · Tech: {s.technician}
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={s.status} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Parts Installed / Replaced */}
                {parts.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Parts Replaced / Installed
                    </span>
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-neutral-400 text-[10px] uppercase font-semibold border-b border-neutral-200">
                            <th className="pb-1">Part Description</th>
                            <th className="pb-1">Brand</th>
                            <th className="pb-1">Action</th>
                            <th className="pb-1 text-right">Warranty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {parts.map((p) => (
                            <tr key={p.id}>
                              <td className="py-1.5 font-medium text-neutral-800">
                                {p.partName}{' '}
                                {p.partNumber && (
                                  <span className="font-mono text-neutral-400">({p.partNumber})</span>
                                )}
                              </td>
                              <td className="py-1.5 text-neutral-600">{p.brand}</td>
                              <td className="py-1.5">
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-200 text-neutral-700">
                                  {p.action}
                                </span>
                              </td>
                              <td className="py-1.5 text-right font-medium text-neutral-700">
                                {p.warrantyNotes || 'Standard'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Recommendations Generated */}
                {recommendations.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Recommendations Recorded for Next Visit
                    </span>
                    <div className="space-y-1">
                      {recommendations.map((r) => (
                        <div
                          key={r.id}
                          className="p-2 bg-amber-50/60 rounded border border-amber-200/60 text-amber-900 flex items-center justify-between"
                        >
                          <span>{r.recommendation}</span>
                          <span className="font-mono tabular-nums text-[11px]">
                            {r.recommendedNextKm
                              ? `Due @ ${formatOdometer(r.recommendedNextKm)}`
                              : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
