import { Recommendation } from '../types/recommendation';

export const initialRecommendations: Recommendation[] = [
  // Recommendation from previous Innova Visit (JOB-000121) which is now resolved!
  {
    id: 'REC-000001',
    jobId: 'JOB-000121',
    vehicleId: 'VEH-000001',
    recommendation: 'Front brake discs showing grooving and wear; check disc thickness and replace with next pad renewal around 90,000–92,000 km',
    priority: 'High',
    recommendedAtKm: 84610,
    recommendedNextKm: 92000,
    recommendedDate: '2025-11-19',
    status: 'Completed',
    resolutionNotes: 'Customer returned at 91,220 km (JOB-000128). Replaced both front disc rotors and Brembo pads.',
    resolvedInJobId: 'JOB-000128',
    notes: 'Successfully tracked and resolved during visit JOB-000128.',
  },

  // Active pending recommendation on Toyota Innova Crysta (VEH-000001)
  {
    id: 'REC-000002',
    jobId: 'JOB-000128',
    vehicleId: 'VEH-000001',
    recommendation: '12V Exide battery health tested at 68% CCA; consider proactive replacement before monsoon highway travel',
    priority: 'Medium',
    recommendedAtKm: 91220,
    recommendedNextKm: 95000,
    recommendedDate: '2026-09-24',
    status: 'Pending',
    notes: 'Customer deferred today; alert service advisor on next visit.',
  },

  // Recommendation on Swift (VEH-000002)
  {
    id: 'REC-000003',
    jobId: 'JOB-000127',
    vehicleId: 'VEH-000002',
    recommendation: 'Clutch plate and pressure plate overhaul needed. Avoid aggressive clutch slipping.',
    priority: 'High',
    recommendedAtKm: 58900,
    recommendedNextKm: 59500,
    recommendedDate: '2026-09-24',
    status: 'Pending',
    notes: 'Quotation sent to client Rajesh Sharma.',
  },

  // Recommendation on Tata Nexon (VEH-000003)
  {
    id: 'REC-000004',
    jobId: 'JOB-000125',
    vehicleId: 'VEH-000003',
    recommendation: 'Front tyres tread depth is 3.1mm; will need tyre replacement at approximately 50,000 km',
    priority: 'Medium',
    recommendedAtKm: 45100,
    recommendedNextKm: 50000,
    recommendedDate: '2026-09-23',
    status: 'Pending',
    notes: 'Advised client Priya Nair during vehicle handover.',
  },

  // Recommendation on Honda City (VEH-000005)
  {
    id: 'REC-000005',
    jobId: 'JOB-000129',
    vehicleId: 'VEH-000005',
    recommendation: 'Spark plugs due for scheduled replacement at 40,000 km periodic service',
    priority: 'Low',
    recommendedAtKm: 36500,
    recommendedNextKm: 40000,
    recommendedDate: '2026-09-21',
    status: 'Pending',
    notes: 'Iridium plugs recommended for 1.5 i-VTEC.',
  },
];
