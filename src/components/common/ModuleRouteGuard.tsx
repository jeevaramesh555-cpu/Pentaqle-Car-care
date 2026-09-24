import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { WorkshopSettings } from '../../types/settings';
import { AccessRestricted } from './AccessRestricted';

interface ModuleRouteGuardProps {
  moduleKey: keyof WorkshopSettings['modules'];
  children: React.ReactElement;
  redirectTo?: string;
}

export const ModuleRouteGuard: React.FC<ModuleRouteGuardProps> = ({
  moduleKey,
  children,
  redirectTo,
}) => {
  const { isModuleEnabled } = useSettings();

  if (!isModuleEnabled(moduleKey)) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return (
      <AccessRestricted
        title="Module Disabled"
        message={`The "${String(moduleKey)}" module is not enabled for this workshop deployment. It can be configured in Workshop Settings.`}
      />
    );
  }

  return children;
};
