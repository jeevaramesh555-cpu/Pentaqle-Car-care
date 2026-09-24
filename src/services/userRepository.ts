import { storage } from './storage';
import { User, UserRole, UserStatus } from '../types/user';
import { auditRepository } from './auditRepository';

export const userRepository = {
  async getAll(): Promise<User[]> {
    return storage.getUsers();
  },

  async getById(id: string): Promise<User | undefined> {
    return storage.getUsers().find((u) => u.id === id);
  },

  async create(data: Omit<User, 'id' | 'createdAt'>, actorName = 'Super Admin'): Promise<User> {
    const users = storage.getUsers();
    const newId = `USR-${String(users.length + 1).padStart(6, '0')}`;
    const newUser: User = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    storage.saveUsers([...users, newUser]);

    await auditRepository.log({
      userId: 'USR-000001',
      userName: actorName,
      action: 'Created',
      module: 'User',
      recordId: newUser.id,
      description: `Created user ${newUser.name} with role ${newUser.role}`,
    });

    return newUser;
  },

  async update(id: string, data: Partial<User>, actorName = 'Super Admin'): Promise<User> {
    const users = storage.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error(`User ${id} not found`);

    const updated = { ...users[idx], ...data };
    users[idx] = updated;
    storage.saveUsers(users);

    await auditRepository.log({
      userId: 'USR-000001',
      userName: actorName,
      action: 'Updated',
      module: 'User',
      recordId: id,
      description: `Updated profile for user ${updated.name}`,
    });

    return updated;
  },
};
