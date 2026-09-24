export interface AuditLogEntry {
  id: string; // AUD-000001
  timestamp: string; // ISO string
  userId: string;
  userName: string;
  action: string; // 'Created', 'Updated', 'Status Change', 'Archived', 'Settings Changed'
  module: 'Customer' | 'Vehicle' | 'Job Card' | 'Complaint' | 'Inspection' | 'Service' | 'Part' | 'Recommendation' | 'Settings' | 'User';
  recordId: string;
  description: string;
}
