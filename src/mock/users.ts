import { User } from '../types/user';

export const initialUsers: User[] = [
  {
    id: 'USR-000001',
    name: 'Arjun Verma',
    email: 'arjun@autoclinic.in',
    phone: '+91 98450 10001',
    role: 'Super Admin',
    status: 'Active',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'USR-000002',
    name: 'Senthil Kumar',
    email: 'senthil@autoclinic.in',
    phone: '+91 98450 10002',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'USR-000003',
    name: 'Ravi Shankar',
    email: 'ravi@autoclinic.in',
    phone: '+91 98450 10003',
    role: 'Editor',
    status: 'Active',
    createdAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'USR-000004',
    name: 'Imran Khan',
    email: 'imran@autoclinic.in',
    phone: '+91 98450 10004',
    role: 'Editor',
    status: 'Active',
    createdAt: '2024-02-15T09:00:00Z',
  },
  {
    id: 'USR-000005',
    name: 'Meera Nambiar',
    email: 'meera@autoclinic.in',
    phone: '+91 98450 10005',
    role: 'Viewer',
    status: 'Active',
    createdAt: '2024-03-01T09:00:00Z',
  },
];
