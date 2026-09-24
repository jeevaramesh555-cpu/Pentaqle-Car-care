import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ArrowRight,
  Plus,
  Wrench,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { jobRepository } from '../../services/jobRepository';
import { vehicleRepository } from '../../services/vehicleRepository';
import { customerRepository } from '../../services/customerRepository';
import { recommendationRepository } from '../../services/recommendationRepository';
import { JobCard } from '../../types/jobCard';
import { Vehicle } from '../../types/vehicle';
import { Customer } from '../../types/customer';
import { Recommendation } from '../../types/recommendation';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatOdometer } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { can } = useAuth();
  const { settings } = useSettings();

  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pendingRecs, setPendingRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [j, v, c, recs] = await Promise.all([
      jobRepository.getAll(),
      vehicleRepository.getAll(),
      customerRepository.getAll(),
      recommendationRepository.getAll(),
    ]);

    setJobs(j);
    setVehicles(v);
    setCustomers(c);
    setPendingRecs(recs.filter((r) => r.status === 'Pending'));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleJobCreated = () => loadData();
    window.addEventListener('workshop_job_created', handleJobCreated);
    return () => window.removeEventListener('workshop_job_created', handleJobCreated);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs text-neutral-400 font-mono animate-pulse">Loading workshop floor metrics...</div>
      </div>
    );
  }

  // Calculate operational stats
  const openJobs = jobs.filter((j) => ['Open', 'Inspection', 'Waiting Approval', 'Waiting Parts'].includes(j.status));
  const inProgressJobs = jobs.filter((j) => j.status === 'In Progress');
  const readyJobs = jobs.filter((j) => j.status === 'Ready');
  const completedJobs = jobs.filter((j) => ['Delivered', 'Closed'].includes(j.status));

  // Today's vehicles (jobs updated or created today)
  const todayStr = '2026-09-24'; // simulated current date
  const todaysJobs = jobs.filter((j) => j.date === todayStr);

  return (
    <div className="space-y-6">
      {/* Primary KPI Grid (Operational - strictly non-billing) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">In Workshop Today</span>
            <Car className="w-4 h-4 text-neutral-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-neutral-900">
            {todaysJobs.length}
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">Active on floor</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Open / Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-neutral-900">
            {openJobs.length}
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Awaiting action</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">In Progress</span>
            <Wrench className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-neutral-900">
            {inProgressJobs.length}
          </div>
          <span className="text-[11px] text-sky-600 font-medium mt-1 block">On hoist / bay</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Ready for Delivery</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-neutral-900">
            {readyJobs.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Quality passed</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Pending Recs</span>
            <AlertCircle className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-neutral-900">
            {pendingRecs.length}
          </div>
          <span className="text-[11px] text-orange-600 font-medium mt-1 block">Follow-ups due</span>
        </div>
      </div>

      {/* Main 2-Column Split: Active Job Cards & Lifetime History Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Active Floor Job Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Job Cards Table */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-neutral-700" />
                <h2 className="text-sm font-bold text-neutral-900">Active Workshop Visits & Job Cards</h2>
              </div>
              <button
                onClick={() => navigate('/jobs')}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1 group"
              >
                <span>View all ({jobs.length})</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="divide-y divide-neutral-100">
              {jobs.slice(0, 5).map((job) => {
                const vehicle = vehicles.find((v) => v.id === job.vehicleId);
                const customer = customers.find((c) => c.id === job.customerId);
                return (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="p-4 hover:bg-neutral-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors flex items-center justify-center font-bold text-neutral-800 shrink-0">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-neutral-900 tracking-wider">
                            {vehicle?.registrationNumber || 'N/A'}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {vehicle ? `${vehicle.make} ${vehicle.model}` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                          <span>Owner: <strong className="text-neutral-700 font-medium">{customer?.name}</strong></span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{formatOdometer(job.odometer)}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[11px] text-neutral-400">{job.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                      <div className="text-left sm:text-right">
                        <StatusBadge status={job.status} size="sm" />
                        <div className="text-[11px] text-neutral-400 mt-1">
                          Advisor: {job.serviceAdvisor}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Follow-Up Recommendations Banner (Core Value Proposition) */}
          <div className="p-5 bg-white rounded-xl border border-neutral-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Critical Vehicle Recommendations Due
                </h3>
              </div>
              <button
                onClick={() => navigate('/recommendations')}
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                View all ({pendingRecs.length})
              </button>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Recommendations recorded during previous visits requiring follow-up upon vehicle return.
            </p>

            <div className="space-y-2.5">
              {pendingRecs.slice(0, 3).map((rec) => {
                const vehicle = vehicles.find((v) => v.id === rec.vehicleId);
                const customer = vehicle ? customers.find((c) => c.id === vehicle.customerId) : undefined;
                return (
                  <div
                    key={rec.id}
                    onClick={() => vehicle && navigate(`/vehicles/${vehicle.id}`)}
                    className="p-3 bg-neutral-50 hover:bg-neutral-100/80 rounded-lg border border-neutral-200/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                          {vehicle?.registrationNumber}
                        </span>
                        <span className="font-medium text-neutral-700">{customer?.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                            rec.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {rec.priority} Priority
                        </span>
                      </div>
                      <p className="text-neutral-600 leading-relaxed">{rec.recommendation}</p>
                    </div>
                    <div className="text-left sm:text-right shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-200/60">
                      {rec.recommendedNextKm && (
                        <div className="font-mono tabular-nums text-neutral-600 font-semibold">
                          Due @ {formatOdometer(rec.recommendedNextKm)}
                        </div>
                      )}
                      <span className="text-[10px] text-neutral-400 block sm:mt-0.5">
                        {formatDate(rec.recommendedDate)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Lifetime History Showcase & Audit Feed */}
        <div className="space-y-6">
          {/* Spotlight Vehicle: Lifetime Digital Service History Demo */}
          <div className="p-5 bg-neutral-900 text-white rounded-xl shadow-md border border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Lifetime History Highlight
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">4 Recorded Visits</span>
            </div>
            <div className="font-mono font-bold text-xl text-white tracking-wider mb-1">
              KA-01-MJ-4821
            </div>
            <div className="text-sm font-medium text-neutral-300">
              Toyota Innova Crysta 2.4 ZX
            </div>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Showcases complete chronological lifecycle from 62,100 km to 91,220 km, including repeat brake complaints, Bosch to Brembo replacement history, and pending battery advice.
            </p>

            <button
              onClick={() => navigate('/vehicles/VEH-000001')}
              className="mt-4 w-full py-2 px-3 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect Lifetime History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recently Serviced Vehicles */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Workshop Fleet Roster
              </h3>
              <button
                onClick={() => navigate('/vehicles')}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                All ({vehicles.length})
              </button>
            </div>
            <div className="space-y-2">
              {vehicles.slice(0, 4).map((veh) => {
                const owner = customers.find((c) => c.id === veh.customerId);
                return (
                  <div
                    key={veh.id}
                    onClick={() => navigate(`/vehicles/${veh.id}`)}
                    className="p-2.5 rounded-lg border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50 transition-all cursor-pointer flex items-center justify-between text-xs group"
                  >
                    <div>
                      <div className="font-mono font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                        {veh.registrationNumber}
                      </div>
                      <div className="text-neutral-500">
                        {veh.make} {veh.model} · {owner?.name}
                      </div>
                    </div>
                    <div className="text-right font-mono tabular-nums text-neutral-500">
                      {formatOdometer(veh.currentOdometer)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
