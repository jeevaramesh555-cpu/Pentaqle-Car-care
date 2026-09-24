import { storage } from './storage';
import { Customer } from '../types/customer';
import { Vehicle } from '../types/vehicle';
import { JobCard } from '../types/jobCard';
import { formatIndianRegNumber } from '../utils/formatters';

export interface SearchResults {
  customers: Array<Customer & { visitCount: number }>;
  vehicles: Array<Vehicle & { customerName: string; lastVisitDate?: string }>;
  jobCards: Array<JobCard & { regNumber: string; customerName: string; model: string }>;
}

export const searchService = {
  async executeSearch(rawQuery: string): Promise<SearchResults> {
    const q = rawQuery.trim().toLowerCase();
    if (!q) {
      return { customers: [], vehicles: [], jobCards: [] };
    }

    const cleanQ = q.replace(/[^a-z0-9]/g, '');

    const customers = storage.getCustomers();
    const vehicles = storage.getVehicles();
    const jobCards = storage.getJobCards();

    // 1. Search Customers
    const matchedCustomers = customers.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(q);
      const mobileMatch = c.mobile.replace(/[^0-9]/g, '').includes(cleanQ);
      const altMatch = c.alternateMobile ? c.alternateMobile.replace(/[^0-9]/g, '').includes(cleanQ) : false;
      const emailMatch = c.email ? c.email.toLowerCase().includes(q) : false;
      const idMatch = c.id.toLowerCase().includes(q);
      return nameMatch || mobileMatch || altMatch || emailMatch || idMatch;
    });

    const enrichedCustomers = matchedCustomers.map((c) => {
      const visitCount = jobCards.filter((j) => j.customerId === c.id).length;
      return { ...c, visitCount };
    });

    // 2. Search Vehicles
    const matchedVehicles = vehicles.filter((v) => {
      const cleanReg = v.registrationNumber.replace(/[^a-z0-9]/g, '').toLowerCase();
      const regMatch = cleanReg.includes(cleanQ) || v.registrationNumber.toLowerCase().includes(q);
      const makeMatch = v.make.toLowerCase().includes(q);
      const modelMatch = v.model.toLowerCase().includes(q);
      const vinMatch = v.vin ? v.vin.toLowerCase().includes(q) : false;
      const engMatch = v.engineNumber ? v.engineNumber.toLowerCase().includes(q) : false;
      const idMatch = v.id.toLowerCase().includes(q);
      return regMatch || makeMatch || modelMatch || vinMatch || engMatch || idMatch;
    });

    const enrichedVehicles = matchedVehicles.map((v) => {
      const customer = customers.find((c) => c.id === v.customerId);
      const vJobs = jobCards
        .filter((j) => j.vehicleId === v.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return {
        ...v,
        customerName: customer ? customer.name : 'Unknown Owner',
        lastVisitDate: vJobs.length > 0 ? vJobs[0].date : undefined,
      };
    });

    // 3. Search Job Cards
    const matchedJobCards = jobCards.filter((j) => {
      const idMatch = j.id.toLowerCase().includes(q);
      const cust = customers.find((c) => c.id === j.customerId);
      const veh = vehicles.find((v) => v.id === j.vehicleId);

      const custMatch = cust ? cust.name.toLowerCase().includes(q) || cust.mobile.includes(q) : false;
      const vehRegMatch = veh
        ? veh.registrationNumber.replace(/[^a-z0-9]/g, '').toLowerCase().includes(cleanQ) ||
          veh.registrationNumber.toLowerCase().includes(q)
        : false;
      const vehModelMatch = veh ? veh.model.toLowerCase().includes(q) : false;

      return idMatch || custMatch || vehRegMatch || vehModelMatch;
    });

    const enrichedJobCards = matchedJobCards.map((j) => {
      const cust = customers.find((c) => c.id === j.customerId);
      const veh = vehicles.find((v) => v.id === j.vehicleId);
      return {
        ...j,
        regNumber: veh ? formatIndianRegNumber(veh.registrationNumber) : 'Unknown',
        model: veh ? `${veh.make} ${veh.model}` : 'Unknown',
        customerName: cust ? cust.name : 'Unknown',
      };
    });

    return {
      customers: enrichedCustomers.slice(0, 10),
      vehicles: enrichedVehicles.slice(0, 10),
      jobCards: enrichedJobCards.slice(0, 10),
    };
  },
};
