import React from 'react';
import { PermissionAction } from '../../types/user';
import { useAuth } from '../../context/AuthContext';

interface PermissionGuardProps {
  action: PermissionAction;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ action, fallback = null, children }) => {
  const { can } = useAuth();
  if (!can(action)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
