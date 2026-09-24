export type JobCardStatus =
  | 'Open'
  | 'Inspection'
  | 'Waiting Approval'
  | 'In Progress'
  | 'Waiting Parts'
  | 'Ready'
  | 'Delivered'
  | 'Closed';

export type FuelLevel = 'Reserve' | '25%' | '50%' | '75%' | '100%';

export interface JobCard {
  id: string; // JOB-000001
  date: string; // Visit date YYYY-MM-DD
  customerId: string;
  vehicleId: string;
  odometer: number;
  fuelLevel: FuelLevel;
  assignedTechnician: string;
  serviceAdvisor: string;
  expectedCompletionDate?: string;
  internalNotes?: string;
  completionNotes?: string;
  status: JobCardStatus;
  createdAt: string;
  completedAt?: string;
}
