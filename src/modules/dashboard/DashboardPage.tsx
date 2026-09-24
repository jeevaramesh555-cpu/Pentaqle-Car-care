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
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { jobRepository } from '../../services/jobRepository';
import { vehicleRepository } from '../../services/vehicleRepository';
import { customerRepository } from '../../services/customerRepository';
import { JobCard } from '../../types/jobCard';
import { Vehicle } from '../../types/vehicle';
import { Customer } from '../../types/customer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatOdometer, formatIndianRegNumber } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { can } = useAuth();
  const { settings } = useSettings();

  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [j, v, c] = await Promise.all([
      jobRepository.getAll(),
      vehicleRepository.getAll(),
      customerRepository.getAll(),
    ]);

    setJobs(j);
    setVehicles(v);
    setCustomers(c);
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
  const readyJobs = jobs.filter((j) => j.status === 'Ready');
  const completedJobs = jobs.filter((j) => ['Delivered', 'Closed'].includes(j.status));

  // Today's vehicles (jobs updated or created today)
  const todayStr = '2026-09-24'; // simulated current date
  const todaysJobs = jobs.filter((j) => j.date === todayStr);

  return (
    <div className="space-y-6">
      {/* Primary KPI Grid (Operational - strictly non-billing) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
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
            <span className="text-xs font-medium">Ready for Delivery</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-neutral-900">
            {readyJobs.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Quality passed</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Completed / Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-neutral-900">
            {completedJobs.length}
          </div>
          <span className="text-[11px] text-neutral-500 font-medium mt-1 block">Successfully closed</span>
        </div>
      </div>

      {/* Main 2-Column Split: Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Active Floor Job Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Job Cards Table */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-neutral-700" />
                <h2 className="text-sm font-bold text-neutral-900">Active Jobs</h2>
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
                            {vehicle?.registrationNumber ? formatIndianRegNumber(vehicle.registrationNumber) : 'N/A'}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {vehicle ? `${vehicle.make} ${vehicle.model}` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                          <span className="text-neutral-700 font-medium">{customer?.name}</span>
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
        </div>

        {/* Right Column (1/3): Fleet Roster & Service History */}
        <div className="space-y-6">
          {/* Quick Access to Dedicated Lifetime Service History Page */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Service History Archive</h4>
                <p className="text-[11px] text-neutral-500">Explore complete lifetime timelines</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1 group py-1.5 px-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
