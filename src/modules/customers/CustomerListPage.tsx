import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Phone,
  MapPin,
  Car,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { customerRepository } from '../../services/customerRepository';
import { vehicleRepository } from '../../services/vehicleRepository';
import { jobRepository } from '../../services/jobRepository';
import { Customer } from '../../types/customer';
import { Vehicle } from '../../types/vehicle';
import { JobCard } from '../../types/jobCard';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { CustomerFormModal } from './CustomerFormModal';
import { useAuth } from '../../context/AuthContext';

export const CustomerListPage: React.FC = () => {
  const navigate = useNavigate();
  const { can } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Archived'>('Active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [cList, vList, jList] = await Promise.all([
      customerRepository.getAll(),
      vehicleRepository.getAll(),
      jobRepository.getAll(),
    ]);
    setCustomers(cList);
    setVehicles(vList);
    setJobs(jList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/[^a-z0-9]/g, '');

    const nameMatch = c.name.toLowerCase().includes(q);
    const mobileMatch =
      c.mobile.toLowerCase().includes(q) ||
      c.mobile.replace(/[^0-9]/g, '').includes(cleanQ);
    const altMatch = c.alternateMobile ? c.alternateMobile.includes(q) : false;
    const cityMatch = c.city.toLowerCase().includes(q);
    const idMatch = c.id.toLowerCase().includes(q);

    const matchesQuery = !q || nameMatch || mobileMatch || altMatch || cityMatch || idMatch;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Directory"
        subtitle="Manage workshop customer relationships, contact profiles, and vehicle ownership"
        badge={
          <span className="text-xs font-mono font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
            {customers.length} Customers
          </span>
        }
        actions={
          can('manage_customers') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Register Customer</span>
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
            placeholder="Search by customer name, phone number, city, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs font-medium self-end sm:self-center">
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

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-neutral-300">
          <Users className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-neutral-800">No customers found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or register a new customer in the directory.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm divide-y divide-neutral-200">
              <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Customer Name & ID</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Vehicles Owned</th>
                  <th className="px-6 py-3.5 text-right">Workshop Visits</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCustomers.map((cust) => {
                  const custVehicles = vehicles.filter((v) => v.customerId === cust.id);
                  const custJobs = jobs.filter((j) => j.customerId === cust.id);

                  return (
                    <tr
                      key={cust.id}
                      onClick={() => navigate(`/customers/${cust.id}`)}
                      className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {cust.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 group-hover:text-amber-600 transition-colors">
                              {cust.name}
                            </div>
                            <div className="text-xs font-mono text-neutral-400">{cust.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-mono text-neutral-800 text-xs flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-neutral-400" />
                          <span>{cust.mobile}</span>
                        </div>
                        {cust.email && (
                          <div className="text-[11px] text-neutral-400 mt-0.5">{cust.email}</div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-neutral-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>{cust.city}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {custVehicles.map((v) => (
                            <span
                              key={v.id}
                              className="font-mono text-[11px] font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200"
                            >
                              {v.registrationNumber}
                            </span>
                          ))}
                          {custVehicles.length === 0 && (
                            <span className="text-xs text-neutral-400 italic">No vehicles registered</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right font-mono tabular-nums text-neutral-900 font-semibold">
                        {custJobs.length} visits
                      </td>

                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={cust.status} size="sm" />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-semibold text-neutral-900 group-hover:underline flex items-center justify-end gap-1">
                          View
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden divide-y divide-neutral-100">
            {filteredCustomers.map((cust) => {
              const custVehicles = vehicles.filter((v) => v.customerId === cust.id);
              const custJobs = jobs.filter((j) => j.customerId === cust.id);

              return (
                <div
                  key={cust.id}
                  onClick={() => navigate(`/customers/${cust.id}`)}
                  className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-neutral-900 text-sm truncate">{cust.name}</div>
                      <div className="text-xs font-mono text-neutral-500 mt-0.5">{cust.mobile}</div>
                    </div>
                    <StatusBadge status={cust.status} size="sm" />
                  </div>

                  {custVehicles.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {custVehicles.map((v) => (
                        <span
                          key={v.id}
                          className="font-mono text-[10px] font-bold bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200"
                        >
                          {v.registrationNumber}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-1.5 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span>{cust.city}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-neutral-700">{custVehicles.length} Vehicles</span>
                      <span aria-hidden="true">·</span>
                      <span>{custJobs.length} Visits</span>
                    </div>
                    <span className="font-semibold text-neutral-900 flex items-center gap-0.5">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      <CustomerFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={() => loadData()}
      />
    </div>
  );
};
