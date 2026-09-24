import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, ShieldCheck, UserCheck, ChevronDown, Wrench, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { UserRole } from '../../types/user';
import { QuickSearchModal } from '../common/QuickSearchModal';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenNewJobModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu, onOpenNewJobModal }) => {
  const { currentUser, setCurrentUserRole, can } = useAuth();
  const { settings } = useSettings();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roles: UserRole[] = ['Super Admin', 'Admin', 'Editor', 'Viewer'];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between h-14 md:h-16 px-4 sm:px-6 gap-2">
          {/* Left: Mobile hamburger & Workshop Brand for mobile */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={onOpenMobileMenu}
              className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 md:hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200 shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                const mainEl = document.querySelector('main');
                if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 md:hidden hover:opacity-85 transition-opacity min-w-0"
              title="Go to Home"
            >
              <div className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center text-white shrink-0">
                <Wrench className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-bold text-sm tracking-tight text-neutral-900 truncate max-w-[130px] sm:max-w-[200px]">
                {settings.workshopName.split('–')[0].trim()}
              </span>
            </Link>
          </div>

          {/* Desktop Middle: Prominent Global Search Bar (Hidden on mobile, placed below company name on mobile) */}
          <div className="hidden md:block flex-1 max-w-xl mx-4 lg:mx-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-sm bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/90 rounded-lg text-neutral-500 transition-all text-left shadow-2xs group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0" />
                <span className="truncate">Search reg no. (KA-01...), customer, job card...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium text-neutral-500 bg-white rounded border border-neutral-200 shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions & User Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {can('manage_jobs') && (
              <button
                onClick={onOpenNewJobModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">New Job Card</span>
                <span className="sm:hidden">Job</span>
              </button>
            )}

            {/* Interactive Role Switcher Dropdown (Allows testing permissions easily) */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 rounded-md transition-colors"
                title="Current User & Role"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="font-medium text-neutral-800 max-w-[75px] sm:max-w-none truncate">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              </button>

            {isRoleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50 text-xs animate-in fade-in duration-100">
                  <div className="px-3 py-2 border-b border-neutral-100 bg-neutral-50">
                    <p className="font-semibold text-neutral-800">{currentUser.name}</p>
                    <p className="text-[11px] text-neutral-500 font-mono truncate">{currentUser.email}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">Role: {currentUser.role}</p>
                  </div>
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Switch Role:
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setCurrentUserRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                        currentUser.role === r ? 'font-semibold text-neutral-900 bg-neutral-50' : 'text-neutral-600'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <UserCheck className={`w-3.5 h-3.5 ${currentUser.role === r ? 'text-neutral-900' : 'text-transparent'}`} />
                        {r}
                      </span>
                      {currentUser.role === r && (
                        <span className="text-[10px] text-neutral-400">Active</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar: Positioned below company name & fits mobile frame cleanly */}
        <div className="block md:hidden px-4 pb-2.5 pt-0.5">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/90 rounded-lg text-neutral-500 transition-all text-left shadow-2xs group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0" />
              <span className="truncate">Search reg no. (KA-01...), customer, job...</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium shrink-0 ml-1.5 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
              ⌘K
            </span>
          </button>
        </div>
      </header>

      {/* Quick Search Modal */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
