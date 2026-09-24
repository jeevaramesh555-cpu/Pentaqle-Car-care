import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Car, Users, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  onOpenMoreMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenMoreMenu }) => {
  const { can } = useAuth();

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 py-1.5 transition-colors ${
      isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-400 hover:text-neutral-600'
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-lg px-2 flex items-center justify-around h-16">
      {can('view_dashboard') && (
        <NavLink to="/" end className={itemClass}>
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Home</span>
        </NavLink>
      )}

      {can('view_jobs') && (
        <NavLink to="/jobs" className={itemClass}>
          <ClipboardList className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Jobs</span>
        </NavLink>
      )}

      {can('view_vehicles') && (
        <NavLink to="/vehicles" className={itemClass}>
          <Car className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Vehicles</span>
        </NavLink>
      )}

      {can('view_customers') && (
        <NavLink to="/customers" className={itemClass}>
          <Users className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Customers</span>
        </NavLink>
      )}

      <button
        onClick={onOpenMoreMenu}
        className="flex flex-col items-center justify-center flex-1 py-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <Menu className="w-5 h-5 mb-1" />
        <span className="text-[10px]">More</span>
      </button>
    </nav>
  );
};
