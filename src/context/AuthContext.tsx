import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PermissionAction } from '../types/user';
import { userRepository } from '../services/userRepository';
import { hasPermission } from '../utils/permissions';

interface AuthContextType {
  currentUser: User;
  users: User[];
  setCurrentUserRole: (role: UserRole) => void;
  can: (action: PermissionAction) => boolean;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'USR-000001',
    name: 'Workshop Administrator',
    email: 'admin@workshop.internal',
    phone: '+91 98450 10001',
    role: 'Super Admin',
    status: 'Active',
    createdAt: '2024-01-10T09:00:00Z',
  });

  const loadUsers = async () => {
    const list = await userRepository.getAll();
    setUsers(list);
    const active = list.find((u) => u.id === currentUser.id) || list[0];
    if (active) {
      setCurrentUser(active);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
    }));
  };

  const can = (action: PermissionAction): boolean => {
    return hasPermission(currentUser.role, action);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUserRole,
        can,
        refreshUsers: loadUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
