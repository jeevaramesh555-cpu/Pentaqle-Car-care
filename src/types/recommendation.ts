export type RecommendationPriority = 'Low' | 'Medium' | 'High' | 'Immediate';
export type RecommendationStatus = 'Pending' | 'Completed' | 'Declined' | 'No Longer Required';

export interface Recommendation {
  id: string; // REC-000001
  jobId: string;
  vehicleId: string;
  recommendation: string; // e.g. "Brake discs showing deep grooves, skim or replace next service"
  priority: RecommendationPriority;
  recommendedAtKm: number;
  recommendedNextKm?: number;
  recommendedDate: string;
  status: RecommendationStatus;
  resolutionNotes?: string;
  resolvedInJobId?: string;
  notes?: string;
}
