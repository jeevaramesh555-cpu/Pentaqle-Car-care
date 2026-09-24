export type ComplaintCategory =
  | 'Engine'
  | 'Brakes'
  | 'Suspension'
  | 'Electrical'
  | 'Air Conditioning'
  | 'Transmission & Clutch'
  | 'Steering'
  | 'Body & Trim'
  | 'General / Periodic';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus = 'Reported' | 'Diagnosed' | 'Resolved' | 'Customer Deferred';

export interface Complaint {
  id: string; // CMP-000001
  jobId: string;
  complaint: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  technicianNotes?: string;
  relatedPreviousJobId?: string; // e.g. JOB-000124 to trace repeat complaints
}
