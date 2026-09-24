import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  User,
  Car,
  Clock,
  AlertCircle,
  Package,
} from 'lucide-react';
import { reportRepository } from '../../services/reportRepository';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatOdometer } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useSettings } from '../../context/SettingsContext';
import {
  ServiceHistoryReportRow,
  VehicleVisitsReportRow,
  PartsReplacementReportRow,
  RepeatComplaintsReportRow,
  PendingRecommendationsReportRow,
  TechnicianWorkReportRow,
} from '../../types/reportData';

type ReportRowType =
  | ServiceHistoryReportRow
  | VehicleVisitsReportRow
  | PartsReplacementReportRow
  | RepeatComplaintsReportRow
  | PendingRecommendationsReportRow
  | TechnicianWorkReportRow;

export const ReportsPage: React.FC = () => {
  const { can } = useAuth();
  const { notify } = useNotification();
  const { settings } = useSettings();

  const [activeReport, setActiveReport] = useState<
    'service' | 'visits' | 'parts' | 'repeats' | 'pending' | 'technician'
  >('service');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<ReportRowType[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    setLoading(true);
    const filter = { startDate: startDate || undefined, endDate: endDate || undefined };

    try {
      if (activeReport === 'service') {
        const data = await reportRepository.getServiceHistoryReport(filter);
        setReportData(data);
      } else if (activeReport === 'visits') {
        const data = await reportRepository.getVehicleVisitsReport(filter);
        setReportData(data);
      } else if (activeReport === 'parts') {
        const data = await reportRepository.getPartsReplacementReport(filter);
        setReportData(data);
      } else if (activeReport === 'repeats') {
        const data = await reportRepository.getRepeatComplaintsReport();
        setReportData(data);
      } else if (activeReport === 'pending') {
        const data = await reportRepository.getPendingRecommendationsReport();
        setReportData(data);
      } else if (activeReport === 'technician') {
        const data = await reportRepository.getTechnicianWorkReport();
        setReportData(data);
      }
    } catch {
      notify('Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [activeReport, startDate, endDate]);

  const handleExportCSV = () => {
    if (!reportData.length) {
      notify('No data to export', 'error');
      return;
    }

    const headers = Object.keys(reportData[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headers.join(','),
        ...reportData.map((row) => {
          const record = row as unknown as Record<string, unknown>;
          return headers
            .map((field) => `"${String(record[field] ?? '').replace(/"/g, '""')}"`)
            .join(',');
        }),
      ].join('\n');

    const workshopSlug = settings.workshopName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'workshop';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${workshopSlug}_${activeReport}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notify('Report exported to CSV');
  };

  const reportsList = [
    { id: 'service', label: 'Service History Report', desc: 'All executed repairs and maintenance operations' },
    { id: 'visits', label: 'Vehicle Visit Report', desc: 'Chronological workshop intake and delivery visits' },
    { id: 'parts', label: 'Parts Replacement Report', desc: 'Physical spare parts replaced, brands & warranties' },
    { id: 'repeats', label: 'Repeat Complaints Report', desc: 'Recurring customer problems and previous job links' },
    { id: 'pending', label: 'Pending Recommendations', desc: 'Follow-ups due for returning automobiles' },
    { id: 'technician', label: 'Technician Work Log', desc: 'Tasks completed by floor mechanics' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workshop Operational Reports"
        subtitle="Detailed service audit trails, part replacement summaries, and vehicle maintenance analytics"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-500" />
              <span>Print</span>
            </button>
            {can('export_reports') && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        }
      />

      {/* Report Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {reportsList.map((r) => {
          const isSelected = activeReport === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setActiveReport(r.id as any)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                  : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
              }`}
            >
              <div className="font-bold text-xs">{r.label}</div>
              <div
                className={`text-[10px] mt-1 line-clamp-2 ${
                  isSelected ? 'text-neutral-300' : 'text-neutral-400'
                }`}
              >
                {r.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Date Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-neutral-200 shadow-2xs text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span className="font-semibold text-neutral-700">Filter Range:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 bg-neutral-50 border border-neutral-200 rounded text-neutral-800 text-xs"
            />
            <span className="text-neutral-400 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 bg-neutral-50 border border-neutral-200 rounded text-neutral-800 text-xs"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="text-[11px] text-neutral-400 hover:text-neutral-900 underline ml-1"
            >
              Clear
            </button>
          )}
        </div>

        <span className="font-mono text-xs text-neutral-500">
          Showing {reportData.length} records
        </span>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-400 font-mono animate-pulse">
            Compiling report dataset...
          </div>
        ) : reportData.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No report data found for this selection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Dynamic Table based on Report Type */}
            {activeReport === 'service' && (
              <table className="w-full text-left text-xs divide-y divide-neutral-200">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Vehicle</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Service / Task</th>
                    <th className="px-5 py-3">Technician</th>
                    <th className="px-5 py-3 font-mono text-right">Odometer</th>
                    <th className="px-5 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {(reportData as ServiceHistoryReportRow[]).map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/70">
                      <td className="px-5 py-3 text-neutral-600">{formatDate(row.date)}</td>
                      <td className="px-5 py-3 font-mono font-bold text-neutral-900">
                        {row.regNumber}
                      </td>
                      <td className="px-5 py-3 font-medium text-neutral-800">{row.customerName}</td>
                      <td className="px-5 py-3 font-semibold text-neutral-900">{row.serviceName}</td>
                      <td className="px-5 py-3 text-neutral-600">{row.technician}</td>
                      <td className="px-5 py-3 text-right font-mono tabular-nums">
                        {formatOdometer(row.odometer)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <StatusBadge status={row.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'visits' && (
              <table className="w-full text-left text-xs divide-y divide-neutral-200">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3">Job ID</th>
                    <th className="px-5 py-3">Visit Date</th>
                    <th className="px-5 py-3">Vehicle</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3 font-mono text-right">Odometer</th>
                    <th className="px-5 py-3">Advisor</th>
                    <th className="px-5 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {(reportData as VehicleVisitsReportRow[]).map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/70">
                      <td className="px-5 py-3 font-mono font-bold text-neutral-900">{row.jobId}</td>
                      <td className="px-5 py-3 text-neutral-600">{formatDate(row.date)}</td>
                      <td className="px-5 py-3">
                        <span className="font-mono font-bold text-neutral-900">{row.regNumber}</span>
                        <span className="block text-[11px] text-neutral-400">{row.vehicleModel}</span>
                      </td>
                      <td className="px-5 py-3 font-medium text-neutral-800">{row.customerName}</td>
                      <td className="px-5 py-3 text-right font-mono tabular-nums">
                        {formatOdometer(row.odometer)}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">{row.serviceAdvisor}</td>
                      <td className="px-5 py-3 text-center">
                        <StatusBadge status={row.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'parts' && (
              <table className="w-full text-left text-xs divide-y divide-neutral-200">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3">Part Description</th>
                    <th className="px-5 py-3">Brand & Code</th>
                    <th className="px-5 py-3">Action</th>
                    <th className="px-5 py-3">Vehicle</th>
                    <th className="px-5 py-3 font-mono text-right">Odometer</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Warranty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {(reportData as PartsReplacementReportRow[]).map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/70">
                      <td className="px-5 py-3 font-semibold text-neutral-900">
                        {row.quantity}x {row.partName}
                      </td>
                      <td className="px-5 py-3 text-neutral-700">
                        {row.brand} {row.partNumber !== '-' && `(${row.partNumber})`}
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 border border-neutral-200">
                          {row.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono font-bold text-neutral-800">{row.regNumber}</td>
                      <td className="px-5 py-3 text-right font-mono tabular-nums">
                        {formatOdometer(row.odometer)}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">{formatDate(row.date)}</td>
                      <td className="px-5 py-3 text-neutral-600">{row.warranty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'repeats' && (
              <table className="w-full text-left text-xs divide-y divide-neutral-200">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3">Vehicle</th>
                    <th className="px-5 py-3">Repeat Complaint</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Current Job & Km</th>
                    <th className="px-5 py-3">Previous Job & Km</th>
                    <th className="px-5 py-3">Diagnosis Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {(reportData as RepeatComplaintsReportRow[]).map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/70">
                      <td className="px-5 py-3 font-mono font-bold text-neutral-900">{row.regNumber}</td>
                      <td className="px-5 py-3 font-semibold text-rose-900">{row.complaint}</td>
                      <td className="px-5 py-3 text-neutral-600">{row.category}</td>
                      <td className="px-5 py-3 font-mono">
                        {row.currentJobId} ({formatOdometer(row.currentOdometer)})
                      </td>
                      <td className="px-5 py-3 font-mono text-neutral-500">
                        {row.previousJobId} ({formatOdometer(row.previousOdometer)})
                      </td>
                      <td className="px-5 py-3 text-neutral-700">{row.technicianNotes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'pending' && (
              <table className="w-full text-left text-xs divide-y divide-neutral-200">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3">Vehicle</th>
                    <th className="px-5 py-3">Customer Phone</th>
                    <th className="px-5 py-3">Recommendation</th>
                    <th className="px-5 py-3 font-mono text-right">Target Due Km</th>
                    <th className="px-5 py-3">Logged Date</th>
                    <th className="px-5 py-3">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {(reportData as PendingRecommendationsReportRow[]).map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/70">
                      <td className="px-5 py-3 font-mono font-bold text-neutral-900">{row.regNumber}</td>
                      <td className="px-5 py-3 font-mono text-neutral-700">
                        {row.customerName} ({row.customerPhone})
                      </td>
                      <td className="px-5 py-3 font-medium text-neutral-800">{row.recommendation}</td>
                      <td className="px-5 py-3 text-right font-mono tabular-nums font-bold">
                        {formatOdometer(row.recommendedNextKm)}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">{formatDate(row.recommendedDate)}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {row.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'technician' && (
              <table className="w-full text-left text-xs divide-y divide-neutral-200">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3">Technician Name</th>
                    <th className="px-5 py-3 font-mono text-right">Total Operations</th>
                    <th className="px-5 py-3 font-mono text-right">Completed Tasks</th>
                    <th className="px-5 py-3 font-mono text-right">In Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {(reportData as TechnicianWorkReportRow[]).map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/70">
                      <td className="px-5 py-3 font-bold text-neutral-900">{row.technician}</td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-neutral-800">
                        {row.totalJobs}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-emerald-700 font-semibold">
                        {row.completed}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-sky-700 font-semibold">
                        {row.inProgress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
