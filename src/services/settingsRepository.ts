import { storage } from './storage';
import { WorkshopSettings } from '../types/settings';
import { auditRepository } from './auditRepository';

export const settingsRepository = {
  async getSettings(): Promise<WorkshopSettings> {
    return storage.getSettings();
  },

  async updateSettings(settings: WorkshopSettings, actorName = 'System Admin'): Promise<WorkshopSettings> {
    storage.saveSettings(settings);
    await auditRepository.log({
      userId: 'USR-000001',
      userName: actorName,
      action: 'Settings Changed',
      module: 'Settings',
      recordId: 'SETTINGS',
      description: `Updated workshop settings: ${settings.workshopName}`,
    });
    return settings;
  },

  async resetToDemoData(): Promise<void> {
    storage.resetAllData();
  },
};
