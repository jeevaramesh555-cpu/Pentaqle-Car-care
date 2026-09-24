import React from 'react';
import { FullJobCardDetail } from '../../../services/jobRepository';
import { WorkshopSettings } from '../../../types/settings';
import { formatDate, formatOdometer, formatIndianRegNumber } from '../../../utils/formatters';

interface PrintableJobSheetProps {
  details: FullJobCardDetail;
  settings: WorkshopSettings;
}

export const PrintableJobSheet: React.FC<PrintableJobSheetProps> = ({ details, settings }) => {
  const { job, customer, vehicle, complaints, inspections, services, parts, recommendations } =
    details;

  return (
    <div className="hidden print:block print:p-6 bg-white text-neutral-900 font-sans text-[11px] leading-normal">
      {/* Workshop Header & Document Title */}
      <div className="border-b-2 border-neutral-900 pb-3 mb-3 flex justify-between items-start">
        <div className="max-w-[65%]">
          <h1 className="text-xl font-bold uppercase tracking-tight text-neutral-900">
            {settings.workshopName || 'AUTO CLINIC'}
          </h1>
          {settings.tagline && (
            <p className="text-[11px] font-medium text-neutral-700">{settings.tagline}</p>
          )}
          <p className="text-[10px] text-neutral-600 mt-1">
            {[settings.address, settings.city, settings.state, settings.pin]
              .filter(Boolean)
              .join(', ')}
          </p>
          <div className="flex flex-wrap gap-x-3 text-[10px] text-neutral-600 mt-0.5">
            {settings.phone && <span>Tel: {settings.phone}</span>}
            {settings.whatsApp && <span>WA: {settings.whatsApp}</span>}
            {settings.email && <span>Email: {settings.email}</span>}
            {settings.gstin && <span>GSTIN: {settings.gstin}</span>}
          </div>
        </div>

        <div className="text-right">
          <div className="inline-block px-3 py-1 bg-neutral-900 text-white font-mono font-bold text-sm rounded">
            {job.id}
          </div>
          <p className="text-[10px] font-bold text-neutral-800 uppercase mt-1">
            Status: <span className="text-neutral-900">{job.status}</span>
          </p>
          <p className="text-[10px] text-neutral-600">Intake: {formatDate(job.date)}</p>
          {job.expectedCompletionDate && (
            <p className="text-[10px] text-neutral-600">
              Promised: {formatDate(job.expectedCompletionDate)}
            </p>
          )}
        </div>
      </div>

      {/* Customer & Vehicle Grid */}
      <div className="grid grid-cols-2 gap-3 border border-neutral-300 p-2.5 rounded mb-3 bg-neutral-50/50">
        <div>
          <h3 className="font-bold uppercase text-[9px] tracking-wider text-neutral-500 mb-1 border-b border-neutral-200 pb-0.5">
            Customer Information
          </h3>
          <p className="font-bold text-xs text-neutral-900">{customer?.name || 'Walk-in Customer'}</p>
          <p className="text-[10px]">
            Mobile: <strong>{customer?.mobile || 'N/A'}</strong>
            {customer?.alternateMobile ? ` / ${customer.alternateMobile}` : ''}
          </p>
          {customer?.email && <p className="text-[10px]">Email: {customer.email}</p>}
          <p className="text-[10px]">
            Address: {customer?.address ? `${customer.address}, ${customer?.city || ''}` : customer?.city || 'N/A'}
          </p>
        </div>

        <div>
          <h3 className="font-bold uppercase text-[9px] tracking-wider text-neutral-500 mb-1 border-b border-neutral-200 pb-0.5">
            Vehicle Information
          </h3>
          <p className="font-bold text-xs font-mono text-neutral-900">
            {vehicle?.registrationNumber ? formatIndianRegNumber(vehicle.registrationNumber) : 'N/A'}
          </p>
          <p className="font-medium text-[10px]">
            {vehicle?.make} {vehicle?.model} {vehicle?.variant} {vehicle?.year ? `(${vehicle.year})` : ''}
          </p>
          <p className="text-[10px] font-mono">
            Chassis/VIN: {vehicle?.vin || 'N/A'} {vehicle?.engineNumber ? `· Eng: ${vehicle.engineNumber}` : ''}
          </p>
          <p className="text-[10px]">
            Fuel: <strong>{vehicle?.fuelType || 'N/A'}</strong> · Trans: <strong>{vehicle?.transmission || 'N/A'}</strong>
            {vehicle?.color ? ` · Color: ${vehicle.color}` : ''}
          </p>
          <p className="text-[10px] mt-0.5">
            Intake Odometer: <strong>{formatOdometer(job.odometer)}</strong> · Fuel Tank Level: <strong>{job.fuelLevel}</strong>
          </p>
        </div>
      </div>

      {/* Workshop Responsibility Banner */}
      <div className="flex justify-between items-center text-[10px] bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200 mb-3">
        <span>Service Advisor: <strong>{job.serviceAdvisor || 'Unassigned'}</strong></span>
        <span>Assigned Technician: <strong>{job.assignedTechnician || 'Unassigned'}</strong></span>
        <span>Document: <strong>Official Workshop Job Card</strong></span>
      </div>

      {/* 1. Complaints */}
      <div className="mb-3">
        <h3 className="font-bold uppercase text-[10px] bg-neutral-100 px-2 py-1 border border-neutral-300 rounded-t flex justify-between">
          <span>1. Customer Reported Complaints ({complaints.length})</span>
          <span className="text-[9px] font-normal text-neutral-600">Reported on Intake</span>
        </h3>
        {complaints.length === 0 ? (
          <p className="italic text-neutral-500 p-2 border-x border-b border-neutral-300 rounded-b text-[10px]">
            No specific complaints reported by customer on intake
          </p>
        ) : (
          <table className="w-full text-left border-collapse border border-neutral-300 text-[10px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-300 text-[9px] uppercase text-neutral-600">
                <th className="py-1 px-2 w-6 text-center">#</th>
                <th className="py-1 px-2">Customer Complaint / Symptom</th>
                <th className="py-1 px-2 w-28">Category</th>
                <th className="py-1 px-2 w-20 text-center">Priority</th>
                <th className="py-1 px-2 w-24 text-center">Status</th>
                <th className="py-1 px-2 w-44">Technician Diagnostic Notes</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, idx) => (
                <tr key={c.id} className="border-b border-neutral-200">
                  <td className="py-1 px-2 text-center text-neutral-500">{idx + 1}</td>
                  <td className="py-1 px-2 font-medium">{c.complaint}</td>
                  <td className="py-1 px-2">{c.category}</td>
                  <td className="py-1 px-2 text-center">{c.priority}</td>
                  <td className="py-1 px-2 text-center">{c.status}</td>
                  <td className="py-1 px-2 text-neutral-600">{c.technicianNotes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 2. Inspection Findings */}
      <div className="mb-3">
        <h3 className="font-bold uppercase text-[10px] bg-neutral-100 px-2 py-1 border border-neutral-300 rounded-t flex justify-between">
          <span>2. Multi-Point Vehicle Health Inspection ({inspections.length})</span>
          <span className="text-[9px] font-normal text-neutral-600">Diagnostic Check</span>
        </h3>
        {inspections.length === 0 ? (
          <p className="italic text-neutral-500 p-2 border-x border-b border-neutral-300 rounded-b text-[10px]">
            No multi-point inspection items recorded
          </p>
        ) : (
          <table className="w-full text-left border-collapse border border-neutral-300 text-[10px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-300 text-[9px] uppercase text-neutral-600">
                <th className="py-1 px-2 w-6 text-center">#</th>
                <th className="py-1 px-2">Checkpoint / System</th>
                <th className="py-1 px-2 w-24">Category</th>
                <th className="py-1 px-2 w-20 text-center">Condition</th>
                <th className="py-1 px-2 w-24 text-center">Customer Approval</th>
                <th className="py-1 px-2 w-24">Inspector</th>
                <th className="py-1 px-2 w-44">Action / Notes</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((ins, idx) => (
                <tr key={ins.id} className="border-b border-neutral-200">
                  <td className="py-1 px-2 text-center text-neutral-500">{idx + 1}</td>
                  <td className="py-1 px-2 font-medium">{ins.finding}</td>
                  <td className="py-1 px-2">{ins.category}</td>
                  <td className="py-1 px-2 text-center font-semibold">{ins.severity}</td>
                  <td className="py-1 px-2 text-center">{ins.approvalStatus}</td>
                  <td className="py-1 px-2">{ins.technician}</td>
                  <td className="py-1 px-2 text-neutral-600">{ins.recommendation || ins.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 3. Services Performed */}
      <div className="mb-3">
        <h3 className="font-bold uppercase text-[10px] bg-neutral-100 px-2 py-1 border border-neutral-300 rounded-t flex justify-between">
          <span>3. Services / Work Carried Out ({services.length})</span>
          <span className="text-[9px] font-normal text-neutral-600">Labor & Execution</span>
        </h3>
        {services.length === 0 ? (
          <p className="italic text-neutral-500 p-2 border-x border-b border-neutral-300 rounded-b text-[10px]">
            No services or repair tasks logged yet
          </p>
        ) : (
          <table className="w-full text-left border-collapse border border-neutral-300 text-[10px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-300 text-[9px] uppercase text-neutral-600">
                <th className="py-1 px-2 w-6 text-center">#</th>
                <th className="py-1 px-2">Service Task Description</th>
                <th className="py-1 px-2 w-28">Category</th>
                <th className="py-1 px-2 w-28">Technician</th>
                <th className="py-1 px-2 w-24 text-center">Status</th>
                <th className="py-1 px-2 w-24 text-center">Date Completed</th>
                <th className="py-1 px-2 w-36">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, idx) => (
                <tr key={s.id} className="border-b border-neutral-200">
                  <td className="py-1 px-2 text-center text-neutral-500">{idx + 1}</td>
                  <td className="py-1 px-2 font-medium">{s.serviceName}</td>
                  <td className="py-1 px-2">{s.category}</td>
                  <td className="py-1 px-2">{s.technician}</td>
                  <td className="py-1 px-2 text-center">{s.status}</td>
                  <td className="py-1 px-2 text-center">{s.completedDate ? formatDate(s.completedDate) : 'In Progress'}</td>
                  <td className="py-1 px-2 text-neutral-600">{s.notes || s.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 4. Parts Installed */}
      <div className="mb-3">
        <h3 className="font-bold uppercase text-[10px] bg-neutral-100 px-2 py-1 border border-neutral-300 rounded-t flex justify-between">
          <span>4. Replacement Parts & Consumables ({parts.length})</span>
          <span className="text-[9px] font-normal text-neutral-600">Installed Items</span>
        </h3>
        {parts.length === 0 ? (
          <p className="italic text-neutral-500 p-2 border-x border-b border-neutral-300 rounded-b text-[10px]">
            No replacement parts or consumables used
          </p>
        ) : (
          <table className="w-full text-left border-collapse border border-neutral-300 text-[10px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-300 text-[9px] uppercase text-neutral-600">
                <th className="py-1 px-2 w-6 text-center">#</th>
                <th className="py-1 px-2">Part Description</th>
                <th className="py-1 px-2 w-28">Brand / Mfr</th>
                <th className="py-1 px-2 w-28 font-mono">Part No.</th>
                <th className="py-1 px-2 w-16 text-center">Qty</th>
                <th className="py-1 px-2 w-24 text-center">Action</th>
                <th className="py-1 px-2 w-36">Warranty / Notes</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p, idx) => (
                <tr key={p.id} className="border-b border-neutral-200">
                  <td className="py-1 px-2 text-center text-neutral-500">{idx + 1}</td>
                  <td className="py-1 px-2 font-medium">{p.partName}</td>
                  <td className="py-1 px-2">{p.brand}</td>
                  <td className="py-1 px-2 font-mono text-[9px]">{p.partNumber || '-'}</td>
                  <td className="py-1 px-2 text-center font-bold">{p.quantity}</td>
                  <td className="py-1 px-2 text-center">{p.action}</td>
                  <td className="py-1 px-2 text-neutral-600">{p.warrantyNotes || 'Standard'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 5. Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-3">
          <h3 className="font-bold uppercase text-[10px] bg-neutral-100 px-2 py-1 border border-neutral-300 rounded-t flex justify-between">
            <span>5. Advisor Recommendations for Future Visit ({recommendations.length})</span>
            <span className="text-[9px] font-normal text-neutral-600">Preventative Advice</span>
          </h3>
          <table className="w-full text-left border-collapse border border-neutral-300 text-[10px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-300 text-[9px] uppercase text-neutral-600">
                <th className="py-1 px-2 w-6 text-center">#</th>
                <th className="py-1 px-2">Recommended Maintenance Item</th>
                <th className="py-1 px-2 w-24 text-center">Priority</th>
                <th className="py-1 px-2 w-40">Due Mileage / Target</th>
                <th className="py-1 px-2 w-24 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((r, idx) => (
                <tr key={r.id} className="border-b border-neutral-200">
                  <td className="py-1 px-2 text-center text-neutral-500">{idx + 1}</td>
                  <td className="py-1 px-2 font-medium">{r.recommendation}</td>
                  <td className="py-1 px-2 text-center">{r.priority}</td>
                  <td className="py-1 px-2 font-medium">
                    {r.recommendedNextKm ? `Due at ${formatOdometer(r.recommendedNextKm)}` : 'Next Visit'}
                  </td>
                  <td className="py-1 px-2 text-center">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. Internal Workshop Notes if present */}
      {(job.internalNotes || job.completionNotes) && (
        <div className="mb-3 p-2 bg-neutral-50 border border-neutral-200 rounded text-[10px]">
          <p className="font-bold uppercase text-[9px] text-neutral-700 mb-0.5">Workshop Handover Notes:</p>
          {job.internalNotes && <p className="text-neutral-600">{job.internalNotes}</p>}
          {job.completionNotes && <p className="text-neutral-600 mt-0.5">Completion: {job.completionNotes}</p>}
        </div>
      )}

      {/* 7. Terms & Conditions */}
      <div className="border border-neutral-300 p-2 rounded mb-4 text-[9px] text-neutral-600 bg-neutral-50/50">
        <p className="font-bold uppercase text-neutral-700 text-[9px] mb-0.5">
          Repair Authorization Terms & Customer Acknowledgement:
        </p>
        <p>
          1. I hereby authorize the repair work and replacement parts listed in this Job Card. Workshop personnel are authorized to operate the vehicle on roads for inspection, diagnostics, road testing, or delivery.
        </p>
        <p>
          2. The customer is requested to remove all personal belongings from the vehicle. The workshop accepts no liability for loss or damage to personal valuables left inside.
        </p>
        <p>
          3. Delivery of the vehicle will be made upon full settlement of dues. Old/replaced parts not claimed on vehicle delivery will be disposed of.
        </p>
      </div>

      {/* 8. Signatures */}
      <div className="grid grid-cols-2 gap-8 pt-4 border-t border-neutral-400 text-center">
        <div>
          <div className="border-b border-neutral-400 pb-10 mb-1" />
          <p className="font-bold text-[10px] text-neutral-900">Customer Signature & Authorization</p>
          <p className="text-[9px] text-neutral-500">I agree to the repair scope and conditions above</p>
        </div>
        <div>
          <div className="border-b border-neutral-400 pb-10 mb-1" />
          <p className="font-bold text-[10px] text-neutral-900">Service Advisor / Authorized Signatory</p>
          <p className="text-[9px] text-neutral-500">{settings.workshopName || 'Pentaqle Garage'} Official Stamp & Sign</p>
        </div>
      </div>
    </div>
  );
};
