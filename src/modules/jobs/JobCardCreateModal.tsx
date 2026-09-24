import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Car, User, Calendar, Gauge, Fuel, Plus, AlertCircle } from 'lucide-react';
import { vehicleRepository } from '../../services/vehicleRepository';
import { customerRepository } from '../../services/customerRepository';
import { jobRepository } from '../../services/jobRepository';
import { complaintRepository } from '../../services/complaintRepository';
import { recommendationRepository } from '../../services/recommendationRepository';
import { Vehicle } from '../../types/vehicle';
import { Customer } from '../../types/customer';
import { FuelLevel } from '../../types/jobCard';
import { ComplaintCategory } from '../../types/complaint';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { formatOdometer, formatIndianRegNumber } from '../../utils/formatters';

interface JobCardCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (jobId: string) => void;
  preselectedVehicleId?: string;
}

export const JobCardCreateModal: React.FC<JobCardCreateModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  preselectedVehicleId,
}) => {
  const { currentUser } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(preselectedVehicleId || '');
  const [odometer, setOdometer] = useState<number>(0);
  const [fuelLevel, setFuelLevel] = useState<FuelLevel>('50%');
  const [assignedTechnician, setAssignedTechnician] = useState<string>('Imran Khan');
  const [serviceAdvisor, setServiceAdvisor] = useState<string>(currentUser.name || 'Ravi Shankar');
  const [expectedDate, setExpectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [initialComplaint, setInitialComplaint] = useState<string>('');
  const [complaintCategory, setComplaintCategory] = useState<ComplaintCategory>('General / Periodic');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pendingRecs, setPendingRecs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      Promise.all([vehicleRepository.getAll(), customerRepository.getAll()]).then(([vList, cList]) => {
        setVehicles(vList);
        setCustomers(cList);
        if (preselectedVehicleId) {
          setSelectedVehicleId(preselectedVehicleId);
          const v = vList.find((item) => item.id === preselectedVehicleId);
          if (v) {
            setOdometer(v.currentOdometer);
            loadPendingRecs(v.id);
          }
        } else if (vList.length > 0 && !selectedVehicleId) {
          setSelectedVehicleId(vList[0].id);
          setOdometer(vList[0].currentOdometer);
          loadPendingRecs(vList[0].id);
        }
      });
    }
  }, [isOpen, preselectedVehicleId]);

  const loadPendingRecs = async (vehId: string) => {
    const recs = await recommendationRepository.getPendingByVehicleId(vehId);
    setPendingRecs(recs.map((r) => r.recommendation));
  };

  const handleVehicleChange = (vehId: string) => {
    setSelectedVehicleId(vehId);
    const v = vehicles.find((item) => item.id === vehId);
    if (v) {
      setOdometer(v.currentOdometer);
      loadPendingRecs(vehId);
    }
  };

  if (!isOpen) return null;

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const currentCustomer = currentVehicle
    ? customers.find((c) => c.id === currentVehicle.customerId)
    : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !currentCustomer) {
      notify('Please select a valid vehicle', 'error');
      return;
    }

    if (odometer <= 0) {
      notify('Please enter a valid odometer reading', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const today = new Date().toISOString().split('T')[0];
      const newJob = await jobRepository.create(
        {
          date: today,
          customerId: currentCustomer.id,
          vehicleId: selectedVehicleId,
          odometer: Number(odometer),
          fuelLevel,
          assignedTechnician,
          serviceAdvisor,
          expectedCompletionDate: expectedDate,
          internalNotes,
          status: 'Open',
        },
        currentUser.name
      );

      // If initial complaint was entered, create it
      if (initialComplaint.trim()) {
        await complaintRepository.create(
          {
            jobId: newJob.id,
            complaint: initialComplaint.trim(),
            category: complaintCategory,
            priority: 'Medium',
            status: 'Reported',
          },
          currentUser.name
        );
      }

      notify(`Job Card ${newJob.id} opened successfully!`);
      if (onCreated) {
        onCreated(newJob.id);
      }
      onClose();
      navigate(`/jobs/${newJob.id}`);
    } catch (err: any) {
      notify(err.message || 'Failed to open Job Card', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">Open New Job Card</h2>
            <p className="text-[11px] sm:text-xs text-neutral-500">Record vehicle intake and customer intake complaints</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1">
          {/* Vehicle Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
              Select Vehicle *
            </label>
            <div className="relative">
              <select
                value={selectedVehicleId}
                onChange={(e) => handleVehicleChange(e.target.value)}
                className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                required
              >
                {vehicles.map((v) => {
                  const cust = customers.find((c) => c.id === v.customerId);
                  return (
                    <option key={v.id} value={v.id}>
                      {formatIndianRegNumber(v.registrationNumber)} — {v.make} {v.model} ({cust?.name || 'Owner'})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Vehicle & Customer Preview Card */}
          {currentVehicle && currentCustomer && (
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-neutral-900 text-white flex items-center justify-center font-bold shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-neutral-900 text-sm truncate">
                    {formatIndianRegNumber(currentVehicle.registrationNumber)}
                  </div>
                  <div className="text-neutral-500 truncate">
                    {currentVehicle.make} {currentVehicle.model} {currentVehicle.variant} ({currentVehicle.year})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-neutral-200 pt-2 sm:pt-0 sm:pl-4 text-neutral-600">
                <User className="w-4 h-4 text-neutral-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-neutral-800 truncate">{currentCustomer.name}</div>
                  <div className="text-neutral-500 font-mono">{currentCustomer.mobile}</div>
                </div>
              </div>
            </div>
          )}

          {/* Pending Recommendations Alert Banner */}
          {pendingRecs.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Outstanding Recommendations from previous visit:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-amber-800">
                  {pendingRecs.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Odometer, Fuel Level & Expected Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Current Odometer (km) *
              </label>
              <div className="relative">
                <Gauge className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                  min="0"
                  required
                />
              </div>
              {currentVehicle && (
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Last recorded: {formatOdometer(currentVehicle.currentOdometer)}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Fuel Level *</label>
              <div className="relative">
                <Fuel className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <select
                  value={fuelLevel}
                  onChange={(e) => setFuelLevel(e.target.value as FuelLevel)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                >
                  <option value="Reserve">Reserve</option>
                  <option value="25%">25% (1/4)</option>
                  <option value="50%">50% (1/2)</option>
                  <option value="75%">75% (3/4)</option>
                  <option value="100%">100% (Full)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Expected Completion
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Assigned Staff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Service Advisor</label>
              <input
                type="text"
                value={serviceAdvisor}
                onChange={(e) => setServiceAdvisor(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Assigned Technician</label>
              <input
                type="text"
                value={assignedTechnician}
                onChange={(e) => setAssignedTechnician(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Initial Customer Complaint */}
          <div className="pt-2 border-t border-neutral-200">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
              Primary Customer Complaint / Intake Reason
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={initialComplaint}
                onChange={(e) => setInitialComplaint(e.target.value)}
                placeholder="e.g. Periodic service, brake squeaking, AC cooling weak..."
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-neutral-500">Category:</span>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value as ComplaintCategory)}
                  className="px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded-md text-neutral-800"
                >
                  <option value="General / Periodic">General / Periodic</option>
                  <option value="Brakes">Brakes</option>
                  <option value="Engine">Engine</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Air Conditioning">Air Conditioning</option>
                  <option value="Transmission & Clutch">Transmission & Clutch</option>
                  <option value="Steering">Steering</option>
                  <option value="Body & Trim">Body & Trim</option>
                </select>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Internal Intake Notes</label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Valuables checked, scratch on rear bumper, etc."
              rows={2}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-md transition-colors shadow-xs text-center"
            >
              {isSubmitting ? 'Creating...' : 'Open Job Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
