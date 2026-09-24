import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Car,
  Clock,
  ArrowLeft,
  FileText,
  Tag,
  Package,
  AlertCircle,
} from 'lucide-react';
import { vehicleRepository, VehicleFullHistory } from '../../services/vehicleRepository';
import { customerRepository } from '../../services/customerRepository';
import { Customer } from '../../types/customer';
import { VehicleFormModal } from './VehicleFormModal';
import { JobCardCreateModal } from '../jobs/JobCardCreateModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

// Modular child components
import { VehicleOverview } from './components/VehicleOverview';
import { VehicleHistoryTimeline } from './components/VehicleHistoryTimeline';
import { VehiclePartsHistory } from './components/VehiclePartsHistory';
import { VehicleComplaintHistory } from './components/VehicleComplaintHistory';
import { VehicleRecommendations } from './components/VehicleRecommendations';
import { VehicleSpecifications } from './components/VehicleSpecifications';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { notify } = useNotification();

  const [history, setHistory] = useState<VehicleFullHistory | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<
    'timeline' | 'parts' | 'complaints' | 'recommendations' | 'overview'
  >('timeline');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    const h = await vehicleRepository.getHistory(id);
    if (h) {
      setHistory(h);
      const cust = await customerRepository.getById(h.vehicle.customerId);
      setCustomer(cust || null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs text-neutral-400 font-mono animate-pulse">
          Loading Vehicle Lifetime Profile...
        </div>
      </div>
    );
  }

  if (!history) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-neutral-200">
        <Car className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
        <h2 className="text-base font-bold text-neutral-800">Vehicle Not Found</h2>
        <p className="text-xs text-neutral-500 mt-1 mb-4">
          The requested vehicle profile could not be located.
        </p>
        <button
          onClick={() => navigate('/vehicles')}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-md"
        >
          Back to Vehicles
        </button>
      </div>
    );
  }

  const { vehicle, jobCards, allPartsReplaced, allComplaints, allRecommendations } = history;
  const lastJob = jobCards[0]?.job;
  const pendingRecs = allRecommendations.filter((r) => r.status === 'Pending');

  const handleArchiveToggle = async () => {
    if (vehicle.status === 'Archived') {
      await vehicleRepository.restore(vehicle.id);
      notify(`Vehicle ${vehicle.registrationNumber} restored to Active`);
    } else {
      await vehicleRepository.archive(vehicle.id);
      notify(`Vehicle ${vehicle.registrationNumber} archived`);
    }
    setIsArchiveModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/vehicles')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Vehicles Registry</span>
      </button>

      {/* Prominent Vehicle Header */}
      <VehicleOverview
        vehicle={vehicle}
        customer={customer}
        jobCount={jobCards.length}
        lastJob={lastJob}
        pendingRecs={pendingRecs}
        canManageJobs={can('manage_jobs')}
        canManageVehicles={can('manage_vehicles')}
        onOpenJob={() => setIsNewJobModalOpen(true)}
        onEditSpec={() => setIsEditModalOpen(true)}
        onArchiveToggle={() => setIsArchiveModalOpen(true)}
        onViewRecommendations={() => setActiveTab('recommendations')}
      />

      {/* Tabs Navigation */}
      <div className="flex border-b border-neutral-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'timeline'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Lifetime Service History ({jobCards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('parts')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'parts'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Parts Replaced ({allPartsReplaced.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'complaints'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Complaints & Issues ({allComplaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'recommendations'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Recommendations ({allRecommendations.length})</span>
          {pendingRecs.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Vehicle Specifications & Notes</span>
        </button>
      </div>

      {/* Tab 1: Chronological Lifetime Timeline */}
      {activeTab === 'timeline' && (
        <VehicleHistoryTimeline
          jobCards={jobCards}
          onOpenFirstJob={() => setIsNewJobModalOpen(true)}
        />
      )}

      {/* Tab 2: Parts Replaced (Aggregated lifetime table) */}
      {activeTab === 'parts' && <VehiclePartsHistory parts={allPartsReplaced} />}

      {/* Tab 3: Complaints & Issues */}
      {activeTab === 'complaints' && <VehicleComplaintHistory complaints={allComplaints} />}

      {/* Tab 4: Recommendations */}
      {activeTab === 'recommendations' && (
        <VehicleRecommendations recommendations={allRecommendations} />
      )}

      {/* Tab 5: Overview & Spec */}
      {activeTab === 'overview' && (
        <VehicleSpecifications vehicle={vehicle} customer={customer} />
      )}

      {/* Edit Vehicle Modal */}
      <VehicleFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingVehicle={vehicle}
        onSaved={() => loadData()}
      />

      {/* Open Job Card Modal */}
      <JobCardCreateModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        preselectedVehicleId={vehicle.id}
        onCreated={() => loadData()}
      />

      {/* Archive Confirm Modal */}
      <ConfirmModal
        isOpen={isArchiveModalOpen}
        title={vehicle.status === 'Archived' ? 'Restore Vehicle' : 'Archive Vehicle'}
        message={
          vehicle.status === 'Archived'
            ? `Do you want to restore ${vehicle.registrationNumber} to active service?`
            : `Are you sure you want to archive ${vehicle.registrationNumber}? Historical records and past job cards will be safely retained.`
        }
        confirmText={vehicle.status === 'Archived' ? 'Restore' : 'Archive'}
        onConfirm={handleArchiveToggle}
        onCancel={() => setIsArchiveModalOpen(false)}
      />
    </div>
  );
};
