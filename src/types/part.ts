export type PartAction =
  | 'Replaced'
  | 'Repaired'
  | 'Cleaned'
  | 'Adjusted'
  | 'Refitted'
  | 'Inspected';

export interface PartUsage {
  id: string; // PRT-000001
  jobId: string;
  vehicleId: string;
  partName: string; // e.g. Front Brake Pad Set
  brand: string; // e.g. Bosch, OEM Toyota, Denso
  partNumber?: string;
  quantity: number;
  action: PartAction;
  odometerAtReplacement: number; // km
  replacementDate: string; // YYYY-MM-DD
  warrantyNotes?: string; // e.g. 1 Year / 20,000 km
  notes?: string;
}
