import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  AlertTriangle,
  FileSpreadsheet,
  UserCog,
  History,
  Settings,
  Receipt,
  Boxes,
  BellRing,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { PermissionAction } from '../../types/user';
import { WorkshopSettings } from '../../types/settings';

interface SidebarProps {
  onCloseMobile?: () => void;
}

interface NavItem {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: PermissionAction;
  moduleKey?: keyof WorkshopSettings['modules'];
}

interface NavSection {
  title: string | null;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { settings, isModuleEnabled } = useSettings();
  const { can } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors group ${
      isActive
        ? 'bg-neutral-900 text-white font-semibold shadow-xs'
        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
    }`;

  const navSections: NavSection[] = [
    {
      title: null,
      items: [
        { name: 'Dashboard', to: '/', icon: LayoutDashboard, permission: 'view_dashboard' },
      ],
    },
    {
      title: 'Workshop',
      items: [
        { name: 'Customers', to: '/customers', icon: Users, permission: 'view_customers' },
        { name: 'Vehicles', to: '/vehicles', icon: Car, permission: 'view_vehicles' },
        { name: 'Job Cards', to: '/jobs', icon: ClipboardList, permission: 'view_jobs' },
      ],
    },
    {
      title: 'Operations',
      items: [
        { name: 'Recommendations', to: '/recommendations', icon: AlertTriangle, permission: 'view_recommendations' },
        { name: 'Service Reminders', to: '/reminders', icon: BellRing, permission: 'view_vehicles', moduleKey: 'serviceReminders' },
      ],
    },
    {
      title: 'Insights',
      items: [
        { name: 'Reports', to: '/reports', icon: FileSpreadsheet, permission: 'view_reports' },
      ],
    },
    {
      title: 'Commercial & Spares',
      items: [
        { name: 'Billing', to: '/billing', icon: Receipt, permission: 'view_dashboard', moduleKey: 'billing' },
        { name: 'Inventory', to: '/inventory', icon: Boxes, permission: 'view_dashboard', moduleKey: 'inventory' },
      ],
    },
    {
      title: 'Administration',
      items: [
        { name: 'Users & Access', to: '/users', icon: UserCog, permission: 'manage_users' },
        { name: 'Audit Log', to: '/audit', icon: History, permission: 'view_audit_logs' },
        { name: 'Workshop Settings', to: '/settings', icon: Settings, permission: 'manage_settings' },
      ],
    },
  ];

  // Filter sections and items based on permissions and enabled modules
  const visibleSections = navSections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => {
        if (!can(item.permission)) return false;
        if (item.moduleKey && !isModuleEnabled(item.moduleKey)) return false;
        return true;
      }),
    }))
    .filter((sec) => sec.items.length > 0);

  return (
    <aside className="w-64 flex flex-col h-full bg-white border-r border-neutral-200 select-none">
      {/* Brand Header */}
      <Link
        to="/"
        onClick={() => {
          if (onCloseMobile) onCloseMobile();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const mainEl = document.querySelector('main');
          if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="h-16 flex items-center px-5 border-b border-neutral-200 hover:bg-neutral-50/80 transition-colors"
        title="Go to Home"
      >
        <div className="flex flex-col truncate">
          <span className="font-brand font-black text-lg tracking-tight text-neutral-900 truncate">
            {settings.workshopName.split('–')[0].trim()}
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 -mt-0.5">
            Workshop Management
          </span>
        </div>
      </Link>

      {/* Nav Content */}
      <nav className="flex-1 overflow-y-auto p-3.5 space-y-5">
        {visibleSections.map((sec, idx) => (
          <div key={idx}>
            {sec.title && (
              <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                {sec.title}
              </div>
            )}
            <div className="space-y-0.5">
              {sec.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={navLinkClass}
                  end={item.to === '/'}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-neutral-500 group-hover:text-neutral-900'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Workshop Location & Info footer */}
      <div className="p-3.5 border-t border-neutral-200 bg-neutral-50/70 text-xs text-neutral-500">
        <div className="font-semibold text-neutral-700 truncate mb-0.5">
          {settings.city}, {settings.state}
        </div>
        <p className="text-[11px] text-neutral-400 truncate">{settings.phone}</p>
      </div>
    </aside>
  );
};
