import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowLeft, Printer, FileDown, Loader2 } from 'lucide-react';
import { jobRepository, FullJobCardDetail } from '../../services/jobRepository';
import { complaintRepository } from '../../services/complaintRepository';
import { inspectionRepository } from '../../services/inspectionRepository';
import { serviceRepository } from '../../services/serviceRepository';
import { partRepository } from '../../services/partRepository';
import { recommendationRepository } from '../../services/recommendationRepository';
import { JobCardStatus } from '../../types/jobCard';
import { Complaint } from '../../types/complaint';
import { ServicePerformed, ServiceStatus } from '../../types/service';
import { PartUsage } from '../../types/part';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useSettings } from '../../context/SettingsContext';
import { downloadJobCardPdf } from '../../utils/jobCardPdfGenerator';

// Modular child components
import { JobOverview } from './components/JobOverview';
import { ComplaintsSection } from './components/ComplaintsSection';
import { ComplaintFormModal } from './components/ComplaintFormModal';
import { InspectionSection } from './components/InspectionSection';
import { InspectionFormModal } from './components/InspectionFormModal';
import { ServicesSection } from './components/ServicesSection';
import { ServiceFormModal } from './components/ServiceFormModal';
import { PartsSection } from './components/PartsSection';
import { PartFormModal } from './components/PartFormModal';
import { RecommendationsSection } from './components/RecommendationsSection';
import { RecommendationFormModal } from './components/RecommendationFormModal';
import { PrintableJobSheet } from './components/PrintableJobSheet';

