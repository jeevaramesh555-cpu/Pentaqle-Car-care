import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { PartUsage } from '../../../types/part';
import { formatOdometer, formatDate } from '../../../utils/formatters';

interface VehiclePartsHistoryProps {
  parts: PartUsage[];
}

export const VehiclePartsHistory: React.FC<VehiclePartsHistoryProps> = ({ parts }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">
            Lifetime Parts Replacement Registry
          </h3>
          <p className="text-xs text-neutral-500">
            All physical components replaced, repaired, or installed across all workshop visits
          </p>
        </div>
        <span className="text-xs font-mono font-medium px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
          {parts.length} Parts Logged
        </span>
      </div>

      {parts.length === 0 ? (
        <div className="p-12 text-center">
          <Package className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <p className="text-xs text-neutral-500">
            No parts replacement records on file for this vehicle.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-neutral-200">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3">Part Name</th>
                <th className="px-5 py-3">Brand & Code</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3 font-mono text-right">Odometer</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Job Card</th>
                <th className="px-5 py-3">Warranty / Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {parts.map((part) => (
                <tr key={part.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-neutral-900">{part.partName}</td>
                  <td className="px-5 py-3.5 text-neutral-700">
                    <span className="font-medium">{part.brand}</span>
                    {part.partNumber && (
                      <span className="block font-mono text-[11px] text-neutral-400">
                        {part.partNumber}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                      {part.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-neutral-900 font-medium">
                    {formatOdometer(part.odometerAtReplacement)}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">
                    {formatDate(part.replacementDate)}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => navigate(`/jobs/${part.jobId}`)}
                      className="font-mono text-xs text-neutral-800 hover:underline"
                    >
                      {part.jobId}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">
                    {part.warrantyNotes || 'Standard OEM'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
