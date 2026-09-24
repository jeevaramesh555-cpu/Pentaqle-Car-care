import { Complaint } from '../types/complaint';

export const initialComplaints: Complaint[] = [
  // Complaints for Innova Visit 1 (JOB-000102)
  {
    id: 'CMP-000001',
    jobId: 'JOB-000102',
    complaint: 'Routine 60,000 km periodic service required',
    category: 'General / Periodic',
    priority: 'Medium',
    status: 'Resolved',
    technicianNotes: 'Carried out full synthetic oil service and 40-point safety check.',
  },
  {
    id: 'CMP-000002',
    jobId: 'JOB-000102',
    complaint: 'Windshield wiper judder and streak marks',
    category: 'Body & Trim',
    priority: 'Low',
    status: 'Resolved',
    technicianNotes: 'Wiper blades worn out. Replaced wiper rubber inserts.',
  },

  // Complaints for Innova Visit 2 (JOB-000115)
  {
    id: 'CMP-000003',
    jobId: 'JOB-000115',
    complaint: 'High pitched squeaking noise when applying brakes at 30-50 km/h',
    category: 'Brakes',
    priority: 'High',
    status: 'Resolved',
    technicianNotes: 'Front pads worn down to 2mm wear indicator. Discs deglazed.',
  },

  // Complaints for Innova Visit 3 (JOB-000121)
  {
    id: 'CMP-000004',
    jobId: 'JOB-000121',
    complaint: 'Dull thud sound from rear underbody while going over speed breakers',
    category: 'Suspension',
    priority: 'Medium',
    status: 'Resolved',
    technicianNotes: 'Rear anti-roll bar stabilizer bush cracked. Replaced both sides.',
  },
  {
    id: 'CMP-000005',
    jobId: 'JOB-000121',
    complaint: 'Scheduled 80k periodic engine maintenance',
    category: 'General / Periodic',
    priority: 'Medium',
    status: 'Resolved',
    technicianNotes: 'Replaced engine oil, oil filter, air filter, and fuel filter.',
  },

  // Complaints for Innova Current Visit (JOB-000128) - REPEAT COMPLAINT referencing JOB-000115!
  {
    id: 'CMP-000006',
    jobId: 'JOB-000128',
    complaint: 'Brake noise and vibration started again after previous pad replacement on highway braking',
    category: 'Brakes',
    priority: 'Urgent',
    status: 'Diagnosed',
    technicianNotes: 'Discs were not replaced in JOB-000115, now disc runout exceeds 0.08mm and thickness is 23.6mm (below 24.0mm safety limit). New rotors required.',
    relatedPreviousJobId: 'JOB-000115', // CRITICAL: References previous job!
  },
  {
    id: 'CMP-000007',
    jobId: 'JOB-000128',
    complaint: 'Steering pulls slightly towards the left at highway speeds (80+ km/h)',
    category: 'Steering',
    priority: 'Medium',
    status: 'Diagnosed',
    technicianNotes: 'Left front toe out by +1.5 degrees. Needs 4-wheel alignment and camber check.',
  },

  // Complaints for other jobs
  {
    id: 'CMP-000008',
    jobId: 'JOB-000125',
    complaint: 'Periodic 45,000 km service & check slight diesel engine clatter during cold morning start',
    category: 'Engine',
    priority: 'Medium',
    status: 'Resolved',
    technicianNotes: 'Glow plug circuit tested good. Fuel injector cleaner applied. Cold start smooth.',
  },
  {
    id: 'CMP-000009',
    jobId: 'JOB-000126',
    complaint: 'ADAS warning lamp illuminated intermittently on highway; squeak from front right strut',
    category: 'Electrical',
    priority: 'High',
    status: 'Reported',
    technicianNotes: 'Scanning front radar camera alignment and inspecting strut mount bearing.',
  },
  {
    id: 'CMP-000010',
    jobId: 'JOB-000127',
    complaint: 'Clutch pedal stiff to depress, vehicle shudders when starting on uphill inclines',
    category: 'Transmission & Clutch',
    priority: 'High',
    status: 'Diagnosed',
    technicianNotes: 'Clutch release bearing and pressure plate worn. Recommended clutch overhaul kit.',
  },
  {
    id: 'CMP-000011',
    jobId: 'JOB-000129',
    complaint: 'Cabin cooling very weak in peak afternoon sun',
    category: 'Air Conditioning',
    priority: 'Medium',
    status: 'Resolved',
    technicianNotes: 'Cabin filter was 80% choked with dust. R134a refrigerant was at 320g instead of 450g. Evacuated, pressure tested and recharged.',
  },
  {
    id: 'CMP-000012',
    jobId: 'JOB-000130',
    complaint: 'Metallic rattling click inside steering wheel when driving on paved cobblestones',
    category: 'Steering',
    priority: 'Medium',
    status: 'Diagnosed',
    technicianNotes: 'Classic MDPS / EPS flexible rubber steering column bush disintegrated. Waiting for genuine Hyundai bush part.',
  },
];
