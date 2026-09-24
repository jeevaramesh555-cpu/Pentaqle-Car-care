export type UserRole = 'Super Admin' | 'Admin' | 'Editor' | 'Viewer';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string; // USR-000001
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

export type PermissionAction =
  | 'view_dashboard'
  | 'view_customers'
  | 'manage_customers'
  | 'view_vehicles'
  | 'manage_vehicles'
  | 'view_jobs'
  | 'manage_jobs'
  | 'view_recommendations'
  | 'manage_recommendations'
  | 'view_reports'
  | 'export_reports'
  | 'manage_users'
  | 'manage_settings'
  | 'view_audit_logs';
