import { storage } from './storage';
import { ReportFilter } from '../types/report';
import {
  ServiceHistoryReportRow,
  VehicleVisitsReportRow,
  PartsReplacementReportRow,
  RepeatComplaintsReportRow,
  PendingRecommendationsReportRow,
  TechnicianWorkReportRow,
} from '../types/reportData';

export const reportRepository = {
  async getServiceHistoryReport(filters?: ReportFilter): Promise<ServiceHistoryReportRow[]> {
    const jobs = storage.getJobCards();
    const services = storage.getServices();
    const vehicles = storage.getVehicles();
    const customers = storage.getCustomers();

    let rows: ServiceHistoryReportRow[] = services.map((s) => {
      const job = jobs.find((j) => j.id === s.jobId);
      const vehicle = job ? vehicles.find((v) => v.id === job.vehicleId) : undefined;
      const customer = job ? customers.find((c) => c.id === job.customerId) : undefined;
      return {
        serviceId: s.id,
        serviceName: s.serviceName,
        category: s.category,
        technician: s.technician,
        status: s.status,
        date: s.completedDate || job?.date || '',
        jobId: s.jobId,
        regNumber: vehicle?.registrationNumber || 'N/A',
        vehicleModel: vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A',
        customerName: customer?.name || 'N/A',
        odometer: job?.odometer || 0,
      };
    });

    if (filters?.startDate) {
      rows = rows.filter((r) => r.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      rows = rows.filter((r) => r.date <= filters.endDate!);
    }
    if (filters?.technician) {
      rows = rows.filter((r) => r.technician === filters.technician);
    }
    if (filters?.serviceCategory) {
      rows = rows.filter((r) => r.category === filters.serviceCategory);
    }

    return rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getVehicleVisitsReport(filters?: ReportFilter): Promise<VehicleVisitsReportRow[]> {
    const jobs = storage.getJobCards();
    const vehicles = storage.getVehicles();
    const customers = storage.getCustomers();

    let rows: VehicleVisitsReportRow[] = jobs.map((j) => {
      const vehicle = vehicles.find((v) => v.id === j.vehicleId);
      const customer = customers.find((c) => c.id === j.customerId);
      return {
        jobId: j.id,
        date: j.date,
        regNumber: vehicle?.registrationNumber || 'N/A',
        vehicleModel: vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A',
        customerName: customer?.name || 'N/A',
        customerMobile: customer?.mobile || 'N/A',
        odometer: j.odometer,
        status: j.status,
        serviceAdvisor: j.serviceAdvisor,
        technician: j.assignedTechnician,
      };
    });

    if (filters?.startDate) {
      rows = rows.filter((r) => r.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      rows = rows.filter((r) => r.date <= filters.endDate!);
    }
    if (filters?.status) {
      rows = rows.filter((r) => r.status === filters.status);
    }
    if (filters?.technician) {
      rows = rows.filter((r) => r.technician === filters.technician);
    }

    return rows;
  },

  async getPartsReplacementReport(filters?: ReportFilter): Promise<PartsReplacementReportRow[]> {
    const parts = storage.getParts();
    const jobs = storage.getJobCards();
    const vehicles = storage.getVehicles();

    let rows: PartsReplacementReportRow[] = parts.map((p) => {
      const job = jobs.find((j) => j.id === p.jobId);
      const vehicle = vehicles.find((v) => v.id === p.vehicleId);
      return {
        partId: p.id,
        partName: p.partName,
        brand: p.brand,
        partNumber: p.partNumber || '-',
        quantity: p.quantity,
        action: p.action,
        date: p.replacementDate,
        odometer: p.odometerAtReplacement,
        regNumber: vehicle?.registrationNumber || 'N/A',
        vehicleModel: vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A',
        jobId: p.jobId,
        warranty: p.warrantyNotes || 'N/A',
      };
    });

    if (filters?.startDate) {
      rows = rows.filter((r) => r.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      rows = rows.filter((r) => r.date <= filters.endDate!);
    }

    return rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getRepeatComplaintsReport(): Promise<RepeatComplaintsReportRow[]> {
    const complaints = storage.getComplaints();
    const jobs = storage.getJobCards();
    const vehicles = storage.getVehicles();
    const customers = storage.getCustomers();

    // Complaints that reference a previous job ID or have repeated patterns
    const repeatComplaints = complaints.filter((c) => Boolean(c.relatedPreviousJobId));

    return repeatComplaints.map((c) => {
      const job = jobs.find((j) => j.id === c.jobId);
      const prevJob = jobs.find((j) => j.id === c.relatedPreviousJobId);
      const vehicle = job ? vehicles.find((v) => v.id === job.vehicleId) : undefined;
      const customer = job ? customers.find((c) => c.id === job.customerId) : undefined;

      return {
        complaintId: c.id,
        complaint: c.complaint,
        category: c.category,
        priority: c.priority,
        status: c.status,
        currentJobId: c.jobId,
        currentDate: job?.date || '',
        currentOdometer: job?.odometer || 0,
        previousJobId: c.relatedPreviousJobId || '',
        previousDate: prevJob?.date || '',
        previousOdometer: prevJob?.odometer || 0,
        regNumber: vehicle?.registrationNumber || 'N/A',
        vehicleModel: vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A',
        customerName: customer?.name || 'N/A',
        technicianNotes: c.technicianNotes || '',
      };
    });
  },

  async getPendingRecommendationsReport(): Promise<PendingRecommendationsReportRow[]> {
    const recs = storage.getRecommendations();
    const vehicles = storage.getVehicles();
    const customers = storage.getCustomers();
    const jobs = storage.getJobCards();

    const pending = recs.filter((r) => r.status === 'Pending');

    return pending.map((r) => {
      const vehicle = vehicles.find((v) => v.id === r.vehicleId);
      const customer = vehicle ? customers.find((c) => c.id === vehicle.customerId) : undefined;
      const job = jobs.find((j) => j.id === r.jobId);

      return {
        recId: r.id,
        recommendation: r.recommendation,
        priority: r.priority,
        recommendedDate: r.recommendedDate,
        recommendedAtKm: r.recommendedAtKm,
        recommendedNextKm: r.recommendedNextKm,
        currentOdometer: vehicle?.currentOdometer || 0,
        regNumber: vehicle?.registrationNumber || 'N/A',
        vehicleModel: vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A',
        customerName: customer?.name || 'N/A',
        customerPhone: customer?.mobile || 'N/A',
        jobId: r.jobId,
      };
    });
  },

  async getTechnicianWorkReport(): Promise<TechnicianWorkReportRow[]> {
    const services = storage.getServices();
    const techStats: Record<string, { totalJobs: number; completed: number; inProgress: number }> = {};

    services.forEach((s) => {
      const tech = s.technician || 'Unassigned';
      if (!techStats[tech]) {
        techStats[tech] = { totalJobs: 0, completed: 0, inProgress: 0 };
      }
      techStats[tech].totalJobs += 1;
      if (s.status === 'Completed') techStats[tech].completed += 1;
      if (s.status === 'In Progress') techStats[tech].inProgress += 1;
    });

    return Object.entries(techStats).map(([technician, stats]) => ({
      technician,
      ...stats,
    }));
  },
};
