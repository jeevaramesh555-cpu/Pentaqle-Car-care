import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  Plus,
  Car,
  Clock,
  User,
  Gauge,
  ChevronRight,
  Filter,
  FileDown,
  Loader2,
} from 'lucide-react';
import { jobRepository } from '../../services/jobRepository';
import { vehicleRepository } from '../../services/vehicleRepository';
import { customerRepository } from '../../services/customerRepository';
import { JobCard, JobCardStatus } from '../../types/jobCard';
import { Vehicle } from '../../types/vehicle';
import { Customer } from '../../types/customer';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatOdometer } from '../../utils/formatters';
import { JobCardCreateModal } from './JobCardCreateModal';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useNotification } from '../../context/NotificationContext';
import { downloadJobCardPdf } from '../../utils/jobCardPdfGenerator';

export const JobCardListPage: React.FC = () => {
  const navigate = useNavigate();
  const { can } = useAuth();
  const { settings } = useSettings();
  const { notify } = useNotification();

  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloadingJobId, setDownloadingJobId] = useState<string | null>(null);

  const handleQuickDownloadPdf = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    try {
      setDownloadingJobId(jobId);
      const details = await jobRepository.getFullJobDetails(jobId);
      if (details) {
        downloadJobCardPdf(details, settings);
        notify(`Downloaded Job Card ${jobId} as PDF`, 'success');
      } else {
        notify('Job card details not found', 'error');
      }
    } catch (err: unknown) {
      console.error('Failed to download PDF:', err);
      const msg = err instanceof Error ? err.message : 'Failed to download PDF';
      notify(msg, 'error');
    } finally {
      setDownloadingJobId(null);
    }
  };

  const loadData = async () => {
    const [jList, vList, cList] = await Promise.all([
      jobRepository.getAll(),
      vehicleRepository.getAll(),
      customerRepository.getAll(),
    ]);
    setJobs(jList);
    setVehicles(vList);
    setCustomers(cList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleJobCreated = () => loadData();
    window.addEventListener('workshop_job_created', handleJobCreated);
    return () => window.removeEventListener('workshop_job_created', handleJobCreated);
  }, []);

  const statuses: Array<JobCardStatus | 'All'> = [
    'All',
    'Open',
    'Inspection',
    'Waiting Approval',
    'In Progress',
    'Waiting Parts',
    'Ready',
    'Delivered',
    'Closed',
  ];

  const filteredJobs = jobs.filter((j) => {
    const q = searchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/[^a-z0-9]/g, '');

    const idMatch = j.id.toLowerCase().includes(q);
    const advisorMatch = j.serviceAdvisor.toLowerCase().includes(q);
    const techMatch = j.assignedTechnician ? j.assignedTechnician.toLowerCase().includes(q) : false;

    const veh = vehicles.find((v) => v.id === j.vehicleId);
    const regMatch = veh
      ? veh.registrationNumber.toLowerCase().includes(q) ||
        veh.registrationNumber.replace(/[^a-z0-9]/g, '').toLowerCase().includes(cleanQ)
      : false;

    const cust = customers.find((c) => c.id === j.customerId);
    const custMatch = cust
      ? cust.name.toLowerCase().includes(q) || cust.mobile.includes(cleanQ)
      : false;

    const matchesQuery = !q || idMatch || advisorMatch || techMatch || regMatch || custMatch;
    const matchesStatus = statusFilter === 'All' || j.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Cards & Workshop Visits"
        subtitle="Intake, diagnostics, technician assignments, and service lifecycle tracking"
        badge={
          <span className="text-xs font-mono font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
            {jobs.length} Total Visits
          </span>
        }
        actions={
          can('manage_jobs') && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Open Job Card</span>
            </button>
          )
        }
      />

      {/* Filter and Status Bar */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Job Card ID (e.g. JOB-000101), registration, owner, or technician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Status Scrollable Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {statuses.map((status) => {
            const count = status === 'All' ? jobs.length : jobs.filter((j) => j.status === status).length;
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-neutral-900 text-white font-semibold shadow-2xs'
                    : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Card List */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-neutral-300">
          <ClipboardList className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-neutral-800">No Job Cards found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Try choosing a different status filter or clear your search input.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm divide-y divide-neutral-200">
              <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Job Card ID</th>
                  <th className="px-6 py-3.5">Vehicle</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5 font-mono text-right">Odometer</th>
                  <th className="px-6 py-3.5">Intake Date</th>
                  <th className="px-6 py-3.5">Technician</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredJobs.map((job) => {
                  const veh = vehicles.find((v) => v.id === job.vehicleId);
                  const cust = customers.find((c) => c.id === job.customerId);

                  return (
                    <tr
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                          {job.id}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-900">
                            {veh?.registrationNumber || 'N/A'}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {veh ? `${veh.make} ${veh.model}` : ''}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">{cust?.name || 'Unknown'}</div>
                        <div className="text-xs text-neutral-400 font-mono">{cust?.mobile}</div>
                      </td>

                      <td className="px-6 py-4 text-right font-mono tabular-nums text-neutral-900 font-medium">
                        {formatOdometer(job.odometer)}
                      </td>

                      <td className="px-6 py-4 text-neutral-600 text-xs">
                        {formatDate(job.date)}
                      </td>

                      <td className="px-6 py-4 text-xs text-neutral-700">
                        {job.assignedTechnician || 'Unassigned'}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={job.status} size="sm" />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleQuickDownloadPdf(e, job.id)}
                            disabled={downloadingJobId === job.id}
                            title="Download Job Card as PDF"
                            className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-md transition-colors"
                          >
                            {downloadingJobId === job.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-700" />
                            ) : (
                              <FileDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="text-xs font-semibold text-neutral-900 group-hover:underline flex items-center gap-0.5">
                            Open Card
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-neutral-100">
            {filteredJobs.map((job) => {
              const veh = vehicles.find((v) => v.id === job.vehicleId);
              const cust = customers.find((c) => c.id === job.customerId);

              return (
                <div
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="font-mono font-bold text-sm text-neutral-900 truncate">
                        {job.id} · {veh?.registrationNumber}
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5 truncate">
                        {cust?.name} · {veh ? `${veh.make} ${veh.model}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleQuickDownloadPdf(e, job.id)}
                        disabled={downloadingJobId === job.id}
                        title="Download PDF"
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md"
                      >
                        {downloadingJobId === job.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <FileDown className="w-4 h-4" />
                        )}
                      </button>
                      <StatusBadge status={job.status} size="sm" />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{formatOdometer(job.odometer)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDate(job.date)}</span>
                    </div>
                    <span className="font-semibold text-neutral-900 flex items-center gap-0.5 ml-auto">
                      Open <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Job Card Modal */}
      <JobCardCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => loadData()}
      />
    </div>
  );
};
