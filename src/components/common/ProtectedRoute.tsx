import React from 'react';
import { PermissionAction } from '../../types/user';
import { useAuth } from '../../context/AuthContext';
import { AccessRestricted } from './AccessRestricted';

interface ProtectedRouteProps {
  action: PermissionAction;
  children: React.ReactElement;
  fallback?: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  action,
  children,
  fallback = <AccessRestricted />,
}) => {
  const { can } = useAuth();

  if (!can(action)) {
    return fallback;
  }

  return children;
};
