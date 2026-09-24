export type CustomerStatus = 'Active' | 'Inactive' | 'Archived';

export interface Customer {
  id: string; // e.g. CUS-000001
  name: string;
  mobile: string;
  alternateMobile?: string;
  email?: string;
  address?: string;
  city: string;
  notes?: string;
  createdAt: string;
  status: CustomerStatus;
}
