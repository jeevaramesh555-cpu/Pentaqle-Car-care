import { storage } from './storage';
import { Vehicle } from '../types/vehicle';
import { JobCard } from '../types/jobCard';
import { Complaint } from '../types/complaint';
import { InspectionFinding } from '../types/inspection';
import { ServicePerformed } from '../types/service';
import { PartUsage } from '../types/part';
import { Recommendation } from '../types/recommendation';
import { auditRepository } from './auditRepository';

export interface VehicleJobCardSummary {
  job: JobCard;
  complaints: Complaint[];
  inspections: InspectionFinding[];
  services: ServicePerformed[];
  parts: PartUsage[];
  recommendations: Recommendation[];
}

export interface VehicleFullHistory {
  vehicle: Vehicle;
  jobCards: VehicleJobCardSummary[];
  allComplaints: Complaint[];
  allServices: ServicePerformed[];
  allPartsReplaced: PartUsage[];
  allRecommendations: Recommendation[];
}

export const vehicleRepository = {
  async getAll(): Promise<Vehicle[]> {
    return storage.getVehicles();
  },

  async getById(id: string): Promise<Vehicle | undefined> {
    const vehicles = storage.getVehicles();
    return vehicles.find((v) => v.id === id);
  },

  async getByRegistration(regNo: string): Promise<Vehicle | undefined> {
    const normalized = regNo.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    const vehicles = storage.getVehicles();
    return vehicles.find(
      (v) => v.registrationNumber.replace(/[^A-Za-z0-9]/g, '').toLowerCase() === normalized
    );
  },

  async getByCustomer(customerId: string): Promise<Vehicle[]> {
    const vehicles = storage.getVehicles();
    return vehicles.filter((v) => v.customerId === customerId);
  },

  async search(query: string): Promise<Vehicle[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();
    const vehicles = storage.getVehicles();
    return vehicles.filter(
      (v) =>
        v.registrationNumber.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        (v.variant && v.variant.toLowerCase().includes(q)) ||
        (v.vin && v.vin.toLowerCase().includes(q)) ||
        (v.engineNumber && v.engineNumber.toLowerCase().includes(q)) ||
        v.id.toLowerCase().includes(q)
    );
  },

  async create(data: Omit<Vehicle, 'id' | 'createdAt'>, actorName = 'Service Advisor'): Promise<Vehicle> {
    const vehicles = storage.getVehicles();
    const settings = storage.getSettings();
    const nextNum = vehicles.length + 1;
    const newId = `${settings.vehiclePrefix || 'VEH-'}${String(nextNum).padStart(6, '0')}`;
    const newVehicle: Vehicle = {
      ...data,
      id: newId,
      registrationNumber: data.registrationNumber.toUpperCase().trim(),
      createdAt: new Date().toISOString(),
    };
    storage.saveVehicles([newVehicle, ...vehicles]);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Created',
      module: 'Vehicle',
      recordId: newVehicle.id,
      description: `Registered vehicle ${newVehicle.registrationNumber} (${newVehicle.make} ${newVehicle.model})`,
    });

    return newVehicle;
  },

  async update(id: string, data: Partial<Vehicle>, actorName = 'Service Advisor'): Promise<Vehicle> {
    const vehicles = storage.getVehicles();
    const idx = vehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error(`Vehicle with ID ${id} not found`);

    const updated = {
      ...vehicles[idx],
      ...data,
      registrationNumber: data.registrationNumber ? data.registrationNumber.toUpperCase().trim() : vehicles[idx].registrationNumber,
    };
    vehicles[idx] = updated;
    storage.saveVehicles(vehicles);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Updated',
      module: 'Vehicle',
      recordId: id,
      description: `Updated vehicle details for ${updated.registrationNumber}`,
    });

    return updated;
  },

  async updateOdometer(id: string, newOdometer: number, actorName = 'Service Advisor'): Promise<Vehicle> {
    const vehicle = await this.getById(id);
    if (!vehicle) throw new Error('Vehicle not found');
    if (newOdometer > vehicle.currentOdometer) {
      return this.update(id, { currentOdometer: newOdometer }, actorName);
    }
    return vehicle;
  },

  async archive(id: string, actorName = 'Service Advisor'): Promise<Vehicle> {
    return this.update(id, { status: 'Archived' }, actorName);
  },

  async restore(id: string, actorName = 'Service Advisor'): Promise<Vehicle> {
    return this.update(id, { status: 'Active' }, actorName);
  },

  async getHistory(vehicleId: string): Promise<VehicleFullHistory | null> {
    const vehicle = await this.getById(vehicleId);
    if (!vehicle) return null;

    const allJobs = storage.getJobCards().filter((j) => j.vehicleId === vehicleId);
    const sortedJobs = [...allJobs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const complaints = storage.getComplaints();
    const inspections = storage.getInspections();
    const services = storage.getServices();
    const parts = storage.getParts();
    const recommendations = storage.getRecommendations();

    const jobHistory = sortedJobs.map((job) => ({
      job,
      complaints: complaints.filter((c) => c.jobId === job.id),
      inspections: inspections.filter((i) => i.jobId === job.id),
      services: services.filter((s) => s.jobId === job.id),
      parts: parts.filter((p) => p.jobId === job.id),
      recommendations: recommendations.filter((r) => r.jobId === job.id),
    }));

    return {
      vehicle,
      jobCards: jobHistory,
      allComplaints: complaints.filter((c) => sortedJobs.some((j) => j.id === c.jobId)),
      allServices: services.filter((s) => sortedJobs.some((j) => j.id === s.jobId)),
      allPartsReplaced: parts.filter((p) => p.vehicleId === vehicleId),
      allRecommendations: recommendations.filter((r) => r.vehicleId === vehicleId),
    };
  },
};