export const JobCardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can, currentUser } = useAuth();
  const { notify } = useNotification();
  const { settings } = useSettings();

  const [details, setDetails] = useState<FullJobCardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Add/Edit Item Modals State
  const [modalType, setModalType] = useState<
    'none' | 'complaint' | 'inspection' | 'service' | 'part' | 'recommendation'
  >('none');
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [editingService, setEditingService] = useState<ServicePerformed | null>(null);
  const [editingPart, setEditingPart] = useState<PartUsage | null>(null);

  const loadData = async () => {
    if (!id) return;
    const res = await jobRepository.getFullJobDetails(id);
    if (res) {
      setDetails(res);
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
          Loading Job Card Details...
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-neutral-200">
        <ClipboardList className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
        <h2 className="text-base font-bold text-neutral-800">Job Card Not Found</h2>
        <button
          onClick={() => navigate('/jobs')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-md"
        >
          Back to Job Cards
        </button>
      </div>
    );
  }

  const { job, vehicle, complaints, inspections, services, parts, recommendations } = details;

  const handleStatusChange = async (newStatus: JobCardStatus) => {
    try {
      await jobRepository.updateStatus(job.id, newStatus, currentUser.name);
      notify(`Job Card updated to "${newStatus}"`);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      notify(msg, 'error');
    }
  };

  const handleServiceStatusChange = async (serviceId: string, newStatus: ServiceStatus) => {
    try {
      const existing = services.find((s) => s.id === serviceId);
      await serviceRepository.update(
        serviceId,
        {
          status: newStatus,
          completedDate:
            newStatus === 'Completed'
              ? (existing?.completedDate || new Date().toISOString().split('T')[0])
              : undefined,
        },
        currentUser.name
      );
      notify(`Work status changed to "${newStatus}"`);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update service status';
      notify(msg, 'error');
    }
  };

  const handleDownloadPdf = async () => {
    if (!details) return;
    try {
      setIsDownloadingPdf(true);
      // Small tick so browser renders loader
      await new Promise((resolve) => setTimeout(resolve, 80));
      downloadJobCardPdf(details, settings);
      notify(`Downloaded Job Card ${details.job.id} as PDF`, 'success');
    } catch (err: unknown) {
      console.error('Failed to download job card PDF:', err);
      const msg = err instanceof Error ? err.message : 'Failed to download PDF';
      notify(msg, 'error');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <>
      {/* Screen view - hidden when printing */}
      <div className="space-y-6 print:hidden">
        {/* Top action / Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Job Cards</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 active:scale-95 disabled:opacity-60 disabled:pointer-events-none rounded-md transition-all shadow-xs"
              title="Download official formatted Job Card PDF"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-300" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-neutral-300" />
              )}
              <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors shadow-2xs"
              title="Open browser print dialog"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-500" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Main Job Card Banner */}
        <JobOverview
          details={details}
          canManage={can('manage_jobs')}
          onStatusChange={handleStatusChange}
        />

        {/* Grid: Sections of Job Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComplaintsSection
            complaints={complaints}
            canManage={can('manage_jobs')}
            onAddClick={() => {
              setEditingComplaint(null);
              setModalType('complaint');
            }}
            onEditClick={(c) => {
              setEditingComplaint(c);
              setModalType('complaint');
            }}
          />

          <InspectionSection
            inspections={inspections}
            canManage={can('manage_jobs')}
            onAddClick={() => setModalType('inspection')}
          />

          <ServicesSection
            services={services}
            canManage={can('manage_jobs')}
            onAddClick={() => {
              setEditingService(null);
              setModalType('service');
            }}
            onEditClick={(s) => {
              setEditingService(s);
              setModalType('service');
            }}
            onStatusChange={handleServiceStatusChange}
          />

          <PartsSection
            parts={parts}
            canManage={can('manage_jobs')}
            onAddClick={() => {
              setEditingPart(null);
              setModalType('part');
            }}
            onEditClick={(p) => {
              setEditingPart(p);
              setModalType('part');
            }}
          />
        </div>

        {/* Recommendations For Future Visits */}
        <RecommendationsSection
          recommendations={recommendations}
          canManage={can('manage_recommendations')}
          onAddClick={() => setModalType('recommendation')}
        />

        {/* Internal Notes / Customer Handover Details */}
        {job.internalNotes && (
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs text-xs">
            <strong className="text-neutral-900 font-semibold block mb-1">
              Internal Workshop Notes & Handover Checklist:
            </strong>
            <p className="text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              {job.internalNotes}
            </p>
          </div>
        )}
      </div>

      {/* Printable Sheet */}
      <PrintableJobSheet details={details} settings={settings} />

      {/* Modals */}
      <ComplaintFormModal
        isOpen={modalType === 'complaint'}
        initialData={editingComplaint}
        onClose={() => {
          setModalType('none');
          setEditingComplaint(null);
        }}
        onSubmit={async (data) => {
          if (editingComplaint) {
            await complaintRepository.update(
              editingComplaint.id,
              data,
              currentUser.name
            );
            notify('Complaint updated');
          } else {
            await complaintRepository.create(
              {
                jobId: job.id,
                ...data,
                status: 'Reported',
              },
              currentUser.name
            );
            notify('Complaint added to Job Card');
          }
          loadData();
        }}
      />

      <InspectionFormModal
        isOpen={modalType === 'inspection'}
        onClose={() => setModalType('none')}
        onSubmit={async (data) => {
          await inspectionRepository.create(
            {
              jobId: job.id,
              ...data,
              technician: job.assignedTechnician || currentUser.name,
            },
            currentUser.name
          );
          notify('Inspection item recorded');
          loadData();
        }}
      />

      <ServiceFormModal
        isOpen={modalType === 'service'}
        initialData={editingService}
        onClose={() => {
          setModalType('none');
          setEditingService(null);
        }}
        defaultTechnician={job.assignedTechnician || currentUser.name}
        onSubmit={async (data) => {
          if (editingService) {
            await serviceRepository.update(
              editingService.id,
              {
                ...data,
                completedDate:
                  data.status === 'Completed'
                    ? (editingService.completedDate || new Date().toISOString().split('T')[0])
                    : undefined,
              },
              currentUser.name
            );
            notify('Work record updated');
          } else {
            await serviceRepository.create(
              {
                jobId: job.id,
                ...data,
                completedDate:
                  data.status === 'Completed'
                    ? new Date().toISOString().split('T')[0]
                    : undefined,
              },
              currentUser.name
            );
            notify('Work performed logged');
          }
          loadData();
        }}
      />

      <PartFormModal
        isOpen={modalType === 'part'}
        initialData={editingPart}
        onClose={() => {
          setModalType('none');
          setEditingPart(null);
        }}
        onSubmit={async (data) => {
          if (editingPart) {
            await partRepository.update(
              editingPart.id,
              data,
              currentUser.name
            );
            notify('Part record updated');
          } else {
            if (!vehicle) return;
            await partRepository.create(
              {
                jobId: job.id,
                vehicleId: vehicle.id,
                ...data,
                odometerAtReplacement: job.odometer,
                replacementDate: job.date,
              },
              currentUser.name
            );
            notify('Part usage recorded');
          }
          loadData();
        }}
      />

      <RecommendationFormModal
        isOpen={modalType === 'recommendation'}
        onClose={() => setModalType('none')}
        defaultNextKm={job.odometer + 10000}
        onSubmit={async (data) => {
          if (!vehicle) return;
          await recommendationRepository.create(
            {
              jobId: job.id,
              vehicleId: vehicle.id,
              ...data,
              recommendedAtKm: job.odometer,
              recommendedDate: job.date,
              status: 'Pending',
            },
            currentUser.name
          );
          notify('Recommendation recorded');
          loadData();
        }}
      />
    </>
  );
};
