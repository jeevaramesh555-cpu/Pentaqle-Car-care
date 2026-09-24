import { Vehicle } from './vehicle';
import { Customer } from './customer';
import { RecommendationPriority } from './recommendation';

export interface ServiceReminderItem {
  vehicle: Vehicle;
  owner?: Customer;
  reason: string;
  detail: string;
  dueKm?: number;
  priority: RecommendationPriority;
  lastVisitDate: string;
}
