import React, { useState, useEffect } from 'react';
import { X, Car } from 'lucide-react';
import { Vehicle, FuelType, TransmissionType, VehicleStatus } from '../../types/vehicle';
import { Customer } from '../../types/customer';
import { vehicleRepository } from '../../services/vehicleRepository';
import { customerRepository } from '../../services/customerRepository';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { formatIndianRegNumber } from '../../utils/formatters';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (vehicle: Vehicle) => void;
  editingVehicle?: Vehicle;
  preselectedCustomerId?: string;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  editingVehicle,
  preselectedCustomerId,
}) => {
  const { currentUser } = useAuth();
  const { notify } = useNotification();
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [customerId, setCustomerId] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState(2022);
  const [fuelType, setFuelType] = useState<FuelType>('Diesel');
  const [transmission, setTransmission] = useState<TransmissionType>('Manual');
  const [vin, setVin] = useState('');
  const [engineNumber, setEngineNumber] = useState('');
  const [color, setColor] = useState('');
  const [currentOdometer, setCurrentOdometer] = useState(0);
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<VehicleStatus>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      customerRepository.getAll().then((list) => {
        setCustomers(list);
        if (!editingVehicle && !customerId) {
          setCustomerId(preselectedCustomerId || (list.length > 0 ? list[0].id : ''));
        }
      });

      if (editingVehicle) {
        setCustomerId(editingVehicle.customerId);
        setRegistrationNumber(editingVehicle.registrationNumber);
        setMake(editingVehicle.make);
        setModel(editingVehicle.model);
        setVariant(editingVehicle.variant || '');
        setYear(editingVehicle.year);
        setFuelType(editingVehicle.fuelType);
        setTransmission(editingVehicle.transmission);
        setVin(editingVehicle.vin || '');
        setEngineNumber(editingVehicle.engineNumber || '');
        setColor(editingVehicle.color || '');
        setCurrentOdometer(editingVehicle.currentOdometer);
        setInsuranceExpiry(editingVehicle.insuranceExpiry || '');
        setNotes(editingVehicle.notes || '');
        setStatus(editingVehicle.status);
      } else {
        setRegistrationNumber('');
        setMake('Toyota');
        setModel('');
        setVariant('');
        setYear(2022);
        setFuelType('Diesel');
        setTransmission('Manual');
        setVin('');
        setEngineNumber('');
        setColor('');
        setCurrentOdometer(0);
        setInsuranceExpiry('');
        setNotes('');
        setStatus('Active');
      }
    }
  }, [isOpen, editingVehicle, preselectedCustomerId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationNumber.trim() || !make.trim() || !model.trim() || !customerId) {
      notify('Please fill all required vehicle fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingVehicle) {
        const updated = await vehicleRepository.update(
          editingVehicle.id,
          {
            customerId,
            registrationNumber,
            make,
            model,
            variant,
            year: Number(year),
            fuelType,
            transmission,
            vin,
            engineNumber,
            color,
            currentOdometer: Number(currentOdometer),
            insuranceExpiry,
            notes,
            status,
          },
          currentUser.name
        );
        notify(`Vehicle ${updated.registrationNumber} updated successfully!`);
        onSaved(updated);
      } else {
        const created = await vehicleRepository.create(
          {
            customerId,
            registrationNumber,
            make,
            model,
            variant,
            year: Number(year),
            fuelType,
            transmission,
            vin,
            engineNumber,
            color,
            currentOdometer: Number(currentOdometer),
            insuranceExpiry,
            notes,
            status,
          },
          currentUser.name
        );
        notify(`Vehicle ${created.registrationNumber} added to registry!`);
        onSaved(created);
      }
      onClose();
    } catch (err: any) {
      notify(err.message || 'Operation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-neutral-900 text-white flex items-center justify-center font-bold shrink-0">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                {editingVehicle ? 'Edit Vehicle Profile' : 'Register New Vehicle'}
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-500">
                Permanent vehicle record for lifetime service tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4 flex-1">
          {/* Owner Assignment */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Vehicle Owner (Customer) *
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              required
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.mobile}) — {c.city}
                </option>
              ))}
            </select>
          </div>

          {/* Registration Number, Make, Model */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Registration No. *
              </label>
              <input
                type="text"
                placeholder="e.g. TN11AB1234"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(formatIndianRegNumber(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono uppercase focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Make *</label>
              <input
                type="text"
                placeholder="e.g. Toyota, Maruti Suzuki, Tata"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Model *</label>
              <input
                type="text"
                placeholder="e.g. Innova Crysta, Swift, Nexon"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Variant, Year, Fuel, Transmission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Variant</label>
              <input
                type="text"
                placeholder="e.g. 2.4 ZX, ZXi, AX7"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Mfg Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min="1990"
                max="2030"
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              >
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="AMT">AMT</option>
                <option value="CVT">CVT</option>
                <option value="DCT">DCT</option>
                <option value="IMT">IMT</option>
              </select>
            </div>
          </div>

          {/* Odometer, VIN, Engine No */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Current Odometer (km) *
              </label>
              <input
                type="number"
                value={currentOdometer}
                onChange={(e) => setCurrentOdometer(Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                VIN / Chassis Number
              </label>
              <input
                type="text"
                placeholder="17-character VIN"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Engine Number
              </label>
              <input
                type="text"
                placeholder="Engine identifier"
                value={engineNumber}
                onChange={(e) => setEngineNumber(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Color, Insurance, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Colour</label>
              <input
                type="text"
                placeholder="e.g. Super White, Pearl Black"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Insurance Expiry (optional)
              </label>
              <input
                type="date"
                value={insuranceExpiry}
                onChange={(e) => setInsuranceExpiry(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Notes / Preferences</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prefers OEM parts only, check ADAS calibration..."
              rows={2}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
            />
          </div>

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
              {isSubmitting ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
