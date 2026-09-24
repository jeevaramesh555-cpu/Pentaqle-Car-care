import { storage } from './storage';
import { PartUsage } from '../types/part';
import { auditRepository } from './auditRepository';

export const partRepository = {
  async getAll(): Promise<PartUsage[]> {
    return storage.getParts();
  },

  async getByJobId(jobId: string): Promise<PartUsage[]> {
    return storage.getParts().filter((p) => p.jobId === jobId);
  },

  async getByVehicleId(vehicleId: string): Promise<PartUsage[]> {
    return storage
      .getParts()
      .filter((p) => p.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.replacementDate).getTime() - new Date(a.replacementDate).getTime());
  },

  async create(data: Omit<PartUsage, 'id'>, actorName = 'Technician'): Promise<PartUsage> {
    const parts = storage.getParts();
    const newId = `PRT-${String(parts.length + 1).padStart(6, '0')}`;
    const newPart: PartUsage = {
      ...data,
      id: newId,
    };
    storage.saveParts([newPart, ...parts]);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Created',
      module: 'Part',
      recordId: newPart.id,
      description: `Recorded part action: ${newPart.action} ${newPart.partName} (${newPart.brand}) on Job ${newPart.jobId}`,
    });

    return newPart;
  },

  async update(id: string, data: Partial<PartUsage>, actorName = 'Technician'): Promise<PartUsage> {
    const parts = storage.getParts();
    const idx = parts.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Part usage record ${id} not found`);

    const updated = { ...parts[idx], ...data };
    parts[idx] = updated;
    storage.saveParts(parts);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Updated',
      module: 'Part',
      recordId: id,
      description: `Updated part usage record ${id}`,
    });

    return updated;
  },
};
