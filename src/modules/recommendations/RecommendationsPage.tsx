import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tag,
  Search,
  Filter,
  Car,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  XCircle,
} from 'lucide-react';
import { recommendationRepository } from '../../services/recommendationRepository';
import { vehicleRepository } from '../../services/vehicleRepository';
import { customerRepository } from '../../services/customerRepository';
import { Recommendation, RecommendationStatus, RecommendationPriority } from '../../types/recommendation';
import { Vehicle } from '../../types/vehicle';
import { Customer } from '../../types/customer';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatOdometer } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { can, currentUser } = useAuth();
  const { notify } = useNotification();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Pending' | 'Completed' | 'All'>('Pending');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [rList, vList, cList] = await Promise.all([
      recommendationRepository.getAll(),
      vehicleRepository.getAll(),
      customerRepository.getAll(),
    ]);
    setRecommendations(rList);
    setVehicles(vList);
    setCustomers(cList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (recId: string, newStatus: RecommendationStatus) => {
    try {
      await recommendationRepository.update(recId, { status: newStatus }, currentUser.name);
      notify(`Recommendation marked as ${newStatus}`);
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const filteredRecs = recommendations.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/[^a-z0-9]/g, '');

    const veh = vehicles.find((v) => v.id === r.vehicleId);
    const cust = veh ? customers.find((c) => c.id === veh.customerId) : undefined;

    const textMatch = r.recommendation.toLowerCase().includes(q);
    const regMatch = veh
      ? veh.registrationNumber.toLowerCase().includes(q) ||
        veh.registrationNumber.replace(/[^a-z0-9]/g, '').toLowerCase().includes(cleanQ)
      : false;
    const custMatch = cust ? cust.name.toLowerCase().includes(q) || cust.mobile.includes(cleanQ) : false;

    const matchesQuery = !q || textMatch || regMatch || custMatch;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || r.priority === priorityFilter;

    return matchesQuery && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Recommendations & Follow-ups"
        subtitle="Outstanding maintenance advice prescribed during previous workshop visits requiring attention upon return"
        badge={
          <span className="text-xs font-mono font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
            {recommendations.filter((r) => r.status === 'Pending').length} Pending Follow-ups
          </span>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by recommendation note, vehicle registration, or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'Pending'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('Completed')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'Completed'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'All'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      {filteredRecs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-neutral-300">
          <Tag className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-neutral-800">No recommendations match filter</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or filter options.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          <div className="divide-y divide-neutral-100">
            {filteredRecs.map((rec) => {
              const veh = vehicles.find((v) => v.id === rec.vehicleId);
              const cust = veh ? customers.find((c) => c.id === veh.customerId) : undefined;

              return (
                <div key={rec.id} className="p-4 sm:p-5 hover:bg-neutral-50/70 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-neutral-900 text-sm">
                          {rec.recommendation}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            rec.priority === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : rec.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {rec.priority} Priority
                        </span>
                        <StatusBadge status={rec.status} size="sm" />
                      </div>

                      {/* Vehicle & Customer tags */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                        {veh && (
                          <button
                            onClick={() => navigate(`/vehicles/${veh.id}`)}
                            className="font-mono font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded border border-neutral-200 inline-flex items-center gap-1"
                          >
                            <span>{veh.registrationNumber}</span>
                            <ExternalLink className="w-3 h-3 text-neutral-400" />
                          </button>
                        )}
                        <span>{veh ? `${veh.make} ${veh.model}` : ''}</span>
                        {cust && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>
                              Owner: <strong>{cust.name}</strong> ({cust.mobile})
                            </span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>Logged in Job: {rec.jobId}</span>
                      </div>
                    </div>

                    {/* Due details & actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0">
                      <div className="text-left sm:text-right">
                        {rec.recommendedNextKm ? (
                          <div className="font-mono tabular-nums text-xs font-bold text-neutral-900">
                            Due @ {formatOdometer(rec.recommendedNextKm)}
                          </div>
                        ) : (
                          <div className="text-xs text-neutral-400">Next Service Due</div>
                        )}
                        <div className="text-[11px] text-neutral-400">{formatDate(rec.recommendedDate)}</div>
                      </div>

                      {can('manage_recommendations') && rec.status === 'Pending' && (
                        <div className="flex items-center gap-1.5 pl-3 border-l border-neutral-200">
                          <button
                            onClick={() => handleStatusChange(rec.id, 'Completed')}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                          >
                            Mark Done
                          </button>
                          <button
                            onClick={() => handleStatusChange(rec.id, 'Declined')}
                            className="px-2 py-1 text-xs text-neutral-400 hover:text-rose-600 rounded transition-colors"
                            title="Mark Declined"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {rec.resolutionNotes && (
                    <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900">
                      <strong>Resolution Notes:</strong> {rec.resolutionNotes}
                      {rec.resolvedInJobId && ` (Handled in Job: ${rec.resolvedInJobId})`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
