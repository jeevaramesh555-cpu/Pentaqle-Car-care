import { storage } from './storage';
import { JobCard, JobCardStatus } from '../types/jobCard';
import { Customer } from '../types/customer';
import { Vehicle } from '../types/vehicle';
import { Complaint } from '../types/complaint';
import { InspectionFinding } from '../types/inspection';
import { ServicePerformed } from '../types/service';
import { PartUsage } from '../types/part';
import { Recommendation } from '../types/recommendation';
import { auditRepository } from './auditRepository';

export interface FullJobCardDetail {
  job: JobCard;
  customer?: Customer;
  vehicle?: Vehicle;
  complaints: Complaint[];
  inspections: InspectionFinding[];
  services: ServicePerformed[];
  parts: PartUsage[];
  recommendations: Recommendation[];
}

export const jobRepository = {
  async getAll(): Promise<JobCard[]> {
    const jobs = storage.getJobCards();
    return [...jobs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getById(id: string): Promise<JobCard | undefined> {
    const jobs = storage.getJobCards();
    return jobs.find((j) => j.id === id);
  },

  async getByVehicle(vehicleId: string): Promise<JobCard[]> {
    const jobs = storage.getJobCards();
    return jobs
      .filter((j) => j.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getByCustomer(customerId: string): Promise<JobCard[]> {
    const jobs = storage.getJobCards();
    return jobs
      .filter((j) => j.customerId === customerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async create(data: Omit<JobCard, 'id' | 'createdAt'>, actorName = 'Service Advisor'): Promise<JobCard> {
    const jobs = storage.getJobCards();
    const settings = storage.getSettings();
    const nextNum = jobs.length + 1;
    const newId = `${settings.jobCardPrefix || 'JOB-'}${String(nextNum).padStart(6, '0')}`;
    const newJob: JobCard = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    storage.saveJobCards([newJob, ...jobs]);

    // Also update vehicle odometer if newer
    const vehicles = storage.getVehicles();
    const vIdx = vehicles.findIndex((v) => v.id === data.vehicleId);
    if (vIdx !== -1 && data.odometer > vehicles[vIdx].currentOdometer) {
      vehicles[vIdx].currentOdometer = data.odometer;
      storage.saveVehicles(vehicles);
    }

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Created',
      module: 'Job Card',
      recordId: newJob.id,
      description: `Opened Job Card ${newJob.id} at ${newJob.odometer.toLocaleString()} km`,
    });

    return newJob;
  },

  async update(id: string, data: Partial<JobCard>, actorName = 'Service Advisor'): Promise<JobCard> {
    const jobs = storage.getJobCards();
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx === -1) throw new Error(`Job Card with ID ${id} not found`);

    const updated = { ...jobs[idx], ...data };
    if (data.status === 'Closed' || data.status === 'Delivered') {
      if (!updated.completedAt) {
        updated.completedAt = new Date().toISOString();
      }
    }
    jobs[idx] = updated;
    storage.saveJobCards(jobs);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Updated',
      module: 'Job Card',
      recordId: id,
      description: `Updated Job Card ${id} details`,
    });

    return updated;
  },

  async updateStatus(id: string, status: JobCardStatus, actorName = 'Service Advisor'): Promise<JobCard> {
    return this.update(id, { status }, actorName);
  },

  async getFullJobDetails(id: string): Promise<FullJobCardDetail | null> {
    const job = await this.getById(id);
    if (!job) return null;

    const customers = storage.getCustomers();
    const vehicles = storage.getVehicles();
    const complaints = storage.getComplaints();
    const inspections = storage.getInspections();
    const services = storage.getServices();
    const parts = storage.getParts();
    const recommendations = storage.getRecommendations();

    const customer = customers.find((c) => c.id === job.customerId);
    const vehicle = vehicles.find((v) => v.id === job.vehicleId);

    return {
      job,
      customer,
      vehicle,
      complaints: complaints.filter((c) => c.jobId === id),
      inspections: inspections.filter((i) => i.jobId === id),
      services: services.filter((s) => s.jobId === id),
      parts: parts.filter((p) => p.jobId === id),
      recommendations: recommendations.filter((r) => r.jobId === id),
    };
  },
};
