import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkshopSettings } from '../types/settings';
import { settingsRepository } from '../services/settingsRepository';
import { initialSettings } from '../mock';

interface SettingsContextType {
  settings: WorkshopSettings;
  updateSettings: (newSettings: WorkshopSettings) => Promise<void>;
  reloadSettings: () => Promise<void>;
  resetToDemoData: () => Promise<void>;
  isModuleEnabled: (moduleKey: keyof WorkshopSettings['modules']) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WorkshopSettings>(initialSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const s = await settingsRepository.getSettings();
      setSettings(s);
    } catch {
      setSettings(initialSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: WorkshopSettings) => {
    const updated = await settingsRepository.updateSettings(newSettings);
    setSettings(updated);
  };

  const resetToDemoData = async () => {
    await settingsRepository.resetToDemoData();
    await loadSettings();
  };

  const isModuleEnabled = (moduleKey: keyof WorkshopSettings['modules']): boolean => {
    return Boolean(settings.modules[moduleKey]);
  };

  if (loading) {
    return null;
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        reloadSettings: loadSettings,
        resetToDemoData,
        isModuleEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
