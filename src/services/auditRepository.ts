import { storage } from './storage';
import { AuditLogEntry } from '../types/audit';

export const auditRepository = {
  async getAll(): Promise<AuditLogEntry[]> {
    const logs = storage.getAuditLogs();
    return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
    const logs = storage.getAuditLogs();
    const newId = `AUD-${String(logs.length + 1).padStart(6, '0')}`;
    const newEntry: AuditLogEntry = {
      ...entry,
      id: newId,
      timestamp: new Date().toISOString(),
    };
    storage.saveAuditLogs([newEntry, ...logs]);
    return newEntry;
  },
};
