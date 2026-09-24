import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ModuleRouteGuard } from './components/common/ModuleRouteGuard';

// Pages
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { VehicleListPage } from './modules/vehicles/VehicleListPage';
import { VehicleDetailPage } from './modules/vehicles/VehicleDetailPage';
import { ServiceHistoryPage } from './modules/history/ServiceHistoryPage';
import { CustomerListPage } from './modules/customers/CustomerListPage';
import { CustomerDetailPage } from './modules/customers/CustomerDetailPage';
import { JobCardListPage } from './modules/jobs/JobCardListPage';
import { JobCardDetailPage } from './modules/jobs/JobCardDetailPage';
import { RecommendationsPage } from './modules/recommendations/RecommendationsPage';
import { ReportsPage } from './modules/reports/ReportsPage';
import { UsersPage } from './modules/users/UsersPage';
import { SettingsPage } from './modules/settings/SettingsPage';
import { AuditLogPage } from './modules/audit/AuditLogPage';
import { BillingPlaceholderPage } from './modules/billing/BillingPlaceholderPage';
import { InventoryPlaceholderPage } from './modules/inventory/InventoryPlaceholderPage';
import { RemindersPage } from './modules/reminders/RemindersPage';

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AppShell>
              <Routes>
                {/* Dashboard: view_dashboard */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute action="view_dashboard">
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Vehicles & Lifetime Service History: view_vehicles */}
                <Route
                  path="/vehicles"
                  element={
                    <ProtectedRoute action="view_vehicles">
                      <VehicleListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vehicles/:id"
                  element={
                    <ProtectedRoute action="view_vehicles">
                      <VehicleDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute action="view_vehicles">
                      <ServiceHistoryPage />
                    </ProtectedRoute>
                  }
                />

                {/* Customers: view_customers */}
                <Route
                  path="/customers"
                  element={
                    <ProtectedRoute action="view_customers">
                      <CustomerListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customers/:id"
                  element={
                    <ProtectedRoute action="view_customers">
                      <CustomerDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Job Cards / Visits: view_jobs */}
                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute action="view_jobs">
                      <JobCardListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs/:id"
                  element={
                    <ProtectedRoute action="view_jobs">
                      <JobCardDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Recommendations: view_recommendations */}
                <Route
                  path="/recommendations"
                  element={
                    <ProtectedRoute action="view_recommendations">
                      <RecommendationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Reports: view_reports */}
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute action="view_reports">
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Management & Access */}
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute action="manage_users">
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/audit"
                  element={
                    <ProtectedRoute action="view_audit_logs">
                      <AuditLogPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute action="manage_settings">
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Modular / Optional Feature Pages guarded by ModuleRouteGuard */}
                <Route
                  path="/billing"
                  element={
                    <ModuleRouteGuard moduleKey="billing">
                      <BillingPlaceholderPage />
                    </ModuleRouteGuard>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <ModuleRouteGuard moduleKey="inventory">
                      <InventoryPlaceholderPage />
                    </ModuleRouteGuard>
                  }
                />
                <Route
                  path="/reminders"
                  element={
                    <ModuleRouteGuard moduleKey="serviceReminders">
                      <ProtectedRoute action="view_vehicles">
                        <RemindersPage />
                      </ProtectedRoute>
                    </ModuleRouteGuard>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
