import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Search,
  Plus,
  Filter,
  ArrowRight,
  Gauge,
  Calendar,
  Fuel,
  ChevronRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { vehicleRepository } from '../../services/vehicleRepository';
import { customerRepository } from '../../services/customerRepository';
import { jobRepository } from '../../services/jobRepository';
import { Vehicle } from '../../types/vehicle';
import { Customer } from '../../types/customer';
import { JobCard } from '../../types/jobCard';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatOdometer, formatDate, formatIndianRegNumber } from '../../utils/formatters';
import { VehicleFormModal } from './VehicleFormModal';
import { useAuth } from '../../context/AuthContext';

export const VehicleListPage: React.FC = () => {
  const navigate = useNavigate();
  const { can } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Archived'>('Active');
  const [makeFilter, setMakeFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [vList, cList, jList] = await Promise.all([
      vehicleRepository.getAll(),
      customerRepository.getAll(),
      jobRepository.getAll(),
    ]);
    setVehicles(vList);
    setCustomers(cList);
    setJobs(jList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const makes = Array.from(new Set(vehicles.map((v) => v.make))).sort();

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/[^a-z0-9]/g, '');

    const regMatch =
      v.registrationNumber.toLowerCase().includes(q) ||
      v.registrationNumber.replace(/[^a-z0-9]/g, '').toLowerCase().includes(cleanQ);
    const makeMatch = v.make.toLowerCase().includes(q);
    const modelMatch = v.model.toLowerCase().includes(q);
    const vinMatch = v.vin ? v.vin.toLowerCase().includes(q) : false;

    const owner = customers.find((c) => c.id === v.customerId);
    const ownerMatch = owner ? owner.name.toLowerCase().includes(q) || owner.mobile.includes(q) : false;

    const matchesQuery = !q || regMatch || makeMatch || modelMatch || vinMatch || ownerMatch;
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchesMake = makeFilter === 'All' || v.make === makeFilter;

    return matchesQuery && matchesStatus && matchesMake;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicles Registry"
        subtitle="Permanent digital service history profiles for every customer automobile"
        badge={
          <span className="text-xs font-mono font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
            {vehicles.length} Total Registered
          </span>
        }
        actions={
          can('manage_vehicles') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Register Vehicle</span>
            </button>
          )
        }
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search registration (e.g. KA-01-MJ-4821), make, model, owner or VIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Make Filter */}
          <select
            value={makeFilter}
            onChange={(e) => setMakeFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-none"
          >
            <option value="All">All Makes</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Status Tabs */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setStatusFilter('Active')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'Active'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Active
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
            <button
              onClick={() => setStatusFilter('Archived')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'Archived'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Archived
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle Grid / Table */}
      {filteredVehicles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-neutral-300">
          <Car className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-neutral-800">No vehicles match your search</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new automobile into the workshop registry.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm divide-y divide-neutral-200">
              <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Registration & Vehicle</th>
                  <th className="px-6 py-3.5">Owner</th>
                  <th className="px-6 py-3.5">Spec / Fuel</th>
                  <th className="px-6 py-3.5 text-right">Current Odometer</th>
                  <th className="px-6 py-3.5 text-right">Workshop Visits</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredVehicles.map((veh) => {
                  const owner = customers.find((c) => c.id === veh.customerId);
                  const vehicleJobs = jobs.filter((j) => j.vehicleId === veh.id);
                  const lastJob = vehicleJobs.sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                  )[0];

                  return (
                    <tr
                      key={veh.id}
                      onClick={() => navigate(`/vehicles/${veh.id}`)}
                      className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors flex items-center justify-center font-bold shrink-0">
                            <Car className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-mono font-bold text-neutral-900 tracking-wider">
                              {formatIndianRegNumber(veh.registrationNumber)}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {veh.make} {veh.model} {veh.variant && `· ${veh.variant}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">{owner?.name || 'Unknown'}</div>
                        <div className="text-xs text-neutral-400 font-mono">{owner?.mobile}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-xs text-neutral-700">
                          {veh.fuelType} · {veh.transmission}
                        </div>
                        <div className="text-[11px] text-neutral-400">Year {veh.year}</div>
                      </td>

                      <td className="px-6 py-4 text-right font-mono tabular-nums text-neutral-900 font-medium">
                        {formatOdometer(veh.currentOdometer)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-semibold text-neutral-800">
                          {vehicleJobs.length} visits
                        </span>
                        {lastJob && (
                          <div className="text-[11px] text-neutral-400">
                            Last: {formatDate(lastJob.date)}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={veh.status} size="sm" />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-semibold text-neutral-900 group-hover:underline flex items-center justify-end gap-1">
                          View History
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-neutral-100">
            {filteredVehicles.map((veh) => {
              const owner = customers.find((c) => c.id === veh.customerId);
              const vehicleJobs = jobs.filter((j) => j.vehicleId === veh.id);

              return (
                <div
                  key={veh.id}
                  onClick={() => navigate(`/vehicles/${veh.id}`)}
                  className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono font-bold text-neutral-900 text-base tracking-wider">
                        {formatIndianRegNumber(veh.registrationNumber)}
                      </div>
                      <div className="text-xs text-neutral-600 font-medium">
                        {veh.make} {veh.model} {veh.variant && `(${veh.variant})`}
                      </div>
                    </div>
                    <StatusBadge status={veh.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500 pt-1 border-t border-neutral-100">
                    <div>
                      <span className="text-[10px] uppercase text-neutral-400 block">Owner</span>
                      <span className="font-medium text-neutral-800">{owner?.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-neutral-400 block">Odometer</span>
                      <span className="font-mono tabular-nums font-semibold text-neutral-800">
                        {formatOdometer(veh.currentOdometer)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-400 pt-1.5 gap-2 border-t border-neutral-100">
                    <span>
                      {veh.fuelType} · {veh.transmission} · {vehicleJobs.length} Visits
                    </span>
                    <span className="text-neutral-900 font-semibold flex items-center gap-1 ml-auto">
                      Lifetime History <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Register Vehicle Modal */}
      <VehicleFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={() => loadData()}
      />
    </div>
  );
};
