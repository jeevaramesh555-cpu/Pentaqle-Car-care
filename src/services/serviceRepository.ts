import { storage } from './storage';
import { ServicePerformed } from '../types/service';
import { auditRepository } from './auditRepository';

export const serviceRepository = {
  async getAll(): Promise<ServicePerformed[]> {
    return storage.getServices();
  },

  async getByJobId(jobId: string): Promise<ServicePerformed[]> {
    return storage.getServices().filter((s) => s.jobId === jobId);
  },

  async create(data: Omit<ServicePerformed, 'id'>, actorName = 'Technician'): Promise<ServicePerformed> {
    const services = storage.getServices();
    const newId = `SRV-${String(services.length + 1).padStart(6, '0')}`;
    const newService: ServicePerformed = {
      ...data,
      id: newId,
    };
    storage.saveServices([newService, ...services]);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Created',
      module: 'Service',
      recordId: newService.id,
      description: `Logged work performed: ${newService.serviceName} for Job ${newService.jobId}`,
    });

    return newService;
  },

  async update(id: string, data: Partial<ServicePerformed>, actorName = 'Technician'): Promise<ServicePerformed> {
    const services = storage.getServices();
    const idx = services.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error(`Service ${id} not found`);

    const updated = { ...services[idx], ...data };
    services[idx] = updated;
    storage.saveServices(services);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Updated',
      module: 'Service',
      recordId: id,
      description: `Updated work record ${id}`,
    });

    return updated;
  },
};
