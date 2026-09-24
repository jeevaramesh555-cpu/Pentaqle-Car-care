import { storage } from './storage';
import { Recommendation } from '../types/recommendation';
import { auditRepository } from './auditRepository';

export const recommendationRepository = {
  async getAll(): Promise<Recommendation[]> {
    return storage.getRecommendations();
  },

  async getByVehicleId(vehicleId: string): Promise<Recommendation[]> {
    return storage
      .getRecommendations()
      .filter((r) => r.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.recommendedDate).getTime() - new Date(a.recommendedDate).getTime());
  },

  async getPendingByVehicleId(vehicleId: string): Promise<Recommendation[]> {
    return storage
      .getRecommendations()
      .filter((r) => r.vehicleId === vehicleId && r.status === 'Pending');
  },

  async getByJobId(jobId: string): Promise<Recommendation[]> {
    return storage.getRecommendations().filter((r) => r.jobId === jobId);
  },

  async create(data: Omit<Recommendation, 'id'>, actorName = 'Service Advisor'): Promise<Recommendation> {
    const recs = storage.getRecommendations();
    const newId = `REC-${String(recs.length + 1).padStart(6, '0')}`;
    const newRec: Recommendation = {
      ...data,
      id: newId,
    };
    storage.saveRecommendations([newRec, ...recs]);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Created',
      module: 'Recommendation',
      recordId: newRec.id,
      description: `Added recommendation: "${newRec.recommendation.substring(0, 45)}..." for Vehicle ${newRec.vehicleId}`,
    });

    return newRec;
  },

  async update(id: string, data: Partial<Recommendation>, actorName = 'Service Advisor'): Promise<Recommendation> {
    const recs = storage.getRecommendations();
    const idx = recs.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`Recommendation ${id} not found`);

    const updated = { ...recs[idx], ...data };
    recs[idx] = updated;
    storage.saveRecommendations(recs);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Updated',
      module: 'Recommendation',
      recordId: id,
      description: `Updated recommendation status to ${updated.status}`,
    });

    return updated;
  },

  async resolve(id: string, resolvedInJobId: string, resolutionNotes?: string, actorName = 'Service Advisor'): Promise<Recommendation> {
    return this.update(
      id,
      {
        status: 'Completed',
        resolvedInJobId,
        resolutionNotes,
      },
      actorName
    );
  },
};
