import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileNav } from './MobileNav';
import { QuickSearchModal } from '../common/QuickSearchModal';
import { JobCardCreateModal } from '../../modules/jobs/JobCardCreateModal';
import { X } from 'lucide-react';

interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);

  // Global keyboard shortcut: Cmd+K or Ctrl+K or / to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsQuickSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full bg-neutral-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer (Menu / More) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl">
            <div className="absolute top-2 right-2 p-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-700"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopHeader
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewJobModal={() => setIsNewJobModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {children || <Outlet />}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav onOpenMoreMenu={() => setIsMobileMenuOpen(true)} />
      </div>

      {/* Global Quick Search Modal */}
      <QuickSearchModal isOpen={isQuickSearchOpen} onClose={() => setIsQuickSearchOpen(false)} />

      {/* New Job Card Modal */}
      <JobCardCreateModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        onCreated={() => {
          setIsNewJobModalOpen(false);
          // Let page refresh or update if on job list
          window.dispatchEvent(new CustomEvent('workshop_job_created'));
        }}
      />
    </div>
  );
};
