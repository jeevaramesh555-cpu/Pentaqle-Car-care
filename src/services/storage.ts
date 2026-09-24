import {
  initialCustomers,
  initialVehicles,
  initialJobCards,
  initialComplaints,
  initialInspectionFindings,
  initialServices,
  initialPartsUsed,
  initialRecommendations,
  initialUsers,
  initialSettings,
  initialAuditLogs,
} from '../mock';
import { Customer } from '../types/customer';
import { Vehicle } from '../types/vehicle';
import { JobCard } from '../types/jobCard';
import { Complaint } from '../types/complaint';
import { InspectionFinding } from '../types/inspection';
import { ServicePerformed } from '../types/service';
import { PartUsage } from '../types/part';
import { Recommendation } from '../types/recommendation';
import { User } from '../types/user';
import { WorkshopSettings } from '../types/settings';
import { AuditLogEntry } from '../types/audit';

export const APP_STORAGE_NAMESPACE = 'workshop_app_';

const STORAGE_KEYS = {
  CUSTOMERS: `${APP_STORAGE_NAMESPACE}customers`,
  VEHICLES: `${APP_STORAGE_NAMESPACE}vehicles`,
  JOB_CARDS: `${APP_STORAGE_NAMESPACE}job_cards`,
  COMPLAINTS: `${APP_STORAGE_NAMESPACE}complaints`,
  INSPECTIONS: `${APP_STORAGE_NAMESPACE}inspections`,
  SERVICES: `${APP_STORAGE_NAMESPACE}services`,
  PARTS: `${APP_STORAGE_NAMESPACE}parts`,
  RECOMMENDATIONS: `${APP_STORAGE_NAMESPACE}recommendations`,
  USERS: `${APP_STORAGE_NAMESPACE}users`,
  SETTINGS: `${APP_STORAGE_NAMESPACE}settings`,
  AUDIT: `${APP_STORAGE_NAMESPACE}audit`,
  INITIALIZED: `${APP_STORAGE_NAMESPACE}initialized_v2`,
};

// Memory fallback in case localStorage is unavailable in iframe sandbox
const memoryStore: Record<string, string> = {};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(key) ?? memoryStore[key];
    if (val) {
      return JSON.parse(val) as T;
    }
  } catch {
    const val = memoryStore[key];
    if (val) {
      return JSON.parse(val) as T;
    }
  }
  return defaultValue;
}

function setItem<T>(key: string, value: T): void {
  const serialized = JSON.stringify(value);
  try {
    localStorage.setItem(key, serialized);
  } catch {
    // ignore quota/security errors
  }
  memoryStore[key] = serialized;
}

export function initStorage(forceReset = false): void {
  const initialized = getItem<boolean>(STORAGE_KEYS.INITIALIZED, false);

  if (!initialized || forceReset) {
    setItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
    setItem(STORAGE_KEYS.VEHICLES, initialVehicles);
    setItem(STORAGE_KEYS.JOB_CARDS, initialJobCards);
    setItem(STORAGE_KEYS.COMPLAINTS, initialComplaints);
    setItem(STORAGE_KEYS.INSPECTIONS, initialInspectionFindings);
    setItem(STORAGE_KEYS.SERVICES, initialServices);
    setItem(STORAGE_KEYS.PARTS, initialPartsUsed);
    setItem(STORAGE_KEYS.RECOMMENDATIONS, initialRecommendations);
    setItem(STORAGE_KEYS.USERS, initialUsers);
    setItem(STORAGE_KEYS.SETTINGS, initialSettings);
    setItem(STORAGE_KEYS.AUDIT, initialAuditLogs);
    setItem(STORAGE_KEYS.INITIALIZED, true);
  }
}

// Ensure storage initialized on module load
initStorage();

export const storage = {
  getCustomers: (): Customer[] => getItem(STORAGE_KEYS.CUSTOMERS, initialCustomers),
  saveCustomers: (data: Customer[]) => setItem(STORAGE_KEYS.CUSTOMERS, data),

  getVehicles: (): Vehicle[] => getItem(STORAGE_KEYS.VEHICLES, initialVehicles),
  saveVehicles: (data: Vehicle[]) => setItem(STORAGE_KEYS.VEHICLES, data),

  getJobCards: (): JobCard[] => getItem(STORAGE_KEYS.JOB_CARDS, initialJobCards),
  saveJobCards: (data: JobCard[]) => setItem(STORAGE_KEYS.JOB_CARDS, data),

  getComplaints: (): Complaint[] => getItem(STORAGE_KEYS.COMPLAINTS, initialComplaints),
  saveComplaints: (data: Complaint[]) => setItem(STORAGE_KEYS.COMPLAINTS, data),

  getInspections: (): InspectionFinding[] => getItem(STORAGE_KEYS.INSPECTIONS, initialInspectionFindings),
  saveInspections: (data: InspectionFinding[]) => setItem(STORAGE_KEYS.INSPECTIONS, data),

  getServices: (): ServicePerformed[] => getItem(STORAGE_KEYS.SERVICES, initialServices),
  saveServices: (data: ServicePerformed[]) => setItem(STORAGE_KEYS.SERVICES, data),

  getParts: (): PartUsage[] => getItem(STORAGE_KEYS.PARTS, initialPartsUsed),
  saveParts: (data: PartUsage[]) => setItem(STORAGE_KEYS.PARTS, data),

  getRecommendations: (): Recommendation[] => getItem(STORAGE_KEYS.RECOMMENDATIONS, initialRecommendations),
  saveRecommendations: (data: Recommendation[]) => setItem(STORAGE_KEYS.RECOMMENDATIONS, data),

  getUsers: (): User[] => getItem(STORAGE_KEYS.USERS, initialUsers),
  saveUsers: (data: User[]) => setItem(STORAGE_KEYS.USERS, data),

  getSettings: (): WorkshopSettings => getItem(STORAGE_KEYS.SETTINGS, initialSettings),
  saveSettings: (data: WorkshopSettings) => setItem(STORAGE_KEYS.SETTINGS, data),

  getAuditLogs: (): AuditLogEntry[] => getItem(STORAGE_KEYS.AUDIT, initialAuditLogs),
  saveAuditLogs: (data: AuditLogEntry[]) => setItem(STORAGE_KEYS.AUDIT, data),

  resetAllData: () => initStorage(true),
};
