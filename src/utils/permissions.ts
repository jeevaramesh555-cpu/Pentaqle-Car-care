import { UserRole, PermissionAction } from '../types/user';

const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  'Super Admin': [
    'view_dashboard',
    'view_customers',
    'manage_customers',
    'view_vehicles',
    'manage_vehicles',
    'view_jobs',
    'manage_jobs',
    'view_recommendations',
    'manage_recommendations',
    'view_reports',
    'export_reports',
    'manage_users',
    'manage_settings',
    'view_audit_logs',
  ],
  Admin: [
    'view_dashboard',
    'view_customers',
    'manage_customers',
    'view_vehicles',
    'manage_vehicles',
    'view_jobs',
    'manage_jobs',
    'view_recommendations',
    'manage_recommendations',
    'view_reports',
    'export_reports',
    'view_audit_logs',
  ],
  Editor: [
    'view_dashboard',
    'view_customers',
    'manage_customers',
    'view_vehicles',
    'manage_vehicles',
    'view_jobs',
    'manage_jobs',
    'view_recommendations',
    'manage_recommendations',
    'view_reports',
  ],
  Viewer: [
    'view_dashboard',
    'view_customers',
    'view_vehicles',
    'view_jobs',
    'view_recommendations',
    'view_reports',
  ],
};

export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(action);
}

export function canEditRecords(role: UserRole): boolean {
  return role === 'Super Admin' || role === 'Admin' || role === 'Editor';
}

export function canManageSettings(role: UserRole): boolean {
  return role === 'Super Admin';
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'Super Admin';
}
