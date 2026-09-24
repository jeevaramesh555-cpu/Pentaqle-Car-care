import { storage } from './storage';
import { InspectionFinding } from '../types/inspection';
import { auditRepository } from './auditRepository';

export const inspectionRepository = {
  async getAll(): Promise<InspectionFinding[]> {
    return storage.getInspections();
  },

  async getByJobId(jobId: string): Promise<InspectionFinding[]> {
    return storage.getInspections().filter((i) => i.jobId === jobId);
  },

  async create(data: Omit<InspectionFinding, 'id'>, actorName = 'Technician'): Promise<InspectionFinding> {
    const inspections = storage.getInspections();
    const newId = `INS-${String(inspections.length + 1).padStart(6, '0')}`;
    const newInspection: InspectionFinding = {
      ...data,
      id: newId,
    };
    storage.saveInspections([newInspection, ...inspections]);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Created',
      module: 'Inspection',
      recordId: newInspection.id,
      description: `Recorded inspection finding: ${newInspection.finding.substring(0, 45)}...`,
    });

    return newInspection;
  },

  async update(id: string, data: Partial<InspectionFinding>, actorName = 'Technician'): Promise<InspectionFinding> {
    const inspections = storage.getInspections();
    const idx = inspections.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error(`Inspection finding ${id} not found`);

    const updated = { ...inspections[idx], ...data };
    inspections[idx] = updated;
    storage.saveInspections(inspections);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Updated',
      module: 'Inspection',
      recordId: id,
      description: `Updated inspection finding ${id}`,
    });

    return updated;
  },
};
