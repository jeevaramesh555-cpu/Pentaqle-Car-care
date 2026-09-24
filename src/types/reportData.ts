export interface ServiceHistoryReportRow {
  serviceId: string;
  serviceName: string;
  category: string;
  technician: string;
  status: string;
  date: string;
  jobId: string;
  regNumber: string;
  vehicleModel: string;
  customerName: string;
  odometer: number;
}

export interface VehicleVisitsReportRow {
  jobId: string;
  date: string;
  regNumber: string;
  vehicleModel: string;
  customerName: string;
  customerMobile: string;
  odometer: number;
  status: string;
  serviceAdvisor: string;
  technician?: string;
}

export interface PartsReplacementReportRow {
  partId: string;
  partName: string;
  brand: string;
  partNumber: string;
  quantity: number;
  action: string;
  date: string;
  odometer: number;
  regNumber: string;
  vehicleModel: string;
  jobId: string;
  warranty: string;
}

export interface RepeatComplaintsReportRow {
  complaintId: string;
  complaint: string;
  category: string;
  priority: string;
  status: string;
  currentJobId: string;
  currentDate: string;
  currentOdometer: number;
  previousJobId: string;
  previousDate: string;
  previousOdometer: number;
  regNumber: string;
  vehicleModel: string;
  customerName: string;
  technicianNotes: string;
}

export interface PendingRecommendationsReportRow {
  recId: string;
  recommendation: string;
  priority: string;
  recommendedDate: string;
  recommendedAtKm: number;
  recommendedNextKm?: number;
  currentOdometer: number;
  regNumber: string;
  vehicleModel: string;
  customerName: string;
  customerPhone: string;
  jobId: string;
}

export interface TechnicianWorkReportRow {
  technician: string;
  totalJobs: number;
  completed: number;
  inProgress: number;
}

export type ReportRow =
  | ServiceHistoryReportRow
  | VehicleVisitsReportRow
  | PartsReplacementReportRow
  | RepeatComplaintsReportRow
  | PendingRecommendationsReportRow
  | TechnicianWorkReportRow;
