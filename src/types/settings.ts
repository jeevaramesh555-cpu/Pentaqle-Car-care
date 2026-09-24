export interface ModuleSettings {
  coreWorkshop: boolean; // always true
  billing: boolean; // default false
  inventory: boolean; // default false
  payments: boolean; // default false
  expenses: boolean; // default false
  whatsAppNotifications: boolean; // default false
  serviceReminders: boolean; // default false
  customerPortal: boolean; // default false
}

export interface WorkshopSettings {
  workshopName: string;
  tagline: string;
  logoUrl?: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  phone: string;
  whatsApp: string;
  email: string;
  gstin?: string;
  website?: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  jobCardPrefix: string;
  customerPrefix: string;
  vehiclePrefix: string;
  modules: ModuleSettings;
}
