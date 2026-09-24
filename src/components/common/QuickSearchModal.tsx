import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Car, User as UserIcon, FileText, ArrowRight, X, Clock, AlertCircle } from 'lucide-react';
import { searchService, SearchResults } from '../../services/searchService';
import { formatOdometer, formatDate } from '../../utils/formatters';
import { StatusBadge } from './StatusBadge';
import { useSettings } from '../../context/SettingsContext';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const { settings } = useSettings();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults>({ customers: [], vehicles: [], jobCards: [] });
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    let active = true;
    if (!query.trim()) {
      setResults({ customers: [], vehicles: [], jobCards: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      const res = await searchService.executeSearch(query);
      if (active) {
        setResults(res);
        setIsSearching(false);
      }
    }, 150);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results.customers.length + results.vehicles.length + results.jobCards.length;

  const handleSelectVehicle = (id: string) => {
    onClose();
    navigate(`/vehicles/${id}`);
  };

  const handleSelectCustomer = (id: string) => {
    onClose();
    navigate(`/customers/${id}`);
  };

  const handleSelectJobCard = (id: string) => {
    onClose();
    navigate(`/jobs/${id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-20 px-2 sm:px-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 bg-neutral-50/50">
          <Search className="w-5 h-5 text-neutral-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search registration (e.g. KA-01), customer, phone, chassis, job card..."
            className="w-full bg-transparent text-sm sm:text-base text-neutral-900 placeholder-neutral-400 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 rounded-md mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 bg-neutral-200/80 rounded border border-neutral-300">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-5 flex-1 divide-y divide-neutral-100">
          {!query.trim() && (
            <div className="py-8 text-center">
              <Car className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs text-neutral-500 font-medium">Quick search tip</p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-0.5">
                Type vehicle registration number to instantly inspect lifetime service history and previous complaints.
              </p>
            </div>
          )}

          {query.trim() && totalResults === 0 && !isSearching && (
            <div className="py-10 text-center">
              <AlertCircle className="w-7 h-7 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-700">No records found</p>
              <p className="text-xs text-neutral-400 mt-1">
                No matching vehicles, customers, or job cards for "{query}"
              </p>
            </div>
          )}

          {/* Group 1: Vehicles */}
          {results.vehicles.length > 0 && (
            <div className="pt-2 first:pt-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" />
                  Vehicles ({results.vehicles.length})
                </span>
                <span className="text-[11px] text-neutral-400">Click to view lifetime history</span>
              </div>
              <div className="space-y-1.5">
                {results.vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelectVehicle(v.id)}
                    className="w-full text-left p-3 rounded-lg border border-neutral-200/80 hover:border-neutral-900/30 hover:bg-neutral-50 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-neutral-900 tracking-wider text-sm bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          {v.registrationNumber}
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm">
                          {v.make} {v.model}
                        </span>
                        {v.variant && <span className="text-xs text-neutral-500">{v.variant}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-500">
                        <span>Owner: <strong className="text-neutral-700 font-medium">{v.customerName}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{formatOdometer(v.currentOdometer)}</span>
                        {v.lastVisitDate && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Last visit: {formatDate(v.lastVisitDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group 2: Customers */}
          {results.customers.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5" />
                  Customers ({results.customers.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {results.customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCustomer(c.id)}
                    className="w-full text-left p-3 rounded-lg border border-neutral-200/80 hover:border-neutral-900/30 hover:bg-neutral-50 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 text-sm">{c.name}</span>
                        <span className="text-xs font-mono text-neutral-400">{c.id}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                        <span className="font-mono">{c.mobile}</span>
                        <span aria-hidden="true">·</span>
                        <span>{c.city}</span>
                        <span aria-hidden="true">·</span>
                        <span>{c.visitCount} visits</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group 3: Job Cards */}
          {results.jobCards.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Job Cards ({results.jobCards.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {results.jobCards.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => handleSelectJobCard(j.id)}
                    className="w-full text-left p-3 rounded-lg border border-neutral-200/80 hover:border-neutral-900/30 hover:bg-neutral-50 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-neutral-900 text-sm">{j.id}</span>
                        <StatusBadge status={j.status} size="sm" />
                        <span className="font-mono text-xs text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded">
                          {j.regNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                        <span>{j.customerName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{j.model}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          {formatDate(j.date)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span>Global Search ({settings.workshopName.split('–')[0].trim()} Lifetime Archive)</span>
          <span className="text-[11px] text-neutral-400">Press Esc to dismiss</span>
        </div>
      </div>
    </div>
  );
};
