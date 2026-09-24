export type ReportType =
  | 'service_history'
  | 'vehicle_visits'
  | 'customer_visits'
  | 'parts_replacement'
  | 'service_frequency'
  | 'technician_work'
  | 'pending_recommendations'
  | 'repeat_complaints';

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  vehicleId?: string;
  customerId?: string;
  technician?: string;
  status?: string;
  serviceCategory?: string;
}
