export type ServiceExecutionStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type ServiceStatus = ServiceExecutionStatus;

export interface ServicePerformed {
  id: string; // SRV-000001
  jobId: string;
  serviceName: string; // e.g. Engine Oil Change, Brake Service, Wheel Alignment, AC Disinfection
  category: string;
  technician: string;
  description?: string;
  status: ServiceExecutionStatus;
  completedDate?: string;
  notes?: string;
  // NOTE: Strictly no pricing fields in core workflow, as billing is decoupled
}
