import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Car,
  Search,
  ArrowRight,
  ClipboardList,
  Wrench,
  AlertCircle,
  Calendar,
  Filter,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Gauge,
} from 'lucide-react';
import { vehicleRepository } from '../../services/vehicleRepository';
import { customerRepository } from '../../services/customerRepository';
import { jobRepository } from '../../services/jobRepository';
import { partRepository } from '../../services/partRepository';
import { complaintRepository } from '../../services/complaintRepository';
import { Vehicle } from '../../types/vehicle';
import { Customer } from '../../types/customer';
import { JobCard } from '../../types/jobCard';
import { PageHeader } from '../../components/common/PageHeader';
import { formatOdometer, formatDate, formatIndianRegNumber } from '../../utils/formatters';

export const ServiceHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [totalPartsCount, setTotalPartsCount] = useState(0);
  const [totalComplaintsCount, setTotalComplaintsCount] = useState(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('VEH-000001');
  const [searchQuery, setSearchQuery] = useState('');
  const [makeFilter, setMakeFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [vList, cList, jList, pList, compList] = await Promise.all([
        vehicleRepository.getAll(),
        customerRepository.getAll(),
        jobRepository.getAll(),
        partRepository.getAll(),
        complaintRepository.getAll(),
      ]);
      setVehicles(vList);
      setCustomers(cList);
      setJobs(jList);
      setTotalPartsCount(pList.length);
      setTotalComplaintsCount(compList.length);
      if (vList.length > 0 && !vList.some((v) => v.id === 'VEH-000001')) {
        setSelectedVehicleId(vList[0].id);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const makes = Array.from(new Set(vehicles.map((v) => v.make))).sort();

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
    const matchesMake = makeFilter === 'All' || v.make === makeFilter;

    return matchesQuery && matchesMake;
  });

  const spotlightVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const spotlightCustomer = spotlightVehicle
    ? customers.find((c) => c.id === spotlightVehicle.customerId)
    : undefined;
  const spotlightJobs = spotlightVehicle
    ? jobs.filter((j) => j.vehicleId === spotlightVehicle.id).sort((a, b) => b.date.localeCompare(a.date))
    : [];

  const minOdo = spotlightJobs.length > 0 ? Math.min(...spotlightJobs.map((j) => j.odometer)) : spotlightVehicle?.currentOdometer || 0;
  const maxOdo = spotlightVehicle?.currentOdometer || (spotlightJobs.length > 0 ? Math.max(...spotlightJobs.map((j) => j.odometer)) : 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs text-neutral-400 font-mono animate-pulse">
          Loading lifetime service history archive...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lifetime Service History"
        subtitle="Comprehensive chronological timeline of visits, diagnostics, replaced parts, and recorded complaints across the entire workshop vehicle fleet."
      />

      {/* Highlights & Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium">Vehicles on Record</span>
            <Car className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">{vehicles.length}</div>
          <span className="text-[11px] text-neutral-400 mt-1 block">Tracked in registry</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium">Recorded Visits</span>
            <ClipboardList className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">{jobs.length}</div>
          <span className="text-[11px] text-sky-600 font-medium mt-1 block">Total completed & open</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium">Parts Tracked</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">{totalPartsCount}</div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Installed components</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium">Complaints Logged</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">{totalComplaintsCount}</div>
          <span className="text-[11px] text-rose-600 font-medium mt-1 block">Lifetime diagnostic log</span>
        </div>
      </div>

      {/* Featured Vehicle Showcase Card (Transferred from Home Page to its dedicated space) */}
      {spotlightVehicle && (
        <div className="bg-neutral-900 text-white rounded-2xl shadow-lg border border-neutral-800 p-6 sm:p-7 overflow-hidden relative">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Lifetime History Highlight
                </span>
                <span className="text-xs font-mono text-neutral-400 bg-neutral-800/90 px-2.5 py-1 rounded-md">
                  {spotlightJobs.length} Recorded Visits
                </span>
                {spotlightCustomer && (
                  <span className="text-xs text-neutral-300">
                    Owner: <strong>{spotlightCustomer.name}</strong>
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-white">
                  {formatIndianRegNumber(spotlightVehicle.registrationNumber)}
                </h2>
                <p className="text-base text-neutral-300 font-medium mt-0.5">
                  {spotlightVehicle.make} {spotlightVehicle.model} {spotlightVehicle.variant || ''} ({spotlightVehicle.year})
                </p>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Showcases complete chronological lifecycle from {formatOdometer(minOdo)} to {formatOdometer(maxOdo)},
                including diagnostic inspection records, replaced parts history, complaints resolution, and long-term maintenance recommendations.
              </p>

              {spotlightJobs.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-neutral-400">
                  <span className="text-neutral-500">Service visits on record:</span>
                  {spotlightJobs.slice(0, 4).map((j, idx) => (
                    <span
                      key={j.id}
                      className="bg-neutral-800 border border-neutral-700/80 px-2 py-0.5 rounded text-[11px] font-mono text-neutral-300"
                    >
                      #{idx + 1} {formatDate(j.date)} · {formatOdometer(j.odometer)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => navigate(`/vehicles/${spotlightVehicle.id}`)}
                className="py-3 px-6 text-sm font-bold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Inspect Lifetime Timeline</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate(`/jobs?vehicleId=${spotlightVehicle.id}`)}
                className="py-2.5 px-4 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-xl transition-colors text-center"
              >
                Browse Job Cards ({spotlightJobs.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Fleet Service Directory */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        {/* Toolbar & Filters */}
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by reg number, owner, make, or VIN..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
              className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="All">All Makes ({vehicles.length})</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List of Vehicles and their Lifetime History */}
        <div className="divide-y divide-neutral-100">
          {filteredVehicles.map((v) => {
            const owner = customers.find((c) => c.id === v.customerId);
            const vJobs = jobs.filter((j) => j.vehicleId === v.id);
            const isSpotlighted = v.id === spotlightVehicle?.id;

            return (
              <div
                key={v.id}
                className={`p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSpotlighted ? 'bg-amber-50/40 border-l-4 border-l-amber-500' : 'hover:bg-neutral-50/80'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div
                    onClick={() => setSelectedVehicleId(v.id)}
                    className="w-11 h-11 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center font-bold text-neutral-800 shrink-0 cursor-pointer"
                    title="Click to spotlight this vehicle"
                  >
                    <Car className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-sm text-neutral-900 tracking-wider">
                        {formatIndianRegNumber(v.registrationNumber)}
                      </span>
                      <span className="text-xs font-medium text-neutral-600">
                        {v.make} {v.model}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-mono">
                        {v.fuelType}
                      </span>
                      {isSpotlighted && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          Spotlighted
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-xs text-neutral-500">
                      <span>
                        Owner: <strong className="text-neutral-700 font-medium">{owner?.name || 'Unknown'}</strong>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-neutral-400" />
                        {formatOdometer(v.currentOdometer)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-500">
                        <strong>{vJobs.length}</strong> recorded visits
                      </span>
                      {v.vin && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[11px] text-neutral-400">VIN: {v.vin}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setSelectedVehicleId(v.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors font-medium"
                  >
                    Spotlight
                  </button>

                  <button
                    onClick={() => navigate(`/vehicles/${v.id}`)}
                    className="text-xs px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>View Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredVehicles.length === 0 && (
            <div className="p-8 text-center text-xs text-neutral-400">
              No vehicle records match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
