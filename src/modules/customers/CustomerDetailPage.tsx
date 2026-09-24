import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Car,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Plus,
  ArrowLeft,
  Edit,
  Archive,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { customerRepository } from '../../services/customerRepository';
import { vehicleRepository } from '../../services/vehicleRepository';
import { jobRepository } from '../../services/jobRepository';
import { Customer } from '../../types/customer';
import { Vehicle } from '../../types/vehicle';
import { JobCard } from '../../types/jobCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatOdometer } from '../../utils/formatters';
import { CustomerFormModal } from './CustomerFormModal';
import { VehicleFormModal } from '../vehicles/VehicleFormModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { notify } = useNotification();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    const [c, vList, jList] = await Promise.all([
      customerRepository.getById(id),
      vehicleRepository.getByCustomer(id),
      jobRepository.getByCustomer(id),
    ]);
    setCustomer(c || null);
    setVehicles(vList);
    setJobs(jList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs text-neutral-400 font-mono animate-pulse">Loading Customer Profile...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-neutral-200">
        <Users className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
        <h2 className="text-base font-bold text-neutral-800">Customer Not Found</h2>
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-md"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const handleArchiveToggle = async () => {
    if (customer.status === 'Archived') {
      await customerRepository.restore(customer.id);
      notify(`Customer ${customer.name} restored to Active`);
    } else {
      await customerRepository.archive(customer.id);
      notify(`Customer ${customer.name} archived`);
    }
    setIsArchiveModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/customers')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Customer Directory</span>
      </button>

      {/* Customer Header Info */}
      <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              {customer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{customer.name}</h1>
                <StatusBadge status={customer.status} />
                <span className="text-xs font-mono text-neutral-400">ID: {customer.id}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2 text-xs text-neutral-600">
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <strong>{customer.mobile}</strong>
                </span>
                {customer.alternateMobile && (
                  <span className="font-mono text-neutral-500">Alt: {customer.alternateMobile}</span>
                )}
                {customer.email && (
                  <span className="flex items-center gap-1.5 text-neutral-500">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    {customer.email}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  {customer.address ? `${customer.address}, ` : ''}{customer.city}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
            {can('manage_vehicles') && (
              <button
                onClick={() => setIsAddVehicleModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle</span>
              </button>
            )}

            {can('manage_customers') && (
              <>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setIsArchiveModalOpen(true)}
                  className="p-2 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100"
                  title="Archive customer"
                >
                  <Archive className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {customer.notes && (
          <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-700">
            <strong className="text-neutral-900 font-semibold block mb-0.5">Customer Notes:</strong>
            {customer.notes}
          </div>
        )}
      </div>

      {/* Vehicles Owned Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Car className="w-4 h-4 text-neutral-700" />
            Registered Vehicles ({vehicles.length})
          </h2>
          <span className="text-xs text-neutral-400">Click any vehicle to view full lifetime history</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((v) => {
            const vJobs = jobs.filter((j) => j.vehicleId === v.id);
            return (
              <div
                key={v.id}
                onClick={() => navigate(`/vehicles/${v.id}`)}
                className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-900/40 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-base tracking-wider text-neutral-900 group-hover:text-amber-600 transition-colors">
                        {v.registrationNumber}
                      </span>
                      <div className="text-sm font-semibold text-neutral-800 mt-0.5">
                        {v.make} {v.model} {v.variant && `· ${v.variant}`}
                      </div>
                    </div>
                    <StatusBadge status={v.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase block">Odometer</span>
                      <span className="font-mono tabular-nums font-semibold text-neutral-800">
                        {formatOdometer(v.currentOdometer)}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase block">Fuel / Trans</span>
                      <span className="font-medium text-neutral-800">
                        {v.fuelType} · {v.transmission}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100 text-xs text-neutral-500">
                  <span>{vJobs.length} Workshop Visits Logged</span>
                  <span className="font-semibold text-neutral-900 group-hover:underline flex items-center gap-1">
                    Open Profile <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Service History across All Vehicles */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-neutral-200">
          <h2 className="text-sm font-bold text-neutral-900">
            Complete Workshop Service History (Across All Vehicles)
          </h2>
          <p className="text-xs text-neutral-500">
            All historic job cards, intake notes, and maintenance visits for this customer
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">
            No workshop visits logged yet for this customer.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {jobs.map((job) => {
              const vehicle = vehicles.find((v) => v.id === job.vehicleId);
              return (
                <div
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="p-4 sm:p-5 hover:bg-neutral-50/70 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group text-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors flex items-center justify-center font-bold text-neutral-800 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-neutral-900 tracking-wider text-sm">
                          {vehicle?.registrationNumber || 'N/A'}
                        </span>
                        <StatusBadge status={job.status} size="sm" />
                        <span className="font-mono tabular-nums text-neutral-600 font-semibold">
                          {formatOdometer(job.odometer)}
                        </span>
                      </div>
                      <div className="text-neutral-500 mt-1 flex items-center gap-2">
                        <span>Job Card: <strong>{job.id}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Date: {formatDate(job.date)}</span>
                        <span aria-hidden="true">·</span>
                        <span>Advisor: {job.serviceAdvisor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="font-semibold text-neutral-900 group-hover:underline flex items-center gap-1">
                      View Job Card <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Customer Modal */}
      <CustomerFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingCustomer={customer}
        onSaved={() => loadData()}
      />

      {/* Add Vehicle for this Customer Modal */}
      <VehicleFormModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => setIsAddVehicleModalOpen(false)}
        preselectedCustomerId={customer.id}
        onSaved={() => loadData()}
      />

      {/* Archive Modal */}
      <ConfirmModal
        isOpen={isArchiveModalOpen}
        title={customer.status === 'Archived' ? 'Restore Customer' : 'Archive Customer'}
        message={
          customer.status === 'Archived'
            ? `Do you want to restore ${customer.name} to active status?`
            : `Are you sure you want to archive ${customer.name}? All vehicle records and visit histories will be preserved.`
        }
        confirmText={customer.status === 'Archived' ? 'Restore' : 'Archive'}
        onConfirm={handleArchiveToggle}
        onCancel={() => setIsArchiveModalOpen(false)}
      />
    </div>
  );
};
