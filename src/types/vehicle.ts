export type VehicleStatus = 'Active' | 'Inactive' | 'Archived';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
export type TransmissionType = 'Manual' | 'Automatic' | 'AMT' | 'IMT' | 'CVT' | 'DCT';

export interface Vehicle {
  id: string; // e.g. VEH-000001
  customerId: string; // Foreign key to Customer
  registrationNumber: string; // e.g. KA-01-MJ-4821
  make: string; // e.g. Toyota
  model: string; // e.g. Innova Crysta
  variant?: string; // e.g. 2.4 VX
  year: number; // e.g. 2021
  fuelType: FuelType;
  transmission: TransmissionType;
  vin?: string; // Chassis No
  engineNumber?: string;
  color?: string;
  currentOdometer: number; // in km
  insuranceExpiry?: string;
  notes?: string;
  createdAt: string;
  status: VehicleStatus;
}
