import React, { useState, useEffect } from 'react';
import { UserCog, Plus, ShieldCheck, UserCheck, X } from 'lucide-react';
import { userRepository } from '../../services/userRepository';
import { User, UserRole, UserStatus } from '../../types/user';
import { PageHeader } from '../../components/common/PageHeader';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useSettings } from '../../context/SettingsContext';

export const UsersPage: React.FC = () => {
  const { can, currentUser, refreshUsers } = useAuth();
  const { notify } = useNotification();
  const { settings } = useSettings();

  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [role, setRole] = useState<UserRole>('Editor');

  const loadData = async () => {
    const list = await userRepository.getAll();
    setUsers(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      await userRepository.create(
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role,
          status: 'Active',
        },
        currentUser.name
      );
      notify(`User ${name} added successfully!`);
      setIsModalOpen(false);
      setName('');
      setEmail('');
      loadData();
      refreshUsers();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleStatusToggle = async (user: User) => {
    const newStatus: UserStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    await userRepository.update(user.id, { status: newStatus }, currentUser.name);
    notify(`User ${user.name} is now ${newStatus}`);
    loadData();
    refreshUsers();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Role-Based Access"
        subtitle="Manage workshop staff credentials and operational role boundaries"
        badge={
          <span className="text-xs font-mono font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
            {users.length} Staff Accounts
          </span>
        }
        actions={
          can('manage_users') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          )
        }
      />

      {/* Staff User Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Registered Workshop Personnel
          </h3>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm divide-y divide-neutral-200">
            <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Staff Name</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Registered On</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                {can('manage_users') && <th className="px-6 py-3.5 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/70">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">{u.name}</div>
                        <div className="text-xs font-mono text-neutral-400">{u.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-xs">
                    <div className="font-mono text-neutral-800">{u.phone}</div>
                    <div className="text-neutral-400">{u.email}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs text-neutral-500">
                    {formatDate(u.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  {can('manage_users') && (
                    <td className="px-6 py-4 text-right">
                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => handleStatusToggle(u)}
                          className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 underline"
                        >
                          {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (Uncongested) */}
        <div className="md:hidden divide-y divide-neutral-100">
          {users.map((u) => (
            <div key={u.id} className="p-4 space-y-2.5 hover:bg-neutral-50/70 transition-colors text-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {u.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-neutral-900 text-sm truncate">{u.name}</div>
                    <div className="text-[11px] font-mono text-neutral-400">{u.id}</div>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                    u.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                  }`}
                >
                  {u.status}
                </span>
              </div>

              <div className="space-y-1 text-neutral-600 pt-0.5">
                <div className="font-mono text-neutral-800">{u.phone}</div>
                <div className="text-neutral-400 truncate">{u.email}</div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                  <ShieldCheck className="w-3 h-3 text-neutral-600" />
                  {u.role}
                </span>

                {can('manage_users') && u.id !== currentUser.id && (
                  <button
                    onClick={() => handleStatusToggle(u)}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 underline ml-auto"
                  >
                    {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Capabilities Reference Matrix */}
      <div className="p-5 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Role Permission Matrix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="font-bold text-neutral-900 block mb-1">Super Admin</span>
            <p className="text-neutral-500">
              Full control over all modules, staff user management, workshop company settings, audit logs, and data exports.
            </p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="font-bold text-neutral-900 block mb-1">Admin</span>
            <p className="text-neutral-500">
              Operational management of customers, vehicles, job cards, services performed, parts, recommendations, and audit logs.
            </p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="font-bold text-neutral-900 block mb-1">Editor</span>
            <p className="text-neutral-500">
              Floor technician and advisor access: create & edit job cards, log complaints, record inspections and part replacements.
            </p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <span className="font-bold text-neutral-900 block mb-1">Viewer</span>
            <p className="text-neutral-500">
              Read-only inspection of vehicle profiles, service history logs, and operational reports. Cannot edit records.
            </p>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border border-neutral-200 p-4 sm:p-6 space-y-4 max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">Add Staff Account</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sunil Rao"
                  className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`staff@${settings.email.split('@')[1] || 'workshop.com'}`}
                  className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-neutral-900"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-3.5 py-2 font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors text-center"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
