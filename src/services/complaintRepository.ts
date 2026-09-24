import { storage } from './storage';
import { Complaint } from '../types/complaint';
import { auditRepository } from './auditRepository';

export const complaintRepository = {
  async getAll(): Promise<Complaint[]> {
    return storage.getComplaints();
  },

  async getByJobId(jobId: string): Promise<Complaint[]> {
    return storage.getComplaints().filter((c) => c.jobId === jobId);
  },

  async create(data: Omit<Complaint, 'id'>, actorName = 'Service Advisor'): Promise<Complaint> {
    const complaints = storage.getComplaints();
    const newId = `CMP-${String(complaints.length + 1).padStart(6, '0')}`;
    const newComplaint: Complaint = {
      ...data,
      id: newId,
    };
    storage.saveComplaints([newComplaint, ...complaints]);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Created',
      module: 'Complaint',
      recordId: newComplaint.id,
      description: `Logged complaint "${newComplaint.complaint.substring(0, 40)}..." for Job ${newComplaint.jobId}`,
    });

    return newComplaint;
  },

  async update(id: string, data: Partial<Complaint>, actorName = 'Service Advisor'): Promise<Complaint> {
    const complaints = storage.getComplaints();
    const idx = complaints.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Complaint ${id} not found`);

    const updated = { ...complaints[idx], ...data };
    complaints[idx] = updated;
    storage.saveComplaints(complaints);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Updated',
      module: 'Complaint',
      recordId: id,
      description: `Updated complaint ${id}`,
    });

    return updated;
  },
};
