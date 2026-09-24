import { InspectionFinding } from '../types/inspection';

export const initialInspectionFindings: InspectionFinding[] = [
  // For Innova Current Visit (JOB-000128)
  {
    id: 'INS-000001',
    jobId: 'JOB-000128',
    finding: 'Front brake rotor thickness measured at 23.6mm (Manufacturer minimum service limit is 24.0mm). Deep radial scoring observed.',
    category: 'Brakes',
    severity: 'Urgent',
    technician: 'Imran Khan',
    recommendation: 'Replace both front brake disc rotors and fit new ceramic pads to prevent rotor damage.',
    approvalStatus: 'Approved',
    notes: 'Customer Rajesh Sharma approved via phone after advisor explanation.',
  },
  {
    id: 'INS-000002',
    jobId: 'JOB-000128',
    finding: 'Front left wheel toe angle is -1.4° out of specification. Right side is within spec.',
    category: 'Steering & Suspension',
    severity: 'Attention',
    technician: 'Imran Khan',
    recommendation: 'Perform 4-wheel computerized wheel alignment and road test.',
    approvalStatus: 'Approved',
    notes: 'Included in job scope.',
  },
  {
    id: 'INS-000003',
    jobId: 'JOB-000128',
    finding: 'Exide 12V 70Ah battery health tested at 68% CCA (Cold Cranking Amps). Terminal has mild white sulfur buildup.',
    category: 'Electrical',
    severity: 'Attention',
    technician: 'Imran Khan',
    recommendation: 'Terminals cleaned and greased. Recommend replacement prior to upcoming monsoon long journeys.',
    approvalStatus: 'Declined',
    notes: 'Customer requested to defer battery replacement to next service.',
  },
  {
    id: 'INS-000004',
    jobId: 'JOB-000128',
    finding: 'All 4 tyres tread depth at 4.8mm - 5.2mm. Wear pattern is uniform after previous rotation.',
    category: 'Tyres & Wheels',
    severity: 'Good',
    technician: 'Imran Khan',
    recommendation: 'Tyres in good condition for next 15,000 km.',
    approvalStatus: 'Not Required',
    notes: 'Pressures set to 33 PSI cold.',
  },

  // For Swift (JOB-000127)
  {
    id: 'INS-000005',
    jobId: 'JOB-000127',
    finding: 'Clutch plate friction lining down to rivets. Flywheel has heat spots from slipping.',
    category: 'Transmission',
    severity: 'Urgent',
    technician: 'Imran Khan',
    recommendation: 'Full clutch kit replacement (Clutch Plate, Pressure Plate, Release Bearing) and flywheel surface skim.',
    approvalStatus: 'Pending',
    notes: 'Awaiting customer approval.',
  },

  // For XUV700 (JOB-000126)
  {
    id: 'INS-000006',
    jobId: 'JOB-000126',
    finding: 'Front radar sensor bracket loose by 2mm due to minor stone impact on highway.',
    category: 'Electrical / ADAS',
    severity: 'Urgent',
    technician: 'Imran Khan',
    recommendation: 'Re-align bracket and execute dynamic ADAS calibration protocol.',
    approvalStatus: 'Approved',
    notes: 'In progress.',
  },
];
