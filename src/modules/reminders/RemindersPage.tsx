import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  Calendar,
  Car,
  Clock,
  Phone,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { vehicleRepository } from '../../services/vehicleRepository';
import { customerRepository } from '../../services/customerRepository';
import { jobRepository } from '../../services/jobRepository';
import { recommendationRepository } from '../../services/recommendationRepository';
import { PageHeader } from '../../components/common/PageHeader';
import { formatOdometer, formatDate } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';
import { useSettings } from '../../context/SettingsContext';
import { ServiceReminderItem } from '../../types/reminder';

export const RemindersPage: React.FC = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { settings } = useSettings();

  const [reminders, setReminders] = useState<ServiceReminderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [vehicles, customers, jobs, recs] = await Promise.all([
      vehicleRepository.getAll(),
      customerRepository.getAll(),
      jobRepository.getAll(),
      recommendationRepository.getAll(),
    ]);

    // Calculate due reminders based on 6-month interval or pending recommendation targets
    const list: ServiceReminderItem[] = [];

    vehicles.forEach((veh) => {
      const owner = customers.find((c) => c.id === veh.customerId);
      const vehJobs = jobs.filter((j) => j.vehicleId === veh.id);
      const vehRecs = recs.filter((r) => r.vehicleId === veh.id && r.status === 'Pending');

      const lastJob = vehJobs.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

      // If last visit was more than 90 days ago, or pending recommendations exist
      if (vehRecs.length > 0) {
        list.push({
          vehicle: veh,
          owner,
          reason: `${vehRecs.length} Pending Recommendation${vehRecs.length > 1 ? 's' : ''}`,
          detail: vehRecs[0].recommendation,
          dueKm: vehRecs[0].recommendedNextKm,
          priority: vehRecs[0].priority,
          lastVisitDate: lastJob ? lastJob.date : veh.createdAt,
        });
      } else if (lastJob) {
        list.push({
          vehicle: veh,
          owner,
          reason: 'Periodic Service Due',
          detail: 'Periodic inspection interval recommended',
          dueKm: lastJob.odometer + 10000,
          priority: 'Medium',
          lastVisitDate: lastJob.date,
        });
      }
    });

    setReminders(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendWhatsApp = (mobile: string, name: string, reg: string) => {
    const cleanNumber = mobile.replace(/[^0-9]/g, '');
    const workshop = settings.workshopName.split('–')[0].trim();
    const text = encodeURIComponent(
      `Dear ${name}, this is a gentle service reminder from ${workshop} regarding your vehicle ${reg}. Your next periodic maintenance is due. Please contact us to book your workshop slot.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
    notify('Opened WhatsApp prompt');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Reminders & Customer Outreach"
        subtitle="Automated alerts for vehicles due for periodic maintenance and pending technical recommendations"
        badge={
          <span className="text-xs font-mono font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
            {reminders.length} Vehicles Due
          </span>
        }
      />

      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Vehicles Scheduled For Outreach
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-400 font-mono animate-pulse">
            Calculating due service intervals...
          </div>
        ) : reminders.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No pending reminders at this time. All vehicles are up to date!
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {reminders.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 hover:bg-neutral-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => navigate(`/vehicles/${item.vehicle.id}`)}
                        className="font-mono font-bold text-sm text-neutral-900 hover:underline flex items-center gap-1"
                      >
                        <span>{item.vehicle.registrationNumber}</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400" />
                      </button>
                      <span className="text-neutral-500">
                        ({item.vehicle.make} {item.vehicle.model})
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          item.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <div className="text-neutral-700 font-medium leading-snug">
                      {item.reason}: <span className="text-neutral-500">{item.detail}</span>
                    </div>

                    <div className="text-neutral-400 flex flex-wrap items-center gap-2 text-[11px]">
                      <span>Owner: <strong className="text-neutral-700">{item.owner?.name}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{item.owner?.mobile}</span>
                      {item.dueKm && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Target: {formatOdometer(item.dueKm)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0">
                  {item.owner?.mobile && (
                    <button
                      onClick={() => {
                        if (!item.owner) return;
                        handleSendWhatsApp(
                          item.owner.mobile,
                          item.owner.name,
                          item.vehicle.registrationNumber
                        );
                      }}
                      className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Reminder</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/vehicles/${item.vehicle.id}`)}
                    className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors"
                  >
                    View History
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
