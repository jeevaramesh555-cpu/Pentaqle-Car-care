import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { WorkshopSettings } from '../../types/settings';

interface ModuleGuardProps {
  moduleKey: keyof WorkshopSettings['modules'];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({ moduleKey, fallback = null, children }) => {
  const { isModuleEnabled } = useSettings();
  if (!isModuleEnabled(moduleKey)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};
