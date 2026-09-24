import { storage } from './storage';
import { Customer } from '../types/customer';
import { auditRepository } from './auditRepository';

export const customerRepository = {
  async getAll(): Promise<Customer[]> {
    return storage.getCustomers();
  },

  async getById(id: string): Promise<Customer | undefined> {
    const customers = storage.getCustomers();
    return customers.find((c) => c.id === id);
  },

  async search(query: string): Promise<Customer[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();
    const customers = storage.getCustomers();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        (c.alternateMobile && c.alternateMobile.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        c.city.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  },

  async create(data: Omit<Customer, 'id' | 'createdAt'>, actorName = 'Service Advisor'): Promise<Customer> {
    const customers = storage.getCustomers();
    const settings = storage.getSettings();
    const nextNum = customers.length + 1;
    const newId = `${settings.customerPrefix || 'CUS-'}${String(nextNum).padStart(6, '0')}`;
    const newCustomer: Customer = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    storage.saveCustomers([newCustomer, ...customers]);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Created',
      module: 'Customer',
      recordId: newCustomer.id,
      description: `Registered new customer ${newCustomer.name} (${newCustomer.mobile})`,
    });

    return newCustomer;
  },

  async update(id: string, data: Partial<Customer>, actorName = 'Service Advisor'): Promise<Customer> {
    const customers = storage.getCustomers();
    const idx = customers.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Customer with ID ${id} not found`);

    const updated = { ...customers[idx], ...data };
    customers[idx] = updated;
    storage.saveCustomers(customers);

    await auditRepository.log({
      userId: 'USR-CURRENT',
      userName: actorName,
      action: 'Updated',
      module: 'Customer',
      recordId: id,
      description: `Updated customer profile for ${updated.name}`,
    });

    return updated;
  },

  async archive(id: string, actorName = 'Service Advisor'): Promise<Customer> {
    return this.update(id, { status: 'Archived' }, actorName);
  },

  async restore(id: string, actorName = 'Service Advisor'): Promise<Customer> {
    return this.update(id, { status: 'Active' }, actorName);
  },
};
