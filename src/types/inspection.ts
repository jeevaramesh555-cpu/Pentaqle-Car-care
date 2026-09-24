export type InspectionSeverity = 'Good' | 'Attention' | 'Urgent';
export type CustomerApprovalStatus = 'Not Required' | 'Pending' | 'Approved' | 'Declined';

export interface InspectionFinding {
  id: string; // INS-000001
  jobId: string;
  finding: string;
  category: string;
  severity: InspectionSeverity;
  technician: string;
  recommendation?: string;
  approvalStatus: CustomerApprovalStatus;
  notes?: string;
}
