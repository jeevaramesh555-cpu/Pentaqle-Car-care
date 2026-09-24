import React, { useState, useEffect } from 'react';
import { Building2, Sliders, Shield, RotateCcw } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/common/PageHeader';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { WorkshopSettings } from '../../types/settings';

// Modular child components
import { WorkshopProfileSettings } from './components/WorkshopProfileSettings';
import { ModuleArchitectureSettings } from './components/ModuleArchitectureSettings';
import { IdentifierSettings } from './components/IdentifierSettings';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDemoData } = useSettings();
  const { notify } = useNotification();

  const [form, setForm] = useState<WorkshopSettings>(settings);
  const [activeTab, setActiveTab] = useState<'profile' | 'modules' | 'prefixes'>('profile');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    notify('Workshop settings saved successfully');
  };

  const handleModuleToggle = (moduleKey: keyof WorkshopSettings['modules']) => {
    if (moduleKey === 'coreWorkshop') return; // Cannot disable core
    const updated: WorkshopSettings = {
      ...form,
      modules: {
        ...form.modules,
        [moduleKey]: !form.modules[moduleKey],
      },
    };
    setForm(updated);
    updateSettings(updated);
    notify(
      `${String(moduleKey)} module is now ${
        updated.modules[moduleKey] ? 'Enabled' : 'Disabled'
      }`
    );
  };

  const handleDemoReset = async () => {
    await resetToDemoData();
    setIsResetModalOpen(false);
    notify('Demonstration dataset reset to initial state');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workshop & System Configuration"
        subtitle="Branding, operational prefixes, commercial deployment settings, and modular feature toggles"
        actions={
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
            <span>Reset Demo Data</span>
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'profile'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Workshop Profile & Identity</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'modules'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Module Architecture & Optional Features</span>
        </button>

        <button
          onClick={() => setActiveTab('prefixes')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'prefixes'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Identifier Prefixes & Numbering</span>
        </button>
      </div>

      {/* Tab 1: Workshop Profile */}
      {activeTab === 'profile' && (
        <WorkshopProfileSettings form={form} onChange={setForm} onSave={handleSave} />
      )}

      {/* Tab 2: Modular Architecture Toggles */}
      {activeTab === 'modules' && (
        <ModuleArchitectureSettings form={form} onToggle={handleModuleToggle} />
      )}

      {/* Tab 3: Prefixes & Numbering */}
      {activeTab === 'prefixes' && (
        <IdentifierSettings form={form} onChange={setForm} onSave={handleSave} />
      )}

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Demonstration Data"
        message="This will repopulate the application with the initial realistic dataset of customers, vehicles, and multi-visit lifetime histories for demonstration and training. All temporary changes will be replaced."
        confirmText="Confirm Reset"
        onConfirm={handleDemoReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
